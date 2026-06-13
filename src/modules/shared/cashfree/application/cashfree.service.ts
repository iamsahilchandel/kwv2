import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import {
  type Prisma,
  TransactionStatus,
  PaymentGroup,
} from '@/generated/prisma/client.js';
import { PrismaService } from '@/core/database/prisma.service.js';
import { PaymentGatewayException } from '@/common/exceptions/payment.exception.js';
import {
  CASHFREE_PORT,
  CashfreeWebhookPayload,
  type ICashfreePort,
} from './ports/cashfree.port.js';

interface CfOrder {
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_tags?: Prisma.InputJsonValue;
}

interface CfPayment {
  cf_payment_id: number | string;
  payment_status: TransactionStatus;
  payment_amount: number;
  payment_currency: string;
  payment_message?: string;
  payment_time?: string;
  bank_reference?: string;
  auth_id?: string;
  payment_method?: Prisma.InputJsonValue;
  payment_group?: PaymentGroup;
}

interface CfCustomer {
  customer_name?: string;
  customer_id?: string;
  customer_email?: string;
  customer_phone?: string;
}

interface CfGateway {
  gateway_name?: string;
  gateway_order_id?: string;
  gateway_payment_id?: string;
  gateway_settlement?: string;
  gateway_status_code?: string;
}

interface CfPaymentPayload {
  order: CfOrder;
  payment: CfPayment;
  customer_details?: CfCustomer;
  payment_gateway_details?: CfGateway;
  payment_offers?: Prisma.InputJsonValue;
  error_details?: { error_description?: string };
  event_time?: string;
  type: string;
}

interface CfRefund {
  cf_payment_id: number | string;
  cf_refund_id: number | string;
  refund_id: string;
  order_id: string;
  refund_amount: number;
  refund_currency: string;
  refund_status: string;
  status_description?: string;
}

interface CfRefundPayload {
  refund: CfRefund;
  event_time?: string;
  type: string;
}

interface CfAutoRefund {
  cf_payment_id: number | string;
  cf_refund_id: number | string;
  order_id: string;
  refund_amount: number;
  refund_currency: string;
  refund_status: string;
  status_description?: string;
  bank_reference?: string;
  refund_reason?: string;
}

interface CfAutoRefundPayload {
  auto_refund: CfAutoRefund;
  event_time?: string;
  type: string;
}

// Cashfree sometimes nests the event payload under a `data` key.
function unwrap<T>(raw: unknown): T {
  const obj = raw as Record<string, unknown>;
  return (obj['data'] !== undefined ? obj['data'] : obj) as T;
}

@Injectable()
export class CashfreeService {
  private readonly logger = new Logger(CashfreeService.name);

  constructor(
    @Inject(CASHFREE_PORT)
    private readonly cashfree: ICashfreePort,
    private readonly prisma: PrismaService,
  ) {}

  async processWebhook(signature: string, rawBody: string, timestamp: string) {
    this.logger.log('Processing Cashfree webhook');

    let webhookData: CashfreeWebhookPayload | undefined;
    try {
      webhookData = this.cashfree.verifyWebhook(signature, rawBody, timestamp);
    } catch (err) {
      this.logger.warn('Cashfree webhook signature verification failed', {
        error: (err as Error).message,
      });
      throw new BadRequestException('Invalid webhook signature');
    }

    if (!webhookData?.type || !webhookData?.object) {
      throw new BadRequestException('Invalid webhook data format');
    }

    this.logger.log('Cashfree webhook type received', {
      type: webhookData.type,
    });

    switch (webhookData.type) {
      case 'PAYMENT_SUCCESS_WEBHOOK':
        await this.processPaymentSuccess(webhookData.object);
        break;
      case 'PAYMENT_FAILED_WEBHOOK':
        await this.processPaymentFailure(webhookData.object);
        break;
      case 'PAYMENT_USER_DROPPED_WEBHOOK':
        await this.processUserDropped(webhookData.object);
        break;
      case 'REFUND_STATUS_WEBHOOK':
        await this.processRefund(webhookData.object);
        break;
      case 'AUTO_REFUND_STATUS_WEBHOOK':
        await this.processAutoRefund(webhookData.object);
        break;
      default:
        this.logger.warn('Unsupported Cashfree webhook type', {
          type: webhookData.type,
        });
        throw new BadRequestException(
          `Unsupported webhook type: ${webhookData.type}`,
        );
    }

    return { message: 'Webhook processed successfully' };
  }

  private async processPaymentSuccess(raw: unknown) {
    try {
      const {
        order,
        payment,
        customer_details,
        payment_gateway_details,
        payment_offers,
        event_time,
        type,
      } = unwrap<CfPaymentPayload>(raw);

      const paymentRecord = await this.prisma.payment.findFirst({
        where: { orderId: order.order_id },
      });

      if (paymentRecord?.enrollmentId) {
        await this.prisma.batchEnrollments.update({
          where: { id: paymentRecord.enrollmentId },
          data: { status: 'enrolled' },
        });

        // Link learner profile to the center on successful enrollment.
        // No compound unique constraint exists on this table, so we guard with findFirst.
        const existingMembership =
          await this.prisma.learnerProfileHasManyCenters.findFirst({
            where: {
              learnerProfileId: paymentRecord.learnerProfileId!,
              centerId: paymentRecord.centerId!,
            },
          });
        if (!existingMembership) {
          await this.prisma.learnerProfileHasManyCenters.create({
            data: {
              learnerProfileId: paymentRecord.learnerProfileId!,
              centerId: paymentRecord.centerId!,
            },
          });
        }

        this.logger.log('Enrollment activated', {
          enrollmentId: paymentRecord.enrollmentId,
        });
      }

      // Handle center onboarding payment
      const onboardingCenter = await this.prisma.center.findFirst({
        where: {
          onboardingPaymentOrderId: order.order_id,
        },
      });

      if (!paymentRecord && !onboardingCenter) {
        throw new PaymentGatewayException(
          `Payment record not found for order: ${order.order_id}`,
        );
      }

      // At least one is defined due to the guard above.
      const paymentId = (paymentRecord?.id ?? onboardingCenter?.id)!;

      await this.prisma.transaction.create({
        data: this.buildTransactionData(
          paymentId,
          order,
          payment,
          customer_details,
          payment_gateway_details,
          payment_offers,
          event_time,
          type,
        ),
      });

      if (paymentRecord) {
        await this.prisma.payment.update({
          where: { id: paymentRecord.id },
          data: {
            status: 'successful',
            paymentDate: payment.payment_time
              ? new Date(payment.payment_time)
              : new Date(),
            transactionId: String(payment.cf_payment_id),
            paymentMethod: payment.payment_group ?? 'other',
          },
        });
      }

      if (onboardingCenter) {
        await this.prisma.center.update({
          where: { id: onboardingCenter.id },
          data: {
            isOnboardingPaymentReceived: true,
            onboardingPaymentReceivedOn: payment.payment_time
              ? new Date(payment.payment_time)
              : new Date(),
            onboardingPaymentMethod: 'gateway',
            isOnboardingPaymentVerified: true,
            onboardingPaymentAmount: payment.payment_amount,
          },
        });
      }

      this.logger.log('Payment success processed', { orderId: order.order_id });
    } catch (err) {
      this.logger.error(
        'Error processing payment success',
        (err as Error).stack,
      );
      throw err;
    }
  }

  private async processPaymentFailure(raw: unknown) {
    try {
      const {
        order,
        payment,
        customer_details,
        error_details,
        payment_gateway_details,
        event_time,
        type,
      } = unwrap<CfPaymentPayload>(raw);

      const paymentRecord = await this.prisma.payment.findFirst({
        where: { orderId: order.order_id },
      });
      if (!paymentRecord) {
        throw new PaymentGatewayException(
          `Payment record not found for order: ${order.order_id}`,
        );
      }

      await this.prisma.transaction.create({
        data: {
          ...this.buildTransactionData(
            paymentRecord.id,
            order,
            payment,
            customer_details,
            payment_gateway_details,
            undefined,
            event_time,
            type,
          ),
          errorDetails: error_details,
        },
      });

      await this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: 'failed',
          paymentDate: payment.payment_time
            ? new Date(payment.payment_time)
            : new Date(),
          transactionId: String(payment.cf_payment_id),
          paymentMethod: payment.payment_group,
          notes: error_details?.error_description ?? payment.payment_message,
        },
      });

      this.logger.log('Payment failure processed', { orderId: order.order_id });
    } catch (err) {
      this.logger.error(
        'Error processing payment failure',
        (err as Error).stack,
      );
      throw err;
    }
  }

  private async processUserDropped(raw: unknown) {
    try {
      const { order, payment, customer_details, event_time, type } =
        unwrap<CfPaymentPayload>(raw);

      const paymentRecord = await this.prisma.payment.findFirst({
        where: { orderId: order.order_id },
      });
      if (!paymentRecord) {
        throw new PaymentGatewayException(
          `Payment record not found for order: ${order.order_id}`,
        );
      }

      await this.prisma.transaction.create({
        data: this.buildTransactionData(
          paymentRecord.id,
          order,
          payment,
          customer_details,
          null,
          undefined,
          event_time,
          type,
        ),
      });

      await this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: 'failed',
          paymentDate: payment.payment_time
            ? new Date(payment.payment_time)
            : new Date(),
          transactionId: String(payment.cf_payment_id),
          paymentMethod: payment.payment_group,
          notes: 'User dropped during payment process',
        },
      });

      this.logger.log('User-dropped payment processed', {
        orderId: order.order_id,
      });
    } catch (err) {
      this.logger.error(
        'Error processing user-dropped payment',
        (err as Error).stack,
      );
      throw err;
    }
  }

  private async processRefund(raw: unknown) {
    try {
      const { refund, event_time, type } = unwrap<CfRefundPayload>(raw);

      const paymentRecord = await this.prisma.payment.findFirst({
        where: { transactionId: String(refund.cf_payment_id) },
      });
      if (!paymentRecord) {
        throw new PaymentGatewayException(
          `Payment record not found for cf_payment_id: ${refund.cf_payment_id}`,
        );
      }

      await this.prisma.transaction.create({
        data: {
          paymentId: paymentRecord.id,
          orderId: refund.order_id,
          orderAmount: refund.refund_amount,
          cfPaymentId: String(refund.cf_payment_id),
          paymentStatus:
            refund.refund_status === 'SUCCESS'
              ? 'REFUND_SUCCESS'
              : 'REFUND_FAILED',
          paymentAmount: refund.refund_amount,
          paymentCurrency: refund.refund_currency,
          paymentMessage: refund.status_description,
          cfRefundId: String(refund.cf_refund_id),
          refundId: refund.refund_id,
          refundAmount: refund.refund_amount,
          refundCurrency: refund.refund_currency,
          refundStatus: refund.refund_status,
          eventTime: event_time ? new Date(event_time) : new Date(),
          eventType: type,
          webhookResponse: raw as Prisma.InputJsonValue,
        },
      });

      await this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          refundId: refund.refund_id,
          refundStatus: refund.refund_status,
          refundAmount: refund.refund_amount,
        },
      });

      this.logger.log('Refund processed', { refundId: refund.refund_id });
    } catch (err) {
      this.logger.error('Error processing refund', (err as Error).stack);
      throw err;
    }
  }

  private async processAutoRefund(raw: unknown) {
    try {
      const { auto_refund, event_time, type } =
        unwrap<CfAutoRefundPayload>(raw);

      const paymentRecord = await this.prisma.payment.findFirst({
        where: { transactionId: String(auto_refund.cf_payment_id) },
      });
      if (!paymentRecord) {
        throw new PaymentGatewayException(
          `Payment record not found for cf_payment_id: ${auto_refund.cf_payment_id}`,
        );
      }

      await this.prisma.transaction.create({
        data: {
          paymentId: paymentRecord.id,
          orderId: auto_refund.order_id,
          orderAmount: auto_refund.refund_amount,
          cfPaymentId: String(auto_refund.cf_payment_id),
          paymentStatus:
            auto_refund.refund_status === 'SUCCESS'
              ? 'AUTO_REFUND_SUCCESS'
              : 'AUTO_REFUND_FAILED',
          paymentAmount: auto_refund.refund_amount,
          paymentCurrency: auto_refund.refund_currency,
          paymentMessage: auto_refund.status_description,
          bankReference: auto_refund.bank_reference,
          cfRefundId: String(auto_refund.cf_refund_id),
          refundAmount: auto_refund.refund_amount,
          refundStatus: auto_refund.refund_status,
          eventTime: event_time ? new Date(event_time) : new Date(),
          eventType: type,
          webhookResponse: raw as Prisma.InputJsonValue,
        },
      });

      await this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          refundId: `auto_${auto_refund.cf_refund_id}`,
          refundStatus: auto_refund.refund_status,
          refundAmount: auto_refund.refund_amount,
          notes: auto_refund.refund_reason,
        },
      });

      this.logger.log('Auto-refund processed', {
        cfRefundId: auto_refund.cf_refund_id,
      });
    } catch (err) {
      this.logger.error('Error processing auto-refund', (err as Error).stack);
      throw err;
    }
  }

  private buildTransactionData(
    paymentId: number,
    order: CfOrder,
    payment: CfPayment,
    customer: CfCustomer | undefined | null,
    gateway: CfGateway | undefined | null,
    offers: Prisma.InputJsonValue | undefined,
    eventTime: string | undefined,
    eventType: string,
  ) {
    return {
      paymentId,
      orderId: order.order_id,
      orderAmount: order.order_amount,
      orderCurrency: order.order_currency,
      orderTags: order.order_tags,
      cfPaymentId: String(payment.cf_payment_id),
      paymentStatus: payment.payment_status,
      paymentAmount: payment.payment_amount,
      paymentCurrency: payment.payment_currency,
      paymentMessage: payment.payment_message,
      paymentTime: payment.payment_time
        ? new Date(payment.payment_time)
        : undefined,
      bankReference: payment.bank_reference,
      authId: payment.auth_id,
      paymentMethod: payment.payment_method,
      paymentGroup: payment.payment_group,
      customerName: customer?.customer_name,
      customerId: customer?.customer_id,
      customerEmail: customer?.customer_email,
      customerPhone: customer?.customer_phone,
      gatewayName: gateway?.gateway_name,
      gatewayOrderId: gateway?.gateway_order_id,
      gatewayPaymentId: gateway?.gateway_payment_id,
      gatewaySettlement: gateway?.gateway_settlement,
      gatewayStatusCode: gateway?.gateway_status_code,
      paymentOffers: offers,
      eventTime: eventTime ? new Date(eventTime) : new Date(),
      eventType,
      webhookResponse: {
        order,
        payment,
        customer_details: customer,
      } as unknown as Prisma.InputJsonValue,
    };
  }
}

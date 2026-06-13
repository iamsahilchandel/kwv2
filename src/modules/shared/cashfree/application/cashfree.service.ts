import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import { PaymentGatewayException } from '@/common/exceptions/payment.exception.js';
import { CASHFREE_PORT, type ICashfreePort } from './ports/cashfree.port.js';

@Injectable()
export class CashfreeService {
  private readonly logger = new Logger(CashfreeService.name);

  constructor(
    @Inject(CASHFREE_PORT) private readonly cashfree: ICashfreePort,
    private readonly prisma: PrismaService,
  ) {}

  async processWebhook(signature: string, rawBody: string, timestamp: string) {
    this.logger.log('Processing Cashfree webhook');

    let webhookData;
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

  private async processPaymentSuccess(data: any) {
    try {
      const {
        order,
        payment,
        customer_details,
        payment_gateway_details,
        payment_offers,
        event_time,
        type,
      } = data?.data ?? data;

      const paymentRecord = await this.prisma.payment.findFirst({
        where: { orderId: order.order_id },
      });

      if (paymentRecord?.enrollmentId) {
        await this.prisma.batchEnrollments.update({
          where: { id: paymentRecord.enrollmentId },
          data: { status: 'enrolled' },
        });

        // Link learner profile to the center on successful enrollment
        await this.prisma.learnerProfileHasManyCenters.upsert({
          where: {
            learnerProfileId_centerId: {
              learnerProfileId: paymentRecord.learnerProfileId!,
              centerId: paymentRecord.centerId!,
            },
          },
          update: {},
          create: {
            learnerProfileId: paymentRecord.learnerProfileId!,
            centerId: paymentRecord.centerId!,
          },
        });

        this.logger.log('Enrollment activated', {
          enrollmentId: paymentRecord.enrollmentId,
        });
      }

      // Handle center onboarding payment
      const onboardingCenter = await this.prisma.center.findFirst({
        where: { onboardingPaymentOrderId: order.order_id },
      });

      if (!paymentRecord && !onboardingCenter) {
        throw new PaymentGatewayException(
          `Payment record not found for order: ${order.order_id}`,
        );
      }

      await this.prisma.transaction.create({
        data: this.buildTransactionData(
          paymentRecord?.id ?? onboardingCenter?.id,
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

  private async processPaymentFailure(data: any) {
    try {
      const {
        order,
        payment,
        customer_details,
        error_details,
        payment_gateway_details,
        event_time,
        type,
      } = data?.data ?? data;

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
            null,
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

  private async processUserDropped(data: any) {
    try {
      const { order, payment, customer_details, event_time, type } =
        data?.data ?? data;

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
          null,
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

  private async processRefund(data: any) {
    try {
      const { refund, event_time, type } = data?.data ?? data;

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
          webhookResponse: data,
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

  private async processAutoRefund(data: any) {
    try {
      const { auto_refund, event_time, type } = data?.data ?? data;

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
          webhookResponse: data,
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
    paymentId: number | undefined | null,
    order: any,
    payment: any,
    customer: any,
    gateway: any,
    offers: any,
    eventTime: any,
    eventType: string,
  ) {
    return {
      paymentId: paymentId ?? undefined,
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
      webhookResponse: { order, payment, customer_details: customer },
    };
  }
}

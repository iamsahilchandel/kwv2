import { NotFoundException } from '@nestjs/common';

export class PaymentNotFoundException extends NotFoundException {
  constructor(orderId: string) {
    super(`Payment with order ID ${orderId} not found`);
  }
}

import { BadGatewayException } from '@nestjs/common';

/** Thrown when a payment gateway operation fails. */
export class PaymentGatewayException extends BadGatewayException {
  constructor(
    message: string,
    public readonly gatewayError?: unknown,
  ) {
    super({ message });
  }
}

import { UnprocessableEntityException } from '@nestjs/common';

/** Thrown when a business rule is violated (e.g. publishing an empty batch). */
export class BusinessRuleException extends UnprocessableEntityException {
  constructor(message: string, context?: Record<string, unknown>) {
    super({ message, ...(context && { context }) });
  }
}

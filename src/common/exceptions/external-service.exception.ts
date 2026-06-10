import { ServiceUnavailableException } from '@nestjs/common';

/** Thrown when an external third-party service (Maps, S3, Email) is unavailable. */
export class ExternalServiceException extends ServiceUnavailableException {
  constructor(service: string, cause?: unknown) {
    super({ message: `External service unavailable: ${service}`, cause });
  }
}

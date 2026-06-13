import { NotFoundException, ConflictException } from '@nestjs/common';

export class EnrollmentNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Enrollment with id ${id} not found`);
  }
}

export class AlreadyEnrolledException extends ConflictException {
  constructor(batchId: number) {
    super(`Already enrolled in batch ${batchId}`);
  }
}

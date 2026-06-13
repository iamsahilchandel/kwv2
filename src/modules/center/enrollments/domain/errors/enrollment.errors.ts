import { NotFoundException } from '@nestjs/common';

export class EnrollmentNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Enrollment with ID ${id} not found`);
  }
}

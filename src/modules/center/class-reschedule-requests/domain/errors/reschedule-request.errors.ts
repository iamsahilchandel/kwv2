import { NotFoundException } from '@nestjs/common';

export class RescheduleRequestNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Reschedule request with ID ${id} not found`);
  }
}

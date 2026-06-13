import { NotFoundException } from '@nestjs/common';

export class PollNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Reschedule poll with ID ${id} not found`);
  }
}

import { NotFoundException } from '@nestjs/common';

export class BatchNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Batch with id ${id} not found`);
  }
}

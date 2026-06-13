import { NotFoundException } from '@nestjs/common';

export class BatchClassNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Batch class with id ${id} not found`);
  }
}

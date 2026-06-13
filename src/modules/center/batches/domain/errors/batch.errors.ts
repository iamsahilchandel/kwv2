import { NotFoundException } from '@nestjs/common';

export class BatchNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Batch with ID ${id} not found`);
  }
}

export class BatchClassNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Batch class with ID ${id} not found`);
  }
}

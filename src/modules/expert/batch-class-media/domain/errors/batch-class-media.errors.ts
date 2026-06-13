import { NotFoundException } from '@nestjs/common';

export class BatchClassMediaNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Batch class media with id ${id} not found`);
  }
}

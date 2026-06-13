import { NotFoundException } from '@nestjs/common';

export class InterestNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Interest with id ${id} not found`);
  }
}

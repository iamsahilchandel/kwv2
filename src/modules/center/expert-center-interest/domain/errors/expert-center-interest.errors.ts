import { NotFoundException } from '@nestjs/common';

export class InterestNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Expert center interest with ID ${id} not found`);
  }
}

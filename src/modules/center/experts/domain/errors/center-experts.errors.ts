import { NotFoundException } from '@nestjs/common';

export class CenterExpertNotFoundException extends NotFoundException {
  constructor(expertId: number) {
    super(`Expert with ID ${expertId} not found in this center`);
  }
}

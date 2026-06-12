import { NotFoundException } from '@nestjs/common';

export class ExpertNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Expert with id ${id} not found`);
  }
}

import { NotFoundException } from '@nestjs/common';

export class AgreementNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Agreement with id ${id} not found`);
  }
}

import { NotFoundException } from '@nestjs/common';

export class CenterNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Center with id ${id} not found`);
  }
}

export class CenterAccessRequestNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Center access request with id ${id} not found`);
  }
}

import { NotFoundException } from '@nestjs/common';

export class CenterNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Center with id ${id} not found`);
  }
}

export class UpdateRequestNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Update request with id ${id} not found`);
  }
}

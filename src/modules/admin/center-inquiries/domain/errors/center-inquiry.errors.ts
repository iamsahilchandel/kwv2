import { NotFoundException } from '@nestjs/common';

export class CenterInquiryNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Center inquiry with id ${id} not found`);
  }
}

export class CenterInquiryNoteNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Center inquiry note with id ${id} not found`);
  }
}

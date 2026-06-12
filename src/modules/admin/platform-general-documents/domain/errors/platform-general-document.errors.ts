import { NotFoundException } from '@nestjs/common';

export class PlatformGeneralDocumentNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Platform general document with id ${id} not found`);
  }
}

import { NotFoundException } from '@nestjs/common';

export class AdvertisingBannerNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Advertising banner with id ${id} not found`);
  }
}

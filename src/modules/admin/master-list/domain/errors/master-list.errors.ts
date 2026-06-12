import { NotFoundException } from '@nestjs/common';

export class AmenityNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Amenity with id ${id} not found`);
  }
}

export class ServiceNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Service with id ${id} not found`);
  }
}

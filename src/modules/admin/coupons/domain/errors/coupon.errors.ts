import { NotFoundException, ConflictException } from '@nestjs/common';

export class CouponNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Coupon with id ${id} not found`);
  }
}

export class CouponCodeAlreadyExistsException extends ConflictException {
  constructor(code: string) {
    super(`Coupon with code "${code}" already exists`);
  }
}

import { NotFoundException } from '@nestjs/common';

export class CenterStaffNotFoundException extends NotFoundException {
  constructor(staffId: number) {
    super(`Center staff with ID ${staffId} not found`);
  }
}

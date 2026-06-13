import {
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';

export class AdminUserNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Admin user with id ${id} not found`);
  }
}

export class AdminUserAlreadyExistsException extends ConflictException {
  constructor(field: string) {
    super(`Admin user with this ${field} already exists`);
  }
}

export class AdminUserCannotBeDeletedException extends ForbiddenException {
  constructor(reason: string) {
    super(reason);
  }
}

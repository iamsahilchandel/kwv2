import { UnauthorizedException } from '@nestjs/common';

export class AdminPhoneNotRegisteredException extends UnauthorizedException {
  constructor() {
    super('Phone number not registered as admin');
  }
}

export class AdminAccountInactiveException extends UnauthorizedException {
  constructor() {
    super('Admin account is inactive');
  }
}

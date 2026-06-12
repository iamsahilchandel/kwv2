import { Module } from '@nestjs/common';
import { AdminUsersController } from './infrastructure/http/admin-users.controller.js';
import { AdminUsersService } from './application/admin-users.service.js';

@Module({
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
})
export class AdminUsersModule {}

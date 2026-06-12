import { Module } from '@nestjs/common';
import { AdminLearnersController } from './infrastructure/http/admin-learners.controller.js';
import { AdminLearnersService } from './application/admin-learners.service.js';

@Module({
  controllers: [AdminLearnersController],
  providers: [AdminLearnersService],
})
export class AdminLearnersModule {}

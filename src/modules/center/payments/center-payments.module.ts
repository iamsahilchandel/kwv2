import { Module } from '@nestjs/common';
import { CenterPaymentsController } from './infrastructure/http/center-payments.controller.js';
import { CenterPaymentsService } from './application/center-payments.service.js';

@Module({
  controllers: [CenterPaymentsController],
  providers: [CenterPaymentsService],
})
export class CenterPaymentsModule {}

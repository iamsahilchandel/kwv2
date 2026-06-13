import { Module } from '@nestjs/common';
import { CenterEnrollmentsController } from './infrastructure/http/center-enrollments.controller.js';
import { CenterEnrollmentsService } from './application/center-enrollments.service.js';

@Module({
  controllers: [CenterEnrollmentsController],
  providers: [CenterEnrollmentsService],
})
export class CenterEnrollmentsModule {}

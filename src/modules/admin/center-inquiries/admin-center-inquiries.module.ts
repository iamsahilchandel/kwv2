import { Module } from '@nestjs/common';
import { AdminCenterInquiriesController } from './infrastructure/http/admin-center-inquiries.controller.js';
import { AdminCenterInquiriesService } from './application/admin-center-inquiries.service.js';

@Module({
  controllers: [AdminCenterInquiriesController],
  providers: [AdminCenterInquiriesService],
})
export class AdminCenterInquiriesModule {}

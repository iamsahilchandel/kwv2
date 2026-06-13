import { Module } from '@nestjs/common';
import { ExpertCalendarController } from './infrastructure/http/expert-calendar.controller.js';
import { ExpertCalendarService } from './application/expert-calendar.service.js';

@Module({
  controllers: [ExpertCalendarController],
  providers: [ExpertCalendarService],
})
export class ExpertCalendarModule {}

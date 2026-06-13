import { Module } from '@nestjs/common';
import { CenterCalendarController } from './infrastructure/http/center-calendar.controller.js';
import { CenterCalendarService } from './application/center-calendar.service.js';

@Module({
  controllers: [CenterCalendarController],
  providers: [CenterCalendarService],
})
export class CenterCalendarModule {}

import { Module } from '@nestjs/common';
import { CenterReschedulePollsController } from './infrastructure/http/center-reschedule-polls.controller.js';
import { CenterReschedulePollsService } from './application/center-reschedule-polls.service.js';

@Module({
  controllers: [CenterReschedulePollsController],
  providers: [CenterReschedulePollsService],
})
export class CenterReschedulePollsModule {}

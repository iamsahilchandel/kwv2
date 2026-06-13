import { Module } from '@nestjs/common';
import { LearnerPicklistsController } from './infrastructure/http/learner-picklists.controller.js';
import { LearnerPicklistsService } from './application/learner-picklists.service.js';

@Module({
  controllers: [LearnerPicklistsController],
  providers: [LearnerPicklistsService],
})
export class LearnerPicklistsModule {}

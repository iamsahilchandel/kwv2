import { Module } from '@nestjs/common';
import { LearnerMasterListController } from './infrastructure/http/learner-master-list.controller.js';
import { LearnerMasterListService } from './application/learner-master-list.service.js';

@Module({
  controllers: [LearnerMasterListController],
  providers: [LearnerMasterListService],
})
export class LearnerMasterListModule {}

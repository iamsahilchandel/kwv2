import { Module } from '@nestjs/common';
import { ExpertMasterListController } from './infrastructure/http/expert-master-list.controller.js';
import { ExpertMasterListService } from './application/expert-master-list.service.js';

@Module({
  controllers: [ExpertMasterListController],
  providers: [ExpertMasterListService],
})
export class ExpertMasterListModule {}

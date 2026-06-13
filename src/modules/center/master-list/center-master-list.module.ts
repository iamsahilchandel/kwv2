import { Module } from '@nestjs/common';
import { CenterMasterListController } from './infrastructure/http/center-master-list.controller.js';
import { CenterMasterListService } from './application/center-master-list.service.js';

@Module({
  controllers: [CenterMasterListController],
  providers: [CenterMasterListService],
})
export class CenterMasterListModule {}

import { Module } from '@nestjs/common';
import { AdminMasterListController } from './infrastructure/http/admin-master-list.controller.js';
import { AdminMasterListService } from './application/admin-master-list.service.js';

@Module({
  controllers: [AdminMasterListController],
  providers: [AdminMasterListService],
})
export class AdminMasterListModule {}

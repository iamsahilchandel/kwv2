import { Module } from '@nestjs/common';
import { GovPicklistService } from './application/gov-picklist.service.js';
import { GovPicklistController } from './infrastructure/http/gov-picklist.controller.js';

@Module({
  controllers: [GovPicklistController],
  providers: [GovPicklistService],
  exports: [GovPicklistService],
})
export class GovPicklistModule {}

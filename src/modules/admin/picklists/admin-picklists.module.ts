import { Module } from '@nestjs/common';
import { AdminPicklistsController } from './infrastructure/http/admin-picklists.controller.js';
import { AdminPicklistsService } from './application/admin-picklists.service.js';

@Module({
  controllers: [AdminPicklistsController],
  providers: [AdminPicklistsService],
})
export class AdminPicklistsModule {}

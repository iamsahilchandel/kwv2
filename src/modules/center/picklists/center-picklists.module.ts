import { Module } from '@nestjs/common';
import { CenterPicklistsController } from './infrastructure/http/center-picklists.controller.js';
import { CenterPicklistsService } from './application/center-picklists.service.js';

@Module({
  controllers: [CenterPicklistsController],
  providers: [CenterPicklistsService],
})
export class CenterPicklistsModule {}

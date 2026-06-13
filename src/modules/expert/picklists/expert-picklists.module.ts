import { Module } from '@nestjs/common';
import { ExpertPicklistsController } from './infrastructure/http/expert-picklists.controller.js';
import { ExpertPicklistsService } from './application/expert-picklists.service.js';

@Module({
  controllers: [ExpertPicklistsController],
  providers: [ExpertPicklistsService],
})
export class ExpertPicklistsModule {}

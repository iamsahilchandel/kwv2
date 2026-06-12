import { Module } from '@nestjs/common';
import { AdminPlatformGeneralDocumentsController } from './infrastructure/http/admin-platform-general-documents.controller.js';
import { AdminPlatformGeneralDocumentsService } from './application/admin-platform-general-documents.service.js';

@Module({
  controllers: [AdminPlatformGeneralDocumentsController],
  providers: [AdminPlatformGeneralDocumentsService],
})
export class AdminPlatformGeneralDocumentsModule {}

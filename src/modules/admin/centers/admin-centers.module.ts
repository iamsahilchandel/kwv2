import { Module } from '@nestjs/common';
import { AdminCentersController } from './infrastructure/http/admin-centers.controller.js';
import { AdminCentersService } from './application/admin-centers.service.js';

@Module({
  controllers: [AdminCentersController],
  providers: [AdminCentersService],
})
export class AdminCentersModule {}

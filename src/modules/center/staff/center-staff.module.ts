import { Module } from '@nestjs/common';
import { CenterStaffController } from './infrastructure/http/center-staff.controller.js';
import { CenterStaffManagementService } from './application/center-staff.service.js';

@Module({
  controllers: [CenterStaffController],
  providers: [CenterStaffManagementService],
})
export class CenterStaffModule {}

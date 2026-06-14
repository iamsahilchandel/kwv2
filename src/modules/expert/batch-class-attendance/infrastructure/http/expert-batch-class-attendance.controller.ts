import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExpertAuthGuard } from '../../../../../core/guards/expert-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { ExpertBatchClassAttendanceService } from '../../application/expert-batch-class-attendance.service.js';
import {
  MarkAttendanceSchema,
  type MarkAttendanceBody,
} from './dto/expert-batch-class-attendance.dto.js';

@ApiTags('Expert - Batch Class Attendance')
@ApiBearerAuth()
@UseGuards(ExpertAuthGuard)
@Controller('expert/batch-class-attendance')
export class ExpertBatchClassAttendanceController {
  constructor(private readonly service: ExpertBatchClassAttendanceService) {}

  @Get(':classId')
  getClassAttendance(
    @CurrentUser() user: IAuthUser,
    @Param('classId', ParseIntPipe) classId: number,
  ) {
    return this.service.getClassAttendance(user.id, classId);
  }

  @Post(':classId')
  markAttendance(
    @CurrentUser() user: IAuthUser,
    @Param('classId', ParseIntPipe) classId: number,
    @Body(new ZodValidationPipe(MarkAttendanceSchema)) dto: MarkAttendanceBody,
  ) {
    return this.service.markAttendance(user.id, classId, dto);
  }
}

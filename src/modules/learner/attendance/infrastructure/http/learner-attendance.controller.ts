import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LearnerAuthGuard } from '../../../../../core/guards/learner-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { LearnerAttendanceService } from '../../application/learner-attendance.service.js';
import { QueryAttendanceSchema, type QueryAttendanceDto } from './dto/learner-attendance.dto.js';

@ApiTags('Learner - Attendance')
@ApiBearerAuth()
@UseGuards(LearnerAuthGuard)
@Controller('learner/attendance')
export class LearnerAttendanceController {
  constructor(private readonly service: LearnerAttendanceService) {}

  @Get()
  findAll(
    @Query(new ZodValidationPipe(QueryAttendanceSchema)) query: QueryAttendanceDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.findAll(user.id, query);
  }

  @Get('batches/:batchId')
  findByBatch(
    @Param('batchId', ParseIntPipe) batchId: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.findByBatch(user.id, batchId);
  }
}

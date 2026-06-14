import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CenterStaffAuthGuard } from '../../../../../core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { CenterBatchesService } from '../../application/center-batches.service.js';
import {
  CreateBatchSchema,
  type CreateBatchBody,
  UpdateBatchSchema,
  type UpdateBatchBody,
  QueryBatchesSchema,
  type QueryBatchesQuery,
  MarkAttendanceSchema,
  type MarkAttendanceBody,
} from './dto/center-batches.dto.js';

@ApiTags('Center - Batches')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/batches')
export class CenterBatchesController {
  constructor(private readonly service: CenterBatchesService) {}

  @Get()
  findAll(
    @CurrentUser() user: IAuthUser,
    @Query(new ZodValidationPipe(QueryBatchesSchema)) query: QueryBatchesQuery,
  ) {
    return this.service.findAll(user.id, query);
  }

  @Post()
  create(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(CreateBatchSchema)) dto: CreateBatchBody,
  ) {
    return this.service.create(user.id, dto);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateBatchSchema)) dto: UpdateBatchBody,
  ) {
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(user.id, id);
  }

  @Get(':id/enrollments')
  getEnrollments(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.getEnrollments(user.id, id);
  }

  @Get(':id/calendar')
  getCalendar(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.getCalendar(user.id, id);
  }

  @Get(':batchId/classes/:classId/attendance')
  getClassAttendance(
    @CurrentUser() user: IAuthUser,
    @Param('classId', ParseIntPipe) classId: number,
  ) {
    return this.service.getClassAttendance(user.id, classId);
  }

  @Post(':batchId/classes/:classId/attendance')
  markAttendance(
    @CurrentUser() user: IAuthUser,
    @Param('classId', ParseIntPipe) classId: number,
    @Body(new ZodValidationPipe(MarkAttendanceSchema)) dto: MarkAttendanceBody,
  ) {
    return this.service.markAttendance(user.id, classId, dto);
  }
}

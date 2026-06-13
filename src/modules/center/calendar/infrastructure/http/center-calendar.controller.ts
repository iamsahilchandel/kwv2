import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CenterStaffAuthGuard } from '@/core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { CenterCalendarService } from '../../application/center-calendar.service.js';
import {
  CalendarQuerySchema,
  type CalendarQuery,
  DailyScheduleQuerySchema,
  type DailyScheduleQuery,
  CreateBatchClassSchema,
  type CreateBatchClassBody,
  UpdateBatchClassSchema,
  type UpdateBatchClassBody,
} from './dto/center-calendar.dto.js';

@ApiTags('Center - Calendar')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/calendar')
export class CenterCalendarController {
  constructor(private readonly service: CenterCalendarService) {}

  @Get()
  getCalendar(
    @CurrentUser() user: IAuthUser,
    @Query(new ZodValidationPipe(CalendarQuerySchema)) query: CalendarQuery,
  ) {
    return this.service.getCalendar(user.id, query);
  }

  @Get('schedule')
  getDailySchedule(
    @CurrentUser() user: IAuthUser,
    @Query(new ZodValidationPipe(DailyScheduleQuerySchema)) query: DailyScheduleQuery,
  ) {
    return this.service.getDailySchedule(user.id, query);
  }

  @Post('classes')
  createClass(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(CreateBatchClassSchema)) dto: CreateBatchClassBody,
  ) {
    return this.service.createClass(user.id, dto);
  }

  @Patch('classes/:id')
  updateClass(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateBatchClassSchema)) dto: UpdateBatchClassBody,
  ) {
    return this.service.updateClass(user.id, id, dto);
  }
}

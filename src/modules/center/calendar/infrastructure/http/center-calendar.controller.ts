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
import { CenterStaffAuthGuard } from '../../../../../core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { CenterCalendarService } from '../../application/center-calendar.service.js';
import {
  CalendarQuerySchema,
  type CalendarQuery,
  CalendarQueryDto,
  DailyScheduleQuerySchema,
  type DailyScheduleQuery,
  DailyScheduleQueryDto,
  CreateBatchClassSchema,
  type CreateBatchClassBody,
  CreateBatchClassDto,
  UpdateBatchClassSchema,
  type UpdateBatchClassBody,
  UpdateBatchClassDto,
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
    @Query() query: CalendarQueryDto,
  ) {
    return this.service.getCalendar(user.id, query);
  }

  @Get('schedule')
  getDailySchedule(
    @CurrentUser() user: IAuthUser,
    @Query() query: DailyScheduleQueryDto,
  ) {
    return this.service.getDailySchedule(user.id, query);
  }

  @Post('classes')
  createClass(
    @CurrentUser() user: IAuthUser,
    @Body() dto: CreateBatchClassDto,
  ) {
    return this.service.createClass(user.id, dto);
  }

  @Patch('classes/:id')
  updateClass(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBatchClassDto,
  ) {
    return this.service.updateClass(user.id, id, dto);
  }
}

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExpertAuthGuard } from '../../../../../core/guards/expert-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ExpertCalendarService } from '../../application/expert-calendar.service.js';
import {
  CalendarQuerySchema,
  type CalendarQuery,
  CalendarQueryDto,
  UpcomingClassesQuerySchema,
  type UpcomingClassesQuery,
  UpcomingClassesQueryDto,
} from './dto/expert-calendar.dto.js';

@ApiTags('Expert - Calendar')
@ApiBearerAuth()
@UseGuards(ExpertAuthGuard)
@Controller('expert/calendar')
export class ExpertCalendarController {
  constructor(private readonly service: ExpertCalendarService) {}

  @Get()
  getCalendar(
    @CurrentUser() user: IAuthUser,
    @Query() query: CalendarQueryDto,
  ) {
    return this.service.getCalendar(user.id, query);
  }

  @Get('upcoming-classes')
  getUpcomingClasses(
    @CurrentUser() user: IAuthUser,
    @Query() query: UpcomingClassesQueryDto,
  ) {
    return this.service.getUpcomingClasses(user.id, query);
  }
}

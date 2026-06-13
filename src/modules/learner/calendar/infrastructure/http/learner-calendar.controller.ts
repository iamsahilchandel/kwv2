import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LearnerAuthGuard } from '@/core/guards/learner-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { LearnerCalendarService } from '../../application/learner-calendar.service.js';
import { CalendarQuerySchema, type CalendarQueryDto } from './dto/learner-calendar.dto.js';

@ApiTags('Learner - Calendar')
@ApiBearerAuth()
@UseGuards(LearnerAuthGuard)
@Controller('learner/calendar')
export class LearnerCalendarController {
  constructor(private readonly service: LearnerCalendarService) {}

  @Get()
  getCalendar(
    @Query(new ZodValidationPipe(CalendarQuerySchema)) query: CalendarQueryDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.getCalendar(user.id, query);
  }

  @Get('upcoming-classes')
  getUpcomingClasses(@CurrentUser() user: IAuthUser) {
    return this.service.getUpcomingClasses(user.id);
  }
}

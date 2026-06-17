import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LearnerAuthGuard } from '../../../../../core/guards/learner-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { LearnerNotificationsService } from '../../application/learner-notifications.service.js';
import {
  QueryNotificationsSchema,
  type QueryNotificationsQuery,
  QueryNotificationsDto,
} from './dto/learner-notifications.dto.js';

@ApiTags('Learner - Notifications')
@ApiBearerAuth()
@UseGuards(LearnerAuthGuard)
@Controller('learner/notifications')
export class LearnerNotificationsController {
  constructor(private readonly service: LearnerNotificationsService) {}

  @Get()
  findAll(
    @Query() query: QueryNotificationsDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.findAll(user.id, query);
  }

  @Get('stats')
  getStats(@CurrentUser() user: IAuthUser) {
    return this.service.getStats(user.id);
  }

  @Patch('mark-all-read')
  markAllRead(@CurrentUser() user: IAuthUser) {
    return this.service.markAllRead(user.id);
  }

  @Patch(':id/mark-read')
  markRead(@Param('id') id: string, @CurrentUser() user: IAuthUser) {
    return this.service.markRead(user.id, id);
  }
}

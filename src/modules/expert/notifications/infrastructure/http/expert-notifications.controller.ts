import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExpertAuthGuard } from '../../../../../core/guards/expert-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ExpertNotificationsService } from '../../application/expert-notifications.service.js';
import {
  QueryNotificationsSchema,
  type QueryNotificationsQuery,
  QueryNotificationsDto,
} from './dto/expert-notifications.dto.js';

@ApiTags('Expert - Notifications')
@ApiBearerAuth()
@UseGuards(ExpertAuthGuard)
@Controller('expert/notifications')
export class ExpertNotificationsController {
  constructor(private readonly service: ExpertNotificationsService) {}

  @Get('stats')
  getStats(@CurrentUser() user: IAuthUser) {
    return this.service.getStats(user.id);
  }

  @Get()
  findAll(
    @CurrentUser() user: IAuthUser,
    @Query() query: QueryNotificationsDto,
  ) {
    return this.service.findAll(user.id, query);
  }

  @Patch('read-all')
  markAllRead(@CurrentUser() user: IAuthUser) {
    return this.service.markAllRead(user.id);
  }

  @Patch(':id/read')
  markRead(@CurrentUser() user: IAuthUser, @Param('id') id: string) {
    return this.service.markRead(user.id, id);
  }
}

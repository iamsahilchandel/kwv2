import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExpertAuthGuard } from '../../../../../core/guards/expert-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ExpertAdvertisingBannersService } from '../../application/expert-advertising-banners.service.js';

@ApiTags('Expert - Advertising Banners')
@ApiBearerAuth()
@UseGuards(ExpertAuthGuard)
@Controller('expert/advertising-banners')
export class ExpertAdvertisingBannersController {
  constructor(private readonly service: ExpertAdvertisingBannersService) {}

  @Get()
  findAll(@CurrentUser() user: IAuthUser) {
    return this.service.findAll(user.id);
  }
}

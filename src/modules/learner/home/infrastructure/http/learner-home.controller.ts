import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LearnerAuthGuard } from '@/core/guards/learner-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { LearnerHomeService } from '../../application/learner-home.service.js';

@ApiTags('Learner - Home')
@ApiBearerAuth()
@UseGuards(LearnerAuthGuard)
@Controller('learner/home')
export class LearnerHomeController {
  constructor(private readonly service: LearnerHomeService) {}

  @Get()
  getHome(@CurrentUser() user: IAuthUser) {
    return this.service.getHome(user.id);
  }
}

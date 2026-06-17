import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LearnerAuthGuard } from '../../../../../core/guards/learner-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import {
  PaginationQuerySchema,
  type PaginationQuery,
  PaginationQueryDto,
} from '../../../../../common/dto/pagination.dto.js';
import { LearnerReferralsService } from '../../application/learner-referrals.service.js';

@ApiTags('Learner - Referrals')
@ApiBearerAuth()
@UseGuards(LearnerAuthGuard)
@Controller('learner/referrals')
export class LearnerReferralsController {
  constructor(private readonly service: LearnerReferralsService) {}

  @Get('rewards')
  getReferralRewards(
    @Query() query: PaginationQueryDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.getReferralRewards(user.id, query);
  }
}

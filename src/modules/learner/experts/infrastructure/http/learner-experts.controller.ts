import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LearnerAuthGuard } from '@/core/guards/learner-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { LearnerExpertsService } from '../../application/learner-experts.service.js';
import {
  QueryMyExpertsSchema,
  type QueryMyExpertsDto,
  QueryGlobalExpertsSchema,
  type QueryGlobalExpertsDto,
} from './dto/learner-experts.dto.js';

@ApiTags('Learner - Experts')
@ApiBearerAuth()
@UseGuards(LearnerAuthGuard)
@Controller('learner/experts')
export class LearnerExpertsController {
  constructor(private readonly service: LearnerExpertsService) {}

  @Get()
  findMyExperts(
    @Query(new ZodValidationPipe(QueryMyExpertsSchema)) query: QueryMyExpertsDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.findMyExperts(user.id, query);
  }

  @Get('global')
  findGlobalExperts(
    @Query(new ZodValidationPipe(QueryGlobalExpertsSchema)) query: QueryGlobalExpertsDto,
  ) {
    return this.service.findGlobalExperts(query);
  }

  @Get(':expertId')
  findOne(@Param('expertId', ParseIntPipe) expertId: number) {
    return this.service.findOne(expertId);
  }
}

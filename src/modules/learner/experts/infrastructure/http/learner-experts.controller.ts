import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LearnerAuthGuard } from '../../../../../core/guards/learner-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { LearnerExpertsService } from '../../application/learner-experts.service.js';
import {
  QueryMyExpertsSchema,
  QueryMyExpertsDto,
  QueryGlobalExpertsSchema,
  QueryGlobalExpertsDto,
} from './dto/learner-experts.dto.js';

@ApiTags('Learner - Experts')
@ApiBearerAuth()
@UseGuards(LearnerAuthGuard)
@Controller('learner/experts')
export class LearnerExpertsController {
  constructor(private readonly service: LearnerExpertsService) {}

  @Get()
  findMyExperts(
    @Query() query: QueryMyExpertsDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.findMyExperts(user.id, query);
  }

  @Get('global')
  findGlobalExperts(@Query() query: QueryGlobalExpertsDto) {
    return this.service.findGlobalExperts(query);
  }

  @Get(':expertId')
  findOne(@Param('expertId', ParseIntPipe) expertId: number) {
    return this.service.findOne(expertId);
  }
}

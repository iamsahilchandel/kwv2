import { Controller, Get, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExpertAuthGuard } from '../../../../../core/guards/expert-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { ExpertLearnersService } from '../../application/expert-learners.service.js';
import {
  QueryExpertLearnersSchema,
  type QueryExpertLearnersQuery,
} from './dto/expert-learners.dto.js';

@ApiTags('Expert - Learners')
@ApiBearerAuth()
@UseGuards(ExpertAuthGuard)
@Controller('expert/learners')
export class ExpertLearnersController {
  constructor(private readonly service: ExpertLearnersService) {}

  @Get()
  findAll(
    @CurrentUser() user: IAuthUser,
    @Query(new ZodValidationPipe(QueryExpertLearnersSchema)) query: QueryExpertLearnersQuery,
  ) {
    return this.service.findAll(user.id, query);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(user.id, id);
  }
}

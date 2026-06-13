import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExpertAuthGuard } from '@/core/guards/expert-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { ExpertExpertCenterInterestService } from '../../application/expert-expert-center-interest.service.js';
import {
  CreateInterestSchema,
  type CreateInterestBody,
  RespondInterestSchema,
  type RespondInterestBody,
  QueryInterestsSchema,
  type QueryInterestsQuery,
} from './dto/expert-expert-center-interest.dto.js';

@ApiTags('Expert - Expert Center Interest')
@ApiBearerAuth()
@UseGuards(ExpertAuthGuard)
@Controller('expert/expert-center-interest')
export class ExpertExpertCenterInterestController {
  constructor(private readonly service: ExpertExpertCenterInterestService) {}

  @Get()
  findAll(
    @CurrentUser() user: IAuthUser,
    @Query(new ZodValidationPipe(QueryInterestsSchema)) query: QueryInterestsQuery,
  ) {
    return this.service.findAll(user.id, query);
  }

  @Post()
  create(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(CreateInterestSchema)) dto: CreateInterestBody,
  ) {
    return this.service.create(user.id, dto);
  }

  @Delete(':id')
  withdraw(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.withdraw(user.id, id);
  }

  @Post(':id/accept')
  acceptCenterInterest(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.acceptCenterInterest(user.id, id);
  }

  @Post(':id/reject')
  rejectCenterInterest(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(RespondInterestSchema)) dto: RespondInterestBody,
  ) {
    return this.service.rejectCenterInterest(user.id, id, dto);
  }
}

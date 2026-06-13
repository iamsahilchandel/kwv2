import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CenterStaffAuthGuard } from '@/core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { CenterExpertCenterInterestService } from '../../application/center-expert-center-interest.service.js';
import {
  CreateInterestSchema,
  type CreateInterestBody,
  RespondInterestSchema,
  type RespondInterestBody,
  QueryInterestsSchema,
  type QueryInterestsQuery,
} from './dto/center-expert-center-interest.dto.js';

@ApiTags('Center - Expert Center Interest')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/expert-center-interest')
export class CenterExpertCenterInterestController {
  constructor(private readonly service: CenterExpertCenterInterestService) {}

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

  @Patch(':id/accept')
  accept(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(RespondInterestSchema)) dto: RespondInterestBody,
  ) {
    return this.service.accept(user.id, id, dto);
  }

  @Patch(':id/reject')
  reject(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(RespondInterestSchema)) dto: RespondInterestBody,
  ) {
    return this.service.reject(user.id, id, dto);
  }

  @Delete(':id/withdraw')
  withdraw(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.withdraw(user.id, id);
  }
}

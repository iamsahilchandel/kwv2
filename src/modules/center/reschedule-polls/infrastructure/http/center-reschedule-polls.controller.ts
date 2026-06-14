import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CenterStaffAuthGuard } from '../../../../../core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { CenterReschedulePollsService } from '../../application/center-reschedule-polls.service.js';
import {
  CreatePollSchema,
  type CreatePollBody,
  UpdatePollSchema,
  type UpdatePollBody,
  ClosePollSchema,
  type ClosePollBody,
  QueryPollsSchema,
  type QueryPollsQuery,
} from './dto/center-reschedule-polls.dto.js';

@ApiTags('Center - Reschedule Polls')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/reschedule-polls')
export class CenterReschedulePollsController {
  constructor(private readonly service: CenterReschedulePollsService) {}

  @Get()
  findAll(
    @CurrentUser() user: IAuthUser,
    @Query(new ZodValidationPipe(QueryPollsSchema)) query: QueryPollsQuery,
  ) {
    return this.service.findAll(user.id, query);
  }

  @Post()
  create(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(CreatePollSchema)) dto: CreatePollBody,
  ) {
    return this.service.create(user.id, dto);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdatePollSchema)) dto: UpdatePollBody,
  ) {
    return this.service.update(user.id, id, dto);
  }

  @Patch(':id/close')
  close(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(ClosePollSchema)) dto: ClosePollBody,
  ) {
    return this.service.close(user.id, id, dto);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LearnerAuthGuard } from '../../../../../core/guards/learner-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { LearnerEnrollmentsService } from '../../application/learner-enrollments.service.js';
import {
  CreateEnrollmentSchema,
  CreateEnrollmentDto,
  QueryEnrollmentsSchema,
  QueryEnrollmentsDto,
} from './dto/learner-enrollments.dto.js';

@ApiTags('Learner - Enrollments')
@ApiBearerAuth()
@UseGuards(LearnerAuthGuard)
@Controller('learner/enrollments')
export class LearnerEnrollmentsController {
  constructor(private readonly service: LearnerEnrollmentsService) {}

  @Post()
  create(@Body() dto: CreateEnrollmentDto, @CurrentUser() user: IAuthUser) {
    return this.service.create(user.id, dto);
  }

  @Get('my')
  findAll(@Query() query: QueryEnrollmentsDto, @CurrentUser() user: IAuthUser) {
    return this.service.findAll(user.id, query);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.findOne(user.id, id);
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.cancel(user.id, id);
  }

  @Get(':id/payment-details')
  getPaymentDetails(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.getPaymentDetails(user.id, id);
  }
}

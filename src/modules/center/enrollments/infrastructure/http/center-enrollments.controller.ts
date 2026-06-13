import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CenterStaffAuthGuard } from '@/core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { CenterEnrollmentsService } from '../../application/center-enrollments.service.js';
import {
  QueryEnrollmentsSchema,
  type QueryEnrollmentsQuery,
  UpdateEnrollmentSchema,
  type UpdateEnrollmentBody,
} from './dto/center-enrollments.dto.js';

@ApiTags('Center - Enrollments')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/enrollments')
export class CenterEnrollmentsController {
  constructor(private readonly service: CenterEnrollmentsService) {}

  @Get()
  findAll(
    @CurrentUser() user: IAuthUser,
    @Query(new ZodValidationPipe(QueryEnrollmentsSchema)) query: QueryEnrollmentsQuery,
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

  @Patch(':id')
  update(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateEnrollmentSchema)) dto: UpdateEnrollmentBody,
  ) {
    return this.service.update(user.id, id, dto);
  }

  @Patch(':id/approve')
  approve(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.approve(user.id, id);
  }

  @Patch(':id/reject')
  reject(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.reject(user.id, id);
  }
}

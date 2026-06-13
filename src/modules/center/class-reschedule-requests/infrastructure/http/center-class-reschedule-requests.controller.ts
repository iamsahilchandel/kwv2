import {
  Controller,
  Get,
  Patch,
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
import { CenterClassRescheduleRequestsService } from '../../application/center-class-reschedule-requests.service.js';
import {
  QueryRescheduleRequestsSchema,
  type QueryRescheduleRequestsQuery,
  ApproveRescheduleSchema,
  type ApproveRescheduleBody,
  RejectRescheduleSchema,
  type RejectRescheduleBody,
} from './dto/center-class-reschedule-requests.dto.js';

@ApiTags('Center - Class Reschedule Requests')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/class-reschedule-requests')
export class CenterClassRescheduleRequestsController {
  constructor(private readonly service: CenterClassRescheduleRequestsService) {}

  @Get()
  findAll(
    @CurrentUser() user: IAuthUser,
    @Query(new ZodValidationPipe(QueryRescheduleRequestsSchema)) query: QueryRescheduleRequestsQuery,
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

  @Patch(':id/approve')
  approve(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(ApproveRescheduleSchema)) dto: ApproveRescheduleBody,
  ) {
    return this.service.approve(user.id, id, dto);
  }

  @Patch(':id/reject')
  reject(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(RejectRescheduleSchema)) dto: RejectRescheduleBody,
  ) {
    return this.service.reject(user.id, id, dto);
  }
}

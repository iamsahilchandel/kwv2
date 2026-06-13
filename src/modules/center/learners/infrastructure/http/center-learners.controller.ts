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
import { CenterLearnersService } from '../../application/center-learners.service.js';
import {
  QueryCenterLearnersSchema,
  type QueryCenterLearnersQuery,
  QueryAccessRequestsSchema,
  type QueryAccessRequestsQuery,
  RejectAccessRequestSchema,
  type RejectAccessRequestBody,
} from './dto/center-learners.dto.js';

@ApiTags('Center - Learners')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/learners')
export class CenterLearnersController {
  constructor(private readonly service: CenterLearnersService) {}

  @Get()
  findAll(
    @CurrentUser() user: IAuthUser,
    @Query(new ZodValidationPipe(QueryCenterLearnersSchema)) query: QueryCenterLearnersQuery,
  ) {
    return this.service.findAll(user.id, query);
  }

  @Get('access-requests')
  getAccessRequests(
    @CurrentUser() user: IAuthUser,
    @Query(new ZodValidationPipe(QueryAccessRequestsSchema)) query: QueryAccessRequestsQuery,
  ) {
    return this.service.getAccessRequests(user.id, query);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(user.id, id);
  }

  @Patch('access-requests/:id/approve')
  approveAccessRequest(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.approveAccessRequest(user.id, id);
  }

  @Patch('access-requests/:id/reject')
  rejectAccessRequest(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(RejectAccessRequestSchema)) dto: RejectAccessRequestBody,
  ) {
    return this.service.rejectAccessRequest(user.id, id, dto);
  }
}

import {
  Controller,
  Get,
  Post,
  Delete,
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
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { LearnerCentersService } from '../../application/learner-centers.service.js';
import {
  NearbyCentersSchema,
  type NearbyCentersDto,
  CenterAccessRequestSchema,
  type CenterAccessRequestDto,
  QueryMyCentersSchema,
  type QueryMyCentersDto,
} from './dto/learner-centers.dto.js';

@ApiTags('Learner - Centers')
@ApiBearerAuth()
@UseGuards(LearnerAuthGuard)
@Controller('learner/centers')
export class LearnerCentersController {
  constructor(private readonly service: LearnerCentersService) {}

  @Get('nearby')
  findNearby(
    @Query(new ZodValidationPipe(NearbyCentersSchema)) query: NearbyCentersDto,
  ) {
    return this.service.findNearby(query);
  }

  @Get('my')
  findMyCenters(
    @Query(new ZodValidationPipe(QueryMyCentersSchema)) query: QueryMyCentersDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.findMyCenters(user.id, query);
  }

  @Get('access-requests')
  getAccessRequests(@CurrentUser() user: IAuthUser) {
    return this.service.getAccessRequests(user.id);
  }

  @Post('access-requests')
  createAccessRequest(
    @Body(new ZodValidationPipe(CenterAccessRequestSchema)) dto: CenterAccessRequestDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.createAccessRequest(user.id, dto);
  }

  @Delete('access-requests/:id')
  deleteAccessRequest(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.deleteAccessRequest(user.id, id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get(':centerId/experts')
  getCenterExperts(@Param('centerId', ParseIntPipe) centerId: number) {
    return this.service.getCenterExperts(centerId);
  }

  @Post(':centerId/request-access')
  requestAccess(
    @Param('centerId', ParseIntPipe) centerId: number,
    @Body(new ZodValidationPipe(CenterAccessRequestSchema.omit({ centerId: true })))
    dto: Omit<CenterAccessRequestDto, 'centerId'>,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.createAccessRequest(user.id, { ...dto, centerId });
  }
}

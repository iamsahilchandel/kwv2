import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExpertAuthGuard } from '../../../../../core/guards/expert-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ExpertBatchesService } from '../../application/expert-batches.service.js';
import {
  QueryExpertBatchesSchema,
  type QueryExpertBatchesQuery,
  QueryExpertBatchesDto,
} from './dto/expert-batches.dto.js';

@ApiTags('Expert - Batches')
@ApiBearerAuth()
@UseGuards(ExpertAuthGuard)
@Controller('expert/batches')
export class ExpertBatchesController {
  constructor(private readonly service: ExpertBatchesService) {}

  @Get()
  findAll(
    @CurrentUser() user: IAuthUser,
    @Query() query: QueryExpertBatchesDto,
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

  @Get(':id/enrollments')
  getEnrollments(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.getEnrollments(user.id, id);
  }

  @Get(':id/calendar')
  getCalendar(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.getCalendar(user.id, id);
  }
}

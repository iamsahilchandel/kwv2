import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LearnerAuthGuard } from '../../../../../core/guards/learner-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { LearnerBatchesService } from '../../application/learner-batches.service.js';
import {
  QueryBatchesSchema,
  QueryBatchesDto,
} from './dto/learner-batches.dto.js';

@ApiTags('Learner - Batches')
@ApiBearerAuth()
@UseGuards(LearnerAuthGuard)
@Controller('learner/batches')
export class LearnerBatchesController {
  constructor(private readonly service: LearnerBatchesService) {}

  @Get()
  findAll(@Query() query: QueryBatchesDto, @CurrentUser() user: IAuthUser) {
    return this.service.findAll(user.id, query);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.findOne(user.id, id);
  }

  @Get(':id/calendar')
  getCalendar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.getCalendar(user.id, id);
  }

  @Get(':id/classes')
  getClasses(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.getClasses(user.id, id);
  }
}

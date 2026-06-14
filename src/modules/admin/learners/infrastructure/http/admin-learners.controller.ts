import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../../../../../core/guards/admin-auth.guard.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { AdminLearnersService } from '../../application/admin-learners.service.js';
import {
  QueryLearnersSchema,
  type QueryLearnersQuery,
} from './dto/query-learners.dto.js';
import {
  UpdateLearnerSchema,
  type UpdateLearnerBody,
} from './dto/update-learner.dto.js';

@ApiTags('Admin - Learners')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/learners')
export class AdminLearnersController {
  constructor(private readonly service: AdminLearnersService) {}

  @Get()
  findAll(
    @Query(new ZodValidationPipe(QueryLearnersSchema))
    query: QueryLearnersQuery,
  ) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateLearnerSchema)) dto: UpdateLearnerBody,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

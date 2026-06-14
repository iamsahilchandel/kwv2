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
import { AdminExpertsService } from '../../application/admin-experts.service.js';
import {
  QueryExpertsSchema,
  type QueryExpertsQuery,
} from './dto/query-experts.dto.js';
import {
  UpdateExpertSchema,
  type UpdateExpertBody,
} from './dto/update-expert.dto.js';

@ApiTags('Admin - Experts')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/experts')
export class AdminExpertsController {
  constructor(private readonly service: AdminExpertsService) {}

  @Get()
  findAll(
    @Query(new ZodValidationPipe(QueryExpertsSchema)) query: QueryExpertsQuery,
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
    @Body(new ZodValidationPipe(UpdateExpertSchema)) dto: UpdateExpertBody,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

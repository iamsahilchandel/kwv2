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
import { AdminExpertsService } from '../../application/admin-experts.service.js';
import {
  QueryExpertsSchema,
  type QueryExpertsQuery,
  QueryExpertsDto,
} from './dto/query-experts.dto.js';
import {
  UpdateExpertSchema,
  type UpdateExpertBody,
  UpdateExpertDto,
} from './dto/update-expert.dto.js';

@ApiTags('Admin - Experts')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/experts')
export class AdminExpertsController {
  constructor(private readonly service: AdminExpertsService) {}

  @Get()
  findAll(@Query() query: QueryExpertsDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExpertDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

import { Controller, Get, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/core/guards/admin-auth.guard.js';
import { AdminLearnersService } from '../../application/admin-learners.service.js';
import { QueryLearnersDto } from './dto/query-learners.dto.js';
import { UpdateLearnerDto } from './dto/update-learner.dto.js';

@ApiTags('Admin - Learners')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/learners')
export class AdminLearnersController {
  constructor(private readonly service: AdminLearnersService) {}

  @Get()
  findAll(@Query() query: QueryLearnersDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLearnerDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

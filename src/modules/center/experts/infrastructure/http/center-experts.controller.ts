import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CenterStaffAuthGuard } from '../../../../../core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { CenterExpertsService } from '../../application/center-experts.service.js';
import {
  QueryCenterExpertsSchema,
  type QueryCenterExpertsQuery,
  QueryCenterExpertsDto,
  AddExpertSchema,
  type AddExpertBody,
  AddExpertDto,
} from './dto/center-experts.dto.js';

@ApiTags('Center - Experts')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/experts')
export class CenterExpertsController {
  constructor(private readonly service: CenterExpertsService) {}

  @Get()
  findAll(
    @CurrentUser() user: IAuthUser,
    @Query() query: QueryCenterExpertsDto,
  ) {
    return this.service.findAll(user.id, query);
  }

  @Post()
  add(@CurrentUser() user: IAuthUser, @Body() dto: AddExpertDto) {
    return this.service.add(user.id, dto);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(user.id, id);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(user.id, id);
  }
}

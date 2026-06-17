import {
  Controller,
  Get,
  Post,
  Patch,
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
import { CenterStaffManagementService } from '../../application/center-staff.service.js';
import {
  CreateCenterStaffSchema,
  type CreateCenterStaffBody,
  CreateCenterStaffDto,
  UpdateCenterStaffSchema,
  type UpdateCenterStaffBody,
  UpdateCenterStaffDto,
  QueryCenterStaffSchema,
  type QueryCenterStaffQuery,
  QueryCenterStaffDto,
} from './dto/center-staff.dto.js';

@ApiTags('Center - Staff')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/staff')
export class CenterStaffController {
  constructor(private readonly service: CenterStaffManagementService) {}

  @Get()
  findAll(@CurrentUser() user: IAuthUser, @Query() query: QueryCenterStaffDto) {
    return this.service.findAll(user.id, query);
  }

  @Post()
  create(@CurrentUser() user: IAuthUser, @Body() dto: CreateCenterStaffDto) {
    return this.service.create(user.id, dto);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCenterStaffDto,
  ) {
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(user.id, id);
  }
}

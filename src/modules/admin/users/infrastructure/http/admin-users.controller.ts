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
import { AdminAuthGuard } from '../../../../../core/guards/admin-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { AdminUsersService } from '../../application/admin-users.service.js';
import {
  CreateAdminUserSchema,
  type CreateAdminUserBody,
} from './dto/create-admin-user.dto.js';
import {
  UpdateAdminUserSchema,
  type UpdateAdminUserBody,
} from './dto/update-admin-user.dto.js';
import {
  QueryAdminUsersSchema,
  type QueryAdminUsersQuery,
} from './dto/query-admin-users.dto.js';

@ApiTags('Admin - Users')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly service: AdminUsersService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: IAuthUser) {
    return this.service.getProfile(user);
  }

  @Get()
  findAll(
    @Query(new ZodValidationPipe(QueryAdminUsersSchema))
    query: QueryAdminUsersQuery,
  ) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateAdminUserSchema))
    dto: CreateAdminUserBody,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.create(dto, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateAdminUserSchema))
    dto: UpdateAdminUserBody,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.remove(id, user);
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
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
import { AdminAdvertisingBannersService } from '../../application/admin-advertising-banners.service.js';
import {
  CreateAdvertisingBannerSchema,
  type CreateAdvertisingBannerBody,
} from './dto/create-advertising-banner.dto.js';
import {
  UpdateAdvertisingBannerSchema,
  type UpdateAdvertisingBannerBody,
} from './dto/update-advertising-banner.dto.js';
import {
  QueryAdvertisingBannersSchema,
  type QueryAdvertisingBannersQuery,
} from './dto/query-advertising-banners.dto.js';

@ApiTags('Admin - Advertising Banners')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/advertising-banners')
export class AdminAdvertisingBannersController {
  constructor(private readonly service: AdminAdvertisingBannersService) {}

  @Get()
  findAll(
    @Query(new ZodValidationPipe(QueryAdvertisingBannersSchema))
    query: QueryAdvertisingBannersQuery,
  ) {
    return this.service.findAll(query);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateAdvertisingBannerSchema))
    dto: CreateAdvertisingBannerBody,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.create(dto, user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateAdvertisingBannerSchema))
    dto: UpdateAdvertisingBannerBody,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

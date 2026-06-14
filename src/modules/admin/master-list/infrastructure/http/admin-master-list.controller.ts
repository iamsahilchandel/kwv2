import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../../../../../core/guards/admin-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { AdminMasterListService } from '../../application/admin-master-list.service.js';
import {
  CreateAmenitySchema,
  type CreateAmenityBody,
} from './dto/create-amenity.dto.js';
import {
  UpdateAmenitySchema,
  type UpdateAmenityBody,
} from './dto/update-amenity.dto.js';
import {
  CreateServiceSchema,
  type CreateServiceBody,
} from './dto/create-service.dto.js';
import {
  UpdateServiceSchema,
  type UpdateServiceBody,
} from './dto/update-service.dto.js';

@ApiTags('Admin - Master List')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/master-list')
export class AdminMasterListController {
  constructor(private readonly service: AdminMasterListService) {}

  @Get('amenities')
  findAllAmenities() {
    return this.service.findAllAmenities();
  }

  @Post('amenities')
  createAmenity(
    @Body(new ZodValidationPipe(CreateAmenitySchema)) dto: CreateAmenityBody,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.createAmenity(dto, user.id);
  }

  @Put('amenities/:id')
  updateAmenity(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateAmenitySchema)) dto: UpdateAmenityBody,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.updateAmenity(id, dto, user.id);
  }

  @Delete('amenities/:id')
  deleteAmenity(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteAmenity(id);
  }

  @Get('services')
  findAllServices() {
    return this.service.findAllServices();
  }

  @Post('services')
  createService(
    @Body(new ZodValidationPipe(CreateServiceSchema)) dto: CreateServiceBody,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.createService(dto, user.id);
  }

  @Put('services/:id')
  updateService(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateServiceSchema)) dto: UpdateServiceBody,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.updateService(id, dto, user.id);
  }

  @Delete('services/:id')
  deleteService(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteService(id);
  }
}

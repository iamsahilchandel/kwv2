import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/core/guards/admin-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { AdminMasterListService } from '../../application/admin-master-list.service.js';
import { CreateAmenityDto } from './dto/create-amenity.dto.js';
import { UpdateAmenityDto } from './dto/update-amenity.dto.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';

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
  createAmenity(@Body() dto: CreateAmenityDto, @CurrentUser() user: IAuthUser) {
    return this.service.createAmenity(dto, user.id);
  }

  @Put('amenities/:id')
  updateAmenity(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAmenityDto,
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
  createService(@Body() dto: CreateServiceDto, @CurrentUser() user: IAuthUser) {
    return this.service.createService(dto, user.id);
  }

  @Put('services/:id')
  updateService(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.updateService(id, dto, user.id);
  }

  @Delete('services/:id')
  deleteService(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteService(id);
  }
}

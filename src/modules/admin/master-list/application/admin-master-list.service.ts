import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import {
  AmenityNotFoundException,
  ServiceNotFoundException,
} from '../domain/errors/master-list.errors.js';
import type { CreateAmenityBody } from '../infrastructure/http/dto/create-amenity.dto.js';
import type { UpdateAmenityBody } from '../infrastructure/http/dto/update-amenity.dto.js';
import type { CreateServiceBody } from '../infrastructure/http/dto/create-service.dto.js';
import type { UpdateServiceBody } from '../infrastructure/http/dto/update-service.dto.js';

@Injectable()
export class AdminMasterListService {
  private readonly logger = new Logger(AdminMasterListService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ── Amenities ──────────────────────────────────────────────────────────────

  async findAllAmenities() {
    return this.prisma.ameneties.findMany({ orderBy: { amenityName: 'asc' } });
  }

  async createAmenity(dto: CreateAmenityBody, adminId: number) {
    this.logger.log('Creating amenity', { adminId, name: dto.amenityName });
    const amenity = await this.prisma.ameneties.create({
      data: { ...dto, createdBy: adminId },
    });
    this.logger.log('Amenity created', { amenityId: amenity.id });
    return amenity;
  }

  async updateAmenity(id: number, dto: UpdateAmenityBody, adminId: number) {
    const amenity = await this.prisma.ameneties.findUnique({ where: { id } });
    if (!amenity) throw new AmenityNotFoundException(id);

    this.logger.log('Updating amenity', { amenityId: id, adminId });
    return this.prisma.ameneties.update({
      where: { id },
      data: { ...dto, lastModifiedBy: adminId },
    });
  }

  async deleteAmenity(id: number) {
    const amenity = await this.prisma.ameneties.findUnique({ where: { id } });
    if (!amenity) throw new AmenityNotFoundException(id);

    await this.prisma.ameneties.delete({ where: { id } });
    this.logger.log(`Amenity ${id} deleted`);
    return { message: 'Amenity deleted successfully' };
  }

  // ── Services ───────────────────────────────────────────────────────────────

  async findAllServices() {
    return this.prisma.services.findMany({ orderBy: { serviceName: 'asc' } });
  }

  async createService(dto: CreateServiceBody, adminId: number) {
    this.logger.log('Creating service', { adminId, name: dto.serviceName });
    const service = await this.prisma.services.create({
      data: { ...dto, createdBy: adminId },
    });
    this.logger.log('Service created', { serviceId: service.id });
    return service;
  }

  async updateService(id: number, dto: UpdateServiceBody, adminId: number) {
    const service = await this.prisma.services.findUnique({ where: { id } });
    if (!service) throw new ServiceNotFoundException(id);

    this.logger.log('Updating service', { serviceId: id, adminId });
    return this.prisma.services.update({
      where: { id },
      data: { ...dto, lastModifiedBy: adminId },
    });
  }

  async deleteService(id: number) {
    const service = await this.prisma.services.findUnique({ where: { id } });
    if (!service) throw new ServiceNotFoundException(id);

    await this.prisma.services.delete({ where: { id } });
    this.logger.log(`Service ${id} deleted`);
    return { message: 'Service deleted successfully' };
  }
}

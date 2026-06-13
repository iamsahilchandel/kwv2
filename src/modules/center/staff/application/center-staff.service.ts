import { Injectable, Logger, UnauthorizedException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import { BusinessRuleException } from '@/common/exceptions/business-rule.exception.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import { CenterStaffNotFoundException } from '../domain/errors/center-staff.errors.js';
import type { CreateCenterStaffBody, UpdateCenterStaffBody, QueryCenterStaffQuery } from '../infrastructure/http/dto/center-staff.dto.js';

@Injectable()
export class CenterStaffManagementService {
  private readonly logger = new Logger(CenterStaffManagementService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(staffId: number, query: QueryCenterStaffQuery) {
    const centerId = await this.getCenterId(staffId);
    const { skip, take, page, limit } = paginationParams(query);
    const { search, role, isActive } = query;

    const where: Record<string, unknown> = { centerId };
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.staff = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search } },
        ],
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.centerHasManyStaff.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          staff: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
              isActive: true,
            },
          },
        },
      }),
      this.prisma.centerHasManyStaff.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async create(requestingStaffId: number, dto: CreateCenterStaffBody) {
    const centerId = await this.getCenterId(requestingStaffId);
    this.logger.log('Creating center staff', { centerId, phone: dto.phoneNumber });

    const existing = await this.prisma.centerStaff.findUnique({
      where: { phoneNumber: dto.phoneNumber },
    });

    if (existing) {
      const alreadyMember = await this.prisma.centerHasManyStaff.findFirst({
        where: { centerId, staffId: existing.id, isActive: true },
      });
      if (alreadyMember) {
        throw new ConflictException('This staff member is already part of your center');
      }

      const membership = await this.prisma.centerHasManyStaff.create({
        data: {
          centerId,
          staffId: existing.id,
          role: dto.role,
          joinedOn: dto.joinedOn,
          createdBy: requestingStaffId,
        },
        include: { staff: { select: { id: true, firstName: true, lastName: true, phoneNumber: true } } },
      });

      this.logger.log('Existing staff linked to center', { centerId, staffId: existing.id });
      return membership;
    }

    const newStaff = await this.prisma.$transaction(async (tx) => {
      const staff = await tx.centerStaff.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          createdBy: requestingStaffId,
        },
      });

      const membership = await tx.centerHasManyStaff.create({
        data: {
          centerId,
          staffId: staff.id,
          role: dto.role,
          joinedOn: dto.joinedOn,
          createdBy: requestingStaffId,
        },
      });

      return { staff, membership };
    });

    this.logger.log('Center staff created', { centerId, staffId: newStaff.staff.id });
    return newStaff;
  }

  async findOne(requestingStaffId: number, targetStaffId: number) {
    const centerId = await this.getCenterId(requestingStaffId);

    const membership = await this.prisma.centerHasManyStaff.findFirst({
      where: { centerId, staffId: targetStaffId },
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            isActive: true,
            joinedOn: true,
            createdAt: true,
          },
        },
      },
    });

    if (!membership) throw new CenterStaffNotFoundException(targetStaffId);
    return membership;
  }

  async update(requestingStaffId: number, targetStaffId: number, dto: UpdateCenterStaffBody) {
    const centerId = await this.getCenterId(requestingStaffId);

    const membership = await this.prisma.centerHasManyStaff.findFirst({
      where: { centerId, staffId: targetStaffId },
    });
    if (!membership) throw new CenterStaffNotFoundException(targetStaffId);

    this.logger.log('Updating center staff', { centerId, targetStaffId, requestingStaffId });

    const { role, isActive, ...staffFields } = dto;

    await this.prisma.$transaction(async (tx) => {
      if (Object.keys(staffFields).length > 0) {
        await tx.centerStaff.update({
          where: { id: targetStaffId },
          data: { ...staffFields, lastModifiedBy: requestingStaffId },
        });
      }
      if (role !== undefined || isActive !== undefined) {
        await tx.centerHasManyStaff.update({
          where: { id: membership.id },
          data: {
            ...(role !== undefined && { role }),
            ...(isActive !== undefined && { isActive }),
            lastModifiedBy: requestingStaffId,
          },
        });
      }
    });

    this.logger.log('Center staff updated', { centerId, targetStaffId });
    return this.findOne(requestingStaffId, targetStaffId);
  }

  async remove(requestingStaffId: number, targetStaffId: number) {
    const centerId = await this.getCenterId(requestingStaffId);

    if (requestingStaffId === targetStaffId) {
      throw new BusinessRuleException('You cannot remove yourself from the center');
    }

    const membership = await this.prisma.centerHasManyStaff.findFirst({
      where: { centerId, staffId: targetStaffId },
    });
    if (!membership) throw new CenterStaffNotFoundException(targetStaffId);

    this.logger.log('Removing center staff', { centerId, targetStaffId, requestingStaffId });

    await this.prisma.centerHasManyStaff.update({
      where: { id: membership.id },
      data: { isActive: false, lastModifiedBy: requestingStaffId },
    });

    this.logger.log('Center staff removed', { centerId, targetStaffId });
    return { message: 'Staff member removed from center' };
  }

  private async getCenterId(staffId: number): Promise<number> {
    const membership = await this.prisma.centerHasManyStaff.findFirst({
      where: { staffId, isActive: true, center: { isActive: true } },
      select: { centerId: true },
    });
    if (!membership) throw new UnauthorizedException('No active center found for staff');
    return membership.centerId;
  }
}

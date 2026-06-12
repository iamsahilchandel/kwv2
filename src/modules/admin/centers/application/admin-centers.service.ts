import { Injectable, Logger } from '@nestjs/common';
import { omit } from 'lodash';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import { BusinessRuleException } from '@/common/exceptions/business-rule.exception.js';
import { CenterNotFoundException, UpdateRequestNotFoundException } from '../domain/errors/center.errors.js';
import type { QueryCentersDto } from '../infrastructure/http/dto/query-centers.dto.js';
import type { UpdateCenterDto } from '../infrastructure/http/dto/update-center.dto.js';
import type { PaymentRejectDto } from '../infrastructure/http/dto/payment-action.dto.js';

const SENSITIVE_FIELDS = ['onboardingPaymentSS', 'onboardingPaymentSSKey'] as const;

@Injectable()
export class AdminCentersService {
  private readonly logger = new Logger(AdminCentersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryCentersDto) {
    const { skip, take, page, limit } = paginationParams(query);
    const { isActive, isVerified, centerType, operatingEntity, search, city, state } = query;

    const where: Record<string, unknown> = {};
    if (isActive !== undefined) where.isActive = isActive;
    if (isVerified !== undefined) where.isVerified = isVerified;
    if (centerType) where.centerType = centerType;
    if (operatingEntity) where.operatingEntity = operatingEntity;

    if (search) {
      where.OR = [
        { centerName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const jsonFilters: Array<Record<string, unknown>> = [];
    if (city) jsonFilters.push({ address: { path: ['city'], equals: city } });
    if (state) jsonFilters.push({ address: { path: ['state'], equals: state } });
    if (jsonFilters.length) where.AND = jsonFilters;

    const [items, total] = await Promise.all([
      this.prisma.center.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, centerName: true, email: true, phoneNumber: true,
          isActive: true, isVerified: true, centerType: true, address: true,
          isOnboardingPaymentReceived: true, createdAt: true,
        },
      }),
      this.prisma.center.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async getListing() {
    return this.prisma.center.findMany({
      select: { id: true, centerName: true, isActive: true },
      orderBy: { centerName: 'asc' },
    });
  }

  async findOne(id: number) {
    const center = await this.prisma.center.findUnique({ where: { id } });
    if (!center) throw new CenterNotFoundException(id);
    return omit(center, SENSITIVE_FIELDS);
  }

  async update(id: number, dto: UpdateCenterDto, adminId: number) {
    const center = await this.prisma.center.findUnique({ where: { id } });
    if (!center) throw new CenterNotFoundException(id);

    this.logger.log('Updating center', { centerId: id, adminId });
    const updated = await this.prisma.center.update({
      where: { id },
      data: { ...dto, lastModifiedBy: adminId },
    });

    return omit(updated, SENSITIVE_FIELDS);
  }

  async remove(id: number, adminId: number) {
    const center = await this.prisma.center.findUnique({ where: { id } });
    if (!center) throw new CenterNotFoundException(id);

    const activeBatches = await this.prisma.batches.count({
      where: { centerId: id, status: 'active' },
    });
    if (activeBatches > 0) {
      throw new BusinessRuleException('Cannot delete center with active batches', { centerId: id, activeBatches });
    }

    await this.prisma.center.delete({ where: { id } });
    this.logger.log(`Center ${id} deleted by admin ${adminId}`);
    return { message: 'Center deleted successfully' };
  }

  async checkCenterHead(id: number) {
    const center = await this.prisma.center.findUnique({
      where: { id },
      select: { id: true, centerHeadId: true },
    });
    if (!center) throw new CenterNotFoundException(id);
    return { hasCenterHead: center.centerHeadId !== null, centerHeadId: center.centerHeadId };
  }

  async verifyPayment(centerId: number, adminId: number) {
    const center = await this.prisma.center.findUnique({ where: { id: centerId } });
    if (!center) throw new CenterNotFoundException(centerId);

    this.logger.log('Verifying center payment', { centerId, adminId });

    const updated = await this.prisma.center.update({
      where: { id: centerId },
      data: {
        isOnboardingPaymentVerified: true,
        isOnboardingPaymentRejected: false,
        onboardingPaymentVerifiedBy: adminId,
        lastModifiedBy: adminId,
      },
    });

    this.logger.log('Center payment verified', { centerId, adminId });
    return omit(updated, SENSITIVE_FIELDS);
  }

  async rejectPayment(centerId: number, dto: PaymentRejectDto, adminId: number) {
    const center = await this.prisma.center.findUnique({ where: { id: centerId } });
    if (!center) throw new CenterNotFoundException(centerId);

    this.logger.log('Rejecting center payment', { centerId, adminId });

    const updated = await this.prisma.center.update({
      where: { id: centerId },
      data: {
        isOnboardingPaymentRejected: true,
        isOnboardingPaymentVerified: false,
        onboardingPaymentRejectedBy: adminId,
        onboardingPaymentRejectedOn: new Date(),
        onboardingPaymentRejectionReason: dto.reasons ?? [],
        lastModifiedBy: adminId,
      },
    });

    this.logger.log('Center payment rejected', { centerId, adminId });
    return omit(updated, SENSITIVE_FIELDS);
  }

  async getUpdateRequests(centerId: number) {
    const center = await this.prisma.center.findUnique({ where: { id: centerId } });
    if (!center) throw new CenterNotFoundException(centerId);

    return this.prisma.updateCenterDetailsRequest.findMany({
      where: { centerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveUpdateRequest(centerId: number, requestId: number, adminId: number) {
    const request = await this.prisma.updateCenterDetailsRequest.findUnique({ where: { id: requestId } });
    if (!request || request.centerId !== centerId) throw new UpdateRequestNotFoundException(requestId);

    this.logger.log('Approving center update request', { centerId, requestId, adminId });

    // Build update data from request (only non-null fields)
    const updateData: Record<string, unknown> = {};
    if (request.centerName) updateData.centerName = request.centerName;
    if (request.email) updateData.email = request.email;
    if (request.phoneNumber) updateData.phoneNumber = request.phoneNumber;
    if (request.address) updateData.address = request.address;
    if (request.website) updateData.website = request.website;
    if (request.centerType) updateData.centerType = request.centerType;
    if (request.operatingEntity) updateData.operatingEntity = request.operatingEntity;
    if (request.dailyOperatingHours) updateData.dailyOperatingHours = request.dailyOperatingHours;
    if (request.numberOfEmployees) updateData.numberOfEmployees = request.numberOfEmployees;

    await this.prisma.$transaction([
      this.prisma.center.update({ where: { id: centerId }, data: { ...updateData, lastModifiedBy: adminId } }),
      this.prisma.updateCenterDetailsRequest.delete({ where: { id: requestId } }),
    ]);

    this.logger.log('Center update request approved', { centerId, requestId });
    return { message: 'Update request approved and applied' };
  }

  async rejectUpdateRequest(centerId: number, requestId: number, adminId: number) {
    const request = await this.prisma.updateCenterDetailsRequest.findUnique({ where: { id: requestId } });
    if (!request || request.centerId !== centerId) throw new UpdateRequestNotFoundException(requestId);

    this.logger.log('Rejecting center update request', { centerId, requestId, adminId });
    await this.prisma.updateCenterDetailsRequest.delete({ where: { id: requestId } });

    return { message: 'Update request rejected' };
  }
}

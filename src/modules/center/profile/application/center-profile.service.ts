import {
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { Prisma } from '../../../../generated/prisma/client.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { BusinessRuleException } from '../../../../common/exceptions/business-rule.exception.js';
import type {
  UpdateCenterProfileBody,
  SubmitUpdateRequestBody,
} from '../infrastructure/http/dto/center-profile.dto.js';

const SENSITIVE_FIELDS = [
  'onboardingPaymentSS',
  'onboardingPaymentSSKey',
] as const;

@Injectable()
export class CenterProfileService {
  private readonly logger = new Logger(CenterProfileService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getProfile(staffId: number) {
    const centerId = await this.getCenterId(staffId);
    this.logger.log('Fetching center profile', { centerId });

    const center = await this.prisma.center.findUnique({
      where: { id: centerId },
      include: {
        aboutUs: true,
        media: true,
        verificationDocs: true,
        centerAmenities: { include: { amenity: true } },
        centerServices: { include: { service: true } },
        staffAssociations: {
          where: { isActive: true },
          include: {
            staff: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
    });

    if (!center) throw new NotFoundException(`Center not found`);
    return omit(center, SENSITIVE_FIELDS);
  }

  async updateProfile(staffId: number, dto: UpdateCenterProfileBody) {
    const centerId = await this.getCenterId(staffId);
    this.logger.log('Updating center profile', { centerId, staffId });

    const { dailyOperatingHours, address, ...restDto } = dto;
    const updated = await this.prisma.center.update({
      where: { id: centerId },
      data: {
        ...restDto,
        ...(dailyOperatingHours !== undefined && {
          dailyOperatingHours: dailyOperatingHours as Prisma.InputJsonValue,
        }),
        ...(address !== undefined && {
          address: address as Prisma.InputJsonValue,
        }),
        lastModifiedBy: staffId,
      },
    });

    this.logger.log('Center profile updated', { centerId });
    return omit(updated, SENSITIVE_FIELDS);
  }

  async submitUpdateRequest(staffId: number, dto: SubmitUpdateRequestBody) {
    const centerId = await this.getCenterId(staffId);
    this.logger.log('Submitting center update request', { centerId, staffId });

    const pendingRequest =
      await this.prisma.updateCenterDetailsRequest.findFirst({
        where: { centerId, status: 'PENDING' },
      });

    if (pendingRequest) {
      throw new BusinessRuleException(
        'A pending update request already exists. Please wait for it to be reviewed.',
        { centerId, existingRequestId: pendingRequest.id },
      );
    }

    const {
      dailyOperatingHours: reqHours,
      address: reqAddr,
      ...restReqDto
    } = dto;
    const request = await this.prisma.updateCenterDetailsRequest.create({
      data: {
        centerId,
        createdBy: staffId,
        ...restReqDto,
        ...(reqHours !== undefined && {
          dailyOperatingHours: reqHours as Prisma.InputJsonValue,
        }),
        ...(reqAddr !== undefined && {
          address: reqAddr as Prisma.InputJsonValue,
        }),
      },
    });

    this.logger.log('Center update request submitted', {
      centerId,
      requestId: request.id,
    });
    return request;
  }

  async getUpdateRequests(staffId: number) {
    const centerId = await this.getCenterId(staffId);
    return this.prisma.updateCenterDetailsRequest.findMany({
      where: { centerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async getCenterId(staffId: number): Promise<number> {
    const membership = await this.prisma.centerHasManyStaff.findFirst({
      where: { staffId, isActive: true, center: { isActive: true } },
      select: { centerId: true },
    });
    if (!membership)
      throw new UnauthorizedException('No active center found for staff');
    return membership.centerId;
  }
}

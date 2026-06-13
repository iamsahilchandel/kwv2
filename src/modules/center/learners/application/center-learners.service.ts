import { Injectable, Logger, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import { BusinessRuleException } from '@/common/exceptions/business-rule.exception.js';
import { LearnerNotFoundException, AccessRequestNotFoundException } from '../domain/errors/center-learners.errors.js';
import type { QueryCenterLearnersQuery, QueryAccessRequestsQuery, RejectAccessRequestBody } from '../infrastructure/http/dto/center-learners.dto.js';

@Injectable()
export class CenterLearnersService {
  private readonly logger = new Logger(CenterLearnersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(staffId: number, query: QueryCenterLearnersQuery) {
    const centerId = await this.getCenterId(staffId);
    const { skip, take, page, limit } = paginationParams(query);
    const { search, isActive, isVerified } = query;

    const where: Record<string, unknown> = { centerId };
    if (isActive !== undefined) where.isActive = isActive;
    if (isVerified !== undefined) where.isVerified = isVerified;
    if (search) {
      where.learnerProfile = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search } },
        ],
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.learnerProfileHasManyCenters.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'desc' },
        include: {
          learnerProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
              profilePicture: true,
              isActive: true,
              isVerified: true,
            },
          },
        },
      }),
      this.prisma.learnerProfileHasManyCenters.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(staffId: number, learnerProfileId: number) {
    const centerId = await this.getCenterId(staffId);

    const membership = await this.prisma.learnerProfileHasManyCenters.findFirst({
      where: { centerId, learnerProfileId },
      include: {
        learnerProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            profilePicture: true,
            gender: true,
            dateOfBirth: true,
            isActive: true,
            isVerified: true,
            interests: { include: { service: { select: { id: true, serviceName: true } } } },
          },
        },
      },
    });

    if (!membership) throw new LearnerNotFoundException(learnerProfileId);
    return membership;
  }

  async getAccessRequests(staffId: number, query: QueryAccessRequestsQuery) {
    const centerId = await this.getCenterId(staffId);
    const { skip, take, page, limit } = paginationParams(query);
    const { status } = query;

    const where: Record<string, unknown> = { centerId };
    if (status) where.requestStatus = status;

    const [items, total] = await Promise.all([
      this.prisma.learnerCenterAccessRequests.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          learnerProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
              profilePicture: true,
            },
          },
        },
      }),
      this.prisma.learnerCenterAccessRequests.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async approveAccessRequest(staffId: number, requestId: number) {
    const centerId = await this.getCenterId(staffId);

    const request = await this.prisma.learnerCenterAccessRequests.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new AccessRequestNotFoundException(requestId);
    if (request.centerId !== centerId) throw new ForbiddenException();
    if (request.requestStatus !== 'pending') {
      throw new BusinessRuleException('Access request is no longer pending');
    }

    this.logger.log('Approving learner access request', { requestId, centerId, staffId });

    // Look up existing center membership before the transaction
    const existingMembership = await this.prisma.learnerProfileHasManyCenters.findFirst({
      where: { learnerProfileId: request.learnerProfileId, centerId },
      select: { id: true },
    });

    await this.prisma.$transaction([
      this.prisma.learnerCenterAccessRequests.update({
        where: { id: requestId },
        data: { requestStatus: 'approved', approvedBy: staffId, approvedAt: new Date() },
      }),
      existingMembership
        ? this.prisma.learnerProfileHasManyCenters.update({
            where: { id: existingMembership.id },
            data: { isActive: true, lastModifiedBy: staffId },
          })
        : this.prisma.learnerProfileHasManyCenters.create({
            data: {
              learnerProfileId: request.learnerProfileId,
              centerId,
              isActive: true,
              createdBy: staffId,
            },
          }),
    ]);

    this.logger.log('Learner access request approved', { requestId, centerId });
    return { message: 'Access request approved' };
  }

  async rejectAccessRequest(staffId: number, requestId: number, dto: RejectAccessRequestBody) {
    const centerId = await this.getCenterId(staffId);

    const request = await this.prisma.learnerCenterAccessRequests.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new AccessRequestNotFoundException(requestId);
    if (request.centerId !== centerId) throw new ForbiddenException();
    if (request.requestStatus !== 'pending') {
      throw new BusinessRuleException('Access request is no longer pending');
    }

    this.logger.log('Rejecting learner access request', { requestId, centerId, staffId });

    return this.prisma.learnerCenterAccessRequests.update({
      where: { id: requestId },
      data: { requestStatus: 'rejected', rejectionReason: dto.rejectionReason },
    });
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

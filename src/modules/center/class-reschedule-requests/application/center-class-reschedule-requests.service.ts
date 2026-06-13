import { Injectable, Logger, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import { BusinessRuleException } from '@/common/exceptions/business-rule.exception.js';
import { RescheduleRequestNotFoundException } from '../domain/errors/reschedule-request.errors.js';
import type {
  QueryRescheduleRequestsQuery,
  ApproveRescheduleBody,
  RejectRescheduleBody,
} from '../infrastructure/http/dto/center-class-reschedule-requests.dto.js';

@Injectable()
export class CenterClassRescheduleRequestsService {
  private readonly logger = new Logger(CenterClassRescheduleRequestsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(staffId: number, query: QueryRescheduleRequestsQuery) {
    const centerId = await this.getCenterId(staffId);
    const { skip, take, page, limit } = paginationParams(query);
    const { status, requesterType } = query;

    const where: Record<string, unknown> = { centerId };
    if (status) where.status = status;
    if (requesterType) where.requesterType = requesterType;

    const [items, total] = await Promise.all([
      this.prisma.classRescheduleRequests.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          batchClass: {
            select: {
              id: true,
              classDate: true,
              startTime: true,
              endTime: true,
              batch: { select: { id: true, batchName: true } },
            },
          },
        },
      }),
      this.prisma.classRescheduleRequests.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(staffId: number, requestId: number) {
    const centerId = await this.getCenterId(staffId);

    const request = await this.prisma.classRescheduleRequests.findUnique({
      where: { id: requestId },
      include: {
        batchClass: {
          include: {
            batch: { select: { id: true, batchName: true, centerId: true, expertId: true } },
          },
        },
      },
    });

    if (!request) throw new RescheduleRequestNotFoundException(requestId);
    if (request.centerId !== centerId) throw new ForbiddenException();

    return request;
  }

  async approve(staffId: number, requestId: number, dto: ApproveRescheduleBody) {
    const centerId = await this.getCenterId(staffId);

    const request = await this.prisma.classRescheduleRequests.findUnique({
      where: { id: requestId },
      include: { batchClass: true },
    });

    if (!request) throw new RescheduleRequestNotFoundException(requestId);
    if (request.centerId !== centerId) throw new ForbiddenException();
    if (request.status !== 'pending') {
      throw new BusinessRuleException('Request is no longer pending');
    }

    this.logger.log('Approving reschedule request', { requestId, centerId, staffId });

    const updated = await this.prisma.classRescheduleRequests.update({
      where: { id: requestId },
      data: {
        status: 'approved',
        proposedSchedule: dto.proposedSchedule as object,
        adminNotes: dto.adminNotes,
        reviewedBy: staffId,
        reviewedAt: new Date(),
      },
    });

    this.logger.log('Reschedule request approved', { requestId });
    return updated;
  }

  async reject(staffId: number, requestId: number, dto: RejectRescheduleBody) {
    const centerId = await this.getCenterId(staffId);

    const request = await this.prisma.classRescheduleRequests.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new RescheduleRequestNotFoundException(requestId);
    if (request.centerId !== centerId) throw new ForbiddenException();
    if (request.status !== 'pending') {
      throw new BusinessRuleException('Request is no longer pending');
    }

    this.logger.log('Rejecting reschedule request', { requestId, centerId, staffId });

    return this.prisma.classRescheduleRequests.update({
      where: { id: requestId },
      data: {
        status: 'rejected',
        adminNotes: dto.adminNotes,
        reviewedBy: staffId,
        reviewedAt: new Date(),
      },
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

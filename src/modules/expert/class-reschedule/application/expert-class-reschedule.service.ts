import { Injectable, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '../../../../common/utils/pagination.util.js';
import { BusinessRuleException } from '../../../../common/exceptions/business-rule.exception.js';
import { RescheduleRequestNotFoundException } from '../domain/errors/expert-class-reschedule.errors.js';
import type { QueryRescheduleQuery, CreateRescheduleBody } from '../infrastructure/http/dto/expert-class-reschedule.dto.js';

@Injectable()
export class ExpertClassRescheduleService {
  private readonly logger = new Logger(ExpertClassRescheduleService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(expertId: number, query: QueryRescheduleQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const { status } = query;

    const where: Record<string, unknown> = {
      requesterType: 'expert',
      requesterId: BigInt(expertId),
    };
    if (status) where.status = status;

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

  async findOne(expertId: number, id: number) {
    const request = await this.prisma.classRescheduleRequests.findUnique({
      where: { id },
      include: {
        batchClass: {
          include: {
            batch: { select: { id: true, batchName: true, expertId: true } },
          },
        },
      },
    });

    if (!request) throw new RescheduleRequestNotFoundException(id);
    if (request.requesterType !== 'expert' || request.requesterId !== BigInt(expertId)) {
      throw new ForbiddenException();
    }

    return request;
  }

  async create(expertId: number, dto: CreateRescheduleBody) {
    const batchClass = await this.prisma.batchClasses.findUnique({
      where: { id: dto.batchClassId },
      include: { batch: { select: { expertId: true, centerId: true } } },
    });

    if (!batchClass) throw new NotFoundException(`Batch class with id ${dto.batchClassId} not found`);
    if (batchClass.batch.expertId !== expertId) {
      throw new BusinessRuleException('This class does not belong to you', { batchClassId: dto.batchClassId });
    }

    this.logger.log('Creating reschedule request', { expertId, batchClassId: dto.batchClassId });

    return this.prisma.classRescheduleRequests.create({
      data: {
        centerId: batchClass.batch.centerId,
        batchClassId: dto.batchClassId,
        requesterType: 'expert',
        requesterId: BigInt(expertId),
        reason: dto.reason,
        status: 'pending',
        ...(dto.proposedSchedule !== undefined && {
          proposedSchedule: dto.proposedSchedule as Prisma.InputJsonValue,
        }),
      },
    });
  }
}

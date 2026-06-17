import {
  Injectable,
  Logger,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import {
  paginationParams,
  buildPaginatedResult,
} from '../../../../common/utils/pagination.util.js';
import { BusinessRuleException } from '../../../../common/exceptions/business-rule.exception.js';
import {
  BatchNotFoundException,
  BatchClassNotFoundException,
} from '../domain/errors/batch.errors.js';
import type {
  CreateBatchBody,
  UpdateBatchBody,
  QueryBatchesQuery,
  MarkAttendanceBody,
} from '../infrastructure/http/dto/center-batches.dto.js';

@Injectable()
export class CenterBatchesService {
  private readonly logger = new Logger(CenterBatchesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(staffId: number, query: QueryBatchesQuery) {
    const centerId = await this.getCenterId(staffId);
    const { skip, take, page, limit } = paginationParams(query);
    const {
      search,
      status,
      batchType,
      expertId,
      serviceId,
      startDateFrom,
      startDateTo,
    } = query;

    const where: Record<string, unknown> = { centerId };
    if (status) where.status = status;
    if (batchType) where.batchType = batchType;
    if (expertId) where.expertId = expertId;
    if (serviceId) where.serviceId = serviceId;
    if (search) where.batchName = { contains: search, mode: 'insensitive' };

    if (startDateFrom || startDateTo) {
      const dateFilter: Record<string, unknown> = {};
      if (startDateFrom) dateFilter.gte = startDateFrom;
      if (startDateTo) dateFilter.lte = startDateTo;
      where.startDate = dateFilter;
    }

    const [items, total] = await Promise.all([
      this.prisma.batches.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          expert: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
            },
          },
          service: { select: { id: true, serviceName: true } },
          _count: { select: { enrollments: true, classes: true } },
        },
      }),
      this.prisma.batches.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(staffId: number, batchId: number) {
    const centerId = await this.getCenterId(staffId);

    const batch = await this.prisma.batches.findUnique({
      where: { id: batchId },
      include: {
        expert: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            phoneNumber: true,
          },
        },
        service: { select: { id: true, serviceName: true } },
        benefits: true,
        media: true,
        classes: {
          orderBy: { classDate: 'asc' },
          select: {
            id: true,
            classDate: true,
            startTime: true,
            endTime: true,
            status: true,
            classType: true,
          },
        },
        _count: { select: { enrollments: true } },
      },
    });

    if (!batch) throw new BatchNotFoundException(batchId);
    if (batch.centerId !== centerId) throw new ForbiddenException();

    return batch;
  }

  async create(staffId: number, dto: CreateBatchBody) {
    const centerId = await this.getCenterId(staffId);
    this.logger.log('Creating batch', { centerId, batchName: dto.batchName });

    const expertMembership = await this.prisma.centerHasManyExperts.findUnique({
      where: { center_expert_unique: { centerId, expertId: dto.expertId } },
    });

    if (!expertMembership || !expertMembership.isActive) {
      throw new BusinessRuleException('Expert is not a member of this center', {
        centerId,
        expertId: dto.expertId,
      });
    }

    const { benefits, frequency, ...batchData } = dto;

    const batch = await this.prisma.batches.create({
      data: {
        ...batchData,
        frequency: frequency as Prisma.InputJsonValue,
        centerId,
        createdBy: staffId,
        ...(benefits && {
          benefits: {
            createMany: {
              data: benefits.map((b, i) => ({
                benefitTitle: b.benefitTitle,
                benefitDescription: b.benefitDescription,
                benefitType: b.benefitType,
                displayOrder: i,
                createdBy: staffId,
              })),
            },
          },
        }),
      },
      include: {
        expert: { select: { id: true, firstName: true, lastName: true } },
        service: { select: { id: true, serviceName: true } },
        benefits: true,
      },
    });

    this.logger.log('Batch created', { batchId: batch.id, centerId });
    return batch;
  }

  async update(staffId: number, batchId: number, dto: UpdateBatchBody) {
    const centerId = await this.getCenterId(staffId);

    const batch = await this.prisma.batches.findUnique({
      where: { id: batchId },
    });
    if (!batch) throw new BatchNotFoundException(batchId);
    if (batch.centerId !== centerId) throw new ForbiddenException();

    if (batch.status === 'completed' || batch.status === 'cancelled') {
      throw new BusinessRuleException(
        'Cannot update a completed or cancelled batch',
      );
    }

    this.logger.log('Updating batch', { batchId, centerId, staffId });

    const { expertId, frequency, ...restDto } = dto;
    return this.prisma.batches.update({
      where: { id: batchId },
      data: {
        ...restDto,
        ...(frequency !== undefined && {
          frequency: frequency as Prisma.InputJsonValue,
        }),
        ...(expertId !== undefined && {
          expert: { connect: { id: expertId } },
        }),
        lastModifiedBy: staffId,
      },
    });
  }

  async remove(staffId: number, batchId: number) {
    const centerId = await this.getCenterId(staffId);

    const batch = await this.prisma.batches.findUnique({
      where: { id: batchId },
    });
    if (!batch) throw new BatchNotFoundException(batchId);
    if (batch.centerId !== centerId) throw new ForbiddenException();

    if (batch.status === 'active') {
      const activeEnrollments = await this.prisma.batchEnrollments.count({
        where: { batchId, status: { in: ['enrolled', 'pending'] } },
      });
      if (activeEnrollments > 0) {
        throw new BusinessRuleException(
          'Cannot delete batch with active enrollments',
          {
            batchId,
            activeEnrollments,
          },
        );
      }
    }

    this.logger.log('Deleting batch', { batchId, centerId });
    await this.prisma.batches.update({
      where: { id: batchId },
      data: { status: 'cancelled', lastModifiedBy: staffId },
    });

    return { message: 'Batch cancelled successfully' };
  }

  async getEnrollments(staffId: number, batchId: number) {
    const centerId = await this.getCenterId(staffId);

    const batch = await this.prisma.batches.findUnique({
      where: { id: batchId },
    });
    if (!batch) throw new BatchNotFoundException(batchId);
    if (batch.centerId !== centerId) throw new ForbiddenException();

    return this.prisma.batchEnrollments.findMany({
      where: { batchId },
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
        payments: {
          select: {
            id: true,
            status: true,
            totalAmount: true,
            paymentDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCalendar(staffId: number, batchId: number) {
    const centerId = await this.getCenterId(staffId);

    const batch = await this.prisma.batches.findUnique({
      where: { id: batchId },
    });
    if (!batch) throw new BatchNotFoundException(batchId);
    if (batch.centerId !== centerId) throw new ForbiddenException();

    return this.prisma.batchClasses.findMany({
      where: { batchId },
      orderBy: { classDate: 'asc' },
      select: {
        id: true,
        classDate: true,
        startTime: true,
        endTime: true,
        status: true,
        classType: true,
        expert: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async getClassAttendance(staffId: number, classId: number) {
    const centerId = await this.getCenterId(staffId);

    const batchClass = await this.prisma.batchClasses.findUnique({
      where: { id: classId },
      include: { batch: { select: { centerId: true } } },
    });

    if (!batchClass) throw new BatchClassNotFoundException(classId);
    if (batchClass.batch.centerId !== centerId) throw new ForbiddenException();

    return this.prisma.batchClassAttendence.findMany({
      where: { batchClassId: classId },
      include: {
        learnerProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  async markAttendance(
    staffId: number,
    classId: number,
    dto: MarkAttendanceBody,
  ) {
    const centerId = await this.getCenterId(staffId);

    const batchClass = await this.prisma.batchClasses.findUnique({
      where: { id: classId },
      include: { batch: { select: { centerId: true } } },
    });

    if (!batchClass) throw new BatchClassNotFoundException(classId);
    if (batchClass.batch.centerId !== centerId) throw new ForbiddenException();

    this.logger.log('Marking attendance for class', {
      classId,
      centerId,
      staffId,
    });

    // Upsert each attendance record: update if exists for this class + enrollment, create otherwise
    const results = await Promise.all(
      dto.attendances.map(async (a) => {
        const existing = await this.prisma.batchClassAttendence.findFirst({
          where: {
            batchClassId: classId,
            batchEnrollmentId: a.batchEnrollmentId,
            learnerProfileId: a.learnerProfileId,
          },
          select: { id: true },
        });

        if (existing) {
          return this.prisma.batchClassAttendence.update({
            where: { id: existing.id },
            data: {
              attendanceStatus: a.attendanceStatus,
              notes: a.notes,
              attendanceMarkedBy: staffId,
              attendanceMarkedAt: new Date(),
            },
          });
        }

        return this.prisma.batchClassAttendence.create({
          data: {
            batchClassId: classId,
            learnerProfileId: a.learnerProfileId,
            batchEnrollmentId: a.batchEnrollmentId,
            attendanceStatus: a.attendanceStatus,
            notes: a.notes,
            attendanceMarkedBy: staffId,
            attendanceMarkedAt: new Date(),
          },
        });
      }),
    );

    this.logger.log('Attendance marked', { classId, count: results.length });
    return results;
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

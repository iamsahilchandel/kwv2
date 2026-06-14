import { Injectable, Logger, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '../../../../common/utils/pagination.util.js';
import { EnrollmentNotFoundException } from '../domain/errors/enrollment.errors.js';
import type { QueryEnrollmentsQuery, UpdateEnrollmentBody } from '../infrastructure/http/dto/center-enrollments.dto.js';

@Injectable()
export class CenterEnrollmentsService {
  private readonly logger = new Logger(CenterEnrollmentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(staffId: number, query: QueryEnrollmentsQuery) {
    const centerId = await this.getCenterId(staffId);
    const { skip, take, page, limit } = paginationParams(query);
    const { search, status, batchId } = query;

    const where: Record<string, unknown> = { batch: { centerId } };
    if (status) where.status = status;
    if (batchId) where.batchId = batchId;
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
      this.prisma.batchEnrollments.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          batch: { select: { id: true, batchName: true, batchType: true } },
          learnerProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      }),
      this.prisma.batchEnrollments.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(staffId: number, enrollmentId: number) {
    const centerId = await this.getCenterId(staffId);

    const enrollment = await this.prisma.batchEnrollments.findUnique({
      where: { id: enrollmentId },
      include: {
        batch: { select: { id: true, batchName: true, centerId: true, batchType: true, status: true } },
        learnerProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        payments: true,
      },
    });

    if (!enrollment) throw new EnrollmentNotFoundException(enrollmentId);
    if (enrollment.batch.centerId !== centerId) throw new ForbiddenException();

    return enrollment;
  }

  async update(staffId: number, enrollmentId: number, dto: UpdateEnrollmentBody) {
    const centerId = await this.getCenterId(staffId);

    const enrollment = await this.prisma.batchEnrollments.findUnique({
      where: { id: enrollmentId },
      include: { batch: { select: { centerId: true } } },
    });

    if (!enrollment) throw new EnrollmentNotFoundException(enrollmentId);
    if (enrollment.batch.centerId !== centerId) throw new ForbiddenException();

    this.logger.log('Updating enrollment', { enrollmentId, centerId, staffId });

    return this.prisma.batchEnrollments.update({
      where: { id: enrollmentId },
      data: { ...dto, lastModifiedBy: staffId },
    });
  }

  async approve(staffId: number, enrollmentId: number) {
    const centerId = await this.getCenterId(staffId);

    const enrollment = await this.prisma.batchEnrollments.findUnique({
      where: { id: enrollmentId },
      include: { batch: { select: { centerId: true } } },
    });

    if (!enrollment) throw new EnrollmentNotFoundException(enrollmentId);
    if (enrollment.batch.centerId !== centerId) throw new ForbiddenException();

    this.logger.log('Approving enrollment (PAC)', { enrollmentId, centerId, staffId });

    return this.prisma.batchEnrollments.update({
      where: { id: enrollmentId },
      data: { status: 'enrolled', lastModifiedBy: staffId },
    });
  }

  async reject(staffId: number, enrollmentId: number) {
    const centerId = await this.getCenterId(staffId);

    const enrollment = await this.prisma.batchEnrollments.findUnique({
      where: { id: enrollmentId },
      include: { batch: { select: { centerId: true } } },
    });

    if (!enrollment) throw new EnrollmentNotFoundException(enrollmentId);
    if (enrollment.batch.centerId !== centerId) throw new ForbiddenException();

    this.logger.log('Rejecting enrollment (PAC)', { enrollmentId, centerId, staffId });

    return this.prisma.batchEnrollments.update({
      where: { id: enrollmentId },
      data: { status: 'rejected', lastModifiedBy: staffId },
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

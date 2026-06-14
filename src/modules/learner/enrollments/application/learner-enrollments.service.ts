import {
  Injectable,
  Logger,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '../../../../common/utils/pagination.util.js';
import { BusinessRuleException } from '../../../../common/exceptions/business-rule.exception.js';
import { AlreadyEnrolledException, EnrollmentNotFoundException } from '../domain/errors/enrollment.errors.js';
import type {
  CreateEnrollmentDto,
  QueryEnrollmentsDto,
} from '../infrastructure/http/dto/learner-enrollments.dto.js';

@Injectable()
export class LearnerEnrollmentsService {
  private readonly logger = new Logger(LearnerEnrollmentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getProfileId(learnerId: number): Promise<number> {
    const learner = await this.prisma.learners.findUnique({
      where: { id: learnerId },
      select: { profileId: true },
    });
    if (!learner?.profileId) throw new ForbiddenException('Learner profile required to enroll');
    return Number(learner.profileId);
  }

  async create(learnerId: number, dto: CreateEnrollmentDto) {
    const profileId = await this.getProfileId(learnerId);
    this.logger.log('Creating enrollment', { learnerId, batchId: dto.batchId });

    const existing = await this.prisma.batchEnrollments.findFirst({
      where: { batchId: dto.batchId, learnerProfileId: profileId, status: 'enrolled' },
    });

    if (existing) throw new AlreadyEnrolledException(dto.batchId);

    const batch = await this.prisma.batches.findUnique({
      where: { id: dto.batchId },
      include: { center: { select: { id: true, centerName: true } } },
    });

    if (!batch) throw new NotFoundException(`Batch ${dto.batchId} not found`);
    if (batch.status !== 'active') {
      throw new BusinessRuleException('Batch is not accepting enrollments', { batchId: dto.batchId, status: batch.status });
    }

    const enrolledCount = await this.prisma.batchEnrollments.count({
      where: { batchId: dto.batchId, status: { in: ['enrolled', 'pending'] } },
    });

    if (batch.numberOfSeats && enrolledCount >= batch.numberOfSeats) {
      throw new BusinessRuleException('Batch is full', { batchId: dto.batchId });
    }

    const classesBooked = dto.classesBooked ?? batch.numberOfClasses ?? 1;
    if (batch.minimumClassesBooking && classesBooked < batch.minimumClassesBooking) {
      throw new BusinessRuleException(
        `Minimum ${batch.minimumClassesBooking} classes required`,
        { batchId: dto.batchId, requested: classesBooked },
      );
    }

    const startDate = dto.startDate ?? batch.startDate ?? new Date();
    const endDate = dto.endDate ?? batch.endDate ?? batch.startDate;
    const orderId = `enroll_${profileId}_${dto.batchId}_${Date.now()}`;
    const totalAmount = Number(batch.basePrice ?? 0) * classesBooked;

    let discountAmount = 0;
    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({ where: { code: dto.couponCode } });
      if (coupon && coupon.status === 'active' && coupon.endDate >= new Date()) {
        discountAmount =
          coupon.type === 'percentage'
            ? Math.min((totalAmount * Number(coupon.value)) / 100, Number(coupon.maxDiscountAmount ?? Infinity))
            : Number(coupon.value);
      }
    }

    const finalAmount = Math.max(0, totalAmount - discountAmount);

    const [enrollment, payment] = await this.prisma.$transaction([
      this.prisma.batchEnrollments.create({
        data: {
          batchId: dto.batchId,
          learnerProfileId: profileId,
          status: 'pending',
          numberOfClassesPaid: classesBooked,
          startDate,
          endDate,
          paidAmount: finalAmount,
        },
      }),
      this.prisma.payment.create({
        data: {
          paymentType: 'batch_payment',
          learnerProfileId: profileId,
          centerId: batch.centerId,
          orderId,
          baseAmount: totalAmount,
          discount: discountAmount,
          totalAmount: finalAmount,
          amount: finalAmount,
          currency: 'INR',
          paymentMethod: dto.paymentMethod,
          status: 'pending',
        },
      }),
    ]);

    // Link payment to enrollment
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { enrollmentId: enrollment.id },
    });

    this.logger.log('Enrollment created', { enrollmentId: enrollment.id, orderId });
    return { enrollment, payment, orderId };
  }

  async findAll(learnerId: number, query: QueryEnrollmentsDto) {
    const profileId = await this.getProfileId(learnerId);
    const { skip, take, page, limit } = paginationParams(query);
    const { status, batchId } = query;

    const where: Record<string, unknown> = { learnerProfileId: profileId };
    if (status) where.status = status;
    if (batchId) where.batchId = batchId;

    const [items, total] = await Promise.all([
      this.prisma.batchEnrollments.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          batch: {
            include: {
              expert: { select: { id: true, firstName: true, lastName: true, profilePicture: true } },
              service: { select: { id: true, serviceName: true } },
              center: { select: { id: true, centerName: true } },
            },
          },
          payments: {
            select: { id: true, status: true, totalAmount: true, paymentDate: true, orderId: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.batchEnrollments.count({ where }),
    ]);

    this.logger.debug('Fetched learner enrollments', { learnerId, total });
    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(learnerId: number, enrollmentId: number) {
    const profileId = await this.getProfileId(learnerId);

    const enrollment = await this.prisma.batchEnrollments.findUnique({
      where: { id: enrollmentId },
      include: {
        batch: {
          include: {
            expert: { select: { id: true, firstName: true, lastName: true } },
            service: { select: { id: true, serviceName: true } },
            center: { select: { id: true, centerName: true } },
          },
        },
        payments: true,
      },
    });

    if (!enrollment) throw new EnrollmentNotFoundException(enrollmentId);
    if (enrollment.learnerProfileId !== profileId) throw new ForbiddenException();

    return enrollment;
  }

  async cancel(learnerId: number, enrollmentId: number) {
    const profileId = await this.getProfileId(learnerId);

    const enrollment = await this.prisma.batchEnrollments.findUnique({ where: { id: enrollmentId } });
    if (!enrollment) throw new EnrollmentNotFoundException(enrollmentId);
    if (enrollment.learnerProfileId !== profileId) throw new ForbiddenException();

    if (!['pending', 'enrolled'].includes(enrollment.status)) {
      throw new BusinessRuleException('Enrollment cannot be cancelled', { status: enrollment.status });
    }

    this.logger.log('Cancelling enrollment', { enrollmentId, learnerId });
    return this.prisma.batchEnrollments.update({
      where: { id: enrollmentId },
      data: { status: 'cancelled' },
    });
  }

  async getPaymentDetails(learnerId: number, enrollmentId: number) {
    const profileId = await this.getProfileId(learnerId);

    const enrollment = await this.prisma.batchEnrollments.findUnique({ where: { id: enrollmentId } });
    if (!enrollment) throw new EnrollmentNotFoundException(enrollmentId);
    if (enrollment.learnerProfileId !== profileId) throw new ForbiddenException();

    return this.prisma.payment.findMany({
      where: { enrollmentId },
      include: { transactions: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}

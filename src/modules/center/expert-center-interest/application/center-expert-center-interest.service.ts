import {
  Injectable,
  Logger,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import {
  paginationParams,
  buildPaginatedResult,
} from '../../../../common/utils/pagination.util.js';
import { BusinessRuleException } from '../../../../common/exceptions/business-rule.exception.js';
import { InterestNotFoundException } from '../domain/errors/expert-center-interest.errors.js';
import type {
  CreateInterestBody,
  RespondInterestBody,
  QueryInterestsQuery,
} from '../infrastructure/http/dto/center-expert-center-interest.dto.js';

@Injectable()
export class CenterExpertCenterInterestService {
  private readonly logger = new Logger(CenterExpertCenterInterestService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(staffId: number, query: QueryInterestsQuery) {
    const centerId = await this.getCenterId(staffId);
    const { skip, take, page, limit } = paginationParams(query);
    const { status } = query;

    const where: Record<string, unknown> = { centerId };
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.expertCenterInterest.findMany({
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
              email: true,
              phoneNumber: true,
              profilePicture: true,
            },
          },
          interestServices: {
            include: { service: { select: { id: true, serviceName: true } } },
          },
        },
      }),
      this.prisma.expertCenterInterest.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async create(staffId: number, dto: CreateInterestBody) {
    const centerId = await this.getCenterId(staffId);
    this.logger.log('Creating center interest in expert', {
      centerId,
      expertId: dto.expertId,
    });

    const existing = await this.prisma.expertCenterInterest.findFirst({
      where: { centerId, expertId: dto.expertId, status: 'pending' },
    });

    if (existing) {
      throw new ConflictException(
        'A pending interest for this expert already exists',
      );
    }

    const interest = await this.prisma.expertCenterInterest.create({
      data: {
        centerId,
        expertId: dto.expertId,
        initiator: 'center',
        status: 'pending',
        message: dto.message,
        offeredCompensation: dto.offeredCompensation,
        ...(dto.preferredWorkingTimeSlots !== undefined && {
          preferredWorkingTimeSlots:
            dto.preferredWorkingTimeSlots as Prisma.InputJsonValue,
        }),
      },
    });

    this.logger.log('Expert center interest created', {
      interestId: interest.id,
    });
    return interest;
  }

  async accept(staffId: number, interestId: number, dto: RespondInterestBody) {
    const centerId = await this.getCenterId(staffId);

    const interest = await this.prisma.expertCenterInterest.findUnique({
      where: { id: interestId },
    });
    if (!interest) throw new InterestNotFoundException(interestId);
    if (interest.centerId !== centerId) throw new ForbiddenException();
    if (interest.initiator !== 'expert') {
      throw new BusinessRuleException(
        'Can only accept expert-initiated interests',
      );
    }
    if (interest.status !== 'pending') {
      throw new BusinessRuleException('Interest is no longer pending');
    }

    this.logger.log('Accepting expert interest', { interestId, centerId });

    return this.prisma.expertCenterInterest.update({
      where: { id: interestId },
      data: {
        status: 'accepted',
        responseMessage: dto.responseMessage,
        responseDate: new Date(),
      },
    });
  }

  async reject(staffId: number, interestId: number, dto: RespondInterestBody) {
    const centerId = await this.getCenterId(staffId);

    const interest = await this.prisma.expertCenterInterest.findUnique({
      where: { id: interestId },
    });
    if (!interest) throw new InterestNotFoundException(interestId);
    if (interest.centerId !== centerId) throw new ForbiddenException();
    if (interest.status !== 'pending') {
      throw new BusinessRuleException('Interest is no longer pending');
    }

    this.logger.log('Rejecting expert interest', { interestId, centerId });

    return this.prisma.expertCenterInterest.update({
      where: { id: interestId },
      data: {
        status: 'rejected',
        responseMessage: dto.responseMessage,
        responseDate: new Date(),
      },
    });
  }

  async withdraw(staffId: number, interestId: number) {
    const centerId = await this.getCenterId(staffId);

    const interest = await this.prisma.expertCenterInterest.findUnique({
      where: { id: interestId },
    });
    if (!interest) throw new InterestNotFoundException(interestId);
    if (interest.centerId !== centerId) throw new ForbiddenException();
    if (interest.initiator !== 'center') {
      throw new BusinessRuleException(
        'Can only withdraw center-initiated interests',
      );
    }
    if (interest.status !== 'pending') {
      throw new BusinessRuleException('Interest is no longer pending');
    }

    this.logger.log('Withdrawing center interest', { interestId, centerId });

    return this.prisma.expertCenterInterest.update({
      where: { id: interestId },
      data: { status: 'withdrawn' },
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

import {
  Injectable,
  Logger,
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
} from '../infrastructure/http/dto/expert-expert-center-interest.dto.js';

@Injectable()
export class ExpertExpertCenterInterestService {
  private readonly logger = new Logger(ExpertExpertCenterInterestService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(expertId: number, query: QueryInterestsQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const { status, initiator } = query;

    const where: Record<string, unknown> = { expertId };
    if (status) where.status = status;
    if (initiator) where.initiator = initiator;

    const [items, total] = await Promise.all([
      this.prisma.expertCenterInterest.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          center: {
            select: {
              id: true,
              centerName: true,
              address: true,
              phoneNumber: true,
              email: true,
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

  async create(expertId: number, dto: CreateInterestBody) {
    this.logger.log('Creating expert interest in center', {
      expertId,
      centerId: dto.centerId,
    });

    const existing = await this.prisma.expertCenterInterest.findFirst({
      where: {
        expertId,
        centerId: dto.centerId,
        status: 'pending',
        initiator: 'expert',
      },
    });

    if (existing) {
      throw new ConflictException(
        'A pending expert-initiated interest for this center already exists',
      );
    }

    const { services, preferredWorkingTimeSlots, ...restDto } = dto;

    const interest = await this.prisma.expertCenterInterest.create({
      data: {
        expertId,
        centerId: dto.centerId,
        initiator: 'expert',
        status: 'pending',
        message: restDto.message,
        expectedCompensation: restDto.expectedCompensation,
        experienceYears: restDto.experienceYears,
        ...(preferredWorkingTimeSlots !== undefined && {
          preferredWorkingTimeSlots:
            preferredWorkingTimeSlots as Prisma.InputJsonValue,
        }),
        interestServices: {
          createMany: {
            data: services.map((s) => ({
              serviceId: s.serviceId,
              experienceYears: s.experienceYears,
              preferredForService: s.preferredForService ?? false,
            })),
          },
        },
      },
      include: {
        interestServices: {
          include: { service: { select: { id: true, serviceName: true } } },
        },
      },
    });

    this.logger.log('Expert center interest created', {
      interestId: interest.id,
    });
    return interest;
  }

  async withdraw(expertId: number, id: number) {
    const interest = await this.prisma.expertCenterInterest.findUnique({
      where: { id },
    });

    if (!interest) throw new InterestNotFoundException(id);
    if (interest.expertId !== expertId) throw new ForbiddenException();
    if (interest.initiator !== 'expert') {
      throw new BusinessRuleException(
        'Can only withdraw expert-initiated interests',
      );
    }
    if (interest.status !== 'pending') {
      throw new BusinessRuleException('Interest is no longer pending');
    }

    this.logger.log('Withdrawing expert interest', {
      expertId,
      interestId: id,
    });

    return this.prisma.expertCenterInterest.update({
      where: { id },
      data: { status: 'withdrawn' },
    });
  }

  async acceptCenterInterest(expertId: number, id: number) {
    const interest = await this.prisma.expertCenterInterest.findUnique({
      where: { id },
    });

    if (!interest) throw new InterestNotFoundException(id);
    if (interest.expertId !== expertId) throw new ForbiddenException();
    if (interest.initiator !== 'center') {
      throw new BusinessRuleException(
        'Can only accept center-initiated interests',
      );
    }
    if (interest.status !== 'pending') {
      throw new BusinessRuleException('Interest is no longer pending');
    }

    this.logger.log('Expert accepting center interest', {
      expertId,
      interestId: id,
    });

    const updated = await this.prisma.expertCenterInterest.update({
      where: { id },
      data: {
        status: 'accepted',
        responseDate: new Date(),
      },
    });

    // Upsert center membership
    const existingMembership = await this.prisma.centerHasManyExperts.findFirst(
      {
        where: { expertId, centerId: interest.centerId },
        select: { id: true },
      },
    );

    if (existingMembership) {
      await this.prisma.centerHasManyExperts.update({
        where: { id: existingMembership.id },
        data: { isActive: true },
      });
    } else {
      await this.prisma.centerHasManyExperts.create({
        data: { expertId, centerId: interest.centerId, isActive: true },
      });
    }

    return updated;
  }

  async rejectCenterInterest(
    expertId: number,
    id: number,
    dto: RespondInterestBody,
  ) {
    const interest = await this.prisma.expertCenterInterest.findUnique({
      where: { id },
    });

    if (!interest) throw new InterestNotFoundException(id);
    if (interest.expertId !== expertId) throw new ForbiddenException();
    if (interest.initiator !== 'center') {
      throw new BusinessRuleException(
        'Can only reject center-initiated interests',
      );
    }
    if (interest.status !== 'pending') {
      throw new BusinessRuleException('Interest is no longer pending');
    }

    this.logger.log('Expert rejecting center interest', {
      expertId,
      interestId: id,
    });

    return this.prisma.expertCenterInterest.update({
      where: { id },
      data: {
        status: 'rejected',
        responseMessage: dto.responseMessage,
        responseDate: new Date(),
      },
    });
  }
}

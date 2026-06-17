import {
  Injectable,
  Logger,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import {
  paginationParams,
  buildPaginatedResult,
} from '../../../../common/utils/pagination.util.js';
import { BusinessRuleException } from '../../../../common/exceptions/business-rule.exception.js';
import { CenterExpertNotFoundException } from '../domain/errors/center-experts.errors.js';
import type {
  QueryCenterExpertsQuery,
  AddExpertBody,
} from '../infrastructure/http/dto/center-experts.dto.js';

@Injectable()
export class CenterExpertsService {
  private readonly logger = new Logger(CenterExpertsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(staffId: number, query: QueryCenterExpertsQuery) {
    const centerId = await this.getCenterId(staffId);
    const { skip, take, page, limit } = paginationParams(query);
    const { search, isActive, serviceId } = query;

    const expertWhere: Record<string, unknown> = {};
    if (isActive !== undefined) expertWhere.isActive = isActive;
    if (search) {
      expertWhere.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search } },
      ];
    }
    if (serviceId) {
      expertWhere.experties = { some: { expertiesId: serviceId } };
    }

    const where = {
      centerId,
      expert: Object.keys(expertWhere).length ? expertWhere : undefined,
    };

    const [items, total] = await Promise.all([
      this.prisma.centerHasManyExperts.findMany({
        where,
        skip,
        take,
        orderBy: { joinedOn: 'desc' },
        include: {
          expert: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
              profilePicture: true,
              isActive: true,
              isVerified: true,
              experties: {
                select: {
                  service: { select: { id: true, serviceName: true } },
                },
              },
            },
          },
        },
      }),
      this.prisma.centerHasManyExperts.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(staffId: number, expertId: number) {
    const centerId = await this.getCenterId(staffId);

    const membership = await this.prisma.centerHasManyExperts.findUnique({
      where: { center_expert_unique: { centerId, expertId } },
      include: {
        expert: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            profilePicture: true,
            isActive: true,
            isVerified: true,
            gender: true,
            about: true,
            media: true,
            kycDocs: true,
            experties: {
              select: {
                experienceYears: true,
                service: { select: { id: true, serviceName: true } },
              },
            },
          },
        },
      },
    });

    if (!membership) throw new CenterExpertNotFoundException(expertId);
    return membership;
  }

  async add(staffId: number, dto: AddExpertBody) {
    const centerId = await this.getCenterId(staffId);
    this.logger.log('Adding expert to center', {
      centerId,
      expertId: dto.expertId,
    });

    const expert = await this.prisma.experts.findUnique({
      where: { id: dto.expertId },
    });
    if (!expert) throw new CenterExpertNotFoundException(dto.expertId);

    const existing = await this.prisma.centerHasManyExperts.findUnique({
      where: { center_expert_unique: { centerId, expertId: dto.expertId } },
    });

    if (existing) {
      if (existing.isActive) {
        throw new ConflictException('Expert is already part of this center');
      }
      return this.prisma.centerHasManyExperts.update({
        where: { id: existing.id },
        data: { isActive: true, joinedOn: dto.joinedOn ?? new Date() },
      });
    }

    const membership = await this.prisma.centerHasManyExperts.create({
      data: {
        centerId,
        expertId: dto.expertId,
        joinedOn: dto.joinedOn ?? new Date(),
        isActive: true,
      },
    });

    this.logger.log('Expert added to center', {
      centerId,
      expertId: dto.expertId,
    });
    return membership;
  }

  async remove(staffId: number, expertId: number) {
    const centerId = await this.getCenterId(staffId);

    const membership = await this.prisma.centerHasManyExperts.findUnique({
      where: { center_expert_unique: { centerId, expertId } },
    });
    if (!membership) throw new CenterExpertNotFoundException(expertId);

    const activeAssignments = await this.prisma.batches.count({
      where: { centerId, expertId, status: 'active' },
    });
    if (activeAssignments > 0) {
      throw new BusinessRuleException(
        'Cannot remove expert with active batch assignments',
        { centerId, expertId, activeAssignments },
      );
    }

    this.logger.log('Removing expert from center', { centerId, expertId });

    await this.prisma.centerHasManyExperts.update({
      where: { id: membership.id },
      data: { isActive: false },
    });

    return { message: 'Expert removed from center' };
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

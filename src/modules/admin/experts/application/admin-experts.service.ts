import { Injectable, Logger } from '@nestjs/common';
import { omit } from 'lodash';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import { BusinessRuleException } from '@/common/exceptions/business-rule.exception.js';
import { ExpertNotFoundException } from '../domain/errors/expert.errors.js';
import type { QueryExpertsDto } from '../infrastructure/http/dto/query-experts.dto.js';
import type { UpdateExpertDto } from '../infrastructure/http/dto/update-expert.dto.js';

@Injectable()
export class AdminExpertsService {
  private readonly logger = new Logger(AdminExpertsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryExpertsDto) {
    const { skip, take, page, limit } = paginationParams(query);
    const { tab, isActive, isVerified, search, startDate, endDate } = query;

    const where: Record<string, unknown> = {};

    if (tab === 'active') where.isActive = true;
    else if (tab === 'inactive') where.isActive = false;
    else if (tab === 'verified') where.isVerified = true;
    else if (tab === 'unverified') where.isVerified = false;

    if (isActive !== undefined) where.isActive = isActive;
    if (isVerified !== undefined) where.isVerified = isVerified;

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (startDate && endDate) {
      where.createdAt = { gte: new Date(startDate), lte: new Date(`${endDate}T23:59:59.999Z`) };
    }

    const [experts, total] = await Promise.all([
      this.prisma.experts.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, firstName: true, lastName: true, email: true,
          phoneNumber: true, isActive: true, isVerified: true, createdAt: true,
        },
      }),
      this.prisma.experts.count({ where }),
    ]);

    return buildPaginatedResult(experts, total, page, limit);
  }

  async findOne(id: number) {
    const expert = await this.prisma.experts.findUnique({
      where: { id },
      omit: { firebaseUid: true },
    });
    if (!expert) throw new ExpertNotFoundException(id);
    return expert;
  }

  async update(id: number, dto: UpdateExpertDto) {
    const expert = await this.prisma.experts.findUnique({ where: { id } });
    if (!expert) throw new ExpertNotFoundException(id);

    this.logger.log('Updating expert', { expertId: id });
    const updated = await this.prisma.experts.update({ where: { id }, data: dto });
    return omit(updated, ['firebaseUid']);
  }

  async remove(id: number) {
    const expert = await this.prisma.experts.findUnique({ where: { id } });
    if (!expert) throw new ExpertNotFoundException(id);

    const activeBatches = await this.prisma.batches.count({
      where: { expertId: id, status: 'active' },
    });
    if (activeBatches > 0) {
      throw new BusinessRuleException('Cannot delete expert with active batches', { expertId: id, activeBatches });
    }

    await this.prisma.experts.delete({ where: { id } });
    this.logger.log(`Expert ${id} deleted`);
    return { message: 'Expert deleted successfully' };
  }
}

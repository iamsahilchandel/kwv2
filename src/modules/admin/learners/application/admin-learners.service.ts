import { Injectable, Logger } from '@nestjs/common';
import { omit } from 'lodash';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import { LearnerNotFoundException } from '../domain/errors/learner.errors.js';
import type { QueryLearnersQuery } from '../infrastructure/http/dto/query-learners.dto.js';
import type { UpdateLearnerBody } from '../infrastructure/http/dto/update-learner.dto.js';

@Injectable()
export class AdminLearnersService {
  private readonly logger = new Logger(AdminLearnersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryLearnersQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const { search, startDate, endDate } = query;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (startDate && endDate) {
      where.createdAt = { gte: new Date(startDate), lte: new Date(`${endDate}T23:59:59.999Z`) };
    }

    const [learners, total] = await Promise.all([
      this.prisma.learners.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, firstName: true, lastName: true, email: true,
          phoneNumber: true, termsAccepted: true, createdAt: true,
        },
      }),
      this.prisma.learners.count({ where }),
    ]);

    return buildPaginatedResult(learners, total, page, limit);
  }

  async findOne(id: number) {
    const learner = await this.prisma.learners.findUnique({
      where: { id },
      omit: { firebaseUid: true },
    });
    if (!learner) throw new LearnerNotFoundException(id);
    return learner;
  }

  async update(id: number, dto: UpdateLearnerBody) {
    const learner = await this.prisma.learners.findUnique({ where: { id } });
    if (!learner) throw new LearnerNotFoundException(id);

    this.logger.log('Updating learner', { learnerId: id });
    const updated = await this.prisma.learners.update({ where: { id }, data: dto });
    return omit(updated, ['firebaseUid']);
  }

  async remove(id: number) {
    const learner = await this.prisma.learners.findUnique({ where: { id } });
    if (!learner) throw new LearnerNotFoundException(id);

    await this.prisma.learners.delete({ where: { id } });
    this.logger.log(`Learner ${id} deleted`);
    return { message: 'Learner deleted successfully' };
  }
}

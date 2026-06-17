import {
  Injectable,
  Logger,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import {
  paginationParams,
  buildPaginatedResult,
} from '../../../../common/utils/pagination.util.js';
import { BusinessRuleException } from '../../../../common/exceptions/business-rule.exception.js';
import { PollNotFoundException } from '../domain/errors/reschedule-poll.errors.js';
import type {
  CreatePollBody,
  UpdatePollBody,
  ClosePollBody,
  QueryPollsQuery,
} from '../infrastructure/http/dto/center-reschedule-polls.dto.js';

@Injectable()
export class CenterReschedulePollsService {
  private readonly logger = new Logger(CenterReschedulePollsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(staffId: number, query: QueryPollsQuery) {
    const centerId = await this.getCenterId(staffId);
    const { skip, take, page, limit } = paginationParams(query);
    const { status } = query;

    const where: Record<string, unknown> = { centerId };
    if (status) where.pollStatus = status;

    const [items, total] = await Promise.all([
      this.prisma.reschedulePolls.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          options: {
            include: {
              _count: { select: { responses: true } },
            },
          },
          batchClass: {
            select: {
              id: true,
              classDate: true,
              batch: { select: { id: true, batchName: true } },
            },
          },
        },
      }),
      this.prisma.reschedulePolls.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(staffId: number, pollId: number) {
    const centerId = await this.getCenterId(staffId);

    const poll = await this.prisma.reschedulePolls.findUnique({
      where: { id: pollId },
      include: {
        options: {
          include: {
            responses: true,
            _count: { select: { responses: true } },
          },
          orderBy: { optionOrder: 'asc' },
        },
        batchClass: {
          include: {
            batch: { select: { id: true, batchName: true, centerId: true } },
          },
        },
      },
    });

    if (!poll) throw new PollNotFoundException(pollId);
    if (poll.centerId !== centerId) throw new ForbiddenException();

    return poll;
  }

  async create(staffId: number, dto: CreatePollBody) {
    const centerId = await this.getCenterId(staffId);
    this.logger.log('Creating reschedule poll', { centerId });

    if (dto.batchClassId) {
      const batchClass = await this.prisma.batchClasses.findUnique({
        where: { id: dto.batchClassId },
        include: { batch: { select: { centerId: true } } },
      });
      if (!batchClass)
        throw new NotFoundException(`Class ${dto.batchClassId} not found`);
      if (batchClass.batch.centerId !== centerId)
        throw new ForbiddenException();
    }

    const poll = await this.prisma.reschedulePolls.create({
      data: {
        centerId,
        title: dto.title,
        description: dto.description,
        closingDate: dto.closingDate,
        batchClassId: dto.batchClassId,
        rescheduleRequestId: dto.rescheduleRequestId,
        pollStatus: 'active',
        options: {
          createMany: {
            data: dto.options.map((opt) => ({
              proposedDate: opt.proposedDate,
              proposedStartTime: this.parseTimeString(opt.proposedStartTime),
              proposedEndTime: this.parseTimeString(opt.proposedEndTime),
              optionOrder: opt.optionOrder,
            })),
          },
        },
      },
      include: { options: true },
    });

    this.logger.log('Reschedule poll created', { pollId: poll.id });
    return poll;
  }

  async update(staffId: number, pollId: number, dto: UpdatePollBody) {
    const centerId = await this.getCenterId(staffId);

    const poll = await this.prisma.reschedulePolls.findUnique({
      where: { id: pollId },
    });
    if (!poll) throw new PollNotFoundException(pollId);
    if (poll.centerId !== centerId) throw new ForbiddenException();
    if (poll.pollStatus !== 'active') {
      throw new BusinessRuleException('Cannot update a closed poll');
    }

    return this.prisma.reschedulePolls.update({
      where: { id: pollId },
      data: dto,
    });
  }

  async close(staffId: number, pollId: number, dto: ClosePollBody) {
    const centerId = await this.getCenterId(staffId);

    const poll = await this.prisma.reschedulePolls.findUnique({
      where: { id: pollId },
      include: { options: true },
    });
    if (!poll) throw new PollNotFoundException(pollId);
    if (poll.centerId !== centerId) throw new ForbiddenException();
    if (poll.pollStatus !== 'active') {
      throw new BusinessRuleException('Poll is already closed');
    }

    const selectedOption = poll.options.find(
      (o) => o.id === dto.selectedOptionId,
    );
    if (!selectedOption) {
      throw new BusinessRuleException(
        'Selected option does not belong to this poll',
      );
    }

    this.logger.log('Closing poll with selected option', {
      pollId,
      selectedOptionId: dto.selectedOptionId,
    });

    await this.prisma.$transaction(async (tx) => {
      await tx.reschedulePolls.update({
        where: { id: pollId },
        data: { pollStatus: 'closed' },
      });

      if (poll.batchClassId) {
        await tx.batchClasses.update({
          where: { id: poll.batchClassId },
          data: {
            classDate: selectedOption.proposedDate,
            startTime: selectedOption.proposedStartTime,
            endTime: selectedOption.proposedEndTime,
            status: 'rescheduled',
          },
        });
      }
    });

    this.logger.log('Poll closed and class rescheduled', { pollId });
    return { message: 'Poll closed and class rescheduled to selected option' };
  }

  private parseTimeString(time: string): Date {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds ?? 0, 0);
    return date;
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

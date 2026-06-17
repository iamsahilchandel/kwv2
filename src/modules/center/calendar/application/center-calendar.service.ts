import {
  Injectable,
  Logger,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import type {
  CalendarQuery,
  DailyScheduleQuery,
  CreateBatchClassBody,
  UpdateBatchClassBody,
} from '../infrastructure/http/dto/center-calendar.dto.js';

@Injectable()
export class CenterCalendarService {
  private readonly logger = new Logger(CenterCalendarService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCalendar(staffId: number, query: CalendarQuery) {
    const centerId = await this.getCenterId(staffId);
    const { startDate, endDate, batchId } = query;

    this.logger.log('Fetching calendar', { centerId, startDate, endDate });

    const batchWhere: Record<string, unknown> = {
      centerId,
      status: { in: ['active', 'inactive'] },
      startDate: { lte: endDate },
      OR: [{ endDate: null }, { endDate: { gte: startDate } }],
    };
    if (batchId) batchWhere.id = batchId;

    const batches = await this.prisma.batches.findMany({
      where: batchWhere,
      select: {
        id: true,
        batchName: true,
        batchType: true,
        startDate: true,
        endDate: true,
        status: true,
        frequency: true,
        service: { select: { id: true, serviceName: true } },
        expert: { select: { id: true, firstName: true, lastName: true } },
        classes: {
          where: {
            classDate: { gte: startDate, lte: endDate },
          },
          select: {
            id: true,
            classDate: true,
            startTime: true,
            endTime: true,
            status: true,
            classType: true,
          },
          orderBy: { classDate: 'asc' },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    return batches;
  }

  async getDailySchedule(staffId: number, query: DailyScheduleQuery) {
    const centerId = await this.getCenterId(staffId);
    const { date } = query;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    this.logger.log('Fetching daily schedule', { centerId, date });

    return this.prisma.batchClasses.findMany({
      where: {
        classDate: { gte: startOfDay, lte: endOfDay },
        batch: { centerId },
      },
      include: {
        batch: {
          select: {
            id: true,
            batchName: true,
            service: { select: { id: true, serviceName: true } },
          },
        },
        expert: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async createClass(staffId: number, dto: CreateBatchClassBody) {
    const centerId = await this.getCenterId(staffId);

    const batch = await this.prisma.batches.findUnique({
      where: { id: dto.batchId },
    });
    if (!batch) throw new NotFoundException(`Batch ${dto.batchId} not found`);
    if (batch.centerId !== centerId) throw new ForbiddenException();

    this.logger.log('Creating batch class', { centerId, batchId: dto.batchId });

    const startTime = this.parseTimeString(dto.startTime);
    const endTime = this.parseTimeString(dto.endTime);

    const created = await this.prisma.batchClasses.create({
      data: {
        batchId: dto.batchId,
        classDate: dto.classDate,
        startTime,
        endTime,
        classType: dto.classType ?? 'regular',
        expertId: dto.expertId ?? batch.expertId,
        createdBy: staffId,
      },
    });

    this.logger.log('Batch class created', { classId: created.id });
    return created;
  }

  async updateClass(
    staffId: number,
    classId: number,
    dto: UpdateBatchClassBody,
  ) {
    const centerId = await this.getCenterId(staffId);

    const batchClass = await this.prisma.batchClasses.findUnique({
      where: { id: classId },
      include: { batch: { select: { centerId: true } } },
    });

    if (!batchClass) throw new NotFoundException(`Class ${classId} not found`);
    if (batchClass.batch.centerId !== centerId) throw new ForbiddenException();

    this.logger.log('Updating batch class', { classId, centerId });

    const updateData: Record<string, unknown> = { lastModifiedBy: staffId };
    if (dto.classDate) updateData.classDate = dto.classDate;
    if (dto.startTime)
      updateData.startTime = this.parseTimeString(dto.startTime);
    if (dto.endTime) updateData.endTime = this.parseTimeString(dto.endTime);
    if (dto.status) updateData.status = dto.status;
    if (dto.expertId) updateData.expertId = dto.expertId;

    return this.prisma.batchClasses.update({
      where: { id: classId },
      data: updateData,
    });
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

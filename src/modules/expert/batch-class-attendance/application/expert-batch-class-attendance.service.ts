import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { BatchClassNotFoundException } from '../domain/errors/batch-class-attendance.errors.js';
import type { MarkAttendanceBody } from '../infrastructure/http/dto/expert-batch-class-attendance.dto.js';

@Injectable()
export class ExpertBatchClassAttendanceService {
  private readonly logger = new Logger(ExpertBatchClassAttendanceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getClassAttendance(expertId: number, classId: number) {
    const batchClass = await this.prisma.batchClasses.findUnique({
      where: { id: classId },
      include: { batch: { select: { expertId: true } } },
    });

    if (!batchClass) throw new BatchClassNotFoundException(classId);
    if (batchClass.batch.expertId !== expertId) throw new ForbiddenException();

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

  async markAttendance(expertId: number, classId: number, dto: MarkAttendanceBody) {
    const batchClass = await this.prisma.batchClasses.findUnique({
      where: { id: classId },
      include: { batch: { select: { expertId: true } } },
    });

    if (!batchClass) throw new BatchClassNotFoundException(classId);
    if (batchClass.batch.expertId !== expertId) throw new ForbiddenException();

    this.logger.log('Marking attendance for class', { classId, expertId });

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
              attendanceMarkedBy: expertId,
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
            attendanceMarkedBy: expertId,
            attendanceMarkedAt: new Date(),
          },
        });
      }),
    );

    this.logger.log('Attendance marked', { classId, count: results.length });
    return results;
  }
}

import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';

@Injectable()
export class LearnerPicklistsService {
  private readonly logger = new Logger(LearnerPicklistsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getProfileId(learnerId: number): Promise<number | null> {
    const learner = await this.prisma.learners.findUnique({
      where: { id: learnerId },
      select: { profileId: true },
    });
    return learner?.profileId ? Number(learner.profileId) : null;
  }

  async getActivities(learnerId: number) {
    const profileId = await this.getProfileId(learnerId);
    if (!profileId) return [];

    const enrollments = await this.prisma.batchEnrollments.findMany({
      where: { learnerProfileId: profileId },
      select: { batch: { select: { serviceId: true } } },
    });

    const serviceIds = [
      ...new Set(
        enrollments.map((e) => e.batch?.serviceId).filter(Boolean) as number[],
      ),
    ];
    if (serviceIds.length === 0) return [];

    this.logger.debug('Fetching associated activities for learner picklist', {
      learnerId,
    });
    return this.prisma.services.findMany({
      where: { id: { in: serviceIds } },
      orderBy: { serviceName: 'asc' },
      select: { id: true, serviceName: true, serviceGroup: true },
    });
  }

  async getCenters(learnerId: number) {
    const profileId = await this.getProfileId(learnerId);
    if (!profileId) return [];

    this.logger.debug('Fetching associated centers for learner picklist', {
      learnerId,
    });
    return this.prisma.center.findMany({
      where: {
        isActive: true,
        batches: {
          some: {
            enrollments: {
              some: {
                learnerProfileId: profileId,
                status: { in: ['enrolled', 'completed'] },
              },
            },
          },
        },
      },
      orderBy: { centerName: 'asc' },
      select: { id: true, centerName: true },
    });
  }

  async getBatchTypes(learnerId: number) {
    const profileId = await this.getProfileId(learnerId);
    if (!profileId) return [];

    this.logger.debug('Fetching associated batch types for learner picklist', {
      learnerId,
    });
    const result = await this.prisma.batchEnrollments.findMany({
      where: {
        learnerProfileId: profileId,
        status: { in: ['enrolled', 'completed'] },
      },
      select: { batch: { select: { batchType: true } } },
      distinct: ['batchId'],
    });

    return [
      ...new Set(result.map((e) => e.batch?.batchType).filter(Boolean)),
    ].sort();
  }

  async getExperts(learnerId: number) {
    const profileId = await this.getProfileId(learnerId);
    if (!profileId) return [];

    this.logger.debug('Fetching associated experts for learner picklist', {
      learnerId,
    });
    const enrollments = await this.prisma.batchEnrollments.findMany({
      where: {
        learnerProfileId: profileId,
        status: { in: ['enrolled', 'completed'] },
      },
      select: {
        batch: {
          select: {
            expert: { select: { id: true, firstName: true, lastName: true } },
            service: { select: { id: true, serviceName: true } },
            center: { select: { id: true, centerName: true } },
          },
        },
      },
    });

    const expertMap = new Map<number, unknown>();
    for (const e of enrollments) {
      const expert = e.batch?.expert;
      if (expert && !expertMap.has(expert.id)) {
        expertMap.set(expert.id, {
          id: expert.id,
          firstName: expert.firstName,
          lastName: expert.lastName,
          serviceName: e.batch?.service?.serviceName,
          centerName: e.batch?.center?.centerName,
        });
      }
    }

    return Array.from(expertMap.values());
  }
}

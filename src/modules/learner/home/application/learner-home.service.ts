import { Injectable, Logger } from '@nestjs/common';
import { orderBy } from 'lodash';
import { PrismaService } from '../../../../core/database/prisma.service.js';

@Injectable()
export class LearnerHomeService {
  private readonly logger = new Logger(LearnerHomeService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getHome(learnerId: number) {
    this.logger.log('Fetching home for learner', { learnerId });

    const learner = await this.prisma.learners.findUnique({
      where: { id: learnerId },
      select: { profileId: true, firstName: true },
    });

    const profileId = learner?.profileId ? Number(learner.profileId) : null;

    const [
      banners,
      upcomingClasses,
      recentBatches,
      notifications,
    ] = await Promise.all([
      // Active learner/all banners
      this.prisma.advertisingBanners.findMany({
        where: { type: { in: ['learner', 'all'] }, isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // Next 5 upcoming classes for enrolled batches
      profileId
        ? this.prisma.batchClasses.findMany({
            where: {
              classDate: { gte: new Date() },
              status: { in: ['scheduled', 'rescheduled'] },
              batch: {
                enrollments: {
                  some: {
                    learnerProfileId: profileId,
                    status: { in: ['enrolled', 'rescheduled'] },
                  },
                },
              },
            },
            orderBy: { classDate: 'asc' },
            take: 5,
            include: {
              batch: {
                select: {
                  id: true,
                  batchName: true,
                  service: { select: { id: true, serviceName: true } },
                  center: { select: { id: true, centerName: true } },
                },
              },
              expert: { select: { id: true, firstName: true, lastName: true } },
            },
          })
        : Promise.resolve([]),

      // Recent enrolled batches
      profileId
        ? this.prisma.batchEnrollments.findMany({
            where: { learnerProfileId: profileId, status: { in: ['enrolled', 'completed'] } },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
              batch: {
                include: {
                  expert: { select: { id: true, firstName: true, lastName: true, profilePicture: true } },
                  service: { select: { id: true, serviceName: true } },
                  center: { select: { id: true, centerName: true } },
                },
              },
            },
          })
        : Promise.resolve([]),

      // Unread notification count
      profileId
        ? this.prisma.notifications.count({
            where: { userId: BigInt(learnerId), userType: 'learner', readAt: null },
          })
        : Promise.resolve(0),
    ]);

    const sortedBatches = orderBy(recentBatches, [(e) => e.batch?.startDate], ['desc']);

    this.logger.log('Home data fetched', { learnerId, banners: banners.length, upcomingClasses: upcomingClasses.length });

    return {
      learner: { id: learnerId, firstName: learner?.firstName },
      banners,
      upcomingClasses,
      recentBatches: sortedBatches,
      unreadNotifications: notifications,
    };
  }
}

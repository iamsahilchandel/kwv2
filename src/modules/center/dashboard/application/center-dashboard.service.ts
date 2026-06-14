import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';

@Injectable()
export class CenterDashboardService {
  private readonly logger = new Logger(CenterDashboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(staffId: number) {
    const centerId = await this.getCenterId(staffId);
    this.logger.log('Fetching dashboard metrics', { centerId });

    const [
      totalBatches,
      activeBatches,
      totalExperts,
      totalLearners,
      totalEnrollments,
      pendingEnrollments,
    ] = await Promise.all([
      this.prisma.batches.count({ where: { centerId } }),
      this.prisma.batches.count({ where: { centerId, status: 'active' } }),
      this.prisma.centerHasManyExperts.count({ where: { centerId, isActive: true } }),
      this.prisma.learnerProfileHasManyCenters.count({ where: { centerId } }),
      this.prisma.batchEnrollments.count({
        where: { batch: { centerId } },
      }),
      this.prisma.batchEnrollments.count({
        where: { batch: { centerId }, status: 'pending' },
      }),
    ]);

    return {
      totalBatches,
      activeBatches,
      totalExperts,
      totalLearners,
      totalEnrollments,
      pendingEnrollments,
    };
  }

  async getEnrollmentMetrics(staffId: number) {
    const centerId = await this.getCenterId(staffId);
    this.logger.log('Fetching enrollment metrics', { centerId });

    const enrollments = await this.prisma.batchEnrollments.groupBy({
      by: ['status'],
      where: { batch: { centerId } },
      _count: { id: true },
    });

    return enrollments.map((e) => ({ status: e.status, count: e._count.id }));
  }

  async getRevenueMetrics(staffId: number) {
    const centerId = await this.getCenterId(staffId);
    this.logger.log('Fetching revenue metrics', { centerId });

    const payments = await this.prisma.payment.aggregate({
      where: { centerId, status: 'successful' },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    const pendingPayments = await this.prisma.payment.aggregate({
      where: { centerId, status: 'pending' },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    return {
      totalRevenue: payments._sum.totalAmount ?? 0,
      totalTransactions: payments._count.id,
      pendingAmount: pendingPayments._sum.totalAmount ?? 0,
      pendingTransactions: pendingPayments._count.id,
    };
  }

  private async getCenterId(staffId: number): Promise<number> {
    const membership = await this.prisma.centerHasManyStaff.findFirst({
      where: { staffId, isActive: true, center: { isActive: true } },
      select: { centerId: true },
    });
    if (!membership) throw new UnauthorizedException('No active center found for staff');
    return membership.centerId;
  }
}

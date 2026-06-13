import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';

@Injectable()
export class AdminDashboardService {
  private readonly logger = new Logger(AdminDashboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getStaffRoleDistribution(adminId: number) {
    this.logger.log('Fetching staff role distribution', { adminId });

    const rows = await this.prisma.appAdminStaff.groupBy({
      by: ['role'],
      _count: { id: true },
    });

    return rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.role] = r._count.id;
      return acc;
    }, {});
  }

  async getCentersByServices(adminId: number) {
    this.logger.log('Fetching centers by services', { adminId });

    // Group centers by their associated services
    const results = await this.prisma.$queryRaw<
      Array<{ serviceId: number; serviceName: string; centerCount: bigint }>
    >`
      SELECT s.id AS "serviceId", s.service_name AS "serviceName", COUNT(DISTINCT cs.center_id) AS "centerCount"
      FROM services s
      LEFT JOIN center_services cs ON cs.service_id = s.id
      GROUP BY s.id, s.service_name
      ORDER BY "centerCount" DESC
    `;

    return results.map((r) => ({ ...r, centerCount: Number(r.centerCount) }));
  }

  async getCentersByServiceId(serviceId: number, adminId: number) {
    this.logger.log('Fetching centers by serviceId', { adminId, serviceId });

    const centers = await this.prisma.center.findMany({
      where: { centerServices: { some: { serviceId } } },
      select: {
        id: true,
        centerName: true,
        isActive: true,
        isVerified: true,
        address: true,
      },
      orderBy: { centerName: 'asc' },
    });

    return centers;
  }

  async getInquiryStats(adminId: number) {
    this.logger.log('Fetching inquiry stats', { adminId });

    const [total, byStatus] = await Promise.all([
      this.prisma.centerInquiries.count(),
      this.prisma.centerInquiries.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ]);

    const statusCounts = byStatus.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = r._count.id;
      return acc;
    }, {});

    return { total, byStatus: statusCounts };
  }

  async getStaffMetrics(adminId: number) {
    this.logger.log('Fetching staff metrics', { adminId });

    const [total, active, inactive, recentlyAdded] = await Promise.all([
      this.prisma.appAdminStaff.count(),
      this.prisma.appAdminStaff.count({ where: { isActive: true } }),
      this.prisma.appAdminStaff.count({ where: { isActive: false } }),
      this.prisma.appAdminStaff.findMany({
        where: {
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        select: { id: true, fullName: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return { total, active, inactive, recentlyAdded };
  }

  async getStaffList(adminId: number) {
    this.logger.log('Fetching staff list with hierarchy', { adminId });

    return this.prisma.appAdminStaff.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        manager: { select: { id: true, fullName: true, role: true } },
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async getRolesStats(adminId: number) {
    this.logger.log('Fetching roles stats', { adminId });

    const rows = await this.prisma.appAdminStaff.groupBy({
      by: ['role'],
      _count: { id: true },
      where: {},
    });

    return rows.map((r) => ({ role: r.role, count: r._count.id }));
  }

  async getStaffGrowth(adminId: number) {
    this.logger.log('Fetching staff growth (last 6 months)', { adminId });

    const months: Array<{ month: string; year: number; newStaff: number }> = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      start.setMonth(start.getMonth() - i);

      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      const count = await this.prisma.appAdminStaff.count({
        where: { createdAt: { gte: start, lt: end } },
      });

      months.push({
        month: start.toLocaleString('default', { month: 'long' }),
        year: start.getFullYear(),
        newStaff: count,
      });
    }

    return months;
  }

  async getHierarchyMetrics(adminId: number) {
    this.logger.log('Fetching hierarchy metrics', { adminId });

    // Count direct reports per manager
    const results = await this.prisma.$queryRaw<
      Array<{
        managerId: number;
        fullName: string;
        role: string;
        directReports: bigint;
      }>
    >`
      SELECT m.id AS "managerId", m.full_name AS "fullName", m.role, COUNT(s.id) AS "directReports"
      FROM app_admin_staff m
      INNER JOIN app_admin_staff s ON s.reports_to = m.id
      GROUP BY m.id, m.full_name, m.role
      ORDER BY "directReports" DESC
    `;

    return results.map((r) => ({
      ...r,
      directReports: Number(r.directReports),
    }));
  }

  async getCenterMetrics(adminId: number) {
    this.logger.log('Fetching center metrics', { adminId });

    const [total, byType, byVerification] = await Promise.all([
      this.prisma.center.count({ where: { isActive: true } }),
      this.prisma.center.groupBy({
        by: ['centerType'],
        _count: { id: true },
        where: { isActive: true },
      }),
      this.prisma.center.groupBy({ by: ['isVerified'], _count: { id: true } }),
    ]);

    return {
      total,
      byType: byType.reduce<Record<string, number>>((acc, r) => {
        acc[r.centerType ?? 'unknown'] = r._count.id;
        return acc;
      }, {}),
      byVerification: byVerification.reduce<Record<string, number>>(
        (acc, r) => {
          acc[r.isVerified ? 'verified' : 'unverified'] = r._count.id;
          return acc;
        },
        {},
      ),
    };
  }

  async getCenterById(id: number, adminId: number) {
    this.logger.log('Fetching center detail for dashboard', {
      adminId,
      centerId: id,
    });

    return this.prisma.center.findUnique({
      where: { id },
      select: {
        id: true,
        centerName: true,
        email: true,
        phoneNumber: true,
        isActive: true,
        isVerified: true,
        centerType: true,
        address: true,
        createdAt: true,
      },
    });
  }
}

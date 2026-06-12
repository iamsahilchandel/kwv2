import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { chunk } from 'lodash';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import { CouponStatus } from '@/generated/prisma/enums.js';
import { CouponNotFoundException, CouponCodeAlreadyExistsException } from '../domain/errors/coupon.errors.js';
import type { CreateCouponBody } from '../infrastructure/http/dto/create-coupon.dto.js';
import type { CreateCouponBatchBody } from '../infrastructure/http/dto/create-coupon-batch.dto.js';
import type { UpdateCouponBody } from '../infrastructure/http/dto/update-coupon.dto.js';
import type { QueryCouponsQuery } from '../infrastructure/http/dto/query-coupons.dto.js';

@Injectable()
export class AdminCouponsService {
  private readonly logger = new Logger(AdminCouponsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCouponBody, adminId: number) {
    const code = dto.code ? dto.code.toUpperCase() : this.generateCode(8);

    this.logger.log('Creating coupon', { adminId, code });

    this.validateCouponValues(dto.type, dto.value, dto.startDate, dto.endDate);

    const existing = await this.prisma.coupon.findFirst({ where: { code } });
    if (existing) throw new CouponCodeAlreadyExistsException(code);

    const status = new Date(dto.endDate) < new Date() ? CouponStatus.expired : CouponStatus.active;

    const coupon = await this.prisma.coupon.create({
      data: {
        ...dto,
        code,
        status,
        usageCount: 0,
        description: dto.description ?? `${dto.value}${dto.type === 'percentage' ? '%' : '₹'} off`,
        createdBy: adminId,
      },
    });

    this.logger.log('Coupon created', { couponId: coupon.id, code });
    return coupon;
  }

  async generateBatch(dto: CreateCouponBatchBody, adminId: number) {
    this.logger.log('Generating coupon batch', { adminId, count: dto.count });
    this.validateCouponValues(dto.type, dto.value, dto.startDate, dto.endDate);

    const status = new Date(dto.endDate) < new Date() ? CouponStatus.expired : CouponStatus.active;
    const prefix = dto.prefix ?? '';
    const description = dto.description ?? `${dto.value}${dto.type === 'percentage' ? '%' : '₹'} off`;

    // Generate unique codes
    const codes = new Set<string>();
    while (codes.size < dto.count) {
      codes.add(`${prefix}${this.generateCode(8)}`);
    }

    const coupons = Array.from(codes).map((code) => ({
      code,
      description,
      type: dto.type,
      value: dto.value,
      minPurchaseAmount: dto.minPurchaseAmount,
      maxDiscountAmount: dto.maxDiscountAmount,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      usageLimit: dto.usageLimit ?? 1,
      usageCount: 0,
      userUsageLimit: dto.userUsageLimit ?? 1,
      status,
      applicableTo: dto.applicableTo,
      centerId: dto.centerId,
      batchId: dto.batchId,
      isFirstPurchaseOnly: dto.isFirstPurchaseOnly ?? false,
      createdBy: adminId,
    }));

    // Batch insert in chunks of 100 to avoid DB statement size limits
    let totalCreated = 0;
    for (const batch of chunk(coupons, 100)) {
      const result = await this.prisma.coupon.createMany({ data: batch });
      totalCreated += result.count;
    }

    this.logger.log('Coupon batch generated', { adminId, count: totalCreated });
    return { count: totalCreated };
  }

  async findAll(query: QueryCouponsQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const { status, type, applicableTo, centerId, batchId, search } = query;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (applicableTo) where.applicableTo = applicableTo;
    if (centerId) where.centerId = centerId;
    if (batchId) where.batchId = batchId;
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async getAnalytics() {
    this.logger.log('Fetching coupon analytics');

    const [total, active, expired, depleted] = await Promise.all([
      this.prisma.coupon.count(),
      this.prisma.coupon.count({ where: { status: CouponStatus.active } }),
      this.prisma.coupon.count({ where: { status: CouponStatus.expired } }),
      this.prisma.coupon.count({ where: { status: CouponStatus.depleted } }),
    ]);

    // Top redeemed coupons via raw query for performance
    const topCoupons = await this.prisma.$queryRaw<Array<{
      couponId: number; code: string; redemptionsCount: bigint; totalDiscount: number;
    }>>`
      SELECT cr.coupon_id AS "couponId", c.code, COUNT(cr.id) AS "redemptionsCount",
             COALESCE(SUM(cr.discount_amount), 0) AS "totalDiscount"
      FROM coupon_redemptions cr
      INNER JOIN coupons c ON c.id = cr.coupon_id
      GROUP BY cr.coupon_id, c.code
      ORDER BY "redemptionsCount" DESC
      LIMIT 10
    `;

    const totalRedemptions = await this.prisma.couponRedemption.count();
    const totalDiscount = await this.prisma.couponRedemption.aggregate({ _sum: { discountAmount: true } });

    return {
      overview: { total, active, expired, depleted, totalRedemptions, totalDiscountAmount: totalDiscount._sum.discountAmount ?? 0 },
      topCoupons: topCoupons.map((r) => ({ ...r, redemptionsCount: Number(r.redemptionsCount) })),
    };
  }

  async update(id: number, dto: UpdateCouponBody, adminId: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new CouponNotFoundException(id);

    if (dto.endDate && new Date(coupon.startDate) > new Date(dto.endDate)) {
      throw new BadRequestException('End date must be after the coupon start date');
    }

    this.logger.log('Updating coupon', { couponId: id, adminId });
    return this.prisma.coupon.update({
      where: { id },
      data: { ...dto, lastModifiedBy: adminId },
    });
  }

  private validateCouponValues(type: string, value: number, startDate: string, endDate: string) {
    if (type === 'percentage' && (value <= 0 || value > 100)) {
      throw new BadRequestException('Percentage value must be between 1 and 100');
    }
    if (type !== 'percentage' && value <= 0) {
      throw new BadRequestException('Fixed amount must be greater than 0');
    }
    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestException('Start date must be before end date');
    }
  }

  private generateCode(length: number): string {
    return crypto.randomUUID().replace(/-/g, '').slice(0, length).toUpperCase();
  }
}

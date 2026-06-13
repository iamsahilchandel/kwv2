import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import {
  AdminRole,
  CenterType,
  CenterOperatingEntity,
  CenterInquiryStatus,
  ServiceGroup,
  CenterMediaType,
  CenterVerificationStatus,
  CenterStaffRole,
  VerificationMode,
  CenterStaffDocumentType,
  CenterDocumentType,
  AgreementType,
  Gender,
  BatchType,
  BatchStatus,
} from '@/generated/prisma/enums.js';

@Injectable()
export class AdminPicklistsService {
  private readonly logger = new Logger(AdminPicklistsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getStaffPicklist(role?: string) {
    const where: Record<string, unknown> = { isActive: true };
    if (role) where.role = role;

    return this.prisma.appAdminStaff.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        role: true,
        email: true,
        isActive: true,
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async getCentersPicklist(search?: string) {
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { centerName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const centers = await this.prisma.center.findMany({
      where,
      select: {
        id: true,
        centerName: true,
        isActive: true,
        email: true,
        address: true,
      },
      orderBy: { centerName: 'asc' },
      take: 100,
    });

    return centers.map((c) => {
      const addr = c.address as Record<string, unknown> | null;
      return {
        id: c.id,
        centerName: c.centerName,
        isActive: c.isActive,
        email: c.email,
        city: addr?.city ?? null,
        state: addr?.state ?? null,
      };
    });
  }

  getEnums() {
    return {
      AdminRole,
      CenterType,
      CenterOperatingEntity,
      CenterInquiryStatus,
      ServiceGroup,
      CenterMediaType,
      CenterVerificationStatus,
      CenterStaffRole,
      VerificationMode,
      CenterStaffDocumentType,
      CenterDocumentType,
      AgreementType,
      Gender,
      BatchType,
      BatchStatus,
    };
  }

  async getInquiryCities() {
    const results = await this.prisma.$queryRaw<Array<{ city: string }>>`
      SELECT DISTINCT address->>'city' AS city
      FROM center_inquiries
      WHERE address->>'city' IS NOT NULL
      ORDER BY city ASC
    `;
    return results.map((r) => r.city).filter(Boolean);
  }

  async getInquiryStates() {
    const results = await this.prisma.$queryRaw<Array<{ state: string }>>`
      SELECT DISTINCT address->>'state' AS state
      FROM center_inquiries
      WHERE address->>'state' IS NOT NULL
      ORDER BY state ASC
    `;
    return results.map((r) => r.state).filter(Boolean);
  }

  async getCenterCities() {
    const results = await this.prisma.$queryRaw<Array<{ city: string }>>`
      SELECT DISTINCT address->>'city' AS city
      FROM center
      WHERE address->>'city' IS NOT NULL
      ORDER BY city ASC
    `;
    return results.map((r) => r.city).filter(Boolean);
  }

  async getCenterStates() {
    const results = await this.prisma.$queryRaw<Array<{ state: string }>>`
      SELECT DISTINCT address->>'state' AS state
      FROM center
      WHERE address->>'state' IS NOT NULL
      ORDER BY state ASC
    `;
    return results.map((r) => r.state).filter(Boolean);
  }
}

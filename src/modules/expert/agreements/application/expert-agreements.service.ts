import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import { AgreementStatus } from '@/generated/prisma/enums.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import { BusinessRuleException } from '@/common/exceptions/business-rule.exception.js';
import { AgreementNotFoundException } from '../domain/errors/expert-agreements.errors.js';
import type { QueryAgreementsQuery, RejectAgreementBody } from '../infrastructure/http/dto/expert-agreements.dto.js';

@Injectable()
export class ExpertAgreementsService {
  private readonly logger = new Logger(ExpertAgreementsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(expertId: number, query: QueryAgreementsQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const { status } = query;

    const where: Record<string, unknown> = { signedByExpert: expertId };
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.agreements.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          center: { select: { id: true, centerName: true } },
        },
      }),
      this.prisma.agreements.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(expertId: number, id: number) {
    const agreement = await this.prisma.agreements.findUnique({
      where: { id },
      include: {
        center: { select: { id: true, centerName: true, address: true } },
      },
    });

    if (!agreement) throw new AgreementNotFoundException(id);
    if (agreement.signedByExpert !== expertId) throw new ForbiddenException();

    return agreement;
  }

  async accept(expertId: number, id: number) {
    const agreement = await this.prisma.agreements.findUnique({ where: { id } });

    if (!agreement) throw new AgreementNotFoundException(id);
    if (agreement.signedByExpert !== expertId) throw new ForbiddenException();
    if (agreement.status !== AgreementStatus.pending) {
      throw new BusinessRuleException('Agreement is no longer pending');
    }

    this.logger.log('Expert accepting agreement', { expertId, agreementId: id });

    return this.prisma.agreements.update({
      where: { id },
      data: {
        status: AgreementStatus.approved,
        approvedOn: new Date(),
      },
    });
  }

  async reject(expertId: number, id: number, dto: RejectAgreementBody) {
    const agreement = await this.prisma.agreements.findUnique({ where: { id } });

    if (!agreement) throw new AgreementNotFoundException(id);
    if (agreement.signedByExpert !== expertId) throw new ForbiddenException();
    if (agreement.status !== AgreementStatus.pending) {
      throw new BusinessRuleException('Agreement is no longer pending');
    }

    this.logger.log('Expert rejecting agreement', { expertId, agreementId: id });

    return this.prisma.agreements.update({
      where: { id },
      data: {
        status: AgreementStatus.rejected,
        rejectedOn: new Date(),
        rejectionReason: [dto.reason],
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';
import type { IHealthServicePort } from './ports/health.service.port.js';
import { HealthEntity } from '../domain/health.entity.js';

@Injectable()
export class HealthService implements IHealthServicePort {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthEntity> {
    let status: HealthEntity['status'] = 'ok';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      status = 'degraded';
    }

    return new HealthEntity(status);
  }
}

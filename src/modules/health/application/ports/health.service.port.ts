import type { HealthEntity } from '../../domain/health.entity.js';

export interface IHealthServicePort {
  check(): Promise<HealthEntity>;
}

export const HEALTH_SERVICE_PORT = Symbol('IHealthServicePort');

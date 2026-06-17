import { Controller, Get } from '@nestjs/common';
import { Public } from '../../../../core/guards/firebase-auth.guard.js';
import { HealthService } from '../../application/health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Public()
  check() {
    return this.healthService.check();
  }
}

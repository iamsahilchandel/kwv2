import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { ExpertAuthGuard } from '../../../../../core/guards/expert-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { ExpertDashboardService } from '../../application/expert-dashboard.service.js';

const DashboardQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

type DashboardQuery = z.infer<typeof DashboardQuerySchema>;

@ApiTags('Expert - Dashboard')
@ApiBearerAuth()
@UseGuards(ExpertAuthGuard)
@Controller('expert/dashboard')
export class ExpertDashboardController {
  constructor(private readonly service: ExpertDashboardService) {}

  @Get('metrics')
  getMetrics(@CurrentUser() user: IAuthUser) {
    return this.service.getMetrics(user.id);
  }

  @Get('upcoming-classes')
  getUpcomingClasses(
    @CurrentUser() user: IAuthUser,
    @Query(new ZodValidationPipe(DashboardQuerySchema)) query: DashboardQuery,
  ) {
    return this.service.getUpcomingClasses(user.id, query);
  }

  @Get('recent-batches')
  getRecentBatches(
    @CurrentUser() user: IAuthUser,
    @Query(new ZodValidationPipe(DashboardQuerySchema)) query: DashboardQuery,
  ) {
    return this.service.getRecentBatches(user.id, query);
  }
}

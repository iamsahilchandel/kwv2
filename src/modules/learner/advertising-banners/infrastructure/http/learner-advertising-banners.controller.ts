import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LearnerAuthGuard } from '@/core/guards/learner-auth.guard.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { PaginationQuerySchema, type PaginationQuery } from '@/common/dto/pagination.dto.js';
import { LearnerAdvertisingBannersService } from '../../application/learner-advertising-banners.service.js';

@ApiTags('Learner - Advertising Banners')
@ApiBearerAuth()
@UseGuards(LearnerAuthGuard)
@Controller('learner/advertising-banners')
export class LearnerAdvertisingBannersController {
  constructor(private readonly service: LearnerAdvertisingBannersService) {}

  @Get()
  findAll(
    @Query(new ZodValidationPipe(PaginationQuerySchema)) query: PaginationQuery,
  ) {
    return this.service.findAll(query);
  }
}

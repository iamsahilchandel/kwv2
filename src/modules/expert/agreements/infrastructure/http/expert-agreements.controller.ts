import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExpertAuthGuard } from '../../../../../core/guards/expert-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { ExpertAgreementsService } from '../../application/expert-agreements.service.js';
import {
  QueryAgreementsSchema,
  type QueryAgreementsQuery,
  RejectAgreementSchema,
  type RejectAgreementBody,
} from './dto/expert-agreements.dto.js';

@ApiTags('Expert - Agreements')
@ApiBearerAuth()
@UseGuards(ExpertAuthGuard)
@Controller('expert/agreements')
export class ExpertAgreementsController {
  constructor(private readonly service: ExpertAgreementsService) {}

  @Get()
  findAll(
    @CurrentUser() user: IAuthUser,
    @Query(new ZodValidationPipe(QueryAgreementsSchema)) query: QueryAgreementsQuery,
  ) {
    return this.service.findAll(user.id, query);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(user.id, id);
  }

  @Post(':id/accept')
  accept(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.accept(user.id, id);
  }

  @Post(':id/reject')
  reject(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(RejectAgreementSchema)) dto: RejectAgreementBody,
  ) {
    return this.service.reject(user.id, id, dto);
  }
}

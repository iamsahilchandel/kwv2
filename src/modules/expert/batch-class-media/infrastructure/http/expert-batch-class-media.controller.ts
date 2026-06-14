import {
  Controller,
  Get,
  Post,
  Delete,
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
import { ExpertBatchClassMediaService } from '../../application/expert-batch-class-media.service.js';
import {
  CreateBatchClassMediaSchema,
  type CreateBatchClassMediaBody,
  QueryMediaSchema,
  type QueryMediaQuery,
} from './dto/expert-batch-class-media.dto.js';

@ApiTags('Expert - Batch Class Media')
@ApiBearerAuth()
@UseGuards(ExpertAuthGuard)
@Controller('expert/batch-class-media')
export class ExpertBatchClassMediaController {
  constructor(private readonly service: ExpertBatchClassMediaService) {}

  @Get(':classId')
  findAll(
    @CurrentUser() user: IAuthUser,
    @Param('classId', ParseIntPipe) classId: number,
    @Query(new ZodValidationPipe(QueryMediaSchema)) query: QueryMediaQuery,
  ) {
    return this.service.findAll(user.id, classId, query);
  }

  @Post(':classId')
  create(
    @CurrentUser() user: IAuthUser,
    @Param('classId', ParseIntPipe) classId: number,
    @Body(new ZodValidationPipe(CreateBatchClassMediaSchema)) dto: CreateBatchClassMediaBody,
  ) {
    return this.service.create(user.id, classId, dto);
  }

  @Delete('item/:mediaId')
  remove(
    @CurrentUser() user: IAuthUser,
    @Param('mediaId', ParseIntPipe) mediaId: number,
  ) {
    return this.service.remove(user.id, mediaId);
  }
}

import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExpertAuthGuard } from '../../../../../core/guards/expert-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ExpertCentersService } from '../../application/expert-centers.service.js';
import {
  QueryExpertCentersSchema,
  type QueryExpertCentersQuery,
  QueryExpertCentersDto,
} from './dto/expert-centers.dto.js';

@ApiTags('Expert - Centers')
@ApiBearerAuth()
@UseGuards(ExpertAuthGuard)
@Controller('expert/centers')
export class ExpertCentersController {
  constructor(private readonly service: ExpertCentersService) {}

  @Get()
  findAll(
    @CurrentUser() user: IAuthUser,
    @Query() query: QueryExpertCentersDto,
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
}

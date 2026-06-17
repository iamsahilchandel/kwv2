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
import { ExpertClassRescheduleService } from '../../application/expert-class-reschedule.service.js';
import {
  QueryRescheduleSchema,
  type QueryRescheduleQuery,
  QueryRescheduleDto,
  CreateRescheduleSchema,
  type CreateRescheduleBody,
  CreateRescheduleDto,
} from './dto/expert-class-reschedule.dto.js';

@ApiTags('Expert - Class Reschedule')
@ApiBearerAuth()
@UseGuards(ExpertAuthGuard)
@Controller('expert/class-reschedule')
export class ExpertClassRescheduleController {
  constructor(private readonly service: ExpertClassRescheduleService) {}

  @Get()
  findAll(@CurrentUser() user: IAuthUser, @Query() query: QueryRescheduleDto) {
    return this.service.findAll(user.id, query);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(user.id, id);
  }

  @Post()
  create(@CurrentUser() user: IAuthUser, @Body() dto: CreateRescheduleDto) {
    return this.service.create(user.id, dto);
  }
}

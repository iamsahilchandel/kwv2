import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/core/guards/admin-auth.guard.js';
import { LoggerFilesService } from '../../application/logger-files.service.js';
import { LogsQueryDto } from './dto/logger.dto.js';

@ApiTags('Shared - Logger')
@ApiBearerAuth('firebase-token')
@UseGuards(AdminAuthGuard)
@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerFilesService: LoggerFilesService) {}

  @ApiOperation({ summary: 'Get application logs for a given date' })
  @Get('logs')
  async getLogs(@Query() query: LogsQueryDto) {
    return this.loggerFilesService.getLogs(query.date);
  }

  @ApiOperation({ summary: 'Get error logs for a given date' })
  @Get('errors')
  async getErrors(@Query() query: LogsQueryDto) {
    return this.loggerFilesService.getErrors(query.date);
  }
}

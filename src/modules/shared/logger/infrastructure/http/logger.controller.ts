import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/core/guards/admin-auth.guard.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { LoggerFilesService } from '../../application/logger-files.service.js';
import { LogsQuerySchema, type LogsQuery } from './dto/logger.dto.js';

@ApiTags('Shared - Logger')
@ApiBearerAuth('firebase-token')
@UseGuards(AdminAuthGuard)
@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerFilesService: LoggerFilesService) {}

  @ApiOperation({ summary: 'Get application logs for a given date' })
  @Get('logs')
  async getLogs(@Query(new ZodValidationPipe(LogsQuerySchema)) query: LogsQuery) {
    return this.loggerFilesService.getLogs(query.date);
  }

  @ApiOperation({ summary: 'Get error logs for a given date' })
  @Get('errors')
  async getErrors(@Query(new ZodValidationPipe(LogsQuerySchema)) query: LogsQuery) {
    return this.loggerFilesService.getErrors(query.date);
  }
}

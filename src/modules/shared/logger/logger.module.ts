import { Module } from '@nestjs/common';
import { LoggerFilesService } from './application/logger-files.service.js';
import { LoggerController } from './infrastructure/http/logger.controller.js';

@Module({
  controllers: [LoggerController],
  providers: [LoggerFilesService],
  exports: [LoggerFilesService],
})
export class LoggerModule {}

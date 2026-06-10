import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class LogsQueryDto {
  @ApiPropertyOptional({ description: 'Date in YYYY-MM-DD format. Defaults to today.' })
  @IsOptional()
  @IsDateString()
  date?: string;
}

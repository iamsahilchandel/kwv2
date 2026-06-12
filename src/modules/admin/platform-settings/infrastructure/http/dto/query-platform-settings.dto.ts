import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '@/common/dto/pagination.dto.js';

export class QueryPlatformSettingsDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'payments' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ example: 'string' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  valueType?: string;
}

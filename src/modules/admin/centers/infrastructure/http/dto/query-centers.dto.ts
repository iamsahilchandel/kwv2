import { IsOptional, IsBoolean, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '@/common/dto/pagination.dto.js';
import { CenterType, CenterOperatingEntity } from '@/generated/prisma/enums.js';

export class QueryCentersDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isVerified?: boolean;

  @ApiPropertyOptional({ enum: CenterType })
  @IsOptional()
  @IsEnum(CenterType)
  centerType?: CenterType;

  @ApiPropertyOptional({ enum: CenterOperatingEntity })
  @IsOptional()
  @IsEnum(CenterOperatingEntity)
  operatingEntity?: CenterOperatingEntity;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;
}

import {
  IsString, IsOptional, IsBoolean, IsEnum, IsInt, IsNumber, Min, MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CenterType, CenterOperatingEntity } from '@/generated/prisma/enums.js';

export class UpdateCenterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

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
  @IsNumber()
  @Min(0)
  commissionPercentage?: number;

  @ApiPropertyOptional({ description: 'Reasons if not verified (array of strings)' })
  @IsOptional()
  reasonForNotVerified?: string[];
}

import {
  IsString, IsOptional, IsEnum, IsInt, IsBoolean, IsNumber, Min, Max, IsDateString, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CouponType, CouponApplication } from '@/generated/prisma/enums.js';

export class CreateCouponBatchDto {
  @ApiProperty({ example: 10, description: 'Number of coupons to generate (max 1000)' })
  @IsInt()
  @Min(1)
  @Max(1000)
  count: number;

  @ApiPropertyOptional({ example: 'SUMMER' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  prefix?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ enum: CouponType })
  @IsEnum(CouponType)
  type: CouponType;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0.01)
  value: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPurchaseAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  usageLimit?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  userUsageLimit?: number;

  @ApiProperty({ enum: CouponApplication })
  @IsEnum(CouponApplication)
  applicableTo: CouponApplication;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  centerId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  batchId?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFirstPurchaseOnly?: boolean;
}

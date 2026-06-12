import { IsString, IsEmail, IsOptional, IsEnum, IsArray, MaxLength, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CenterInquiryStatus } from '@/generated/prisma/enums.js';
import type { CenterAddressDto } from './create-center-inquiry.dto.js';

// Status values allowed via direct update (not onboarded/verified/verification-rejected)
const ALLOWED_STATUS_UPDATES: CenterInquiryStatus[] = [
  CenterInquiryStatus.new,
  CenterInquiryStatus.contacted,
  CenterInquiryStatus.interested,
  CenterInquiryStatus.qualified,
  CenterInquiryStatus.unqualified,
  CenterInquiryStatus.in_process,
  CenterInquiryStatus.follow_up,
  CenterInquiryStatus.lost,
  CenterInquiryStatus.no_response,
  CenterInquiryStatus.duplicate,
  CenterInquiryStatus.converted,
];
export { ALLOWED_STATUS_UPDATES };

export class UpdateCenterInquiryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  centerName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(15)
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  address?: CenterAddressDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ enum: ALLOWED_STATUS_UPDATES })
  @IsOptional()
  @IsEnum(ALLOWED_STATUS_UPDATES)
  status?: CenterInquiryStatus;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  servicesAvailable?: string[];
}

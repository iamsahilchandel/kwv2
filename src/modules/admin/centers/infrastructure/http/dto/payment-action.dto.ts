import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentRejectDto {
  @ApiPropertyOptional({ type: [String], description: 'Reasons for rejection' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  reasons?: string[];
}

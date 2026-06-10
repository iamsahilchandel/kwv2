import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GovPicklistQueryDto {
  @ApiPropertyOptional({ description: 'Response format', default: 'json' })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional({ description: 'Pagination offset', default: 0 })
  @IsOptional()
  @IsNumberString()
  offset?: string;

  @ApiPropertyOptional({ description: 'Number of records to return', default: 40 })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  document_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state_code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state_name_english?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state_name_local?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state_census2011_code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state_or_ut?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  district_code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  district_name_english?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  district_name_local?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  district_census2011_code?: string;
}

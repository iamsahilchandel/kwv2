import { IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlatformDocumentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  documentTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  documentUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  documentType?: string;
}

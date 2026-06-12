import { IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlatformDocumentDto {
  @ApiProperty({ example: 'Terms and Conditions' })
  @IsString()
  @MaxLength(200)
  documentTitle: string;

  @ApiProperty({ example: 'https://cdn.example.com/docs/tnc.pdf' })
  @IsUrl()
  documentUrl: string;

  @ApiProperty({ example: 'docs/tnc.pdf' })
  @IsString()
  documentKey: string;

  @ApiPropertyOptional({ example: 'terms' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  documentType?: string;
}

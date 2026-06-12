import { IsString, IsUrl, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum BannerType {
  center = 'center',
  learner = 'learner',
  expert = 'expert',
  all = 'all',
}

export class CreateAdvertisingBannerDto {
  @ApiProperty({ example: 'Summer Sale' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'https://cdn.example.com/banner.jpg' })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({ example: 'banners/summer-sale.jpg' })
  @IsString()
  imageKey: string;

  @ApiPropertyOptional({ example: 'https://example.com/offer' })
  @IsOptional()
  @IsUrl()
  linkUrl?: string;

  @ApiProperty({ enum: BannerType })
  @IsEnum(BannerType)
  type: BannerType;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

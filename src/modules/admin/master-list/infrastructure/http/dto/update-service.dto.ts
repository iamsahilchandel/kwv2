import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceGroup } from '@/generated/prisma/enums.js';

export class UpdateServiceDto {
  @ApiPropertyOptional({ enum: ServiceGroup })
  @IsOptional()
  @IsEnum(ServiceGroup)
  serviceGroup?: ServiceGroup;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  serviceName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

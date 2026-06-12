import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceGroup } from '@/generated/prisma/enums.js';

export class CreateServiceDto {
  @ApiProperty({ enum: ServiceGroup })
  @IsEnum(ServiceGroup)
  serviceGroup: ServiceGroup;

  @ApiProperty({ example: 'Yoga' })
  @IsString()
  @MaxLength(100)
  serviceName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

import { IsString, IsEmail, IsEnum, IsOptional, IsInt, Min, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminRole } from '@/generated/prisma/enums.js';

export class CreateAdminUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MaxLength(50)
  fullName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @MaxLength(15)
  phoneNumber: string;

  @ApiProperty({ enum: AdminRole })
  @IsEnum(AdminRole)
  role: AdminRole;

  @ApiPropertyOptional({ description: 'ID of the manager this user reports to' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  reportsTo?: number;
}

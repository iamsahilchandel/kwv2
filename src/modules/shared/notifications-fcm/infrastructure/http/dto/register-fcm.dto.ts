import { IsString, IsNotEmpty, IsInt, IsPositive, IsEnum, IsOptional, IsObject, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum UserType {
  AppAdmin = 'appadmin',
  CenterStaff = 'centerstaff',
  Learner = 'learner',
  Expert = 'expert',
}

export enum DeviceType {
  Android = 'android',
  iOS = 'ios',
  Web = 'web',
  Desktop = 'desktop',
}

export class RegisterFcmTokenDto {
  @ApiProperty()
  @IsString()
  @MinLength(100, { message: 'FCM token appears invalid (too short)' })
  @IsNotEmpty()
  fcmToken: string;

  @ApiProperty({ description: 'Database user ID (not firebase UID)' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({ enum: UserType })
  @IsEnum(UserType)
  userType: UserType;

  @ApiPropertyOptional({ enum: DeviceType })
  @IsOptional()
  @IsEnum(DeviceType)
  deviceType?: DeviceType;

  @ApiPropertyOptional({ description: 'Additional device metadata (max 5KB)' })
  @IsOptional()
  @IsObject()
  deviceInfo?: Record<string, unknown>;
}

import { IsString, IsOptional, IsEnum, IsUrl, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MarketingUserType {
  appadmin = 'appadmin',
  centerstaff = 'centerstaff',
  expert = 'expert',
  learner = 'learner',
}

export enum NotificationPriority {
  high = 'high',
  normal = 'normal',
  low = 'low',
}

export class SendPushNotificationDto {
  @ApiProperty({ example: 'Summer Sale!' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'Get 20% off on all courses this week.' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  body: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/notification.jpg' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({ enum: MarketingUserType })
  @IsEnum(MarketingUserType)
  userType: MarketingUserType;

  @ApiPropertyOptional({ enum: NotificationPriority, default: NotificationPriority.normal })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;
}

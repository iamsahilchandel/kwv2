import { IsString, IsEmail, IsOptional, IsInt, Min, IsArray, MaxLength, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CenterAddressDto {
  @IsString() streetAddress: string;
  @IsOptional() @IsString() locality?: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() pincode: string;
  @IsOptional() @IsString() country?: string;
}

export class CreateCenterInquiryDto {
  @ApiProperty({ example: 'ABC Fitness Center' })
  @IsString()
  @MaxLength(200)
  centerName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @MaxLength(15)
  phoneNumber: string;

  @ApiProperty()
  @IsObject()
  address: CenterAddressDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  servicesAvailable?: string[];

  @ApiPropertyOptional({ description: 'First note on the inquiry' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  assignedTo?: number;
}

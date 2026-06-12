import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAmenityDto {
  @ApiProperty({ example: 'Parking' })
  @IsString()
  @MaxLength(100)
  amenityName: string;

  @ApiProperty({ example: 'Covered parking facility' })
  @IsString()
  @MaxLength(500)
  description: string;
}

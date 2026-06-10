import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class IdParamDto {
  @ApiProperty({ description: 'Resource ID', minimum: 1 })
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

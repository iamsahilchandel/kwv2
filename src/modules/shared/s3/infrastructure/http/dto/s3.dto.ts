import { IsArray, IsString, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteFilesDto {
  @ApiProperty({
    type: [String],
    description: 'S3 object keys to delete',
    minItems: 1,
    maxItems: 100,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  keys: string[];
}

export class GetPresignedUrlsDto {
  @ApiProperty({
    type: [String],
    description: 'S3 object keys to generate presigned URLs for',
    minItems: 1,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  keys: string[];
}

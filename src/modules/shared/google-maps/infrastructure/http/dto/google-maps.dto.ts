import { IsString, IsNotEmpty, IsOptional, IsNumberString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TravelMode {
  Driving = 'driving',
  Walking = 'walking',
  Bicycling = 'bicycling',
  Transit = 'transit',
}

export class GeocodeQueryDto {
  @ApiProperty({ description: 'Address to geocode' })
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class LatLngQueryDto {
  @ApiProperty()
  @IsNumberString()
  lat: string;

  @ApiProperty()
  @IsNumberString()
  lng: string;
}

export class DirectionsQueryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiPropertyOptional({ enum: TravelMode })
  @IsOptional()
  @IsEnum(TravelMode)
  mode?: TravelMode;

  @ApiPropertyOptional()
  @IsOptional()
  avoidTolls?: string;
}

export class DistanceMatrixQueryDto {
  @ApiProperty({ description: 'Pipe-separated origins (e.g. "12.97,77.59|13.08,80.27")' })
  @IsString()
  @IsNotEmpty()
  origins: string;

  @ApiProperty({ description: 'Pipe-separated destinations' })
  @IsString()
  @IsNotEmpty()
  destinations: string;

  @ApiPropertyOptional({ enum: TravelMode })
  @IsOptional()
  @IsEnum(TravelMode)
  mode?: TravelMode;
}

export class NearbyPlacesQueryDto {
  @ApiProperty()
  @IsNumberString()
  lat: string;

  @ApiProperty()
  @IsNumberString()
  lng: string;

  @ApiProperty({ description: 'Search radius in meters' })
  @IsNumberString()
  radius: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;
}

export class PlaceDetailsQueryDto {
  @ApiProperty({ description: 'Google Place ID' })
  @IsString()
  @IsNotEmpty()
  placeId: string;
}

export class AutocompleteQueryDto {
  @ApiProperty({ description: 'Partial address or query input' })
  @IsString()
  @IsNotEmpty()
  input: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  types?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  radius?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sessionToken?: string;
}

export class StaticMapQueryDto {
  @ApiProperty({ description: 'Map center (lat,lng)' })
  @IsString()
  @IsNotEmpty()
  center: string;

  @ApiProperty({ description: 'Zoom level (0–21)' })
  @IsString()
  zoom: string;

  @ApiProperty({ description: 'Image size, e.g. "600x400"' })
  @IsString()
  size: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  markers?: string;
}

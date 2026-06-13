import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/core/guards/admin-auth.guard.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import {
  GOOGLE_MAPS_PORT,
  type IGoogleMapsPort,
} from '../../application/ports/google-maps.port.js';
import {
  GeocodeQuerySchema,
  type GeocodeQuery,
  LatLngQuerySchema,
  type LatLngQuery,
  DirectionsQuerySchema,
  type DirectionsQuery,
  DistanceMatrixQuerySchema,
  type DistanceMatrixQuery,
  NearbyPlacesQuerySchema,
  type NearbyPlacesQuery,
  PlaceDetailsQuerySchema,
  type PlaceDetailsQuery,
  AutocompleteQuerySchema,
  type AutocompleteQuery,
  StaticMapQuerySchema,
  type StaticMapQuery,
} from './dto/google-maps.dto.js';

@ApiTags('Shared - Google Maps')
@ApiBearerAuth('firebase-token')
@UseGuards(AdminAuthGuard)
@Controller('google-maps')
export class GoogleMapsController {
  constructor(
    @Inject(GOOGLE_MAPS_PORT) private readonly maps: IGoogleMapsPort,
  ) {}

  @ApiOperation({ summary: 'Geocode an address to coordinates' })
  @Get('geocode')
  async geocode(
    @Query(new ZodValidationPipe(GeocodeQuerySchema)) query: GeocodeQuery,
  ) {
    return this.maps.geocodeAddress(query.address);
  }

  @ApiOperation({ summary: 'Reverse geocode coordinates to address' })
  @Get('reverse-geocode')
  async reverseGeocode(
    @Query(new ZodValidationPipe(LatLngQuerySchema)) query: LatLngQuery,
  ) {
    return this.maps.reverseGeocode(
      parseFloat(query.lat),
      parseFloat(query.lng),
    );
  }

  @ApiOperation({ summary: 'Get directions between two locations' })
  @Get('directions')
  async directions(
    @Query(new ZodValidationPipe(DirectionsQuerySchema)) query: DirectionsQuery,
  ) {
    return this.maps.getDirections(query.origin, query.destination, {
      mode: query.mode,
      avoidTolls: query.avoidTolls === 'true',
    });
  }

  @ApiOperation({
    summary:
      'Distance matrix between multiple origins and destinations (pipe-separated)',
  })
  @Get('distance-matrix')
  async distanceMatrix(
    @Query(new ZodValidationPipe(DistanceMatrixQuerySchema))
    query: DistanceMatrixQuery,
  ) {
    return this.maps.getDistanceMatrix(
      query.origins.split('|'),
      query.destinations.split('|'),
      query.mode,
    );
  }

  @ApiOperation({ summary: 'Search nearby places' })
  @Get('places/nearby')
  async nearbyPlaces(
    @Query(new ZodValidationPipe(NearbyPlacesQuerySchema))
    query: NearbyPlacesQuery,
  ) {
    return this.maps.searchNearbyPlaces(
      parseFloat(query.lat),
      parseFloat(query.lng),
      parseInt(query.radius),
      query.type,
    );
  }

  @ApiOperation({ summary: 'Get details for a specific Place ID' })
  @Get('places/details')
  async placeDetails(
    @Query(new ZodValidationPipe(PlaceDetailsQuerySchema))
    query: PlaceDetailsQuery,
  ) {
    return this.maps.getPlaceDetails(query.placeId);
  }

  @ApiOperation({
    summary: 'Address autocomplete using Places API v2 (India-restricted)',
  })
  @Get('places/address-autocomplete')
  async addressAutocomplete(
    @Query(new ZodValidationPipe(AutocompleteQuerySchema))
    query: AutocompleteQuery,
  ) {
    return this.maps.getAddressAutocomplete(query.input, query);
  }

  @ApiOperation({ summary: 'Query autocomplete for broader text searches' })
  @Get('places/query-autocomplete')
  async queryAutocomplete(
    @Query(new ZodValidationPipe(AutocompleteQuerySchema))
    query: AutocompleteQuery,
  ) {
    return this.maps.getQueryAutocomplete(query.input, query);
  }

  @ApiOperation({ summary: 'Get timezone info for coordinates' })
  @Get('timezone')
  async timezone(
    @Query(new ZodValidationPipe(LatLngQuerySchema)) query: LatLngQuery,
  ) {
    return this.maps.getTimezone(parseFloat(query.lat), parseFloat(query.lng));
  }

  @ApiOperation({ summary: 'Generate a static map image URL' })
  @Get('static-map')
  async staticMap(
    @Query(new ZodValidationPipe(StaticMapQuerySchema)) query: StaticMapQuery,
  ) {
    const url = this.maps.getStaticMapUrl(
      query.center,
      query.zoom,
      query.size,
      query.markers,
    );
    return { url };
  }
}

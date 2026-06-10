import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/core/guards/admin-auth.guard.js';
import { GOOGLE_MAPS_PORT, type IGoogleMapsPort } from '../../application/ports/google-maps.port.js';
import {
  GeocodeQueryDto,
  LatLngQueryDto,
  DirectionsQueryDto,
  DistanceMatrixQueryDto,
  NearbyPlacesQueryDto,
  PlaceDetailsQueryDto,
  AutocompleteQueryDto,
  StaticMapQueryDto,
} from './dto/google-maps.dto.js';

@ApiTags('Shared - Google Maps')
@ApiBearerAuth('firebase-token')
@UseGuards(AdminAuthGuard)
@Controller('google-maps')
export class GoogleMapsController {
  constructor(@Inject(GOOGLE_MAPS_PORT) private readonly maps: IGoogleMapsPort) {}

  @ApiOperation({ summary: 'Geocode an address to coordinates' })
  @Get('geocode')
  async geocode(@Query() query: GeocodeQueryDto) {
    return this.maps.geocodeAddress(query.address);
  }

  @ApiOperation({ summary: 'Reverse geocode coordinates to address' })
  @Get('reverse-geocode')
  async reverseGeocode(@Query() query: LatLngQueryDto) {
    return this.maps.reverseGeocode(parseFloat(query.lat), parseFloat(query.lng));
  }

  @ApiOperation({ summary: 'Get directions between two locations' })
  @Get('directions')
  async directions(@Query() query: DirectionsQueryDto) {
    return this.maps.getDirections(query.origin, query.destination, {
      mode: query.mode,
      avoidTolls: query.avoidTolls === 'true',
    });
  }

  @ApiOperation({ summary: 'Distance matrix between multiple origins and destinations (pipe-separated)' })
  @Get('distance-matrix')
  async distanceMatrix(@Query() query: DistanceMatrixQueryDto) {
    return this.maps.getDistanceMatrix(query.origins.split('|'), query.destinations.split('|'), query.mode);
  }

  @ApiOperation({ summary: 'Search nearby places' })
  @Get('places/nearby')
  async nearbyPlaces(@Query() query: NearbyPlacesQueryDto) {
    return this.maps.searchNearbyPlaces(parseFloat(query.lat), parseFloat(query.lng), parseInt(query.radius), query.type);
  }

  @ApiOperation({ summary: 'Get details for a specific Place ID' })
  @Get('places/details')
  async placeDetails(@Query() query: PlaceDetailsQueryDto) {
    return this.maps.getPlaceDetails(query.placeId);
  }

  @ApiOperation({ summary: 'Address autocomplete using Places API v2 (India-restricted)' })
  @Get('places/address-autocomplete')
  async addressAutocomplete(@Query() query: AutocompleteQueryDto) {
    return this.maps.getAddressAutocomplete(query.input, query);
  }

  @ApiOperation({ summary: 'Query autocomplete for broader text searches' })
  @Get('places/query-autocomplete')
  async queryAutocomplete(@Query() query: AutocompleteQueryDto) {
    return this.maps.getQueryAutocomplete(query.input, query);
  }

  @ApiOperation({ summary: 'Get timezone info for coordinates' })
  @Get('timezone')
  async timezone(@Query() query: LatLngQueryDto) {
    return this.maps.getTimezone(parseFloat(query.lat), parseFloat(query.lng));
  }

  @ApiOperation({ summary: 'Generate a static map image URL' })
  @Get('static-map')
  async staticMap(@Query() query: StaticMapQueryDto) {
    const url = this.maps.getStaticMapUrl(query.center, query.zoom, query.size, query.markers);
    return { url };
  }
}

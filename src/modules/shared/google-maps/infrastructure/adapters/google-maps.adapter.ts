import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExternalServiceException } from '../../../../../common/exceptions/external-service.exception.js';
import type {
  IGoogleMapsPort,
  GeocodeResult,
  PlacePrediction,
} from '../../application/ports/google-maps.port.js';
import type {
  DirectionsApiResponse,
  DistanceMatrixApiResponse,
  GeoApiResponse,
  NearbySearchApiResponse,
  PlaceDetailsApiResponse,
  PlacesAutocompleteApiResponse,
  QueryAutocompleteApiResponse,
  TimezoneApiResponse,
} from '../types/google-maps-api.types.js';

const PLACES_AUTOCOMPLETE_V2_URL =
  'https://places.googleapis.com/v1/places:autocomplete';

@Injectable()
export class GoogleMapsAdapter implements IGoogleMapsPort {
  private readonly logger = new Logger(GoogleMapsAdapter.name);
  private readonly baseUrl = 'https://maps.googleapis.com/maps/api';
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('googleMaps.apiKey') ?? '';
  }

  async geocodeAddress(address: string): Promise<GeocodeResult[]> {
    const url = `${this.baseUrl}/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    const data = await this.fetch<GeoApiResponse>(url);

    if (data.status !== 'OK')
      throw new ExternalServiceException(
        'Google Maps',
        `Geocoding failed: ${data.status}`,
      );
    return data.results.map((r) => ({
      formattedAddress: r.formatted_address,
      latitude: r.geometry.location.lat,
      longitude: r.geometry.location.lng,
      placeId: r.place_id,
      types: r.types,
    }));
  }

  async reverseGeocode(lat: number, lng: number): Promise<unknown[]> {
    const url = `${this.baseUrl}/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
    const data = await this.fetch<GeoApiResponse>(url);

    if (data.status !== 'OK')
      throw new ExternalServiceException(
        'Google Maps',
        `Reverse geocoding failed: ${data.status}`,
      );
    return data.results.map((r) => ({
      formattedAddress: r.formatted_address,
      addressComponents: r.address_components,
      placeId: r.place_id,
      types: r.types,
    }));
  }

  async getDirections(
    origin: string,
    destination: string,
    options: { mode?: string; avoidTolls?: boolean } = {},
  ): Promise<unknown> {
    const params = new URLSearchParams({
      origin,
      destination,
      key: this.apiKey,
    });
    if (options.mode) params.append('mode', options.mode);
    if (options.avoidTolls) params.append('avoid', 'tolls');

    const data = await this.fetch<DirectionsApiResponse>(
      `${this.baseUrl}/directions/json?${params}`,
    );
    if (data.status !== 'OK')
      throw new ExternalServiceException(
        'Google Maps',
        `Directions failed: ${data.status}`,
      );

    return {
      routes: data.routes.map((route) => ({
        summary: route.summary,
        distance: route.legs[0].distance,
        duration: route.legs[0].duration,
        startAddress: route.legs[0].start_address,
        endAddress: route.legs[0].end_address,
        steps: route.legs[0].steps.map((step) => ({
          instruction: step.html_instructions,
          distance: step.distance,
          duration: step.duration,
          startLocation: step.start_location,
          endLocation: step.end_location,
        })),
        polyline: route.overview_polyline.points,
      })),
    };
  }

  async getDistanceMatrix(
    origins: string[],
    destinations: string[],
    mode?: string,
  ): Promise<unknown> {
    const params = new URLSearchParams({
      origins: origins.join('|'),
      destinations: destinations.join('|'),
      key: this.apiKey,
    });
    if (mode) params.append('mode', mode);

    const data = await this.fetch<DistanceMatrixApiResponse>(
      `${this.baseUrl}/distancematrix/json?${params}`,
    );
    if (data.status !== 'OK')
      throw new ExternalServiceException(
        'Google Maps',
        `Distance matrix failed: ${data.status}`,
      );

    return {
      originAddresses: data.origin_addresses,
      destinationAddresses: data.destination_addresses,
      rows: data.rows.map((row) => ({
        elements: row.elements.map((el) => ({
          distance: el.distance,
          duration: el.duration,
          status: el.status,
        })),
      })),
    };
  }

  async searchNearbyPlaces(
    lat: number,
    lng: number,
    radius: number,
    type?: string,
  ): Promise<unknown> {
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: String(radius),
      key: this.apiKey,
    });
    if (type) params.append('type', type);

    const data = await this.fetch<NearbySearchApiResponse>(
      `${this.baseUrl}/place/nearbysearch/json?${params}`,
    );
    if (data.status !== 'OK')
      throw new ExternalServiceException(
        'Google Maps',
        `Nearby search failed: ${data.status}`,
      );

    return {
      places: data.results.map((p) => ({
        placeId: p.place_id,
        name: p.name,
        rating: p.rating,
        vicinity: p.vicinity,
        types: p.types,
        geometry: p.geometry,
        photos: p.photos,
        priceLevel: p.price_level,
        openingHours: p.opening_hours,
      })),
    };
  }

  async getPlaceDetails(placeId: string): Promise<unknown> {
    const params = new URLSearchParams({
      place_id: placeId,
      fields:
        'name,rating,formatted_address,formatted_phone_number,address_components,geometry',
      key: this.apiKey,
    });

    const data = await this.fetch<PlaceDetailsApiResponse>(
      `${this.baseUrl}/place/details/json?${params}`,
    );
    if (data.status !== 'OK')
      throw new ExternalServiceException(
        'Google Maps',
        `Place details failed: ${data.status}`,
      );

    return { place: data.result };
  }

  async getAddressAutocomplete(
    input: string,
    options: Record<string, unknown> = {},
  ): Promise<PlacePrediction[]> {
    void options;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': this.apiKey,
      'X-Goog-FieldMask':
        'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat',
    });

    const response = await fetch(PLACES_AUTOCOMPLETE_V2_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        input,
        includedPrimaryTypes: [
          'street_address',
          'premise',
          'subpremise',
          'establishment',
          'landmark',
        ],
        regionCode: 'IN',
        locationRestriction: {
          rectangle: {
            low: { latitude: 8.0883, longitude: 68.7665 },
            high: { latitude: 37.6176, longitude: 97.4025 },
          },
        },
        includedRegionCodes: ['IN'],
      }),
    });

    if (!response.ok)
      throw new ExternalServiceException(
        'Google Maps',
        `Autocomplete request failed: ${response.status}`,
      );

    const data = (await response.json()) as PlacesAutocompleteApiResponse;
    return (data.suggestions ?? []).map((s) => ({
      placeId: s.placePrediction.placeId,
      description: s.placePrediction.text?.text ?? '',
      structuredFormatting: s.placePrediction.structuredFormat,
    }));
  }

  async getQueryAutocomplete(
    input: string,
    options: Record<string, unknown> = {},
  ): Promise<PlacePrediction[]> {
    const params = new URLSearchParams({ input, key: this.apiKey });
    if (options.location) params.append('location', options.location as string);
    if (options.radius) params.append('radius', options.radius as string);
    if (options.language) params.append('language', options.language as string);

    const data = await this.fetch<QueryAutocompleteApiResponse>(
      `${this.baseUrl}/place/queryautocomplete/json?${params}`,
    );
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new ExternalServiceException(
        'Google Maps',
        `Query autocomplete failed: ${data.status}`,
      );
    }

    return (data.predictions ?? []).map((p) => ({
      placeId: p.place_id,
      description: p.description,
      structuredFormatting: {
        mainText: p.structured_formatting?.main_text,
        secondaryText: p.structured_formatting?.secondary_text,
      },
      types: p.types,
      matchedSubstrings: p.matched_substrings,
      terms: p.terms?.map((t) => ({ offset: t.offset, value: t.value })),
    }));
  }

  async getTimezone(lat: number, lng: number): Promise<unknown> {
    const timestamp = Math.floor(Date.now() / 1000);
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      timestamp: String(timestamp),
      key: this.apiKey,
    });

    const data = await this.fetch<TimezoneApiResponse>(
      `${this.baseUrl}/timezone/json?${params}`,
    );
    if (data.status !== 'OK')
      throw new ExternalServiceException(
        'Google Maps',
        `Timezone failed: ${data.status}`,
      );

    return {
      timeZoneId: data.timeZoneId,
      timeZoneName: data.timeZoneName,
      dstOffset: data.dstOffset,
      rawOffset: data.rawOffset,
    };
  }

  getStaticMapUrl(
    center: string,
    zoom: string,
    size: string,
    markers?: string,
  ): string {
    const params = new URLSearchParams({
      center,
      zoom,
      size,
      key: this.apiKey,
    });
    if (markers) params.append('markers', markers);
    return `${this.baseUrl}/staticmap?${params}`;
  }

  private async fetch<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json() as Promise<T>;
    } catch (err) {
      this.logger.error(
        `Google Maps API request failed: ${(err as Error).message}`,
        url,
      );
      throw new ExternalServiceException('Google Maps', (err as Error).message);
    }
  }
}

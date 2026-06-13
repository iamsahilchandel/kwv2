export interface GeocodeResult {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeId: string;
  types: string[];
}

export interface PlacePrediction {
  placeId: string;
  description: string;
  structuredFormatting?: {
    mainText?: string;
    secondaryText?: string;
    mainTextMatchedSubstrings?: unknown[];
  };
  types?: string[];
  matchedSubstrings?: unknown[];
  terms?: Array<{ offset: number; value: string }>;
}

export interface IGoogleMapsPort {
  geocodeAddress(address: string): Promise<GeocodeResult[]>;
  reverseGeocode(lat: number, lng: number): Promise<unknown[]>;
  getDirections(
    origin: string,
    destination: string,
    options?: { mode?: string; avoidTolls?: boolean },
  ): Promise<unknown>;
  getDistanceMatrix(
    origins: string[],
    destinations: string[],
    mode?: string,
  ): Promise<unknown>;
  searchNearbyPlaces(
    lat: number,
    lng: number,
    radius: number,
    type?: string,
  ): Promise<unknown>;
  getPlaceDetails(placeId: string): Promise<unknown>;
  getAddressAutocomplete(
    input: string,
    options?: Record<string, unknown>,
  ): Promise<PlacePrediction[]>;
  getQueryAutocomplete(
    input: string,
    options?: Record<string, unknown>,
  ): Promise<PlacePrediction[]>;
  getTimezone(lat: number, lng: number): Promise<unknown>;
  getStaticMapUrl(
    center: string,
    zoom: string,
    size: string,
    markers?: string,
  ): string;
}

export const GOOGLE_MAPS_PORT = Symbol('IGoogleMapsPort');

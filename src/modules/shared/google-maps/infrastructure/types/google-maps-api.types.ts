export interface GeoApiLocation {
  lat: number;
  lng: number;
}

export interface GeoApiGeometry {
  location: GeoApiLocation;
}

export interface GeoApiResult {
  formatted_address: string;
  address_components: unknown[];
  geometry: GeoApiGeometry;
  place_id: string;
  types: string[];
}

export interface GeoApiResponse {
  status: string;
  results: GeoApiResult[];
}

export interface GeoMeasure {
  text: string;
  value: number;
}

export interface GeoStep {
  html_instructions: string;
  distance: GeoMeasure;
  duration: GeoMeasure;
  start_location: GeoApiLocation;
  end_location: GeoApiLocation;
}

export interface GeoLeg {
  distance: GeoMeasure;
  duration: GeoMeasure;
  start_address: string;
  end_address: string;
  steps: GeoStep[];
}

export interface DirectionsApiResponse {
  status: string;
  routes: Array<{
    summary: string;
    legs: GeoLeg[];
    overview_polyline: { points: string };
  }>;
}

export interface DistanceMatrixApiResponse {
  status: string;
  origin_addresses: string[];
  destination_addresses: string[];
  rows: Array<{
    elements: Array<{
      distance: GeoMeasure;
      duration: GeoMeasure;
      status: string;
    }>;
  }>;
}

export interface NearbyPlace {
  place_id: string;
  name: string;
  rating: number;
  vicinity: string;
  types: string[];
  geometry: GeoApiGeometry;
  photos: unknown[];
  price_level: number;
  opening_hours: unknown;
}

export interface NearbySearchApiResponse {
  status: string;
  results: NearbyPlace[];
}

export interface PlaceDetailsApiResponse {
  status: string;
  result: unknown;
}

export interface PlacesAutocompleteApiResponse {
  suggestions?: Array<{
    placePrediction: {
      placeId: string;
      text?: { text: string };
      structuredFormat?: { mainText?: string; secondaryText?: string };
    };
  }>;
}

export interface QueryPrediction {
  place_id: string;
  description: string;
  structured_formatting?: { main_text?: string; secondary_text?: string };
  types: string[];
  matched_substrings: unknown[];
  terms?: Array<{ offset: number; value: string }>;
}

export interface QueryAutocompleteApiResponse {
  status: string;
  predictions?: QueryPrediction[];
}

export interface TimezoneApiResponse {
  status: string;
  timeZoneId: string;
  timeZoneName: string;
  dstOffset: number;
  rawOffset: number;
}

import { z } from 'zod';

export enum TravelMode {
  Driving = 'driving',
  Walking = 'walking',
  Bicycling = 'bicycling',
  Transit = 'transit',
}

export const GeocodeQuerySchema = z.object({
  address: z.string().min(1),
});

export const LatLngQuerySchema = z.object({
  lat: z.string().regex(/^-?\d+(\.\d+)?$/),
  lng: z.string().regex(/^-?\d+(\.\d+)?$/),
});

export const DirectionsQuerySchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  mode: z.nativeEnum(TravelMode).optional(),
  avoidTolls: z.string().optional(),
});

export const DistanceMatrixQuerySchema = z.object({
  origins: z.string().min(1),
  destinations: z.string().min(1),
  mode: z.nativeEnum(TravelMode).optional(),
});

export const NearbyPlacesQuerySchema = z.object({
  lat: z.string().regex(/^-?\d+(\.\d+)?$/),
  lng: z.string().regex(/^-?\d+(\.\d+)?$/),
  radius: z.string().regex(/^\d+$/),
  type: z.string().optional(),
});

export const PlaceDetailsQuerySchema = z.object({
  placeId: z.string().min(1),
});

export const AutocompleteQuerySchema = z.object({
  input: z.string().min(1),
  types: z.string().optional(),
  location: z.string().optional(),
  radius: z.string().optional(),
  language: z.string().optional(),
  sessionToken: z.string().optional(),
});

export const StaticMapQuerySchema = z.object({
  center: z.string().min(1),
  zoom: z.string(),
  size: z.string(),
  markers: z.string().optional(),
});

export type GeocodeQuery = z.infer<typeof GeocodeQuerySchema>;
export type LatLngQuery = z.infer<typeof LatLngQuerySchema>;
export type DirectionsQuery = z.infer<typeof DirectionsQuerySchema>;
export type DistanceMatrixQuery = z.infer<typeof DistanceMatrixQuerySchema>;
export type NearbyPlacesQuery = z.infer<typeof NearbyPlacesQuerySchema>;
export type PlaceDetailsQuery = z.infer<typeof PlaceDetailsQuerySchema>;
export type AutocompleteQuery = z.infer<typeof AutocompleteQuerySchema>;
export type StaticMapQuery = z.infer<typeof StaticMapQuerySchema>;

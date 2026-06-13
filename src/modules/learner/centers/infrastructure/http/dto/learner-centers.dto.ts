import { z } from 'zod';

export const NearbyCentersSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  long: z.coerce.number().min(-180).max(180),
  distance: z.coerce.number().int().min(100).max(50000).default(5000),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  serviceIds: z.string().optional(),
  amenityIds: z.string().optional(),
  centerType: z.string().optional(),
});

export type NearbyCentersDto = z.infer<typeof NearbyCentersSchema>;

export const CenterAccessRequestSchema = z.object({
  centerId: z.number().int().positive(),
  message: z.string().max(500).optional(),
});

export type CenterAccessRequestDto = z.infer<typeof CenterAccessRequestSchema>;

export const QueryMyCentersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type QueryMyCentersDto = z.infer<typeof QueryMyCentersSchema>;

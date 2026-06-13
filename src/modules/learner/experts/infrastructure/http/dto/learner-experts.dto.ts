import { z } from 'zod';

export const QueryMyExpertsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  activityIds: z.string().optional(),
});

export type QueryMyExpertsDto = z.infer<typeof QueryMyExpertsSchema>;

export const QueryGlobalExpertsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  search: z.string().min(3).max(100).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  long: z.coerce.number().min(-180).max(180).optional(),
  distance: z.coerce.number().int().min(100).max(50000).default(5000),
  activityIds: z.string().optional(),
});

export type QueryGlobalExpertsDto = z.infer<typeof QueryGlobalExpertsSchema>;

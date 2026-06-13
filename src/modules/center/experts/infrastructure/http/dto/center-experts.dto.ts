import { z } from 'zod';

export const QueryCenterExpertsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  isActive: z.coerce.boolean().optional(),
  serviceId: z.coerce.number().int().optional(),
});

export type QueryCenterExpertsQuery = z.infer<typeof QueryCenterExpertsSchema>;

export const AddExpertSchema = z.object({
  expertId: z.number().int().min(1),
  joinedOn: z.coerce.date().optional(),
});

export type AddExpertBody = z.infer<typeof AddExpertSchema>;

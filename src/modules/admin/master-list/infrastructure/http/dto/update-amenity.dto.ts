import { z } from 'zod';

export const UpdateAmenitySchema = z.object({
  amenityName: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
});

export type UpdateAmenityBody = z.infer<typeof UpdateAmenitySchema>;

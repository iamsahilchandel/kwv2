import { z } from 'zod';

export const CreateAmenitySchema = z.object({
  amenityName: z.string().max(100),
  description: z.string().max(500),
});

export type CreateAmenityBody = z.infer<typeof CreateAmenitySchema>;

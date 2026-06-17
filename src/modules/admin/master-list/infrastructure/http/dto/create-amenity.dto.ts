import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateAmenitySchema = z.object({
  amenityName: z.string().max(100),
  description: z.string().max(500),
});

export type CreateAmenityBody = z.infer<typeof CreateAmenitySchema>;

export class CreateAmenityDto extends createZodDto(CreateAmenitySchema) {}

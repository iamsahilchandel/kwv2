import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const IdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export type IdParam = z.infer<typeof IdParamSchema>;

export class IdParamDto extends createZodDto(IdParamSchema) {}

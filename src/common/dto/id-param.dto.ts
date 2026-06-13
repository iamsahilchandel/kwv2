import { z } from 'zod';

export const IdParamSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export type IdParam = z.infer<typeof IdParamSchema>;

import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().max(100).optional(),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}

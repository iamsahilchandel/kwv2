import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const QueryNotificationsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  isRead: z
    .string()
    .optional()
    .transform((v) =>
      v === 'true' ? true : v === 'false' ? false : undefined,
    ),
});

export type QueryNotificationsQuery = z.infer<typeof QueryNotificationsSchema>;

export class QueryNotificationsDto extends createZodDto(
  QueryNotificationsSchema,
) {}

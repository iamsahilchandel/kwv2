import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../../../../common/dto/pagination.dto.js';
import { AdminRole } from '../../../../../../generated/prisma/enums.js';

export const QueryAdminUsersSchema = PaginationQuerySchema.extend({
  isActive: z
    .preprocess((v) => v === 'true' || v === true, z.boolean())
    .optional(),
  role: z.enum(AdminRole).optional(),
  reportsTo: z.coerce.number().int().min(1).optional(),
  tab: z.enum(['active', 'inactive']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type QueryAdminUsersQuery = z.infer<typeof QueryAdminUsersSchema>;

export class QueryAdminUsersDto extends createZodDto(QueryAdminUsersSchema) {}

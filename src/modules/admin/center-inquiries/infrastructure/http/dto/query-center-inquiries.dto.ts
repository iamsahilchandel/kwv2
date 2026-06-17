import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../../../../common/dto/pagination.dto.js';
import { CenterInquiryStatus } from '../../../../../../generated/prisma/enums.js';

export const QueryCenterInquiriesSchema = PaginationQuerySchema.extend({
  status: z.enum(CenterInquiryStatus).optional(),
  assignedTo: z.coerce.number().int().min(1).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type QueryCenterInquiriesQuery = z.infer<
  typeof QueryCenterInquiriesSchema
>;

export class QueryCenterInquiriesDto extends createZodDto(
  QueryCenterInquiriesSchema,
) {}

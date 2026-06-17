import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const GovPicklistQuerySchema = z.object({
  format: z.string().optional(),
  offset: z.string().optional(),
  limit: z.string().optional(),
  document_id: z.string().optional(),
  state_code: z.string().optional(),
  state_name_english: z.string().optional(),
  state_name_local: z.string().optional(),
  state_census2011_code: z.string().optional(),
  state_or_ut: z.string().optional(),
  district_code: z.string().optional(),
  district_name_english: z.string().optional(),
  district_name_local: z.string().optional(),
  district_census2011_code: z.string().optional(),
});

export type GovPicklistQuery = z.infer<typeof GovPicklistQuerySchema>;

export class GovPicklistQueryDto extends createZodDto(GovPicklistQuerySchema) {}

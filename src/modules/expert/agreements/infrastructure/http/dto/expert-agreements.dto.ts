import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { AgreementStatus } from '../../../../../../generated/prisma/enums.js';

export const QueryAgreementsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(AgreementStatus).optional(),
});

export type QueryAgreementsQuery = z.infer<typeof QueryAgreementsSchema>;

export const RejectAgreementSchema = z.object({
  reason: z.string().min(1).max(1000),
});

export type RejectAgreementBody = z.infer<typeof RejectAgreementSchema>;

export class QueryAgreementsDto extends createZodDto(QueryAgreementsSchema) {}
export class RejectAgreementDto extends createZodDto(RejectAgreementSchema) {}

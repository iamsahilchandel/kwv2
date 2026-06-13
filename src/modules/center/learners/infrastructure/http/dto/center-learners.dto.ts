import { z } from 'zod';
import { AccessRequestStatus } from '@/generated/prisma/enums.js';

export const QueryCenterLearnersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  isActive: z.coerce.boolean().optional(),
  isVerified: z.coerce.boolean().optional(),
});

export type QueryCenterLearnersQuery = z.infer<typeof QueryCenterLearnersSchema>;

export const QueryAccessRequestsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(AccessRequestStatus).optional(),
});

export type QueryAccessRequestsQuery = z.infer<typeof QueryAccessRequestsSchema>;

export const RejectAccessRequestSchema = z.object({
  rejectionReason: z.string().min(1).max(500),
});

export type RejectAccessRequestBody = z.infer<typeof RejectAccessRequestSchema>;

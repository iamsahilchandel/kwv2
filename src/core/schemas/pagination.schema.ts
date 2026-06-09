import { z } from 'zod';
import { typedApiSuccess } from './api-response.schema.js';

// ─── Inbound query ────────────────────────────────────────────────────────────

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ─── Outbound meta ────────────────────────────────────────────────────────────

export const PaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

// ─── Generic typed builder ────────────────────────────────────────────────────
// Usage: const UsersPageSchema = paginatedApiSuccess(UserSchema)

export function paginatedApiSuccess<T extends z.ZodTypeAny>(itemSchema: T) {
  return typedApiSuccess(
    z.object({
      items: z.array(itemSchema),
      meta: PaginationMetaSchema,
    }),
  );
}

// ─── Helper to compute totalPages ────────────────────────────────────────────

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): z.infer<typeof PaginationMetaSchema> {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

// ─── Inferred types ───────────────────────────────────────────────────────────

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

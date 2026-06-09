import { z } from 'zod';

// ─── Error body ──────────────────────────────────────────────────────────────

export const ValidationErrorDetailSchema = z.object({
  path: z.string(),
  message: z.string(),
});

export const ApiErrorBodySchema = z.union([
  z.string(),
  z.object({
    message: z.union([z.string(), z.array(z.string())]),
    error: z.string().optional(),
    statusCode: z.number().int().optional(),
    errors: z.array(ValidationErrorDetailSchema).optional(),
  }),
]);

// ─── Base shapes ─────────────────────────────────────────────────────────────

export const ApiSuccessSchema = z.object({
  success: z.literal(true),
  data: z.unknown(),
  timestamp: z.string(),
});

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  statusCode: z.number().int(),
  timestamp: z.string(),
  path: z.string(),
  error: ApiErrorBodySchema,
});

export const ApiResponseSchema = z.discriminatedUnion('success', [
  ApiSuccessSchema,
  ApiErrorSchema,
]);

// ─── Generic typed builder ────────────────────────────────────────────────────
// Usage: const UserResponseSchema = typedApiSuccess(UserSchema)

export function typedApiSuccess<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    timestamp: z.string(),
  });
}

// ─── Inferred types ───────────────────────────────────────────────────────────

export type ApiSuccess = z.infer<typeof ApiSuccessSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type ValidationErrorDetail = z.infer<typeof ValidationErrorDetailSchema>;

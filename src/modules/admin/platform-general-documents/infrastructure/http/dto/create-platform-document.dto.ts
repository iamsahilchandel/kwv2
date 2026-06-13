import { z } from 'zod';

export const CreatePlatformDocumentSchema = z.object({
  documentTitle: z.string().max(200),
  documentUrl: z.string().url(),
  documentKey: z.string().min(1),
  documentType: z.string().max(100).optional(),
});

export type CreatePlatformDocumentBody = z.infer<
  typeof CreatePlatformDocumentSchema
>;

import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreatePlatformDocumentSchema = z.object({
  documentTitle: z.string().max(200),
  documentUrl: z.url(),
  documentKey: z.string().min(1),
  documentType: z.string().max(100).optional(),
});

export type CreatePlatformDocumentBody = z.infer<
  typeof CreatePlatformDocumentSchema
>;

export class CreatePlatformDocumentDto extends createZodDto(
  CreatePlatformDocumentSchema,
) {}

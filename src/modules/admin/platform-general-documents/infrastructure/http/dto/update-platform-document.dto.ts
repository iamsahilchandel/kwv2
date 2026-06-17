import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UpdatePlatformDocumentSchema = z.object({
  documentTitle: z.string().max(200).optional(),
  documentUrl: z.url().optional(),
  documentKey: z.string().min(1).optional(),
  documentType: z.string().max(100).optional(),
});

export type UpdatePlatformDocumentBody = z.infer<
  typeof UpdatePlatformDocumentSchema
>;

export class UpdatePlatformDocumentDto extends createZodDto(
  UpdatePlatformDocumentSchema,
) {}

import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import {
  BatchClassMediaType,
  MediaVisibility,
} from '../../../../../../generated/prisma/enums.js';

export const CreateBatchClassMediaSchema = z.object({
  mediaUrl: z.url(),
  mediaKey: z.string().min(1),
  fileName: z.string().min(1),
  mediaType: z.enum(BatchClassMediaType),
  title: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  mimeType: z.string().max(100).optional(),
  fileSize: z.number().int().min(0).optional(),
  mediaVisibility: z.enum(MediaVisibility).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateBatchClassMediaBody = z.infer<
  typeof CreateBatchClassMediaSchema
>;

export const QueryMediaSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  mediaType: z.enum(BatchClassMediaType).optional(),
});

export type QueryMediaQuery = z.infer<typeof QueryMediaSchema>;

export class CreateBatchClassMediaDto extends createZodDto(
  CreateBatchClassMediaSchema,
) {}
export class QueryMediaDto extends createZodDto(QueryMediaSchema) {}

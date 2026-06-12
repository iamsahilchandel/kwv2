import { z } from 'zod';

export const DeleteFilesSchema = z.object({
  keys: z.array(z.string()).min(1).max(100),
});

export const GetPresignedUrlsSchema = z.object({
  keys: z.array(z.string()).min(1),
});

export type DeleteFilesBody = z.infer<typeof DeleteFilesSchema>;
export type GetPresignedUrlsBody = z.infer<typeof GetPresignedUrlsSchema>;

import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CenterInquiryNoteSchema = z.object({
  note: z.string().min(1).max(2000),
});

export type CenterInquiryNoteBody = z.infer<typeof CenterInquiryNoteSchema>;

export class CenterInquiryNoteDto extends createZodDto(
  CenterInquiryNoteSchema,
) {}

import { z } from 'zod';

export const CenterInquiryNoteSchema = z.object({
  note: z.string().min(1).max(2000),
});

export type CenterInquiryNoteBody = z.infer<typeof CenterInquiryNoteSchema>;

import { z } from 'zod';
import { PollStatus } from '../../../../../../generated/prisma/enums.js';

export const CreatePollSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  closingDate: z.coerce.date(),
  batchClassId: z.number().int().min(1).optional(),
  rescheduleRequestId: z.number().int().optional(),
  options: z.array(
    z.object({
      proposedDate: z.coerce.date(),
      proposedStartTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
      proposedEndTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
      optionOrder: z.number().int().default(0),
    }),
  ).min(1).max(5),
});

export type CreatePollBody = z.infer<typeof CreatePollSchema>;

export const UpdatePollSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  closingDate: z.coerce.date().optional(),
});

export type UpdatePollBody = z.infer<typeof UpdatePollSchema>;

export const ClosePollSchema = z.object({
  selectedOptionId: z.number().int().min(1),
});

export type ClosePollBody = z.infer<typeof ClosePollSchema>;

export const QueryPollsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(PollStatus).optional(),
});

export type QueryPollsQuery = z.infer<typeof QueryPollsSchema>;

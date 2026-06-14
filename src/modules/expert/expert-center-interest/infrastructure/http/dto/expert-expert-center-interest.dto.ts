import { z } from 'zod';
import { InterestStatus, InterestInitiator } from '../../../../../../generated/prisma/enums.js';

export const CreateInterestSchema = z.object({
  centerId: z.number().int().min(1),
  services: z
    .array(
      z.object({
        serviceId: z.number().int().min(1),
        experienceYears: z.number().int().min(0).optional(),
        preferredForService: z.boolean().optional(),
      }),
    )
    .min(1),
  message: z.string().max(1000).optional(),
  expectedCompensation: z.number().positive().optional(),
  experienceYears: z.number().int().min(0).optional(),
  preferredWorkingTimeSlots: z.record(z.string(), z.unknown()).optional(),
});

export type CreateInterestBody = z.infer<typeof CreateInterestSchema>;

export const RespondInterestSchema = z.object({
  responseMessage: z.string().max(1000).optional(),
});

export type RespondInterestBody = z.infer<typeof RespondInterestSchema>;

export const QueryInterestsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(InterestStatus).optional(),
  initiator: z.enum(InterestInitiator).optional(),
});

export type QueryInterestsQuery = z.infer<typeof QueryInterestsSchema>;

import { z } from 'zod';
import { CenterInquiryStatus } from '@/generated/prisma/enums.js';
import { CenterAddressSchema } from './create-center-inquiry.dto.js';

export const ALLOWED_STATUS_UPDATES = [
  CenterInquiryStatus.new,
  CenterInquiryStatus.contacted,
  CenterInquiryStatus.interested,
  CenterInquiryStatus.qualified,
  CenterInquiryStatus.unqualified,
  CenterInquiryStatus.in_process,
  CenterInquiryStatus.follow_up,
  CenterInquiryStatus.lost,
  CenterInquiryStatus.no_response,
  CenterInquiryStatus.duplicate,
  CenterInquiryStatus.converted,
] as const satisfies CenterInquiryStatus[];

export const UpdateCenterInquirySchema = z.object({
  centerName: z.string().max(200).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().max(15).optional(),
  address: CenterAddressSchema.optional(),
  website: z.string().optional(),
  status: z
    .nativeEnum(CenterInquiryStatus)
    .refine(
      (v) =>
        (ALLOWED_STATUS_UPDATES as readonly CenterInquiryStatus[]).includes(v),
      {
        message: `Status must be one of: ${ALLOWED_STATUS_UPDATES.join(', ')}`,
      },
    )
    .optional(),
  servicesAvailable: z.array(z.string()).optional(),
});

export type UpdateCenterInquiryBody = z.infer<typeof UpdateCenterInquirySchema>;

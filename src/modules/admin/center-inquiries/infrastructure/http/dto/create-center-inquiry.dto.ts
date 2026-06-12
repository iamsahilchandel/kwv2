import { z } from 'zod';

export const CenterAddressSchema = z.object({
  streetAddress: z.string().min(1),
  locality: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
  country: z.string().optional(),
});

export const CreateCenterInquirySchema = z.object({
  centerName: z.string().max(200),
  email: z.string().email(),
  phoneNumber: z.string().max(15),
  address: CenterAddressSchema,
  website: z.string().optional(),
  servicesAvailable: z.array(z.string()).optional(),
  note: z.string().max(2000).optional(),
  assignedTo: z.coerce.number().int().min(1).optional(),
});

export type CenterAddress = z.infer<typeof CenterAddressSchema>;
export type CreateCenterInquiryBody = z.infer<typeof CreateCenterInquirySchema>;

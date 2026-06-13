import { z } from 'zod';

export const UpdateLearnerSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().max(100).optional(),
  email: z.email().optional(),
});

export type UpdateLearnerDto = z.infer<typeof UpdateLearnerSchema>;

export const CreateProfileSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().max(100).optional(),
  email: z.email().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dateOfBirth: z.coerce.date().optional(),
  relation: z.string().max(50).optional(),
  interests: z.array(z.number().int().positive()).optional(),
  address: z
    .object({
      line1: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
    })
    .optional(),
});

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>;

export const UpdateProfileSchema = CreateProfileSchema.partial();

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;

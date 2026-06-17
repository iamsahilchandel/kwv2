import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UpdateLearnerSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().max(100).optional(),
  email: z.email().optional(),
});

export type UpdateLearner = z.infer<typeof UpdateLearnerSchema>;

export const CreateProfileSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().max(100).optional(),
  email: z.email().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dateOfBirth: z
    .string()
    .date()
    .transform((val) => new Date(val))
    .optional(),
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

export type CreateProfile = z.infer<typeof CreateProfileSchema>;

export const UpdateProfileSchema = CreateProfileSchema.partial();

export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

export class UpdateLearnerDto extends createZodDto(UpdateLearnerSchema) {}
export class CreateProfileDto extends createZodDto(CreateProfileSchema) {}
export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}

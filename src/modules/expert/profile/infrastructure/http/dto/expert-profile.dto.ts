import { z } from 'zod';
import { Gender } from '@/generated/prisma/enums.js';

const S3FileSchema = z.object({
  location: z.url(),
  key: z.string().min(1),
});

const AddressSchema = z.object({
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().optional(),
  pincode: z.string().min(1),
});

const ExpertiseItemSchema = z.object({
  expertiesId: z.number().int().positive(),
  experienceYears: z.number().int().nonnegative(),
});

export const RegisterExpertSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.email(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  address: AddressSchema,
  gender: z.enum(Gender),
  experties: z.array(ExpertiseItemSchema).optional(),
  expertDescription: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
  isOpenForWork: z.boolean().optional(),
  rangeForWork: z.number().positive().optional(),
  termsAndConditionsAccepted: z.boolean().refine((val) => val === true, {
    message: 'Terms must be accepted',
  }),
  isFreelancer: z.boolean(),
  preferredWorkingTimeSlots: z.array(z.any()).optional(),
  profilePicture: S3FileSchema.optional(),
  testimonialVideo: z.array(S3FileSchema).max(5).optional(),
  galleryImage: z.array(S3FileSchema).max(10).optional(),
  galleryVideo: z.array(S3FileSchema).max(5).optional(),
  certificates: z.array(S3FileSchema).max(20).optional(),
  demoVideo: S3FileSchema.optional(),
  expertAAdhaarFront: S3FileSchema.optional(),
  expertAAdhaarBack: S3FileSchema.optional(),
  expertPanCard: S3FileSchema.optional(),
  passport: S3FileSchema.optional(),
  drivingLicense: S3FileSchema.optional(),
  expertAadhaarNumber: z.string().max(12).optional(),
  expertPanNumber: z.string().max(10).optional(),
  expertPassportNumber: z.string().max(10).optional(),
  expertDrivingLicenseNumber: z.string().max(16).optional(),
  referralCode: z.string().optional(),
});

export const UpdateExpertProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.email().optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  address: AddressSchema.optional(),
  gender: z.enum(Gender).optional(),
  experties: z.array(ExpertiseItemSchema).optional(),
  expertDescription: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
  isOpenForWork: z.boolean().optional(),
  rangeForWork: z.number().positive().optional(),
  isFreelancer: z.boolean().optional(),
  preferredWorkingTimeSlots: z.array(z.any()).optional(),
  profilePicture: S3FileSchema.optional(),
  testimonialVideo: z.array(S3FileSchema).max(5).optional(),
  galleryImage: z.array(S3FileSchema).max(10).optional(),
  galleryVideo: z.array(S3FileSchema).max(5).optional(),
  certificates: z.array(S3FileSchema).max(20).optional(),
  demoVideo: S3FileSchema.optional(),
  expertAAdhaarFront: S3FileSchema.optional(),
  expertAAdhaarBack: S3FileSchema.optional(),
  expertPanCard: S3FileSchema.optional(),
  passport: S3FileSchema.optional(),
  drivingLicense: S3FileSchema.optional(),
  expertAadhaarNumber: z.string().max(12).optional(),
  expertPanNumber: z.string().max(10).optional(),
  expertPassportNumber: z.string().max(10).optional(),
  expertDrivingLicenseNumber: z.string().max(16).optional(),
});

export type RegisterExpertBody = z.infer<typeof RegisterExpertSchema>;
export type UpdateExpertProfileBody = z.infer<typeof UpdateExpertProfileSchema>;

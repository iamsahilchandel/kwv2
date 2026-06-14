import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';
import {
  ExpertDocumentType,
  ExpertMediaType,
} from '../../../generated/prisma/enums.js';
import type {
  IAuthUser,
  IFirebaseUser,
} from '../../../common/interfaces/auth-user.interface.js';
import type {
  RegisterExpertBody,
  UpdateExpertBody,
} from '../dto/expert.dto.js';

type S3File = { location: string; key: string };

@Injectable()
export class ExpertService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: number) {
    const expert = await this.prisma.experts.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firebaseUid: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        dateOfBirth: true,
        address: true,
        rangeForWork: true,
        profilePicture: true,
        mediaKey: true,
        gender: true,
        isVerified: true,
        verifiedOn: true,
        isActive: true,
        isPublic: true,
        isOpenForWork: true,
        termsAndConditionsAccepted: true,
        termsAndConditionsAcceptedOn: true,
        isFreelancer: true,
        referralCode: true,
        preferredWorkingTimeSlots: true,
        createdAt: true,
        updatedAt: true,
        expertMemberships: {
          select: {
            center: {
              select: {
                id: true,
                centerName: true,
                phoneNumber: true,
                email: true,
                address: true,
              },
            },
          },
        },
        about: { select: { id: true, expertDescription: true } },
        experties: {
          select: {
            id: true,
            expertiesId: true,
            experienceYears: true,
            service: {
              select: { id: true, serviceName: true, serviceGroup: true },
            },
          },
        },
        kycDocs: {
          select: {
            id: true,
            documentType: true,
            documentNumber: true,
            documentUrl: true,
            mediaKey: true,
            isVerified: true,
          },
        },
        media: {
          select: { id: true, mediaType: true, mediaUrl: true, mediaKey: true },
        },
      },
    });

    if (!expert) {
      throw new NotFoundException('Expert not found');
    }

    const { expertMemberships, about, experties, kycDocs, media, ...rest } =
      expert;
    return {
      ...rest,
      centers: expertMemberships.map((m) => m.center),
      expertAbout: about[0] ?? null,
      expertExperties: experties,
      expertKycVerification: kycDocs,
      expertMedia: media,
    };
  }

  async register(firebaseUser: IFirebaseUser, body: RegisterExpertBody) {
    const existing = await this.prisma.experts.findUnique({
      where: { phoneNumber: firebaseUser.phone },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException(
        'Expert already exists with this phone number',
      );
    }

    const expert = await this.prisma.$transaction(async (tx) => {
      const created = await tx.experts.create({
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phoneNumber: firebaseUser.phone,
          firebaseUid: firebaseUser.uid,
          dateOfBirth: new Date(body.dateOfBirth),
          address: body.address,
          gender: body.gender,
          isActive: false,
          isVerified: false,
          isPublic: body.isPublic ?? false,
          isOpenForWork: body.isOpenForWork ?? false,
          termsAndConditionsAccepted: true,
          termsAndConditionsAcceptedOn: new Date(),
          isFreelancer: body.isFreelancer,
          rangeForWork: body.rangeForWork,
          preferredWorkingTimeSlots: (body.preferredWorkingTimeSlots ??
            []) as object,
          profilePicture: body.profilePicture?.location,
          mediaKey: body.profilePicture?.key,
        },
      });

      if (body.expertDescription) {
        await tx.expertAbout.create({
          data: {
            expertId: created.id,
            expertDescription: body.expertDescription,
          },
        });
      }

      if (body.experties?.length) {
        await tx.expertExperties.createMany({
          data: body.experties.map((e) => ({
            expertId: created.id,
            expertiesId: e.expertiesId,
            experienceYears: e.experienceYears,
          })),
        });
      }

      const mediaEntries = this.buildMediaEntries(created.id, body);
      if (mediaEntries.length) {
        await tx.expertMedia.createMany({ data: mediaEntries });
      }

      await this.createKycDocuments(tx, created.id, body);

      return created;
    });

    return {
      expertId: expert.id,
      firstName: expert.firstName,
      lastName: expert.lastName,
      email: expert.email,
      phoneNumber: expert.phoneNumber,
      profilePicture: expert.profilePicture,
      mediaKey: expert.mediaKey,
    };
  }

  async updateProfile(user: IAuthUser, body: UpdateExpertBody) {
    const expert = await this.prisma.experts.findUnique({
      where: { id: user.id },
      select: { id: true, isVerified: true },
    });

    if (!expert) throw new NotFoundException('Expert not found');

    if (!expert.isVerified) {
      throw new ForbiddenException('Expert profile not yet verified');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.experts.update({
        where: { id: user.id },
        data: {
          ...(body.firstName !== undefined && { firstName: body.firstName }),
          ...(body.lastName !== undefined && { lastName: body.lastName }),
          ...(body.email !== undefined && { email: body.email }),
          ...(body.dateOfBirth !== undefined && {
            dateOfBirth: new Date(body.dateOfBirth),
          }),
          ...(body.address !== undefined && {
            address: body.address,
          }),
          ...(body.gender !== undefined && { gender: body.gender }),
          ...(body.isPublic !== undefined && { isPublic: body.isPublic }),
          ...(body.isOpenForWork !== undefined && {
            isOpenForWork: body.isOpenForWork,
          }),
          ...(body.rangeForWork !== undefined && {
            rangeForWork: body.rangeForWork,
          }),
          ...(body.isFreelancer !== undefined && {
            isFreelancer: body.isFreelancer,
          }),
          ...(body.preferredWorkingTimeSlots !== undefined && {
            preferredWorkingTimeSlots: body.preferredWorkingTimeSlots as object,
          }),
          ...(body.profilePicture && {
            profilePicture: body.profilePicture.location,
            mediaKey: body.profilePicture.key,
          }),
        },
      });

      if (body.expertDescription !== undefined) {
        const about = await tx.expertAbout.findFirst({
          where: { expertId: user.id },
        });
        if (about) {
          await tx.expertAbout.update({
            where: { id: about.id },
            data: { expertDescription: body.expertDescription },
          });
        } else {
          await tx.expertAbout.create({
            data: {
              expertId: user.id,
              expertDescription: body.expertDescription,
            },
          });
        }
      }

      if (body.experties !== undefined) {
        const existing = await tx.expertExperties.findMany({
          where: { expertId: user.id },
          select: { id: true, expertiesId: true },
        });
        const existingMap = new Map(existing.map((e) => [e.expertiesId, e.id]));
        const newIds = new Set(body.experties.map((e) => e.expertiesId));

        for (const exp of body.experties) {
          const existingId = existingMap.get(exp.expertiesId);
          if (existingId) {
            await tx.expertExperties.update({
              where: { id: existingId },
              data: { experienceYears: exp.experienceYears },
            });
          } else {
            await tx.expertExperties.create({
              data: {
                expertId: user.id,
                expertiesId: exp.expertiesId,
                experienceYears: exp.experienceYears,
              },
            });
          }
        }

        const toDelete = existing
          .filter((e) => !newIds.has(e.expertiesId))
          .map((e) => e.id);
        if (toDelete.length) {
          await tx.expertExperties.deleteMany({
            where: { id: { in: toDelete } },
          });
        }
      }

      const newMediaEntries = this.buildMediaEntries(user.id, body);
      if (newMediaEntries.length) {
        await tx.expertMedia.deleteMany({ where: { expertId: user.id } });
        await tx.expertMedia.createMany({ data: newMediaEntries });
      }

      await this.createKycDocuments(tx, user.id, body);
    });

    return { success: true, msg: 'Profile updated successfully.' };
  }

  async acceptTerms(userId: number) {
    const expert = await this.prisma.experts.findUnique({
      where: { id: userId },
      select: { id: true, termsAndConditionsAccepted: true },
    });

    if (!expert) throw new NotFoundException('Expert not found');

    if (expert.termsAndConditionsAccepted) {
      throw new BadRequestException('Terms already accepted.');
    }

    await this.prisma.experts.update({
      where: { id: userId },
      data: {
        termsAndConditionsAccepted: true,
        termsAndConditionsAcceptedOn: new Date(),
      },
    });

    return { success: true, msg: 'Terms accepted successfully.' };
  }

  private buildMediaEntries(
    expertId: number,
    body: Pick<
      RegisterExpertBody,
      | 'galleryImage'
      | 'galleryVideo'
      | 'testimonialVideo'
      | 'certificates'
      | 'demoVideo'
    >,
  ) {
    const entries: {
      expertId: number;
      mediaType: ExpertMediaType;
      mediaUrl: string;
      mediaKey: string;
    }[] = [];
    body.galleryImage?.forEach((f) =>
      entries.push({
        expertId,
        mediaType: ExpertMediaType.gallery_image,
        mediaUrl: f.location,
        mediaKey: f.key,
      }),
    );
    body.galleryVideo?.forEach((f) =>
      entries.push({
        expertId,
        mediaType: ExpertMediaType.gallery_video,
        mediaUrl: f.location,
        mediaKey: f.key,
      }),
    );
    body.testimonialVideo?.forEach((f) =>
      entries.push({
        expertId,
        mediaType: ExpertMediaType.testimonial_video,
        mediaUrl: f.location,
        mediaKey: f.key,
      }),
    );
    body.certificates?.forEach((f) =>
      entries.push({
        expertId,
        mediaType: ExpertMediaType.certificates,
        mediaUrl: f.location,
        mediaKey: f.key,
      }),
    );
    if (body.demoVideo) {
      entries.push({
        expertId,
        mediaType: ExpertMediaType.demo_video,
        mediaUrl: body.demoVideo.location,
        mediaKey: body.demoVideo.key,
      });
    }
    return entries;
  }

  private async createKycDocuments(
    tx: Parameters<Parameters<PrismaService['$transaction']>[0]>[0],
    expertId: number,
    body: Pick<
      RegisterExpertBody,
      | 'expertAAdhaarFront'
      | 'expertAAdhaarBack'
      | 'expertPanCard'
      | 'passport'
      | 'drivingLicense'
      | 'expertAadhaarNumber'
      | 'expertPanNumber'
      | 'expertPassportNumber'
      | 'expertDrivingLicenseNumber'
    >,
  ) {
    const docs: {
      file: S3File;
      type: ExpertDocumentType;
      number: string | undefined;
    }[] = [
      {
        file: body.expertAAdhaarFront!,
        type: ExpertDocumentType.aadhaar_front,
        number: body.expertAadhaarNumber,
      },
      {
        file: body.expertAAdhaarBack!,
        type: ExpertDocumentType.aadhaar_back,
        number: body.expertAadhaarNumber,
      },
      {
        file: body.expertPanCard!,
        type: ExpertDocumentType.pan_card,
        number: body.expertPanNumber,
      },
      {
        file: body.passport!,
        type: ExpertDocumentType.passport,
        number: body.expertPassportNumber,
      },
      {
        file: body.drivingLicense!,
        type: ExpertDocumentType.driving_license,
        number: body.expertDrivingLicenseNumber,
      },
    ].filter((d) => d.file != null);

    for (const doc of docs) {
      if (!doc.number) {
        throw new BadRequestException(
          `Document number required for ${doc.type}`,
        );
      }
      const existing = await tx.expertKycVerification.findFirst({
        where: { expertId, documentType: doc.type },
        select: { id: true },
      });
      if (existing) {
        await tx.expertKycVerification.update({
          where: { id: existing.id },
          data: {
            documentNumber: doc.number,
            documentUrl: doc.file.location,
            mediaKey: doc.file.key,
          },
        });
      } else {
        await tx.expertKycVerification.create({
          data: {
            expertId,
            documentType: doc.type,
            documentNumber: doc.number,
            documentUrl: doc.file.location,
            mediaKey: doc.file.key,
          },
        });
      }
    }
  }
}

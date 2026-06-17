import {
  Injectable,
  Logger,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { Prisma } from '../../../../generated/prisma/client.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { BusinessRuleException } from '../../../../common/exceptions/business-rule.exception.js';
import { LearnerProfileNotFoundException } from '../domain/errors/learner-profile.errors.js';
import type {
  UpdateLearnerDto,
  CreateProfileDto,
  UpdateProfileDto,
} from '../infrastructure/http/dto/learner-profile.dto.js';

@Injectable()
export class LearnerProfileService {
  private readonly logger = new Logger(LearnerProfileService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getMe(learnerId: number) {
    const learner = await this.prisma.learners.findUnique({
      where: { id: learnerId },
    });

    if (!learner) throw new LearnerProfileNotFoundException(learnerId);

    const primaryProfile = learner.profileId
      ? await this.prisma.learnerProfiles.findUnique({
          where: { id: Number(learner.profileId) },
          include: {
            interests: {
              include: {
                service: {
                  select: { id: true, serviceName: true, serviceGroup: true },
                },
              },
            },
          },
        })
      : null;

    return { ...omit(learner, ['firebaseUid']), primaryProfile };
  }

  async updateMe(learnerId: number, dto: UpdateLearnerDto) {
    const learner = await this.prisma.learners.findUnique({
      where: { id: learnerId },
    });
    if (!learner) throw new LearnerProfileNotFoundException(learnerId);

    this.logger.log('Updating learner', { learnerId });
    const updated = await this.prisma.learners.update({
      where: { id: learnerId },
      data: dto,
    });
    return omit(updated, ['firebaseUid']);
  }

  async acceptTerms(learnerId: number) {
    const learner = await this.prisma.learners.findUnique({
      where: { id: learnerId },
    });
    if (!learner) throw new LearnerProfileNotFoundException(learnerId);

    if (learner.termsAccepted) {
      throw new BusinessRuleException('Terms already accepted');
    }

    this.logger.log('Terms accepted', { learnerId });
    return this.prisma.learners.update({
      where: { id: learnerId },
      data: { termsAccepted: true, termsAcceptedOn: new Date() },
    });
  }

  async getAllProfiles(learnerId: number) {
    const learner = await this.prisma.learners.findUnique({
      where: { id: learnerId },
      select: { profileId: true },
    });

    const associations = await this.prisma.learnerHasManyProfiles.findMany({
      where: { learnerId },
      include: {
        learnerProfile: {
          include: {
            interests: {
              include: { service: { select: { id: true, serviceName: true } } },
            },
          },
        },
      },
    });

    return associations.map((a) => ({
      ...a,
      learnerProfile: {
        ...a.learnerProfile,
        profileType:
          Number(learner?.profileId) === a.learnerProfileId
            ? 'primary'
            : 'secondary',
      },
    }));
  }

  async getProfile(learnerId: number, profileId: number) {
    const learner = await this.prisma.learners.findUnique({
      where: { id: learnerId },
      select: { profileId: true },
    });

    const association = await this.prisma.learnerHasManyProfiles.findFirst({
      where: { learnerId, learnerProfileId: profileId },
      include: {
        learnerProfile: {
          include: {
            interests: {
              include: { service: { select: { id: true, serviceName: true } } },
            },
          },
        },
      },
    });

    if (!association) throw new LearnerProfileNotFoundException(profileId);

    return {
      ...association,
      learnerProfile: {
        ...association.learnerProfile,
        profileType:
          Number(learner?.profileId) === profileId ? 'primary' : 'secondary',
      },
    };
  }

  async createProfile(learnerId: number, dto: CreateProfileDto) {
    this.logger.log('Creating sub-profile', { learnerId });

    const { interests, ...profileData } = dto;
    const referralCode = `LP${Date.now().toString(36).toUpperCase()}`;

    const profile = await this.prisma.$transaction(async (tx) => {
      const newProfile = await tx.learnerProfiles.create({
        data: {
          ...profileData,
          address: profileData.address as Prisma.InputJsonValue,
          referralCode,
        },
      });

      await tx.learnerHasManyProfiles.create({
        data: { learnerId, learnerProfileId: newProfile.id },
      });

      if (interests && interests.length > 0) {
        await tx.learnersInterest.createMany({
          data: interests.map((serviceId) => ({
            learnerProfileId: newProfile.id,
            serviceId,
          })),
          skipDuplicates: true,
        });
      }

      return newProfile;
    });

    this.logger.log('Sub-profile created', {
      learnerId,
      profileId: profile.id,
    });
    return profile;
  }

  async updateProfile(
    learnerId: number,
    profileId: number,
    dto: UpdateProfileDto,
  ) {
    const association = await this.prisma.learnerHasManyProfiles.findFirst({
      where: { learnerId, learnerProfileId: profileId },
    });

    if (!association) throw new LearnerProfileNotFoundException(profileId);

    this.logger.log('Updating sub-profile', { learnerId, profileId });

    const { interests, address, ...profileData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.learnerProfiles.update({
        where: { id: profileId },
        data: {
          ...profileData,
          ...(address !== undefined && {
            address: address as Prisma.InputJsonValue,
          }),
        },
      });

      if (interests !== undefined) {
        await tx.learnersInterest.deleteMany({
          where: { learnerProfileId: profileId },
        });
        if (interests.length > 0) {
          await tx.learnersInterest.createMany({
            data: interests.map((serviceId) => ({
              learnerProfileId: profileId,
              serviceId,
            })),
            skipDuplicates: true,
          });
        }
      }

      return updated;
    });
  }

  async deleteProfile(learnerId: number, profileId: number) {
    const learner = await this.prisma.learners.findUnique({
      where: { id: learnerId },
      select: { profileId: true },
    });

    if (Number(learner?.profileId) === profileId) {
      throw new BusinessRuleException('Cannot delete primary profile');
    }

    const association = await this.prisma.learnerHasManyProfiles.findFirst({
      where: { learnerId, learnerProfileId: profileId },
    });

    if (!association) throw new LearnerProfileNotFoundException(profileId);

    const activeEnrollments = await this.prisma.batchEnrollments.count({
      where: {
        learnerProfileId: profileId,
        status: { in: ['enrolled', 'pending'] },
      },
    });

    if (activeEnrollments > 0) {
      throw new BusinessRuleException(
        'Cannot delete profile with active enrollments',
        { profileId, activeEnrollments },
      );
    }

    this.logger.log('Deleting sub-profile', { learnerId, profileId });
    await this.prisma.learnerHasManyProfiles.deleteMany({
      where: { learnerId, learnerProfileId: profileId },
    });
    return { message: 'Profile deleted successfully' };
  }
}

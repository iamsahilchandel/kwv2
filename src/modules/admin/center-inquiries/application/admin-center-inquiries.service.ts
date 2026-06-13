import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import {
  paginationParams,
  buildPaginatedResult,
} from '@/common/utils/pagination.util.js';
import { CenterInquiryStatus } from '@/generated/prisma/enums.js';
import {
  CenterInquiryNotFoundException,
  CenterInquiryNoteNotFoundException,
} from '../domain/errors/center-inquiry.errors.js';
import type { CreateCenterInquiryBody } from '../infrastructure/http/dto/create-center-inquiry.dto.js';
import type { UpdateCenterInquiryBody } from '../infrastructure/http/dto/update-center-inquiry.dto.js';
import type { QueryCenterInquiriesQuery } from '../infrastructure/http/dto/query-center-inquiries.dto.js';
import type { CenterInquiryNoteBody } from '../infrastructure/http/dto/center-inquiry-note.dto.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';

const PROTECTED_STATUSES: string[] = [
  CenterInquiryStatus.onboarded,
  CenterInquiryStatus.verified,
  CenterInquiryStatus.verification_rejected,
];

@Injectable()
export class AdminCenterInquiriesService {
  private readonly logger = new Logger(AdminCenterInquiriesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCenterInquiryBody, currentUser: IAuthUser) {
    this.logger.log('Creating center inquiry', {
      adminId: currentUser.id,
      centerName: dto.centerName,
    });

    const { note, assignedTo, ...inquiryData } = dto;

    // Auto-assign to sales-executive submitting
    const resolvedAssignedTo = assignedTo ?? currentUser.id;

    const inquiry = await this.prisma.$transaction(async (tx) => {
      const created = await tx.centerInquiries.create({
        data: {
          centerName: inquiryData.centerName,
          phoneNumber: inquiryData.phoneNumber,
          address: inquiryData.address,
          email: inquiryData.email,
          ...(inquiryData.website && { website: inquiryData.website }),
          ...(inquiryData.servicesAvailable && {
            servicesAvailable: inquiryData.servicesAvailable,
          }),
          status: CenterInquiryStatus.new,
          assignedTo: resolvedAssignedTo,
          assignedBy: resolvedAssignedTo ? currentUser.id : null,
          createdBy: currentUser.id,
        },
      });

      if (note) {
        await tx.centerInquiryNote.create({
          data: { centerInquiryId: created.id, note, adminId: currentUser.id },
        });
      }

      return created;
    });

    this.logger.log('Center inquiry created', { inquiryId: inquiry.id });
    return inquiry;
  }

  async findAll(query: QueryCenterInquiriesQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const { status, assignedTo, search, city, state, startDate, endDate } =
      query;

    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (assignedTo) where.assignedTo = assignedTo;

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(`${endDate}T23:59:59.999Z`),
      };
    }

    // JSON field filters via raw queries are complex — use Prisma's JSON path filtering
    const jsonFilters: Array<Record<string, unknown>> = [];
    if (city) jsonFilters.push({ address: { path: ['city'], equals: city } });
    if (state)
      jsonFilters.push({ address: { path: ['state'], equals: state } });
    if (jsonFilters.length) where.AND = jsonFilters;

    if (search) {
      where.OR = [
        { centerName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.centerInquiries.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'desc' },
        include: {
          notes: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { id: true, note: true, createdAt: true },
          },
        },
      }),
      this.prisma.centerInquiries.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(id: number) {
    const inquiry = await this.prisma.centerInquiries.findUnique({
      where: { id },
      include: { notes: { orderBy: { createdAt: 'desc' } } },
    });
    if (!inquiry) throw new CenterInquiryNotFoundException(id);
    return inquiry;
  }

  async update(
    id: number,
    dto: UpdateCenterInquiryBody,
    currentUser: IAuthUser,
  ) {
    const inquiry = await this.prisma.centerInquiries.findUnique({
      where: { id },
    });
    if (!inquiry) throw new CenterInquiryNotFoundException(id);

    if (dto.status && PROTECTED_STATUSES.includes(inquiry.status)) {
      throw new BadRequestException(
        'Cannot change status of an inquiry in a terminal state',
      );
    }

    if (dto.status && PROTECTED_STATUSES.includes(dto.status)) {
      throw new BadRequestException(
        'Cannot manually set status to onboarded/verified/verification-rejected',
      );
    }

    if (dto.status && !inquiry.assignedTo) {
      throw new BadRequestException(
        'Inquiry must be assigned before status can be changed',
      );
    }

    this.logger.log('Updating center inquiry', {
      inquiryId: id,
      adminId: currentUser.id,
    });
    return this.prisma.centerInquiries.update({
      where: { id },
      data: {
        ...(dto.centerName && { centerName: dto.centerName }),
        ...(dto.email && { email: dto.email }),
        ...(dto.phoneNumber && { phoneNumber: dto.phoneNumber }),
        ...(dto.address && { address: dto.address }),
        ...(dto.website !== undefined && { website: dto.website }),
        ...(dto.status && { status: dto.status }),
        ...(dto.servicesAvailable && {
          servicesAvailable: dto.servicesAvailable,
        }),
        lastModifiedBy: currentUser.id,
      },
    });
  }

  async remove(id: number) {
    const inquiry = await this.prisma.centerInquiries.findUnique({
      where: { id },
    });
    if (!inquiry) throw new CenterInquiryNotFoundException(id);

    await this.prisma.centerInquiries.delete({ where: { id } });
    this.logger.log(`Center inquiry ${id} deleted`);
    return { message: 'Center inquiry deleted' };
  }

  async assign(inquiryId: number, userId: number, currentUser: IAuthUser) {
    const inquiry = await this.prisma.centerInquiries.findUnique({
      where: { id: inquiryId },
    });
    if (!inquiry) throw new CenterInquiryNotFoundException(inquiryId);

    // userId=0 means unassign
    if (userId === 0) {
      this.logger.log('Unassigning center inquiry', {
        inquiryId,
        adminId: currentUser.id,
      });
      return this.prisma.centerInquiries.update({
        where: { id: inquiryId },
        data: { assignedTo: null, assignedBy: currentUser.id },
      });
    }

    const assignee = await this.prisma.appAdminStaff.findUnique({
      where: { id: userId },
    });
    if (!assignee) throw new BadRequestException('Assignee user not found');

    const salesRoles = ['sales_head', 'area_sales_manager', 'sales_executive'];
    if (!salesRoles.includes(assignee.role)) {
      throw new BadRequestException(
        'Inquiries can only be assigned to sales roles',
      );
    }

    this.logger.log('Assigning center inquiry', {
      inquiryId,
      assignedTo: userId,
      adminId: currentUser.id,
    });
    return this.prisma.centerInquiries.update({
      where: { id: inquiryId },
      data: {
        assignedTo: userId,
        assignedBy: currentUser.id,
        lastModifiedBy: currentUser.id,
      },
    });
  }

  async addNote(
    inquiryId: number,
    dto: CenterInquiryNoteBody,
    currentUser: IAuthUser,
  ) {
    const inquiry = await this.prisma.centerInquiries.findUnique({
      where: { id: inquiryId },
    });
    if (!inquiry) throw new CenterInquiryNotFoundException(inquiryId);

    return this.prisma.centerInquiryNote.create({
      data: {
        centerInquiryId: inquiryId,
        note: dto.note,
        adminId: currentUser.id,
      },
    });
  }

  async findNotes(inquiryId: number) {
    return this.prisma.centerInquiryNote.findMany({
      where: { centerInquiryId: inquiryId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateNote(noteId: number, dto: CenterInquiryNoteBody) {
    const note = await this.prisma.centerInquiryNote.findUnique({
      where: { id: noteId },
    });
    if (!note) throw new CenterInquiryNoteNotFoundException(noteId);

    return this.prisma.centerInquiryNote.update({
      where: { id: noteId },
      data: { note: dto.note },
    });
  }

  async deleteNote(noteId: number) {
    const note = await this.prisma.centerInquiryNote.findUnique({
      where: { id: noteId },
    });
    if (!note) throw new CenterInquiryNoteNotFoundException(noteId);

    await this.prisma.centerInquiryNote.delete({ where: { id: noteId } });
    return { message: 'Note deleted' };
  }
}

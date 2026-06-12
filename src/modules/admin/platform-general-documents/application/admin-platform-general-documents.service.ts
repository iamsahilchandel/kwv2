import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import { PlatformGeneralDocumentNotFoundException } from '../domain/errors/platform-general-document.errors.js';
import type { CreatePlatformDocumentDto } from '../infrastructure/http/dto/create-platform-document.dto.js';
import type { UpdatePlatformDocumentDto } from '../infrastructure/http/dto/update-platform-document.dto.js';

@Injectable()
export class AdminPlatformGeneralDocumentsService {
  private readonly logger = new Logger(AdminPlatformGeneralDocumentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.platformGeneralDocuments.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreatePlatformDocumentDto) {
    this.logger.log('Creating platform general document', { title: dto.documentTitle });
    const doc = await this.prisma.platformGeneralDocuments.create({ data: dto });
    this.logger.log('Platform general document created', { docId: doc.id });
    return doc;
  }

  async update(id: number, dto: UpdatePlatformDocumentDto) {
    const doc = await this.prisma.platformGeneralDocuments.findUnique({ where: { id } });
    if (!doc) throw new PlatformGeneralDocumentNotFoundException(id);

    this.logger.log('Updating platform general document', { docId: id });
    return this.prisma.platformGeneralDocuments.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const doc = await this.prisma.platformGeneralDocuments.findUnique({ where: { id } });
    if (!doc) throw new PlatformGeneralDocumentNotFoundException(id);

    await this.prisma.platformGeneralDocuments.delete({ where: { id } });
    this.logger.log(`Platform general document ${id} deleted`);
    return { message: 'Document deleted successfully' };
  }
}

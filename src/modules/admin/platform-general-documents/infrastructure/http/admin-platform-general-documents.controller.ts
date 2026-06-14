import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../../../../../core/guards/admin-auth.guard.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { AdminPlatformGeneralDocumentsService } from '../../application/admin-platform-general-documents.service.js';
import {
  CreatePlatformDocumentSchema,
  type CreatePlatformDocumentBody,
} from './dto/create-platform-document.dto.js';
import {
  UpdatePlatformDocumentSchema,
  type UpdatePlatformDocumentBody,
} from './dto/update-platform-document.dto.js';

@ApiTags('Admin - Platform General Documents')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/platform-general-documents')
export class AdminPlatformGeneralDocumentsController {
  constructor(private readonly service: AdminPlatformGeneralDocumentsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(CreatePlatformDocumentSchema))
    dto: CreatePlatformDocumentBody,
  ) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdatePlatformDocumentSchema))
    dto: UpdatePlatformDocumentBody,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

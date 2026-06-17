import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../../../../../core/guards/admin-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { AdminCenterInquiriesService } from '../../application/admin-center-inquiries.service.js';
import {
  CreateCenterInquirySchema,
  type CreateCenterInquiryBody,
  CreateCenterInquiryDto,
} from './dto/create-center-inquiry.dto.js';
import {
  UpdateCenterInquirySchema,
  type UpdateCenterInquiryBody,
  UpdateCenterInquiryDto,
} from './dto/update-center-inquiry.dto.js';
import {
  QueryCenterInquiriesSchema,
  type QueryCenterInquiriesQuery,
  QueryCenterInquiriesDto,
} from './dto/query-center-inquiries.dto.js';
import {
  CenterInquiryNoteSchema,
  type CenterInquiryNoteBody,
  CenterInquiryNoteDto,
} from './dto/center-inquiry-note.dto.js';

@ApiTags('Admin - Center Inquiries')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/center-inquiries')
export class AdminCenterInquiriesController {
  constructor(private readonly service: AdminCenterInquiriesService) {}

  @Post()
  create(
    @Body()
    dto: CreateCenterInquiryDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.create(dto, user);
  }

  @Get()
  findAll(
    @Query()
    query: QueryCenterInquiriesDto,
  ) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    dto: UpdateCenterInquiryDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post(':id/assign/:userId')
  assign(
    @Param('id', ParseIntPipe) inquiryId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.assign(inquiryId, userId, user);
  }

  @Post(':id/notes')
  addNote(
    @Param('id', ParseIntPipe) inquiryId: number,
    @Body()
    dto: CenterInquiryNoteDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.addNote(inquiryId, dto, user);
  }

  @Get(':id/notes')
  findNotes(@Param('id', ParseIntPipe) inquiryId: number) {
    return this.service.findNotes(inquiryId);
  }

  @Put(':id/notes/:noteId')
  updateNote(
    @Param('noteId', ParseIntPipe) noteId: number,
    @Body()
    dto: CenterInquiryNoteDto,
  ) {
    return this.service.updateNote(noteId, dto);
  }

  @Delete(':id/notes/:noteId')
  deleteNote(@Param('noteId', ParseIntPipe) noteId: number) {
    return this.service.deleteNote(noteId);
  }
}

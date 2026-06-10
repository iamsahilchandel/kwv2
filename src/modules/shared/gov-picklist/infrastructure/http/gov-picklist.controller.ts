import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '@/core/decorators/public.decorator.js';
import { GovPicklistService } from '../../application/gov-picklist.service.js';
import { GovPicklistQueryDto } from './dto/gov-picklist.dto.js';

@ApiTags('Shared - Government Picklists')
@Controller('data-gov-picklist')
export class GovPicklistController {
  constructor(private readonly govPicklistService: GovPicklistService) {}

  @ApiOperation({ summary: 'Get list of Indian states from data.gov.in' })
  @Public()
  @Get('states')
  async getStates(@Query() query: GovPicklistQueryDto) {
    return this.govPicklistService.getStates(query);
  }

  @ApiOperation({ summary: 'Get list of Indian districts from data.gov.in' })
  @Public()
  @Get('districts')
  async getDistricts(@Query() query: GovPicklistQueryDto) {
    return this.govPicklistService.getDistricts(query);
  }
}

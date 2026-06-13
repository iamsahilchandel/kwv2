import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExternalServiceException } from '@/common/exceptions/external-service.exception.js';
import type { GovPicklistQuery } from '../infrastructure/http/dto/gov-picklist.dto.js';

const STATES_RESOURCE_ID = 'a71e60f0-a21d-43de-a6c5-fa5d21600cdb';
const DISTRICTS_RESOURCE_ID = '7f1a6b38-3c26-4bd3-b91e-2e8e06c1b57c';
const BASE_URL = 'https://api.data.gov.in/resource';

@Injectable()
export class GovPicklistService {
  private readonly logger = new Logger(GovPicklistService.name);
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('govPicklist.apiKey') ?? '';
  }

  async getStates(query: GovPicklistQuery): Promise<any> {
    return this.fetchPicklist(STATES_RESOURCE_ID, query);
  }

  async getDistricts(query: GovPicklistQuery): Promise<any> {
    return this.fetchPicklist(DISTRICTS_RESOURCE_ID, query);
  }

  private async fetchPicklist(
    resourceId: string,
    query: GovPicklistQuery,
  ): Promise<any> {
    const params: Record<string, string> = {
      'api-key': this.apiKey,
      format: query.format ?? 'json',
      offset: query.offset ?? '0',
      limit: query.limit ?? '40',
    };

    // Add filter params only if provided
    const filterFields = [
      'document_id',
      'state_code',
      'state_name_english',
      'state_name_local',
      'state_census2011_code',
      'state_or_ut',
      'district_code',
      'district_name_english',
      'district_name_local',
      'district_census2011_code',
    ] as const;

    for (const field of filterFields) {
      if (query[field]) {
        params[`filters[${field}]`] = query[field];
      }
    }

    const url = `${BASE_URL}/${resourceId}?${new URLSearchParams(params)}`;
    this.logger.debug('Fetching gov picklist', { resourceId, filters: params });

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (err) {
      this.logger.error(
        'Gov picklist API request failed',
        (err as Error).stack,
      );
      throw new ExternalServiceException('data.gov.in', (err as Error).message);
    }
  }
}

import type { PaginationQueryDto } from '../dto/pagination.dto.js';
import type { PaginatedResult } from '../types/paginated-result.type.js';

export function paginationParams(dto: PaginationQueryDto) {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 20;
  return {
    skip: (page - 1) * limit,
    take: limit,
    page,
    limit,
  };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  return { items, total, page, limit };
}

import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/client';

/**
 * Converts known Prisma errors into proper NestJS HTTP exceptions.
 * Call inside a catch block and re-throw the result.
 */
export function handlePrismaError(error: unknown): never {
  if (error instanceof PrismaClientInitializationError) {
    throw new ServiceUnavailableException('Database is currently unavailable');
  }

  if (error instanceof PrismaClientValidationError) {
    throw new InternalServerErrorException('Invalid database query');
  }

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException(
          `Unique constraint violation on: ${(error.meta?.['target'] as string[] | undefined)?.join(', ') ?? 'unknown field'}`,
        );
      case 'P2025':
        throw new NotFoundException(
          (error.meta?.['cause'] as string | undefined) ?? 'Record not found',
        );
      case 'P2003':
        throw new ConflictException('Foreign key constraint violation');
      default:
        throw new InternalServerErrorException(`Database error: ${error.code}`);
    }
  }

  throw error;
}

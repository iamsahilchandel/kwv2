import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { type ZodTypeAny, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodTypeAny) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException(formatZodError(result.error));
    }

    return result.data;
  }
}

function formatZodError(error: ZodError) {
  return {
    message: 'Validation failed',
    errors: error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  };
}

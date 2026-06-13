import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodError } from 'zod';

type SafeParseResult =
  | { success: true; data: unknown }
  | { success: false; error: ZodError<any> };

interface ZodSchema {
  safeParse(value: unknown): SafeParseResult;
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

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

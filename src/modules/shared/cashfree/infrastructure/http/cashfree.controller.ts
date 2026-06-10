import { Controller, Post, Headers, Req, RawBodyRequest, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import type { Request } from 'express';
import { CashfreeService } from '../../application/cashfree.service.js';

@ApiTags('Shared - Cashfree Webhooks')
@Controller('cashfree')
export class CashfreeController {
  constructor(private readonly cashfreeService: CashfreeService) {}

  @ApiExcludeEndpoint()
  @Post('webhook')
  async handleWebhook(
    @Headers('x-webhook-signature') signature: string,
    @Headers('x-webhook-timestamp') timestamp: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature || !timestamp) {
      throw new BadRequestException('Missing webhook headers');
    }

    const rawBody = req.rawBody?.toString('utf-8') ?? JSON.stringify(req.body);
    return this.cashfreeService.processWebhook(signature, rawBody, timestamp);
  }
}

import { Module } from '@nestjs/common';
import { CashfreeService } from './application/cashfree.service.js';
import { CashfreeAdapter } from './infrastructure/adapters/cashfree.adapter.js';
import { CashfreeController } from './infrastructure/http/cashfree.controller.js';
import { CASHFREE_PORT } from './application/ports/cashfree.port.js';

@Module({
  controllers: [CashfreeController],
  providers: [
    CashfreeService,
    { provide: CASHFREE_PORT, useClass: CashfreeAdapter },
  ],
  exports: [CashfreeService],
})
export class CashfreeModule {}

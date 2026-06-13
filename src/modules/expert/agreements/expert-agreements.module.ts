import { Module } from '@nestjs/common';
import { ExpertAgreementsController } from './infrastructure/http/expert-agreements.controller.js';
import { ExpertAgreementsService } from './application/expert-agreements.service.js';

@Module({
  controllers: [ExpertAgreementsController],
  providers: [ExpertAgreementsService],
})
export class ExpertAgreementsModule {}

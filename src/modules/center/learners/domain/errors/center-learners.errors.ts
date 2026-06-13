import { NotFoundException } from '@nestjs/common';

export class LearnerNotFoundException extends NotFoundException {
  constructor(learnerId: number) {
    super(`Learner with ID ${learnerId} not found in this center`);
  }
}

export class AccessRequestNotFoundException extends NotFoundException {
  constructor(requestId: number) {
    super(`Access request with ID ${requestId} not found`);
  }
}

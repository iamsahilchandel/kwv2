import { NotFoundException } from '@nestjs/common';

export class LearnerNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Learner with id ${id} not found`);
  }
}

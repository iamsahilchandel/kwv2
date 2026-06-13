import { NotFoundException } from '@nestjs/common';

export class LearnerProfileNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Learner profile with id ${id} not found`);
  }
}

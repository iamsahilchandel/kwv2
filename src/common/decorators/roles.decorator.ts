import { SetMetadata } from '@nestjs/common';
import type {
  AdminRole,
  CenterStaffRole,
} from '../../generated/prisma/enums.js';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: (AdminRole | CenterStaffRole)[]) =>
  SetMetadata(ROLES_KEY, roles);

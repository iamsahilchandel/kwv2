import type {
  AdminRole,
  CenterStaffRole,
  FcmUserType,
} from '../../generated/prisma/enums.js';

export interface IFirebaseUser {
  phone: string;
  uid: string;
}

export interface IAuthUser {
  id: number;
  phone: string;
  userType: FcmUserType;
  role: AdminRole | CenterStaffRole | null;
  firebaseUid: string;
  isActive: boolean;
}

declare module 'express' {
  interface Request {
    firebaseUser?: IFirebaseUser;
    user?: IAuthUser;
  }
}

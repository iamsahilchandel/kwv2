import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { omit } from 'lodash';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import { AdminRole } from '@/generated/prisma/enums.js';
import {
  AdminUserNotFoundException,
  AdminUserAlreadyExistsException,
  AdminUserCannotBeDeletedException,
} from '../domain/errors/admin-user.errors.js';
import type { CreateAdminUserBody } from '../infrastructure/http/dto/create-admin-user.dto.js';
import type { UpdateAdminUserBody } from '../infrastructure/http/dto/update-admin-user.dto.js';
import type { QueryAdminUsersQuery } from '../infrastructure/http/dto/query-admin-users.dto.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';

const SAFE_SELECT = {
  id: true, fullName: true, email: true, phoneNumber: true,
  role: true, isActive: true, reportsTo: true, createdAt: true, updatedAt: true,
};

@Injectable()
export class AdminUsersService {
  private readonly logger = new Logger(AdminUsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAdminUserBody, currentUser: IAuthUser) {
    this.logger.log('Creating admin user', { createdBy: currentUser.id, role: dto.role });

    // Role hierarchy enforcement
    this.assertCanCreateRole(currentUser.role as AdminRole, dto.role);

    const existing = await this.prisma.appAdminStaff.findFirst({
      where: { OR: [{ email: dto.email }, { phoneNumber: dto.phoneNumber }] },
    });
    if (existing) {
      const field = existing.email === dto.email ? 'email' : 'phone number';
      throw new AdminUserAlreadyExistsException(field);
    }

    if (dto.reportsTo) {
      const manager = await this.prisma.appAdminStaff.findUnique({ where: { id: dto.reportsTo } });
      if (!manager) throw new AdminUserNotFoundException(dto.reportsTo);
    }

    const user = await this.prisma.appAdminStaff.create({
      data: { ...dto, isActive: true, createdBy: currentUser.id },
      select: SAFE_SELECT,
    });

    this.logger.log('Admin user created', { userId: user.id, role: user.role });
    return user;
  }

  async findAll(query: QueryAdminUsersQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const { tab, isActive, role, reportsTo, search, startDate, endDate } = query;

    const where: Record<string, unknown> = {};

    if (tab === 'active') where.isActive = true;
    else if (tab === 'inactive') where.isActive = false;
    if (isActive !== undefined) where.isActive = isActive;
    if (role) where.role = role;
    if (reportsTo) where.reportsTo = reportsTo;

    if (startDate && endDate) {
      where.createdAt = { gte: new Date(startDate), lte: new Date(`${endDate}T23:59:59.999Z`) };
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.appAdminStaff.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'desc' },
        select: {
          ...SAFE_SELECT,
          manager: { select: { id: true, fullName: true, role: true } },
        },
      }),
      this.prisma.appAdminStaff.count({ where }),
    ]);

    return buildPaginatedResult(users, total, page, limit);
  }

  async getProfile(currentUser: IAuthUser) {
    const user = await this.prisma.appAdminStaff.findUnique({
      where: { id: currentUser.id },
      select: {
        ...SAFE_SELECT,
        manager: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!user) throw new AdminUserNotFoundException(currentUser.id);
    return user;
  }

  async findOne(id: number) {
    const user = await this.prisma.appAdminStaff.findUnique({
      where: { id },
      select: {
        ...SAFE_SELECT,
        manager: { select: { id: true, fullName: true, role: true } },
      },
    });
    if (!user) throw new AdminUserNotFoundException(id);
    return user;
  }

  async update(id: number, dto: UpdateAdminUserBody, currentUser: IAuthUser) {
    const user = await this.prisma.appAdminStaff.findUnique({ where: { id } });
    if (!user) throw new AdminUserNotFoundException(id);

    // Can't update super-admin (id=1) by others
    if (user.role === AdminRole.super_admin && currentUser.id !== id) {
      throw new ForbiddenException('Cannot update super admin');
    }

    // Role changes only allowed by super_admin / admin
    if (dto.role && !([AdminRole.super_admin, AdminRole.admin] as string[]).includes(currentUser.role ?? '')) {
      throw new ForbiddenException('Only super-admin and admin can change roles');
    }

    this.logger.log('Updating admin user', { userId: id, updatedBy: currentUser.id });
    const updated = await this.prisma.appAdminStaff.update({
      where: { id },
      data: { ...dto, lastModifiedBy: currentUser.id },
      select: SAFE_SELECT,
    });

    this.logger.log('Admin user updated', { userId: id });
    return updated;
  }

  async remove(id: number, currentUser: IAuthUser) {
    if (id === 1) throw new AdminUserCannotBeDeletedException('Cannot delete super admin');
    if (id === currentUser.id) throw new AdminUserCannotBeDeletedException('Cannot delete yourself');

    const user = await this.prisma.appAdminStaff.findUnique({ where: { id } });
    if (!user) throw new AdminUserNotFoundException(id);
    if (user.role === AdminRole.super_admin) {
      throw new AdminUserCannotBeDeletedException('Cannot delete super admin account');
    }

    await this.prisma.appAdminStaff.delete({ where: { id } });
    this.logger.log(`Admin user ${id} deleted by ${currentUser.id}`);
    return { message: 'User deleted successfully' };
  }

  private assertCanCreateRole(creatorRole: AdminRole, targetRole: AdminRole) {
    const hierarchyMap: Partial<Record<AdminRole, AdminRole[]>> = {
      [AdminRole.sales_head]: [AdminRole.area_sales_manager, AdminRole.sales_executive],
      [AdminRole.area_sales_manager]: [AdminRole.sales_executive],
    };

    const allowedRoles = hierarchyMap[creatorRole];
    // super_admin and admin can create any role
    if (([AdminRole.super_admin, AdminRole.admin, AdminRole.admin_account] as string[]).includes(creatorRole)) return;

    if (allowedRoles && !allowedRoles.includes(targetRole)) {
      throw new ForbiddenException(`${creatorRole} cannot create a user with role ${targetRole}`);
    }
  }
}

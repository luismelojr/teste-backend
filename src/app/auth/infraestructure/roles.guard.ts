import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

export const GROUP_PRIORITY = {
  admin: 1,
  manager: 2,
  user: 3,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userGroups = user.groups || [];

    const userMinPriority = Math.min(
      ...userGroups.map((group) => GROUP_PRIORITY[group] || 0),
    );

    return requiredRoles.some(
      (role) => userMinPriority <= (GROUP_PRIORITY[role] || 0),
    );
  }
}

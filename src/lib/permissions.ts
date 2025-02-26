import { UserRole, Permission } from '../types/auth';

const roleHierarchy: Record<UserRole, number> = {
  superadmin: 50,
  company_admin: 40,
  hr_admin: 30,
  manager: 20,
  employee: 10,
};

const rolePermissions: Record<UserRole, Permission[]> = {
  superadmin: [
    { action: 'create', resource: '*' },
    { action: 'read', resource: '*' },
    { action: 'update', resource: '*' },
    { action: 'delete', resource: '*' },
  ],
  company_admin: [
    { action: 'read', resource: 'organization' },
    { action: 'update', resource: 'organization' },
    { action: 'create', resource: 'department' },
    { action: 'read', resource: 'department' },
    { action: 'update', resource: 'department' },
    { action: 'delete', resource: 'department' },
    { action: 'create', resource: 'employee' },
    { action: 'read', resource: 'employee' },
    { action: 'update', resource: 'employee' },
    { action: 'delete', resource: 'employee' },
  ],
  hr_admin: [
    { action: 'read', resource: 'organization' },
    { action: 'read', resource: 'department' },
    { action: 'create', resource: 'employee' },
    { action: 'read', resource: 'employee' },
    { action: 'update', resource: 'employee' },
  ],
  manager: [
    { action: 'read', resource: 'organization' },
    { action: 'read', resource: 'department' },
    { action: 'read', resource: 'employee' },
    { action: 'update', resource: 'employee' },
  ],
  employee: [
    { action: 'read', resource: 'organization' },
    { action: 'read', resource: 'department' },
    { action: 'read', resource: 'employee' },
  ],
};

export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  const userPermissions = rolePermissions[userRole];
  return userPermissions.some(
    (p) =>
      (p.action === permission.action || p.action === '*') &&
      (p.resource === permission.resource || p.resource === '*')
  );
};

export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export type UserRole = 'superadmin' | 'company_admin' | 'hr_admin' | 'manager' | 'employee';

export interface UserRoleData {
  id: string;
  user_id: string;
  organization_id: string | null;
  role: UserRole;
}

export interface AuthUser {
  id: string;
  email: string;
  roles: UserRoleData[];
  organizationId?: string;
}

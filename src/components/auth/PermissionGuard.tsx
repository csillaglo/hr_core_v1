import { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';

interface PermissionGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  organizationId?: string;
}

export const PermissionGuard = ({ children, allowedRoles, organizationId }: PermissionGuardProps) => {
  const { user } = useAuth();

  if (!user) return null;

  const hasPermission = allowedRoles.some(role => 
    user.roles.some(userRole => 
      userRole.role === role && 
      (!organizationId || userRole.organization_id === organizationId)
    ));

  return hasPermission ? <>{children}</> : null;
};

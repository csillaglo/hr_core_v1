import { usePermissions } from '../../hooks/usePermissions';
import type { Permission } from '../../types/auth';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: Permission;
  fallback?: React.ReactNode;
}

export const PermissionGuard = ({ children, permission, fallback = null }: PermissionGuardProps) => {
  const { can } = usePermissions();

  if (!can(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

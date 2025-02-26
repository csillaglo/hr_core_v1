import { useAuth } from '../contexts/AuthContext';
import { hasPermission, hasRole } from '../lib/permissions';
import type { Permission, UserRole } from '../types/auth';

export const usePermissions = () => {
  const { user } = useAuth();

  return {
    can: (permission: Permission): boolean => {
      if (!user) return false;
      return hasPermission(user.role, permission);
    },
    hasRole: (role: UserRole): boolean => {
      if (!user) return false;
      return hasRole(user.role, role);
    },
  };
};

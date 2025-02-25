import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  organizationId?: string;
}

export const RequireAuth = ({ children, allowedRoles, organizationId }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.some(role => 
    user.roles.some(userRole => 
      userRole.role === role && 
      (!organizationId || userRole.organization_id === organizationId)
    ))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

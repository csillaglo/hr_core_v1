export type UserRole = 'superadmin' | 'company_admin' | 'hr_admin' | 'manager' | 'employee';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  organization_id?: string;
  employee_id?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete';
  resource: string;
}

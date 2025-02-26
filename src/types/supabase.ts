export type UserRole = 'admin' | 'hr' | 'manager' | 'employee';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

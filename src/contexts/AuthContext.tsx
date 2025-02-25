import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { AuthUser, UserRoleData } from '../types/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  hasRole: (role: string, organizationId?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserData(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    const { data: roles } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);

    const { data: userData } = await supabase.auth.getUser();
    
    if (userData?.user) {
      setUser({
        id: userData.user.id,
        email: userData.user.email!,
        roles: roles as UserRoleData[],
        organizationId: roles?.[0]?.organization_id
      });
    }
  };

  const signIn = async (email: string, password: string, remember: boolean = false) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        persistSession: remember
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const hasRole = (role: string, organizationId?: string) => {
    if (!user) return false;
    
    return user.roles.some(userRole => 
      userRole.role === role && 
      (!organizationId || userRole.organization_id === organizationId)
    );
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
      resetPassword,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

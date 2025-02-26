import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { AuthState } from '../types/supabase';

export const useAuth = () => {
  const { data, isLoading } = useQuery<AuthState>({
    queryKey: ['auth'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (!session) {
        return { user: null, loading: false };
      }

      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      return {
        user: {
          id: session.user.id,
          email: session.user.email!,
          role: userRole?.role || 'employee',
        },
        loading: false,
      };
    },
  });

  return {
    user: data?.user ?? null,
    loading: isLoading,
  };
};

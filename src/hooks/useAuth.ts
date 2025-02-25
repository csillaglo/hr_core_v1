import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export const useAuth = () => {
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return {
    signIn,
    signOut,
  };
};

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export type Role =
  | 'business_owner'
  | 'manager'
  | 'employee'
  | 'admin'
  | 'platform_admin'
  | 'viewer';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  company_id: string | null;
}

interface AuthContextType {
  user: any;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (payload: any) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  getRoleRedirect: () => string;
}

const AuthContext = createContext<AuthContextType>(null as any);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error) setProfile(data);
  }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user;
      setUser(u);
      if (u) await fetchProfile(u.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) await fetchProfile(u.id);
      else setProfile(null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error: error.message };

    await fetchProfile(data.user.id);
    return { user: data.user };
  };

  const signUp = async (payload: any) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.fullName,
          role: payload.roleSelected,
        },
      },
    });

    if (error) return { error: error.message };

    return { user: data.user };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // 🔥 FIX: ALWAYS USE PROFILE ROLE (NOT AUTH METADATA)
  const getRoleRedirect = () => {
    const role = profile?.role;

    switch (role) {
      case 'business_owner':
      case 'manager':
      case 'admin':
      case 'platform_admin':
        return '/dashboard';

      case 'employee':
      case 'viewer':
      default:
        return '/dashboard';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile: () => fetchProfile(user?.id),
        getRoleRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

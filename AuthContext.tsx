import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export type Role =
  | "owner"
  | "platform_admin"
  | "manager"
  | "employee"
  | "viewer";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  company_id: string | null;
}

type AuthContextType = {
  user: any;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (data: any) => Promise<any>;
  signOut: () => Promise<void>;
  getRoleRedirect: (role?: Role) => string;
  refreshProfile: (userId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    setProfile(data ?? null);
  }

  async function refreshProfile(userId: string) {
    await fetchProfile(userId);
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const sessionUser = data.session?.user || null;
      setUser(sessionUser);

      if (sessionUser) {
        await fetchProfile(sessionUser.id);
      }

      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const sessionUser = session?.user || null;
        setUser(sessionUser);

        if (sessionUser) {
          await fetchProfile(sessionUser.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
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
          role: payload.roleSelected, // MUST MATCH SUPABASE ENUM
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

  const getRoleRedirect = (role?: Role) => {
    const r = role || profile?.role;

    switch (r) {
      case "owner":
      case "platform_admin":
        return "/dashboard";
      case "manager":
        return "/dashboard";
      case "employee":
        return "/dashboard";
      case "viewer":
        return "/dashboard";
      default:
        return "/dashboard";
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
        getRoleRedirect,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

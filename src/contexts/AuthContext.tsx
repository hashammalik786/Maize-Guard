import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

interface UserProfile {
  email: string | null;
  role: 'user' | 'admin';
  created_at?: string;
  createdAt?: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (mounted && data.session?.user) {
          setUser(data.session.user);
          await fetchOrCreateProfile(data.session.user);
          if (location.pathname === '/login' || location.pathname === '/') {
            navigate("/chatbot", { replace: true });
          }
        }
      } catch (e) {
        console.error("Session fetch error", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        setUser(session.user);
        await fetchOrCreateProfile(session.user);
        if (location.pathname === '/login' || location.pathname === '/') {
          navigate("/chatbot", { replace: true });
        }
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]); // Intentionally not including location.pathname to avoid reruns on every single navigation

  const fetchOrCreateProfile = async (supabaseUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        const newProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          role: 'user',
        };
        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();
        
        if (!insertError && inserted) {
          setProfile(inserted as any);
        } else {
          console.warn("Backend missing profiles table or error:", insertError);
        }
      } else if (data) {
        setProfile(data as any);
      } else {
        console.warn("Error fetching profile, or table does not exist:", error);
      }
    } catch (e) {
      console.warn("Could not fetch user profile", e);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

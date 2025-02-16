'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes in auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setError(null);
      console.log('Starting signup process...');
      
      // First, sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: `${window.location.origin}`,
        },
      });
      
      if (signUpError) {
        console.error('Auth signup error:', signUpError);
        throw signUpError;
      }
      
      if (!authData.user) {
        console.error('No user data returned from signup');
        throw new Error('Failed to create user');
      }

      console.log('Auth signup successful, user ID:', authData.user.id);

      // Simplified profile creation
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          username: username,
          streak: 0,
          highest_streak: 0,
          total_score: 0,
          games_played: 0,
        });

      if (profileError) {
        console.error('Profile creation error details:', {
          message: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint,
          userId: authData.user.id,
          username,
        });
        throw new Error(`Failed to create user profile: ${profileError.message}`);
      }

      // Verify profile creation
      const { data: profile, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (fetchError) {
        console.error('Profile verification error:', fetchError);
      } else {
        console.log('Profile created and verified:', profile);
      }

      // If email confirmation is not required, sign in the user immediately
      if (!authData.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          console.error('Auto sign-in error:', signInError);
          throw signInError;
        }
      }
      
    } catch (error) {
      console.error('Full signup error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      const authError = error as AuthError;
      setError(authError);
      throw authError;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
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
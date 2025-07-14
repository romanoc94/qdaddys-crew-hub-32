import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  store_id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'team_member' | 'shift_leader' | 'manager' | 'operator';
  employee_id: string | null;
  phone: string | null;
  pin: string | null;
  permissions: string[];
  is_active: boolean;
}

interface Store {
  id: string;
  name: string;
  location: string;
  address: string | null;
  phone: string | null;
  toast_pos_id: string | null;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  store: Store | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string, storeName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithPin: (pin: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          stores (*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile(profileData as Profile);
        setStore(profileData.stores);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to prevent deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setStore(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, storeName: string = '') => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) return { error };

    // Create store and profile after successful signup
    if (data.user) {
      try {
        // First create the store
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .insert([
            {
              name: storeName || 'My Restaurant',
              location: 'New Location',
              is_active: true
            }
          ])
          .select()
          .single();

        if (storeError) throw storeError;

        // Then create the profile as operator
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: data.user.id,
              store_id: storeData.id,
              first_name: firstName,
              last_name: lastName,
              role: 'operator',
            }
          ]);

        if (profileError) throw profileError;

        // Create onboarding record
        const { error: onboardingError } = await supabase
          .from('store_onboarding')
          .insert([
            {
              store_id: storeData.id,
              step: 'store_setup'
            }
          ]);

        if (onboardingError) throw onboardingError;

      } catch (error) {
        return { error };
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setStore(null);
  };

  const signInWithPin = async (pin: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*, stores (*)')
        .eq('pin', pin)
        .eq('is_active', true)
        .single();

      if (error || !profileData) {
        return { error: { message: 'Invalid PIN' } };
      }

      // For PIN login, we'll create a temporary session-like state
      // This is for guest/temporary access only
      setProfile(profileData as Profile);
      setStore(profileData.stores);
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    store,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithPin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
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
      console.log('Fetching profile for user:', userId);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          stores (*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      if (profileData) {
        console.log('Profile found:', profileData);
        setProfile(profileData as Profile);
        setStore(profileData.stores);
      } else {
        console.log('No profile found for user:', userId);
        setProfile(null);
        setStore(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      setStore(null);
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
    console.log('Starting signup process for:', email);
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      console.error('Auth signup error:', error);
      return { error };
    }

    if (!data.user) {
      console.error('No user returned from signup');
      return { error: { message: 'No user created' } };
    }

    console.log('User created successfully:', data.user.id);

    // Track what we've created for cleanup on failure
    let createdStoreId: string | null = null;
    let createdProfile = false;

    try {
      // First create the store via RPC function
      console.log('Creating store with name:', storeName || 'My Restaurant');
      const { data: storeId, error: storeError } = await supabase.rpc('create_store_during_signup', {
        p_name: storeName || 'My Restaurant',
        p_location: 'New Location',
        p_address: '',
        p_phone: '',
        p_toast_pos_id: ''
      });

      if (storeError) {
        console.error('Store creation error:', storeError);
        throw new Error(`Store creation failed: ${storeError.message}`);
      }

      if (!storeId) {
        console.error('No store ID returned from RPC');
        throw new Error('Store creation failed: No store ID returned');
      }

      createdStoreId = storeId;
      console.log('Store created successfully:', storeId);

      // Then create the profile as operator with all required defaults
      console.log('Creating profile for user:', data.user.id, 'in store:', storeId);
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          store_id: storeId,
          first_name: firstName || '',
          last_name: lastName || '',
          role: 'operator',
          employee_id: null,
          phone: null,
          pin: null,
          permissions: [],
          is_active: true
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }

      createdProfile = true;
      console.log('Profile created successfully');

      // Create onboarding record
      console.log('Creating onboarding record for store:', storeId);
      const { error: onboardingError } = await supabase
        .from('store_onboarding')
        .insert({
          store_id: storeId,
          step: 'store_setup',
          completed_at: null
        });

      if (onboardingError) {
        console.error('Onboarding creation error:', onboardingError);
        throw new Error(`Onboarding creation failed: ${onboardingError.message}`);
      }

      console.log('Onboarding record created successfully');
      console.log('Signup process completed successfully');

      return { error: null };

    } catch (error) {
      console.error('Signup process failed, cleaning up...', error);
      
      // Clean up partial state by signing out the user
      try {
        await supabase.auth.signOut();
        console.log('User signed out after partial failure');
      } catch (signOutError) {
        console.error('Failed to sign out after partial failure:', signOutError);
      }
      
      // Reset local state
      setUser(null);
      setSession(null);
      setProfile(null);
      setStore(null);
      
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'Signup failed. Please try again.' 
        } 
      };
    }
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
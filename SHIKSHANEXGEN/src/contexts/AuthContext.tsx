import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  profile: UserProfile | null;
  emailVerified: boolean;
  signUp: (email: string, password: string, fullName: string, mobile?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  verifyEmail: (token: string) => Promise<{ error: Error | null }>;
  resendVerificationEmail: (email: string, fullName: string) => Promise<{ error: Error | null }>;
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  mobile: string | null;
  qualification: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
}

interface VerificationToken {
  id: string;
  user_id: string;
  email: string;
  token: string;
  expires_at: string;
  created_at: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error.message || JSON.stringify(error));
        // Profile might not exist yet, which is okay
        return;
      }

      setProfile(data);
      setEmailVerified(data?.email_verified || false);
    } catch (error) {
      console.error('Error fetching profile:', error instanceof Error ? error.message : JSON.stringify(error));
    }
  };

  const generateVerificationToken = (): string => {
    // Generate a 6-digit token
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!data && !error);
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout
          setTimeout(() => {
            fetchProfile(session.user.id);
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
        checkAdminRole(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, mobile?: string) => {
    try {
      // Sign up without email confirmation (no emailRedirectTo to prevent Supabase's default email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        return { error };
      }

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: data.user.id,
              full_name: fullName,
              mobile: mobile || null,
              email_verified: false,
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError?.message || JSON.stringify(profileError));
        }

        // Generate verification token
        const token = generateVerificationToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        // Store verification token
        const { error: tokenError } = await supabase
          .from('email_verification_tokens')
          .insert([
            {
              user_id: data.user.id,
              email,
              token,
              expires_at: expiresAt.toISOString(),
            }
          ]);

        if (tokenError) {
          console.error('Error storing verification token:', tokenError?.message || JSON.stringify(tokenError));
        }

        // Send verification email from shikshanextech@gmail.com
        const verificationUrl = `${window.location.origin}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

        try {
          const response = await supabase.functions.invoke('send-verification-email', {
            body: {
              email,
              fullName,
              verificationToken: token,
              verificationUrl,
            }
          });

          if (response.error) {
            console.error('Error sending verification email:', response.error);
          } else {
            console.log('Verification email sent successfully from shikshanextech@gmail.com');
          }
        } catch (emailError) {
          console.error('Error invoking email function:', emailError);
        }

        // Auto sign in the user immediately after signup (no email verification required)
        try {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            console.error('Error auto-signing in user:', signInError);
            // Auto-login failed but signup succeeded, user will see verification page
          } else {
            console.log('User auto-logged in immediately after signup');
          }
        } catch (autoLoginError) {
          console.error('Error during auto-login:', autoLoginError);
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      // Find the verification token
      const { data: tokenData, error: tokenError } = await supabase
        .from('email_verification_tokens')
        .select('*')
        .eq('token', token)
        .single();

      if (tokenError || !tokenData) {
        return { error: new Error('Invalid or expired verification token') };
      }

      // Check if token is expired
      const expiresAt = new Date(tokenData.expires_at);
      if (expiresAt < new Date()) {
        return { error: new Error('Verification token has expired') };
      }

      // Update profile to mark email as verified
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ email_verified: true })
        .eq('user_id', tokenData.user_id);

      if (updateError) {
        return { error: updateError };
      }

      // Delete the used token
      await supabase
        .from('email_verification_tokens')
        .delete()
        .eq('id', tokenData.id);

      setEmailVerified(true);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const resendVerificationEmail = async (email: string, fullName: string) => {
    try {
      // Get user ID from existing verification token
      const { data: existingToken, error: tokenLookupError } = await supabase
        .from('email_verification_tokens')
        .select('user_id')
        .eq('email', email)
        .maybeSingle();

      if (tokenLookupError && tokenLookupError.code !== 'PGRST116') {
        return { error: tokenLookupError };
      }

      // If no existing token, we can't resend without user_id
      if (!existingToken) {
        return { error: new Error('Please sign up first to verify your email') };
      }

      const userId = existingToken.user_id;

      // Generate new verification token
      const token = generateVerificationToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Delete old tokens
      await supabase
        .from('email_verification_tokens')
        .delete()
        .eq('user_id', userId);

      // Store new verification token
      const { error: tokenError } = await supabase
        .from('email_verification_tokens')
        .insert([
          {
            user_id: userId,
            email,
            token,
            expires_at: expiresAt.toISOString(),
          }
        ]);

      if (tokenError) {
        return { error: tokenError };
      }

      // Send verification email
      const verificationUrl = `${window.location.origin}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

      try {
        await supabase.functions.invoke('send-verification-email', {
          body: {
            email,
            fullName,
            verificationToken: token,
            verificationUrl,
          }
        });
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
    setEmailVerified(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAdmin,
      profile,
      emailVerified,
      signUp,
      signIn,
      signOut,
      refreshProfile,
      verifyEmail,
      resendVerificationEmail,
    }}>
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

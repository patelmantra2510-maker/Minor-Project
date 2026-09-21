import { getSupabaseClient, isSupabaseConfigured } from '../services/supabaseClient';
import { demoAuthService } from '../services/demoAuth';
import type { LoginCredentials, SignupCredentials, UserAccount, AuthResult } from './authTypes';
import { sanitizeAuthError } from './authValidation';

export const authService = {
  isConfigured(): boolean {
    // Both Supabase (if configured) and Demo Auth are fully supported.
    // Demo authentication is always active and available, so auth is never blocked.
    return true;
  },

  isSupabaseActive(): boolean {
    return isSupabaseConfigured();
  },

  async getCurrentUser(): Promise<UserAccount | null> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (!error && session?.user) {
            const user = session.user;
            const provider = user.app_metadata?.provider || user.identities?.[0]?.provider || 'email';
            return {
              userId: user.id,
              email: user.email || '',
              name: user.user_metadata?.full_name || user.user_metadata?.name || '',
              avatarUrl: user.user_metadata?.avatar_url,
              emailVerified: !!user.email_confirmed_at,
              provider,
              createdAt: user.created_at,
              lastLoginAt: user.last_sign_in_at,
            };
          }
        } catch {
          // Fall through to demo auth
        }
      }
    }

    return demoAuthService.getCurrentUser();
  },

  async signIn(credentials: LoginCredentials): Promise<AuthResult> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email.trim(),
            password: credentials.password,
            ...(credentials.captchaToken ? { options: { captchaToken: credentials.captchaToken } } : {}),
          });

          if (error) {
            return {
              success: false,
              error: sanitizeAuthError(error),
            };
          }

          if (!data.user) {
            return { success: false, error: 'Invalid email or password.' };
          }

          const provider = data.user.app_metadata?.provider || data.user.identities?.[0]?.provider || 'email';
          const userAccount: UserAccount = {
            userId: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
            avatarUrl: data.user.user_metadata?.avatar_url,
            emailVerified: !!data.user.email_confirmed_at,
            provider,
            createdAt: data.user.created_at,
            lastLoginAt: data.user.last_sign_in_at,
          };

          return {
            success: true,
            user: userAccount,
          };
        } catch (err) {
          return {
            success: false,
            error: sanitizeAuthError(err),
          };
        }
      }
    }

    // Default to Demo Auth
    return demoAuthService.signIn(credentials);
  },

  async signUp(credentials: SignupCredentials): Promise<AuthResult> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: credentials.email.trim(),
            password: credentials.password,
            options: {
              data: {
                full_name: credentials.name?.trim() || '',
              },
              ...(credentials.captchaToken ? { captchaToken: credentials.captchaToken } : {}),
            },
          });

          if (error) {
            return {
              success: false,
              error: sanitizeAuthError(error),
            };
          }

          if (!data.user) {
            return { success: false, error: 'Registration could not be completed.' };
          }

          const requiresConfirmation = !data.session;
          const provider = data.user.app_metadata?.provider || data.user.identities?.[0]?.provider || 'email';

          const userAccount: UserAccount = {
            userId: data.user.id,
            email: data.user.email || '',
            name: credentials.name?.trim() || '',
            emailVerified: !!data.user.email_confirmed_at,
            provider,
            createdAt: data.user.created_at,
            lastLoginAt: data.user.last_sign_in_at,
          };

          return {
            success: true,
            user: userAccount,
            requiresEmailConfirmation: requiresConfirmation,
          };
        } catch (err) {
          return {
            success: false,
            error: sanitizeAuthError(err),
          };
        }
      }
    }

    // Default to Demo Auth
    return demoAuthService.signUp(credentials);
  },

  async signInWithGoogle(options?: { redirectTo?: string }): Promise<{ error?: string }> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const redirectUrl =
            options?.redirectTo ||
            `${window.location.origin}${window.location.pathname}`;

          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: redirectUrl,
              queryParams: {
                access_type: 'offline',
                prompt: 'select_account',
              },
            },
          });

          if (error) {
            return { error: sanitizeAuthError(error) };
          }
          return {};
        } catch (err) {
          return { error: sanitizeAuthError(err) };
        }
      }
    }

    return demoAuthService.signInWithGoogle();
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.auth.signOut();
        } catch {
          // Ignore errors during sign out
        }
      }
    }

    await demoAuthService.signOut();
  },

  async resetPassword(email: string, captchaToken?: string): Promise<AuthResult> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}${window.location.pathname}#/login`,
            ...(captchaToken ? { captchaToken } : {}),
          });

          if (error) {
            return {
              success: false,
              error: sanitizeAuthError(error),
            };
          }

          return { success: true };
        } catch (err) {
          return {
            success: false,
            error: sanitizeAuthError(err),
          };
        }
      }
    }

    return demoAuthService.resetPassword(email);
  },

  async updateUserProfile(updates: { name: string }): Promise<AuthResult> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.updateUser({
            data: {
              full_name: updates.name.trim(),
            },
          });

          if (error) {
            return {
              success: false,
              error: sanitizeAuthError(error),
            };
          }

          if (!data.user) {
            return { success: false, error: 'Could not update profile.' };
          }

          const userAccount: UserAccount = {
            userId: data.user.id,
            email: data.user.email || '',
            name: updates.name.trim(),
            emailVerified: !!data.user.email_confirmed_at,
            createdAt: data.user.created_at,
            lastLoginAt: data.user.last_sign_in_at,
          };

          return {
            success: true,
            user: userAccount,
          };
        } catch (err) {
          return {
            success: false,
            error: sanitizeAuthError(err),
          };
        }
      }
    }

    return demoAuthService.updateUserProfile(updates);
  },

  async updatePassword(newPassword: string): Promise<AuthResult> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          if (error) {
            return {
              success: false,
              error: sanitizeAuthError(error),
            };
          }

          return { success: true };
        } catch (err) {
          return {
            success: false,
            error: sanitizeAuthError(err),
          };
        }
      }
    }

    return demoAuthService.updatePassword(newPassword);
  },

  onAuthStateChange(callback: (user: UserAccount | null) => void): () => void {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            const u = session.user;
            const provider = u.app_metadata?.provider || u.identities?.[0]?.provider || 'email';
            callback({
              userId: u.id,
              email: u.email || '',
              name: u.user_metadata?.full_name || u.user_metadata?.name || '',
              avatarUrl: u.user_metadata?.avatar_url,
              emailVerified: !!u.email_confirmed_at,
              provider,
              createdAt: u.created_at,
              lastLoginAt: u.last_sign_in_at,
            });
          } else {
            callback(null);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      }
    }

    return demoAuthService.onAuthStateChange(callback);
  },
};


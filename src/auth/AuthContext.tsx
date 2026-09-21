import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserAccount, LoginCredentials, SignupCredentials, AuthResult } from './authTypes';
import { authService } from './authService';
import { demoAuthService } from '../services/demoAuth';

interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  signup: (credentials: SignupCredentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
  resetPassword: (email: string, captchaToken?: string) => Promise<AuthResult>;
  loginWithGoogle: (options?: { redirectTo?: string }) => Promise<{ error?: string }>;
  updateUserProfile: (updates: { name: string }) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isConfigured = authService.isConfigured();
  const isSupabase = authService.isSupabaseActive();
  const [user, setUser] = useState<UserAccount | null>(() => {
    if (typeof window !== 'undefined' && !isSupabase) {
      return demoAuthService.getCurrentUser();
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(() => isSupabase);

  useEffect(() => {
    let mounted = true;

    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // Check current session
    authService
      .getCurrentUser()
      .then((currentUser) => {
        if (mounted) {
          setUser(currentUser);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      });

    // Listen to real-time auth changes
    const unsubscribe = authService.onAuthStateChange((updatedUser) => {
      if (mounted) {
        setUser(updatedUser);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [isConfigured]);

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    setLoading(true);
    try {
      const result = await authService.signIn(credentials);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<AuthResult> => {
    setLoading(true);
    try {
      const result = await authService.signUp(credentials);
      if (result.success && result.user && !result.requiresEmailConfirmation) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string, captchaToken?: string): Promise<AuthResult> => {
    return authService.resetPassword(email, captchaToken);
  };

  const loginWithGoogle = async (options?: { redirectTo?: string }): Promise<{ error?: string }> => {
    return authService.signInWithGoogle(options);
  };

  const updateUserProfile = async (updates: { name: string }): Promise<AuthResult> => {
    setLoading(true);
    try {
      const result = await authService.updateUserProfile(updates);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string): Promise<AuthResult> => {
    return authService.updatePassword(newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isConfigured,
        login,
        signup,
        logout,
        resetPassword,
        loginWithGoogle,
        updateUserProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication and User Account Types for Edvora
 */

export interface UserAccount {
  userId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  provider?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AuthState {
  user: UserAccount | null;
  loading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  captchaToken?: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
  captchaToken?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: UserAccount;
  requiresEmailConfirmation?: boolean;
}

/**
 * Client-side Authentication Form Validation and Error Sanitization
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required. Please enter your email address.' };
  }
  const cleanEmail = email.trim();
  if (cleanEmail.includes('..')) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password is required. Please enter your password.' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters.' };
  }
  return { isValid: true };
}

export function validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword || confirmPassword.length === 0) {
    return { isValid: false, error: 'Please confirm your password.' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match.' };
  }
  return { isValid: true };
}

export function sanitizeAuthError(error: unknown): string {
  if (!error) return "We couldn't sign you in right now. Please try again.";

  const message = typeof error === 'string' ? error : (error as any)?.message || '';

  // Match common Supabase auth errors to friendly user messages
  if (
    message.includes('Invalid login credentials') ||
    message.includes('invalid_grant') ||
    message.includes('invalid credentials') ||
    message.includes('invalid email or password')
  ) {
    return 'Email or password is incorrect. Please check your details and try again.';
  }
  if (message.includes('User already registered') || message.includes('already registered')) {
    return 'An account with this email already exists. Please sign in.';
  }
  if (message.includes('Password should be at least')) {
    return 'Password must be at least 6 characters.';
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (message.includes('network') || message.includes('Failed to fetch')) {
    return "We couldn't sign you in right now. Please try again.";
  }
  if (message.includes('Email not confirmed')) {
    return 'Please check your email and verify your account before logging in.';
  }

  return "We couldn't sign you in right now. Please try again.";
}

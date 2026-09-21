import type { LoginCredentials, SignupCredentials, UserAccount, AuthResult } from '../auth/authTypes';

export const DEMO_USERS_KEY = 'edvora_demo_users';
export const DEMO_SESSION_KEY = 'edvora_demo_session';

export interface StoredDemoUser {
  userId: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface DemoSession {
  userId: string;
  email: string;
  name: string;
  authenticated: true;
  lastLoginAt: string;
}

// Initial seed account for immediate demo evaluation
export const DEFAULT_DEMO_USER: StoredDemoUser = {
  userId: 'demo-student-001',
  name: 'Demo Student',
  email: 'student@edvora.demo',
  password: 'demo123',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const getLocalStorage = (): Storage | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

export function getStoredDemoUsers(): StoredDemoUser[] {
  const storage = getLocalStorage();
  if (!storage) return [DEFAULT_DEMO_USER];
  try {
    const raw = storage.getItem(DEMO_USERS_KEY);
    if (!raw) {
      storage.setItem(DEMO_USERS_KEY, JSON.stringify([DEFAULT_DEMO_USER]));
      return [DEFAULT_DEMO_USER];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      storage.setItem(DEMO_USERS_KEY, JSON.stringify([DEFAULT_DEMO_USER]));
      return [DEFAULT_DEMO_USER];
    }
    // Ensure default demo user student@edvora.demo is always available
    if (!parsed.some((u) => u.email.toLowerCase() === DEFAULT_DEMO_USER.email.toLowerCase())) {
      parsed.push(DEFAULT_DEMO_USER);
      storage.setItem(DEMO_USERS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return [DEFAULT_DEMO_USER];
  }
}

export function saveStoredDemoUsers(users: StoredDemoUser[]): void {
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.warn('Failed to save demo users to localStorage:', err);
  }
}

export function getStoredDemoSession(): DemoSession | null {
  const storage = getLocalStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session && session.authenticated && session.userId && session.email) {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveStoredDemoSession(session: DemoSession | null): void {
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    if (!session) {
      storage.removeItem(DEMO_SESSION_KEY);
    } else {
      storage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
    }
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      if (typeof CustomEvent !== 'undefined') {
        window.dispatchEvent(new CustomEvent('edvora:demo-auth-change'));
      } else {
        window.dispatchEvent({ type: 'edvora:demo-auth-change' } as any);
      }
    }
  } catch (err) {
    console.warn('Failed to save demo session to localStorage:', err);
  }
}

export const demoAuthService = {
  getCurrentUser(): UserAccount | null {
    const session = getStoredDemoSession();
    if (!session) return null;
    return {
      userId: session.userId,
      email: session.email,
      name: session.name,
      emailVerified: true,
      provider: 'email',
      createdAt: session.lastLoginAt,
      lastLoginAt: session.lastLoginAt,
    };
  },

  async signIn(credentials: LoginCredentials): Promise<AuthResult> {
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    if (!email || !password) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const users = getStoredDemoUsers();
    const user = users.find((u) => u.email.toLowerCase() === email);

    if (!user || user.password !== password) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const now = new Date().toISOString();
    const session: DemoSession = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      authenticated: true,
      lastLoginAt: now,
    };

    saveStoredDemoSession(session);

    return {
      success: true,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        emailVerified: true,
        provider: 'email',
        createdAt: user.createdAt,
        lastLoginAt: now,
      },
    };
  },

  async signUp(credentials: SignupCredentials): Promise<AuthResult> {
    const name = (credentials.name || '').trim();
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    if (!name || name.length < 2) {
      return { success: false, error: 'Please provide your full name (at least 2 characters).' };
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const users = getStoredDemoUsers();
    if (users.some((u) => u.email.toLowerCase() === email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const now = new Date().toISOString();
    const newUser: StoredDemoUser = {
      userId: `demo-student-${Date.now()}`,
      name,
      email,
      password,
      createdAt: now,
    };

    users.push(newUser);
    saveStoredDemoUsers(users);

    const session: DemoSession = {
      userId: newUser.userId,
      email: newUser.email,
      name: newUser.name,
      authenticated: true,
      lastLoginAt: now,
    };

    saveStoredDemoSession(session);

    return {
      success: true,
      user: {
        userId: newUser.userId,
        email: newUser.email,
        name: newUser.name,
        emailVerified: true,
        provider: 'email',
        createdAt: now,
        lastLoginAt: now,
      },
      requiresEmailConfirmation: false,
    };
  },

  async signOut(): Promise<void> {
    saveStoredDemoSession(null);
  },

  async resetPassword(email: string): Promise<AuthResult> {
    const trimmed = email.trim().toLowerCase();
    const users = getStoredDemoUsers();
    if (!users.some((u) => u.email.toLowerCase() === trimmed)) {
      return { success: false, error: 'No account found with this email address.' };
    }
    return { success: true };
  },

  async signInWithGoogle(): Promise<{ error?: string }> {
    return {
      error: 'Google sign-in is not supported in the demo.',
    };
  },

  async updateUserProfile(updates: { name: string }): Promise<AuthResult> {
    const session = getStoredDemoSession();
    if (!session) {
      return { success: false, error: 'User is not signed in.' };
    }
    const newName = updates.name.trim();
    if (!newName) {
      return { success: false, error: 'Name cannot be empty.' };
    }

    session.name = newName;
    saveStoredDemoSession(session);

    const users = getStoredDemoUsers();
    const user = users.find((u) => u.userId === session.userId);
    if (user) {
      user.name = newName;
      saveStoredDemoUsers(users);
    }

    return {
      success: true,
      user: {
        userId: session.userId,
        email: session.email,
        name: newName,
        emailVerified: true,
        provider: 'email',
        createdAt: session.lastLoginAt,
        lastLoginAt: session.lastLoginAt,
      },
    };
  },

  async updatePassword(newPassword: string): Promise<AuthResult> {
    const session = getStoredDemoSession();
    if (!session) {
      return { success: false, error: 'User is not signed in.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const users = getStoredDemoUsers();
    const user = users.find((u) => u.userId === session.userId);
    if (user) {
      user.password = newPassword;
      saveStoredDemoUsers(users);
    }

    return { success: true };
  },

  onAuthStateChange(callback: (user: UserAccount | null) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const handler = () => {
      callback(this.getCurrentUser());
    };

    window.addEventListener('storage', handler);
    window.addEventListener('edvora:demo-auth-change', handler);

    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('edvora:demo-auth-change', handler);
    };
  },
};

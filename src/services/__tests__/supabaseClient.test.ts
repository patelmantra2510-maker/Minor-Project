import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  isSupabaseConfigured,
  getSupabaseClient,
  getSupabaseUrl,
  getSupabaseAnonKey,
} from '../supabaseClient';

describe('Supabase Client Configuration', () => {
  const proc = (globalThis as any).process;
  const originalEnv = { ...proc?.env };

  beforeEach(() => {
    if (proc?.env) {
      delete proc.env.VITE_SUPABASE_URL;
      delete proc.env.VITE_SUPABASE_ANON_KEY;
      delete proc.env.SUPABASE_URL;
      delete proc.env.SUPABASE_ANON_KEY;
    }
    if (typeof window !== 'undefined') {
      delete (window as any).VITE_SUPABASE_URL;
      delete (window as any).VITE_SUPABASE_ANON_KEY;
      delete (window as any).__ENV__;
      window.localStorage?.clear();
    }
  });

  afterEach(() => {
    if (proc) {
      proc.env = { ...originalEnv };
    }
    if (typeof window !== 'undefined') {
      window.localStorage?.clear();
    }
  });

  it('returns false when no environment variables are present', () => {
    expect(isSupabaseConfigured()).toBe(false);
    expect(getSupabaseClient()).toBeNull();
  });

  it('returns false when placeholder URL is present', () => {
    proc.env.VITE_SUPABASE_URL = 'https://your-project-id.supabase.co';
    proc.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validkeyhere';

    expect(isSupabaseConfigured()).toBe(false);
    expect(getSupabaseClient()).toBeNull();
  });

  it('returns false when placeholder anon key is present', () => {
    proc.env.VITE_SUPABASE_URL = 'https://xyzcompany.supabase.co';
    proc.env.VITE_SUPABASE_ANON_KEY = 'your-anon-key-here';

    expect(isSupabaseConfigured()).toBe(false);
    expect(getSupabaseClient()).toBeNull();
  });

  it('returns false when anon key is too short or placeholder', () => {
    proc.env.VITE_SUPABASE_URL = 'https://xyzcompany.supabase.co';
    proc.env.VITE_SUPABASE_ANON_KEY = 'short';

    expect(isSupabaseConfigured()).toBe(false);
  });

  it('returns false when URL protocol is invalid', () => {
    proc.env.VITE_SUPABASE_URL = 'not-a-valid-url';
    proc.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validkeyhere';

    expect(isSupabaseConfigured()).toBe(false);
  });

  it('returns true when valid Supabase configuration is provided via VITE_ variables', () => {
    proc.env.VITE_SUPABASE_URL = 'https://abcdefghijkl.supabase.co';
    proc.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validtoken1234567890';

    expect(isSupabaseConfigured()).toBe(true);
    expect(getSupabaseUrl()).toBe('https://abcdefghijkl.supabase.co');
    expect(getSupabaseAnonKey()).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validtoken1234567890');

    const client = getSupabaseClient();
    expect(client).not.toBeNull();
    expect(client?.auth).toBeDefined();
  });

  it('strips enclosing quotes and trims whitespace from variables', () => {
    proc.env.VITE_SUPABASE_URL = '  "https://abcdefghijkl.supabase.co"  ';
    proc.env.VITE_SUPABASE_ANON_KEY = " 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validtoken1234567890' ";

    expect(isSupabaseConfigured()).toBe(true);
    expect(getSupabaseUrl()).toBe('https://abcdefghijkl.supabase.co');
    expect(getSupabaseAnonKey()).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validtoken1234567890');
  });

  it('falls back cleanly to SUPABASE_URL without VITE_ prefix if provided', () => {
    proc.env.SUPABASE_URL = 'https://fallback-project.supabase.co';
    proc.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fallbacktoken12345';

    expect(isSupabaseConfigured()).toBe(true);
    expect(getSupabaseUrl()).toBe('https://fallback-project.supabase.co');
    expect(getSupabaseAnonKey()).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fallbacktoken12345');
  });

  it('supports runtime window / localStorage configuration in browser environments', () => {
    const mockStorage: Record<string, string> = {};
    (globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => mockStorage[k] || null,
        setItem: (k: string, v: string) => { mockStorage[k] = v; },
        clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
      },
    };

    (globalThis as any).window.localStorage.setItem('VITE_SUPABASE_URL', 'https://local-stored.supabase.co');
    (globalThis as any).window.localStorage.setItem('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.localstoredkey12345');

    expect(isSupabaseConfigured()).toBe(true);
    expect(getSupabaseUrl()).toBe('https://local-stored.supabase.co');
    expect(getSupabaseAnonKey()).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.localstoredkey12345');

    delete (globalThis as any).window;
  });
});

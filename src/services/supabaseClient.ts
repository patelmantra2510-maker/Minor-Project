import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const cleanEnvValue = (val: unknown): string => {
  if (typeof val !== 'string') return '';
  let str = val.trim();
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1).trim();
  }
  return str;
};

export function getSupabaseUrl(): string {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
  const win = typeof window !== 'undefined' ? (window as any) : undefined;
  const proc = typeof globalThis !== 'undefined' ? (globalThis as any).process?.env : undefined;

  const raw =
    metaEnv?.VITE_SUPABASE_URL ||
    metaEnv?.SUPABASE_URL ||
    win?.__ENV__?.VITE_SUPABASE_URL ||
    win?.__ENV__?.SUPABASE_URL ||
    win?.VITE_SUPABASE_URL ||
    win?.localStorage?.getItem('VITE_SUPABASE_URL') ||
    win?.localStorage?.getItem('supabase_url') ||
    proc?.VITE_SUPABASE_URL ||
    proc?.SUPABASE_URL ||
    '';

  return cleanEnvValue(raw);
}

export function getSupabaseAnonKey(): string {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
  const win = typeof window !== 'undefined' ? (window as any) : undefined;
  const proc = typeof globalThis !== 'undefined' ? (globalThis as any).process?.env : undefined;

  const raw =
    metaEnv?.VITE_SUPABASE_ANON_KEY ||
    metaEnv?.SUPABASE_ANON_KEY ||
    metaEnv?.VITE_SUPABASE_KEY ||
    metaEnv?.SUPABASE_KEY ||
    metaEnv?.VITE_SUPABASE_PUBLISHABLE_KEY ||
    win?.__ENV__?.VITE_SUPABASE_ANON_KEY ||
    win?.__ENV__?.SUPABASE_ANON_KEY ||
    win?.VITE_SUPABASE_ANON_KEY ||
    win?.localStorage?.getItem('VITE_SUPABASE_ANON_KEY') ||
    win?.localStorage?.getItem('supabase_anon_key') ||
    proc?.VITE_SUPABASE_ANON_KEY ||
    proc?.SUPABASE_ANON_KEY ||
    proc?.VITE_SUPABASE_KEY ||
    proc?.SUPABASE_KEY ||
    '';

  return cleanEnvValue(raw);
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) return false;

  const lowerUrl = url.toLowerCase();
  const lowerKey = key.toLowerCase();

  // Guard against placeholder strings from .env.example
  if (
    lowerUrl.includes('your-project-id') ||
    lowerUrl.includes('your-supabase-url') ||
    lowerUrl.includes('example.com') ||
    lowerKey.includes('your-anon-key') ||
    lowerKey.includes('your-anon-public-key') ||
    lowerKey === 'placeholder' ||
    lowerKey.length < 10
  ) {
    return false;
  }

  // Must be a valid URL with http: or https: protocol
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
}

let clientInstance: SupabaseClient | null = null;
let lastUrl: string | undefined;
let lastKey: string | undefined;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!clientInstance || lastUrl !== url || lastKey !== key) {
    lastUrl = url;
    lastKey = key;
    clientInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return clientInstance;
}

// Proxied supabase export to avoid stale null closures when imported before configuration
export const supabase: SupabaseClient | null = new Proxy({} as any, {
  get(_target, prop) {
    const client = getSupabaseClient();
    if (!client) return undefined;
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
}) as SupabaseClient;


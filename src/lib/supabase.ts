/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { t } from './i18nHelper';

// Resolve Supabase credentials: local custom settings take precedence over ENV
export function getSupabaseCredentials(): { url: string; key: string } {
  const localUrl = localStorage.getItem('A1L_SUPABASE_URL');
  const localKey = localStorage.getItem('A1L_SUPABASE_KEY');

  const url = (localUrl && localUrl.trim()) 
    ? localUrl 
    : (import.meta.env.VITE_SUPABASE_URL || '');
    
  const key = (localKey && localKey.trim()) 
    ? localKey 
    : (import.meta.env.VITE_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '');

  return { url: url.trim(), key: key.trim() };
}

let clientInstance: SupabaseClient | null = null;

export function initSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();
  if (url && key && !url.includes('your-project')) {
    try {
      const isServiceRole = key.includes('service_role') || key.length > 180;
      clientInstance = createClient(
        url, 
        key, 
        isServiceRole ? { auth: { persistSession: false, autoRefreshToken: false } } : undefined
      );
      return clientInstance;
    } catch (e) {
      console.error('[Supabase Init Error]', e);
      clientInstance = null;
      return null;
    }
  }
  clientInstance = null;
  return null;
}

// Initial client
clientInstance = initSupabaseClient();

export function getSupabaseClient(): SupabaseClient | null {
  if (!clientInstance) {
    clientInstance = initSupabaseClient();
  }
  return clientInstance;
}

// Backwards compatibility export
export const supabase = getSupabaseClient();

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && !url.includes('your-project'));
}

export function saveCustomSupabaseConfig(url: string, key: string): { success: boolean; client: SupabaseClient | null } {
  const cleanUrl = url.trim();
  const cleanKey = key.trim();
  
  if (cleanUrl) {
    localStorage.setItem('A1L_SUPABASE_URL', cleanUrl);
  } else {
    localStorage.removeItem('A1L_SUPABASE_URL');
  }

  if (cleanKey) {
    localStorage.setItem('A1L_SUPABASE_KEY', cleanKey);
  } else {
    localStorage.removeItem('A1L_SUPABASE_KEY');
  }

  const client = initSupabaseClient();
  return { success: Boolean(client), client };
}

export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string; isServiceRole?: boolean }> {
  const client = getSupabaseClient();
  if (!client) {
    return { connected: false, message: t('supabaseNotConfiguredMsg') };
  }

  try {
    const { error } = await client.from('profiles').select('id').limit(1);
    if (error) {
      return { connected: false, message: `${t('supabaseConnectionException')}${error.message} (${error.code || ''})` };
    }
    
    // Check key type indicator
    const { key } = getSupabaseCredentials();
    const isServiceRole = key.includes('service_role') || key.length > 180;
    
    return { 
      connected: true, 
      message: isServiceRole 
        ? t('supabaseServiceRoleConnected')
        : t('supabaseNormalConnected'),
      isServiceRole
    };
  } catch (err: any) {
    return { connected: false, message: `${t('supabaseNetworkFailed')}${err.message || '未知错误'}` };
  }
}

export async function loginToSupabaseAuth(email: string, pass: string): Promise<{ success: boolean; error?: string; user?: any }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: t('supabaseNotConfigured') };
  
  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password: pass
    });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || t('supabaseLoginException') };
  }
}

export async function getCurrentSupabaseAuthUser(): Promise<any | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data } = await client.auth.getUser();
    return data?.user || null;
  } catch {
    return null;
  }
}

import { supabase } from './supabase';

const KEY = 'zenite-storage';

// Minimal typed view of supabase.auth (robust across type versions; correct at runtime).
const auth = supabase.auth as unknown as {
  getUser: () => Promise<{ data: { user: { id: string; email?: string } | null } }>;
  signInWithOtp: (c: { email: string }) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<unknown>;
};

export function cloudConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
export async function getUserEmail(): Promise<string | null> {
  if (!cloudConfigured()) return null;
  const { data } = await auth.getUser();
  return data.user?.email ?? null;
}
export async function signInEmail(email: string): Promise<void> {
  if (!cloudConfigured()) throw new Error('Supabase não configurado.');
  const { error } = await auth.signInWithOtp({ email });
  if (error) throw new Error(error.message);
}
export async function signOut(): Promise<void> {
  await auth.signOut();
}
export async function saveToCloud(): Promise<void> {
  const { data } = await auth.getUser();
  const user = data.user;
  if (!user) throw new Error('Faça login primeiro.');
  const raw = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null;
  const payload = raw ? JSON.parse(raw) : {};
  const { error } = await supabase.from('zenite_saves').upsert({ user_id: user.id, data: payload, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}
export async function loadFromCloud(): Promise<void> {
  const { data: u } = await auth.getUser();
  const user = u.user;
  if (!user) throw new Error('Faça login primeiro.');
  const { data, error } = await supabase.from('zenite_saves').select('data').eq('user_id', user.id).single();
  if (error) throw new Error(error.message);
  if (data?.data && typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(data.data));
    location.reload();
  }
}

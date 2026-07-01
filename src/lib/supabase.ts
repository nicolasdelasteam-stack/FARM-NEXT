import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Nuvem é opcional. Sem as variáveis, createClient('', '') lança "supabaseUrl is required"
// e quebra o build/prerender. Usamos um placeholder válido; nenhuma chamada real acontece
// porque a UI e o cloud.ts checam cloudConfigured() antes de usar o cliente.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
);

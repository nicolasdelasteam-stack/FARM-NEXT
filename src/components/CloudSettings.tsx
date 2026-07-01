'use client';

import { useEffect, useState } from 'react';
import { cloudConfigured, getUserEmail, signInEmail, signOut, saveToCloud, loadFromCloud } from '@/lib/cloud';

export default function CloudSettings() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  useEffect(() => { if (cloudConfigured()) getUserEmail().then(setUser).catch(() => {}); }, []);
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3500); };

  if (!cloudConfigured()) {
    return (
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <h3 className="font-bold text-sm mb-2">☁️ Nuvem (Supabase)</h3>
        <p className="text-xs text-zinc-500">Defina <code className="text-indigo-300">NEXT_PUBLIC_SUPABASE_URL</code> e <code className="text-indigo-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> no <code>.env.local</code> para sincronizar entre dispositivos. O SQL da tabela está no README.</p>
      </div>
    );
  }
  return (
    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
      <h3 className="font-bold text-sm mb-3">☁️ Nuvem (Supabase)</h3>
      {msg && <p className="text-xs text-indigo-300 mb-2">{msg}</p>}
      {user ? (
        <div className="space-y-2">
          <p className="text-xs text-zinc-400">Logado como <b>{user}</b></p>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => saveToCloud().then(() => flash('Salvo na nuvem ✅')).catch((e: Error) => flash(e.message))} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">Salvar na nuvem</button>
            <button onClick={() => loadFromCloud().then(() => flash('Baixando...')).catch((e: Error) => flash(e.message))} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">Baixar da nuvem</button>
            <button onClick={() => signOut().then(() => setUser(null))} className="px-3 py-1.5 text-zinc-500 text-sm">Sair</button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
          <button onClick={() => signInEmail(email).then(() => flash('Link mágico enviado ao seu email')).catch((e: Error) => flash(e.message))} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">Entrar</button>
        </div>
      )}
    </div>
  );
}

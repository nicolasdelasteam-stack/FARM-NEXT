'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uid, daysSince } from '@/lib/engine';
import { COMPANION_TIPOS } from '@/lib/constants';
import type { CompanionTipo } from '@/lib/types';

export default function CompanheirosPage() {
  const companions = useStore((s) => s.companions);
  const setCompanions = useStore((s) => s.setCompanions);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('amigo');
  const [emoji, setEmoji] = useState('🙂');
  const [aniv, setAniv] = useState('');
  const [juntos, setJuntos] = useState('');
  const [notas, setNotas] = useState('');
  const [open, setOpen] = useState(false);

  const add = () => {
    if (!nome.trim()) return;
    setCompanions([...companions, { id: uid(), nome: nome.trim(), tipo: tipo as CompanionTipo, emoji, aniversario: aniv, dataJuntos: juntos, notas: notas.trim() }]);
    setNome(''); setAniv(''); setJuntos(''); setNotas(''); setOpen(false);
  };
  const del = (id: string) => setCompanions(companions.filter((c) => c.id !== id));

  const EMO = ['🙂', '😎', '🐶', '🐱', '❤️', '👫', '👨‍👩‍👧', '🐹', '🦜', '🐢'];
  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500';
  const daysTogether = (d: string) => { if (!d) return null; return daysSince(d); };

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-black">🐾 Companheiros</h1>
          <p className="text-sm text-zinc-500">Amigos, pets e pessoas queridas.</p>
        </div>
        <button onClick={() => setOpen(!open)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">{open ? 'Fechar' : '+ Adicionar'}</button>
      </div>

      {open && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 mb-5">
          <div className="grid grid-cols-2 gap-2">
            <input className={inp} placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            <select className={inp} value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {Object.entries(COMPANION_TIPOS).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
            </select>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {EMO.map((e) => <button key={e} onClick={() => setEmoji(e)} className={`w-9 h-9 rounded-lg text-lg ${emoji === e ? 'bg-indigo-600' : 'bg-zinc-800'}`}>{e}</button>)}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs text-zinc-500">Aniversário</label><input className={inp} type="date" value={aniv} onChange={(e) => setAniv(e.target.value)} /></div>
            <div><label className="text-xs text-zinc-500">Juntos desde</label><input className={inp} type="date" value={juntos} onChange={(e) => setJuntos(e.target.value)} /></div>
          </div>
          <textarea className={inp} rows={2} placeholder="Notas (gostos, lembretes...)" value={notas} onChange={(e) => setNotas(e.target.value)} />
          <button onClick={add} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">Salvar companheiro</button>
        </div>
      )}

      {companions.length === 0 && <p className="text-sm text-zinc-600">Nenhum companheiro cadastrado ainda.</p>}
      <div className="grid md:grid-cols-2 gap-3">
        {companions.map((c) => {
          const dt = daysTogether(c.dataJuntos);
          return (
            <div key={c.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{c.emoji}</span>
                <div className="flex-1">
                  <div className="font-bold">{c.nome}</div>
                  <div className="text-xs text-zinc-500">{COMPANION_TIPOS[c.tipo]?.label || c.tipo}</div>
                </div>
                <button onClick={() => del(c.id)} className="text-zinc-600 hover:text-red-400 text-sm">✕</button>
              </div>
              <div className="mt-2 space-y-0.5 text-xs text-zinc-400">
                {c.aniversario && <div>🎂 {new Date(c.aniversario).toLocaleDateString('pt-BR')}</div>}
                {dt != null && <div>💞 Juntos há {dt} dias</div>}
                {c.notas && <div className="text-zinc-500 mt-1 whitespace-pre-wrap">{c.notas}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

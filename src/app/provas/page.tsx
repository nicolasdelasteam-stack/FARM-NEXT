'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { createMission } from '@/lib/engine';

export default function ProvasPage() {
  const missions = useStore((s) => s.missions);
  const addMission = useStore((s) => s.addMission);
  const updateMission = useStore((s) => s.updateMission);
  const removeMission = useStore((s) => s.removeMission);
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');

  const add = () => {
    if (!titulo.trim() || !data) return;
    addMission(createMission({ title: titulo.trim(), difficulty: 'media', type: 'mission', dueDate: data, skill: 'estudos' }));
    setTitulo(''); setData('');
  };
  const provas = missions.filter((m) => m.dueDate).sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
  const daysTo = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  const inp = 'bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500';

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-black mb-1">📆 Provas & Prazos</h1>
      <p className="text-sm text-zinc-500 mb-4">Trabalhos e provas com data — vira uma missão no Campo automaticamente.</p>

      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-5">
        <div className="flex gap-2">
          <input className={inp + ' flex-1'} placeholder="Ex: Prova de Anatomia" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <input className={inp} type="date" value={data} onChange={(e) => setData(e.target.value)} />
          <button onClick={add} className="px-4 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">+ Agendar</button>
        </div>
      </div>

      {provas.length === 0 && <p className="text-sm text-zinc-600">Nenhum prazo agendado.</p>}
      <div className="space-y-2">
        {provas.map((m) => {
          const dl = daysTo(m.dueDate as string);
          const badge = m.done ? { t: '✓ Concluído', c: 'bg-emerald-900/40 text-emerald-400' }
            : dl < 0 ? { t: 'Atrasada', c: 'bg-red-900/40 text-red-400' }
            : dl === 0 ? { t: 'Hoje!', c: 'bg-amber-900/40 text-amber-400' }
            : { t: `${dl} dia(s)`, c: 'bg-zinc-800 text-zinc-300' };
          return (
            <div key={m.id} className={`flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 ${m.done ? 'opacity-60' : ''}`}>
              <button onClick={() => updateMission(m.id, { done: !m.done, completedAt: m.done ? null : new Date().toISOString() })}
                className={`w-5 h-5 rounded border shrink-0 ${m.done ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`} />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${m.done ? 'line-through' : ''}`}>{m.title}</div>
                <div className="text-xs text-zinc-500">📅 {new Date(m.dueDate as string).toLocaleDateString('pt-BR')}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${badge.c}`}>{badge.t}</span>
              <button onClick={() => removeMission(m.id)} className="text-zinc-600 hover:text-red-400 text-sm">✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

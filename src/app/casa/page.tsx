'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uid } from '@/lib/engine';

const FREQS = ['Diária', 'Semanal', 'Quinzenal', 'Mensal'];

export default function CasaPage() {
  const casa = useStore((s) => s.casa);
  const setCasa = useStore((s) => s.setCasa);
  const [aNome, setANome] = useState(''); const [aEmoji, setAEmoji] = useState('🚗'); const [aObj, setAObj] = useState(''); const [aTar, setATar] = useState('');
  const [tNome, setTNome] = useState(''); const [tFreq, setTFreq] = useState('Semanal');
  const [lTexto, setLTexto] = useState('');

  const addArea = () => { if (!aNome.trim()) return; setCasa({ ...casa, areas: [...casa.areas, { id: uid(), nome: aNome.trim(), emoji: aEmoji, objetivo: aObj.trim(), tarefa: aTar.trim() }] }); setANome(''); setAObj(''); setATar(''); };
  const delArea = (id: string) => setCasa({ ...casa, areas: casa.areas.filter((a) => a.id !== id) });
  const addTarefa = () => { if (!tNome.trim()) return; setCasa({ ...casa, tarefas: [...casa.tarefas, { id: uid(), nome: tNome.trim(), freq: tFreq, done: false }] }); setTNome(''); };
  const toggleTarefa = (id: string) => setCasa({ ...casa, tarefas: casa.tarefas.map((t) => t.id === id ? { ...t, done: !t.done } : t) });
  const delTarefa = (id: string) => setCasa({ ...casa, tarefas: casa.tarefas.filter((t) => t.id !== id) });
  const addLembrete = () => { if (!lTexto.trim()) return; setCasa({ ...casa, lembretes: [...casa.lembretes, { id: uid(), texto: lTexto.trim(), done: false }] }); setLTexto(''); };
  const toggleLembrete = (id: string) => setCasa({ ...casa, lembretes: casa.lembretes.map((l) => l.id === id ? { ...l, done: !l.done } : l) });
  const delLembrete = (id: string) => setCasa({ ...casa, lembretes: casa.lembretes.filter((l) => l.id !== id) });

  const EMO = ['🚗', '🐶', '🌱', '🏠', '🛋️', '🍽️', '🧹', '🪴', '🐱', '🧺'];
  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500';

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-black mb-1">🏠 Organização da Casa</h1>
      <p className="text-sm text-zinc-500 mb-4">Áreas, tarefas recorrentes e lembretes do lar.</p>

      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-4">
        <div className="text-sm font-bold mb-2">Áreas (carro, pets, plantas...)</div>
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          {casa.areas.map((a) => (
            <div key={a.id} className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
              <div className="flex justify-between items-start"><div className="font-semibold">{a.emoji} {a.nome}</div><button onClick={() => delArea(a.id)} className="text-zinc-600 hover:text-red-400 text-xs">✕</button></div>
              {a.objetivo && <div className="text-xs text-zinc-400 mt-1">🎯 {a.objetivo}</div>}
              {a.tarefa && <div className="text-xs text-zinc-500 mt-0.5">📌 {a.tarefa}</div>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select className={inp} value={aEmoji} onChange={(e) => setAEmoji(e.target.value)}>{EMO.map((e) => <option key={e}>{e}</option>)}</select>
          <input className={inp} placeholder="Nome da área" value={aNome} onChange={(e) => setANome(e.target.value)} />
          <input className={inp} placeholder="Objetivo" value={aObj} onChange={(e) => setAObj(e.target.value)} />
          <input className={inp} placeholder="Tarefa" value={aTar} onChange={(e) => setATar(e.target.value)} />
        </div>
        <button onClick={addArea} className="w-full mt-2 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">+ Adicionar área</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="text-sm font-bold mb-2">🧹 Tarefas da casa</div>
          <div className="flex gap-2 mb-2">
            <input className={inp} placeholder="Ex: Lavar o banheiro" value={tNome} onChange={(e) => setTNome(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTarefa()} />
            <select className="bg-zinc-800 border border-zinc-700 rounded px-2 text-sm" value={tFreq} onChange={(e) => setTFreq(e.target.value)}>{FREQS.map((f) => <option key={f}>{f}</option>)}</select>
            <button onClick={addTarefa} className="px-3 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">+</button>
          </div>
          <div className="space-y-1">
            {casa.tarefas.map((t) => (
              <div key={t.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-zinc-800/50">
                <button onClick={() => toggleTarefa(t.id)} className={`w-4 h-4 rounded border shrink-0 ${t.done ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`} />
                <span className={`text-sm flex-1 ${t.done ? 'line-through text-zinc-600' : ''}`}>{t.nome}</span>
                <span className="text-[10px] text-zinc-600">{t.freq}</span>
                <button onClick={() => delTarefa(t.id)} className="text-zinc-600 hover:text-red-400 text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="text-sm font-bold mb-2">📝 Lembretes</div>
          <div className="flex gap-2 mb-2"><input className={inp} placeholder="Ex: Trocar o tapete" value={lTexto} onChange={(e) => setLTexto(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLembrete()} /><button onClick={addLembrete} className="px-3 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">+</button></div>
          <div className="space-y-1">
            {casa.lembretes.map((l) => (
              <div key={l.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-zinc-800/50">
                <button onClick={() => toggleLembrete(l.id)} className={`w-4 h-4 rounded border shrink-0 ${l.done ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`} />
                <span className={`text-sm flex-1 ${l.done ? 'line-through text-zinc-600' : ''}`}>{l.texto}</span>
                <button onClick={() => delLembrete(l.id)} className="text-zinc-600 hover:text-red-400 text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

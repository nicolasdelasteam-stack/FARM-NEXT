'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uid } from '@/lib/engine';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function PlanejamentoPage() {
  const pl = useStore((s) => s.planejamento);
  const setPl = useStore((s) => s.setPlanejamento);
  const [meta, setMeta] = useState('');
  const [prio, setPrio] = useState('');

  const addMeta = () => { if (!meta.trim()) return; setPl({ ...pl, metas: [...pl.metas, { id: uid(), texto: meta.trim(), done: false }] }); setMeta(''); };
  const toggleMeta = (id: string) => setPl({ ...pl, metas: pl.metas.map((m) => m.id === id ? { ...m, done: !m.done } : m) });
  const delMeta = (id: string) => setPl({ ...pl, metas: pl.metas.filter((m) => m.id !== id) });
  const addPrio = () => { if (!prio.trim()) return; setPl({ ...pl, prioridades: [...pl.prioridades, prio.trim()] }); setPrio(''); };
  const delPrio = (idx: number) => setPl({ ...pl, prioridades: pl.prioridades.filter((_v, i) => i !== idx) });
  const setDisc = (mi: number, v: number) => setPl({ ...pl, disciplina: { ...pl.disciplina, [String(mi)]: v } });

  const done = pl.metas.filter((m) => m.done).length;
  const pct = pl.metas.length ? Math.round((done / pl.metas.length) * 100) : 0;
  const discVals = MESES.map((_m, i) => pl.disciplina[String(i)] || 0);
  const media = Math.round(discVals.reduce((a, b) => a + b, 0) / 12);
  const inp = 'flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500';

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-black mb-1">🗓️ Planejamento {pl.ano}</h1>
      <p className="text-sm text-zinc-500 mb-4">Metas do ano, prioridades e sua disciplina mês a mês.</p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex justify-between items-center mb-2"><div className="text-sm font-bold">🎯 Metas do ano</div><span className="text-xs text-emerald-400">{done}/{pl.metas.length} · {pct}%</span></div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden mb-3"><div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} /></div>
          <div className="flex gap-2 mb-2"><input className={inp} placeholder="Nova meta do ano" value={meta} onChange={(e) => setMeta(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addMeta()} /><button onClick={addMeta} className="px-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">+</button></div>
          <div className="space-y-1">
            {pl.metas.map((m) => (
              <div key={m.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-zinc-800/50">
                <button onClick={() => toggleMeta(m.id)} className={`w-4 h-4 rounded border shrink-0 ${m.done ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`} />
                <span className={`text-sm flex-1 ${m.done ? 'line-through text-zinc-600' : ''}`}>{m.texto}</span>
                <button onClick={() => delMeta(m.id)} className="text-zinc-600 hover:text-red-400 text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="text-sm font-bold mb-2">⭐ Prioridades do ano</div>
          <div className="flex gap-2 mb-2"><input className={inp} placeholder="Ex: Saúde em primeiro lugar" value={prio} onChange={(e) => setPrio(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addPrio()} /><button onClick={addPrio} className="px-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">+</button></div>
          <ol className="space-y-1 list-decimal list-inside">
            {pl.prioridades.map((p, i) => (
              <li key={i} className="text-sm flex items-center gap-2"><span className="flex-1">{p}</span><button onClick={() => delPrio(i)} className="text-zinc-600 hover:text-red-400 text-xs">✕</button></li>
            ))}
          </ol>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="flex justify-between items-center mb-3"><div className="text-sm font-bold">📊 Disciplina mensal</div><span className="text-xs text-zinc-500">Média anual: <b className="text-indigo-300">{media}%</b></span></div>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
          {MESES.map((mes, i) => (
            <div key={mes} className="text-center">
              <div className="h-24 flex items-end mb-1"><div className="w-full bg-indigo-600/60 rounded-t" style={{ height: `${discVals[i]}%` }} /></div>
              <input type="number" min={0} max={100} value={pl.disciplina[String(i)] || 0} onChange={(e) => setDisc(i, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))} className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-xs text-center" />
              <div className="text-[10px] text-zinc-600 mt-0.5">{mes}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

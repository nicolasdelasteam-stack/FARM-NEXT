'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uid, daysUntil } from '@/lib/engine';
import { VIAGEM_STATUS, PACKING_TEMPLATE, PACKING_SUGGESTIONS } from '@/lib/constants';
import type { ViagemStatus } from '@/lib/types';

const STATUS_COR: Record<string, string> = {
  quero_ir: 'bg-zinc-700 text-zinc-200', planejando: 'bg-sky-900/50 text-sky-300',
  viajando: 'bg-emerald-900/50 text-emerald-300', ja_fui: 'bg-indigo-900/50 text-indigo-300',
  quero_voltar: 'bg-yellow-900/50 text-yellow-300',
};

function duracao(inicio: string, fim: string): number | null {
  if (!inicio || !fim) return null;
  return Math.round((new Date(fim).getTime() - new Date(inicio).getTime()) / 86400000) + 1;
}

export default function ViagensPage() {
  const viagens = useStore((s) => s.viagens);
  const setViagens = useStore((s) => s.setViagens);
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [custo, setCusto] = useState('');
  const [status, setStatus] = useState<ViagemStatus>('quero_ir');
  const [itemInputs, setItemInputs] = useState<Record<string, { texto: string; grupo: string }>>({});

  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500';

  const addViagem = () => {
    if (!local.trim()) return;
    setViagens([...viagens, { id: uid(), local: local.trim(), inicio, fim, custo: parseFloat(custo) || 0, status, itens: [] }]);
    setLocal(''); setInicio(''); setFim(''); setCusto(''); setOpen(false);
  };
  const delViagem = (id: string) => setViagens(viagens.filter((v) => v.id !== id));
  const setStatusV = (id: string, st: ViagemStatus) => setViagens(viagens.map((v) => v.id === id ? { ...v, status: st } : v));
  const addItemNamed = (vid: string, texto: string, grupo: string) => {
    if (!texto.trim()) return;
    setViagens(viagens.map((v) => v.id === vid ? { ...v, itens: [...v.itens, { id: uid(), texto: texto.trim(), grupo, done: false }] } : v));
  };
  const addItem = (vid: string) => {
    const inputv = itemInputs[vid] || { texto: '', grupo: PACKING_TEMPLATE[0] };
    if (!inputv.texto.trim()) return;
    addItemNamed(vid, inputv.texto, inputv.grupo);
    setItemInputs({ ...itemInputs, [vid]: { texto: '', grupo: inputv.grupo } });
  };
  const toggleItem = (vid: string, iid: string) => setViagens(viagens.map((v) => v.id === vid ? { ...v, itens: v.itens.map((i) => i.id === iid ? { ...i, done: !i.done } : i) } : v));
  const delItem = (vid: string, iid: string) => setViagens(viagens.map((v) => v.id === vid ? { ...v, itens: v.itens.filter((i) => i.id !== iid) } : v));

  const custoTotal = viagens.reduce((s, v) => s + (v.custo || 0), 0);

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-1">
        <div><h1 className="text-xl font-black">✈️ Viagens</h1><p className="text-sm text-zinc-500">Destinos, custos e o que levar na mala.</p></div>
        <button onClick={() => setOpen(!open)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">{open ? 'Fechar' : '+ Viagem'}</button>
      </div>

      {viagens.length > 0 && (
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center"><div className="text-lg font-black">{viagens.length}</div><div className="text-xs text-zinc-500">Viagens</div></div>
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center"><div className="text-lg font-black text-yellow-400">R$ {custoTotal.toFixed(0)}</div><div className="text-xs text-zinc-500">Custo total</div></div>
        </div>
      )}

      {open && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 mb-5">
          <input className={inp} placeholder="Destino" value={local} onChange={(e) => setLocal(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs text-zinc-500">Ida</label><input className={inp} type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} /></div>
            <div><label className="text-xs text-zinc-500">Volta</label><input className={inp} type="date" value={fim} onChange={(e) => setFim(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className={inp} type="number" placeholder="Custo (R$)" value={custo} onChange={(e) => setCusto(e.target.value)} />
            <select className={inp} value={status} onChange={(e) => setStatus(e.target.value as ViagemStatus)}>{Object.entries(VIAGEM_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          </div>
          <button onClick={addViagem} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">Criar viagem</button>
        </div>
      )}

      {viagens.length === 0 && <p className="text-sm text-zinc-600">Nenhuma viagem ainda.</p>}
      <div className="space-y-4">
        {viagens.map((v) => {
          const feitos = v.itens.filter((i) => i.done).length;
          const pct = v.itens.length ? Math.round((feitos / v.itens.length) * 100) : 0;
          const grupos = [...new Set([...v.itens.map((i) => i.grupo)])];
          const ii = itemInputs[v.id] || { texto: '', grupo: PACKING_TEMPLATE[0] };
          const dur = duracao(v.inicio, v.fim);
          const faltam = v.inicio && (v.status === 'quero_ir' || v.status === 'planejando') ? daysUntil(v.inicio) : null;
          const jaAdd = new Set(v.itens.map((i) => `${i.grupo}:${i.texto.toLowerCase()}`));
          const sugestoes = (PACKING_SUGGESTIONS[ii.grupo] || []).filter((s) => !jaAdd.has(`${ii.grupo}:${s.toLowerCase()}`));
          return (
            <div key={v.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <div className="font-bold text-lg truncate">📍 {v.local}</div>
                  <div className="text-xs text-zinc-500">
                    {v.inicio || '?'}{v.fim ? ` → ${v.fim}` : ''}{dur ? ` · ${dur} dia(s)` : ''}{v.custo ? ` · R$ ${v.custo.toFixed(2)}` : ''}
                  </div>
                  {faltam != null && faltam >= 0 && <div className="text-[11px] text-sky-400 mt-0.5">⏳ Faltam {faltam} dia(s)</div>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded ${STATUS_COR[v.status] || 'bg-zinc-700'}`}>{VIAGEM_STATUS[v.status]}</span>
                  <button onClick={() => delViagem(v.id)} className="text-zinc-600 hover:text-red-400 text-sm">✕</button>
                </div>
              </div>

              <div className="mt-2">
                <select value={v.status} onChange={(e) => setStatusV(v.id, e.target.value as ViagemStatus)} className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs">{Object.entries(VIAGEM_STATUS).map(([k, val]) => <option key={k} value={k}>{val}</option>)}</select>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1"><span>🎒 Mala</span><span>{feitos}/{v.itens.length}</span></div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2"><div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
                {grupos.map((g) => (
                  <div key={g} className="mb-1.5">
                    <div className="text-[11px] text-zinc-600 uppercase">{g}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {v.itens.filter((i) => i.grupo === g).map((i) => (
                        <span key={i.id} className={`group inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${i.done ? 'bg-emerald-900/40 text-emerald-400' : 'bg-zinc-800 text-zinc-300'}`}>
                          <button onClick={() => toggleItem(v.id, i.id)} className={i.done ? 'line-through' : ''}>{i.texto}</button>
                          <button onClick={() => delItem(v.id, i.id)} className="text-zinc-600 hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm" placeholder="Item" value={ii.texto} onChange={(e) => setItemInputs({ ...itemInputs, [v.id]: { ...ii, texto: e.target.value } })} onKeyDown={(e) => e.key === 'Enter' && addItem(v.id)} />
                  <select className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm" value={ii.grupo} onChange={(e) => setItemInputs({ ...itemInputs, [v.id]: { ...ii, grupo: e.target.value } })}>{PACKING_TEMPLATE.map((g) => <option key={g}>{g}</option>)}</select>
                  <button onClick={() => addItem(v.id)} className="px-3 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-semibold">+</button>
                </div>
                {sugestoes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[11px] text-zinc-600 self-center">Sugestões ({ii.grupo}):</span>
                    {sugestoes.map((s) => (
                      <button key={s} onClick={() => addItemNamed(v.id, s, ii.grupo)} className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-indigo-600 text-xs text-zinc-300">+ {s}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

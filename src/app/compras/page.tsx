'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uid } from '@/lib/engine';
import { PRIORIDADES } from '@/lib/constants';
import type { Prioridade } from '@/lib/types';

export default function ComprasPage() {
  const compras = useStore((s) => s.compras);
  const setCompras = useStore((s) => s.setCompras);
  const [nome, setNome] = useState('');
  const [icon, setIcon] = useState('🛒');
  const [dNome, setDNome] = useState('');
  const [dValor, setDValor] = useState('');
  const [dPrio, setDPrio] = useState('algum_dia');

  const addMercado = () => {
    if (!nome.trim()) return;
    setCompras({ ...compras, mercado: [...compras.mercado, { id: uid(), nome: nome.trim(), icon, comprado: false }] });
    setNome('');
  };
  const toggleMercado = (id: string) =>
    setCompras({ ...compras, mercado: compras.mercado.map((c) => c.id === id ? { ...c, comprado: !c.comprado } : c) });
  const limparComprados = () =>
    setCompras({ ...compras, mercado: compras.mercado.filter((c) => !c.comprado) });

  const addDesejo = () => {
    if (!dNome.trim()) return;
    setCompras({ ...compras, desejos: [...compras.desejos, { id: uid(), nome: dNome.trim(), valor: parseFloat(dValor) || 0, prioridade: dPrio as Prioridade, comprado: false }] });
    setDNome(''); setDValor('');
  };
  const toggleDesejo = (id: string) =>
    setCompras({ ...compras, desejos: compras.desejos.map((d) => d.id === id ? { ...d, comprado: !d.comprado } : d) });
  const delDesejo = (id: string) =>
    setCompras({ ...compras, desejos: compras.desejos.filter((d) => d.id !== id) });

  const totalDesejos = compras.desejos.filter((d) => !d.comprado).reduce((a, d) => a + d.valor, 0);
  const ICONS = ['🛒', '🥛', '🍎', '🍞', '🥩', '🧻', '🧴', '🥦', '🍚', '🧊'];
  const ordem = ['urgente', 'algum_dia', 'pode_esperar'];
  const inp = 'bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500';

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-black mb-1">🧺 Compras</h1>
      <p className="text-sm text-zinc-500 mb-4">Lista do mercado e lista de desejos.</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-bold">🛒 Mercado</div>
            {compras.mercado.some((c) => c.comprado) && <button onClick={limparComprados} className="text-xs text-zinc-500 hover:text-red-400">Limpar comprados</button>}
          </div>
          <div className="flex gap-2 mb-2">
            <select className={inp} value={icon} onChange={(e) => setIcon(e.target.value)}>{ICONS.map((i) => <option key={i}>{i}</option>)}</select>
            <input className={`${inp} flex-1`} placeholder="Produto" value={nome} onChange={(e) => setNome(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addMercado()} />
            <button onClick={addMercado} className="px-3 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">+</button>
          </div>
          <div className="space-y-1">
            {compras.mercado.length === 0 && <p className="text-sm text-zinc-600 py-2">Lista vazia.</p>}
            {compras.mercado.map((c) => (
              <button key={c.id} onClick={() => toggleMercado(c.id)} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/60 text-left">
                <span className={`w-4 h-4 rounded border ${c.comprado ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`} />
                <span className="text-base">{c.icon}</span>
                <span className={`text-sm flex-1 ${c.comprado ? 'line-through text-zinc-600' : ''}`}>{c.nome}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-bold">✨ Lista de desejos</div>
            <div className="text-xs text-yellow-400 font-semibold">R$ {totalDesejos.toFixed(2)}</div>
          </div>
          <div className="space-y-2 mb-3">
            <input className={`${inp} w-full`} placeholder="Ex: Fone novo" value={dNome} onChange={(e) => setDNome(e.target.value)} />
            <div className="flex gap-2">
              <input className={`${inp} w-24`} type="number" placeholder="R$" value={dValor} onChange={(e) => setDValor(e.target.value)} />
              <select className={`${inp} flex-1`} value={dPrio} onChange={(e) => setDPrio(e.target.value)}>
                {ordem.map((p) => <option key={p} value={p}>{PRIORIDADES[p].label}</option>)}
              </select>
              <button onClick={addDesejo} className="px-3 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">+</button>
            </div>
          </div>
          <div className="space-y-1.5">
            {compras.desejos.length === 0 && <p className="text-sm text-zinc-600">Sem desejos ainda.</p>}
            {ordem.flatMap((prio) => compras.desejos.filter((d) => d.prioridade === prio)).map((d) => (
              <div key={d.id} className={`flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50 ${d.comprado ? 'opacity-50' : ''}`}>
                <button onClick={() => toggleDesejo(d.id)} className={`w-4 h-4 rounded border shrink-0 ${d.comprado ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm truncate ${d.comprado ? 'line-through' : ''}`}>{d.nome}</div>
                  <div className={`text-[11px] ${PRIORIDADES[d.prioridade].color}`}>{PRIORIDADES[d.prioridade].label}{d.valor ? ` · R$ ${d.valor.toFixed(2)}` : ''}</div>
                </div>
                <button onClick={() => delDesejo(d.id)} className="text-zinc-600 hover:text-red-400 text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

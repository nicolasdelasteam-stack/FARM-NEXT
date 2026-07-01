'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uid } from '@/lib/engine';
import { PRIORIDADES } from '@/lib/constants';
import type { Prioridade } from '@/lib/types';

export default function FinancasPage() {
  const financas = useStore((s) => s.financas);
  const setFinancas = useStore((s) => s.setFinancas);
  const [tab, setTab] = useState<'fluxo' | 'metas' | 'investimentos'>('fluxo');

  // ─── Fluxo (transações) ───
  const [desc, setDesc] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('despesa');

  const addTx = () => {
    if (!desc.trim() || !valor) return;
    setFinancas({
      ...financas,
      transacoes: [
        ...financas.transacoes,
        { id: uid(), desc: desc.trim(), valor: parseFloat(valor) || 0, tipo, data: new Date().toISOString() },
      ],
    });
    setDesc(''); setValor('');
  };
  const delTx = (id: string) =>
    setFinancas({ ...financas, transacoes: financas.transacoes.filter((t) => t.id !== id) });

  const receitas = financas.transacoes.filter((t) => t.tipo === 'receita').reduce((s, t) => s + t.valor, 0);
  const despesas = financas.transacoes.filter((t) => t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0);
  const saldo = receitas - despesas;

  // ─── Metas (juntar para comprar) ───
  const [mNome, setMNome] = useState('');
  const [mIcon, setMIcon] = useState('🎯');
  const [mAlvo, setMAlvo] = useState('');
  const [mPrio, setMPrio] = useState('algum_dia');

  const addMeta = () => {
    if (!mNome.trim() || !mAlvo) return;
    setFinancas({
      ...financas,
      metas: [
        ...financas.metas,
        { id: uid(), nome: mNome.trim(), icon: mIcon, alvo: parseFloat(mAlvo) || 0, guardado: 0, prioridade: mPrio as Prioridade },
      ],
    });
    setMNome(''); setMAlvo('');
  };
  const guardar = (id: string, delta: number) =>
    setFinancas({
      ...financas,
      metas: financas.metas.map((m) => m.id === id ? { ...m, guardado: Math.max(0, m.guardado + delta) } : m),
    });
  const delMeta = (id: string) =>
    setFinancas({ ...financas, metas: financas.metas.filter((m) => m.id !== id) });

  // ─── Investimentos ───
  const [iNome, setINome] = useState('');
  const [iTipo, setITipo] = useState('Renda fixa');
  const [iValor, setIValor] = useState('');
  const [iRend, setIRend] = useState('');
  const TIPOS_INV = ['Renda fixa', 'Ações', 'Fundos', 'Cripto', 'Tesouro', 'Poupança', 'Outro'];

  const addInv = () => {
    if (!iNome.trim() || !iValor) return;
    setFinancas({
      ...financas,
      investimentos: [
        ...financas.investimentos,
        { id: uid(), nome: iNome.trim(), tipo: iTipo, valor: parseFloat(iValor) || 0, rendimento: parseFloat(iRend) || 0 },
      ],
    });
    setINome(''); setIValor(''); setIRend('');
  };
  const delInv = (id: string) =>
    setFinancas({ ...financas, investimentos: financas.investimentos.filter((i) => i.id !== id) });
  const totalInvestido = financas.investimentos.reduce((s, i) => s + i.valor, 0);
  const patrimonioProj = financas.investimentos.reduce((s, i) => s + i.valor * (1 + i.rendimento / 100), 0);

  const ICONS = ['🎯', '📱', '💻', '🎧', '👟', '🚗', '🏠', '✈️', '🎮', '⌚', '📷', '🚲'];
  const ordem = ['urgente', 'algum_dia', 'pode_esperar'];
  const inp = 'bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500';

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-black mb-1">💰 Finanças</h1>
      <p className="text-sm text-zinc-500 mb-4">Receitas/despesas, metas para juntar dinheiro e carteira de investimentos.</p>

      <div className="flex gap-2 mb-4">
        {(['fluxo', 'metas', 'investimentos'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${tab === t ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>
            {t === 'fluxo' ? '📊 Fluxo' : t === 'metas' ? '🎯 Metas' : '📈 Investimentos'}
          </button>
        ))}
      </div>

      {tab === 'fluxo' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center"><div className="text-lg font-black text-emerald-400">R$ {receitas.toFixed(0)}</div><div className="text-xs text-zinc-500">Receitas</div></div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center"><div className="text-lg font-black text-red-400">R$ {despesas.toFixed(0)}</div><div className="text-xs text-zinc-500">Despesas</div></div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center"><div className={`text-lg font-black ${saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>R$ {saldo.toFixed(0)}</div><div className="text-xs text-zinc-500">Saldo</div></div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex gap-2">
              <input className={`${inp} flex-1`} placeholder="Descrição" value={desc} onChange={(e) => setDesc(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTx()} />
              <input className={`${inp} w-24`} type="number" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTx()} />
              <select className={inp} value={tipo} onChange={(e) => setTipo(e.target.value as 'receita' | 'despesa')}>
                <option value="despesa">Despesa</option><option value="receita">Receita</option>
              </select>
              <button onClick={addTx} className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">+</button>
            </div>
          </div>
          <div className="space-y-1">
            {financas.transacoes.length === 0 && <p className="text-center text-zinc-500 py-8 text-sm">Nenhuma transação.</p>}
            {[...financas.transacoes].reverse().map((t) => (
              <div key={t.id} className="flex justify-between items-center gap-2 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm">
                <span className="flex-1 truncate">{t.desc}</span>
                <span className={t.tipo === 'receita' ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                  {t.tipo === 'receita' ? '+' : '-'}R$ {t.valor.toFixed(0)}
                </span>
                <button onClick={() => delTx(t.id)} className="text-zinc-600 hover:text-red-400 text-xs shrink-0">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'metas' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <div className="flex gap-2">
              <select className={inp} value={mIcon} onChange={(e) => setMIcon(e.target.value)}>{ICONS.map((i) => <option key={i}>{i}</option>)}</select>
              <input className={`${inp} flex-1`} placeholder="Ex: Fone novo" value={mNome} onChange={(e) => setMNome(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <input className={`${inp} w-28`} type="number" placeholder="Alvo R$" value={mAlvo} onChange={(e) => setMAlvo(e.target.value)} />
              <select className={`${inp} flex-1`} value={mPrio} onChange={(e) => setMPrio(e.target.value)}>
                {ordem.map((p) => <option key={p} value={p}>{PRIORIDADES[p].label}</option>)}
              </select>
              <button onClick={addMeta} className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">+</button>
            </div>
          </div>
          <div className="space-y-2">
            {financas.metas.length === 0 && <p className="text-center text-zinc-500 py-8 text-sm">Nenhuma meta ainda. Crie uma para saber quanto juntar.</p>}
            {ordem.flatMap((prio) => financas.metas.filter((m) => m.prioridade === prio)).map((m) => {
              const pct = m.alvo > 0 ? Math.min(100, Math.round((m.guardado / m.alvo) * 100)) : 0;
              const done = m.guardado >= m.alvo && m.alvo > 0;
              return (
                <div key={m.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{m.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{m.nome} {done && <span className="text-emerald-400">✓</span>}</div>
                      <div className={`text-[11px] ${PRIORIDADES[m.prioridade].color}`}>{PRIORIDADES[m.prioridade].label}</div>
                    </div>
                    <div className="text-right text-xs shrink-0">
                      <div className="font-semibold text-yellow-400">R$ {m.guardado.toFixed(0)} / {m.alvo.toFixed(0)}</div>
                      <div className="text-zinc-500">{done ? 'Completo!' : `Faltam R$ ${(m.alvo - m.guardado).toFixed(0)}`}</div>
                    </div>
                    <button onClick={() => delMeta(m.id)} className="text-zinc-600 hover:text-red-400 text-xs shrink-0">✕</button>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full transition-all ${done ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex gap-1">
                    {[10, 50, 100].map((v) => (
                      <button key={v} onClick={() => guardar(m.id, v)} className="px-2 py-1 text-xs bg-zinc-800 hover:bg-emerald-600 rounded-lg">+{v}</button>
                    ))}
                    <button onClick={() => guardar(m.id, -10)} className="px-2 py-1 text-xs bg-zinc-800 hover:bg-red-600 rounded-lg ml-auto">-10</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'investimentos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center"><div className="text-lg font-black text-sky-400">R$ {totalInvestido.toFixed(0)}</div><div className="text-xs text-zinc-500">Total investido</div></div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center"><div className="text-lg font-black text-emerald-400">R$ {patrimonioProj.toFixed(0)}</div><div className="text-xs text-zinc-500">Projeção c/ rendimento</div></div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <div className="flex gap-2">
              <input className={`${inp} flex-1`} placeholder="Ex: Tesouro Selic" value={iNome} onChange={(e) => setINome(e.target.value)} />
              <select className={inp} value={iTipo} onChange={(e) => setITipo(e.target.value)}>
                {TIPOS_INV.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <input className={`${inp} flex-1`} type="number" placeholder="Valor aplicado R$" value={iValor} onChange={(e) => setIValor(e.target.value)} />
              <input className={`${inp} w-32`} type="number" placeholder="Rendim. %" value={iRend} onChange={(e) => setIRend(e.target.value)} />
              <button onClick={addInv} className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">+</button>
            </div>
          </div>
          <div className="space-y-2">
            {financas.investimentos.length === 0 && <p className="text-center text-zinc-500 py-8 text-sm">Nenhum investimento ainda.</p>}
            {financas.investimentos.map((i) => (
              <div key={i.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-lg">📈</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{i.nome}</div>
                  <div className="text-[11px] text-zinc-500">{i.tipo}{i.rendimento ? ` · ${i.rendimento}% a.a.` : ''}</div>
                </div>
                <div className="text-right text-sm shrink-0">
                  <div className="font-semibold text-sky-400">R$ {i.valor.toFixed(0)}</div>
                  {i.rendimento > 0 && <div className="text-[11px] text-emerald-400">→ R$ {(i.valor * (1 + i.rendimento / 100)).toFixed(0)}</div>}
                </div>
                <button onClick={() => delInv(i.id)} className="text-zinc-600 hover:text-red-400 text-xs shrink-0">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

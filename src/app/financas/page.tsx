'use client';

import { useState } from 'react';

export default function FinancasPage() {
  const [txs, setTxs] = useState<{ desc: string; amount: number; type: string }[]>([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('despesa');

  const addTx = () => {
    if (!desc || !amount) return;
    setTxs([...txs, { desc, amount: parseFloat(amount), type }]);
    setDesc(''); setAmount('');
  };

  const receitas = txs.filter((t) => t.type === 'receita').reduce((s, t) => s + t.amount, 0);
  const despesas = txs.filter((t) => t.type === 'despesa').reduce((s, t) => s + t.amount, 0);
  const saldo = receitas - despesas;

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-black">💰 Finanças</h1>
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center"><div className="text-lg font-black text-emerald-400">R$ {receitas.toFixed(0)}</div><div className="text-xs text-zinc-500">Receitas</div></div>
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center"><div className="text-lg font-black text-red-400">R$ {despesas.toFixed(0)}</div><div className="text-xs text-zinc-500">Despesas</div></div>
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center"><div className={`text-lg font-black ${saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>R$ {saldo.toFixed(0)}</div><div className="text-xs text-zinc-500">Saldo</div></div>
      </div>
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex gap-2">
          <input value={desc} onChange={(e) => setDesc(e.target.value)} className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm" placeholder="Descrição" />
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="w-24 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm" placeholder="Valor" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="px-2 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm">
            <option value="despesa">Despesa</option><option value="receita">Receita</option>
          </select>
          <button onClick={addTx} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">+</button>
        </div>
      </div>
      <div className="space-y-1">
        {txs.length === 0 && <p className="text-center text-zinc-500 py-8 text-sm">Nenhuma transação.</p>}
        {[...txs].reverse().map((t, i) => (
          <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm">
            <span>{t.desc}</span>
            <span className={t.type === 'receita' ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
              {t.type === 'receita' ? '+' : '-'}R$ {t.amount.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

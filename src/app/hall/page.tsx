'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uid, today, addCoins, addXP } from '@/lib/engine';
import type { Trofeu } from '@/lib/types';

export default function HallPage() {
  const hall = useStore((s) => s.hall);
  const setHall = useStore((s) => s.setHall);
  const player = useStore((s) => s.player);
  const setPlayer = useStore((s) => s.setPlayer);
  const settings = useStore((s) => s.settings);
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [icon, setIcon] = useState('🏆');
  const [desc, setDesc] = useState('');
  const [tipo, setTipo] = useState<Trofeu['tipo']>('trofeu');
  const [req, setReq] = useState('');
  const [coins, setCoins] = useState('50');
  const [xp, setXp] = useState('100');

  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500';
  const TIPO_LABEL: Record<string, string> = { conquista: 'Conquista', titulo: 'Título', trofeu: 'Troféu', medalha: 'Medalha' };

  const resgatar = (id: string) => {
    const tr = hall.find((h) => h.id === id);
    if (!tr || tr.status === 'resgatado') return;
    let p = player;
    if (tr.recompensaCoins > 0) p = addCoins(p, tr.recompensaCoins);
    if (tr.recompensaXp > 0) p = addXP(p, tr.recompensaXp, settings);
    setPlayer(p);
    setHall(hall.map((h) => h.id === id ? { ...h, status: 'resgatado', data: today() } : h));
  };
  const addTrofeu = () => {
    if (!nome.trim()) return;
    setHall([...hall, { id: uid(), nome: nome.trim(), icon, descricao: desc.trim(), tipo, requisito: req.trim(), recompensaCoins: parseInt(coins) || 0, recompensaXp: parseInt(xp) || 0, status: 'disponivel', data: null }]);
    setNome(''); setDesc(''); setReq(''); setOpen(false);
  };
  const del = (id: string) => setHall(hall.filter((h) => h.id !== id));

  const resgatados = hall.filter((h) => h.status === 'resgatado').length;
  const EMO = ['🏆', '🥇', '🎖️', '👑', '⚔️', '💎', '🔥', '⚖️', '🎓', '🌟'];

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-xl font-black">🏛️ Hall da Glória</h1>
        <button onClick={() => setOpen(!open)} className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">{open ? 'Fechar' : '+ Troféu'}</button>
      </div>
      <p className="text-sm text-zinc-500 mb-4">Troféus e títulos — clique para resgatar a recompensa. ({resgatados}/{hall.length})</p>

      {open && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 mb-5">
          <div className="flex gap-1.5 flex-wrap">
            {EMO.map((e) => <button key={e} onClick={() => setIcon(e)} className={`w-9 h-9 rounded-lg text-lg ${icon === e ? 'bg-violet-600' : 'bg-zinc-800'}`}>{e}</button>)}
          </div>
          <input className={inp} placeholder="Nome do troféu" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input className={inp} placeholder="Descrição" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <select className={inp} value={tipo} onChange={(e) => setTipo(e.target.value as Trofeu['tipo'])}>
              {Object.entries(TIPO_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input className={inp} placeholder="Requisito" value={req} onChange={(e) => setReq(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className={inp} type="number" placeholder="Moedas" value={coins} onChange={(e) => setCoins(e.target.value)} />
            <input className={inp} type="number" placeholder="XP" value={xp} onChange={(e) => setXp(e.target.value)} />
          </div>
          <button onClick={addTrofeu} className="w-full py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">Adicionar ao Hall</button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {hall.map((h) => {
          const done = h.status === 'resgatado';
          return (
            <div key={h.id} className={`p-4 rounded-xl border ${done ? 'bg-gradient-to-br from-yellow-950/40 to-zinc-900 border-yellow-800/40' : 'bg-zinc-900 border-zinc-800'}`}>
              <div className="flex items-start gap-3">
                <span className={`text-3xl ${done ? '' : 'grayscale opacity-70'}`}>{h.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-sm">{h.nome}</div>
                    <button onClick={() => del(h.id)} className="text-zinc-700 hover:text-red-400 text-xs">✕</button>
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-violet-400">{TIPO_LABEL[h.tipo]}</div>
                  {h.descricao && <p className="text-xs text-zinc-500 mt-1">{h.descricao}</p>}
                  {h.requisito && <p className="text-[11px] text-zinc-600 mt-1">📌 {h.requisito}</p>}
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-yellow-400">{h.recompensaCoins ? `🪙 ${h.recompensaCoins}` : ''}{h.recompensaXp ? ` ⭐ ${h.recompensaXp} XP` : ''}</span>
                {done
                  ? <span className="text-xs text-emerald-400 font-semibold">✓ {h.data ? new Date(h.data).toLocaleDateString('pt-BR') : 'Resgatado'}</span>
                  : <button onClick={() => resgatar(h.id)} className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-black rounded-lg text-xs font-bold">Resgatar</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uid, today, addCoins, addXP } from '@/lib/engine';
import { BOSS_DIFICULDADE, BOSS_PERIODO } from '@/lib/constants';
import type { Boss } from '@/lib/types';

export default function BossPage() {
  const boss = useStore((s) => s.boss);
  const setBoss = useStore((s) => s.setBoss);
  const player = useStore((s) => s.player);
  const setPlayer = useStore((s) => s.setPlayer);
  const settings = useStore((s) => s.settings);

  const [tab, setTab] = useState<'ativos' | 'bestiario'>('ativos');
  const [open, setOpen] = useState(false);
  const [f, setF] = useState<Omit<Boss, 'id' | 'derrotado' | 'data'>>({
    nome: '', icon: '👿', lore: '', dificuldade: 'media', periodo: 'semanal',
    comoVencer: '', requisito: '', penalidade: '', recompensa: '', recompensaCoins: 80, recompensaXp: 150, condicao: '',
  });

  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500';
  const EMO = ['👿', '🌀', '🌑', '📱', '🔥', '🛋️', '🍩', '💀', '🐉', '👹', '🧟', '⚰️'];

  const derrotar = (id: string) => {
    const b = boss.bosses.find((x) => x.id === id);
    if (!b || b.derrotado) return;
    let p = player;
    if (b.recompensaCoins > 0) p = addCoins(p, b.recompensaCoins);
    if (b.recompensaXp > 0) p = addXP(p, b.recompensaXp, settings);
    p = { ...p, bossDefeated: (p.bossDefeated || 0) + 1 };
    setPlayer(p);
    setBoss({ ...boss, bosses: boss.bosses.map((x) => x.id === id ? { ...x, derrotado: true, data: today() } : x) });
  };
  const reviver = (id: string) =>
    setBoss({ ...boss, bosses: boss.bosses.map((x) => x.id === id ? { ...x, derrotado: false, data: null } : x) });
  const del = (id: string) => setBoss({ ...boss, bosses: boss.bosses.filter((x) => x.id !== id) });

  const addBoss = () => {
    if (!f.nome.trim()) return;
    setBoss({ ...boss, bosses: [...boss.bosses, { ...f, nome: f.nome.trim(), id: uid(), derrotado: false, data: null }] });
    setF({ ...f, nome: '', lore: '', comoVencer: '', requisito: '', penalidade: '', recompensa: '', condicao: '' });
    setOpen(false);
  };

  const ativos = boss.bosses.filter((b) => !b.derrotado);
  const derrotados = boss.bosses.filter((b) => b.derrotado);
  const lista = tab === 'ativos' ? ativos : derrotados;

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-xl font-black">⚔️ Boss Fight</h1>
        <button onClick={() => setOpen(!open)} className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">{open ? 'Fechar' : '+ Boss'}</button>
      </div>
      <p className="text-sm text-zinc-500 mb-4">Chefes semanais/mensais da vida real. Derrote-os para ganhar recompensa — os vencidos vão para o Bestiário.</p>

      {open && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 mb-5">
          <div className="flex gap-1.5 flex-wrap">
            {EMO.map((e) => <button key={e} onClick={() => setF({ ...f, icon: e })} className={`w-9 h-9 rounded-lg text-lg ${f.icon === e ? 'bg-violet-600' : 'bg-zinc-800'}`}>{e}</button>)}
          </div>
          <input className={inp} placeholder="Nome do boss" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} />
          <input className={inp} placeholder="Lore (história)" value={f.lore} onChange={(e) => setF({ ...f, lore: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <select className={inp} value={f.dificuldade} onChange={(e) => setF({ ...f, dificuldade: e.target.value as Boss['dificuldade'] })}>
              {Object.entries(BOSS_DIFICULDADE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select className={inp} value={f.periodo} onChange={(e) => setF({ ...f, periodo: e.target.value as Boss['periodo'] })}>
              {Object.entries(BOSS_PERIODO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <input className={inp} placeholder="Como vencer" value={f.comoVencer} onChange={(e) => setF({ ...f, comoVencer: e.target.value })} />
          <input className={inp} placeholder="Requisito para derrotar" value={f.requisito} onChange={(e) => setF({ ...f, requisito: e.target.value })} />
          <input className={inp} placeholder="Penalidade se não derrotar" value={f.penalidade} onChange={(e) => setF({ ...f, penalidade: e.target.value })} />
          <input className={inp} placeholder="Condição para aparecer" value={f.condicao} onChange={(e) => setF({ ...f, condicao: e.target.value })} />
          <input className={inp} placeholder="Recompensa (descrição)" value={f.recompensa} onChange={(e) => setF({ ...f, recompensa: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <input className={inp} type="number" placeholder="Moedas" value={f.recompensaCoins} onChange={(e) => setF({ ...f, recompensaCoins: parseInt(e.target.value) || 0 })} />
            <input className={inp} type="number" placeholder="XP" value={f.recompensaXp} onChange={(e) => setF({ ...f, recompensaXp: parseInt(e.target.value) || 0 })} />
          </div>
          <button onClick={addBoss} className="w-full py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">Invocar boss</button>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {(['ativos', 'bestiario'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${tab === t ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>
            {t === 'ativos' ? `⚔️ Ativos (${ativos.length})` : `📖 Bestiário (${derrotados.length})`}
          </button>
        ))}
      </div>

      {lista.length === 0 && (
        <p className="text-center text-zinc-500 py-10 text-sm">
          {tab === 'ativos' ? 'Nenhum boss ativo. Invoque um novo desafio!' : 'Bestiário vazio — derrote um boss para registrá-lo aqui.'}
        </p>
      )}

      <div className="space-y-3">
        {lista.map((b) => {
          const dif = BOSS_DIFICULDADE[b.dificuldade];
          return (
            <div key={b.id} className={`p-4 rounded-xl border ${b.derrotado ? 'bg-gradient-to-br from-emerald-950/30 to-zinc-900 border-emerald-800/40' : 'bg-zinc-900 border-zinc-800'}`}>
              <div className="flex items-start gap-3">
                <span className={`text-3xl ${b.derrotado ? '' : ''}`}>{b.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-bold text-sm">{b.nome}</div>
                    <button onClick={() => del(b.id)} className="text-zinc-700 hover:text-red-400 text-xs shrink-0">✕</button>
                  </div>
                  <div className="flex gap-2 text-[10px] uppercase tracking-wide mt-0.5">
                    <span className={dif.color}>{dif.label}</span>
                    <span className="text-zinc-500">· {BOSS_PERIODO[b.periodo]}</span>
                  </div>
                  {b.lore && <p className="text-xs text-zinc-500 mt-1 italic">💬 {b.lore}</p>}
                </div>
              </div>
              <div className="mt-2 space-y-0.5 text-[11px] text-zinc-400">
                {b.comoVencer && <p>🎯 <b className="text-zinc-300">Como vencer:</b> {b.comoVencer}</p>}
                {b.requisito && <p>📌 <b className="text-zinc-300">Requisito:</b> {b.requisito}</p>}
                {b.penalidade && <p>☠️ <b className="text-zinc-300">Penalidade:</b> {b.penalidade}</p>}
                {b.condicao && <p>🕯️ <b className="text-zinc-300">Aparece:</b> {b.condicao}</p>}
                {b.recompensa && <p>🎁 <b className="text-zinc-300">Recompensa:</b> {b.recompensa}</p>}
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-yellow-400">{b.recompensaCoins ? `🪙 ${b.recompensaCoins}` : ''}{b.recompensaXp ? ` ⭐ ${b.recompensaXp} XP` : ''}</span>
                {b.derrotado
                  ? <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400 font-semibold">✓ Derrotado {b.data ? new Date(b.data).toLocaleDateString('pt-BR') : ''}</span>
                      <button onClick={() => reviver(b.id)} className="text-[11px] text-zinc-600 hover:text-zinc-300">reativar</button>
                    </div>
                  : <button onClick={() => derrotar(b.id)} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold">Derrotar</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

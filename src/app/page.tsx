'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { PET_STAGES } from '@/lib/constants';
import { revivePlayer, applyMissionComplete, today } from '@/lib/engine';

const MILESTONES = [
  { d: 1, label: 'Primeiro dia', icon: '🚩' },
  { d: 7, label: '1 Semana', icon: '⭐' },
  { d: 14, label: '2 Semanas', icon: '🔥' },
  { d: 30, label: '1 Mês', icon: '🏆' },
  { d: 60, label: '2 Meses', icon: '💎' },
  { d: 90, label: '3 Meses', icon: '👑' },
];

const ATALHOS = [
  { href: '/campo', icon: '🎯', label: 'Campo' },
  { href: '/personagem', icon: '👤', label: 'Personagem' },
  { href: '/boss', icon: '⚔️', label: 'Boss' },
  { href: '/treinos', icon: '🏋️', label: 'Treinos' },
  { href: '/dieta', icon: '🥗', label: 'Dieta' },
  { href: '/financas', icon: '💰', label: 'Finanças' },
  { href: '/mercado', icon: '🛒', label: 'Mercado' },
  { href: '/hall', icon: '🏛️', label: 'Hall' },
];

export default function DashboardPage() {
  const player = useStore((s) => s.player);
  const missions = useStore((s) => s.missions);
  const settings = useStore((s) => s.settings);
  const agua = useStore((s) => s.agua);
  const setAgua = useStore((s) => s.setAgua);
  const setPlayer = useStore((s) => s.setPlayer);
  const updateMission = useStore((s) => s.updateMission);
  const [msg, setMsg] = useState('');

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };
  const todayStr = today();
  const dailyPct = Math.min(100, Math.round(((player.dailyXp || 0) / (settings.dailyXpGoal || 100)) * 100));
  const hpPct = Math.round((player.hp / player.maxHp) * 100);
  const xpPct = Math.min(100, Math.round((player.xp / player.xpToNext) * 100));
  const bossHpPct = player.bossActive ? Math.round((player.bossHp / player.bossMaxHp) * 100) : 0;
  const petStage = player.pet?.stage || 0;
  const best = Math.max(player.streak || 0, player.bestStreak || 0);

  const copos = agua.copos || 0;
  const metaAgua = agua.meta || 8;
  const aguaPct = Math.min(100, Math.round((copos / metaAgua) * 100));
  const addWater = (n: number) => setAgua({ ...agua, copos: Math.max(0, copos + n) });

  const reviveCost = 30 + (player.deaths || 0) * 10;
  const revive = () => { const p = revivePlayer(player); if (p) setPlayer(p); };

  const pendentes = missions.filter((m) => !m.done).slice(0, 6);
  const concluir = (id: string) => {
    const m = missions.find((x) => x.id === id);
    if (!m || m.done) return;
    updateMission(id, { done: true, completedAt: new Date().toISOString() });
    const res = applyMissionComplete(player, m, settings);
    setPlayer(res.player);
    flash(`${m.title}: +${m.reward.xp} XP${m.reward.coins ? ` · +${m.reward.coins} 🪙` : ''}${res.leveledUp ? ` · 🎉 Nível ${res.player.level}!` : ''}`);
  };

  if (player.gameOver) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">💀</div>
        <h2 className="text-2xl font-black mb-2">Você foi derrotado!</h2>
        <p className="text-zinc-400 mb-2">{player.name} caiu em batalha no nível {player.level}.</p>
        <p className="text-zinc-500 text-sm mb-6">Mortes: {player.deaths} · Streak: {player.streak}</p>
        <div className="inline-block p-6 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
          <div className="text-3xl mb-2">🪙</div>
          <div className="font-bold text-lg mb-1">Reviver com {reviveCost} moedas</div>
          <p className="text-zinc-500 text-sm mb-4">Você revive com 50% do HP max.</p>
          <button onClick={revive} disabled={player.coins < reviveCost}
            className="px-6 py-2 rounded-lg font-bold text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed">
            {player.coins < reviveCost ? 'Moedas insuficientes' : 'Reviver'}
          </button>
          <p className="mt-3 text-sm text-zinc-500">Moedas: {player.coins}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {msg && <div className="p-2 rounded-lg bg-indigo-950/50 border border-indigo-800/50 text-sm text-indigo-200 text-center">{msg}</div>}

      {hpPct <= 25 && hpPct > 0 && (
        <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/30 text-red-400 font-semibold text-sm animate-pulse">
          ⚠️ HP crítico! Use poções no Mercado para se curar.
        </div>
      )}

      {player.bossActive && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-red-800/50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">👿 {player.bossName}</h3>
            <span className="px-2 py-0.5 rounded text-xs bg-red-900/40 text-red-400">❤️ {player.bossHp}/{player.bossMaxHp}</span>
          </div>
          <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${bossHpPct}%`, background: 'linear-gradient(90deg, #ef4444, #dc2626)' }} />
          </div>
          <p className="text-xs text-zinc-500 mt-1">💬 {player.bossLore}</p>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-3">
        <KpiCard icon="⚡" value={`${player.xp}`} label={`XP / ${player.xpToNext}`} />
        <KpiCard icon="🪙" value={`${player.coins}`} label="Moedas" gold />
        <KpiCard icon="❤️" value={`${player.hp}/${player.maxHp}`} label={`HP · Nv ${player.level}`} hp />
        <KpiCard icon="🔥" value={`${player.streak}`} label="Ofensiva (dias)" green />
      </div>

      {/* Nível + Marcos de Evolução */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-sm">🧭 Nível {player.level} · {player.title}</h3>
          <span className="text-xs text-zinc-500">{player.xp}/{player.xpToNext} XP</span>
        </div>
        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden mb-4">
          <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${xpPct}%` }} />
        </div>
        <div className="text-[11px] text-zinc-500 mb-2 uppercase tracking-wider">Marcos de Evolução · ofensiva</div>
        <div className="flex items-center justify-between">
          {MILESTONES.map((mst, i) => {
            const reached = best >= mst.d;
            return (
              <div key={mst.d} className="flex-1 flex flex-col items-center relative">
                {i > 0 && <div className={`absolute top-4 right-1/2 w-full h-0.5 ${reached ? 'bg-indigo-600' : 'bg-zinc-800'}`} />}
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm ${reached ? 'bg-indigo-600' : 'bg-zinc-800 grayscale opacity-60'}`}>{mst.icon}</div>
                <div className="text-[9px] text-zinc-500 mt-1 text-center leading-tight">{mst.label}</div>
                <div className="text-[9px] text-zinc-600">{mst.d}d</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Meta diária de XP */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <h3 className="font-bold text-sm mb-2">🎯 Meta Diária de XP</h3>
          <div className="text-2xl font-black mb-1">{player.dailyXp || 0}<span className="text-sm font-normal text-zinc-500">/{settings.dailyXpGoal}</span></div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden mb-2">
            <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: `${dailyPct}%` }} />
          </div>
          {petStage > 0 && <p className="text-xs text-zinc-500">🐾 {PET_STAGES[petStage]?.icon} {PET_STAGES[petStage]?.name}</p>}
        </div>

        {/* Água */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-sm">💧 Água</h3>
            <span className="text-xs text-zinc-500">{copos}/{metaAgua} copos</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden mb-3">
            <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${aguaPct}%` }} />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <button key={n} onClick={() => addWater(n)} className="flex-1 py-1.5 bg-zinc-800 hover:bg-sky-600 rounded-lg text-xs font-semibold">+{n} 💧</button>
            ))}
            <button onClick={() => addWater(-1)} className="px-3 py-1.5 bg-zinc-800 hover:bg-red-600 rounded-lg text-xs">−</button>
          </div>
        </div>
      </div>

      {/* Missões de hoje */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-sm">✅ Missões pendentes</h3>
          <Link href="/campo" className="text-xs text-indigo-400 hover:text-indigo-300">ver todas →</Link>
        </div>
        {pendentes.length === 0 ? (
          <p className="text-xs text-zinc-500 py-2">Tudo concluído! Crie novas missões no Campo.</p>
        ) : (
          <div className="space-y-1.5">
            {pendentes.map((m) => (
              <div key={m.id} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/40">
                <button onClick={() => concluir(m.id)} title="Concluir" className="w-5 h-5 rounded-full border-2 border-zinc-600 hover:border-indigo-400 shrink-0" />
                <span className="text-sm flex-1 truncate">{m.title}</span>
                {m.dueDate === todayStr && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/40 text-amber-300">hoje</span>}
                <span className="text-xs text-indigo-400 font-semibold shrink-0">+{m.reward.xp}XP</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Acesso rápido */}
      <div>
        <div className="text-[11px] text-zinc-500 mb-2 uppercase tracking-wider">Acesso rápido</div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {ATALHOS.map((a) => (
            <Link key={a.href} href={a.href} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-indigo-700 transition-colors">
              <span className="text-xl">{a.icon}</span>
              <span className="text-[10px] text-zinc-400">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, value, label, gold, hp, green }: {
  icon: string; value: string; label: string; gold?: boolean; hp?: boolean; green?: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl border text-center transition-transform hover:-translate-y-0.5 ${
      gold ? 'bg-yellow-900/10 border-yellow-800/30' :
      hp ? 'bg-red-900/10 border-red-800/30' :
      green ? 'bg-emerald-900/10 border-emerald-800/30' :
      'bg-zinc-900 border-zinc-800'
    }`}>
      <div className="text-lg mb-1">{icon}</div>
      <div className={`text-xl font-black ${gold ? 'text-yellow-400' : hp ? 'text-red-400' : green ? 'text-emerald-400' : ''}`}>{value}</div>
      <div className="text-[11px] text-zinc-500 mt-0.5">{label}</div>
    </div>
  );
}

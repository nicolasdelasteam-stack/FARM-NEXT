'use client';

import { useStore } from '@/lib/store';
import { PET_STAGES } from '@/lib/constants';

export default function DashboardPage() {
  const player = useStore((s) => s.player);
  const missions = useStore((s) => s.missions);
  const settings = useStore((s) => s.settings);

  const todayStr = new Date().toISOString().slice(0, 10);
  const pending = missions.filter((m) => !m.done && m.date === todayStr).length;
  const dailyPct = Math.min(100, Math.round(((player.dailyXp || 0) / (settings.dailyXpGoal || 100)) * 100));
  const hpPct = Math.round((player.hp / player.maxHp) * 100);
  const bossHpPct = player.bossActive ? Math.round((player.bossHp / player.bossMaxHp) * 100) : 0;
  const petStage = player.pet?.stage || 0;

  return (
    <div className="space-y-4">
      {/* Game Over */}
      {player.gameOver && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-2xl font-black mb-2">Você foi derrotado!</h2>
          <p className="text-zinc-400 mb-2">{player.name} caiu em batalha no nível {player.level}.</p>
          <p className="text-zinc-500 text-sm mb-6">Mortes: {player.deaths} · Streak: {player.streak}</p>
          <div className="inline-block p-6 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="text-3xl mb-2">🪙</div>
            <div className="font-bold text-lg mb-1">Reviver com {30 + (player.deaths || 0) * 10} moedas</div>
            <p className="text-zinc-500 text-sm mb-4">Você revive com 50% do HP max.</p>
            <p className="mt-3 text-sm text-zinc-500">Moedas: {player.coins}</p>
          </div>
        </div>
      )}

      {/* HP Warning */}
      {!player.gameOver && hpPct <= 25 && hpPct > 0 && (
        <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/30 text-red-400 font-semibold text-sm animate-pulse">
          ⚠️ HP crítico! Use poções no Mercado para se curar.
        </div>
      )}

      {/* Boss */}
      {player.bossActive && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-red-800/50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">👿 {player.bossName}</h3>
            <span className="px-2 py-0.5 rounded text-xs bg-red-900/40 text-red-400">
              ❤️ {player.bossHp}/{player.bossMaxHp}
            </span>
          </div>
          <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${bossHpPct}%`, background: 'linear-gradient(90deg, #ef4444, #dc2626)' }} />
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

      {/* Daily Goal + Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <h3 className="font-bold text-sm mb-2">🎯 Meta Diária de XP</h3>
          <div className="text-2xl font-black mb-1">{player.dailyXp || 0}<span className="text-sm font-normal text-zinc-500">/{settings.dailyXpGoal}</span></div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: `${dailyPct}%` }} />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <h3 className="font-bold text-sm mb-2">📊 Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">{player.title}</span>
              <span className="font-semibold">Nível {player.level}</span>
            </div>
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-0.5">
                <span>HP</span><span>{player.hp}/{player.maxHp}</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${hpPct}%` }} />
              </div>
            </div>
            {petStage > 0 && (
              <p className="text-xs text-zinc-500">🐾 {PET_STAGES[petStage]?.icon} {PET_STAGES[petStage]?.name}</p>
            )}
            <p className="text-xs text-zinc-500">{pending} missão(ões) pendente(s) hoje</p>
          </div>
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

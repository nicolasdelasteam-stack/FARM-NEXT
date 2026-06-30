'use client';

import { useStore } from '@/lib/store';
import { SKILL_NAMES, PET_STAGES } from '@/lib/constants';

export default function PersonagemPage() {
  const player = useStore((s) => s.player);
  const xpPct = Math.min(100, Math.round((player.xp / player.xpToNext) * 100));

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-black">👤 {player.name}</h1>

      {/* Avatar & Title */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <span className="text-5xl">{player.avatar}</span>
        <div>
          <div className="font-bold text-lg">{player.title}</div>
          <div className="text-sm text-zinc-500">Nível {player.level} · {player.name}</div>
          <div className="mt-2 w-48">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>XP</span><span>{player.xp}/{player.xpToNext}</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${xpPct}%` }} />
            </div>
            <p className="text-[11px] text-zinc-600 mt-0.5">{player.xpToNext - player.xp} XP para o próximo nível</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <h3 className="font-bold text-sm mb-3">⚡ Habilidades</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(SKILL_NAMES).map(([key, name]) => {
            const val = player.skills[key as keyof typeof player.skills] || 0;
            const lv = Math.floor(val / 10) + 1;
            const pct = (val % 10) * 10;
            return (
              <div key={key}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span>{name}</span><span>Lv. {lv}</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Skills */}
      {player.customSkills && player.customSkills.length > 0 && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <h3 className="font-bold text-sm mb-3">⭐ Skills Customizadas</h3>
          <div className="space-y-2">
            {player.customSkills.map((cs) => {
              const lv = Math.floor((cs.xp || 0) / 10) + 1;
              const pct = ((cs.xp || 0) % 10) * 10;
              return (
                <div key={cs.id}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span>{cs.icon} {cs.name}</span><span>Lv. {lv}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pet */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <h3 className="font-bold text-sm mb-2">🐾 Mascote</h3>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{PET_STAGES[player.pet?.stage || 0]?.icon || '🥚'}</span>
          <div>
            <div className="font-semibold">{PET_STAGES[player.pet?.stage || 0]?.name || 'Ovo'}</div>
            <p className="text-xs text-zinc-500">{PET_STAGES[player.pet?.stage || 0]?.desc || ''}</p>
            <div className="flex gap-2 mt-1">
              <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800">XP: {player.pet?.xp || 0}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800">Evoluções: {player.pet?.evolutions || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Atributos */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <h3 className="font-bold text-sm mb-3">📊 Atributos</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(player.atributos || {}).map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="capitalize">{k}</span><span>Lv. {Math.floor((v || 0) / 5) + 1}</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, ((v || 0) % 5) * 20)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

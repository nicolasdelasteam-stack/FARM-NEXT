'use client';

import { useStore } from '@/lib/store';
import { ACHIEVEMENTS } from '@/lib/constants';
import { checkAchievement } from '@/lib/engine';

export default function ConquistasPage() {
  const player = useStore((s) => s.player);
  const claimed = useStore((s) => (s as { achievements?: string[] }).achievements) || [];

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-black mb-4">🏆 Conquistas</h1>
      <div className="grid grid-cols-2 gap-3">
        {ACHIEVEMENTS.map((ach) => {
          const earned = checkAchievement(player, ach.id);
          const done = claimed.includes(ach.id);
          return (
            <div key={ach.id} className={`p-4 rounded-xl border ${done ? 'bg-zinc-900/50 border-zinc-800/30 opacity-50' : earned ? 'bg-zinc-900 border-yellow-800/50' : 'bg-zinc-900/50 border-zinc-800/30 opacity-70'}`}>
              <div className="text-2xl mb-1">{ach.icon}</div>
              <div className="font-semibold text-sm">{ach.name}</div>
              <p className="text-xs text-zinc-500 mb-2">{ach.desc}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-yellow-400">🪙 {ach.reward}</span>
                {done ? <span className="text-xs text-zinc-600">✅ Recebido</span> : earned ? <span className="text-xs text-emerald-400">🔓 Disponível</span> : <span className="text-xs text-zinc-600">🔒 Bloqueado</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

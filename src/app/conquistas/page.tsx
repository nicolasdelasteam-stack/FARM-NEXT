'use client';

import { useStore } from '@/lib/store';
import { ACHIEVEMENTS } from '@/lib/constants';
import { checkAchievement, addCoins } from '@/lib/engine';
import { play } from '@/lib/sound';

export default function ConquistasPage() {
  const player = useStore((s) => s.player);
  const setPlayer = useStore((s) => s.setPlayer);
  const achievements = useStore((s) => s.achievements);
  const setAchievements = useStore((s) => s.setAchievements);

  const resgatar = (id: string, reward: number) => {
    if (achievements.includes(id)) return;
    play('fanfare');
    if (reward > 0) setPlayer(addCoins(player, reward));
    setAchievements([...achievements, id]);
  };

  const resgatadas = achievements.length;

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-black mb-1">🏆 Conquistas</h1>
      <p className="text-sm text-zinc-500 mb-4">Desbloqueadas pelo seu progresso — resgate a recompensa. ({resgatadas}/{ACHIEVEMENTS.length})</p>
      <div className="grid grid-cols-2 gap-3">
        {ACHIEVEMENTS.map((ach) => {
          const earned = checkAchievement(player, ach.id);
          const done = achievements.includes(ach.id);
          return (
            <div key={ach.id} className={`p-4 rounded-xl border ${done ? 'bg-gradient-to-br from-yellow-950/30 to-zinc-900 border-yellow-800/40' : earned ? 'bg-zinc-900 border-yellow-800/50' : 'bg-zinc-900/50 border-zinc-800/30 opacity-70'}`}>
              <div className={`text-2xl mb-1 ${earned || done ? '' : 'grayscale opacity-60'}`}>{ach.icon}</div>
              <div className="font-semibold text-sm">{ach.name}</div>
              <p className="text-xs text-zinc-500 mb-2">{ach.desc}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-yellow-400">🪙 {ach.reward}</span>
                {done
                  ? <span className="text-xs text-zinc-500">✅ Recebido</span>
                  : earned
                    ? <button onClick={() => resgatar(ach.id, ach.reward)} className="px-2.5 py-1 bg-yellow-600 hover:bg-yellow-500 text-black rounded-lg text-xs font-bold">Resgatar</button>
                    : <span className="text-xs text-zinc-600">🔒 Bloqueado</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

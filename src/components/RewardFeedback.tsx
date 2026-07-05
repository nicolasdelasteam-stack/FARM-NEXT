'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { applyActivityReward } from '@/lib/engine';
import { play } from '@/lib/sound';

// Recompensa padrão das abas de vida real: aplica XP/moedas no player (via
// engine.applyActivityReward, com ofensiva e boss automático) e devolve a
// mensagem de feedback pronta para exibir com <RewardBanner/>.
export function useReward() {
  const [msg, setMsg] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const reward = useCallback((label: string, xp: number, opts?: { coins?: number; skill?: string }) => {
    const s = useStore.getState();
    const res = applyActivityReward(s.player, s.settings, { xp, coins: opts?.coins, skill: opts?.skill });
    s.setPlayer(res.player);
    // Nível/boss têm fanfarra própria na Celebration — aqui só o "ding" de XP.
    if (!res.leveledUp && !res.bossDefeated) play('ding');
    const extras = [
      `+${xp} XP`,
      opts?.coins ? `+${opts.coins} 🪙` : '',
      res.leveledUp ? `🎉 Subiu para o nível ${res.player.level}!` : '',
      res.bossDefeated ? '⚔️ Boss derrotado! +50 🪙' : '',
    ].filter(Boolean);
    if (timer.current) clearTimeout(timer.current);
    setMsg(`${label}: ${extras.join(' · ')}`);
    timer.current = setTimeout(() => setMsg(''), 3000);
  }, []);

  return { msg, reward };
}

export function RewardBanner({ msg }: { msg: string }) {
  if (!msg) return null;
  return <div className="mb-4 p-2 rounded-lg bg-indigo-950/50 border border-indigo-800/50 text-sm text-indigo-200 text-center">{msg}</div>;
}

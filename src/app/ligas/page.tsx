'use client';

import { useStore } from '@/lib/store';
import { LIGA_NAMES, BOT_NAMES } from '@/lib/constants';
import { getWeekStart } from '@/lib/engine';

export default function LigasPage() {
  const player = useStore((s) => s.player);
  const hoy = new Date();
  const ws = getWeekStart();
  const rng = hashCode(ws);
  const ligaIdx = Math.min(Math.floor((player.level - 1) / 2), LIGA_NAMES.length - 1);
  const ligaName = LIGA_NAMES[ligaIdx] || 'Ferro';
  const daysLeft = 6 - (hoy.getDay() || 7);

  const bots = BOT_NAMES.map((n, i) => ({
    name: n, xp: Math.floor(((rng + i * 1337) % 5000) / 10) + 50,
    avatar: ['😺', '🦊', '🐉', '🦅', '🐺', '🐱', '🦁', '🐸', '🦄', '🐲'][i],
  }));
  const all = [
    { name: player.name, xp: player.dailyXp || 0, avatar: player.avatar, isMe: true },
    ...bots.map((b) => ({ ...b, isMe: false })),
  ].sort((a, b) => b.xp - a.xp);
  const myPos = all.findIndex((p) => p.isMe) + 1;
  const promoted = myPos <= 3;
  const relegated = myPos >= all.length - 2;

  return (
    <div className="max-w-xl space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-black">📊 Liga {ligaName}</h1>
        <span className="text-sm text-zinc-500">⏳ {daysLeft > 0 ? `Faltam ${daysLeft} dia(s)` : 'Semana encerrada'}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
          <div className="text-xs text-zinc-500">Sua posição</div>
          <div className="text-2xl font-black">{myPos}º</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
          <div className="text-xs text-zinc-500">Status</div>
          <div className={`font-bold text-sm ${promoted ? 'text-emerald-400' : relegated ? 'text-red-400' : 'text-zinc-400'}`}>
            {promoted ? '⬆️ Promoção' : relegated ? '⬇️ Rebaixamento' : '➡️ Meio'}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
          <div className="text-xs text-zinc-500">XP Total</div>
          <div className="text-lg font-bold">{player.dailyXp || 0}</div>
        </div>
      </div>

      <div className="space-y-1">
        {all.map((pl, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${pl.isMe ? 'bg-zinc-900 border-indigo-800/50' : 'bg-zinc-900/50 border-zinc-800/30'}`}>
            <span className="font-black text-xs w-6">{i + 1}º</span>
            <span className="text-lg">{pl.avatar}</span>
            <span className="flex-1 font-medium">{pl.name}{pl.isMe ? ' (você)' : ''}</span>
            <span className="text-xs text-zinc-400">{pl.xp} XP</span>
            {pl.isMe && <span className="text-xs">{promoted ? '⬆️' : relegated ? '⬇️' : '➡️'}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

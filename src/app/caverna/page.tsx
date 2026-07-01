'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { addXP } from '@/lib/engine';

export default function CavernaPage() {
  const [config] = useState({ focus: 25 * 60, rest: 5 * 60 });
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'focus' | 'rest'>('focus');
  const [msg, setMsg] = useState('');
  const focusMin = useStore((s) => s.player.totalFocusMinutes || 0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPhase = useRef(phase);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Ao concluir uma sessão de foco (foco → descanso): soma minutos de foco e XP.
  useEffect(() => {
    if (prevPhase.current === 'focus' && phase === 'rest') {
      const s = useStore.getState();
      const mins = Math.round(config.focus / 60);
      let p = { ...s.player, totalFocusMinutes: (s.player.totalFocusMinutes || 0) + mins };
      p = addXP(p, 15, s.settings);
      s.setPlayer(p);
      setMsg(`🎯 Sessão concluída! +${mins} min de foco · +15 XP`);
      setTimeout(() => setMsg(''), 4000);
    }
    prevPhase.current = phase;
  }, [phase, config.focus]);

  const tick = () => {
    setRemaining((r) => {
      if (r <= 1) {
        setPhase((p) => (p === 'focus' ? 'rest' : 'focus'));
        return phase === 'focus' ? config.rest : config.focus;
      }
      return r - 1;
    });
  };

  const start = () => {
    setRunning(true);
    clearInterval(intervalRef.current!);
    intervalRef.current = setInterval(tick, 1000);
  };

  const stop = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const pct = phase === 'focus'
    ? ((config.focus - remaining) / config.focus) * 100
    : ((config.rest - remaining) / config.rest) * 100;

  const treeIcons = ['🌱', '🌿', '🌳', '🌲', '🌲'];
  const treeStage = Math.min(4, Math.floor(pct / 25));
  const treeSize = 20 + pct * 0.8;

  return (
    <div className="max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-black">🕯️ Caverna do Foco</h1>
        <span className="text-xs text-zinc-500">⏱️ {focusMin} min de foco no total</span>
      </div>
      {msg && <div className="mb-4 p-2 rounded-lg bg-indigo-950/50 border border-indigo-800/50 text-sm text-indigo-200 text-center">{msg}</div>}
      <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
        <div style={{ fontSize: `${treeSize}px` }} className="mb-4 transition-all duration-500">{treeIcons[treeStage]}</div>
        <div className="text-4xl font-black mb-2 font-mono">
          {String(Math.floor(remaining / 60)).padStart(2, '0')}:{String(remaining % 60).padStart(2, '0')}
        </div>
        <div className="text-sm text-zinc-500 mb-4">{phase === 'focus' ? '🎯 Foco' : '☕ Descanso'}</div>
        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden mb-6 max-w-xs mx-auto">
          <div className={`h-full rounded-full transition-all duration-500 ${phase === 'focus' ? 'bg-indigo-500' : 'bg-emerald-500'}`}
            style={{ width: `${pct}%` }} />
        </div>
        <div className="flex gap-3 justify-center">
          {!running ? (
            <button onClick={start} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold">▶ Iniciar</button>
          ) : (
            <button onClick={stop} className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold">⏹ Parar</button>
          )}
        </div>
      </div>
    </div>
  );
}

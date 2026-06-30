'use client';

import { useStore } from '@/lib/store';

export default function EstatisticasPage() {
  const player = useStore((s) => s.player);
  const missions = useStore((s) => s.missions);
  const totalDone = missions.filter((m) => m.done).length;

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-black">📈 Estatísticas</h1>
      <div className="grid grid-cols-3 gap-3">
        <Kpi value={player.level} label="Nível" />
        <Kpi value={player.bestStreak || player.streak} label="Melhor Streak" green />
        <Kpi value={totalDone} label="Missões" gold />
      </div>
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <h3 className="font-bold text-sm mb-3">🏆 Recordes</h3>
        <div className="space-y-2 text-sm">
          <Row label="Melhor combo" value={`${player.bestCombo || 0}x`} />
          <Row label="Total de missões" value={`${player.totalMissionsDone || 0}`} />
          <Row label="Total de hábitos" value={`${player.totalHabitsDone || 0}`} />
          <Row label="Minutos de foco" value={`${player.totalFocusMinutes || 0}`} />
          <Row label="Mortes (Hardcore)" value={`${player.deaths || 0}`} />
        </div>
      </div>
    </div>
  );
}

function Kpi({ value, label, green, gold }: { value: string | number; label: string; green?: boolean; gold?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border text-center ${green ? 'bg-emerald-900/10 border-emerald-800/30' : gold ? 'bg-yellow-900/10 border-yellow-800/30' : 'bg-zinc-900 border-zinc-800'}`}>
      <div className={`text-2xl font-black ${green ? 'text-emerald-400' : gold ? 'text-yellow-400' : ''}`}>{value}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

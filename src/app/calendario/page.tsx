'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DOW = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

export default function CalendarioPage() {
  const missions = useStore((s) => s.missions);
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(new Date());
  const [detail, setDetail] = useState<string | null>(null);
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayNum = parseInt(today.slice(8, 10));
  const todayMonth = parseInt(today.slice(5, 7)) - 1;
  const todayYear = parseInt(today.slice(0, 4));

  const missionDays: Record<string, typeof missions> = {};
  missions.forEach((m) => {
    if (m.done && m.completedAt) {
      const d = m.completedAt.slice(0, 10);
      if (!missionDays[d]) missionDays[d] = [];
      missionDays[d].push(m);
    }
  });

  const streakDays = getStreakDays(missions);

  const cells = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = day === todayNum && month === todayMonth && year === todayYear;
    const hasM = !!missionDays[ds];
    const isStrk = streakDays.includes(ds);
    cells.push(
      <button key={day} onClick={() => setDetail(detail === ds ? null : ds)}
        className={`p-2 rounded-lg text-center text-sm transition-colors ${isToday ? 'ring-2 ring-violet-500 bg-violet-900/20' : 'hover:bg-zinc-800'} ${hasM ? 'font-semibold' : ''}`}>
        <div>{day}</div>
        <div className="flex justify-center gap-0.5 text-[8px]">
          {hasM && <span className="text-emerald-400">●</span>}
          {isStrk && <span>🔥</span>}
        </div>
      </button>
    );
  }

  const prevMonth = () => setDate(new Date(year, month - 1, 1));
  const nextMonth = () => setDate(new Date(year, month + 1, 1));

  const detailMissions = detail ? missionDays[detail] || [] : [];

  return (
    <div className="max-w-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">◀</button>
        <h1 className="text-lg font-black">{MONTHS[month]} {year}</h1>
        <button onClick={nextMonth} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">▶</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DOW.map((d) => <div key={d} className="text-center text-xs text-zinc-500 font-semibold py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
        {cells}
      </div>
      {detail && (
        <div className="mt-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm">📅 {detail}</h3>
            <button onClick={() => setDetail(null)} className="text-zinc-500 hover:text-zinc-300">✕</button>
          </div>
          {detailMissions.length === 0 && <p className="text-sm text-zinc-500">Nenhuma missão neste dia.</p>}
          {detailMissions.map((m) => (
            <div key={m.id} className="flex items-center gap-2 py-1 text-sm">
              <span className="text-emerald-400">✓</span>
              <span>{m.title}</span>
              <span className="text-xs text-zinc-500 ml-auto">+{m.reward.xp}XP</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getStreakDays(missions: import('@/lib/types').Mission[]): string[] {
  const dates = [...new Set(missions.filter((m) => m.done && m.completedAt).map((m) => m.completedAt!.slice(0, 10)))].sort();
  const streak: string[] = [];
  const cursor = new Date();
  for (let i = 0; i < 365; i++) {
    const ds = cursor.toISOString().slice(0, 10);
    if (dates.includes(ds)) { streak.push(ds); cursor.setDate(cursor.getDate() - 1); }
    else break;
  }
  return streak;
}

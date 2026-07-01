'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';

export default function CampoPage() {
  const missions = useStore((s) => s.missions);
  const [filter, setFilter] = useState<string>('all');
  const [, setShowForm] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const filtered = missions.filter((m) => {
    if (filter === 'all') return true;
    return m.type === filter;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-black">🎯 Campo de Batalha</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg font-semibold text-sm">
          + Nova Missão
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'mission', label: 'Missões' },
          { key: 'daily', label: 'Diárias' },
          { key: 'habit', label: 'Hábitos' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mission list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-zinc-500 text-center py-8">Nenhuma missão encontrada.</p>
        )}
        {filtered.map((m) => {
          const badges: string[] = [];
          if (m.dueDate === today) badges.push('📅 Vence hoje');
          if (m.dueDate && m.dueDate < today && !m.done) badges.push('⚠️ Atrasada');
          if (m.type === 'daily') badges.push('🔄 Diária');
          if (m.subtasks && m.subtasks.length > 0) {
            const done = m.subtasks.filter((st) => st.done).length;
            badges.push(`📋 ${done}/${m.subtasks.length}`);
          }

          return (
            <div
              key={m.id}
              className={`p-4 rounded-xl border transition-all hover:-translate-y-0.5 active:scale-[0.98] ${
                m.done ? 'bg-zinc-900/50 border-zinc-800/30 opacity-60' : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <button className="mt-0.5 w-6 h-6 rounded-full border-2 border-zinc-600 flex items-center justify-center hover:border-violet-400 transition-colors">
                  {m.done ? <span className="text-violet-400 text-sm">✓</span> : ''}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold ${m.done ? 'line-through text-zinc-500' : ''}`}>
                      {m.title}
                    </span>
                    {badges.map((b, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{b}</span>
                    ))}
                  </div>
                  {m.description && <p className="text-xs text-zinc-500 mt-0.5">{m.description}</p>}
                  <div className="flex gap-2 mt-1.5 text-xs text-zinc-500">
                    {m.skill && <span className="px-1.5 py-0.5 rounded bg-violet-900/30 text-violet-400">{m.skill}</span>}
                    <span className={dificuldadeCor(m.difficulty)}>{m.difficulty}</span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="text-violet-400 font-semibold">+{m.reward.xp}XP</span>
                  {m.reward.coins > 0 && <span className="text-yellow-400 font-semibold ml-1">+{m.reward.coins}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function dificuldadeCor(d: string) {
  const map: Record<string, string> = {
    facil: 'px-1.5 py-0.5 rounded bg-emerald-900/30 text-emerald-400',
    media: 'px-1.5 py-0.5 rounded bg-yellow-900/30 text-yellow-400',
    dificil: 'px-1.5 py-0.5 rounded bg-red-900/30 text-red-400',
  };
  return map[d] || '';
}

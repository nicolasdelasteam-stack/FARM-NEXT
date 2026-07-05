'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { createMission, today } from '@/lib/engine';
import { play } from '@/lib/sound';
import { DIFFICULTIES, SKILL_NAMES } from '@/lib/constants';
import type { Difficulty, MissionType } from '@/lib/types';

export default function CampoPage() {
  const missions = useStore((s) => s.missions);
  const addMission = useStore((s) => s.addMission);
  const updateMission = useStore((s) => s.updateMission);
  const removeMission = useStore((s) => s.removeMission);
  const concludeMission = useStore((s) => s.concludeMission);

  const [filter, setFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');

  const [titulo, setTitulo] = useState('');
  const [desc, setDesc] = useState('');
  const [dif, setDif] = useState<Difficulty>('media');
  const [tipo, setTipo] = useState<MissionType>('mission');
  const [skill, setSkill] = useState('');
  const [due, setDue] = useState('');

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };
  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500';
  const todayStr = today();

  const criar = () => {
    if (!titulo.trim()) return;
    addMission(createMission({
      title: titulo.trim(), description: desc.trim(), difficulty: dif, type: tipo,
      skill: skill || undefined, dueDate: due || undefined,
    }));
    setTitulo(''); setDesc(''); setDue(''); setSkill(''); setShowForm(false);
  };

  const concluir = (id: string) => {
    // Fluxo completo centralizado no store (recompensa, ofensiva, bosses, celebração).
    const r = concludeMission(id);
    if (!r.ok) return;
    if (r.jaPremiada) { play('check'); flash(`${r.title}: concluída ✓ (recompensa já recebida)`); return; }
    if (!r.leveledUp && !r.bossDefeated) play('check');
    const extras = [`+${r.xp} XP`, r.coins ? `+${r.coins} 🪙` : '']
      .concat(r.leveledUp ? ['🎉 Subiu de nível!'] : [])
      .concat(r.bossDefeated ? ['⚔️ Boss derrotado! +50 🪙'] : [])
      .filter(Boolean);
    flash(`${r.title}: ${extras.join(' · ')}`);
  };

  const reabrir = (id: string) => updateMission(id, { done: false, completedAt: null });

  const filtered = missions.filter((m) => (filter === 'all' ? true : m.type === filter));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-black">🎯 Campo de Batalha</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-sm">
          {showForm ? 'Fechar' : '+ Nova Missão'}
        </button>
      </div>

      {msg && <div className="mb-4 p-2 rounded-lg bg-indigo-950/50 border border-indigo-800/50 text-sm text-indigo-200 text-center">{msg}</div>}

      {showForm && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 mb-4">
          <input className={inp} placeholder="Título da missão" value={titulo} onChange={(e) => setTitulo(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && criar()} />
          <input className={inp} placeholder="Descrição (opcional)" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <select className={inp} value={tipo} onChange={(e) => setTipo(e.target.value as MissionType)}>
              <option value="mission">Missão</option>
              <option value="daily">Diária</option>
              <option value="habit">Hábito</option>
            </select>
            <select className={inp} value={dif} onChange={(e) => setDif(e.target.value as Difficulty)}>
              {Object.entries(DIFFICULTIES).map(([k, v]) => <option key={k} value={k}>{v.label} · +{v.reward.xp}XP</option>)}
            </select>
            <select className={inp} value={skill} onChange={(e) => setSkill(e.target.value)}>
              <option value="">Sem skill</option>
              {Object.entries(SKILL_NAMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input className={inp} type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
          <button onClick={criar} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">Criar missão</button>
        </div>
      )}

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
              filter === tab.key ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mission list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-zinc-500 text-center py-8">Nenhuma missão. Crie a primeira!</p>
        )}
        {filtered.map((m) => {
          const badges: string[] = [];
          if (m.dueDate === todayStr) badges.push('📅 Vence hoje');
          if (m.dueDate && m.dueDate < todayStr && !m.done) badges.push('⚠️ Atrasada');
          if (m.type === 'daily') badges.push('🔄 Diária');
          if (m.type === 'habit') badges.push('♻️ Hábito');
          if (m.subtasks && m.subtasks.length > 0) {
            const done = m.subtasks.filter((st) => st.done).length;
            badges.push(`📋 ${done}/${m.subtasks.length}`);
          }

          return (
            <div
              key={m.id}
              className={`p-4 rounded-xl border transition-all ${
                m.done ? 'bg-zinc-900/50 border-zinc-800/30 opacity-60' : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => (m.done ? reabrir(m.id) : concluir(m.id))}
                  title={m.done ? 'Reabrir' : 'Concluir'}
                  className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                    m.done ? 'border-indigo-500 bg-indigo-600/30' : 'border-zinc-600 hover:border-indigo-400'
                  }`}
                >
                  {m.done ? <span className="text-indigo-300 text-sm">✓</span> : ''}
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
                    {m.skill && <span className="px-1.5 py-0.5 rounded bg-indigo-900/30 text-indigo-400">{SKILL_NAMES[m.skill as keyof typeof SKILL_NAMES] || m.skill}</span>}
                    <span className={dificuldadeCor(m.difficulty)}>{m.difficulty}</span>
                  </div>
                </div>
                <div className="text-right text-xs shrink-0">
                  <div>
                    <span className="text-indigo-400 font-semibold">+{m.reward.xp}XP</span>
                    {m.reward.coins > 0 && <span className="text-yellow-400 font-semibold ml-1">+{m.reward.coins}</span>}
                  </div>
                  <button onClick={() => removeMission(m.id)} className="text-zinc-700 hover:text-red-400 mt-1">excluir</button>
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

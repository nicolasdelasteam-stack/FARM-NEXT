'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uid, today } from '@/lib/engine';
import { ACTIVITY_LEVELS, TREINO_OBJETIVOS, MUSCLE_GUIDE } from '@/lib/constants';
import type { TreinoPerfil } from '@/lib/types';

export default function TreinosPage() {
  const treinos = useStore((s) => s.treinos);
  const setTreinos = useStore((s) => s.setTreinos);
  const [tab, setTab] = useState<'macros' | 'rotina' | 'guia'>('macros');
  const [novoGrupo, setNovoGrupo] = useState('Peito');
  const [novoPeso, setNovoPeso] = useState('');

  const p = treinos.perfil;
  const upd = (patch: Partial<TreinoPerfil>) => setTreinos({ ...treinos, perfil: { ...p, ...patch } });

  const bmr = 10 * p.peso + 6.25 * p.altura - 5 * p.idade + (p.sexo === 'm' ? 5 : -161);
  const tdee = bmr * p.atividade;
  const kcal = Math.round(tdee + (TREINO_OBJETIVOS[p.objetivo]?.adj || 0));
  const protG = Math.round(p.peso * p.proteinaKg);
  const fatG = Math.round(p.peso * p.gorduraKg);
  const carbG = Math.max(0, Math.round((kcal - protG * 4 - fatG * 9) / 4));
  const carbKg = p.peso ? (carbG / p.peso).toFixed(1) : '0';

  const addGrupo = () => setTreinos({ ...treinos, rotinas: [...treinos.rotinas, { id: uid(), grupo: novoGrupo, exercicios: [] }] });
  const addExercicio = (rid: string) => setTreinos({ ...treinos, rotinas: treinos.rotinas.map((r) => r.id === rid ? { ...r, exercicios: [...r.exercicios, { id: uid(), nome: 'Novo exercício', series: 3, reps: '10', peso: 0 }] } : r) });
  const updEx = (rid: string, eid: string, patch: Partial<{ nome: string; series: number; reps: string; peso: number }>) =>
    setTreinos({ ...treinos, rotinas: treinos.rotinas.map((r) => r.id === rid ? { ...r, exercicios: r.exercicios.map((e) => e.id === eid ? { ...e, ...patch } : e) } : r) });
  const delEx = (rid: string, eid: string) => setTreinos({ ...treinos, rotinas: treinos.rotinas.map((r) => r.id === rid ? { ...r, exercicios: r.exercicios.filter((e) => e.id !== eid) } : r) });
  const delGrupo = (rid: string) => setTreinos({ ...treinos, rotinas: treinos.rotinas.filter((r) => r.id !== rid) });
  const addPeso = () => { const v = parseFloat(novoPeso); if (!v) return; setTreinos({ ...treinos, perfil: { ...p, peso: v }, logs: [...treinos.logs, { id: uid(), data: today(), peso: v }] }); setNovoPeso(''); };

  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500';
  const sm = 'bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm outline-none focus:border-violet-500';
  const logs = [...treinos.logs].sort((a, b) => a.data.localeCompare(b.data));
  const maxP = Math.max(...logs.map((l) => l.peso), 1);

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-black mb-1">💪 Meus Treinos</h1>
      <p className="text-sm text-zinc-500 mb-4">Macros calculados por fórmula, rotina e guia de grupos musculares.</p>
      <div className="flex gap-2 mb-5">
        {(['macros', 'rotina', 'guia'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${tab === t ? 'bg-violet-600 text-white' : 'bg-zinc-900 text-zinc-400'}`}>
            {t === 'macros' ? 'Macros' : t === 'rotina' ? 'Rotina' : 'Guia'}
          </button>
        ))}
      </div>

      {tab === 'macros' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <div className="text-sm font-bold mb-1">Seu perfil</div>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-zinc-500">Peso (kg)<input className={inp} type="number" value={p.peso} onChange={(e) => upd({ peso: parseFloat(e.target.value) || 0 })} /></label>
              <label className="text-xs text-zinc-500">Altura (cm)<input className={inp} type="number" value={p.altura} onChange={(e) => upd({ altura: parseFloat(e.target.value) || 0 })} /></label>
              <label className="text-xs text-zinc-500">Idade<input className={inp} type="number" value={p.idade} onChange={(e) => upd({ idade: parseFloat(e.target.value) || 0 })} /></label>
              <label className="text-xs text-zinc-500">Sexo<select className={inp} value={p.sexo} onChange={(e) => upd({ sexo: e.target.value as 'm' | 'f' })}><option value="m">Masculino</option><option value="f">Feminino</option></select></label>
            </div>
            <label className="text-xs text-zinc-500 block">Atividade<select className={inp} value={p.atividade} onChange={(e) => upd({ atividade: parseFloat(e.target.value) })}>{ACTIVITY_LEVELS.map((a) => <option key={a.v} value={a.v}>{a.label}</option>)}</select></label>
            <label className="text-xs text-zinc-500 block">Objetivo<select className={inp} value={p.objetivo} onChange={(e) => upd({ objetivo: e.target.value as TreinoPerfil['objetivo'] })}>{Object.entries(TREINO_OBJETIVOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></label>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-zinc-500">Proteína (g/kg)<input className={inp} type="number" step="0.1" value={p.proteinaKg} onChange={(e) => upd({ proteinaKg: parseFloat(e.target.value) || 0 })} /></label>
              <label className="text-xs text-zinc-500">Gordura (g/kg)<input className={inp} type="number" step="0.1" value={p.gorduraKg} onChange={(e) => upd({ gorduraKg: parseFloat(e.target.value) || 0 })} /></label>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-950/50 to-zinc-900 border border-violet-800/40 text-center">
              <div className="text-xs text-zinc-400">Calorias necessárias</div>
              <div className="text-4xl font-black text-violet-300">{kcal}</div>
              <div className="text-xs text-zinc-500">kcal/dia · TMB {Math.round(bmr)}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[['Proteína', protG, p.proteinaKg, 'text-red-400'], ['Carbo', carbG, carbKg, 'text-sky-400'], ['Gordura', fatG, p.gorduraKg, 'text-yellow-400']].map(([lbl, g, kg, col]) => (
                <div key={lbl as string} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className={`text-2xl font-black ${col}`}>{g}<span className="text-xs font-normal">g</span></div>
                  <div className="text-[11px] text-zinc-500">{lbl}</div>
                  <div className="text-[10px] text-zinc-600">{kg} g/kg</div>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex gap-2 mb-2"><input className={sm + ' flex-1'} type="number" step="0.1" placeholder="Registrar peso hoje" value={novoPeso} onChange={(e) => setNovoPeso(e.target.value)} /><button onClick={addPeso} className="px-3 bg-violet-600 hover:bg-violet-500 rounded text-sm font-semibold">Salvar</button></div>
              {logs.length > 1 && (
                <div className="flex items-end gap-1 h-16">
                  {logs.slice(-16).map((l) => <div key={l.id} title={`${l.peso}kg`} className="flex-1 bg-violet-600/60 rounded-t" style={{ height: `${(l.peso / maxP) * 100}%` }} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'rotina' && (
        <div>
          <div className="flex gap-2 mb-4">
            <select className={inp + ' max-w-xs'} value={novoGrupo} onChange={(e) => setNovoGrupo(e.target.value)}>{MUSCLE_GUIDE.map((m) => <option key={m.grupo}>{m.grupo}</option>)}</select>
            <button onClick={addGrupo} className="px-4 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">+ Dia de treino</button>
          </div>
          {treinos.rotinas.length === 0 && <p className="text-sm text-zinc-600">Nenhuma rotina ainda.</p>}
          <div className="space-y-3">
            {treinos.rotinas.map((r) => (
              <div key={r.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold">{r.grupo}</div>
                  <div className="flex gap-2"><button onClick={() => addExercicio(r.id)} className="text-xs text-violet-400 hover:text-violet-300">+ exercício</button><button onClick={() => delGrupo(r.id)} className="text-xs text-zinc-600 hover:text-red-400">excluir</button></div>
                </div>
                {r.exercicios.map((e) => (
                  <div key={e.id} className="flex items-center gap-2 py-1">
                    <input className={sm + ' flex-1'} value={e.nome} onChange={(ev) => updEx(r.id, e.id, { nome: ev.target.value })} />
                    <input className={sm + ' w-12'} type="number" value={e.series} onChange={(ev) => updEx(r.id, e.id, { series: parseInt(ev.target.value) || 0 })} title="séries" />
                    <span className="text-xs text-zinc-600">x</span>
                    <input className={sm + ' w-14'} value={e.reps} onChange={(ev) => updEx(r.id, e.id, { reps: ev.target.value })} title="reps" />
                    <input className={sm + ' w-16'} type="number" value={e.peso} onChange={(ev) => updEx(r.id, e.id, { peso: parseFloat(ev.target.value) || 0 })} title="kg" />
                    <button onClick={() => delEx(r.id, e.id)} className="text-zinc-600 hover:text-red-400 text-xs">✕</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'guia' && (
        <div className="grid md:grid-cols-2 gap-3">
          {MUSCLE_GUIDE.map((m) => (
            <div key={m.grupo} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="font-bold mb-1">{m.grupo}</div>
              <div className="flex flex-wrap gap-1.5 mb-2">{m.exercicios.map((e) => <span key={e} className="px-2 py-0.5 rounded bg-zinc-800 text-xs text-zinc-300">{e}</span>)}</div>
              <p className="text-xs text-zinc-500">💡 {m.dica}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

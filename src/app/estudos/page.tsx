'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uid } from '@/lib/engine';
import { WEEK_DAYS, LIVRO_TIPOS } from '@/lib/constants';
import type { LivroStatus } from '@/lib/types';

export default function EstudosPage() {
  const estudos = useStore((s) => s.estudos);
  const setEstudos = useStore((s) => s.setEstudos);
  const [tab, setTab] = useState<'materias' | 'biblioteca'>('materias');
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState(''); const [emoji, setEmoji] = useState('📘'); const [dia, setDia] = useState(WEEK_DAYS[0]); const [hora, setHora] = useState('08:00'); const [prof, setProf] = useState('');
  const [lTitulo, setLTitulo] = useState(''); const [lTipo, setLTipo] = useState(LIVRO_TIPOS[0]); const [lLink, setLLink] = useState('');

  const addMateria = () => { if (!nome.trim()) return; setEstudos({ ...estudos, materias: [...estudos.materias, { id: uid(), nome: nome.trim(), emoji, dia, horario: hora, professor: prof.trim(), resumo: '' }] }); setNome(''); setProf(''); setOpen(false); };
  const setResumo = (id: string, resumo: string) => setEstudos({ ...estudos, materias: estudos.materias.map((m) => m.id === id ? { ...m, resumo } : m) });
  const delMateria = (id: string) => setEstudos({ ...estudos, materias: estudos.materias.filter((m) => m.id !== id) });
  const addLivro = () => { if (!lTitulo.trim()) return; setEstudos({ ...estudos, biblioteca: [...estudos.biblioteca, { id: uid(), titulo: lTitulo.trim(), tipo: lTipo, link: lLink.trim(), status: 'quero_ler', progresso: 0 }] }); setLTitulo(''); setLLink(''); };
  const updLivro = (id: string, patch: Partial<{ status: LivroStatus; progresso: number }>) => setEstudos({ ...estudos, biblioteca: estudos.biblioteca.map((l) => l.id === id ? { ...l, ...patch } : l) });
  const delLivro = (id: string) => setEstudos({ ...estudos, biblioteca: estudos.biblioteca.filter((l) => l.id !== id) });

  const EMO = ['📘', '📗', '📕', '🧬', '💊', '🧪', '🧠', '🩺', '💻', '📐'];
  const STATUS: Record<LivroStatus, string> = { quero_ler: 'Quero ler', lendo: 'Lendo', lido: 'Lido' };
  const tipos = [...new Set(estudos.biblioteca.map((l) => l.tipo))];
  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500';

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-black mb-1">📚 Estudos</h1>
      <p className="text-sm text-zinc-500 mb-4">Matérias com horário e a sua Bibliotheca Alexandrina.</p>
      <div className="flex gap-2 mb-5">
        {(['materias', 'biblioteca'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${tab === t ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400'}`}>{t === 'materias' ? 'Matérias' : 'Bibliotheca'}</button>
        ))}
      </div>

      {tab === 'materias' && (
        <div>
          <div className="flex justify-end mb-3"><button onClick={() => setOpen(!open)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">{open ? 'Fechar' : '+ Matéria'}</button></div>
          {open && (
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 mb-4">
              <div className="flex gap-1.5 flex-wrap">{EMO.map((e) => <button key={e} onClick={() => setEmoji(e)} className={`w-9 h-9 rounded-lg text-lg ${emoji === e ? 'bg-indigo-600' : 'bg-zinc-800'}`}>{e}</button>)}</div>
              <input className={inp} placeholder="Nome da matéria" value={nome} onChange={(e) => setNome(e.target.value)} />
              <div className="grid grid-cols-3 gap-2">
                <select className={inp} value={dia} onChange={(e) => setDia(e.target.value)}>{WEEK_DAYS.map((d) => <option key={d}>{d}</option>)}</select>
                <input className={inp} type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
                <input className={inp} placeholder="Professor" value={prof} onChange={(e) => setProf(e.target.value)} />
              </div>
              <button onClick={addMateria} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">Adicionar matéria</button>
            </div>
          )}
          {WEEK_DAYS.filter((d) => estudos.materias.some((m) => m.dia === d)).map((d) => (
            <div key={d} className="mb-4">
              <div className="text-xs font-semibold text-zinc-500 uppercase mb-1">{d}</div>
              <div className="space-y-2">
                {estudos.materias.filter((m) => m.dia === d).sort((a, b) => a.horario.localeCompare(b.horario)).map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{m.emoji}</span>
                      <div className="flex-1"><div className="font-semibold text-sm">{m.nome}</div><div className="text-xs text-zinc-500">🕐 {m.horario}{m.professor ? ` · ${m.professor}` : ''}</div></div>
                      <button onClick={() => delMateria(m.id)} className="text-zinc-600 hover:text-red-400 text-xs">✕</button>
                    </div>
                    <textarea className="w-full mt-2 bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-500" rows={2} placeholder="Resumo / anotações..." value={m.resumo} onChange={(e) => setResumo(m.id, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {estudos.materias.length === 0 && <p className="text-sm text-zinc-600">Nenhuma matéria ainda.</p>}
        </div>
      )}

      {tab === 'biblioteca' && (
        <div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-4">
            <div className="text-sm font-bold mb-2">📖 Adicionar livro/PDF</div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input className={inp} placeholder="Título" value={lTitulo} onChange={(e) => setLTitulo(e.target.value)} />
              <select className={inp} value={lTipo} onChange={(e) => setLTipo(e.target.value)}>{LIVRO_TIPOS.map((t) => <option key={t}>{t}</option>)}</select>
            </div>
            <div className="flex gap-2"><input className={inp} placeholder="Link do PDF (opcional)" value={lLink} onChange={(e) => setLLink(e.target.value)} /><button onClick={addLivro} className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">+</button></div>
          </div>
          {tipos.map((tp) => (
            <div key={tp} className="mb-4">
              <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">{tp}</div>
              <div className="grid md:grid-cols-2 gap-2">
                {estudos.biblioteca.filter((l) => l.tipo === tp).map((l) => (
                  <div key={l.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-sm">{l.link ? <a href={l.link} target="_blank" rel="noopener" className="text-indigo-300 hover:underline">{l.titulo}</a> : l.titulo}</div>
                      <button onClick={() => delLivro(l.id)} className="text-zinc-600 hover:text-red-400 text-xs">✕</button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <select value={l.status} onChange={(e) => updLivro(l.id, { status: e.target.value as LivroStatus })} className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs">{(Object.keys(STATUS) as LivroStatus[]).map((k) => <option key={k} value={k}>{STATUS[k]}</option>)}</select>
                      <input type="range" min={0} max={100} value={l.progresso} onChange={(e) => updLivro(l.id, { progresso: parseInt(e.target.value) })} className="flex-1 accent-indigo-500" />
                      <span className="text-xs text-zinc-500 w-8">{l.progresso}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {estudos.biblioteca.length === 0 && <p className="text-sm text-zinc-600">Bibliotheca vazia.</p>}
        </div>
      )}
    </div>
  );
}

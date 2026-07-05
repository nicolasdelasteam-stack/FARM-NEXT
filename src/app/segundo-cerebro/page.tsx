'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uid } from '@/lib/engine';
import type { LivroStatus } from '@/lib/types';
import { useReward, RewardBanner } from '@/components/RewardFeedback';

const STATUS: Record<LivroStatus, { label: string; color: string }> = {
  quero_ler: { label: 'Quero ler', color: 'text-zinc-400' },
  lendo: { label: 'Lendo', color: 'text-sky-400' },
  lido: { label: 'Lido', color: 'text-emerald-400' },
};

export default function SegundoCerebroPage() {
  const cerebro = useStore((s) => s.cerebro);
  const setCerebro = useStore((s) => s.setCerebro);
  const { msg, reward } = useReward();
  const [tab, setTab] = useState<'livros' | 'habilidades' | 'ideias'>('livros');

  const inp = 'bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500';

  // ─── Livros ───
  const [lTitulo, setLTitulo] = useState('');
  const [lAutor, setLAutor] = useState('');
  const [lLink, setLLink] = useState('');
  const [lStatus, setLStatus] = useState<LivroStatus>('quero_ler');

  const addLivro = () => {
    if (!lTitulo.trim()) return;
    setCerebro({ ...cerebro, livros: [...cerebro.livros, { id: uid(), titulo: lTitulo.trim(), autor: lAutor.trim(), link: lLink.trim(), status: lStatus, progresso: 0 }] });
    setLTitulo(''); setLAutor(''); setLLink('');
  };
  const setLivro = (id: string, patch: Partial<(typeof cerebro.livros)[number]>) => {
    const antes = cerebro.livros.find((l) => l.id === id);
    const marcouLido = patch.status === 'lido' && antes?.status !== 'lido';
    setCerebro({ ...cerebro, livros: cerebro.livros.map((l) => l.id === id ? { ...l, ...patch, ...(marcouLido ? { progresso: 100 } : {}) } : l) });
    if (marcouLido && antes) reward(`Livro lido: ${antes.titulo} 🧠`, 30, { coins: 10, skill: 'estudos' });
  };
  const delLivro = (id: string) => setCerebro({ ...cerebro, livros: cerebro.livros.filter((l) => l.id !== id) });

  // ─── Habilidades ───
  const [hNome, setHNome] = useState('');
  const [hIcon, setHIcon] = useState('🧠');
  const HICONS = ['🧠', '💻', '🎸', '🗣️', '✍️', '📈', '🎨', '📷', '🍳', '♟️'];

  const addHab = () => {
    if (!hNome.trim()) return;
    setCerebro({ ...cerebro, habilidades: [...cerebro.habilidades, { id: uid(), nome: hNome.trim(), icon: hIcon, notas: '' }] });
    setHNome('');
  };
  const setHabNotas = (id: string, notas: string) =>
    setCerebro({ ...cerebro, habilidades: cerebro.habilidades.map((h) => h.id === id ? { ...h, notas } : h) });
  const delHab = (id: string) => setCerebro({ ...cerebro, habilidades: cerebro.habilidades.filter((h) => h.id !== id) });

  // ─── Ideias ───
  const [iTexto, setITexto] = useState('');
  const [iCat, setICat] = useState('Vídeo');
  const CATS = ['Vídeo', 'Jogo', 'Criação', 'Negócio', 'Outro'];

  const addIdeia = () => {
    if (!iTexto.trim()) return;
    setCerebro({ ...cerebro, ideias: [...cerebro.ideias, { id: uid(), texto: iTexto.trim(), categoria: iCat }] });
    setITexto('');
  };
  const delIdeia = (id: string) => setCerebro({ ...cerebro, ideias: cerebro.ideias.filter((i) => i.id !== id) });

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-black mb-1">🧠 Segundo Cérebro</h1>
      <p className="text-sm text-zinc-500 mb-4">Leitura livre, habilidades em estudo e banco de ideias. (Livros de matéria ficam em Estudos → Bibliotheca.)</p>
      <RewardBanner msg={msg} />

      <div className="flex gap-2 mb-4">
        {(['livros', 'habilidades', 'ideias'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${tab === t ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>
            {t === 'livros' ? '📚 Livros' : t === 'habilidades' ? '🎯 Habilidades' : '💡 Ideias'}
          </button>
        ))}
      </div>

      {tab === 'livros' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <div className="flex gap-2">
              <input className={`${inp} flex-1`} placeholder="Título" value={lTitulo} onChange={(e) => setLTitulo(e.target.value)} />
              <input className={`${inp} w-40`} placeholder="Autor" value={lAutor} onChange={(e) => setLAutor(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <input className={`${inp} flex-1`} placeholder="Link (PDF, opcional)" value={lLink} onChange={(e) => setLLink(e.target.value)} />
              <select className={inp} value={lStatus} onChange={(e) => setLStatus(e.target.value as LivroStatus)}>
                {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <button onClick={addLivro} className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">+</button>
            </div>
          </div>
          <div className="space-y-2">
            {cerebro.livros.length === 0 && <p className="text-center text-zinc-500 py-8 text-sm">Nenhum livro ainda.</p>}
            {cerebro.livros.map((l) => (
              <div key={l.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-start gap-2">
                  <span className="text-lg">📖</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{l.link ? <a href={l.link} target="_blank" rel="noreferrer" className="hover:text-indigo-400 underline-offset-2 hover:underline">{l.titulo}</a> : l.titulo}</div>
                    {l.autor && <div className="text-[11px] text-zinc-500">{l.autor}</div>}
                  </div>
                  <select className={`${inp} text-xs`} value={l.status} onChange={(e) => setLivro(l.id, { status: e.target.value as LivroStatus })}>
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <button onClick={() => delLivro(l.id)} className="text-zinc-600 hover:text-red-400 text-xs shrink-0">✕</button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="range" min={0} max={100} value={l.progresso} onChange={(e) => setLivro(l.id, { progresso: parseInt(e.target.value) })} className="flex-1 accent-indigo-500" />
                  <span className={`text-xs w-10 text-right ${STATUS[l.status].color}`}>{l.progresso}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'habilidades' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <div className="flex gap-1.5 flex-wrap">
              {HICONS.map((e) => <button key={e} onClick={() => setHIcon(e)} className={`w-9 h-9 rounded-lg text-lg ${hIcon === e ? 'bg-indigo-600' : 'bg-zinc-800'}`}>{e}</button>)}
            </div>
            <div className="flex gap-2">
              <input className={`${inp} flex-1`} placeholder="Ex: Programação, Violão..." value={hNome} onChange={(e) => setHNome(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addHab()} />
              <button onClick={addHab} className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">+</button>
            </div>
          </div>
          <div className="space-y-3">
            {cerebro.habilidades.length === 0 && <p className="text-center text-zinc-500 py-8 text-sm">Nenhuma habilidade em estudo.</p>}
            {cerebro.habilidades.map((h) => (
              <div key={h.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{h.icon}</span>
                  <span className="text-sm font-semibold flex-1">{h.nome}</span>
                  <button onClick={() => delHab(h.id)} className="text-zinc-600 hover:text-red-400 text-xs">✕</button>
                </div>
                <textarea className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 h-24" placeholder="Anotações, links, o que você aprendeu para revisar depois..." value={h.notas} onChange={(e) => setHabNotas(h.id, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'ideias' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <textarea className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 h-16" placeholder="Sua ideia..." value={iTexto} onChange={(e) => setITexto(e.target.value)} />
            <div className="flex gap-2">
              <select className={`${inp} flex-1`} value={iCat} onChange={(e) => setICat(e.target.value)}>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
              <button onClick={addIdeia} className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">Salvar</button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {cerebro.ideias.length === 0 && <p className="text-center text-zinc-500 py-8 text-sm col-span-full">Nenhuma ideia guardada.</p>}
            {[...cerebro.ideias].reverse().map((i) => (
              <div key={i.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-indigo-400">{i.categoria}</span>
                  <button onClick={() => delIdeia(i.id)} className="text-zinc-600 hover:text-red-400 text-xs">✕</button>
                </div>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{i.texto}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

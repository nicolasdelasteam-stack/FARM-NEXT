'use client';

import { useState, type ChangeEvent } from 'react';
import { useStore } from '@/lib/store';
import { uid } from '@/lib/engine';
import type { MidiaItem, MidiaGrupo, MidiaStatus } from '@/lib/types';
import { useReward, RewardBanner } from '@/components/RewardFeedback';

const GRUPO: Record<MidiaGrupo, { label: string; icon: string }> = {
  filme: { label: 'Filme', icon: '🎬' },
  serie: { label: 'Série', icon: '📺' },
  anime: { label: 'Anime', icon: '🍥' },
};
const STATUS: Record<MidiaStatus, { label: string; color: string }> = {
  quero_assistir: { label: 'Quero assistir', color: 'text-zinc-400' },
  assistindo: { label: 'Assistindo', color: 'text-sky-400' },
  assistido: { label: 'Assistido', color: 'text-emerald-400' },
};
const CAPAS = ['🎬', '📺', '🍥', '🦸', '👽', '🧙', '🚀', '🔫', '💀', '👻', '🐉', '❤️', '😂', '🕵️', '🏆', '🌌'];

// Capa pode ser emoji, URL ou foto enviada (data-URL).
const capaEhImagem = (capa: string) => capa.startsWith('data:') || capa.startsWith('http');

// Comprime a foto de capa para pôster ~360px (mesmo padrão das outras abas).
function lerCapa(e: ChangeEvent<HTMLInputElement>, cb: (dataUrl: string) => void) {
  const file = e.target.files?.[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new window.Image();
    img.onload = () => {
      const max = 360; const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = img.width * scale; c.height = img.height * scale;
      const ctx = c.getContext('2d'); if (ctx) ctx.drawImage(img, 0, 0, c.width, c.height);
      cb(c.toDataURL('image/jpeg', 0.78));
    };
    img.src = reader.result as string;
  };
  reader.readAsDataURL(file);
}

type Filtro = 'todos' | MidiaGrupo | 'favoritos' | 'assistindo' | 'assistido';

export default function MidiaPage() {
  const midia = useStore((s) => s.midia);
  const setMidia = useStore((s) => s.setMidia);
  const { msg, reward } = useReward();
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [open, setOpen] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [capa, setCapa] = useState('🎬');
  const [grupo, setGrupo] = useState<MidiaGrupo>('filme');
  const [status, setStatus] = useState<MidiaStatus>('quero_assistir');
  const [temporadas, setTemporadas] = useState('1');

  const inp = 'bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500';

  const add = () => {
    if (!titulo.trim()) return;
    const item: MidiaItem = {
      id: uid(), titulo: titulo.trim(), capa, grupo, status,
      estrelas: 0, favorito: false,
      temporadas: grupo === 'filme' ? 0 : Math.max(1, parseInt(temporadas) || 1), vistas: 0,
    };
    setMidia([...midia, item]);
    setTitulo(''); setTemporadas('1'); setOpen(false);
  };
  const patch = (id: string, p: Partial<MidiaItem>) => {
    const antes = midia.find((m) => m.id === id);
    const concluiu = p.status === 'assistido' && antes?.status !== 'assistido';
    setMidia(midia.map((m) => m.id === id ? { ...m, ...p } : m));
    if (concluiu && antes) reward(`Concluiu: ${antes.titulo} 🍿`, 10);
  };
  const del = (id: string) => setMidia(midia.filter((m) => m.id !== id));

  const FILTROS: { key: Filtro; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'filme', label: '🎬 Filmes' },
    { key: 'serie', label: '📺 Séries' },
    { key: 'anime', label: '🍥 Animes' },
    { key: 'favoritos', label: '⭐ Favoritos' },
    { key: 'assistindo', label: 'Assistindo' },
    { key: 'assistido', label: 'Assistidos' },
  ];

  const visiveis = midia.filter((m) => {
    if (filtro === 'todos') return true;
    if (filtro === 'favoritos') return m.favorito;
    if (filtro === 'assistindo' || filtro === 'assistido') return m.status === filtro;
    return m.grupo === filtro;
  });

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-xl font-black">🎬 Mídia</h1>
        <button onClick={() => setOpen(!open)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">{open ? 'Fechar' : '+ Adicionar'}</button>
      </div>
      <p className="text-sm text-zinc-500 mb-4">Filmes, séries e animes — avaliação, status e progresso de temporadas.</p>
      <RewardBanner msg={msg} />

      {open && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 mb-5">
          <div className="flex gap-1.5 flex-wrap items-center">
            {CAPAS.map((c) => <button key={c} onClick={() => setCapa(c)} className={`w-9 h-9 rounded-lg text-lg ${capa === c ? 'bg-indigo-600' : 'bg-zinc-800'}`}>{c}</button>)}
            <label className={`h-9 px-2 rounded-lg text-xs font-semibold flex items-center cursor-pointer ${capaEhImagem(capa) ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
              🖼️ Foto de capa
              <input type="file" accept="image/*" className="hidden" onChange={(e) => lerCapa(e, setCapa)} />
            </label>
            {/* eslint-disable-next-line @next/next/no-img-element -- preview de capa é data-URL do navegador */}
            {capaEhImagem(capa) && <img src={capa} alt="capa" className="h-12 w-9 object-cover rounded" />}
          </div>
          <input className={`${inp} w-full`} placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <div className="flex gap-2">
            <select className={`${inp} flex-1`} value={grupo} onChange={(e) => setGrupo(e.target.value as MidiaGrupo)}>
              {Object.entries(GRUPO).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select className={`${inp} flex-1`} value={status} onChange={(e) => setStatus(e.target.value as MidiaStatus)}>
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            {grupo !== 'filme' && <input className={`${inp} w-28`} type="number" min={1} placeholder="Temporadas" value={temporadas} onChange={(e) => setTemporadas(e.target.value)} />}
          </div>
          <button onClick={add} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">Adicionar</button>
        </div>
      )}

      <div className="flex gap-1.5 flex-wrap mb-4">
        {FILTROS.map((f) => (
          <button key={f.key} onClick={() => setFiltro(f.key)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium ${filtro === f.key ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>{f.label}</button>
        ))}
      </div>

      {visiveis.length === 0 && <p className="text-center text-zinc-500 py-10 text-sm">Nada por aqui ainda. Adicione um título!</p>}

      <div className="grid sm:grid-cols-2 gap-3">
        {visiveis.map((m) => {
          const pct = m.temporadas > 0 ? Math.round((m.vistas / m.temporadas) * 100) : 0;
          return (
            <div key={m.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-start gap-3">
                {capaEhImagem(m.capa)
                  // eslint-disable-next-line @next/next/no-img-element -- capa do título é data-URL/URL livre
                  ? <img src={m.capa} alt="" className="w-12 h-16 object-cover rounded-lg shrink-0 border border-zinc-700" />
                  : <span className="text-3xl">{m.capa}</span>}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-bold text-sm truncate">{m.titulo}</div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="text-zinc-700 hover:text-indigo-400 text-xs cursor-pointer" title="Trocar foto de capa">
                        🖼️
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => lerCapa(e, (d) => patch(m.id, { capa: d }))} />
                      </label>
                      <button onClick={() => del(m.id)} className="text-zinc-700 hover:text-red-400 text-xs">✕</button>
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-indigo-400">{GRUPO[m.grupo].icon} {GRUPO[m.grupo].label}</div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => patch(m.id, { estrelas: m.estrelas === s ? 0 : s })} className="text-sm leading-none">
                        <span className={s <= m.estrelas ? 'text-yellow-400' : 'text-zinc-700'}>★</span>
                      </button>
                    ))}
                    <button onClick={() => patch(m.id, { favorito: !m.favorito })} className="ml-1 text-sm" title="Favorito">
                      <span className={m.favorito ? 'text-pink-400' : 'text-zinc-700'}>❤</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <select className={`${inp} text-xs flex-1`} value={m.status} onChange={(e) => patch(m.id, { status: e.target.value as MidiaStatus })}>
                  {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>

              {m.grupo !== 'filme' && (
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
                    <span>Temporadas: {m.vistas}/{m.temporadas}</span>
                    <span className={STATUS[m.status].color}>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => patch(m.id, { vistas: Math.max(0, m.vistas - 1) })} className="px-2 py-0.5 text-xs bg-zinc-800 hover:bg-zinc-700 rounded">−</button>
                    <button onClick={() => patch(m.id, { vistas: Math.min(m.temporadas, m.vistas + 1) })} className="px-2 py-0.5 text-xs bg-zinc-800 hover:bg-emerald-600 rounded">+ temporada</button>
                    <input type="number" min={1} value={m.temporadas} onChange={(e) => patch(m.id, { temporadas: Math.max(1, parseInt(e.target.value) || 1) })} className={`${inp} w-16 text-xs ml-auto`} title="Total de temporadas" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useState, type ChangeEvent } from 'react';
import { useStore } from '@/lib/store';
import { uid } from '@/lib/engine';
import { WEEK_DAYS, LIVRO_TIPOS } from '@/lib/constants';
import type { LivroStatus, Materia, PaginaEstudo } from '@/lib/types';
import { useReward, RewardBanner } from '@/components/RewardFeedback';

// Lê e comprime uma imagem para data-URL (capa da matéria / imagens das páginas).
function lerImagem(e: ChangeEvent<HTMLInputElement>, max: number, cb: (dataUrl: string) => void) {
  const file = e.target.files?.[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = img.width * scale; c.height = img.height * scale;
      const ctx = c.getContext('2d'); if (ctx) ctx.drawImage(img, 0, 0, c.width, c.height);
      cb(c.toDataURL('image/jpeg', 0.8));
    };
    img.src = reader.result as string;
  };
  reader.readAsDataURL(file);
}

const PAGE_ICONS = ['📄', '📝', '🧬', '💊', '🧪', '🧠', '🩺', '📊', '📌', '⭐'];

export default function EstudosPage() {
  const estudos = useStore((s) => s.estudos);
  const setEstudos = useStore((s) => s.setEstudos);
  const { msg, reward } = useReward();
  const [tab, setTab] = useState<'materias' | 'biblioteca'>('materias');
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState(''); const [emoji, setEmoji] = useState('📘'); const [dia, setDia] = useState(WEEK_DAYS[0]); const [hora, setHora] = useState('08:00'); const [prof, setProf] = useState('');
  const [lTitulo, setLTitulo] = useState(''); const [lTipo, setLTipo] = useState(LIVRO_TIPOS[0]); const [lLink, setLLink] = useState('');

  // Navegação estilo Notion: matéria aberta + trilha de páginas (breadcrumb).
  const [nav, setNav] = useState<{ materiaId: string; trilha: string[] } | null>(null);
  const [novaPagina, setNovaPagina] = useState('');
  const [linkTitulo, setLinkTitulo] = useState(''); const [linkUrl, setLinkUrl] = useState('');

  const paginas = estudos.paginas || [];

  const addMateria = () => { if (!nome.trim()) return; setEstudos({ ...estudos, materias: [...estudos.materias, { id: uid(), nome: nome.trim(), emoji, dia, horario: hora, professor: prof.trim(), resumo: '' }] }); setNome(''); setProf(''); setOpen(false); };
  const updMateria = (id: string, patch: Partial<Materia>) => setEstudos({ ...estudos, materias: estudos.materias.map((m) => m.id === id ? { ...m, ...patch } : m) });
  const delMateria = (id: string) => {
    setEstudos({ ...estudos, materias: estudos.materias.filter((m) => m.id !== id), paginas: paginas.filter((p) => p.materiaId !== id) });
    if (nav?.materiaId === id) setNav(null);
  };
  const addLivro = () => { if (!lTitulo.trim()) return; setEstudos({ ...estudos, biblioteca: [...estudos.biblioteca, { id: uid(), titulo: lTitulo.trim(), tipo: lTipo, link: lLink.trim(), status: 'quero_ler', progresso: 0 }] }); setLTitulo(''); setLLink(''); };
  const updLivro = (id: string, patch: Partial<{ status: LivroStatus; progresso: number }>) => {
    const antes = estudos.biblioteca.find((l) => l.id === id);
    const marcouLido = patch.status === 'lido' && antes?.status !== 'lido';
    setEstudos({ ...estudos, biblioteca: estudos.biblioteca.map((l) => l.id === id ? { ...l, ...patch, ...(marcouLido ? { progresso: 100 } : {}) } : l) });
    if (marcouLido && antes) reward(`Livro lido: ${antes.titulo} 📚`, 30, { coins: 10, skill: 'estudos' });
  };
  const delLivro = (id: string) => setEstudos({ ...estudos, biblioteca: estudos.biblioteca.filter((l) => l.id !== id) });

  // ─── Páginas (estilo Notion) ───
  const filhosDe = (materiaId: string, parentId: string | null) => paginas.filter((p) => p.materiaId === materiaId && p.parentId === parentId);
  const criarPagina = (materiaId: string, parentId: string | null, titulo: string) => {
    const pg: PaginaEstudo = { id: uid(), materiaId, parentId, titulo: titulo.trim() || 'Nova página', icon: '📄', conteudo: '', imagens: [], links: [] };
    setEstudos({ ...estudos, paginas: [...paginas, pg] });
    return pg.id;
  };
  const updPagina = (id: string, patch: Partial<PaginaEstudo>) => setEstudos({ ...estudos, paginas: paginas.map((p) => p.id === id ? { ...p, ...patch } : p) });
  const delPagina = (id: string) => {
    // Remove a página e toda a subárvore de subpáginas.
    const mortos = new Set([id]);
    let mudou = true;
    while (mudou) { mudou = false; for (const p of paginas) { if (p.parentId && mortos.has(p.parentId) && !mortos.has(p.id)) { mortos.add(p.id); mudou = true; } } }
    setEstudos({ ...estudos, paginas: paginas.filter((p) => !mortos.has(p.id)) });
    if (nav) setNav({ ...nav, trilha: nav.trilha.filter((t) => !mortos.has(t)) });
  };

  const EMO = ['📘', '📗', '📕', '🧬', '💊', '🧪', '🧠', '🩺', '💻', '📐'];
  const STATUS: Record<LivroStatus, string> = { quero_ler: 'Quero ler', lendo: 'Lendo', lido: 'Lido' };
  const tipos = [...new Set(estudos.biblioteca.map((l) => l.tipo))];
  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500';

  const materiaAberta = nav ? estudos.materias.find((m) => m.id === nav.materiaId) : undefined;
  const paginaAtual = nav && nav.trilha.length > 0 ? paginas.find((p) => p.id === nav.trilha[nav.trilha.length - 1]) : undefined;

  // Lista de páginas-filhas + criador (raiz da matéria e dentro de páginas).
  // Função de render (não componente) para o input não perder o foco a cada tecla.
  const listaPaginas = (materiaId: string, parentId: string | null) => (
    <div className="space-y-1">
      {filhosDe(materiaId, parentId).map((pg) => (
        <div key={pg.id} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 group">
          <button onClick={() => nav && setNav({ ...nav, trilha: [...nav.trilha, pg.id] })} className="flex items-center gap-2 flex-1 text-left min-w-0">
            <span>{pg.icon}</span>
            <span className="text-sm truncate">{pg.titulo}</span>
            <span className="text-[10px] text-zinc-600">{filhosDe(materiaId, pg.id).length > 0 ? `${filhosDe(materiaId, pg.id).length} subpág.` : ''}</span>
          </button>
          <button onClick={() => delPagina(pg.id)} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 text-xs">✕</button>
        </div>
      ))}
      <div className="flex gap-2">
        <input className={inp} placeholder="+ Nova página (ex: Resumo aula 1)" value={novaPagina} onChange={(e) => setNovaPagina(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { const id = criarPagina(materiaId, parentId, novaPagina); setNovaPagina(''); if (nav) setNav({ ...nav, trilha: [...nav.trilha, id] }); } }} />
        <button onClick={() => { const id = criarPagina(materiaId, parentId, novaPagina); setNovaPagina(''); if (nav) setNav({ ...nav, trilha: [...nav.trilha, id] }); }}
          className="px-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold shrink-0">+</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-black mb-1">📚 Estudos</h1>
      <p className="text-sm text-zinc-500 mb-4">Matérias com horário, páginas de resumo estilo Notion e a Bibliotheca Alexandrina.</p>
      <RewardBanner msg={msg} />
      {!nav && (
        <div className="flex gap-2 mb-5">
          {(['materias', 'biblioteca'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${tab === t ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400'}`}>{t === 'materias' ? 'Matérias' : 'Bibliotheca'}</button>
          ))}
        </div>
      )}

      {/* ─── Vista Notion: matéria aberta ─── */}
      {nav && materiaAberta && (
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 flex-wrap text-sm mb-3 text-zinc-500">
            <button onClick={() => setNav(null)} className="hover:text-indigo-300">Matérias</button>
            <span>/</span>
            <button onClick={() => setNav({ ...nav, trilha: [] })} className={nav.trilha.length === 0 ? 'text-zinc-200 font-semibold' : 'hover:text-indigo-300'}>
              {materiaAberta.emoji} {materiaAberta.nome}
            </button>
            {nav.trilha.map((pid, i) => {
              const pg = paginas.find((p) => p.id === pid);
              const ultimo = i === nav.trilha.length - 1;
              return pg ? (
                <span key={pid} className="flex items-center gap-1">
                  <span>/</span>
                  <button onClick={() => setNav({ ...nav, trilha: nav.trilha.slice(0, i + 1) })} className={ultimo ? 'text-zinc-200 font-semibold' : 'hover:text-indigo-300'}>
                    {pg.icon} {pg.titulo}
                  </button>
                </span>
              ) : null;
            })}
          </div>

          {/* Raiz da matéria */}
          {!paginaAtual && (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                {materiaAberta.capa
                  // eslint-disable-next-line @next/next/no-img-element -- capa da matéria é data-URL do navegador
                  ? <div className="relative"><img src={materiaAberta.capa} alt="" className="w-full h-36 object-cover" />
                      <button onClick={() => updMateria(materiaAberta.id, { capa: undefined })} className="absolute top-2 right-2 text-xs bg-black/60 rounded px-1.5 py-0.5">✕ capa</button>
                    </div>
                  : null}
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{materiaAberta.emoji}</span>
                    <div className="flex-1">
                      <div className="font-black text-lg">{materiaAberta.nome}</div>
                      <div className="text-xs text-zinc-500">📅 {materiaAberta.dia} · 🕐 {materiaAberta.horario}{materiaAberta.professor ? ` · 👨‍🏫 ${materiaAberta.professor}` : ''}</div>
                    </div>
                    <label className="text-xs px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer shrink-0">
                      🖼️ {materiaAberta.capa ? 'Trocar capa' : 'Adicionar capa'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => lerImagem(e, 900, (d) => updMateria(materiaAberta.id, { capa: d }))} />
                    </label>
                  </div>
                  <textarea className="w-full mt-3 bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" rows={2}
                    placeholder="Resumo rápido da matéria..." value={materiaAberta.resumo} onChange={(e) => updMateria(materiaAberta.id, { resumo: e.target.value })} />
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">📑 Páginas</div>
                {listaPaginas(materiaAberta.id, null)}
              </div>
            </div>
          )}

          {/* Página aberta */}
          {paginaAtual && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {PAGE_ICONS.map((ic) => (
                      <button key={ic} onClick={() => updPagina(paginaAtual.id, { icon: ic })} className={`w-7 h-7 rounded text-sm ${paginaAtual.icon === ic ? 'bg-indigo-600' : 'bg-zinc-800 hover:bg-zinc-700'}`}>{ic}</button>
                    ))}
                  </div>
                  <button onClick={() => delPagina(paginaAtual.id)} className="ml-auto text-xs text-zinc-600 hover:text-red-400">🗑 Excluir página</button>
                </div>
                <input className="w-full bg-transparent text-xl font-black outline-none border-b border-transparent focus:border-indigo-500 pb-1"
                  value={paginaAtual.titulo} onChange={(e) => updPagina(paginaAtual.id, { titulo: e.target.value })} />
                <textarea className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 min-h-40"
                  placeholder="Escreva seu resumo aqui... (salva sozinho)" value={paginaAtual.conteudo} onChange={(e) => updPagina(paginaAtual.id, { conteudo: e.target.value })} />

                {/* Imagens */}
                {paginaAtual.imagens.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {paginaAtual.imagens.map((img, i) => (
                      <div key={i} className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element -- imagem da página é data-URL do navegador */}
                        <img src={img} alt="" className="w-full h-28 object-cover rounded-lg border border-zinc-700" />
                        <button onClick={() => updPagina(paginaAtual.id, { imagens: paginaAtual.imagens.filter((_x, j) => j !== i) })}
                          className="absolute top-1 right-1 text-xs bg-black/60 rounded px-1 opacity-0 group-hover:opacity-100">✕</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Links / PDFs */}
                {paginaAtual.links.length > 0 && (
                  <div className="space-y-1">
                    {paginaAtual.links.map((lk, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <a href={lk.url} target="_blank" rel="noopener" className="text-indigo-300 hover:underline truncate">🔗 {lk.titulo || lk.url}</a>
                        <button onClick={() => updPagina(paginaAtual.id, { links: paginaAtual.links.filter((_x, j) => j !== i) })} className="text-zinc-600 hover:text-red-400 text-xs ml-auto">✕</button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 flex-wrap items-center pt-1 border-t border-zinc-800">
                  <label className="text-xs px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer">
                    🖼️ Imagem
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => lerImagem(e, 900, (d) => updPagina(paginaAtual.id, { imagens: [...paginaAtual.imagens, d] }))} />
                  </label>
                  <input className="flex-1 min-w-24 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-500" placeholder="Título do link/PDF" value={linkTitulo} onChange={(e) => setLinkTitulo(e.target.value)} />
                  <input className="flex-1 min-w-32 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-500" placeholder="https://..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
                  <button onClick={() => { if (!linkUrl.trim()) return; updPagina(paginaAtual.id, { links: [...paginaAtual.links, { titulo: linkTitulo.trim(), url: linkUrl.trim() }] }); setLinkTitulo(''); setLinkUrl(''); }}
                    className="text-xs px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold">+ Link</button>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">📑 Subpáginas</div>
                {listaPaginas(materiaAberta.id, paginaAtual.id)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Lista de matérias ─── */}
      {!nav && tab === 'materias' && (
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
                  <div key={m.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-indigo-800/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{m.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{m.nome}</div>
                        <div className="text-xs text-zinc-500">🕐 {m.horario}{m.professor ? ` · ${m.professor}` : ''} · 📑 {paginas.filter((p) => p.materiaId === m.id).length} página(s)</div>
                      </div>
                      <button onClick={() => setNav({ materiaId: m.id, trilha: [] })} className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-semibold shrink-0">📂 Abrir</button>
                      <button onClick={() => delMateria(m.id)} className="text-zinc-600 hover:text-red-400 text-xs shrink-0">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {estudos.materias.length === 0 && <p className="text-sm text-zinc-600">Nenhuma matéria ainda.</p>}
        </div>
      )}

      {/* ─── Bibliotheca ─── */}
      {!nav && tab === 'biblioteca' && (
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

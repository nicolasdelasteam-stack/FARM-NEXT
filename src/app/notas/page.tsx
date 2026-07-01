'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uid, today } from '@/lib/engine';

export default function NotasPage() {
  const notas = useStore((s) => s.notas);
  const setNotas = useStore((s) => s.setNotas);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cat, setCat] = useState('Geral');
  const [filtro, setFiltro] = useState('Todas');

  const cats = ['Geral', 'Pessoal', 'Trabalho', 'Ideias'];

  const addNote = () => {
    if (!title.trim()) return;
    setNotas([...notas, { id: uid(), titulo: title.trim(), conteudo: content.trim(), categoria: cat, data: today() }]);
    setTitle(''); setContent('');
  };
  const del = (id: string) => setNotas(notas.filter((n) => n.id !== id));

  const visiveis = filtro === 'Todas' ? notas : notas.filter((n) => n.categoria === filtro);

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-black">📝 Notas</h1>
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm outline-none focus:border-violet-500" placeholder="Título" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm h-20 outline-none focus:border-violet-500" placeholder="Conteúdo..." />
        <div className="flex gap-2">
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm">
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button onClick={addNote} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">Salvar</button>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {['Todas', ...cats].map((c) => (
          <button key={c} onClick={() => setFiltro(c)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium ${filtro === c ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>{c}</button>
        ))}
      </div>

      <div className="space-y-2">
        {visiveis.length === 0 && <p className="text-center text-zinc-500 py-8 text-sm">Nenhuma nota.</p>}
        {[...visiveis].reverse().map((n) => (
          <div key={n.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex justify-between items-start mb-1 gap-2">
              <span className="font-semibold text-sm">{n.titulo}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">{n.categoria}</span>
                <button onClick={() => del(n.id)} className="text-zinc-600 hover:text-red-400 text-xs">✕</button>
              </div>
            </div>
            {n.conteudo && <p className="text-xs text-zinc-400 whitespace-pre-wrap">{n.conteudo}</p>}
            {n.data && <p className="text-[10px] text-zinc-600 mt-1">{new Date(n.data).toLocaleDateString('pt-BR')}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

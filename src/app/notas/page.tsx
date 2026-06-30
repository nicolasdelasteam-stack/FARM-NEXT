'use client';

import { useState } from 'react';

export default function NotasPage() {
  const [notes, setNotes] = useState<{ id: string; title: string; content: string; cat: string }[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cat, setCat] = useState('Geral');

  const addNote = () => {
    if (!title.trim()) return;
    setNotes([...notes, { id: Date.now().toString(), title, content, cat }]);
    setTitle(''); setContent('');
  };

  const cats = ['Geral', 'Pessoal', 'Trabalho', 'Ideias'];

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-black">📝 Notas</h1>
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm" placeholder="Título" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm h-20" placeholder="Conteúdo..." />
        <div className="flex gap-2">
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm">
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button onClick={addNote} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">Salvar</button>
        </div>
      </div>
      <div className="space-y-2">
        {notes.length === 0 && <p className="text-center text-zinc-500 py-8 text-sm">Nenhuma nota.</p>}
        {[...notes].reverse().map((n) => (
          <div key={n.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-sm">{n.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">{n.cat}</span>
            </div>
            <p className="text-xs text-zinc-400 whitespace-pre-wrap">{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

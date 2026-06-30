'use client';

import { useState } from 'react';

export default function MidiaPage() {
  const [items, setItems] = useState<{ id: string; title: string; type: string; score: number; status: string }[]>([]);

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-black">🎬 Mídia</h1>
      <p className="text-sm text-zinc-500">Em breve: filmes, séries e livros com avaliação.</p>
      <div className="p-8 text-center text-zinc-600">
        <div className="text-4xl mb-2">🎥</div>
        <p>Catálogo completo com filtros e notas.</p>
      </div>
    </div>
  );
}

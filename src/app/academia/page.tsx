'use client';

import Link from 'next/link';

export default function AcademiaPage() {
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-black">💪 Academia</h1>
      <p className="text-sm text-zinc-500">O sistema completo de treino agora fica em <b>Treinos</b>: calculadora de macros, rotina por grupo muscular, guia de exercícios e histórico de peso.</p>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/treinos" className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-indigo-600 text-center transition-colors">
          <div className="text-3xl mb-2">🏋️</div>
          <div className="text-sm font-semibold">Ir para Treinos</div>
          <div className="text-xs text-zinc-500">Macros, rotina e progresso</div>
        </Link>
        <Link href="/dieta" className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-indigo-600 text-center transition-colors">
          <div className="text-3xl mb-2">🥗</div>
          <div className="text-sm font-semibold">Ir para Dieta</div>
          <div className="text-xs text-zinc-500">Refeições e progresso de peso</div>
        </Link>
      </div>
    </div>
  );
}

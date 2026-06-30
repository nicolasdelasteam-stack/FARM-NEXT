'use client';

import { useState } from 'react';

export default function AcademiaPage() {
  const [logs, setLogs] = useState<{ name: string; sets: number; reps: number; weight: number }[]>([]);

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-black">💪 Academia</h1>
      <p className="text-sm text-zinc-500">Em breve: CRUD completo de treinos com progressão de carga.</p>
      <div className="p-8 text-center text-zinc-600">
        <div className="text-4xl mb-2">🏋️</div>
        <p>Log de exercícios, progressão e estatísticas em desenvolvimento.</p>
      </div>
    </div>
  );
}

'use client';

import { useStore } from '@/lib/store';
import { today } from '@/lib/engine';
import { useReward, RewardBanner } from '@/components/RewardFeedback';

export default function AguaPage() {
  const agua = useStore((s) => s.agua);
  const setAgua = useStore((s) => s.setAgua);
  const { msg, reward } = useReward();
  const copos = agua.copos || 0;
  const meta = agua.meta || 8;
  const pct = Math.min(100, Math.round((copos / meta) * 100));
  const diasReg = Object.keys(agua.historico || {}).length;

  const addWater = (amount: number) => {
    const novo = copos + amount;
    setAgua({ ...agua, copos: novo, historico: { ...agua.historico, [today()]: { copos: novo, completou: novo >= meta } } });
    // XP só até a meta (sem farm de copos infinitos); bônus ao completar o dia.
    const contam = Math.max(0, Math.min(novo, meta) - Math.min(copos, meta));
    if (copos < meta && novo >= meta) reward('Meta de água batida 💧', contam * 2 + 15, { coins: 5, skill: 'saude' });
    else if (contam > 0) reward('Hidratação', contam * 2, { skill: 'saude' });
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-black mb-4">💧 Água</h1>
      <RewardBanner msg={msg} />
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
          <div className="text-5xl mb-2">💧</div>
          <div className="text-3xl font-black mb-1">{copos} <span className="text-base font-normal text-zinc-500">/ {meta} copos</span></div>
          <div className="mb-4">
            <div className="flex justify-between text-xs text-zinc-500 mb-1"><span>Progresso</span><span>{pct}%</span></div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3].map((n) => (
              <button key={n} onClick={() => addWater(n)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-sm">
                +{n} Copo{n > 1 ? 's' : ''}
              </button>
            ))}
          </div>
          {copos >= meta && <p className="mt-3 text-emerald-400 font-bold">Meta atingida! ✅</p>}
        </div>
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <h3 className="font-bold text-sm mb-3">📊 Estatísticas</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Meta diária</span><span className="font-semibold">{meta} copos</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Dias registrados</span><span className="font-semibold">{diasReg}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

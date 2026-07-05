'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uid } from '@/lib/engine';
import { DEEPWORK_CHECKLIST } from '@/lib/constants';
import { useReward, RewardBanner } from '@/components/RewardFeedback';

export default function DeepWorkPage() {
  const deepwork = useStore((s) => s.deepwork);
  const setDeepwork = useStore((s) => s.setDeepwork);
  const { msg, reward } = useReward();
  const [cafeteria, setCafeteria] = useState(false);
  const [mtexto, setMtexto] = useState('');
  const [mimg, setMimg] = useState('');

  const check = deepwork.checklist || [];
  const toggleCheck = (i: number) => {
    const c = [...(deepwork.checklist || [])]; while (c.length < DEEPWORK_CHECKLIST.length) c.push(false);
    c[i] = !c[i]; setDeepwork({ ...deepwork, checklist: c });
    if (c[i] && c.every(Boolean)) reward('Ritual de foco completo 🚀', 10, { skill: 'gestao' });
  };
  const feitos = check.filter(Boolean).length;

  const addMeta = () => { if (!mtexto.trim() && !mimg.trim()) return; setDeepwork({ ...deepwork, metas: [...(deepwork.metas || []), { id: uid(), texto: mtexto.trim(), img: mimg.trim() }] }); setMtexto(''); setMimg(''); };
  const delMeta = (id: string) => setDeepwork({ ...deepwork, metas: (deepwork.metas || []).filter((m) => m.id !== id) });
  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500';

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-black mb-1">🌑 Deep Work</h1>
      <p className="text-sm text-zinc-500 mb-4">Prepare o foco, entre na cafeteria virtual e visualize seus objetivos.</p>
      <RewardBanner msg={msg} />

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex justify-between items-center mb-3"><div className="text-sm font-bold">✅ Checklist de foco</div><span className="text-xs text-zinc-500">{feitos}/{DEEPWORK_CHECKLIST.length}</span></div>
          <div className="space-y-1">
            {DEEPWORK_CHECKLIST.map((item, i) => (
              <button key={i} onClick={() => toggleCheck(i)} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/60 text-left">
                <span className={`w-4 h-4 rounded border shrink-0 ${check[i] ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`} />
                <span className={`text-sm ${check[i] ? 'line-through text-zinc-600' : ''}`}>{item}</span>
              </button>
            ))}
          </div>
          {feitos === DEEPWORK_CHECKLIST.length && <p className="mt-2 text-emerald-400 text-sm font-bold text-center">Pronto para focar! 🚀</p>}
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col">
          <div className="text-sm font-bold mb-2">☕ Cafeteria Virtual</div>
          <p className="text-xs text-zinc-500 mb-3">Ambiente de café com lofi e ruídos (conversas, máquina de café, gelo no copo…). Ajuste o volume de cada som dentro do próprio player.</p>
          <button onClick={() => setCafeteria(!cafeteria)} className={`mt-auto w-full py-2 rounded-lg text-sm font-semibold ${cafeteria ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
            {cafeteria ? 'Fechar cafeteria' : '▶ Abrir cafeteria virtual'}
          </button>
        </div>
      </div>

      {cafeteria && (
        <div className="mt-4 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
          {/* O mesmo widget embutido no Notion (Deep Work → flocus.com/virtual-cafe) */}
          <iframe src="https://flocus.com/virtual-cafe/" title="Cafeteria Virtual — Flocus" className="w-full h-[28rem] border-0" allow="autoplay" />
        </div>
      )}

      <div className="mt-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="text-sm font-bold mb-3">🎯 Visualização — seus objetivos</div>
        <div className="flex gap-2 mb-3">
          <input className={inp} placeholder="Objetivo / frase motivadora" value={mtexto} onChange={(e) => setMtexto(e.target.value)} />
          <input className={inp} placeholder="URL de imagem (opcional)" value={mimg} onChange={(e) => setMimg(e.target.value)} />
          <button onClick={addMeta} className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold shrink-0">+</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(deepwork.metas || []).map((m) => (
            <div key={m.id} className="relative rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 min-h-24">
              {/* eslint-disable-next-line @next/next/no-img-element -- imagem do mural é data-URL/URL livre; next/Image não se aplica */}
              {m.img && <img src={m.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
              <div className="relative p-3 flex items-end min-h-24">
                <span className="text-sm font-semibold drop-shadow">{m.texto}</span>
                <button onClick={() => delMeta(m.id)} className="absolute top-1 right-1 text-xs bg-black/50 rounded px-1">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

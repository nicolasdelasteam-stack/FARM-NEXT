'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { uid } from '@/lib/engine';
import { AMBIENT_TRACKS, DEEPWORK_CHECKLIST } from '@/lib/constants';
import { ambientToggle, ambientVolume, ambientPauseAll } from '@/lib/sound';
import { useReward, RewardBanner } from '@/components/RewardFeedback';

export default function DeepWorkPage() {
  const deepwork = useStore((s) => s.deepwork);
  const setDeepwork = useStore((s) => s.setDeepwork);
  const { msg, reward } = useReward();
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [erro, setErro] = useState<Record<string, boolean>>({});
  const [vol, setVol] = useState<Record<string, number>>(() => Object.fromEntries(AMBIENT_TRACKS.map((s) => [s.id, 0.6])));
  const [mtexto, setMtexto] = useState('');
  const [mimg, setMimg] = useState('');

  // Pausa tudo ao sair da página.
  useEffect(() => () => ambientPauseAll(), []);

  const check = deepwork.checklist || [];
  const toggleCheck = (i: number) => {
    const c = [...(deepwork.checklist || [])]; while (c.length < DEEPWORK_CHECKLIST.length) c.push(false);
    c[i] = !c[i]; setDeepwork({ ...deepwork, checklist: c });
    if (c[i] && c.every(Boolean)) reward('Ritual de foco completo 🚀', 10, { skill: 'gestao' });
  };
  const feitos = check.filter(Boolean).length;

  // Sons ambiente reais (arquivos locais em public/sounds) tocados em loop.
  const toggleSound = (snd: { id: string; src: string }) => {
    const tocando = ambientToggle(snd.id, snd.src, vol[snd.id] ?? 0.6, () => {
      setErro((er) => ({ ...er, [snd.id]: true }));
      setActive((s) => ({ ...s, [snd.id]: false }));
    });
    setActive({ ...active, [snd.id]: tocando });
  };
  const setVolume = (id: string, v: number) => { setVol({ ...vol, [id]: v }); ambientVolume(id, v); };

  const addMeta = () => { if (!mtexto.trim() && !mimg.trim()) return; setDeepwork({ ...deepwork, metas: [...(deepwork.metas || []), { id: uid(), texto: mtexto.trim(), img: mimg.trim() }] }); setMtexto(''); setMimg(''); };
  const delMeta = (id: string) => setDeepwork({ ...deepwork, metas: (deepwork.metas || []).filter((m) => m.id !== id) });
  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500';

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-black mb-1">🌑 Deep Work</h1>
      <p className="text-sm text-zinc-500 mb-4">Prepare o foco, ligue os sons e visualize seus objetivos.</p>
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

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="text-sm font-bold mb-3">🎧 Sons ambiente</div>
          <div className="space-y-2">
            {AMBIENT_TRACKS.map((snd) => (
              <div key={snd.id} className="flex items-center gap-2">
                <button onClick={() => toggleSound(snd)} disabled={erro[snd.id]}
                  className={`px-2 py-1.5 rounded-lg text-sm w-32 text-left ${erro[snd.id] ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed' : active[snd.id] ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                  {erro[snd.id] ? '⚠' : active[snd.id] ? '⏸' : '▶'} {snd.label}
                </button>
                <input type="range" min={0} max={1} step={0.05} value={vol[snd.id] ?? 0.6} onChange={(e) => setVolume(snd.id, parseFloat(e.target.value))} className="flex-1 accent-indigo-500" />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-zinc-600 mt-2">Gravações reais em loop (Wikimedia Commons). Misture e ajuste o volume de cada uma.</p>
        </div>
      </div>

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

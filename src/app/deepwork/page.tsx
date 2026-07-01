'use client';

import { useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { uid } from '@/lib/engine';
import { AMBIENT_SOUNDS, DEEPWORK_CHECKLIST } from '@/lib/constants';

export default function DeepWorkPage() {
  const deepwork = useStore((s) => s.deepwork);
  const setDeepwork = useStore((s) => s.setDeepwork);
  const acRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, { src: AudioBufferSourceNode; gain: GainNode }>>({});
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [vol, setVol] = useState<Record<string, number>>(() => Object.fromEntries(AMBIENT_SOUNDS.map((s) => [s.id, 0.4])));
  const [mtexto, setMtexto] = useState('');
  const [mimg, setMimg] = useState('');

  const check = deepwork.checklist || [];
  const toggleCheck = (i: number) => { const c = [...(deepwork.checklist || [])]; while (c.length < DEEPWORK_CHECKLIST.length) c.push(false); c[i] = !c[i]; setDeepwork({ ...deepwork, checklist: c }); };
  const feitos = check.filter(Boolean).length;

  const ensureAC = () => {
    if (!acRef.current) { const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext; acRef.current = new AC(); }
    return acRef.current;
  };
  const makeNoise = (ac: AudioContext) => {
    const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = ac.createBufferSource(); s.buffer = buf; s.loop = true; return s;
  };
  const toggleSound = (snd: { id: string; type: string; freq: number }) => {
    const ac = ensureAC(); if (ac.state === 'suspended') ac.resume();
    if (active[snd.id]) { try { nodesRef.current[snd.id]?.src.stop(); } catch {} delete nodesRef.current[snd.id]; setActive({ ...active, [snd.id]: false }); return; }
    const src = makeNoise(ac);
    const filter = ac.createBiquadFilter(); filter.type = snd.type as BiquadFilterType; filter.frequency.value = snd.freq;
    const gain = ac.createGain(); gain.gain.value = vol[snd.id] ?? 0.4;
    src.connect(filter); filter.connect(gain); gain.connect(ac.destination); src.start();
    nodesRef.current[snd.id] = { src, gain }; setActive({ ...active, [snd.id]: true });
  };
  const setVolume = (id: string, v: number) => { setVol({ ...vol, [id]: v }); const n = nodesRef.current[id]; if (n) n.gain.gain.value = v; };

  const addMeta = () => { if (!mtexto.trim() && !mimg.trim()) return; setDeepwork({ ...deepwork, metas: [...(deepwork.metas || []), { id: uid(), texto: mtexto.trim(), img: mimg.trim() }] }); setMtexto(''); setMimg(''); };
  const delMeta = (id: string) => setDeepwork({ ...deepwork, metas: (deepwork.metas || []).filter((m) => m.id !== id) });
  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500';

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-black mb-1">🌑 Deep Work</h1>
      <p className="text-sm text-zinc-500 mb-4">Prepare o foco, ligue os sons e visualize seus objetivos.</p>

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
            {AMBIENT_SOUNDS.map((snd) => (
              <div key={snd.id} className="flex items-center gap-2">
                <button onClick={() => toggleSound(snd)} className={`px-2 py-1.5 rounded-lg text-sm w-32 text-left ${active[snd.id] ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}>{active[snd.id] ? '⏸' : '▶'} {snd.label}</button>
                <input type="range" min={0} max={1} step={0.05} value={vol[snd.id] ?? 0.4} onChange={(e) => setVolume(snd.id, parseFloat(e.target.value))} className="flex-1 accent-violet-500" />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-zinc-600 mt-2">Sons gerados no navegador (Web Audio). Misture e ajuste o volume de cada um.</p>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="text-sm font-bold mb-3">🎯 Visualização — seus objetivos</div>
        <div className="flex gap-2 mb-3">
          <input className={inp} placeholder="Objetivo / frase motivadora" value={mtexto} onChange={(e) => setMtexto(e.target.value)} />
          <input className={inp} placeholder="URL de imagem (opcional)" value={mimg} onChange={(e) => setMimg(e.target.value)} />
          <button onClick={addMeta} className="px-4 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold shrink-0">+</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(deepwork.metas || []).map((m) => (
            <div key={m.id} className="relative rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 min-h-24">
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

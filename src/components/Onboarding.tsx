'use client';

import { useState, useSyncExternalStore } from 'react';
import { useStore } from '@/lib/store';
import { createMission } from '@/lib/engine';
import { play } from '@/lib/sound';
import type { Difficulty } from '@/lib/types';

const AVATARES = ['😺', '🦊', '🐺', '🦁', '🐉', '🦅', '⚔️', '🥷', '🧙', '👑', '😎', '🤖'];
const OBJETIVOS = ['Ficar em forma 💪', 'Mandar bem nos estudos 📚', 'Organizar a vida 🗂️', 'Guardar dinheiro 💰', 'Disciplina total 🔥'];
const SUGESTOES: { titulo: string; dif: Difficulty; skill?: string; on: boolean }[] = [
  { titulo: '🛏️ Arrumar a cama', dif: 'facil', skill: 'gestao', on: true },
  { titulo: '💪 Treinar ou se mover 20 min', dif: 'media', skill: 'saude', on: true },
  { titulo: '📚 Estudar 30 minutos', dif: 'media', skill: 'estudos', on: true },
  { titulo: '📖 Ler 10 páginas', dif: 'facil', skill: 'estudos', on: false },
  { titulo: '🗒️ Planejar o dia em 5 min', dif: 'facil', skill: 'gestao', on: false },
];

// Onboarding de 30 segundos (lição do Finch/Duolingo: chegar à primeira
// recompensa rápido). 3 passos: quem é você → objetivo → diárias prontas.
export default function Onboarding() {
  const player = useStore((s) => s.player);
  const setPlayer = useStore((s) => s.setPlayer);
  const addMission = useStore((s) => s.addMission);
  // Espera a reidratação do persist para não piscar o modal em quem já joga.
  const ready = useSyncExternalStore(
    (cb) => useStore.persist.onFinishHydration(cb),
    () => useStore.persist.hasHydrated(),
    () => false,
  );
  const [passo, setPasso] = useState(0);
  const [nome, setNome] = useState('');
  const [avatar, setAvatar] = useState('😺');
  const [objetivo, setObjetivo] = useState('');
  const [marcadas, setMarcadas] = useState<boolean[]>(SUGESTOES.map((s) => s.on));

  if (!ready || player.onboardingDone) return null;

  const concluir = () => {
    play('levelup');
    SUGESTOES.forEach((s, i) => {
      if (marcadas[i]) addMission(createMission({ title: s.titulo, difficulty: s.dif, type: 'daily', skill: s.skill }));
    });
    setPlayer({
      ...player,
      name: nome.trim() || player.name,
      avatar,
      objetivoPrincipal: objetivo || undefined,
      onboardingDone: true,
    });
  };

  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500';
  const btn = 'w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold text-sm';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-indigo-800/60 bg-[#0b0a1a] p-6 shadow-[0_0_60px_rgba(99,102,241,0.3)]">
        <div className="text-[10px] tracking-[0.3em] text-indigo-400 uppercase mb-1 text-center">⚠ O Sistema te escolheu</div>
        <div className="flex justify-center gap-1.5 my-3">
          {[0, 1, 2].map((i) => <div key={i} className={`h-1 w-10 rounded-full ${i <= passo ? 'bg-indigo-500' : 'bg-zinc-800'}`} />)}
        </div>

        {passo === 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-black text-center">Quem é você, jogador?</h2>
            <input className={inp} autoFocus placeholder="Seu nome ou apelido" value={nome} onChange={(e) => setNome(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setPasso(1)} />
            <div className="grid grid-cols-6 gap-1.5">
              {AVATARES.map((a) => (
                <button key={a} onClick={() => setAvatar(a)} className={`h-11 rounded-lg text-2xl ${avatar === a ? 'bg-indigo-600 ring-2 ring-indigo-400' : 'bg-zinc-800 hover:bg-zinc-700'}`}>{a}</button>
              ))}
            </div>
            <button className={btn} onClick={() => setPasso(1)}>Continuar →</button>
          </div>
        )}

        {passo === 1 && (
          <div className="space-y-3">
            <h2 className="text-xl font-black text-center">Qual é a sua missão principal?</h2>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {OBJETIVOS.map((o) => (
                <button key={o} onClick={() => setObjetivo(o)} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${objetivo === o ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>{o}</button>
              ))}
            </div>
            <input className={inp} placeholder="…ou escreva a sua" value={OBJETIVOS.includes(objetivo) ? '' : objetivo} onChange={(e) => setObjetivo(e.target.value)} />
            <button className={btn} onClick={() => setPasso(2)}>Continuar →</button>
          </div>
        )}

        {passo === 2 && (
          <div className="space-y-3">
            <h2 className="text-xl font-black text-center">Suas primeiras diárias</h2>
            <p className="text-xs text-zinc-500 text-center">Complete 1 hoje e acenda sua ofensiva 🔥 (dá para editar tudo no Campo depois)</p>
            <div className="space-y-1.5">
              {SUGESTOES.map((s, i) => (
                <button key={s.titulo} onClick={() => setMarcadas(marcadas.map((v, j) => j === i ? !v : v))}
                  className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-indigo-700 text-left">
                  <span className={`w-4 h-4 rounded border shrink-0 ${marcadas[i] ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600'}`} />
                  <span className="text-sm flex-1">{s.titulo}</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">+{s.dif === 'facil' ? 20 : 40} XP</span>
                </button>
              ))}
            </div>
            <button className={btn} onClick={concluir}>⚔️ Começar a aventura</button>
          </div>
        )}
      </div>
    </div>
  );
}

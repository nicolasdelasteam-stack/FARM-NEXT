'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { play } from '@/lib/sound';

type Evento = { titulo: string; sub: string; icon: string };

// Celebração global (o "juice" que faz o jogo ser gostoso, à la Duolingo):
// observa o store e dispara confete + janela do Sistema ao subir de nível,
// derrotar o boss automático ou garantir a ofensiva do dia.
export default function Celebration() {
  const [evento, setEvento] = useState<Evento | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
    const unsub = useStore.subscribe((state, prev) => {
      // Ignora as mudanças da reidratação do persist logo após o load.
      if (Date.now() - mountedAt.current < 1500) return;
      const p = state.player, q = prev.player;
      if (p.level > q.level) {
        play('levelup');
        setEvento({ icon: '⬆️', titulo: `NÍVEL ${p.level}`, sub: `Novo título: ${p.title}` });
      } else if ((p.bossDefeated || 0) > (q.bossDefeated || 0)) {
        play('boss');
        setEvento({ icon: '⚔️', titulo: 'BOSS DERROTADO', sub: '+50 moedas de bônus' });
      } else if (p.metaBatidaHoje && !q.metaBatidaHoje) {
        play('streak');
        setEvento({ icon: '🔥', titulo: `OFENSIVA: ${p.streak} ${p.streak === 1 ? 'DIA' : 'DIAS'}`, sub: 'Meta diária batida — dia garantido!' });
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!evento) return;
    const timer = setTimeout(() => setEvento(null), 2600);

    // Confete em canvas, sem dependências.
    const canvas = canvasRef.current;
    let raf = 0;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cores = ['#818cf8', '#6366f1', '#3b82f6', '#fbbf24', '#f4f4f5', '#22d3ee'];
      const parts = Array.from({ length: 140 }, () => ({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2 - 40,
        vx: (Math.random() - 0.5) * 14,
        vy: -6 - Math.random() * 9,
        w: 5 + Math.random() * 6,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        cor: cores[Math.floor(Math.random() * cores.length)],
      }));
      const t0 = performance.now();
      const tick = (t: number) => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const pt of parts) {
          pt.x += pt.vx; pt.vy += 0.32; pt.y += pt.vy; pt.rot += pt.vr;
          ctx.save(); ctx.translate(pt.x, pt.y); ctx.rotate(pt.rot);
          ctx.fillStyle = pt.cor; ctx.fillRect(-pt.w / 2, -pt.w / 2, pt.w, pt.w * 0.6);
          ctx.restore();
        }
        if (t - t0 < 2300) raf = requestAnimationFrame(tick);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
      };
      raf = requestAnimationFrame(tick);
    }
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [evento]);

  if (!evento) return null;
  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="animate-zenite-pop animate-zenite-fade-out relative px-8 py-6 rounded-2xl border border-indigo-500/60 bg-[#0b0a1a]/95 text-center shadow-[0_0_60px_rgba(99,102,241,0.45)]">
        <div className="text-[10px] tracking-[0.3em] text-indigo-400 uppercase mb-1">⚠ Sistema</div>
        <div className="text-4xl mb-1">{evento.icon}</div>
        <div className="text-2xl font-black bg-gradient-to-r from-indigo-300 via-blue-300 to-indigo-200 bg-clip-text text-transparent">{evento.titulo}</div>
        <div className="text-sm text-zinc-400 mt-1">{evento.sub}</div>
      </div>
    </div>
  );
}

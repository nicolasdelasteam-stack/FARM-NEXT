'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { play } from '@/lib/sound';
import type { BossDefeatInfo } from '@/lib/types';

type Popup = { titulo: string; sub: string; icon: string };

const isImg = (s: string) => s.startsWith('data:') || s.startsWith('http');

// Gera um card PNG de "boss derrotado" e abre o compartilhamento nativo (ou baixa).
async function shareBossCard(info: BossDefeatInfo) {
  const { player } = useStore.getState();
  const c = document.createElement('canvas');
  c.width = 1080; c.height = 1080;
  const ctx = c.getContext('2d');
  if (!ctx) return;

  const bg = ctx.createLinearGradient(0, 0, 0, 1080);
  bg.addColorStop(0, '#1a0b12'); bg.addColorStop(1, '#08070f');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1080);
  const glow = ctx.createRadialGradient(540, 430, 60, 540, 430, 640);
  glow.addColorStop(0, 'rgba(239,68,68,0.30)'); glow.addColorStop(1, 'rgba(239,68,68,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, 1080, 1080);
  ctx.strokeStyle = 'rgba(251,191,36,0.6)'; ctx.lineWidth = 5; ctx.strokeRect(34, 34, 1012, 1012);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fca5a5'; ctx.font = '600 30px system-ui';
  ctx.fillText('⚔ B O S S   D E R R O T A D O ⚔', 540, 130);

  const grad = ctx.createLinearGradient(300, 0, 780, 0);
  grad.addColorStop(0, '#fbbf24'); grad.addColorStop(1, '#f87171');
  ctx.fillStyle = grad; ctx.font = '900 72px system-ui';
  ctx.fillText('VITÓRIA!', 540, 230);

  // Ícone do boss (imagem enviada ou emoji)
  if (isImg(info.icon)) {
    try {
      const img = new Image();
      await new Promise<void>((ok, err) => { img.onload = () => ok(); img.onerror = err; img.src = info.icon; });
      ctx.save(); ctx.beginPath(); ctx.arc(540, 430, 130, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(img, 410, 300, 260, 260); ctx.restore();
      ctx.beginPath(); ctx.arc(540, 430, 130, 0, Math.PI * 2); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 6; ctx.stroke();
    } catch { ctx.font = '190px system-ui'; ctx.fillText('👹', 540, 500); }
  } else {
    ctx.font = '190px system-ui'; ctx.fillText(info.icon || '👹', 540, 500);
  }
  // "X" de derrotado
  ctx.strokeStyle = 'rgba(239,68,68,0.85)'; ctx.lineWidth = 14; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(450, 340); ctx.lineTo(630, 520); ctx.moveTo(630, 340); ctx.lineTo(450, 520); ctx.stroke();

  ctx.fillStyle = '#f4f4f5'; ctx.font = '900 58px system-ui';
  ctx.fillText(info.nome, 540, 640);

  // Chips de recompensa
  const chips = [`🪙 +${info.coins}`, `⭐ +${info.xp} XP`, ...(info.recompensa ? [`🎁 ${info.recompensa}`] : [])];
  ctx.font = '600 40px system-ui';
  const gap = 40;
  const widths = chips.map((t) => ctx.measureText(t).width + 60);
  const totalW = widths.reduce((a, b) => a + b, 0) + gap * (chips.length - 1);
  let x = 540 - totalW / 2;
  chips.forEach((t, i) => {
    const w = widths[i];
    ctx.fillStyle = 'rgba(251,191,36,0.14)';
    ctx.beginPath(); ctx.roundRect(x, 710, w, 80, 20); ctx.fill();
    ctx.strokeStyle = 'rgba(251,191,36,0.5)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#fde68a'; ctx.fillText(t, x + w / 2, 763);
    x += w + gap;
  });

  ctx.fillStyle = '#a5b4fc'; ctx.font = '600 34px system-ui';
  ctx.fillText(`${player.name} · Nível ${player.level}`, 540, 900);
  ctx.fillStyle = '#71717a'; ctx.font = '500 30px system-ui';
  ctx.fillText('Derrotando os chefes da vida real ⚡ ZÊNITE', 540, 980);

  const blob: Blob | null = await new Promise((ok) => c.toBlob((b) => ok(b), 'image/png'));
  if (!blob) return;
  const file = new File([blob], 'zenite-boss.png', { type: 'image/png' });
  const texto = `Derrotei "${info.nome}" no ZÊNITE! ⚔️🔥`;
  try {
    if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], text: texto }); return; }
  } catch { /* usuário cancelou */ }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'zenite-boss.png'; a.click();
  URL.revokeObjectURL(url);
}

// Celebração global (o "juice" do jogo): confete + banner ao subir de nível,
// garantir a ofensiva e — com destaque — ao derrotar um boss (nomeando-o).
export default function Celebration() {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [bossCele, setBossCele] = useState<BossDefeatInfo | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
    const unsub = useStore.subscribe((state, prev) => {
      if (Date.now() - mountedAt.current < 1500) return; // ignora a reidratação
      // Boss derrotado (auto ou manual) → animação dedicada, nomeando o chefe.
      if (state.lastBossDefeat && state.lastBossDefeat !== prev.lastBossDefeat) {
        const info = state.lastBossDefeat;
        play('boss');
        setBossCele(info);
        useStore.getState().setLastBossDefeat(null); // consome (não repete no reload)
        return;
      }
      const p = state.player, q = prev.player;
      if (p.level > q.level) {
        play('levelup');
        setPopup({ icon: '⬆️', titulo: `NÍVEL ${p.level}`, sub: `Novo título: ${p.title}` });
      } else if (p.metaBatidaHoje && !q.metaBatidaHoje) {
        play('streak');
        setPopup({ icon: '🔥', titulo: `OFENSIVA: ${p.streak} ${p.streak === 1 ? 'DIA' : 'DIAS'}`, sub: 'Meta diária batida — dia garantido!' });
      }
    });
    return unsub;
  }, []);

  // Confete (compartilhado por popup e boss) — dura mais na celebração de boss.
  useEffect(() => {
    if (!popup && !bossCele) return;
    const isBoss = !!bossCele;
    const dur = isBoss ? 4200 : 2600;
    const timer = setTimeout(() => { setPopup(null); setBossCele(null); }, dur);

    const canvas = canvasRef.current;
    let raf = 0;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cores = isBoss
        ? ['#fbbf24', '#f87171', '#ef4444', '#fde68a', '#f4f4f5', '#fb923c']
        : ['#818cf8', '#6366f1', '#3b82f6', '#fbbf24', '#f4f4f5', '#22d3ee'];
      const n = isBoss ? 220 : 140;
      const parts = Array.from({ length: n }, () => ({
        x: canvas.width / 2 + (Math.random() - 0.5) * 260,
        y: canvas.height / 2 - 40,
        vx: (Math.random() - 0.5) * 16,
        vy: -6 - Math.random() * 11,
        w: 5 + Math.random() * 7,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        cor: cores[Math.floor(Math.random() * cores.length)],
      }));
      const t0 = performance.now();
      const frame = (t: number) => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const pt of parts) {
          pt.x += pt.vx; pt.vy += 0.32; pt.y += pt.vy; pt.rot += pt.vr;
          ctx.save(); ctx.translate(pt.x, pt.y); ctx.rotate(pt.rot);
          ctx.fillStyle = pt.cor; ctx.fillRect(-pt.w / 2, -pt.w / 2, pt.w, pt.w * 0.6);
          ctx.restore();
        }
        if (t - t0 < dur - 300) raf = requestAnimationFrame(frame);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
      };
      raf = requestAnimationFrame(frame);
    }
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [popup, bossCele]);

  if (!popup && !bossCele) return null;

  // ─── Celebração de BOSS (destaque, tela cheia, compartilhável) ───
  if (bossCele) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer" onClick={() => setBossCele(null)}>
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
        <div className="animate-zenite-pop relative w-[min(92vw,26rem)] px-7 py-7 rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-[#1a0b12] to-[#0b0a12] text-center shadow-[0_0_80px_rgba(239,68,68,0.4)]" onClick={(e) => e.stopPropagation()}>
          <div className="text-[11px] tracking-[0.35em] text-red-400 uppercase mb-2">⚔ Boss Derrotado ⚔</div>
          <div className="relative inline-block my-1">
            {isImg(bossCele.icon)
              // eslint-disable-next-line @next/next/no-img-element -- ícone do boss é data-URL/URL livre
              ? <img src={bossCele.icon} alt="" className="w-24 h-24 object-cover rounded-2xl mx-auto grayscale-[0.3]" />
              : <div className="text-7xl leading-none animate-bounce">{bossCele.icon}</div>}
            <span className="absolute inset-0 flex items-center justify-center text-6xl text-red-500/80 font-black select-none">✗</span>
          </div>
          <div className="text-3xl font-black mt-2 bg-gradient-to-r from-amber-300 via-orange-300 to-red-400 bg-clip-text text-transparent">VITÓRIA!</div>
          <div className="text-lg font-bold text-zinc-100 mt-1">{bossCele.nome}</div>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {bossCele.coins > 0 && <span className="px-3 py-1 rounded-lg bg-yellow-900/40 border border-yellow-700/50 text-yellow-300 text-sm font-bold">🪙 +{bossCele.coins}</span>}
            {bossCele.xp > 0 && <span className="px-3 py-1 rounded-lg bg-indigo-900/40 border border-indigo-700/50 text-indigo-200 text-sm font-bold">⭐ +{bossCele.xp} XP</span>}
            {bossCele.recompensa && <span className="px-3 py-1 rounded-lg bg-pink-900/30 border border-pink-700/40 text-pink-200 text-sm font-bold">🎁 {bossCele.recompensa}</span>}
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => shareBossCard(bossCele)} className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 hover:brightness-110 text-sm font-bold text-black">📸 Compartilhar vitória</button>
            <button onClick={() => setBossCele(null)} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold">Fechar</button>
          </div>
          {bossCele.recompensa && <p className="text-[11px] text-zinc-500 mt-2">🎁 no inventário — use em Eventos → Inventário</p>}
        </div>
      </div>
    );
  }

  // ─── Popup pequeno (nível / ofensiva) ───
  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="animate-zenite-pop animate-zenite-fade-out relative px-8 py-6 rounded-2xl border border-indigo-500/60 bg-[#0b0a1a]/95 text-center shadow-[0_0_60px_rgba(99,102,241,0.45)]">
        <div className="text-[10px] tracking-[0.3em] text-indigo-400 uppercase mb-1">⚠ Sistema</div>
        <div className="text-4xl mb-1">{popup!.icon}</div>
        <div className="text-2xl font-black bg-gradient-to-r from-indigo-300 via-blue-300 to-indigo-200 bg-clip-text text-transparent">{popup!.titulo}</div>
        <div className="text-sm text-zinc-400 mt-1">{popup!.sub}</div>
      </div>
    </div>
  );
}

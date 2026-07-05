'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';

// Card de progresso compartilhável (o motor viral do Duolingo: a ofensiva vira
// uma imagem bonita de postar). Gera um PNG 1080×1080 no tema Solo Leveling e
// abre o compartilhamento nativo; sem suporte, baixa o arquivo.
async function desenharCard(): Promise<Blob | null> {
  const { player } = useStore.getState();
  const c = document.createElement('canvas');
  c.width = 1080; c.height = 1080;
  const ctx = c.getContext('2d');
  if (!ctx) return null;

  // Fundo noite + brilho do Sistema
  const bg = ctx.createLinearGradient(0, 0, 0, 1080);
  bg.addColorStop(0, '#0b0a1a'); bg.addColorStop(1, '#07070f');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1080);
  const glow = ctx.createRadialGradient(540, 340, 60, 540, 340, 620);
  glow.addColorStop(0, 'rgba(99,102,241,0.32)'); glow.addColorStop(1, 'rgba(99,102,241,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, 1080, 1080);
  ctx.strokeStyle = 'rgba(99,102,241,0.55)'; ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, 1008, 1008);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#818cf8';
  ctx.font = '600 30px system-ui';
  ctx.fillText('⚠ S I S T E M A', 540, 118);

  const logo = ctx.createLinearGradient(380, 0, 700, 0);
  logo.addColorStop(0, '#818cf8'); logo.addColorStop(0.5, '#60a5fa'); logo.addColorStop(1, '#a5b4fc');
  ctx.fillStyle = logo;
  ctx.font = '900 84px system-ui';
  ctx.fillText('ZÊNITE', 540, 210);

  // Avatar (foto circular ou emoji)
  if (player.photo) {
    try {
      const img = new Image();
      await new Promise<void>((ok, err) => { img.onload = () => ok(); img.onerror = err; img.src = player.photo!; });
      ctx.save(); ctx.beginPath(); ctx.arc(540, 400, 110, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(img, 430, 290, 220, 220); ctx.restore();
      ctx.beginPath(); ctx.arc(540, 400, 110, 0, Math.PI * 2);
      ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 6; ctx.stroke();
    } catch { /* sem foto, cai no emoji */ }
  } else {
    ctx.font = '160px system-ui';
    ctx.fillText(player.avatar || '😺', 540, 455);
  }

  ctx.fillStyle = '#f4f4f5';
  ctx.font = '900 56px system-ui';
  ctx.fillText(player.name, 540, 590);
  ctx.fillStyle = '#a5b4fc';
  ctx.font = '600 40px system-ui';
  ctx.fillText(`Nível ${player.level} — ${player.title}`, 540, 650);

  // Stats em linha
  const stats: [string, string, string][] = [
    ['🔥', `${Math.max(player.streak || 0, 0)}`, 'ofensiva'],
    ['⚔️', `${player.bossDefeated || 0}`, 'bosses'],
    ['✅', `${player.totalMissionsDone || 0}`, 'missões'],
    ['🪙', `${player.coins}`, 'moedas'],
  ];
  stats.forEach(([icon, valor, label], i) => {
    const x = 190 + i * 235;
    ctx.fillStyle = 'rgba(99,102,241,0.12)';
    ctx.beginPath();
    ctx.roundRect(x - 95, 710, 190, 180, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(99,102,241,0.4)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = '52px system-ui'; ctx.fillStyle = '#f4f4f5';
    ctx.fillText(icon, x, 778);
    ctx.font = '900 52px system-ui';
    ctx.fillText(valor, x, 840);
    ctx.font = '500 24px system-ui'; ctx.fillStyle = '#71717a';
    ctx.fillText(label, x, 874);
  });

  ctx.fillStyle = '#71717a';
  ctx.font = '500 30px system-ui';
  ctx.fillText('Suba de nível na vida real ⚡ ZÊNITE', 540, 990);

  return new Promise((ok) => c.toBlob((b) => ok(b), 'image/png'));
}

export default function ShareProgressButton() {
  const [busy, setBusy] = useState(false);

  const compartilhar = async () => {
    setBusy(true);
    try {
      const blob = await desenharCard();
      if (!blob) return;
      const file = new File([blob], 'zenite-progresso.png', { type: 'image/png' });
      const { player } = useStore.getState();
      const texto = `Nível ${player.level} e ofensiva de ${player.streak} dia(s) no ZÊNITE ⚡🔥`;
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: texto });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'zenite-progresso.png'; a.click();
        URL.revokeObjectURL(url);
      }
    } catch { /* usuário cancelou o share */ }
    setBusy(false);
  };

  return (
    <button onClick={compartilhar} disabled={busy}
      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-indigo-800/60 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-50">
      {busy ? 'Gerando…' : '📸 Compartilhar progresso'}
    </button>
  );
}

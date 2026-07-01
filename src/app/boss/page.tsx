'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { uid, today, addCoins, addXP, refreshBosses, applyBossPenalties } from '@/lib/engine';
import { BOSS_DIFICULDADE, BOSS_PERIODO, REWARD_ITEMS } from '@/lib/constants';
import type { Boss } from '@/lib/types';

const isImg = (s: string) => s.startsWith('data:') || s.startsWith('http');

function BossIcon({ icon, className, imgClass }: { icon: string; className?: string; imgClass?: string }) {
  if (isImg(icon)) {
    // eslint-disable-next-line @next/next/no-img-element -- ícone do boss pode ser data-URL/gif enviado pelo usuário
    return <img src={icon} alt="" className={(imgClass || 'w-9 h-9') + ' object-cover rounded-lg'} />;
  }
  return <span className={className}>{icon}</span>;
}

export default function BossPage() {
  const boss = useStore((s) => s.boss);
  const setBoss = useStore((s) => s.setBoss);
  const player = useStore((s) => s.player);
  const setPlayer = useStore((s) => s.setPlayer);
  const settings = useStore((s) => s.settings);
  const eventos = useStore((s) => s.eventos);
  const setEventos = useStore((s) => s.setEventos);

  const [tab, setTab] = useState<'ativos' | 'bestiario'>('ativos');
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [itemId, setItemId] = useState('custom');
  const [f, setF] = useState<Omit<Boss, 'id' | 'derrotado' | 'data'>>({
    nome: '', icon: '👿', lore: '', dificuldade: 'media', periodo: 'semanal',
    comoVencer: '', requisito: '', penalidade: '', recompensa: '', recompensaCoins: 80, recompensaXp: 150, condicao: '', prazo: '',
  });

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 4000); };
  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500';
  const EMO = ['👿', '🌀', '🌑', '📱', '🔥', '🛋️', '🍩', '💀', '🐉', '👹', '🧟', '⚰️', '👺', '🦑', '🕷️', '🐍', '🦂', '🩸'];

  // Reset de recorrentes + penalidade por prazo vencido (roda no mount).
  useEffect(() => {
    const r = refreshBosses(boss.bosses);
    const pen = applyBossPenalties(player, r.bosses, settings);
    if (r.changed || pen.changed) {
      setBoss({ ...boss, bosses: pen.bosses });
      if (pen.changed) setPlayer(pen.player);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onImg = (file?: File) => {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { flash('Imagem muito grande (máx 3MB).'); return; }
    const reader = new FileReader();
    if (file.type === 'image/gif') {
      reader.onload = () => setF((prev) => ({ ...prev, icon: reader.result as string }));
      reader.readAsDataURL(file);
      return;
    }
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = 128; c.height = 128;
        const ctx = c.getContext('2d');
        if (ctx) { ctx.drawImage(img, 0, 0, 128, 128); setF((prev) => ({ ...prev, icon: c.toDataURL('image/jpeg', 0.85) })); }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const derrotar = (id: string) => {
    const b = boss.bosses.find((x) => x.id === id);
    if (!b || b.derrotado) return;
    let p = player;
    if (b.recompensaCoins > 0) p = addCoins(p, b.recompensaCoins);
    if (b.recompensaXp > 0) p = addXP(p, b.recompensaXp, settings);
    p = { ...p, bossDefeated: (p.bossDefeated || 0) + 1 };
    setPlayer(p);
    setBoss({ ...boss, bosses: boss.bosses.map((x) => x.id === id ? { ...x, derrotado: true, data: today() } : x) });
    // A recompensa vira um item no inventário (visível em Eventos → Inventário).
    if (b.recompensa) {
      setEventos({ ...eventos, inventario: [...eventos.inventario, { id: uid(), nome: b.recompensa, icon: '🎁', origem: `Boss: ${b.nome}`, usado: false, efeito: b.recompensaEfeito }] });
    }
    flash(`⚔️ ${b.nome} derrotado! 🪙 +${b.recompensaCoins} · ⭐ +${b.recompensaXp} XP${b.recompensa ? ` · 🎁 "${b.recompensa}" no inventário` : ''}`);
  };
  const reviver = (id: string) =>
    setBoss({ ...boss, bosses: boss.bosses.map((x) => x.id === id ? { ...x, derrotado: false, penalizado: false, data: null } : x) });
  const del = (id: string) => setBoss({ ...boss, bosses: boss.bosses.filter((x) => x.id !== id) });

  const addBoss = () => {
    if (!f.nome.trim()) return;
    const item = REWARD_ITEMS.find((r) => r.id === itemId);
    setBoss({ ...boss, bosses: [...boss.bosses, {
      ...f, nome: f.nome.trim(), id: uid(), derrotado: false, penalizado: false, data: null,
      recompensa: item ? item.nome : f.recompensa,
      recompensaEfeito: item?.efeito,
    }] });
    setF({ ...f, nome: '', lore: '', comoVencer: '', requisito: '', penalidade: '', recompensa: '', condicao: '', prazo: '' });
    setItemId('custom');
    setOpen(false);
  };

  const ativos = boss.bosses.filter((b) => !b.derrotado);
  const derrotados = boss.bosses.filter((b) => b.derrotado);
  const lista = tab === 'ativos' ? ativos : derrotados;
  const totalCoins = derrotados.reduce((s, b) => s + (b.recompensaCoins || 0), 0);
  const totalXp = derrotados.reduce((s, b) => s + (b.recompensaXp || 0), 0);

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-xl font-black">⚔️ Boss Fight</h1>
        <button onClick={() => setOpen(!open)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">{open ? 'Fechar' : '+ Boss'}</button>
      </div>
      <p className="text-sm text-zinc-500 mb-4">Chefes semanais/mensais da vida real. Derrote no prazo para ganhar a recompensa (vai pro inventário); se o prazo vencer, você toma a penalidade.</p>

      {msg && <div className="mb-4 p-2 rounded-lg bg-indigo-950/50 border border-indigo-800/50 text-sm text-indigo-200 text-center">{msg}</div>}

      {open && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 mb-5">
          <div className="flex gap-1.5 flex-wrap items-center">
            {EMO.map((e) => <button key={e} onClick={() => setF({ ...f, icon: e })} className={`w-9 h-9 rounded-lg text-lg ${f.icon === e ? 'bg-indigo-600' : 'bg-zinc-800'}`}>{e}</button>)}
            <BossIcon icon={f.icon} className="w-9 h-9 flex items-center justify-center text-lg rounded-lg bg-zinc-800" imgClass="w-9 h-9" />
          </div>
          <div className="flex gap-2">
            <input className={`${inp} flex-1`} placeholder="Colar emoji (ex: 👾) ou deixar acima" value={isImg(f.icon) ? '' : f.icon} onChange={(e) => setF({ ...f, icon: e.target.value || '👿' })} />
            <label className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs cursor-pointer hover:border-indigo-500 flex items-center whitespace-nowrap">
              🖼️ Imagem/GIF
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onImg(e.target.files?.[0])} />
            </label>
          </div>
          <input className={inp} placeholder="Nome do boss" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} />
          <input className={inp} placeholder="Lore (história)" value={f.lore} onChange={(e) => setF({ ...f, lore: e.target.value })} />
          <div className="grid grid-cols-3 gap-2">
            <select className={inp} value={f.dificuldade} onChange={(e) => setF({ ...f, dificuldade: e.target.value as Boss['dificuldade'] })}>
              {Object.entries(BOSS_DIFICULDADE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select className={inp} value={f.periodo} onChange={(e) => setF({ ...f, periodo: e.target.value as Boss['periodo'] })}>
              {Object.entries(BOSS_PERIODO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <label className="text-[11px] text-zinc-500 flex flex-col">Prazo<input className={inp} type="date" value={f.prazo} onChange={(e) => setF({ ...f, prazo: e.target.value })} /></label>
          </div>
          <input className={inp} placeholder="Como vencer" value={f.comoVencer} onChange={(e) => setF({ ...f, comoVencer: e.target.value })} />
          <input className={inp} placeholder="Requisito para derrotar" value={f.requisito} onChange={(e) => setF({ ...f, requisito: e.target.value })} />
          <input className={inp} placeholder="Penalidade (texto) — além do −15 HP se vencer o prazo" value={f.penalidade} onChange={(e) => setF({ ...f, penalidade: e.target.value })} />
          <input className={inp} placeholder="Condição para aparecer" value={f.condicao} onChange={(e) => setF({ ...f, condicao: e.target.value })} />
          <select className={inp} value={itemId} onChange={(e) => setItemId(e.target.value)}>
            <option value="custom">🎁 Recompensa personalizada (texto)</option>
            {REWARD_ITEMS.map((r) => <option key={r.id} value={r.id}>{r.icon} {r.nome} — {r.desc}</option>)}
          </select>
          {itemId === 'custom' && <input className={inp} placeholder="Recompensa (descrição)" value={f.recompensa} onChange={(e) => setF({ ...f, recompensa: e.target.value })} />}
          <div className="grid grid-cols-2 gap-2">
            <input className={inp} type="number" placeholder="Moedas" value={f.recompensaCoins} onChange={(e) => setF({ ...f, recompensaCoins: parseInt(e.target.value) || 0 })} />
            <input className={inp} type="number" placeholder="XP" value={f.recompensaXp} onChange={(e) => setF({ ...f, recompensaXp: parseInt(e.target.value) || 0 })} />
          </div>
          <button onClick={addBoss} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">Invocar boss</button>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {(['ativos', 'bestiario'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${tab === t ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>
            {t === 'ativos' ? `⚔️ Ativos (${ativos.length})` : `📖 Bestiário (${derrotados.length})`}
          </button>
        ))}
      </div>

      {tab === 'bestiario' && derrotados.length > 0 && (
        <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-yellow-950/30 to-zinc-900 border border-yellow-800/40 text-sm">
          🏆 Recompensas acumuladas dos bosses derrotados: <b className="text-yellow-400">🪙 {totalCoins}</b> · <b className="text-indigo-300">⭐ {totalXp} XP</b>. Os itens ficam em <b>Eventos → Inventário</b>.
        </div>
      )}

      {lista.length === 0 && (
        <p className="text-center text-zinc-500 py-10 text-sm">
          {tab === 'ativos' ? 'Nenhum boss ativo. Invoque um novo desafio!' : 'Bestiário vazio — derrote um boss para registrá-lo aqui.'}
        </p>
      )}

      <div className="space-y-3">
        {lista.map((b) => {
          const dif = BOSS_DIFICULDADE[b.dificuldade];
          const atrasado = !b.derrotado && b.prazo && today() > b.prazo;
          return (
            <div key={b.id} className={`p-4 rounded-xl border ${b.derrotado ? 'bg-gradient-to-br from-emerald-950/30 to-zinc-900 border-emerald-800/40' : atrasado ? 'border-red-800/50 bg-red-950/10' : 'bg-zinc-900 border-zinc-800'}`}>
              <div className="flex items-start gap-3">
                <BossIcon icon={b.icon} className="text-3xl" imgClass="w-12 h-12" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-bold text-sm">{b.nome}</div>
                    <button onClick={() => del(b.id)} className="text-zinc-700 hover:text-red-400 text-xs shrink-0">✕</button>
                  </div>
                  <div className="flex gap-2 text-[10px] uppercase tracking-wide mt-0.5 flex-wrap">
                    <span className={dif.color}>{dif.label}</span>
                    <span className="text-zinc-500">· {BOSS_PERIODO[b.periodo]}</span>
                    {b.prazo && <span className={atrasado ? 'text-red-400' : 'text-zinc-500'}>· prazo {new Date(b.prazo).toLocaleDateString('pt-BR')}</span>}
                  </div>
                  {b.lore && <p className="text-xs text-zinc-500 mt-1 italic">💬 {b.lore}</p>}
                </div>
              </div>
              <div className="mt-2 space-y-0.5 text-[11px] text-zinc-400">
                {b.comoVencer && <p>🎯 <b className="text-zinc-300">Como vencer:</b> {b.comoVencer}</p>}
                {b.requisito && <p>📌 <b className="text-zinc-300">Requisito:</b> {b.requisito}</p>}
                {b.penalidade && <p>☠️ <b className="text-zinc-300">Penalidade:</b> {b.penalidade} {b.penalizado && <span className="text-red-400">(aplicada)</span>}</p>}
                {b.condicao && <p>🕯️ <b className="text-zinc-300">Aparece:</b> {b.condicao}</p>}
                {b.recompensa && <p>🎁 <b className="text-zinc-300">Recompensa:</b> {b.recompensa}</p>}
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-yellow-400">{b.recompensaCoins ? `🪙 ${b.recompensaCoins}` : ''}{b.recompensaXp ? ` ⭐ ${b.recompensaXp} XP` : ''}</span>
                {b.derrotado
                  ? <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400 font-semibold">✓ Derrotado {b.data ? new Date(b.data).toLocaleDateString('pt-BR') : ''}</span>
                      {b.periodo !== 'unico' && <span className="text-[10px] text-zinc-500">· renasce {b.periodo === 'semanal' ? 'na próxima semana' : 'no próximo mês'}</span>}
                      <button onClick={() => reviver(b.id)} className="text-[11px] text-zinc-600 hover:text-zinc-300">reativar</button>
                    </div>
                  : <button onClick={() => derrotar(b.id)} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold">Derrotar</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

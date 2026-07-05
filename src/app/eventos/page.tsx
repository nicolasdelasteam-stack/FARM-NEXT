'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uid, today, addCoins, applyItemEffect } from '@/lib/engine';
import { play } from '@/lib/sound';
import { REWARD_ITEMS } from '@/lib/constants';

export default function EventosPage() {
  const eventos = useStore((s) => s.eventos);
  const setEventos = useStore((s) => s.setEventos);
  const player = useStore((s) => s.player);
  const setPlayer = useStore((s) => s.setPlayer);
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [desc, setDesc] = useState('');
  const [inicio, setInicio] = useState(today());
  const [fim, setFim] = useState('');
  const [recompensa, setRecompensa] = useState('');
  const [itemId, setItemId] = useState('custom');
  const [coins, setCoins] = useState('20');
  const [msg, setMsg] = useState('');

  const t = today();
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3500); };
  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500';

  const statusOf = (e: { inicio: string; fim: string; resgatado: boolean }) => {
    if (e.resgatado) return 'concluido';
    if (e.fim && t > e.fim) return 'expirado';
    return 'ativo';
  };

  const addEvento = () => {
    if (!nome.trim()) return;
    const item = REWARD_ITEMS.find((r) => r.id === itemId);
    setEventos({ ...eventos, eventos: [...eventos.eventos, {
      id: uid(), nome: nome.trim(), descricao: desc.trim(), inicio, fim,
      recompensa: item ? item.nome : (recompensa.trim() || 'Recompensa'),
      recompensaCoins: parseInt(coins) || 0,
      recompensaEfeito: item?.efeito,
      recompensaIcon: item?.icon,
      status: 'ativo', resgatado: false,
    }] });
    setNome(''); setDesc(''); setFim(''); setRecompensa(''); setItemId('custom'); setOpen(false);
  };

  const resgatar = (id: string) => {
    const ev = eventos.eventos.find((e) => e.id === id);
    if (!ev || ev.resgatado) return;
    play('fanfare');
    const novoInv = [...eventos.inventario, { id: uid(), nome: ev.recompensa, icon: ev.recompensaIcon || '🎁', origem: ev.nome, usado: false, efeito: ev.recompensaEfeito }];
    setEventos({ ...eventos, eventos: eventos.eventos.map((e) => e.id === id ? { ...e, resgatado: true, status: 'concluido' as const } : e), inventario: novoInv });
    if (ev.recompensaCoins > 0) setPlayer(addCoins(player, ev.recompensaCoins));
    flash(`🎁 "${ev.recompensa}" foi para o inventário!`);
  };

  const usarItem = (id: string) => {
    const it = eventos.inventario.find((i) => i.id === id);
    if (!it || it.usado) return;
    play('ding');
    const res = applyItemEffect(player, it.efeito);
    setPlayer(res.player);
    setEventos({ ...eventos, inventario: eventos.inventario.map((i) => i.id === id ? { ...i, usado: true } : i) });
    flash(res.msg);
  };
  const delEvento = (id: string) => setEventos({ ...eventos, eventos: eventos.eventos.filter((e) => e.id !== id) });

  const daysTo = (d: string) => d ? Math.ceil((new Date(d).getTime() - new Date(t).getTime()) / 86400000) : null;
  const avisos: string[] = [];
  eventos.eventos.forEach((e) => {
    if (e.resgatado) return;
    const dStart = daysTo(e.inicio), dEnd = daysTo(e.fim);
    if (dStart != null && dStart > 0 && dStart <= 2) avisos.push(`⏳ "${e.nome}" começa em ${dStart} dia(s).`);
    if (dEnd != null && dEnd >= 0 && dEnd <= 2) avisos.push(`🔔 "${e.nome}" termina em ${dEnd} dia(s) — resgate logo!`);
    if (dEnd != null && dEnd < 0) avisos.push(`⚠️ "${e.nome}" expirou.`);
  });

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <div><h1 className="text-xl font-black">🎉 Eventos</h1><p className="text-sm text-zinc-500">Desafios por tempo limitado e seu inventário.</p></div>
        <button onClick={() => setOpen(!open)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">{open ? 'Fechar' : '+ Novo evento'}</button>
      </div>

      {msg && <div className="mb-4 p-2 rounded-lg bg-indigo-950/50 border border-indigo-800/50 text-sm text-indigo-200 text-center">{msg}</div>}

      {avisos.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 space-y-1">
          {avisos.map((a, i) => <div key={i} className="text-sm text-amber-300">{a}</div>)}
        </div>
      )}

      {open && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 mb-5">
          <input className={inp} placeholder="Nome do evento" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input className={inp} placeholder="Descrição" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs text-zinc-500">Início</label><input className={inp} type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} /></div>
            <div><label className="text-xs text-zinc-500">Fim</label><input className={inp} type="date" value={fim} onChange={(e) => setFim(e.target.value)} /></div>
          </div>
          <select className={inp} value={itemId} onChange={(e) => setItemId(e.target.value)}>
            <option value="custom">🎁 Recompensa personalizada (só texto)</option>
            {REWARD_ITEMS.map((r) => <option key={r.id} value={r.id}>{r.icon} {r.nome} — {r.desc}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            {itemId === 'custom'
              ? <input className={inp} placeholder="Recompensa (ex: Skin rara)" value={recompensa} onChange={(e) => setRecompensa(e.target.value)} />
              : <div className="text-[11px] text-emerald-400 flex items-center px-1">✓ Item funcional — usar no inventário aplica o efeito.</div>}
            <input className={inp} type="number" placeholder="Moedas extras" value={coins} onChange={(e) => setCoins(e.target.value)} />
          </div>
          <button onClick={addEvento} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">Criar evento</button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3 mb-6">
        {eventos.eventos.length === 0 && <p className="text-sm text-zinc-600">Nenhum evento ainda.</p>}
        {eventos.eventos.map((e) => {
          const st = statusOf(e);
          return (
            <div key={e.id} className={`p-4 rounded-xl border ${st === 'expirado' ? 'bg-zinc-900/50 border-zinc-800/50 opacity-60' : 'bg-zinc-900 border-zinc-800'}`}>
              <div className="flex justify-between items-start">
                <div className="font-bold">{e.nome}</div>
                <button onClick={() => delEvento(e.id)} className="text-zinc-600 hover:text-red-400 text-xs">✕</button>
              </div>
              {e.descricao && <p className="text-xs text-zinc-500 mt-0.5">{e.descricao}</p>}
              <div className="text-xs text-zinc-500 mt-2">📅 {e.inicio}{e.fim ? ` → ${e.fim}` : ''}</div>
              <div className="text-xs text-yellow-400 mt-1">🎁 {e.recompensa}{e.recompensaCoins ? ` · 🪙 ${e.recompensaCoins}` : ''}</div>
              <div className="mt-3">
                {e.resgatado ? <span className="text-xs text-emerald-400 font-semibold">✓ Resgatado</span>
                  : st === 'expirado' ? <span className="text-xs text-red-400">Expirado</span>
                  : <button onClick={() => resgatar(e.id)} className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-black rounded-lg text-xs font-bold">Resgatar recompensa</button>}
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="text-sm font-bold mb-2">🎒 Inventário</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {eventos.inventario.length === 0 && <p className="text-sm text-zinc-600 col-span-full">Inventário vazio.</p>}
        {eventos.inventario.map((i) => (
          <div key={i.id} className={`p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center ${i.usado ? 'opacity-40' : ''}`}>
            <div className="text-2xl">{i.icon}</div>
            <div className="text-xs font-semibold mt-1 truncate">{i.nome}</div>
            <div className="text-[10px] text-zinc-600">de {i.origem}</div>
            {i.usado ? <span className="text-[10px] text-zinc-500">usado</span>
              : <button onClick={() => usarItem(i.id)} className="mt-1 text-[11px] text-indigo-400 hover:text-indigo-300">Usar</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

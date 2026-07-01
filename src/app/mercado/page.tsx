'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { spendCoins, healHp, addCoins, openLootBox, getWeekStart } from '@/lib/engine';

export default function MercadoPage() {
  const player = useStore((s) => s.player);
  const setPlayer = useStore((s) => s.setPlayer);
  const market = useStore((s) => s.market);
  const setMarket = useStore((s) => s.setMarket);
  const [msg, setMsg] = useState('');

  const items = market?.items || [];
  const rewards = (market as any)?.rewards || [];
  const wk = getWeekStart();
  const buys: Record<string, number> = market?.weekStart === wk ? (market?.weekBuys || {}) : {};

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };

  const buyItem = (item: { id: string; name: string; cost: number }) => {
    const afterSpend = spendCoins(player, item.cost);
    if (!afterSpend) return flash('Moedas insuficientes.');
    let p = afterSpend; let m = 'Comprado';
    switch (item.id) {
      case 'potion': p = healHp(p, 30); m = '+30 HP'; break;
      case 'big_potion': p = healHp(p, p.maxHp); m = 'HP restaurado'; break;
      case 'streak_freeze': p = { ...p, streakFreeze: (p.streakFreeze || 0) + 1 }; m = 'Ofensiva protegida ❄️'; break;
      case 'xp_boost': p = { ...p, xpBoostUntil: Date.now() + 30 * 60000 }; m = 'XP em dobro por 30min ⚡'; break;
      case 'loot_bronze': case 'loot_silver': case 'loot_gold': {
        const tier = item.id.split('_')[1] as 'bronze' | 'silver' | 'gold';
        const r = openLootBox(tier); p = healHp(addCoins(p, r.coins), r.hp);
        m = `Baú ${r.rarity}: +${r.coins} 🪙 +${r.hp} HP`; break;
      }
    }
    setPlayer(p); flash(`${item.name}: ${m}`);
  };

  const buyReward = (rw: { id: string; name: string; cost: number; weeklyLimit: number }) => {
    const used = buys[rw.id] || 0;
    if (rw.weeklyLimit > 0 && used >= rw.weeklyLimit) return flash('Limite semanal atingido.');
    const afterSpend = spendCoins(player, rw.cost);
    if (!afterSpend) return flash('Moedas insuficientes.');
    setPlayer(afterSpend);
    setMarket({ ...market, weekStart: wk, weekBuys: { ...buys, [rw.id]: used + 1 }, purchases: [...(market.purchases || []), rw.id] });
    flash(`${rw.name} resgatado! 🎉`);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-black">🛒 Mercado</h1>
        <span className="text-sm text-yellow-400 font-semibold">🪙 {player.coins}</span>
      </div>
      {msg && <div className="mb-4 p-2 rounded-lg bg-violet-950/50 border border-violet-800/50 text-sm text-violet-200 text-center">{msg}</div>}

      <h2 className="text-sm font-bold text-zinc-400 mb-2">Itens do jogo</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {items.map((item) => {
          const canBuy = player.coins >= item.cost;
          return (
            <div key={item.id} className={`p-4 rounded-xl border ${canBuy ? 'bg-zinc-900 border-zinc-800 hover:border-violet-800/50' : 'bg-zinc-900/50 border-zinc-800/30 opacity-60'}`}>
              <div className="font-semibold text-sm mb-1">{item.name}</div>
              <p className="text-xs text-zinc-500 mb-3">{item.desc}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-yellow-400 font-semibold">🪙 {item.cost}</span>
                <button onClick={() => buyItem(item)} disabled={!canBuy}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${canBuy ? 'bg-yellow-600 hover:bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}>
                  {canBuy ? 'Comprar' : 'Sem moedas'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="text-sm font-bold text-zinc-400 mb-2">🎁 Recompensas da vida real</h2>
      <div className="grid grid-cols-2 gap-3">
        {rewards.map((rw: { id: string; name: string; desc: string; cost: number; weeklyLimit: number }) => {
          const used = buys[rw.id] || 0;
          const limited = rw.weeklyLimit > 0;
          const esgotado = limited && used >= rw.weeklyLimit;
          const canBuy = player.coins >= rw.cost && !esgotado;
          return (
            <div key={rw.id} className={`p-4 rounded-xl border ${canBuy ? 'bg-zinc-900 border-zinc-800 hover:border-yellow-800/50' : 'bg-zinc-900/50 border-zinc-800/30 opacity-60'}`}>
              <div className="font-semibold text-sm mb-1">{rw.name}</div>
              <p className="text-xs text-zinc-500 mb-1">{rw.desc}</p>
              <p className="text-[11px] text-zinc-600 mb-3">{limited ? `${Math.max(0, rw.weeklyLimit - used)}/${rw.weeklyLimit} restantes esta semana` : 'Sem limite'}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-yellow-400 font-semibold">🪙 {rw.cost}</span>
                <button onClick={() => buyReward(rw)} disabled={!canBuy}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${canBuy ? 'bg-yellow-600 hover:bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}>
                  {esgotado ? 'Esgotado' : player.coins >= rw.cost ? 'Resgatar' : 'Sem moedas'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useStore } from '@/lib/store';

export default function MercadoPage() {
  const player = useStore((s) => s.player);
  const market = useStore((s) => s.market);

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-black mb-4">🛒 Mercado</h1>
      <div className="grid grid-cols-2 gap-3">
        {(market?.items || []).map((item) => {
          const canBuy = player.coins >= item.cost;
          return (
            <div key={item.id} className={`p-4 rounded-xl border ${canBuy ? 'bg-zinc-900 border-zinc-800 hover:border-violet-800/50' : 'bg-zinc-900/50 border-zinc-800/30 opacity-50'}`}>
              <div className="font-semibold text-sm mb-1">{item.name}</div>
              <p className="text-xs text-zinc-500 mb-3">{item.desc}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-yellow-400 font-semibold">🪙 {item.cost}</span>
                <button disabled={!canBuy}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${canBuy ? 'bg-yellow-600 hover:bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}>
                  {canBuy ? 'Comprar' : 'Sem moedas'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

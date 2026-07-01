'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { PET_STAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Núcleo', items: [
    { href: '/', icon: '📊', label: 'Dashboard' },
    { href: '/campo', icon: '🎯', label: 'Campo' },
    { href: '/personagem', icon: '👤', label: 'Personagem' },
    { href: '/mercado', icon: '🛒', label: 'Mercado' },
    { href: '/calendario', icon: '📅', label: 'Calendário' },
    { href: '/ligas', icon: '📊', label: 'Ligas' },
    { href: '/estatisticas', icon: '📈', label: 'Estatísticas' },
    { href: '/conquistas', icon: '🏆', label: 'Conquistas' },
    { href: '/hall', icon: '🏛️', label: 'Hall' },
    { href: '/eventos', icon: '🎉', label: 'Eventos' },
    { href: '/boss', icon: '⚔️', label: 'Boss Fight' },
  ]},
  { label: 'Vida', items: [
    { href: '/agua', icon: '💧', label: 'Água' },
    { href: '/financas', icon: '💰', label: 'Finanças' },
    { href: '/academia', icon: '💪', label: 'Academia' },
    { href: '/caverna', icon: '🕯️', label: 'Caverna' },
    { href: '/dieta', icon: '🥗', label: 'Dieta' },
    { href: '/compras', icon: '🧺', label: 'Compras' },
    { href: '/treinos', icon: '🏋️', label: 'Treinos' },
    { href: '/viagens', icon: '✈️', label: 'Viagens' },
    { href: '/casa', icon: '🏠', label: 'Casa' },
  ]},
  { label: 'Mente', items: [
    { href: '/estudos', icon: '📚', label: 'Estudos' },
    { href: '/segundo-cerebro', icon: '🧠', label: 'Segundo Cérebro' },
    { href: '/notas', icon: '📝', label: 'Notas' },
    { href: '/midia', icon: '🎬', label: 'Mídia' },
    { href: '/deepwork', icon: '🌑', label: 'Deep Work' },
    { href: '/planejamento', icon: '🗓️', label: 'Planejamento' },
    { href: '/provas', icon: '📆', label: 'Provas' },
  ]},
  { label: 'Social', items: [
    { href: '/companheiros', icon: '🐾', label: 'Companheiros' },
  ]},
  { label: 'Sistema', items: [
    { href: '/configuracoes', icon: '⚙️', label: 'Configurações' },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  const player = useStore((s) => s.player);

  const xpPct = Math.min(100, Math.round((player.xp / player.xpToNext) * 100));
  const petStage = player.pet?.stage || 0;

  return (
    <aside className="flex flex-col bg-zinc-950 border-r border-zinc-800 w-64 h-screen sticky top-0">
      <div className="flex items-center gap-2 px-4 h-14 border-b border-zinc-800 shrink-0">
        <span className="text-xl font-black text-violet-400">Z<b className="text-white">ÊNITE</b></span>
      </div>
      <div className="p-3 border-b border-zinc-800 space-y-2 shrink-0">
        {player.gameOver && <div className="text-center py-1 text-xs font-bold bg-red-600 rounded">💀 DERROTADO</div>}
        <div className="flex items-center gap-2">
          {player.photo
            // eslint-disable-next-line @next/next/no-img-element -- foto/gif de perfil (data-URL)
            ? <img src={player.photo} alt="" className="w-8 h-8 rounded-full object-cover border border-violet-600" />
            : <span className="text-2xl">{player.avatar}</span>}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate">{player.name}</div>
            <div className="text-xs text-zinc-500">{player.title} · Nv {player.level}</div>
          </div>
        </div>
        <div className="flex gap-1 text-xs flex-wrap">
          <span className="px-2 py-0.5 rounded bg-red-900/40 text-red-400">❤️ {player.hp}</span>
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">🔥 {player.streak}</span>
          <span className="px-2 py-0.5 rounded bg-yellow-900/40 text-yellow-400">🪙 {player.coins}</span>
          {petStage > 0 && <span className="px-2 py-0.5 rounded bg-sky-900/40 text-sky-400">{PET_STAGES[petStage]?.icon}</span>}
        </div>
        <div className="space-y-0.5">
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>XP</span><span>{player.xp}/{player.xpToNext}</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-3">
        {NAV_ITEMS.map((group) => (
          <div key={group.label}>
            <div className="px-2 py-1 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">{group.label}</div>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors',
                    active ? 'bg-violet-600/20 text-violet-300 font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  )}>
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

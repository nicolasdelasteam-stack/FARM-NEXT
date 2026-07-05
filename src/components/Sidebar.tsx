'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { getPetIcon } from '@/lib/engine';
import { cn } from '@/lib/utils';

// A rotina diária fica fixa no topo (lição do Duolingo/Finch: o loop do dia
// a um toque, sem rolar); o resto vive em grupos recolhíveis.
const ROTINA = [
  { href: '/', icon: '🏠', label: 'Hoje' },
  { href: '/campo', icon: '🎯', label: 'Campo' },
  { href: '/agua', icon: '💧', label: 'Água' },
  { href: '/caverna', icon: '🕯️', label: 'Caverna' },
  { href: '/boss', icon: '⚔️', label: 'Boss Fight' },
  { href: '/mercado', icon: '🛒', label: 'Mercado' },
];

const NAV_ITEMS = [
  { label: 'Jogo', items: [
    { href: '/personagem', icon: '👤', label: 'Personagem' },
    { href: '/conquistas', icon: '🏆', label: 'Conquistas' },
    { href: '/hall', icon: '🏛️', label: 'Hall' },
    { href: '/eventos', icon: '🎉', label: 'Eventos' },
    { href: '/ligas', icon: '📊', label: 'Ligas' },
    { href: '/estatisticas', icon: '📈', label: 'Estatísticas' },
    { href: '/calendario', icon: '📅', label: 'Calendário' },
  ]},
  { label: 'Vida', items: [
    { href: '/treinos', icon: '🏋️', label: 'Treinos' },
    { href: '/dieta', icon: '🥗', label: 'Dieta' },
    { href: '/financas', icon: '💰', label: 'Finanças' },
    { href: '/casa', icon: '🏠', label: 'Casa' },
    { href: '/compras', icon: '🧺', label: 'Compras' },
    { href: '/viagens', icon: '✈️', label: 'Viagens' },
    { href: '/academia', icon: '💪', label: 'Academia' },
  ]},
  { label: 'Mente', items: [
    { href: '/estudos', icon: '📚', label: 'Estudos' },
    { href: '/provas', icon: '📆', label: 'Provas' },
    { href: '/segundo-cerebro', icon: '🧠', label: 'Segundo Cérebro' },
    { href: '/deepwork', icon: '🌑', label: 'Deep Work' },
    { href: '/notas', icon: '📝', label: 'Notas' },
    { href: '/midia', icon: '🎬', label: 'Mídia' },
    { href: '/planejamento', icon: '🗓️', label: 'Planejamento' },
  ]},
  { label: 'Social', items: [
    { href: '/companheiros', icon: '🐾', label: 'Companheiros' },
  ]},
  { label: 'Sistema', items: [
    { href: '/configuracoes', icon: '⚙️', label: 'Configurações' },
  ]},
];

const NAV_KEY = 'zenite-nav-open';
const DEFAULT_OPEN: Record<string, boolean> = { Jogo: true, Vida: false, Mente: false, Social: false, Sistema: false };

export default function Sidebar() {
  const pathname = usePathname();
  const player = useStore((s) => s.player);
  const settings = useStore((s) => s.settings);

  // Estado dos grupos vem do localStorage via useSyncExternalStore (hidratação
  // segura no SSR e sem setState em efeito).
  const rawOpen = useSyncExternalStore(
    (cb) => { window.addEventListener('zenite-nav', cb); return () => window.removeEventListener('zenite-nav', cb); },
    () => localStorage.getItem(NAV_KEY),
    () => null,
  );
  let open = DEFAULT_OPEN;
  try { if (rawOpen) open = { ...DEFAULT_OPEN, ...JSON.parse(rawOpen) }; } catch { /* usa o padrão */ }
  const toggle = (label: string) => {
    try {
      localStorage.setItem(NAV_KEY, JSON.stringify({ ...open, [label]: !open[label] }));
      window.dispatchEvent(new Event('zenite-nav'));
    } catch { /* sem persistência */ }
  };

  const xpPct = Math.min(100, Math.round((player.xp / player.xpToNext) * 100));
  const metaPct = Math.min(100, Math.round(((player.dailyXp || 0) / (settings.dailyXpGoal || 100)) * 100));
  const petStage = player.pet?.stage || 0;

  const renderLink = (item: { href: string; icon: string; label: string }) => {
    const active = pathname === item.href;
    return (
      <Link key={item.href} href={item.href}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors',
          active ? 'bg-indigo-600/20 text-indigo-300 font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
        )}>
        <span className="text-base">{item.icon}</span>
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="flex flex-col bg-zinc-950 border-r border-zinc-800 w-64 h-screen sticky top-0">
      <div className="flex items-center gap-2 px-4 h-14 border-b border-zinc-800 shrink-0">
        <span className="text-xl font-black bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">ZÊNITE</span>
      </div>
      <div className="p-3 border-b border-zinc-800 space-y-2 shrink-0">
        {player.gameOver && <div className="text-center py-1 text-xs font-bold bg-red-600 rounded">💀 DERROTADO</div>}
        <div className="flex items-center gap-2">
          {player.photo
            // eslint-disable-next-line @next/next/no-img-element -- foto/gif de perfil (data-URL)
            ? <img src={player.photo} alt="" className="w-8 h-8 rounded-full object-cover border border-indigo-600" />
            : <span className="text-2xl">{player.avatar}</span>}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate">{player.name}</div>
            <div className="text-xs text-zinc-500">{player.title} · Nv {player.level}</div>
          </div>
        </div>
        <div className="flex gap-1 text-xs flex-wrap">
          <span className="px-2 py-0.5 rounded bg-red-900/40 text-red-400">❤️ {player.hp}</span>
          <span className={cn('px-2 py-0.5 rounded', player.metaBatidaHoje ? 'bg-orange-900/50 text-orange-300' : 'bg-zinc-800 text-zinc-500')}
            title={player.metaBatidaHoje ? 'Ofensiva garantida hoje!' : 'Bata a meta diária de XP para garantir a ofensiva'}>
            🔥 {player.streak}
          </span>
          <span className="px-2 py-0.5 rounded bg-yellow-900/40 text-yellow-400">🪙 {player.coins}</span>
          {petStage > 0 && <span className="px-2 py-0.5 rounded bg-sky-900/40 text-sky-400">{getPetIcon(player.pet)}</span>}
        </div>
        <div className="space-y-0.5">
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>XP</span><span>{player.xp}/{player.xpToNext}</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
        {/* Meta do dia sempre à vista — o "o meu dia já está feito?" do Duolingo */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-[10px]">
            <span className={player.metaBatidaHoje ? 'text-orange-400 font-semibold' : 'text-zinc-500'}>
              {player.metaBatidaHoje ? '🔥 Dia garantido!' : 'Meta do dia'}
            </span>
            <span className="text-zinc-500">{player.dailyXp || 0}/{settings.dailyXpGoal || 100}</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className={cn('h-full rounded-full transition-all duration-500', player.metaBatidaHoje ? 'bg-orange-500' : 'bg-yellow-600')} style={{ width: `${metaPct}%` }} />
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-3">
        <div>
          <div className="px-2 py-1 text-[10px] font-semibold text-indigo-400/80 uppercase tracking-wider">⭐ Rotina</div>
          {ROTINA.map(renderLink)}
        </div>
        {NAV_ITEMS.map((group) => (
          <div key={group.label}>
            <button onClick={() => toggle(group.label)}
              className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider hover:text-zinc-400">
              <span>{group.label}</span>
              <span className={cn('transition-transform text-[9px]', open[group.label] ? 'rotate-90' : '')}>▶</span>
            </button>
            {open[group.label] && group.items.map(renderLink)}
          </div>
        ))}
      </nav>
    </aside>
  );
}

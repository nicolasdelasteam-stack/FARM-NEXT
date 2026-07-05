import type { Player, Difficulty, Mission, Reward, Boss, Agua, Trofeu, EventosState, Pet, BossDefeatInfo, BossAutoTipo } from './types';
import { LEVELS, TITLES_EXTENDED, DIFFICULTIES, CATEGORY_ATTR_MAP, BOSSES, DEFAULT_BOSSES, PET_STREAK_REQ, PET_SPECIES, RANDOM_EVENT_POOL, SEASONAL_EVENTS, type EventoTemplate } from './constants';

// ─── Date helpers ───
export function today(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

// 'YYYY-MM-DD' no fuso local — toISOString() é UTC e vira o dia mais cedo (ex.: 21h no Brasil).
function ymdLocal(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function dateSub(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.abs(days));
  return ymdLocal(d);
}

export function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  return ymdLocal(d);
}

// Segunda-feira (chave da semana) a partir de um 'YYYY-MM-DD' local — tz-safe.
export function weekKey(dateStr: string): string {
  const [y, m, dd] = dateStr.split('-').map(Number);
  const d = new Date(y, m - 1, dd);
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  return ymdLocal(d);
}

// Boss recorrente (semanal/mensal) volta a aparecer quando muda o período em que foi derrotado.
export function bossShouldReset(boss: Boss): boolean {
  if (!boss.derrotado || !boss.data || boss.periodo === 'unico') return false;
  if (boss.periodo === 'semanal') return weekKey(boss.data) !== weekKey(today());
  if (boss.periodo === 'mensal') return boss.data.slice(0, 7) !== today().slice(0, 7);
  return false;
}

export function refreshBosses(bosses: Boss[]): { bosses: Boss[]; changed: boolean } {
  let changed = false;
  const next = bosses.map((b) => {
    if (bossShouldReset(b)) { changed = true; return { ...b, derrotado: false, penalizado: false, data: null }; }
    return b;
  });
  return { bosses: next, changed };
}

// Aplica a penalidade (−15 HP) de bosses com prazo vencido que não foram derrotados.
export function applyBossPenalties(
  player: Player,
  bosses: Boss[],
  settings: { gentleMode?: boolean; hardcoreHp?: boolean },
): { player: Player; bosses: Boss[]; changed: boolean; penalized: string[] } {
  const t = today();
  let p = player;
  let changed = false;
  const penalized: string[] = [];
  const next = bosses.map((b) => {
    if (!b.derrotado && !b.penalizado && b.prazo && t > b.prazo) {
      p = damageHp(p, 15, settings);
      changed = true;
      penalized.push(b.nome);
      return { ...b, penalizado: true };
    }
    return b;
  });
  return { player: p, bosses: next, changed, penalized };
}

// ─── Requisitos automáticos dos bosses (ligados aos dados reais das abas) ───
export interface BossMetrics {
  treinosSemana: number;      // dias com treino registrado nesta semana
  aguaSemana: number;         // dias com meta de água batida nesta semana
  casaZerada: boolean;        // todas as tarefas da casa concluídas
  financasMesPositivo: boolean; // saldo do mês (receitas − despesas) ≥ 0
  missoesSemana: number;      // missões concluídas nesta semana
  streak: number;
  focoTotal: number;
  provasMes: number;          // provas/entregas (missão com prazo) concluídas no mês
  estudosSemana: number;      // missões de estudo concluídas nesta semana
}

// Missões concluídas na semana atual, a partir do contador persistente do store
// (zera sozinho na virada da semana). Dailies resetam e perdem completedAt, por
// isso um contador dedicado é mais fiel do que varrer as missões.
export function weekMissoesOf(weekStats: { week: string; missoes: number }): number {
  return weekStats.week === weekKey(today()) ? weekStats.missoes : 0;
}

// Calcula as métricas a partir das fatias do estado (engine fica desacoplado do store).
export function computeBossMetrics(d: {
  player: Player;
  treinosLogs: { data: string }[];
  aguaHist: Record<string, { completou: boolean }>;
  casaTarefas: { done: boolean }[];
  transacoes: { tipo: string; valor: number; data: string }[];
  weekMissoes: number;
  missions: Mission[];
  history: Mission[];
}): BossMetrics {
  const wk = weekKey(today());
  const mes = today().slice(0, 7);
  const treinosSemana = new Set(d.treinosLogs.filter((l) => weekKey(l.data) === wk).map((l) => l.data)).size;
  const aguaSemana = Object.entries(d.aguaHist || {}).filter(([data, h]) => h.completou && weekKey(data) === wk).length;
  const casaZerada = d.casaTarefas.length > 0 && d.casaTarefas.every((t) => t.done);
  const saldo = d.transacoes.filter((t) => t.data?.slice(0, 7) === mes)
    .reduce((s, t) => s + (t.tipo === 'receita' ? t.valor : -t.valor), 0);
  // Provas/entregas (missão com prazo) e missões de estudo são missões únicas —
  // ficam em missions (no dia) ou em history (arquivadas na virada), com completedAt.
  const todas = [...d.missions, ...d.history];
  const provasMes = todas.filter((m) => m.dueDate && m.done && m.completedAt && m.completedAt.slice(0, 7) === mes).length;
  const estudosSemana = todas.filter((m) => m.skill === 'estudos' && m.done && m.completedAt && weekKey(m.completedAt.slice(0, 10)) === wk).length;
  return {
    treinosSemana,
    aguaSemana,
    casaZerada,
    financasMesPositivo: d.transacoes.some((t) => t.data?.slice(0, 7) === mes) && saldo >= 0,
    missoesSemana: d.weekMissoes,
    streak: Math.max(d.player.streak || 0, 0),
    focoTotal: d.player.totalFocusMinutes || 0,
    provasMes,
    estudosSemana,
  };
}

// Requisito automático do boss: usa o do próprio boss OU, se faltar (dados
// antigos sem migração), recupera do padrão pelo id — deixa o auto à prova de falhas.
export function resolveBossAuto(boss: Boss): { tipo: BossAutoTipo; valor: number } | undefined {
  return boss.auto || DEFAULT_BOSSES.find((d) => d.id === boss.id)?.auto;
}

// Valor atual vs. alvo de um boss automático (para barra de progresso e checagem).
export function bossAutoProgress(boss: Boss, m: BossMetrics): { have: number; need: number } | null {
  const auto = resolveBossAuto(boss);
  if (!auto) return null;
  switch (auto.tipo) {
    case 'treinos_semana': return { have: m.treinosSemana, need: auto.valor };
    case 'agua_semana': return { have: m.aguaSemana, need: auto.valor };
    case 'missoes_semana': return { have: m.missoesSemana, need: auto.valor };
    case 'streak': return { have: m.streak, need: auto.valor };
    case 'foco_total': return { have: m.focoTotal, need: auto.valor };
    case 'provas_mes': return { have: m.provasMes, need: auto.valor };
    case 'estudos_semana': return { have: m.estudosSemana, need: auto.valor };
    case 'casa_zerada': return { have: m.casaZerada ? 1 : 0, need: 1 };
    case 'financas_mes': return { have: m.financasMesPositivo ? 1 : 0, need: 1 };
  }
}

export function bossAutoMet(boss: Boss, m: BossMetrics): boolean {
  const p = bossAutoProgress(boss, m);
  return !!p && p.have >= p.need;
}

// Deriva a derrota dos bosses automáticos cujo requisito foi cumprido nas abas.
// Mesma recompensa da derrota manual (moedas/XP/contador + item pro inventário).
export function checkBossAutoDefeats(
  player: Player,
  bosses: Boss[],
  settings: { maxDailyXp: number; dailyXpGoal: number },
  m: BossMetrics,
): { player: Player; bosses: Boss[]; invItems: { nome: string; efeito?: string; origem: string }[]; defeated: BossDefeatInfo[] } {
  let p = player;
  let changed = false;
  const invItems: { nome: string; efeito?: string; origem: string }[] = [];
  const defeated: BossDefeatInfo[] = [];
  const next = bosses.map((b) => {
    if (resolveBossAuto(b) && !b.derrotado && bossAutoMet(b, m)) {
      if (b.recompensaCoins > 0) p = addCoins(p, b.recompensaCoins);
      if (b.recompensaXp > 0) p = addXP(p, b.recompensaXp, settings);
      p = { ...p, bossDefeated: (p.bossDefeated || 0) + 1 };
      if (b.recompensa) invItems.push({ nome: b.recompensa, efeito: b.recompensaEfeito, origem: `Boss: ${b.nome}` });
      defeated.push({ nome: b.nome, icon: b.icon, coins: b.recompensaCoins || 0, xp: b.recompensaXp || 0, recompensa: b.recompensa || undefined });
      changed = true;
      return { ...b, derrotado: true, data: today() };
    }
    return b;
  });
  return { player: p, bosses: changed ? next : bosses, invItems, defeated };
}

// Chamadas impuras isoladas na lib (fora de componentes) — evitam o erro react-hooks/purity.
export function nowMs(): number {
  return Date.now();
}
export function rand(): number {
  return Math.random();
}
export function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}
export function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

// ─── UID ───
export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ─── Level system ───
export function getLevelConfig(level: number): { level: number; xpNeeded: number; title: string } {
  const found = LEVELS.find(l => l.level === level);
  if (found) return found;
  const xpNeeded = 200 + level * 150;
  const tIdx = Math.floor((level - 11) / 5);
  return { level, xpNeeded, title: TITLES_EXTENDED[tIdx] || 'Mestre Supremo' };
}

export function calcReward(difficulty: Difficulty): Reward {
  return DIFFICULTIES[difficulty]?.reward || { xp: 20, coins: 3 };
}

export function addXP(player: Player, amount: number, settings: { maxDailyXp: number; dailyXpGoal: number }, skillType?: string): Player {
  const p = { ...player };
  // Dobro de XP enquanto o boost estiver ativo (item da loja / recompensa de evento).
  let boosted = (player.xpBoostUntil && player.xpBoostUntil > Date.now()) ? amount * 2 : amount;
  // Mascote radiante (humor ≥ 80) dá +10% de XP em tudo.
  if ((player.pet?.humor ?? 0) >= 80) boosted = Math.round(boosted * 1.1);
  // Daily XP cap
  const cap = settings.maxDailyXp || 500;
  const effective = Math.min(boosted, Math.max(0, cap - (p.dailyXp || 0)));
  p.xp += effective;
  p.dailyXp = (p.dailyXp || 0) + effective;

  // Level up loop
  while (p.xp >= p.xpToNext) {
    p.xp -= p.xpToNext;
    p.level++;
    const cfg = getLevelConfig(p.level);
    p.title = cfg.title;
    p.xpToNext = cfg.xpNeeded;
  }

  // Custom skill XP
  if (skillType && skillType in p.skills) {
    p.skills[skillType as keyof typeof p.skills]! += Math.floor(effective / 10);
  } else if (skillType && p.customSkills) {
    const cs = p.customSkills.find(s => s.id === skillType);
    if (cs) cs.xp = (cs.xp || 0) + Math.floor(effective / 10);
  }

  return p;
}

export function addCoins(player: Player, amount: number): Player {
  return { ...player, coins: player.coins + amount };
}

export function spendCoins(player: Player, amount: number): Player | null {
  if (player.coins < amount) return null;
  return { ...player, coins: player.coins - amount };
}

export function damageHp(player: Player, amount: number, settings: { gentleMode?: boolean; hardcoreHp?: boolean }): Player {
  const p = { ...player };
  if (settings.gentleMode) {
    p.hp = Math.max(1, p.hp - Math.floor(amount / 2));
    return p;
  }
  p.hp = Math.max(0, p.hp - amount);
  if (p.hp <= 0 && !p.gameOver) {
    p.gameOver = true;
    p.deaths = (p.deaths || 0) + 1;
  }
  return p;
}

// Aplica o efeito de um item de recompensa (inventário de eventos / loja).
export function applyItemEffect(player: Player, efeito: string | undefined): { player: Player; msg: string } {
  let p = { ...player };
  switch (efeito) {
    case 'xp2x': p = { ...p, xpBoostUntil: Date.now() + 2 * 3600 * 1000 }; return { player: p, msg: 'Dobro de XP ativado por 2h ⚡' };
    case 'xp2x_24h': p = { ...p, xpBoostUntil: Date.now() + 24 * 3600 * 1000 }; return { player: p, msg: 'Bônus Ultra: dobro de XP por 24h 🌟' };
    case 'heal_full': p = healHp(p, p.maxHp); return { player: p, msg: 'HP totalmente restaurado ❤️' };
    case 'heal_30': p = healHp(p, 30); return { player: p, msg: '+30 HP 🧪' };
    case 'coins_50': p = addCoins(p, 50); return { player: p, msg: '+50 moedas 🪙' };
    case 'coins_100': p = addCoins(p, 100); return { player: p, msg: '+100 moedas 🪙' };
    case 'freeze': p = { ...p, streakFreeze: (p.streakFreeze || 0) + 1 }; return { player: p, msg: 'Ofensiva protegida ❄️' };
    case 'bau_sombrio': {
      // Sorte ou azar: 70% tesouro bom, 30% consolo pequeno.
      if (Math.random() < 0.7) { const v = 60 + Math.floor(Math.random() * 90); p = addCoins(p, v); return { player: p, msg: `O baú range... +${v} moedas! 🖤` }; }
      p = healHp(addCoins(p, 10), 10); return { player: p, msg: 'O baú estava quase vazio: +10 moedas, +10 HP 🕸️' };
    }
    case 'roleta': {
      const premios: [string, (pl: Player) => Player][] = [
        ['+80 moedas 🪙', (pl) => addCoins(pl, 80)],
        ['+40 HP 🧪', (pl) => healHp(pl, 40)],
        ['Ofensiva protegida ❄️', (pl) => ({ ...pl, streakFreeze: (pl.streakFreeze || 0) + 1 })],
        ['Dobro de XP por 2h ⚡', (pl) => ({ ...pl, xpBoostUntil: Date.now() + 2 * 3600 * 1000 })],
      ];
      const [msg, fn] = premios[Math.floor(Math.random() * premios.length)];
      return { player: fn(p), msg: `🎡 A roda girou: ${msg}` };
    }
    case 'golpe_boss': {
      if (!p.bossActive) return { player: p, msg: 'Nenhum boss ativo — guarde o golpe para a próxima batalha ⚔️' };
      const dmg = bossDamage(p, 150);
      p = dmg.player;
      if (dmg.defeated) { p = addCoins(p, 50); return { player: p, msg: '⚔️ GOLPE FATAL! Boss derrotado (+50 🪙)' }; }
      return { player: p, msg: '⚔️ Golpe devastador: -150 de HP no boss!' };
    }
    case 'chave_mistica': {
      // Jackpot do Sistema: moedas + dobro de XP por 24h + escudo de ofensiva.
      p = addCoins(p, 150);
      p = { ...p, xpBoostUntil: Date.now() + 24 * 3600 * 1000, streakFreeze: (p.streakFreeze || 0) + 1 };
      return { player: p, msg: '🗝️ A Chave Mística abriu o Cofre do Sistema! +150 🪙 · 2x XP por 24h · ofensiva protegida ❄️' };
    }
    case 'day_free': {
      // Dia de folga: descanse sem perder progresso — HP cheio + ofensiva protegida.
      p = healHp(p, p.maxHp);
      p = { ...p, streakFreeze: (p.streakFreeze || 0) + 1 };
      return { player: p, msg: '🌴 Dia de folga: HP cheio e ofensiva protegida — descanse sem culpa!' };
    }
    case 'buff_energia': {
      p = healHp(p, p.maxHp);
      p = { ...p, xpBoostUntil: Date.now() + 3600 * 1000 };
      return { player: p, msg: '🔋 Buff de Energia: HP cheio + 2x XP por 1h ⚡' };
    }
    case 'queima_estoque': {
      p = addCoins(p, 120);
      return { player: p, msg: '🏷️ Queima de estoque: +120 moedas para gastar no Mercado!' };
    }
    case 'abobora': {
      // Doce ou travessura (evento de Halloween).
      if (Math.random() < 0.75) { const v = 66 + Math.floor(Math.random() * 80); p = addCoins(p, v); return { player: p, msg: `🎃 Doce! +${v} moedas` }; }
      p = { ...p, xpBoostUntil: Date.now() + 3 * 3600 * 1000 };
      return { player: p, msg: '🎃 Travessura vira sorte: 2x XP por 3h!' };
    }
    // 'skip_tarefa' é tratado na aba Eventos (conclui uma missão pendente de graça).
    default: {
      // Nenhum item é inútil: fallback dá um pequeno bônus de moedas.
      p = addCoins(p, 25);
      return { player: p, msg: 'Item usado ✓ · +25 🪙' };
    }
  }
}

export function healHp(player: Player, amount: number): Player {
  const p = { ...player };
  p.hp = Math.min(p.maxHp, p.hp + amount);
  if (p.gameOver && p.hp > 0) p.gameOver = false;
  return p;
}

export function revivePlayer(player: Player): Player | null {
  const cost = 30 + (player.deaths || 0) * 10;
  if (player.coins < cost) return null;
  const p = { ...player };
  p.coins -= cost;
  p.hp = Math.round(p.maxHp * 0.5);
  p.gameOver = false;
  return p;
}

// ─── Streak ───
export function updateStreak(player: Player, last: string, todayStr: string): Player {
  const p = { ...player };
  if (last !== todayStr) {
    p.streak++;
    if (p.streak > (p.bestStreak || 0)) p.bestStreak = p.streak;
  }
  return p;
}

export function checkStreakContinuity(player: Player, last: string | null): Player {
  if (!last) return player;
  const p = { ...player };
  const yesterday = dateSub(1);
  if (last < yesterday) {
    if (p.streakFreeze > 0) {
      p.streakFreeze--;
    } else {
      p.streak = 0;
    }
  }
  return p;
}

// ─── Daily reset ───
export function applyFailDamage(missions: Mission[], settings: { hardcoreFail?: boolean; hardcoreHp?: boolean; gentleMode?: boolean }): number {
  if (!settings.hardcoreFail || settings.gentleMode) return 0;
  const yesterday = dateSub(1);
  let hpLost = 0;
  for (const m of missions) {
    if (!m.done && m.date && m.date <= yesterday && !m.isDaily && m.type !== 'habit') {
      if (settings.hardcoreHp) hpLost += 10;
    }
  }
  return hpLost;
}

// Reset diário: zera XP do dia, aplica continuidade da ofensiva, dano por missões
// falhadas (hardcore), reabre missões diárias/hábitos e arquiva missões únicas
// concluídas no histórico. Roda 1x quando o dia vira.
export function applyDailyReset(
  player: Player,
  missions: Mission[],
  lastReset: string | null,
  settings: { hardcoreFail?: boolean; hardcoreHp?: boolean; gentleMode?: boolean },
): { player: Player; missions: Mission[]; history: Mission[]; changed: boolean } {
  const t = today();
  if (lastReset === t) return { player, missions, history: [], changed: false };

  let p = { ...player };
  const hpLost = applyFailDamage(missions, settings);
  if (hpLost > 0) p = damageHp(p, hpLost, settings);
  p = checkStreakContinuity(p, lastReset);
  p.dailyXp = 0;
  p.metaBatidaHoje = false;
  // O humor do mascote cai um pouco a cada dia — carinho/petisco/meta batida recuperam.
  if (p.pet) p.pet = { ...p.pet, humor: Math.max(0, (p.pet.humor ?? 70) - 12) };

  // Missões únicas concluídas saem do Campo e vão para o histórico (Configurações).
  const history = missions.filter((m) => m.done && m.type === 'mission');
  const nextMissions = missions
    .filter((m) => !(m.done && m.type === 'mission'))
    .map((m) =>
      m.type === 'daily' || m.type === 'habit'
        ? { ...m, done: false, completedAt: null, date: t }
        : m,
    );

  return { player: p, missions: nextMissions, history, changed: true };
}

// Libera automaticamente troféus/títulos do Hall cujo requisito (auto) foi
// atingido — eles "surgem" prontos para resgate.
export function checkHallUnlocks(
  player: Player,
  hall: Trofeu[],
  extras: { aguaDias: number; livrosLidos: number },
): { hall: Trofeu[]; changed: boolean; novos: string[] } {
  const atingiu = (a: NonNullable<Trofeu['auto']>): boolean => {
    switch (a.tipo) {
      case 'level': return player.level >= a.valor;
      case 'streak': return Math.max(player.streak || 0, player.bestStreak || 0) >= a.valor;
      case 'boss': return (player.bossDefeated || 0) >= a.valor;
      case 'missoes': return (player.totalMissionsDone || 0) >= a.valor;
      case 'foco': return (player.totalFocusMinutes || 0) >= a.valor;
      case 'moedas': return player.coins >= a.valor;
      case 'agua': return extras.aguaDias >= a.valor;
      case 'livros': return extras.livrosLidos >= a.valor;
    }
  };
  let changed = false;
  const novos: string[] = [];
  const next = hall.map((h) => {
    if (h.auto && h.status === 'disponivel' && !h.liberado && atingiu(h.auto)) {
      changed = true;
      novos.push(h.nome);
      return { ...h, liberado: true };
    }
    return h;
  });
  return { hall: next, changed, novos };
}

// ─── Eventos automáticos (como evento de jogo) ───
// Aleatórios: sorteio diário determinístico (25% de chance por dia, mesmo
// resultado se rodar de novo no mesmo dia), até 2 simultâneos, duração da
// própria template — o intervalo entre eventos fica irregular de verdade.
// Sazonais: janelas fixas do calendário (Natal, Carnaval...). Podem coexistir.
function addDaysStr(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return ymdLocal(new Date(y, m - 1, d + days));
}

export function spawnAutoEvents(eventos: EventosState): { eventos: EventosState; changed: boolean; novos: string[] } {
  const t = today();
  const [ano, mes] = t.split('-').map(Number);
  const lista = [...(eventos.eventos || [])];
  const novos: string[] = [];

  const criar = (id: string, tpl: EventoTemplate, inicio: string, fim: string) => {
    if (lista.some((e) => e.id === id)) return;
    lista.push({
      id, nome: tpl.nome, descricao: tpl.descricao, inicio, fim,
      recompensa: tpl.recompensa, recompensaCoins: tpl.coins, recompensaEfeito: tpl.efeito,
      recompensaIcon: tpl.icon, status: 'ativo', resgatado: false, mod: tpl.mod,
    });
    novos.push(tpl.nome);
  };

  // Sazonais — janela pode cruzar o ano (ex.: Virada de Ano).
  for (const s of SEASONAL_EVENTS) {
    const cruzaAno = s.inicio[0] > s.fim[0];
    const anoInicio = cruzaAno && mes <= s.fim[0] ? ano - 1 : ano;
    const ini = `${anoInicio}-${String(s.inicio[0]).padStart(2, '0')}-${String(s.inicio[1]).padStart(2, '0')}`;
    const anoFim = cruzaAno ? anoInicio + 1 : anoInicio;
    const fim = `${anoFim}-${String(s.fim[0]).padStart(2, '0')}-${String(s.fim[1]).padStart(2, '0')}`;
    if (t >= ini && t <= fim) criar(`ev_sazonal_${s.key}_${anoInicio}`, s, ini, fim);
  }

  // Aleatórios — no máximo 2 ativos ao mesmo tempo.
  const randAtivos = lista.filter((e) => e.id.startsWith('ev_rand_') && e.fim >= t).length;
  if (randAtivos < 2 && hashCode('spawn' + t) % 100 < 25) {
    const tpl = RANDOM_EVENT_POOL[hashCode('pick' + t) % RANDOM_EVENT_POOL.length];
    const jaAtivo = lista.some((e) => e.nome === tpl.nome && e.fim >= t);
    if (!jaAtivo) criar('ev_rand_' + t, tpl, t, addDaysStr(t, tpl.dur - 1));
  }

  return { eventos: { ...eventos, eventos: lista }, changed: novos.length > 0, novos };
}

// Eventos em andamento hoje (para exibir e para os multiplicadores).
export function activeEvents(eventos: EventosState) {
  const t = today();
  return (eventos.eventos || []).filter((e) => e.inicio && e.fim && t >= e.inicio && t <= e.fim);
}

// Bônus/ônus combinados dos eventos ativos: multiplicam XP e moedas de tudo.
export function activeEventMods(eventos: EventosState): { xpMult: number; coinsMult: number } {
  let xp = 1, coins = 1;
  for (const e of activeEvents(eventos)) {
    if (e.mod?.xpMult) xp *= e.mod.xpMult;
    if (e.mod?.coinsMult) coins *= e.mod.coinsMult;
  }
  return { xpMult: xp, coinsMult: coins };
}

// Vira o dia da água: arquiva os copos do dia que terminou no histórico e zera o contador.
export function applyAguaReset(agua: Agua, lastReset: string | null): Agua {
  if (!lastReset || agua.copos <= 0) return { ...agua, copos: 0 };
  return {
    ...agua,
    copos: 0,
    historico: { ...agua.historico, [lastReset]: { copos: agua.copos, completou: agua.copos >= agua.meta } },
  };
}

// ─── Loot box ───
export function rollLootBox(): string | null {
  if (Math.random() >= 0.25) return null;
  const drops = ['coins_5', 'hp_10', 'potion'];
  return drops[Math.floor(Math.random() * drops.length)];
}

export function openLootBox(tier: 'bronze' | 'silver' | 'gold'): { rarity: string; coins: number; hp: number } {
  const tables: Record<string, { rarity: string; coins: number; hp: number }[]> = {
    bronze: [
      { rarity: 'comum', coins: 3, hp: 5 },
      { rarity: 'raro', coins: 10, hp: 15 },
    ],
    silver: [
      { rarity: 'raro', coins: 10, hp: 15 },
      { rarity: 'epico', coins: 25, hp: 30 },
    ],
    gold: [
      { rarity: 'epico', coins: 25, hp: 30 },
      { rarity: 'lendario', coins: 100, hp: 50 },
    ],
  };
  const pool = tables[tier] || tables.bronze;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Boss ───
export function spawnBoss(player: Player): Player {
  const p = { ...player };
  const idx = Math.min(Math.floor(p.bossDefeated || 0), BOSSES.length - 1);
  const b = BOSSES[idx];
  p.bossName = b.name;
  p.bossLore = b.lore;
  p.bossMaxHp = b.hp + (p.bossDefeated || 0) * 30;
  p.bossHp = p.bossMaxHp;
  p.bossActive = true;
  p.bossIcon = b.icon;
  return p;
}

export function bossDamage(player: Player, amount: number): { player: Player; defeated: boolean } {
  const p = { ...player };
  if (!p.bossActive) return { player: p, defeated: false };
  p.bossHp = Math.max(0, (p.bossHp || 0) - amount);
  if (p.bossHp <= 0) {
    p.bossActive = false;
    p.bossDefeated = (p.bossDefeated || 0) + 1;
    // Derrotado é derrotado: o próximo boss só surge no dia seguinte (meia-noite local).
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    p.bossCooldownUntil = d.getTime();
    return { player: p, defeated: true };
  }
  return { player: p, defeated: false };
}

// ─── Pet ───
export function getPetStage(streak: number): number {
  let stage = 0;
  PET_STREAK_REQ.forEach((req, i) => { if (streak >= req) stage = i; });
  return stage;
}

export function updatePet(player: Player): { player: Player; evolved: boolean } {
  const p = { ...player };
  if (!p.pet) {
    p.pet = { name: '', stage: 0, xp: 0, evolutions: 0 };
  }
  const newStage = getPetStage(p.streak || 0);
  const evolved = newStage > (p.pet.stage || 0);
  if (evolved) {
    p.pet.stage = newStage;
    p.pet.evolutions = (p.pet.evolutions || 0) + 1;
  }
  p.pet.xp = (p.pet.xp || 0) + 1;
  return { player: p, evolved };
}

// Ícone do mascote conforme a espécie escolhida e o estágio atual.
export function getPetIcon(pet: Pet | undefined): string {
  const stage = pet?.stage || 0;
  const sp = PET_SPECIES.find((s) => s.id === pet?.especie) || PET_SPECIES[0];
  return sp.stages[Math.min(stage, sp.stages.length - 1)];
}

// Carinho diário: 1x por dia — humor sobe e o mascote traz um presentinho em moedas.
export function petCarinho(player: Player): { player: Player; msg: string } | null {
  const t = today();
  const pet = player.pet || { name: '', stage: 0, xp: 0, evolutions: 0 };
  if (pet.lastCarinho === t) return null;
  const moedas = 3 + (pet.stage || 0) * 2;
  const p = addCoins(player, moedas);
  return {
    player: { ...p, pet: { ...pet, humor: Math.min(100, (pet.humor ?? 70) + 15), xp: (pet.xp || 0) + 2, lastCarinho: t } },
    msg: `Seu mascote amou o carinho! +15 humor · ele trouxe ${moedas} 🪙 pra você`,
  };
}

// Petisco: custa 10 moedas, humor sobe bastante. Sem limite (o custo regula).
export function petPetisco(player: Player): { player: Player; msg: string } | null {
  const afterSpend = spendCoins(player, 10);
  if (!afterSpend) return null;
  const pet = afterSpend.pet || { name: '', stage: 0, xp: 0, evolutions: 0 };
  return {
    player: { ...afterSpend, pet: { ...pet, humor: Math.min(100, (pet.humor ?? 70) + 25), xp: (pet.xp || 0) + 5 } },
    msg: 'Nham! Seu mascote devorou o petisco 🍖 (+25 humor)',
  };
}

// ─── Attributes ───
export function incrementAtributo(player: Player, skill: string): Player {
  const p = { ...player };
  const attr = CATEGORY_ATTR_MAP[skill as keyof typeof CATEGORY_ATTR_MAP];
  if (attr && p.atributos) {
    p.atributos[attr] = (p.atributos[attr] || 0) + 1;
  }
  return p;
}

// ─── League ───
export function generateLeaguePlayers(playerName: string, playerAvatar: string, playerXp: number, dateSeed: string) {
  const BOT_NAMES = ['Alex', 'Bia', 'Cadu', 'Duda', 'Eva', 'Fábio', 'Gabi', 'Hugo', 'Isa', 'Joca'];
  const BOT_AVATARS = ['😺', '🦊', '🐉', '🦅', '🐺', '🐱', '🦁', '🐸', '🦄', '🐲'];
  const rng = hashCode(dateSeed);
  const bots = BOT_NAMES.map((n, i) => ({
    name: n,
    xp: Math.floor(((rng + i * 1337) % 5000) / 10) + 50,
    avatar: BOT_AVATARS[i],
    bot: true,
  }));
  const all: ({ name: string; xp: number; avatar: string; bot: boolean; rank: number })[] = [
    { name: playerName, xp: playerXp, avatar: playerAvatar, bot: false, rank: 0 },
    ...bots.map(b => ({ ...b, rank: 0 })),
  ].sort((a, b) => b.xp - a.xp);
  all.forEach((pl, i) => { pl.rank = i + 1; });
  return all;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// ─── Achievement check ───
export function checkAchievement(player: Player, achievementId: string): boolean {
  const p = player;
  switch (achievementId) {
    case 'first_mission': return (p.totalMissionsDone || 0) >= 1;
    case 'level_5': return p.level >= 5;
    case 'level_10': return p.level >= 10;
    case 'level_20': return p.level >= 20;
    case 'level_50': return p.level >= 50;
    case 'first_coin': return p.coins >= 1;
    case 'hoard_100': return p.coins >= 100;
    case 'streak_7': return (p.streak || p.bestStreak || 0) >= 7;
    case 'streak_30': return (p.streak || p.bestStreak || 0) >= 30;
    case 'missions_50': return (p.totalMissionsDone || 0) >= 50;
    case 'boss_killer': return (p.bossDefeated || 0) >= 1;
    default: return false;
  }
}

// ─── Mission helpers ───
export function createMission(data: {
  title: string; description?: string; skill?: string; difficulty: Difficulty;
  type: 'mission' | 'daily' | 'habit'; startDate?: string; dueDate?: string;
}): Mission {
  return {
    id: uid(),
    title: data.title,
    description: data.description || '',
    skill: data.skill,
    difficulty: data.difficulty,
    done: false,
    date: today(),
    createdAt: new Date().toISOString(),
    completedAt: null,
    isDaily: data.type === 'daily',
    reward: calcReward(data.difficulty),
    type: data.type,
    startDate: data.startDate || null,
    dueDate: data.dueDate || null,
    subtasks: [],
    rewardedOn: null,
  };
}

export function completeMission(mission: Mission): Mission {
  return {
    ...mission,
    done: true,
    completedAt: new Date().toISOString(),
  };
}

// Recompensa por qualquer atividade de vida real (água, treino, leitura, casa...):
// XP com cap diário, moedas, atributo, ofensiva/pet e boss automático — o mesmo
// fluxo das missões, para toda aba do app alimentar o jogo.
export function applyActivityReward(
  player: Player,
  settings: { maxDailyXp: number; dailyXpGoal: number },
  reward: { xp: number; coins?: number; skill?: string },
  mods?: { xpMult?: number; coinsMult?: number },
): { player: Player; leveledUp: boolean; bossDefeated: boolean } {
  const beforeLevel = player.level;
  // Bônus/ônus de eventos ativos multiplicam XP e moedas.
  const xpFinal = Math.max(0, Math.round(reward.xp * (mods?.xpMult ?? 1)));
  const coinsFinal = Math.round((reward.coins || 0) * (mods?.coinsMult ?? 1));
  let p = addXP(player, xpFinal, settings, reward.skill);
  if (coinsFinal) p = addCoins(p, coinsFinal);
  if (reward.skill) p = incrementAtributo(p, reward.skill);

  // Ofensiva: ao bater a meta diária de XP, conta como dia ativo e evolui o pet
  // (que também fica mais feliz por ver você cumprindo a meta).
  if (!p.metaBatidaHoje && (p.dailyXp || 0) >= (settings.dailyXpGoal || 100)) {
    p.metaBatidaHoje = true;
    p.streak = (p.streak || 0) + 1;
    if (p.streak > (p.bestStreak || 0)) p.bestStreak = p.streak;
    p = updatePet(p).player;
    if (p.pet) p = { ...p, pet: { ...p.pet, humor: Math.min(100, (p.pet.humor ?? 70) + 10) } };
  }

  // Boss automático: invoca um se não houver E o respawn liberou (dia seguinte
  // à última derrota) — derrotar de novo exige esperar ele surgir.
  if (!p.bossActive && Date.now() >= (p.bossCooldownUntil || 0)) p = spawnBoss(p);
  const dmg = bossDamage(p, xpFinal);
  p = dmg.player;
  if (dmg.defeated) p = addCoins(p, 50); // bônus por derrotar o chefe

  return { player: p, leveledUp: p.level > beforeLevel, bossDefeated: dmg.defeated };
}

// Fluxo completo ao concluir uma missão: recompensa padrão + contadores de missão.
export function applyMissionComplete(
  player: Player,
  mission: Mission,
  settings: { maxDailyXp: number; dailyXpGoal: number },
  mods?: { xpMult?: number; coinsMult?: number },
): { player: Player; leveledUp: boolean; bossDefeated: boolean } {
  const skill = typeof mission.skill === 'string' ? mission.skill : undefined;
  const res = applyActivityReward(player, settings, { xp: mission.reward.xp, coins: mission.reward.coins, skill }, mods);
  const p = { ...res.player };
  p.totalMissionsDone = (p.totalMissionsDone || 0) + 1;
  if (mission.type === 'habit') p.totalHabitsDone = (p.totalHabitsDone || 0) + 1;
  return { player: p, leveledUp: res.leveledUp, bossDefeated: res.bossDefeated };
}

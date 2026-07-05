import type { Player, Difficulty, Mission, Reward, Boss, Agua, Trofeu, EventosState } from './types';
import { LEVELS, TITLES_EXTENDED, DIFFICULTIES, CATEGORY_ATTR_MAP, BOSSES, PET_STREAK_REQ, DEFAULT_EVENT_POOL } from './constants';

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
  const boosted = (player.xpBoostUntil && player.xpBoostUntil > Date.now()) ? amount * 2 : amount;
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
    case 'heal_full': p = healHp(p, p.maxHp); return { player: p, msg: 'HP totalmente restaurado ❤️' };
    case 'heal_30': p = healHp(p, 30); return { player: p, msg: '+30 HP 🧪' };
    case 'coins_50': p = addCoins(p, 50); return { player: p, msg: '+50 moedas 🪙' };
    case 'coins_100': p = addCoins(p, 100); return { player: p, msg: '+100 moedas 🪙' };
    case 'freeze': p = { ...p, streakFreeze: (p.streakFreeze || 0) + 1 }; return { player: p, msg: 'Ofensiva protegida ❄️' };
    default: return { player: p, msg: 'Item usado ✓' };
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

// Evento automático da semana: escolhe da pool pela chave da semana e cria se
// ainda não existir (id determinístico ev_auto_<segunda-feira>).
export function spawnWeeklyEvent(eventos: EventosState): { eventos: EventosState; changed: boolean; novo?: string } {
  const wk = getWeekStart();
  const id = 'ev_auto_' + wk;
  if ((eventos.eventos || []).some((e) => e.id === id)) return { eventos, changed: false };
  const tpl = DEFAULT_EVENT_POOL[hashCode(wk) % DEFAULT_EVENT_POOL.length];
  const [y, m, d] = wk.split('-').map(Number);
  const fimDate = new Date(y, m - 1, d + 6);
  const fim = `${fimDate.getFullYear()}-${String(fimDate.getMonth() + 1).padStart(2, '0')}-${String(fimDate.getDate()).padStart(2, '0')}`;
  const novo = {
    id, nome: tpl.nome, descricao: tpl.descricao, inicio: wk, fim,
    recompensa: tpl.recompensa, recompensaCoins: tpl.coins, recompensaEfeito: tpl.efeito,
    recompensaIcon: tpl.icon, status: 'ativo' as const, resgatado: false,
  };
  return { eventos: { ...eventos, eventos: [...(eventos.eventos || []), novo] }, changed: true, novo: tpl.nome };
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
): { player: Player; leveledUp: boolean; bossDefeated: boolean } {
  const beforeLevel = player.level;
  let p = addXP(player, reward.xp, settings, reward.skill);
  if (reward.coins) p = addCoins(p, reward.coins);
  if (reward.skill) p = incrementAtributo(p, reward.skill);

  // Ofensiva: ao bater a meta diária de XP, conta como dia ativo e evolui o pet.
  if (!p.metaBatidaHoje && (p.dailyXp || 0) >= (settings.dailyXpGoal || 100)) {
    p.metaBatidaHoje = true;
    p.streak = (p.streak || 0) + 1;
    if (p.streak > (p.bestStreak || 0)) p.bestStreak = p.streak;
    p = updatePet(p).player;
  }

  // Boss automático: invoca um se não houver E o respawn liberou (dia seguinte
  // à última derrota) — derrotar de novo exige esperar ele surgir.
  if (!p.bossActive && Date.now() >= (p.bossCooldownUntil || 0)) p = spawnBoss(p);
  const dmg = bossDamage(p, reward.xp);
  p = dmg.player;
  if (dmg.defeated) p = addCoins(p, 50); // bônus por derrotar o chefe

  return { player: p, leveledUp: p.level > beforeLevel, bossDefeated: dmg.defeated };
}

// Fluxo completo ao concluir uma missão: recompensa padrão + contadores de missão.
export function applyMissionComplete(
  player: Player,
  mission: Mission,
  settings: { maxDailyXp: number; dailyXpGoal: number },
): { player: Player; leveledUp: boolean; bossDefeated: boolean } {
  const skill = typeof mission.skill === 'string' ? mission.skill : undefined;
  const res = applyActivityReward(player, settings, { xp: mission.reward.xp, coins: mission.reward.coins, skill });
  const p = { ...res.player };
  p.totalMissionsDone = (p.totalMissionsDone || 0) + 1;
  if (mission.type === 'habit') p.totalHabitsDone = (p.totalHabitsDone || 0) + 1;
  return { player: p, leveledUp: res.leveledUp, bossDefeated: res.bossDefeated };
}

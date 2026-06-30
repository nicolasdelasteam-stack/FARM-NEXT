import type { Difficulty, Reward, SkillName, AttrName } from './types';

export const LEVELS = [
  { level: 1,  xpNeeded: 100,  title: 'Aprendiz' },
  { level: 2,  xpNeeded: 250,  title: 'Desbravador' },
  { level: 3,  xpNeeded: 400,  title: 'Guerreiro' },
  { level: 4,  xpNeeded: 550,  title: 'Cavaleiro' },
  { level: 5,  xpNeeded: 700,  title: 'Mercenário' },
  { level: 6,  xpNeeded: 1000, title: 'Elite' },
  { level: 7,  xpNeeded: 1400, title: 'Mestre' },
  { level: 8,  xpNeeded: 1900, title: 'Sábio' },
  { level: 9,  xpNeeded: 2500, title: 'Herói' },
  { level: 10, xpNeeded: 3200, title: 'Lenda' },
];

export const TITLES_EXTENDED = [
  'Lenda', 'Imortal', 'Divino', 'Supremo', 'Absoluto',
  'Eterno', 'Cosmico', 'Transcendente', 'Onipotente', 'Zen',
];

export const DIFFICULTIES: Record<Difficulty, { label: string; reward: Reward }> = {
  facil:  { label: 'Fácil',   reward: { xp: 20,  coins: 3 } },
  media:  { label: 'Média',   reward: { xp: 40,  coins: 6 } },
  dificil:{ label: 'Difícil', reward: { xp: 70,  coins: 10 } },
};

export const SKILL_NAMES: Record<SkillName, string> = {
  destreza: 'Destreza', saude: 'Saúde', estudos: 'Estudos', gestao: 'Gestão',
};

export const CATEGORY_ATTR_MAP: Record<SkillName, AttrName> = {
  destreza: 'disciplina', saude: 'shape', estudos: 'inteligencia', gestao: 'foco',
};

export const ACHIEVEMENTS = [
  { id: 'first_mission',  name: 'Primeiro Passo',      desc: 'Conclua sua primeira missão.',                icon: '🎯', reward: 10 },
  { id: 'level_5',        name: 'Mercenário',           desc: 'Alcance o nível 5.',                          icon: '⚔️', reward: 50 },
  { id: 'level_10',       name: 'Lenda',                desc: 'Alcance o nível 10.',                         icon: '👑', reward: 100 },
  { id: 'level_20',       name: 'Imortal',              desc: 'Alcance o nível 20.',                         icon: '🌟', reward: 200 },
  { id: 'level_50',       name: 'Supremo',              desc: 'Alcance o nível 50.',                         icon: '💫', reward: 500 },
  { id: 'first_coin',     name: 'Primeira Moeda',       desc: 'Ganhe sua primeira moeda.',                    icon: '🪙', reward: 5 },
  { id: 'hoard_100',      name: 'Poupeiro',             desc: 'Acumule 100 moedas.',                         icon: '💰', reward: 50 },
  { id: 'streak_7',       name: 'Determinado',          desc: 'Mantenha 7 dias de ofensiva.',                 icon: '🔥', reward: 100 },
  { id: 'streak_30',      name: 'Lendário Streak',      desc: 'Mantenha 30 dias de ofensiva.',                icon: '💎', reward: 300 },
  { id: 'missions_50',    desc: 'Conclua 50 missões.',  name: 'Veterano',                                    icon: '🏅', reward: 100 },
  { id: 'boss_killer',    name: 'Caça-Boss',            desc: 'Derrote seu primeiro boss.',                   icon: '🗡️', reward: 100 },
];

export const BOSSES = [
  { name: 'A Procrastinação', lore: 'Sombra que sussurra "depois eu faço".', hp: 80, icon: '👿' },
  { name: 'Caos das Tarefas', lore: 'Labirinto de prazos e pendências.', hp: 120, icon: '🌀' },
  { name: 'O Desânimo', lore: 'Névoa que drena sua energia.', hp: 160, icon: '🌑' },
  { name: 'Mestre da Distração', lore: 'Gênio das notificações.', hp: 220, icon: '📱' },
  { name: 'Titã do Burnout', lore: 'Chefe final.', hp: 350, icon: '🔥' },
];

export const PET_STAGES = [
  { icon: '🥚', name: 'Ovo', desc: 'Choca com missões diárias!' },
  { icon: '🐣', name: 'Filhote', desc: 'Streak ≥ 3 para evoluir.' },
  { icon: '🐥', name: 'Jovem', desc: 'Streak ≥ 7 para evoluir.' },
  { icon: '🐦', name: 'Adulto', desc: 'Streak ≥ 14 para evoluir.' },
  { icon: '🦅', name: 'Lendário', desc: 'Streak ≥ 30.' },
];

export const PET_STREAK_REQ = [0, 3, 7, 14, 30];

export const CAPAS = [
  { name: 'Padrão', gradient: 'linear-gradient(135deg, var(--bg), var(--surface))' },
  { name: 'Noite Estrelada', gradient: 'linear-gradient(135deg, #0B0913, #1A1040, #0B0913)' },
  { name: 'Floresta', gradient: 'linear-gradient(135deg, #0B130B, #104010, #0B130B)' },
  { name: 'Fogo', gradient: 'linear-gradient(135deg, #1A0B0B, #401010, #1A0B0B)' },
  { name: 'Oceano', gradient: 'linear-gradient(135deg, #0B0B1A, #104070, #0B0B1A)' },
  { name: 'Neon', gradient: 'linear-gradient(135deg, #0B0913, #20B0D0, #A885F6)' },
];

export const LIGA_NAMES = ['Ferro', 'Bronze', 'Prata', 'Ouro', 'Diamante'];
export const BOT_NAMES = ['Alex', 'Bia', 'Cadu', 'Duda', 'Eva', 'Fábio', 'Gabi', 'Hugo', 'Isa', 'Joca'];

export const DEFAULT_PLAYER = {
  name: 'Aventureiro', avatar: '😺',
  level: 1, xp: 0, xpToNext: 100, title: 'Aprendiz',
  hp: 100, maxHp: 100, coins: 0, streak: 0,
  streakFreeze: 0, dailyCombo: 0, bestCombo: 0,
  dailyXp: 0, metaBatidaHoje: false,
  onboardingDone: false, gameOver: false, deaths: 0, bestStreak: 0,
  totalMissionsDone: 0, totalHabitsDone: 0, totalFocusMinutes: 0,
  skills: { destreza: 0, saude: 0, estudos: 0, gestao: 0 },
  customSkills: [],
  atributos: { disciplina: 0, foco: 0, inteligencia: 0, shape: 0 },
  gear: { head: null, body: null, weapon: null, accessory: null },
  bossHp: 0, bossMaxHp: 100, bossName: '', bossLore: '', bossDefeated: 0, bossActive: false,
  pet: { name: '', stage: 0, xp: 0, evolutions: 0 },
  capa: 0,
};

export const DEFAULT_SETTINGS = {
  theme: 'violeta', hardcoreFail: false, hardcoreHp: false,
  dailyXpGoal: 100, maxDailyXp: 500,
  notifyEnabled: true, notifyHour: 20, notifyMin: 0,
  soundEnabled: true, gentleMode: false,
};

export const INITIAL_MARKET = {
  items: [
    { id: 'potion', name: 'Poção de Cura', desc: 'Recupera 30 HP', cost: 15 },
    { id: 'big_potion', name: '🧪 Poção Grande', desc: 'Recupera 100% do HP', cost: 40 },
    { id: 'streak_freeze', name: '❄️ Congelar Ofensiva', desc: 'Protege sua ofensiva por 1 dia', cost: 30 },
    { id: 'xp_boost', name: '⚡ XP Boost', desc: 'Dobra o XP por 30 minutos', cost: 50 },
    { id: 'loot_bronze', name: '🎁 Baú de Bronze', desc: 'Sorteio de recompensas comuns', cost: 20 },
    { id: 'loot_silver', name: '🎁 Baú de Prata', desc: 'Sorteio com itens raros', cost: 50 },
    { id: 'loot_gold', name: '👑 Baú de Ouro', desc: 'Sorteio com itens épicos', cost: 100 },
  ],
  purchases: [] as string[],
};

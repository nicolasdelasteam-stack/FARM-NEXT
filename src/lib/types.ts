export type Difficulty = 'facil' | 'media' | 'dificil';

export type MissionType = 'mission' | 'daily' | 'habit';

export type SkillName = 'destreza' | 'saude' | 'estudos' | 'gestao';

export type AttrName = 'disciplina' | 'foco' | 'inteligencia' | 'shape';

export type Rarity = 'comum' | 'raro' | 'epico' | 'lendario';

export interface Reward {
  xp: number;
  coins: number;
}

export interface Subtask {
  name: string;
  done: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  skill?: SkillName | string;
  difficulty: Difficulty;
  done: boolean;
  date: string;
  createdAt: string;
  completedAt: string | null;
  isDaily: boolean;
  reward: Reward;
  type: MissionType;
  startDate: string | null;
  dueDate: string | null;
  subtasks: Subtask[];
}

export interface CustomSkill {
  id: string;
  name: string;
  icon: string;
  xp: number;
}

export interface Pet {
  name: string;
  stage: number;
  xp: number;
  evolutions: number;
}

export interface Agua {
  copos: number;
  meta: number;
  historico: Record<string, { copos: number; completou: boolean }>;
}

export interface MarketItem {
  id: string;
  name: string;
  desc: string;
  cost: number;
}

export interface Player {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNext: number;
  title: string;
  hp: number;
  maxHp: number;
  coins: number;
  streak: number;
  streakFreeze: number;
  dailyCombo: number;
  bestCombo: number;
  dailyXp: number;
  metaBatidaHoje: boolean;
  onboardingDone: boolean;
  gameOver: boolean;
  deaths: number;
  bestStreak: number;
  totalMissionsDone: number;
  totalHabitsDone: number;
  totalFocusMinutes: number;
  skills: Record<SkillName, number>;
  customSkills: CustomSkill[];
  atributos: Record<AttrName, number>;
  gear: { head: string | null; body: string | null; weapon: string | null; accessory: string | null };
  bossHp: number;
  bossMaxHp: number;
  bossName: string;
  bossLore: string;
  bossDefeated: number;
  bossActive: boolean;
  bossIcon?: string;
  pet: Pet;
  capa: number;
  xpBoostUntil?: number;
}

export interface Settings {
  theme: string;
  hardcoreFail: boolean;
  hardcoreHp: boolean;
  dailyXpGoal: number;
  maxDailyXp: number;
  notifyEnabled: boolean;
  notifyHour: number;
  notifyMin: number;
  soundEnabled: boolean;
  gentleMode: boolean;
}

export interface LootBoxTier {
  bronze: Rarity[];
  silver: Rarity[];
  gold: Rarity[];
}

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

// ─── FARM-NEXT extras (Fase 1) ───
export type Prioridade = 'urgente' | 'algum_dia' | 'pode_esperar';

export interface Refeicao { id: string; dia: string; horario: string; tipo: string; descricao: string; }
export interface PesoLog { id: string; data: string; peso: number; gordura: number | null; foto?: string; }
export interface Receita { id: string; nome: string; tag: string; ingredientes: string; }
export interface DietaState { refeicoes: Refeicao[]; pesos: PesoLog[]; receitas: Receita[]; }

export interface CompraItem { id: string; nome: string; icon: string; comprado: boolean; }
export interface DesejoItem { id: string; nome: string; valor: number; prioridade: Prioridade; comprado: boolean; }
export interface ComprasState { mercado: CompraItem[]; desejos: DesejoItem[]; }

export type EventoStatus = 'ativo' | 'concluido' | 'expirado';
export interface Evento { id: string; nome: string; descricao: string; inicio: string; fim: string; recompensa: string; recompensaCoins: number; recompensaEfeito?: string; recompensaIcon?: string; status: EventoStatus; resgatado: boolean; }
export interface ItemInventario { id: string; nome: string; icon: string; origem: string; usado: boolean; efeito?: string; }
export interface EventosState { eventos: Evento[]; inventario: ItemInventario[]; }

export type TrofeuTipo = 'conquista' | 'titulo' | 'trofeu' | 'medalha';
export type TrofeuStatus = 'bloqueado' | 'disponivel' | 'resgatado';
export interface Trofeu { id: string; nome: string; icon: string; descricao: string; tipo: TrofeuTipo; requisito: string; recompensaCoins: number; recompensaXp: number; status: TrofeuStatus; data: string | null; }

export type CompanionTipo = 'amigo' | 'pet' | 'parceiro' | 'familia';
export interface Companion { id: string; nome: string; tipo: CompanionTipo; emoji: string; aniversario: string; dataJuntos: string; notas: string; }

// ─── FARM-NEXT extras (Fase 2) ───
export interface TreinoPerfil { peso: number; altura: number; idade: number; sexo: 'm' | 'f'; atividade: number; objetivo: 'cutting' | 'manutencao' | 'bulking'; proteinaKg: number; gorduraKg: number; }
export interface ExercicioT { id: string; nome: string; series: number; reps: string; peso: number; }
export interface RotinaGrupo { id: string; grupo: string; exercicios: ExercicioT[]; }
export interface TreinoLog { id: string; data: string; peso: number; }
export interface TreinosState { perfil: TreinoPerfil; rotinas: RotinaGrupo[]; logs: TreinoLog[]; }

export interface MetaVisual { id: string; texto: string; img: string; }
export interface DeepWorkState { checklist: boolean[]; metas: MetaVisual[]; }

export type ViagemStatus = 'quero_ir' | 'planejando' | 'viajando' | 'ja_fui' | 'quero_voltar';
export interface ViagemItem { id: string; texto: string; grupo: string; done: boolean; }
export interface Viagem { id: string; local: string; inicio: string; fim: string; custo: number; status: ViagemStatus; itens: ViagemItem[]; }

export interface MetaAno { id: string; texto: string; done: boolean; }
export interface PlanejamentoState { ano: number; metas: MetaAno[]; prioridades: string[]; disciplina: Record<string, number>; }

export interface CasaArea { id: string; nome: string; emoji: string; objetivo: string; tarefa: string; }
export interface CasaTarefa { id: string; nome: string; freq: string; done: boolean; }
export interface CasaLembrete { id: string; texto: string; done: boolean; }
export interface CasaState { areas: CasaArea[]; tarefas: CasaTarefa[]; lembretes: CasaLembrete[]; }

export type LivroStatus = 'quero_ler' | 'lendo' | 'lido';
export interface Materia { id: string; nome: string; emoji: string; dia: string; horario: string; professor: string; resumo: string; }
export interface Livro { id: string; titulo: string; tipo: string; link: string; status: LivroStatus; progresso: number; }
export interface EstudosState { materias: Materia[]; biblioteca: Livro[]; }

// ─── FARM-NEXT extras (Finanças) ───
export interface Transacao { id: string; desc: string; valor: number; tipo: 'receita' | 'despesa'; categoria?: string; data: string; }
export interface MetaFinanceira { id: string; nome: string; icon: string; alvo: number; guardado: number; prioridade: Prioridade; }
export interface Investimento { id: string; nome: string; tipo: string; valor: number; rendimento: number; }
export interface FinancasState { transacoes: Transacao[]; metas: MetaFinanceira[]; investimentos: Investimento[]; }

// ─── FARM-NEXT extras (Boss Fight) ───
export type BossDificuldade = 'facil' | 'media' | 'dificil' | 'epico';
export type BossPeriodo = 'semanal' | 'mensal' | 'unico';
export interface Boss {
  id: string;
  nome: string;
  icon: string;
  lore: string;
  dificuldade: BossDificuldade;
  periodo: BossPeriodo;
  comoVencer: string;
  requisito: string;
  penalidade: string;
  recompensa: string;
  recompensaCoins: number;
  recompensaXp: number;
  condicao: string;
  derrotado: boolean;
  data: string | null;
}
export interface BossState { bosses: Boss[]; }

// ─── FARM-NEXT extras (Segundo Cérebro) ───
// Livros de leitura livre / que "fortalecem o cérebro" (os livros de matéria ficam em Estudos → Bibliotheca).
export interface LivroCerebro { id: string; titulo: string; autor: string; link: string; status: LivroStatus; progresso: number; }
export interface Habilidade { id: string; nome: string; icon: string; notas: string; }
export interface Ideia { id: string; texto: string; categoria: string; }
export interface CerebroState { livros: LivroCerebro[]; habilidades: Habilidade[]; ideias: Ideia[]; }

// ─── FARM-NEXT extras (Notas) ───
export interface Nota { id: string; titulo: string; conteudo: string; categoria: string; data: string; }

// ─── FARM-NEXT extras (Mídia — filmes/séries/animes, aba 12 do Notion) ───
export type MidiaStatus = 'quero_assistir' | 'assistindo' | 'assistido';
export type MidiaGrupo = 'filme' | 'serie' | 'anime';
export interface MidiaItem {
  id: string;
  titulo: string;
  capa: string;          // emoji ou URL de capa
  grupo: MidiaGrupo;
  status: MidiaStatus;
  estrelas: number;      // 0-5
  favorito: boolean;
  temporadas: number;    // total (séries/animes)
  vistas: number;        // temporadas já assistidas
}

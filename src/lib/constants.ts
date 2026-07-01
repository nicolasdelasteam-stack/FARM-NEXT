import type { Difficulty, Reward, SkillName, AttrName, Trofeu, Boss } from './types';

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

// Bosses da vida real (aba "Boss Fight" do Notion). Só aparecem no Bestiário depois de derrotados.
export const DEFAULT_BOSSES: Boss[] = [
  { id: 'b_sedentarismo', nome: 'O Sedentarismo', icon: '🛋️', lore: 'Criatura que te prende ao sofá e sussurra "amanhã eu começo".', dificuldade: 'media', periodo: 'semanal', comoVencer: 'Treinar pelo menos 4x na semana.', requisito: 'Completar 4 treinos na semana', penalidade: 'Perde 10 de HP e a ofensiva enfraquece.', recompensa: 'Poção de disposição', recompensaCoins: 80, recompensaXp: 150, condicao: 'Aparece toda segunda-feira.', derrotado: false, data: null },
  { id: 'b_acucar', nome: 'Senhor do Açúcar', icon: '🍩', lore: 'Tenta te seduzir com doces e fast food fora do plano.', dificuldade: 'media', periodo: 'semanal', comoVencer: 'Cumprir a dieta a semana toda (máx. 2 refeições livres).', requisito: 'Semana dentro da dieta', penalidade: 'Progresso de peso trava.', recompensa: 'Refeição livre garantida', recompensaCoins: 60, recompensaXp: 120, condicao: 'Aparece quando há registro de dieta.', derrotado: false, data: null },
  { id: 'b_procrastinacao', nome: 'A Procrastinação', icon: '👿', lore: 'Sombra que sussurra "depois eu faço".', dificuldade: 'dificil', periodo: 'semanal', comoVencer: 'Zerar as tarefas atrasadas até domingo.', requisito: 'Nenhuma missão vencida na semana', penalidade: 'Missões acumulam e o Caos cresce.', recompensa: 'Baú de foco', recompensaCoins: 100, recompensaXp: 200, condicao: 'Aparece com tarefas pendentes.', derrotado: false, data: null },
  { id: 'b_burnout', nome: 'Titã do Burnout', icon: '🔥', lore: 'Chefe final — surge de tanto correr sem descanso.', dificuldade: 'epico', periodo: 'mensal', comoVencer: 'Fechar o mês com disciplina alta e sono/descanso em dia.', requisito: 'Mês com disciplina ≥ 80%', penalidade: 'Reset da ofensiva e -20 HP.', recompensa: 'Título: Inabalável', recompensaCoins: 250, recompensaXp: 500, condicao: 'Aparece no último dia do mês.', derrotado: false, data: null },
];

export const BOSS_DIFICULDADE: Record<string, { label: string; color: string }> = {
  facil: { label: 'Fácil', color: 'text-emerald-400' },
  media: { label: 'Média', color: 'text-yellow-400' },
  dificil: { label: 'Difícil', color: 'text-orange-400' },
  epico: { label: 'Épico', color: 'text-red-400' },
};

export const BOSS_PERIODO: Record<string, string> = {
  semanal: 'Semanal', mensal: 'Mensal', unico: 'Único',
};

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
  rewards: [
    { id: 'fastfood', name: '🍔 Fast Food', desc: 'Um lanche liberado', cost: 40, weeklyLimit: 2 },
    { id: 'gamenight', name: '🎮 Noite de Games', desc: '2h de jogo sem culpa', cost: 30, weeklyLimit: 3 },
    { id: 'serie', name: '📺 Episódio de série', desc: 'Assistir 1 episódio', cost: 15, weeklyLimit: 0 },
    { id: 'doce', name: '🍫 Doce', desc: 'Um docinho', cost: 10, weeklyLimit: 4 },
    { id: 'folga', name: '🌴 Dia de folga', desc: 'Um dia off merecido', cost: 150, weeklyLimit: 0 },
  ] as { id: string; name: string; desc: string; cost: number; weeklyLimit: number }[],
  weekStart: '' as string,
  weekBuys: {} as Record<string, number>,
  purchases: [] as string[],
};

// ─── FARM-NEXT extras (Fase 1) ───
export const MEAL_TYPES = ['Café da manhã', 'Lanche da manhã', 'Almoço', 'Café da tarde', 'Pós-treino', 'Jantar'];
export const WEEK_DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export const PRIORIDADES: Record<string, { label: string; color: string }> = {
  urgente: { label: 'Urgente', color: 'text-red-400' },
  algum_dia: { label: 'Algum dia', color: 'text-sky-400' },
  pode_esperar: { label: 'Pode esperar', color: 'text-zinc-400' },
};

export const COMPANION_TIPOS: Record<string, { label: string; emoji: string }> = {
  amigo: { label: 'Amigo', emoji: '🤝' },
  pet: { label: 'Pet', emoji: '🐾' },
  parceiro: { label: 'Parceiro(a)', emoji: '❤️' },
  familia: { label: 'Família', emoji: '👨‍👩‍👧' },
};

export const DEFAULT_HALL: Trofeu[] = [
  { id: 'h_5kg', nome: 'Perdi 5kg', icon: '⚖️', descricao: 'Marco de transformação física.', tipo: 'trofeu', requisito: 'Perder 5kg', recompensaCoins: 100, recompensaXp: 200, status: 'disponivel', data: null },
  { id: 'h_streak30', nome: 'Constância de Ferro', icon: '🔥', descricao: '30 dias seguidos sem falhar.', tipo: 'medalha', requisito: 'Ofensiva de 30 dias', recompensaCoins: 150, recompensaXp: 300, status: 'disponivel', data: null },
  { id: 'h_boss', nome: 'Caçador de Bosses', icon: '🗡️', descricao: 'Derrotou um chefe.', tipo: 'trofeu', requisito: 'Derrotar 1 boss', recompensaCoins: 100, recompensaXp: 150, status: 'disponivel', data: null },
  { id: 'h_lenda', nome: 'Título: Lenda', icon: '👑', descricao: 'Alcançou o auge.', tipo: 'titulo', requisito: 'Chegar ao nível 10', recompensaCoins: 200, recompensaXp: 0, status: 'disponivel', data: null },
  { id: 'h_semestre', nome: 'Semestre Vencido', icon: '🎓', descricao: 'Fechou o semestre com aprovação.', tipo: 'conquista', requisito: 'Concluir o semestre', recompensaCoins: 120, recompensaXp: 250, status: 'disponivel', data: null },
];

// ─── FARM-NEXT extras (Fase 2) ───
export const ACTIVITY_LEVELS = [
  { v: 1.2, label: 'Sedentário' },
  { v: 1.375, label: 'Leve (1-3x/sem)' },
  { v: 1.55, label: 'Moderado (3-5x)' },
  { v: 1.725, label: 'Ativo (6-7x)' },
  { v: 1.9, label: 'Muito ativo' },
];
export const TREINO_OBJETIVOS: Record<string, { label: string; adj: number }> = {
  cutting: { label: 'Definição (−500 kcal)', adj: -500 },
  manutencao: { label: 'Manutenção', adj: 0 },
  bulking: { label: 'Ganho (+350 kcal)', adj: 350 },
};
export const MUSCLE_GUIDE = [
  { grupo: 'Peito', exercicios: ['Supino reto', 'Supino inclinado', 'Crucifixo', 'Crossover'], dica: 'Empurrar; controle a descida.' },
  { grupo: 'Costas', exercicios: ['Puxada frente', 'Remada curvada', 'Barra fixa', 'Serrote'], dica: 'Puxe com as costas, não com o braço.' },
  { grupo: 'Pernas', exercicios: ['Agachamento', 'Leg press', 'Cadeira extensora', 'Stiff'], dica: 'Amplitude completa, core firme.' },
  { grupo: 'Ombros', exercicios: ['Desenvolvimento', 'Elevação lateral', 'Elevação frontal'], dica: 'Sem balançar o corpo.' },
  { grupo: 'Bíceps', exercicios: ['Rosca direta', 'Rosca alternada', 'Rosca martelo'], dica: 'Cotovelo fixo.' },
  { grupo: 'Tríceps', exercicios: ['Tríceps testa', 'Tríceps corda', 'Mergulho'], dica: 'Isole o cotovelo.' },
];
export const VIAGEM_STATUS: Record<string, string> = {
  quero_ir: 'Quero ir', planejando: 'Planejando', viajando: 'Viajando', ja_fui: 'Já fui', quero_voltar: 'Quero voltar',
};
export const PACKING_TEMPLATE = ['Roupas', 'Higiene', 'Documentos', 'Eletrônicos', 'Outros'];
export const AMBIENT_SOUNDS = [
  { id: 'chuva', label: '🌧️ Chuva', type: 'lowpass', freq: 1200 },
  { id: 'cafe', label: '☕ Cafeteria', type: 'bandpass', freq: 700 },
  { id: 'vento', label: '🌬️ Vento', type: 'highpass', freq: 500 },
  { id: 'ondas', label: '🌊 Ondas', type: 'lowpass', freq: 600 },
  { id: 'fogo', label: '🔥 Fogueira', type: 'lowpass', freq: 900 },
];
export const DEEPWORK_CHECKLIST = [
  'Desligar notificações do celular',
  'Fechar abas desnecessárias',
  'Deixar o celular fora de visão',
  'Pegar garrafa de água',
  'Organizar o local de estudo/trabalho',
  'Reunir os materiais necessários',
];
export const LIVRO_TIPOS = ['Medicina', 'Negócios', 'Mentalidade', 'Ficção', 'Técnico', 'Outro'];

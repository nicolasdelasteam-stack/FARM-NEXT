import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Player, Mission, Settings, DietaState, ComprasState, EventosState, Trofeu, Companion,
  TreinosState, DeepWorkState, Viagem, PlanejamentoState, CasaState, EstudosState,
  FinancasState, BossState, CerebroState, Nota, MidiaItem,
} from './types';
import { DEFAULT_PLAYER, DEFAULT_SETTINGS, INITIAL_MARKET, DEFAULT_HALL, DEFAULT_BOSSES } from './constants';

const YEAR = new Date().getFullYear();

const D = {
  dieta: (): DietaState => ({ refeicoes: [], pesos: [], receitas: [] }),
  compras: (): ComprasState => ({ mercado: [], desejos: [] }),
  eventos: (): EventosState => ({ eventos: [], inventario: [] }),
  treinos: (): TreinosState => ({ perfil: { peso: 70, altura: 175, idade: 25, sexo: 'm', atividade: 1.55, objetivo: 'manutencao', proteinaKg: 2, gorduraKg: 1 }, rotinas: [], logs: [] }),
  deepwork: (): DeepWorkState => ({ checklist: [false, false, false, false, false, false], metas: [] }),
  viagens: (): Viagem[] => [],
  planejamento: (): PlanejamentoState => ({ ano: YEAR, metas: [], prioridades: [], disciplina: {} }),
  casa: (): CasaState => ({ areas: [], tarefas: [], lembretes: [] }),
  estudos: (): EstudosState => ({ materias: [], biblioteca: [], paginas: [] }),
  financas: (): FinancasState => ({ transacoes: [], metas: [], investimentos: [] }),
  boss: (): BossState => ({ bosses: DEFAULT_BOSSES.map((b) => ({ ...b })) }),
  cerebro: (): CerebroState => ({ livros: [], habilidades: [], ideias: [] }),
  notas: (): Nota[] => [],
  midia: (): MidiaItem[] => [],
};

export interface AppState {
  // Data
  player: Player;
  missions: Mission[];
  missionHistory: Mission[];
  settings: Settings;
  market: typeof INITIAL_MARKET;
  agua: { copos: number; meta: number; historico: Record<string, { copos: number; completou: boolean }> };
  lastDailyReset: string | null;
  ligaData: unknown;

  // FARM-NEXT slices
  dieta: DietaState;
  compras: ComprasState;
  eventos: EventosState;
  hall: Trofeu[];
  companions: Companion[];
  treinos: TreinosState;
  deepwork: DeepWorkState;
  viagens: Viagem[];
  planejamento: PlanejamentoState;
  casa: CasaState;
  estudos: EstudosState;
  financas: FinancasState;
  boss: BossState;
  cerebro: CerebroState;
  notas: Nota[];
  midia: MidiaItem[];
  achievements: string[];

  // UI
  route: string;
  view: string;

  // Actions
  setPlayer: (player: Player) => void;
  setMissions: (missions: Mission[]) => void;
  setMissionHistory: (missionHistory: Mission[]) => void;
  setSettings: (settings: Settings) => void;
  setRoute: (route: string) => void;
  setView: (view: string) => void;
  setAgua: (agua: AppState['agua']) => void;
  setLastDailyReset: (date: string | null) => void;
  setLigaData: (data: unknown) => void;
  addMission: (mission: Mission) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  removeMission: (id: string) => void;
  setMarket: (market: AppState['market']) => void;
  setDieta: (dieta: DietaState) => void;
  setCompras: (compras: ComprasState) => void;
  setEventos: (eventos: EventosState) => void;
  setHall: (hall: Trofeu[]) => void;
  setCompanions: (companions: Companion[]) => void;
  setTreinos: (treinos: TreinosState) => void;
  setDeepwork: (deepwork: DeepWorkState) => void;
  setViagens: (viagens: Viagem[]) => void;
  setPlanejamento: (planejamento: PlanejamentoState) => void;
  setCasa: (casa: CasaState) => void;
  setEstudos: (estudos: EstudosState) => void;
  setFinancas: (financas: FinancasState) => void;
  setBoss: (boss: BossState) => void;
  setCerebro: (cerebro: CerebroState) => void;
  setNotas: (notas: Nota[]) => void;
  setMidia: (midia: MidiaItem[]) => void;
  setAchievements: (achievements: string[]) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      player: { ...DEFAULT_PLAYER },
      missions: [],
      missionHistory: [],
      settings: { ...DEFAULT_SETTINGS },
      market: { ...INITIAL_MARKET, purchases: [] },
      agua: { copos: 0, meta: 8, historico: {} },
      lastDailyReset: null,
      ligaData: null,

      dieta: D.dieta(),
      compras: D.compras(),
      eventos: D.eventos(),
      hall: [...DEFAULT_HALL],
      companions: [],
      treinos: D.treinos(),
      deepwork: D.deepwork(),
      viagens: D.viagens(),
      planejamento: D.planejamento(),
      casa: D.casa(),
      estudos: D.estudos(),
      financas: D.financas(),
      boss: D.boss(),
      cerebro: D.cerebro(),
      notas: D.notas(),
      midia: D.midia(),
      achievements: [],

      route: 'dashboard',
      view: 'dashboard',

      setPlayer: (player) => set({ player }),
      setMissions: (missions) => set({ missions }),
      setMissionHistory: (missionHistory) => set({ missionHistory }),
      setSettings: (settings) => set({ settings }),
      setRoute: (route) => set({ route }),
      setView: (view) => set({ view }),
      setAgua: (agua) => set({ agua }),
      setLastDailyReset: (lastDailyReset) => set({ lastDailyReset }),
      setLigaData: (ligaData) => set({ ligaData }),
      addMission: (mission) => set((s) => ({ missions: [...s.missions, mission] })),
      updateMission: (id, updates) => set((s) => ({ missions: s.missions.map((m) => (m.id === id ? { ...m, ...updates } : m)) })),
      removeMission: (id) => set((s) => ({ missions: s.missions.filter((m) => m.id !== id) })),
      setMarket: (market) => set({ market }),
      setDieta: (dieta) => set({ dieta }),
      setCompras: (compras) => set({ compras }),
      setEventos: (eventos) => set({ eventos }),
      setHall: (hall) => set({ hall }),
      setCompanions: (companions) => set({ companions }),
      setTreinos: (treinos) => set({ treinos }),
      setDeepwork: (deepwork) => set({ deepwork }),
      setViagens: (viagens) => set({ viagens }),
      setPlanejamento: (planejamento) => set({ planejamento }),
      setCasa: (casa) => set({ casa }),
      setEstudos: (estudos) => set({ estudos }),
      setFinancas: (financas) => set({ financas }),
      setBoss: (boss) => set({ boss }),
      setCerebro: (cerebro) => set({ cerebro }),
      setNotas: (notas) => set({ notas }),
      setMidia: (midia) => set({ midia }),
      setAchievements: (achievements) => set({ achievements }),
    }),
    {
      name: 'zenite-storage',
      version: 10,
      migrate: (persisted: unknown) => {
        const p = (persisted || {}) as Record<string, unknown>;

        // v10: anti-farm — missões concluídas antigas contam como já premiadas.
        const missions = ((p.missions as Mission[]) || []).map((m) =>
          m.done && !m.rewardedOn ? { ...m, rewardedOn: (m.completedAt || '').slice(0, 10) || null } : m,
        );

        // v10: novos bosses/troféus padrão entram nos dados já salvos (merge por id);
        // troféus existentes ganham o requisito automático (auto) dos padrões.
        const bossAntigo = ((p.boss as BossState) || D.boss()).bosses || [];
        const bossMerged = [...bossAntigo, ...DEFAULT_BOSSES.filter((d) => !bossAntigo.some((b) => b.id === d.id)).map((b) => ({ ...b }))];

        const hallAntigo = (p.hall as Trofeu[]) || [...DEFAULT_HALL];
        const hallMerged = [
          ...hallAntigo.map((h) => { const d = DEFAULT_HALL.find((x) => x.id === h.id); return d?.auto && !h.auto ? { ...h, auto: d.auto } : h; }),
          ...DEFAULT_HALL.filter((d) => !hallAntigo.some((h) => h.id === d.id)),
        ];

        const market = { ...INITIAL_MARKET, ...((p.market as object) || {}) } as typeof INITIAL_MARKET;
        market.rewards = [...market.rewards, ...INITIAL_MARKET.rewards.filter((d) => !market.rewards.some((r) => r.id === d.id))];
        market.items = [...market.items, ...INITIAL_MARKET.items.filter((d) => !market.items.some((i) => i.id === d.id))];

        return {
          ...p,
          missions,
          missionHistory: p.missionHistory || [],
          dieta: p.dieta || D.dieta(),
          compras: p.compras || D.compras(),
          eventos: p.eventos || D.eventos(),
          hall: hallMerged,
          companions: p.companions || [],
          treinos: p.treinos || D.treinos(),
          deepwork: p.deepwork || D.deepwork(),
          viagens: p.viagens || D.viagens(),
          planejamento: p.planejamento || D.planejamento(),
          casa: p.casa || D.casa(),
          estudos: { ...D.estudos(), ...((p.estudos as object) || {}) }, // v9: + paginas (estilo Notion)
          financas: { ...D.financas(), ...((p.financas as object) || {}) },
          boss: { bosses: bossMerged },
          cerebro: p.cerebro || D.cerebro(),
          notas: p.notas || D.notas(),
          midia: p.midia || D.midia(),
          achievements: p.achievements || [],
          market,
        } as AppState;
      },
    }
  )
);

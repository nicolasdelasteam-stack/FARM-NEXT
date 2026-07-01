import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Player, Mission, Settings, DietaState, ComprasState, EventosState, Trofeu, Companion,
  TreinosState, DeepWorkState, Viagem, PlanejamentoState, CasaState, EstudosState,
} from './types';
import { DEFAULT_PLAYER, DEFAULT_SETTINGS, INITIAL_MARKET, DEFAULT_HALL } from './constants';

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
  estudos: (): EstudosState => ({ materias: [], biblioteca: [] }),
};

export interface AppState {
  // Data
  player: Player;
  missions: Mission[];
  settings: Settings;
  market: typeof INITIAL_MARKET;
  agua: { copos: number; meta: number; historico: Record<string, { copos: number; completou: boolean }> };
  lastDailyReset: string | null;
  ligaData: any | null;

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

  // UI
  route: string;
  view: string;

  // Actions
  setPlayer: (player: Player) => void;
  setMissions: (missions: Mission[]) => void;
  setSettings: (settings: Settings) => void;
  setRoute: (route: string) => void;
  setView: (view: string) => void;
  setAgua: (agua: AppState['agua']) => void;
  setLastDailyReset: (date: string | null) => void;
  setLigaData: (data: any) => void;
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
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      player: { ...DEFAULT_PLAYER },
      missions: [],
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

      route: 'dashboard',
      view: 'dashboard',

      setPlayer: (player) => set({ player }),
      setMissions: (missions) => set({ missions }),
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
    }),
    {
      name: 'zenite-storage',
      version: 3,
      migrate: (persisted: unknown) => {
        const p = (persisted || {}) as Record<string, unknown>;
        return {
          ...p,
          dieta: p.dieta || D.dieta(),
          compras: p.compras || D.compras(),
          eventos: p.eventos || D.eventos(),
          hall: p.hall || [...DEFAULT_HALL],
          companions: p.companions || [],
          treinos: p.treinos || D.treinos(),
          deepwork: p.deepwork || D.deepwork(),
          viagens: p.viagens || D.viagens(),
          planejamento: p.planejamento || D.planejamento(),
          casa: p.casa || D.casa(),
          estudos: p.estudos || D.estudos(),
          market: { ...INITIAL_MARKET, ...((p.market as object) || {}) },
        } as AppState;
      },
    }
  )
);

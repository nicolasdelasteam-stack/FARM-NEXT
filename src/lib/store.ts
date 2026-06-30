import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, Mission, Settings } from './types';
import { DEFAULT_PLAYER, DEFAULT_SETTINGS, INITIAL_MARKET } from './constants';

export interface AppState {
  // Data
  player: Player;
  missions: Mission[];
  settings: Settings;
  market: typeof INITIAL_MARKET;
  agua: { copos: number; meta: number; historico: Record<string, { copos: number; completou: boolean }> };
  lastDailyReset: string | null;
  ligaData: any | null;

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
      updateMission: (id, updates) =>
        set((s) => ({
          missions: s.missions.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),
      removeMission: (id) =>
        set((s) => ({ missions: s.missions.filter((m) => m.id !== id) })),
    }),
    {
      name: 'zenite-storage',
      version: 1,
    }
  )
);

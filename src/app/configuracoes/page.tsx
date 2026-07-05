'use client';

import { useStore } from '@/lib/store';
import NotifSettings from '@/components/NotifSettings';
import CloudSettings from '@/components/CloudSettings';

export default function ConfigPage() {
  const player = useStore((s) => s.player);
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const missionHistory = useStore((s) => s.missionHistory);
  const setMissionHistory = useStore((s) => s.setMissionHistory);

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-black">⚙️ Configurações</h1>

      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <h3 className="font-bold text-sm mb-3">👤 Perfil</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Nome</label>
            <input className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
              defaultValue={player.name} placeholder="Seu nome" />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Avatar</label>
            <input className="w-20 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-lg text-center"
              defaultValue={player.avatar || '😺'} />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <h3 className="font-bold text-sm mb-3">🎯 Meta Diária de XP</h3>
        <div className="flex gap-2">
          {[50, 100, 150, 200, 500].map((v) => (
            <button key={v} onClick={() => setSettings({ ...settings, dailyXpGoal: v })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                settings.dailyXpGoal === v ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <h3 className="font-bold text-sm mb-3">⚔️ Hardcore</h3>
        <div className="space-y-2 text-sm">
          {(['hardcoreFail', 'hardcoreHp', 'gentleMode', 'soundEnabled'] as const).map((key) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <span className="text-zinc-400">{settingsLabel(key)}</span>
              <input type="checkbox" checked={settings[key] as boolean} onChange={() => setSettings({ ...settings, [key]: !settings[key] })}
                className="w-4 h-4 accent-indigo-500" />
            </label>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm">📜 Histórico de missões</h3>
          {missionHistory.length > 0 && (
            <button onClick={() => setMissionHistory([])} className="text-xs text-zinc-600 hover:text-red-400">Limpar</button>
          )}
        </div>
        {missionHistory.length === 0 ? (
          <p className="text-xs text-zinc-500">Missões únicas concluídas são arquivadas aqui na virada do dia.</p>
        ) : (
          <div className="space-y-1 max-h-72 overflow-y-auto">
            {[...missionHistory].reverse().map((m) => (
              <div key={m.id} className="flex items-center gap-2 text-sm border-b border-zinc-800/60 py-1.5">
                <span className="text-emerald-500">✓</span>
                <span className="flex-1 truncate text-zinc-300">{m.title}</span>
                <span className="text-[11px] text-indigo-400 font-semibold shrink-0">+{m.reward?.xp || 0} XP</span>
                <span className="text-[11px] text-zinc-600 shrink-0">{m.completedAt ? new Date(m.completedAt).toLocaleDateString('pt-BR') : ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <NotifSettings />
      <CloudSettings />
    </div>
  );
}

function settingsLabel(key: string): string {
  const map: Record<string, string> = {
    hardcoreFail: 'Perder HP ao falhar missões',
    hardcoreHp: 'Dano de HP no Hardcore',
    gentleMode: 'Modo Gentil (sem punição)',
    soundEnabled: 'Sons ativados',
  };
  return map[key] || key;
}

'use client';

import { useStore } from '@/lib/store';
import NotifSettings from '@/components/NotifSettings';
import CloudSettings from '@/components/CloudSettings';

export default function ConfigPage() {
  const player = useStore((s) => s.player);
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);

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
                settings.dailyXpGoal === v ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
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
                className="w-4 h-4 accent-violet-500" />
            </label>
          ))}
        </div>
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

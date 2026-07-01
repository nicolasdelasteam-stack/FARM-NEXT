'use client';

import { useStore } from '@/lib/store';
import { requestNotifyPermission, sendNotification, canNotify } from '@/lib/notify';

export default function NotifSettings() {
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const enable = async () => {
    const ok = await requestNotifyPermission();
    setSettings({ ...settings, notifyEnabled: ok });
    if (ok) sendNotification('ZÊNITE', 'Notificações ativadas ✅');
  };
  return (
    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
      <h3 className="font-bold text-sm mb-3">🔔 Notificações</h3>
      {!canNotify() && <p className="text-xs text-zinc-500">Seu navegador não suporta notificações.</p>}
      <label className="flex items-center justify-between text-sm mb-3 cursor-pointer">
        <span className="text-zinc-400">Lembretes ativados</span>
        <input type="checkbox" checked={settings.notifyEnabled} onChange={enable} className="w-4 h-4 accent-violet-500" />
      </label>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-zinc-400">Horário do lembrete diário</span>
        <input type="number" min={0} max={23} value={settings.notifyHour} onChange={(e) => setSettings({ ...settings, notifyHour: Math.min(23, Math.max(0, parseInt(e.target.value) || 0)) })} className="w-14 bg-zinc-800 border border-zinc-700 rounded px-2 py-1" />
        <span>:</span>
        <input type="number" min={0} max={59} value={settings.notifyMin} onChange={(e) => setSettings({ ...settings, notifyMin: Math.min(59, Math.max(0, parseInt(e.target.value) || 0)) })} className="w-14 bg-zinc-800 border border-zinc-700 rounded px-2 py-1" />
      </div>
      <button onClick={() => sendNotification('ZÊNITE', 'Notificação de teste 🎯')} className="mt-3 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">Testar notificação</button>
    </div>
  );
}

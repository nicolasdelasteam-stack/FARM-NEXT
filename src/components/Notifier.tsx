'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { canNotify, sendNotification } from '@/lib/notify';
import { applyDailyReset, today } from '@/lib/engine';

export default function Notifier() {
  const settings = useStore((s) => s.settings);
  const eventos = useStore((s) => s.eventos);

  // Reset diário (ofensiva, XP do dia, missões diárias) — roda no mount e a cada minuto,
  // lendo o estado fresco via getState() para não recriar o efeito nem entrar em loop.
  useEffect(() => {
    const check = () => {
      const s = useStore.getState();
      const res = applyDailyReset(s.player, s.missions, s.lastDailyReset, s.settings);
      if (res.changed) {
        s.setPlayer(res.player);
        s.setMissions(res.missions);
        s.setLastDailyReset(today());
      }
    };
    check();
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!canNotify()) return;
    const tick = () => {
      if (!settings.notifyEnabled || Notification.permission !== 'granted') return;
      const now = new Date();
      const key = now.toISOString().slice(0, 10);
      if (now.getHours() === settings.notifyHour && now.getMinutes() === settings.notifyMin) {
        if (localStorage.getItem('notif_daily') !== key) {
          localStorage.setItem('notif_daily', key);
          sendNotification('ZÊNITE', 'Hora de manter sua ofensiva hoje! 🔥');
        }
      }
      (eventos?.eventos || []).forEach((e) => {
        if (!e.resgatado && e.fim === key) {
          const k = 'notif_ev_' + e.id + '_' + key;
          if (!localStorage.getItem(k)) { localStorage.setItem(k, '1'); sendNotification('Evento terminando', `"${e.nome}" termina hoje — resgate!`); }
        }
      });
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [settings, eventos]);

  return null;
}

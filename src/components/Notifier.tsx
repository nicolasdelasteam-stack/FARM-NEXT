'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { canNotify, sendNotification } from '@/lib/notify';

export default function Notifier() {
  const settings = useStore((s) => s.settings);
  const eventos = useStore((s) => s.eventos);

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

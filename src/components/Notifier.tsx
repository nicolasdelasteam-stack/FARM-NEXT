'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { canNotify, sendNotification } from '@/lib/notify';
import { applyDailyReset, applyAguaReset, checkHallUnlocks, spawnAutoEvents, today } from '@/lib/engine';

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
        // Missões únicas concluídas vão para o histórico (Configurações).
        if (res.history.length > 0) s.setMissionHistory([...s.missionHistory, ...res.history]);
        // Virada do dia também arquiva/zera a água e reabre o checklist de foco.
        s.setAgua(applyAguaReset(s.agua, s.lastDailyReset));
        s.setDeepwork({ ...s.deepwork, checklist: (s.deepwork.checklist || []).map(() => false) });
        s.setLastDailyReset(today());
      }

      // Troféus/títulos com requisito automático surgem sozinhos no Hall.
      const aguaDias = Object.values(s.agua.historico || {}).filter((h) => h.completou).length;
      const livrosLidos = (s.estudos.biblioteca || []).filter((l) => l.status === 'lido').length
        + (s.cerebro.livros || []).filter((l) => l.status === 'lido').length;
      const hu = checkHallUnlocks(s.player, s.hall, { aguaDias, livrosLidos });
      if (hu.changed) {
        s.setHall(hu.hall);
        hu.novos.forEach((n) => sendNotification('🏛️ Hall da Glória', `"${n}" desbloqueado — resgate sua recompensa!`));
      }

      // Eventos automáticos: sazonais (datas fixas) + aleatórios (sorteio diário).
      const ev = spawnAutoEvents(s.eventos);
      if (ev.changed) {
        s.setEventos(ev.eventos);
        ev.novos.forEach((n) => sendNotification('🎉 Novo evento!', `"${n}" começou — veja em Eventos!`));
      }

      // Bosses no automático (renasce recorrentes, penaliza prazos vencidos e
      // derrota os que cumpriram o requisito nas abas). A animação em tela é
      // disparada pela própria ação (via bossQueue → Celebration).
      const r = useStore.getState().runBossChecks();
      r.penalized.forEach((n) => sendNotification('☠️ Boss não derrotado', `"${n}" venceu o prazo — você tomou a penalidade.`));
      r.defeated.forEach((d) => sendNotification('⚔️ Boss derrotado!', `Você venceu "${d.nome}"! 🪙 +${d.coins} · ⭐ +${d.xp} XP${d.recompensa ? ` · 🎁 ${d.recompensa}` : ''}`));
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

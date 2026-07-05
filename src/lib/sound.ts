import { useStore } from './store';

// Efeitos sonoros sintetizados no navegador (Web Audio, sem arquivos de áudio):
// o feedback auditivo instantâneo de cada ação do jogo. Respeita
// settings.soundEnabled e é no-op no SSR ou sem suporte.

let ac: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!useStore.getState().settings.soundEnabled) return null;
  if (!ac) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ac = new AC();
  }
  if (ac.state === 'suspended') ac.resume();
  return ac;
}

// Cria/acorda o AudioContext num gesto do usuário (ex.: iniciar o timer da
// Caverna) para que sons disparados depois, sem clique, possam tocar.
export function unlock() {
  ctx();
}

function tone(a: AudioContext, opts: { f: number; t: number; d: number; type?: OscillatorType; g?: number; slide?: number }) {
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = opts.type || 'sine';
  const t0 = a.currentTime + opts.t;
  osc.frequency.setValueAtTime(opts.f, t0);
  if (opts.slide) osc.frequency.exponentialRampToValueAtTime(opts.slide, t0 + opts.d);
  const g = opts.g ?? 0.08;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(g, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.d);
  osc.connect(gain);
  gain.connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + opts.d + 0.05);
}

export type SoundName =
  | 'check'    // concluir missão/tarefa — pop satisfatório
  | 'ding'     // XP pequeno (água, pesagem, leitura...)
  | 'coin'     // ganhar moedas
  | 'buy'      // compra no mercado
  | 'levelup'  // subir de nível — arpejo ascendente
  | 'boss'     // boss derrotado — impacto grave + fanfarra
  | 'streak'   // ofensiva garantida — subida + brilho
  | 'fanfare'  // conquista/troféu/baú
  | 'chime'    // sessão de foco concluída — sino suave
  | 'error';   // ação inválida (sem moedas etc.)

// ─── Sons ambiente do Deep Work (arquivos reais em public/sounds) ───
// Gerência fora dos componentes (padrão da lib) para não esbarrar nas regras
// de imutabilidade do React Compiler.
const ambientes: Record<string, HTMLAudioElement> = {};

// Alterna um som ambiente; retorna true se ficou tocando, false se pausou.
export function ambientToggle(id: string, src: string, volume: number, onError: () => void): boolean {
  const atual = ambientes[id];
  if (atual && !atual.paused) { atual.pause(); return false; }
  let a = atual;
  if (!a) {
    a = new Audio(src);
    a.loop = true;
    a.preload = 'auto';
    a.onerror = onError;
    ambientes[id] = a;
  }
  a.volume = volume;
  a.play().catch(onError);
  return true;
}

export function ambientVolume(id: string, v: number) {
  const a = ambientes[id];
  if (a) a.volume = v;
}

export function ambientPauseAll() {
  Object.values(ambientes).forEach((a) => a.pause());
}

export function play(name: SoundName) {
  const a = ctx();
  if (!a) return;
  switch (name) {
    case 'check':
      tone(a, { f: 660, t: 0, d: 0.08, type: 'triangle', g: 0.1 });
      tone(a, { f: 990, t: 0.07, d: 0.14, type: 'triangle', g: 0.1 });
      break;
    case 'ding':
      tone(a, { f: 1175, t: 0, d: 0.16, type: 'sine', g: 0.07 });
      break;
    case 'coin':
      tone(a, { f: 988, t: 0, d: 0.08, type: 'square', g: 0.05 });
      tone(a, { f: 1319, t: 0.08, d: 0.18, type: 'square', g: 0.05 });
      break;
    case 'buy':
      tone(a, { f: 784, t: 0, d: 0.07, type: 'square', g: 0.05 });
      tone(a, { f: 988, t: 0.07, d: 0.07, type: 'square', g: 0.05 });
      tone(a, { f: 1319, t: 0.14, d: 0.2, type: 'square', g: 0.05 });
      break;
    case 'levelup':
      [523, 659, 784, 1047].forEach((f, i) => tone(a, { f, t: i * 0.09, d: 0.14, type: 'triangle', g: 0.09 }));
      [1047, 1319, 1568].forEach((f) => tone(a, { f, t: 0.42, d: 0.5, type: 'triangle', g: 0.06 }));
      break;
    case 'boss':
      tone(a, { f: 130, t: 0, d: 0.3, type: 'sawtooth', g: 0.12, slide: 45 });
      [392, 494, 587, 784].forEach((f, i) => tone(a, { f, t: 0.25 + i * 0.1, d: 0.18, type: 'square', g: 0.05 }));
      break;
    case 'streak':
      tone(a, { f: 330, t: 0, d: 0.3, type: 'sine', g: 0.08, slide: 990 });
      tone(a, { f: 1568, t: 0.28, d: 0.35, type: 'triangle', g: 0.07 });
      break;
    case 'fanfare':
      [523, 523, 659, 784].forEach((f, i) => tone(a, { f, t: i * 0.11, d: 0.15, type: 'square', g: 0.05 }));
      tone(a, { f: 1047, t: 0.44, d: 0.55, type: 'square', g: 0.05 });
      break;
    case 'chime':
      tone(a, { f: 880, t: 0, d: 0.6, type: 'sine', g: 0.07 });
      tone(a, { f: 1320, t: 0.05, d: 0.8, type: 'sine', g: 0.04 });
      break;
    case 'error':
      tone(a, { f: 185, t: 0, d: 0.12, type: 'square', g: 0.06 });
      tone(a, { f: 147, t: 0.12, d: 0.2, type: 'square', g: 0.06 });
      break;
  }
}

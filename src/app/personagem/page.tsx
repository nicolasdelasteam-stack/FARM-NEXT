'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { SKILL_NAMES, PET_STAGES } from '@/lib/constants';

const AVATARS = ['🦊', '🐉', '🦅', '🐺', '🦁', '🐱', '🐲', '🦄', '🐸', '🧙', '🦸', '🥷', '👤', '😎', '💀', '👑'];

function Avatar({ photo, emoji, size }: { photo?: string; emoji: string; size: string }) {
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element -- foto/gif de perfil enviada pelo usuário (data-URL)
    return <img src={photo} alt="" className={`${size} object-cover rounded-full border-2 border-violet-600`} />;
  }
  return <span className={size + ' flex items-center justify-center'} style={{ fontSize: '2.6rem' }}>{emoji}</span>;
}

export default function PersonagemPage() {
  const player = useStore((s) => s.player);
  const setPlayer = useStore((s) => s.setPlayer);
  const xpPct = Math.min(100, Math.round((player.xp / player.xpToNext) * 100));
  const hpPct = Math.round((player.hp / player.maxHp) * 100);

  const [edit, setEdit] = useState(false);
  const [dNome, setDNome] = useState(player.name);
  const [dAvatar, setDAvatar] = useState(player.avatar);
  const [dPhoto, setDPhoto] = useState<string | undefined>(player.photo);
  const [dObj1, setDObj1] = useState(player.objetivoPrincipal || '');
  const [dObj2, setDObj2] = useState(player.objetivoSecundario || '');

  const openEdit = () => {
    setDNome(player.name); setDAvatar(player.avatar); setDPhoto(player.photo);
    setDObj1(player.objetivoPrincipal || ''); setDObj2(player.objetivoSecundario || '');
    setEdit(true);
  };
  const salvar = () => {
    setPlayer({ ...player, name: dNome.trim() || player.name, avatar: dAvatar, photo: dPhoto, objetivoPrincipal: dObj1.trim(), objetivoSecundario: dObj2.trim() });
    setEdit(false);
  };

  const onPhoto = (file?: File) => {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert('Imagem muito grande (máx 3MB).'); return; }
    const reader = new FileReader();
    if (file.type === 'image/gif') {
      reader.onload = () => setDPhoto(reader.result as string);
      reader.readAsDataURL(file);
      return;
    }
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = 256; c.height = 256;
        const ctx = c.getContext('2d');
        if (ctx) { ctx.drawImage(img, 0, 0, 256, 256); setDPhoto(c.toDataURL('image/jpeg', 0.85)); }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500';

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-black">👤 Personagem</h1>
        <button onClick={openEdit} className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">Editar Perfil</button>
      </div>

      {/* Avatar & Title */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <Avatar photo={player.photo} emoji={player.avatar} size="w-16 h-16 text-5xl" />
        <div>
          <div className="font-bold text-lg">{player.name}</div>
          <div className="text-sm text-zinc-500">{player.title} · Nível {player.level}</div>
          <div className="mt-2 w-48">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>XP</span><span>{player.xp}/{player.xpToNext}</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${xpPct}%` }} />
            </div>
            <p className="text-[11px] text-zinc-600 mt-0.5">{player.xpToNext - player.xp} XP para o próximo nível</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: '🔥', v: player.streak, l: 'Ofensiva' },
          { icon: '✅', v: player.totalMissionsDone || 0, l: 'Missões' },
          { icon: '❤️', v: `${player.hp}/${player.maxHp}`, l: `HP ${hpPct}%` },
          { icon: '🪙', v: player.coins, l: 'Moedas' },
        ].map((k) => (
          <div key={k.l} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="text-lg">{k.icon}</div>
            <div className="text-lg font-black">{k.v}</div>
            <div className="text-[11px] text-zinc-500">{k.l}</div>
          </div>
        ))}
      </div>

      {/* Objetivos */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <h3 className="font-bold text-sm mb-2">🎯 Meus Objetivos</h3>
        {(player.objetivoPrincipal || player.objetivoSecundario) ? (
          <div className="space-y-1.5 text-sm">
            {player.objetivoPrincipal && <p><span className="text-violet-400">▸ Principal:</span> {player.objetivoPrincipal}</p>}
            {player.objetivoSecundario && <p><span className="text-sky-400">▸ Secundário:</span> {player.objetivoSecundario}</p>}
          </div>
        ) : <p className="text-xs text-zinc-500">Defina seus objetivos em <b>Editar Perfil</b>.</p>}
      </div>

      {/* Skills */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <h3 className="font-bold text-sm mb-3">⚡ Habilidades</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(SKILL_NAMES).map(([key, name]) => {
            const val = player.skills[key as keyof typeof player.skills] || 0;
            const lv = Math.floor(val / 10) + 1;
            const pct = (val % 10) * 10;
            return (
              <div key={key}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span>{name}</span><span>Lv. {lv}</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Skills */}
      {player.customSkills && player.customSkills.length > 0 && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <h3 className="font-bold text-sm mb-3">⭐ Skills Customizadas</h3>
          <div className="space-y-2">
            {player.customSkills.map((cs) => {
              const lv = Math.floor((cs.xp || 0) / 10) + 1;
              const pct = ((cs.xp || 0) % 10) * 10;
              return (
                <div key={cs.id}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span>{cs.icon} {cs.name}</span><span>Lv. {lv}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pet */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <h3 className="font-bold text-sm mb-2">🐾 Mascote</h3>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{PET_STAGES[player.pet?.stage || 0]?.icon || '🥚'}</span>
          <div>
            <div className="font-semibold">{PET_STAGES[player.pet?.stage || 0]?.name || 'Ovo'}</div>
            <p className="text-xs text-zinc-500">{PET_STAGES[player.pet?.stage || 0]?.desc || ''}</p>
            <div className="flex gap-2 mt-1">
              <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800">XP: {player.pet?.xp || 0}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800">Evoluções: {player.pet?.evolutions || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Atributos */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <h3 className="font-bold text-sm mb-3">📊 Atributos</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(player.atributos || {}).map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="capitalize">{k}</span><span>Lv. {Math.floor((v || 0) / 5) + 1}</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, ((v || 0) % 5) * 20)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Editar Perfil */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setEdit(false)}>
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-violet-800/50 p-5 space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-violet-300">Editar Perfil</h2>
              <button onClick={() => setEdit(false)} className="text-zinc-500 hover:text-zinc-300 text-lg">✕</button>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar photo={dPhoto} emoji={dAvatar} size="w-20 h-20 text-6xl" />
              <div className="flex-1 space-y-2">
                <label className="block px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs cursor-pointer hover:border-violet-500 text-center">
                  🖼️ Enviar imagem / GIF
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} />
                </label>
                {dPhoto && <button onClick={() => setDPhoto(undefined)} className="w-full px-3 py-1.5 bg-zinc-800 hover:bg-red-600 rounded-lg text-xs">Remover foto (usar emoji)</button>}
              </div>
            </div>
            {!dPhoto && (
              <div className="flex gap-1.5 flex-wrap">
                {AVATARS.map((a) => <button key={a} onClick={() => setDAvatar(a)} className={`w-9 h-9 rounded-lg text-lg ${dAvatar === a ? 'bg-violet-600' : 'bg-zinc-800'}`}>{a}</button>)}
              </div>
            )}

            <label className="block text-xs text-zinc-500">Seu nome
              <input className={inp} value={dNome} onChange={(e) => setDNome(e.target.value)} />
            </label>
            <label className="block text-xs text-zinc-500">Objetivo principal
              <textarea className={`${inp} h-20`} placeholder="Ex: Aprender inglês fluente, emagrecer 10kg..." value={dObj1} onChange={(e) => setDObj1(e.target.value)} />
            </label>
            <label className="block text-xs text-zinc-500">Objetivo secundário (opcional)
              <textarea className={`${inp} h-16`} placeholder="Ex: Desenvolver hábitos saudáveis" value={dObj2} onChange={(e) => setDObj2(e.target.value)} />
            </label>

            <div className="flex gap-2">
              <button onClick={() => setEdit(false)} className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-semibold">Cancelar</button>
              <button onClick={salvar} className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, type ChangeEvent } from 'react';
import { useStore } from '@/lib/store';
import { uid, today } from '@/lib/engine';
import { MEAL_TYPES, WEEK_DAYS } from '@/lib/constants';

export default function DietaPage() {
  const dieta = useStore((s) => s.dieta);
  const setDieta = useStore((s) => s.setDieta);
  const [tab, setTab] = useState<'refeicoes' | 'peso' | 'receitas'>('refeicoes');
  const [dia, setDia] = useState(WEEK_DAYS[0]);
  const [horario, setHorario] = useState('08:00');
  const [tipo, setTipo] = useState(MEAL_TYPES[0]);
  const [desc, setDesc] = useState('');
  const [peso, setPeso] = useState('');
  const [gordura, setGordura] = useState('');
  const [foto, setFoto] = useState('');
  const [rNome, setRNome] = useState('');
  const [rTag, setRTag] = useState('');
  const [rIng, setRIng] = useState('');

  const addRefeicao = () => {
    if (!desc.trim()) return;
    setDieta({ ...dieta, refeicoes: [...dieta.refeicoes, { id: uid(), dia, horario, tipo, descricao: desc.trim() }] });
    setDesc('');
  };
  const delRefeicao = (id: string) => setDieta({ ...dieta, refeicoes: dieta.refeicoes.filter((r) => r.id !== id) });

  const addPeso = () => {
    const p = parseFloat(peso);
    if (!p) return;
    setDieta({ ...dieta, pesos: [...dieta.pesos, { id: uid(), data: today(), peso: p, gordura: gordura ? parseFloat(gordura) : null, foto: foto || undefined }] });
    setPeso(''); setGordura(''); setFoto('');
  };
  const onFoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const max = 400; const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = img.width * scale; c.height = img.height * scale;
        const ctx = c.getContext('2d'); if (ctx) ctx.drawImage(img, 0, 0, c.width, c.height);
        setFoto(c.toDataURL('image/jpeg', 0.7));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };
  const addReceita = () => {
    if (!rNome.trim()) return;
    setDieta({ ...dieta, receitas: [...dieta.receitas, { id: uid(), nome: rNome.trim(), tag: rTag.trim() || 'Geral', ingredientes: rIng.trim() }] });
    setRNome(''); setRTag(''); setRIng('');
  };

  const refsDia = dieta.refeicoes.filter((r) => r.dia === dia).sort((a, b) => a.horario.localeCompare(b.horario));
  const pesos = [...dieta.pesos].sort((a, b) => a.data.localeCompare(b.data));
  const first = pesos[0], last = pesos[pesos.length - 1];
  const diff = first && last ? (last.peso - first.peso) : 0;
  const tags = [...new Set(dieta.receitas.map((r) => r.tag))];

  const inp = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500';

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-black mb-1">🥗 Dieta</h1>
      <p className="text-sm text-zinc-500 mb-4">Refeições da semana, progresso de peso e receitas.</p>
      <div className="flex gap-2 mb-5">
        {(['refeicoes', 'peso', 'receitas'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${tab === t ? 'bg-violet-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'}`}>
            {t === 'refeicoes' ? 'Refeições' : t === 'peso' ? 'Progresso' : 'Receitas'}
          </button>
        ))}
      </div>

      {tab === 'refeicoes' && (
        <div>
          <div className="flex gap-1.5 flex-wrap mb-4">
            {WEEK_DAYS.map((d) => (
              <button key={d} onClick={() => setDia(d)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${dia === d ? 'bg-violet-600/30 text-violet-300 border border-violet-600' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'}`}>{d}</button>
            ))}
          </div>
          <div className="space-y-2 mb-5">
            {refsDia.length === 0 && <p className="text-sm text-zinc-600">Nenhuma refeição para {dia}.</p>}
            {refsDia.map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-xs font-mono text-violet-400 w-12">{r.horario}</span>
                <div className="flex-1">
                  <div className="text-xs text-zinc-500">{r.tipo}</div>
                  <div className="text-sm">{r.descricao}</div>
                </div>
                <button onClick={() => delRefeicao(r.id)} className="text-zinc-600 hover:text-red-400 text-sm">✕</button>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <div className="text-sm font-bold">Nova refeição em {dia}</div>
            <div className="grid grid-cols-2 gap-2">
              <input className={inp} type="time" value={horario} onChange={(e) => setHorario(e.target.value)} />
              <select className={inp} value={tipo} onChange={(e) => setTipo(e.target.value)}>{MEAL_TYPES.map((m) => <option key={m}>{m}</option>)}</select>
            </div>
            <input className={inp} placeholder="Ex: 3 ovos + aveia + café" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <button onClick={addRefeicao} className="w-full py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">+ Adicionar</button>
          </div>
        </div>
      )}

      {tab === 'peso' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="text-sm font-bold mb-3">Registrar pesagem</div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input className={inp} type="number" step="0.1" placeholder="Peso (kg)" value={peso} onChange={(e) => setPeso(e.target.value)} />
              <input className={inp} type="number" step="0.1" placeholder="% Gordura" value={gordura} onChange={(e) => setGordura(e.target.value)} />
            </div>
            <label className="block text-xs text-zinc-500 mb-2">Foto (opcional)
              <input type="file" accept="image/*" onChange={onFoto} className="block w-full text-xs mt-1 text-zinc-400 file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:bg-zinc-800 file:text-zinc-300" />
            </label>
            {foto && <img src={foto} alt="preview" className="w-16 h-16 object-cover rounded-lg mb-2" />}
            <button onClick={addPeso} className="w-full py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">Registrar hoje</button>
            {last && (
              <div className="mt-4 text-center">
                <div className="text-3xl font-black">{last.peso} <span className="text-sm font-normal text-zinc-500">kg</span></div>
                {pesos.length > 1 && <div className={`text-sm font-semibold ${diff < 0 ? 'text-emerald-400' : diff > 0 ? 'text-red-400' : 'text-zinc-400'}`}>{diff > 0 ? '+' : ''}{diff.toFixed(1)} kg desde o início</div>}
              </div>
            )}
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="text-sm font-bold mb-3">Histórico</div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {pesos.length === 0 && <p className="text-sm text-zinc-600">Sem registros.</p>}
              {[...pesos].reverse().map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm border-b border-zinc-800 py-1">
                  <span className="text-zinc-500">{new Date(p.data).toLocaleDateString('pt-BR')}</span>
                  <div className="flex items-center gap-2">
                    {p.foto && <img src={p.foto} alt="" className="w-8 h-8 object-cover rounded" />}
                    <span className="font-semibold">{p.peso} kg{p.gordura != null ? ` · ${p.gordura}%` : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'receitas' && (
        <div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 mb-5">
            <div className="text-sm font-bold">Nova receita</div>
            <div className="grid grid-cols-2 gap-2">
              <input className={inp} placeholder="Nome" value={rNome} onChange={(e) => setRNome(e.target.value)} />
              <input className={inp} placeholder="Grupo/tag (ex: Café da manhã)" value={rTag} onChange={(e) => setRTag(e.target.value)} />
            </div>
            <textarea className={inp} rows={2} placeholder="Ingredientes / modo de preparo" value={rIng} onChange={(e) => setRIng(e.target.value)} />
            <button onClick={addReceita} className="w-full py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold">+ Salvar receita</button>
          </div>
          {tags.map((tg) => (
            <div key={tg} className="mb-4">
              <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">{tg}</div>
              <div className="grid md:grid-cols-2 gap-2">
                {dieta.receitas.filter((r) => r.tag === tg).map((r) => (
                  <div key={r.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-sm">{r.nome}</div>
                      <button onClick={() => setDieta({ ...dieta, receitas: dieta.receitas.filter((x) => x.id !== r.id) })} className="text-zinc-600 hover:text-red-400 text-xs">✕</button>
                    </div>
                    {r.ingredientes && <p className="text-xs text-zinc-500 mt-1 whitespace-pre-wrap">{r.ingredientes}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

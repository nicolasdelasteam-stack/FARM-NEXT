# ZÊNITE · FARM-NEXT

Produtividade gamificada em modo RPG — missões, XP, moedas, HP, ofensiva, pet, boss e muito mais.
Stack: **Next.js 16 · React 19 · Zustand (persist) · Tailwind 4** (Supabase opcional para a fase nuvem).

## Rodar localmente
```bash
npm install
npm run dev
# http://localhost:3000
```

## Novidades desta fase (Fase 1 — trazidas do Notion)
- 🥗 **Dieta** (`/dieta`) — refeições por dia da semana / horário / tipo, progresso de peso e % de gordura, e receitas agrupadas por tag.
- 🧺 **Compras** (`/compras`) — lista de mercado com ícones + lista de desejos com valor e prioridade (urgente / algum dia / pode esperar).
- 🎉 **Eventos** (`/eventos`) — desafios com prazo e recompensa, **inventário** para guardar/usar recompensas e **avisos** de início/fim/expiração.
- 🏛️ **Hall da Glória** (`/hall`) — troféus, títulos e medalhas com **resgate de recompensa** (moedas + XP), status e data.
- 🐾 **Companheiros** (`/companheiros`) — amigos, pets e parceiros com aniversário, "juntos desde" (dias juntos) e notas.
- 🛒 **Mercado funcional** (`/mercado`) — itens com efeito real (poção, ❄️ congelar ofensiva, ⚡ XP boost, baús com sorteio) **+ recompensas da vida real com limite semanal** (ex.: fast food 2×/semana) que **reseta sozinho toda semana**.

## Novidades da Fase 2
- 💪 **Treinos** (`/treinos`) — **calculadora de macros** (kcal, carbo/proteína/gordura g e g/kg por fórmula Mifflin-St Jeor), rotina por grupo muscular e guia de exercícios + histórico de peso.
- 🌑 **Deep Work** (`/deepwork`) — checklist de foco, **player de sons ambiente** (chuva, cafeteria, vento, ondas, fogueira) com volume por som via Web Audio, e mural de **visualização** de objetivos.
- ✈️ **Viagens** (`/viagens`) — destino, datas, custo, status e checklist de mala por categoria.
- 🗓️ **Planejamento** (`/planejamento`) — metas do ano, prioridades e disciplina mês a mês (gráfico).
- 🏠 **Organização da Casa** (`/casa`) — áreas (carro, pets, plantas), tarefas recorrentes e lembretes.
- 📚 **Estudos** (`/estudos`, reescrito) — matérias com dia/horário/professor e resumo + **Bibliotheca Alexandrina** (livros por tipo, status e progresso).

## Novidades da Fase 3
- 🔔 **Notificações locais** — permissão + lembrete diário no horário escolhido e aviso de eventos terminando (com o app aberto). Configurável em Configurações, com botão de teste.
- 📆 **Provas & Prazos** (`/provas`) — agende provas/trabalhos com data; viram missões com prazo automaticamente (aparecem no Campo e Calendário).
- 📸 **Foto na pesagem** (Dieta) — anexe uma foto (redimensionada no navegador) a cada registro de peso.
- ☁️ **Sincronização na nuvem (Supabase)** — login por link mágico + salvar/baixar o progresso entre dispositivos (ativa ao configurar as variáveis).

## Melhorias recentes
- 💰 **Finanças** (`/financas`) — agora **persiste** no estado global (antes os dados sumiam ao recarregar) e ganhou aba **Metas**: crie um objetivo (ex.: fone novo) com valor-alvo, ícone e prioridade (urgente / algum dia / pode esperar), acompanhe uma barra de progresso e registre quanto já juntou.
- ⚔️ **Boss Fight** (`/boss`) — chefes semanais/mensais da vida real com lore, dificuldade, requisito, como vencer, penalidade, condição de aparição e recompensa (moedas + XP). Ao **Derrotar**, o boss concede a recompensa e vai para o **Bestiário** (que só mostra os já vencidos). Vem com 4 bosses de exemplo.
- 🧠 **Segundo Cérebro** (`/segundo-cerebro`) — **Livros** de leitura livre (status quero ler / lendo / lido + barra de progresso e link do PDF), **Habilidades** em estudo (uma "página" de anotações por habilidade) e banco de **Ideias** por categoria. *Os livros ligados a matérias continuam em Estudos → Bibliotheca.*
- 🔁 **Bosses recorrentes** — bosses **semanais/mensais** agora renascem sozinhos ao virar a semana/mês em que foram derrotados (os de período "único" ficam no Bestiário para sempre).
- 🎬 **Mídia** (`/midia`) — antes era um placeholder; agora é a aba de **filmes / séries / animes** completa: capa, avaliação de 0–5 estrelas, favoritos, status (quero assistir / assistindo / assistido), progresso de temporadas e filtros por grupo.
- 📝 **Notas** (`/notas`) — agora **persistem** no estado global (antes sumiam ao recarregar), com data e filtro por categoria.
- 💪 **Academia** (`/academia`) — virou atalho para **Treinos** (que concentra macros, rotina e progresso), evitando duplicação.

## Loop de RPG ligado (pente fino)
O núcleo de gamificação existia no engine mas estava **desconectado da interface**. Agora funciona ponta a ponta:
- 🎯 **Campo** (`/campo`) — dá para **criar** missões (título, tipo, dificuldade, skill, prazo) e **concluir** de verdade. Concluir concede XP + moedas + atributo, evolui skills, sobe de nível, alimenta a **ofensiva**/pet e ataca o **boss automático** (que aparece e é derrotado no loop). Também dá para reabrir e excluir.
- 💀 **Reviver** — o botão de reviver no game over agora funciona (gasta moedas, volta com 50% do HP).
- 🔄 **Reset diário** — ao virar o dia, zera o XP do dia, aplica a continuidade da ofensiva (com proteção de streak) e reabre missões diárias/hábitos.
- 🕯️ **Caverna** — cada sessão de foco concluída soma **minutos de foco** (que aparecem em Estatísticas) e concede XP.
- 🏆 **Conquistas** — as conquistas desbloqueadas pelo progresso agora têm botão **Resgatar** que paga a recompensa.

## Arquitetura
```
src/lib/types.ts       # modelo de dados (TypeScript)
src/lib/constants.ts   # níveis, dificuldades, defaults, mercado, hall...
src/lib/engine.ts      # engine puro: XP, moedas, HP, streak, boss, pet, loot...
src/lib/store.ts       # estado global (Zustand + persist, com migrate)
src/app/*/page.tsx     # páginas (App Router)
src/components/Sidebar.tsx  # navegação
```
Padrão para uma nova seção: adicionar tipo em `types.ts` → slice + setter em `store.ts` → página em `src/app/<rota>/page.tsx` → item em `Sidebar.tsx`.

## Nuvem (Supabase) — opcional
1. Crie um projeto no Supabase e um `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```
2. Rode este SQL (Supabase → SQL Editor):
```sql
create table if not exists public.zenite_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
alter table public.zenite_saves enable row level security;
create policy "own save" on public.zenite_saves
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```
3. Em **Configurações → Nuvem**, entre com seu email (link mágico) e use Salvar/Baixar da nuvem.

## Próximas fases
Notificações push · calendário de provas ligado às missões · sincronização Supabase (nuvem) · upload real de PDFs/fotos.

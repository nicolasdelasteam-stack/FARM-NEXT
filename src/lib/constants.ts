import type { Difficulty, Reward, SkillName, AttrName, Trofeu, Boss } from './types';

export const LEVELS = [
  { level: 1,  xpNeeded: 100,  title: 'Aprendiz' },
  { level: 2,  xpNeeded: 250,  title: 'Desbravador' },
  { level: 3,  xpNeeded: 400,  title: 'Guerreiro' },
  { level: 4,  xpNeeded: 550,  title: 'Cavaleiro' },
  { level: 5,  xpNeeded: 700,  title: 'Mercenário' },
  { level: 6,  xpNeeded: 1000, title: 'Elite' },
  { level: 7,  xpNeeded: 1400, title: 'Mestre' },
  { level: 8,  xpNeeded: 1900, title: 'Sábio' },
  { level: 9,  xpNeeded: 2500, title: 'Herói' },
  { level: 10, xpNeeded: 3200, title: 'Lenda' },
];

export const TITLES_EXTENDED = [
  'Lenda', 'Imortal', 'Divino', 'Supremo', 'Absoluto',
  'Eterno', 'Cosmico', 'Transcendente', 'Onipotente', 'Zen',
];

export const DIFFICULTIES: Record<Difficulty, { label: string; reward: Reward }> = {
  facil:  { label: 'Fácil',   reward: { xp: 20,  coins: 3 } },
  media:  { label: 'Média',   reward: { xp: 40,  coins: 6 } },
  dificil:{ label: 'Difícil', reward: { xp: 70,  coins: 10 } },
};

export const SKILL_NAMES: Record<SkillName, string> = {
  destreza: 'Destreza', saude: 'Saúde', estudos: 'Estudos', gestao: 'Gestão',
};

export const CATEGORY_ATTR_MAP: Record<SkillName, AttrName> = {
  destreza: 'disciplina', saude: 'shape', estudos: 'inteligencia', gestao: 'foco',
};

export const ACHIEVEMENTS = [
  { id: 'first_mission',  name: 'Primeiro Passo',      desc: 'Conclua sua primeira missão.',                icon: '🎯', reward: 10 },
  { id: 'level_5',        name: 'Mercenário',           desc: 'Alcance o nível 5.',                          icon: '⚔️', reward: 50 },
  { id: 'level_10',       name: 'Lenda',                desc: 'Alcance o nível 10.',                         icon: '👑', reward: 100 },
  { id: 'level_20',       name: 'Imortal',              desc: 'Alcance o nível 20.',                         icon: '🌟', reward: 200 },
  { id: 'level_50',       name: 'Supremo',              desc: 'Alcance o nível 50.',                         icon: '💫', reward: 500 },
  { id: 'first_coin',     name: 'Primeira Moeda',       desc: 'Ganhe sua primeira moeda.',                    icon: '🪙', reward: 5 },
  { id: 'hoard_100',      name: 'Poupeiro',             desc: 'Acumule 100 moedas.',                         icon: '💰', reward: 50 },
  { id: 'streak_7',       name: 'Determinado',          desc: 'Mantenha 7 dias de ofensiva.',                 icon: '🔥', reward: 100 },
  { id: 'streak_30',      name: 'Lendário Streak',      desc: 'Mantenha 30 dias de ofensiva.',                icon: '💎', reward: 300 },
  { id: 'missions_50',    desc: 'Conclua 50 missões.',  name: 'Veterano',                                    icon: '🏅', reward: 100 },
  { id: 'boss_killer',    name: 'Caça-Boss',            desc: 'Derrote seu primeiro boss.',                   icon: '🗡️', reward: 100 },
];

export const BOSSES = [
  { name: 'A Procrastinação', lore: 'Sombra que sussurra "depois eu faço".', hp: 80, icon: '👿' },
  { name: 'Caos das Tarefas', lore: 'Labirinto de prazos e pendências.', hp: 120, icon: '🌀' },
  { name: 'O Desânimo', lore: 'Névoa que drena sua energia.', hp: 160, icon: '🌑' },
  { name: 'Mestre da Distração', lore: 'Gênio das notificações.', hp: 220, icon: '📱' },
  { name: 'Titã do Burnout', lore: 'Chefe final.', hp: 350, icon: '🔥' },
];

// Bosses da vida real (aba "Boss Fight" do Notion). Só aparecem no Bestiário depois de derrotados.
export const DEFAULT_BOSSES: Boss[] = [
  { id: 'b_sedentarismo', nome: 'O Sedentarismo', icon: '🛋️', lore: 'Criatura que te prende ao sofá e sussurra "amanhã eu começo".', dificuldade: 'media', periodo: 'semanal', comoVencer: 'Treinar pelo menos 4x na semana.', requisito: 'Completar 4 treinos na semana', penalidade: 'Perde 10 de HP e a ofensiva enfraquece.', recompensa: 'Poção de disposição', recompensaCoins: 80, recompensaXp: 150, recompensaEfeito: 'heal_30', condicao: 'Aparece toda segunda-feira.', derrotado: false, data: null, auto: { tipo: 'treinos_semana', valor: 4 } },
  { id: 'b_acucar', nome: 'Senhor do Açúcar', icon: '🍩', lore: 'Tenta te seduzir com doces e fast food fora do plano.', dificuldade: 'media', periodo: 'semanal', comoVencer: 'Cumprir a dieta a semana toda (máx. 2 refeições livres).', requisito: 'Semana dentro da dieta', penalidade: 'Progresso de peso trava.', recompensa: 'Refeição livre garantida', recompensaCoins: 60, recompensaXp: 120, condicao: 'Aparece quando há registro de dieta.', derrotado: false, data: null },
  { id: 'b_procrastinacao', nome: 'A Procrastinação', icon: '👿', lore: 'Sombra que sussurra "depois eu faço".', dificuldade: 'dificil', periodo: 'semanal', comoVencer: 'Zerar as tarefas atrasadas até domingo.', requisito: 'Nenhuma missão vencida na semana', penalidade: 'Missões acumulam e o Caos cresce.', recompensa: 'Baú de foco', recompensaCoins: 100, recompensaXp: 200, condicao: 'Aparece com tarefas pendentes.', derrotado: false, data: null },
  { id: 'b_burnout', nome: 'Titã do Burnout', icon: '🔥', lore: 'Chefe final — surge de tanto correr sem descanso.', dificuldade: 'epico', periodo: 'mensal', comoVencer: 'Fechar o mês com disciplina alta e sono/descanso em dia.', requisito: 'Mês com disciplina ≥ 80%', penalidade: 'Reset da ofensiva e -20 HP.', recompensa: 'Título: Inabalável', recompensaCoins: 250, recompensaXp: 500, condicao: 'Aparece no último dia do mês.', derrotado: false, data: null },
  { id: 'b_dividas', nome: 'Hidra das Dívidas', icon: '🐉', lore: 'Cada conta esquecida faz nascer duas novas cabeças.', dificuldade: 'dificil', periodo: 'mensal', comoVencer: 'Fechar o mês com saldo positivo em Finanças.', requisito: 'Mês no azul (receitas ≥ despesas)', penalidade: 'Metas financeiras travam.', recompensa: 'Baú Grande de Moedas', recompensaCoins: 150, recompensaXp: 250, recompensaEfeito: 'coins_100', condicao: 'Aparece no início de cada mês.', derrotado: false, data: null, auto: { tipo: 'financas_mes', valor: 0 } },
  { id: 'b_madrugada', nome: 'Espectro da Madrugada', icon: '🌙', lore: 'Sussurra "só mais um vídeo" enquanto rouba suas horas de sono.', dificuldade: 'media', periodo: 'semanal', comoVencer: 'Dormir no horário planejado em 5 noites da semana.', requisito: '5 noites dormindo cedo', penalidade: 'Menos energia: -10 HP.', recompensa: 'Escudo de Ofensiva', recompensaCoins: 70, recompensaXp: 130, recompensaEfeito: 'freeze', condicao: 'Aparece toda segunda-feira.', derrotado: false, data: null },
  { id: 'b_bagunca', nome: 'Golem da Bagunça', icon: '🗿', lore: 'Feito de louça acumulada, roupas na cadeira e pó embaixo do sofá.', dificuldade: 'facil', periodo: 'semanal', comoVencer: 'Zerar as tarefas da Casa na semana.', requisito: 'Tarefas da casa 100%', penalidade: 'A bagunça cresce (e a mente pesa).', recompensa: 'Poção de Cura', recompensaCoins: 50, recompensaXp: 100, recompensaEfeito: 'heal_30', condicao: 'Aparece quando há tarefas de casa pendentes.', derrotado: false, data: null, auto: { tipo: 'casa_zerada', valor: 1 } },
  { id: 'b_telas', nome: 'Sereia das Telas', icon: '📱', lore: 'Seu canto é o scroll infinito — marinheiros perdem horas sem perceber.', dificuldade: 'media', periodo: 'semanal', comoVencer: 'Máximo de 2h de redes sociais por dia na semana.', requisito: 'Semana com telas sob controle', penalidade: 'Foco drenado.', recompensa: 'Poção do Dobro de XP', recompensaCoins: 80, recompensaXp: 150, recompensaEfeito: 'xp2x', condicao: 'Aparece toda segunda-feira.', derrotado: false, data: null },
  { id: 'b_provas', nome: 'Lich das Provas', icon: '💀', lore: 'Guardião do fim do semestre — alimenta-se de quem deixa para a última hora.', dificuldade: 'epico', periodo: 'mensal', comoVencer: 'Estudar todos os dias na semana de prova e fechar as avaliações do mês.', requisito: 'Provas do mês concluídas com preparo', penalidade: 'Reset da ofensiva.', recompensa: 'Elixir da Vida', recompensaCoins: 300, recompensaXp: 500, recompensaEfeito: 'heal_full', condicao: 'Aparece em meses com prova marcada.', derrotado: false, data: null },
  { id: 'b_sede', nome: 'Vampiro da Sede', icon: '🧛', lore: 'Seca você por dentro enquanto o copo d’água fica cheio na mesa.', dificuldade: 'facil', periodo: 'semanal', comoVencer: 'Bater a meta de água em 5 dias da semana.', requisito: '5 dias de meta de água', penalidade: 'Menos HP máximo na prática.', recompensa: 'Baú de Moedas', recompensaCoins: 60, recompensaXp: 100, recompensaEfeito: 'coins_50', condicao: 'Aparece toda segunda-feira.', derrotado: false, data: null, auto: { tipo: 'agua_semana', valor: 5 } },

  // ─── Importados do Notion "Meu gamelife V1.1 backup" (Bestiário de Chefões) ───
  { id: 'b_tita_suor', nome: 'Titã do Suor', icon: '🏃', lore: 'O Colosso Implacável — forjado de suor e cansaço, só recua diante de quem encara o próprio corpo sem piedade.', dificuldade: 'media', periodo: 'semanal', comoVencer: 'Registre 3 treinos na semana (aba Treinos).', requisito: '3 treinos registrados na semana', penalidade: 'Perde acesso a recompensas de saúde/energia por 2 dias.', recompensa: 'Vale Buff de Energia', recompensaCoins: 50, recompensaXp: 120, recompensaEfeito: 'heal_full', condicao: 'Surge periodicamente pra testar sua resistência física.', derrotado: false, data: null, auto: { tipo: 'treinos_semana', valor: 3 } },
  { id: 'b_ditador_tempo', nome: 'Ditador do Tempo', icon: '⏳', lore: 'Senhor das Rotinas Rígidas — um tirano que governa aqueles que seguem rotinas impecáveis. Ele testa sua consistência!', dificuldade: 'media', periodo: 'semanal', comoVencer: 'Conclua 10 missões ao longo da semana (aba Campo).', requisito: '10 missões concluídas na semana', penalidade: 'Perde um buff ativo.', recompensa: 'Poção do Dobro de XP', recompensaCoins: 100, recompensaXp: 150, recompensaEfeito: 'xp2x', condicao: 'Após completar 10 tarefas seguidas sem falhar.', derrotado: false, data: null, auto: { tipo: 'missoes_semana', valor: 10 } },
  { id: 'b_guardiao_conhecimento', nome: 'O Guardião do Conhecimento', icon: '📖', lore: 'O Sábio Inflexível — guardião ancestral que testa quem busca conhecimento profundo demais, rápido demais.', dificuldade: 'dificil', periodo: 'semanal', comoVencer: 'Estude 4 horas seguidas sem se distrair.', requisito: '4h de estudo contínuo', penalidade: '-15% XP em Estudos pelos próximos 2 dias.', recompensa: 'Poção do Dobro de XP', recompensaCoins: 80, recompensaXp: 160, recompensaEfeito: 'xp2x', condicao: 'Surge quando uma sessão de estudo intensa é agendada.', derrotado: false, data: null },
  { id: 'b_guardiao_avancado', nome: 'O Guardião dos Estudos Avançados', icon: '📚', lore: 'O Mestre Ancião do Saber — só aparece pra quem já provou ser digno em batalhas menores de conhecimento.', dificuldade: 'epico', periodo: 'mensal', comoVencer: 'Estude 40 horas no mês em um tema importante, divididas como preferir.', requisito: '40h de estudo no mês', penalidade: 'Perde o buff de XP ativo e -20% XP em Estudos por 5 dias.', recompensa: 'Vale Bônus Ultra', recompensaCoins: 150, recompensaXp: 300, recompensaEfeito: 'xp2x_24h', condicao: 'Surge no início de cada mês pra desafiar sua dedicação de longo prazo.', derrotado: false, data: null },
  { id: 'b_teia_distracao', nome: 'Teia da Distração', icon: '🕷️', lore: 'O Enredador de Mentes — monstro invisível que se alimenta da sua atenção, prendendo sua produtividade em suas teias.', dificuldade: 'media', periodo: 'semanal', comoVencer: 'Ativar o Modo Foco, finalizar uma tarefa sem interrupção no tempo planejado e desligar todas as notificações.', requisito: '1 tarefa sem nenhuma interrupção', penalidade: 'Uma missão aleatória será anulada.', recompensa: 'Poção do Dobro de XP', recompensaCoins: 60, recompensaXp: 130, recompensaEfeito: 'xp2x', condicao: 'Se abrir 5 abas ou aplicativos diferentes enquanto tenta cumprir uma tarefa.', derrotado: false, data: null },
  { id: 'b_guardiao_motivacao', nome: 'Guardião da Motivação', icon: '🏋️', lore: 'A Centelha do Progresso — espírito benevolente que aparece para testar sua força mental e reacender sua motivação!', dificuldade: 'dificil', periodo: 'unico', comoVencer: 'Criar uma lista de 5 razões pelas quais seus objetivos importam + completar 3 microtarefas em 24h, sem procrastinação digital.', requisito: '5 razões + 3 microtarefas em 24h', penalidade: 'Nenhuma!', recompensa: 'Elixir da Vida', recompensaCoins: 40, recompensaXp: 150, recompensaEfeito: 'heal_full', condicao: 'Após falhar 2 boss fights seguidas.', derrotado: false, data: null },
  { id: 'b_dragao_procrastinacao', nome: 'Dragão da Procrastinação', icon: '🐉', lore: 'Guardião do Tempo Perdido — dragão lendário que se alimenta das tarefas esquecidas. Sua força cresce a cada compromisso não cumprido!', dificuldade: 'epico', periodo: 'mensal', comoVencer: 'Finalizar todas as tarefas atrasadas + criar um plano de ação para o próximo mês + completar uma tarefa extra.', requisito: 'Zerar atrasadas + plano do mês', penalidade: '-10% XP em todas as tarefas por 3 dias.', recompensa: 'Vale Bônus Ultra', recompensaCoins: 200, recompensaXp: 400, recompensaEfeito: 'xp2x_24h', condicao: 'Surge no final do mês se houver mais de 3 tarefas adiadas.', derrotado: false, data: null },
  { id: 'b_colecionador_sonhos', nome: 'O Colecionador de Sonhos Perdidos', icon: '💀', lore: 'O Guardião das Metas Esquecidas — ceifador sombrio que se alimenta dos sonhos que você abandonou.', dificuldade: 'epico', periodo: 'mensal', comoVencer: 'Finalizar pelo menos 2 das tarefas mais antigas + criar um plano de recuperação para as demais.', requisito: '2 tarefas mais antigas concluídas', penalidade: '-25% do XP no próximo mês.', recompensa: 'Baú Sombrio', recompensaCoins: 180, recompensaXp: 350, recompensaEfeito: 'bau_sombrio', condicao: 'Se houver mais de 3 tarefas vencidas há mais de 7 dias.', derrotado: false, data: null },

  // ─── Novos (variedade extra, mesmo formato do Notion) ───
  { id: 'b_zumbi_soneca', nome: 'Zumbi do Soneca', icon: '🧟', lore: 'Morde o botão de adiar e rouba 9 minutos da sua alma de cada vez.', dificuldade: 'facil', periodo: 'semanal', comoVencer: 'Levantar no primeiro alarme em 5 dias da semana.', requisito: '5 dias sem soneca', penalidade: 'Manhãs encolhem e o dia começa perdido.', recompensa: 'Poção de Cura', recompensaCoins: 40, recompensaXp: 90, recompensaEfeito: 'heal_30', condicao: 'Aparece toda segunda-feira.', derrotado: false, data: null },
  { id: 'b_lesma_marasmo', nome: 'Lesma do Marasmo', icon: '🐌', lore: 'Deixa um rastro de "daqui a pouco eu começo" por onde passa.', dificuldade: 'facil', periodo: 'semanal', comoVencer: 'Fazer a primeira tarefa do dia antes das 9h em 4 dias da semana.', requisito: '4 manhãs produtivas', penalidade: 'O dia inteiro fica lento.', recompensa: 'Baú de Moedas', recompensaCoins: 40, recompensaXp: 80, recompensaEfeito: 'coins_50', condicao: 'Aparece toda segunda-feira.', derrotado: false, data: null },
  { id: 'b_oni_redes', nome: 'Oni das Redes ao Acordar', icon: '👹', lore: 'Espera você abrir os olhos para te puxar pro feed antes mesmo do café.', dificuldade: 'media', periodo: 'semanal', comoVencer: 'Não abrir rede social na primeira hora do dia, a semana toda.', requisito: '7 manhãs sem scroll', penalidade: 'Dopamina gasta antes das 8h.', recompensa: 'Escudo de Ofensiva', recompensaCoins: 70, recompensaXp: 140, recompensaEfeito: 'freeze', condicao: 'Aparece toda segunda-feira.', derrotado: false, data: null },
  { id: 'b_morcego_madrugada', nome: 'Morcego da Madrugada Infinita', icon: '🦇', lore: 'Sussurra "vale a pena ver mais um" até o sol nascer.', dificuldade: 'dificil', periodo: 'semanal', comoVencer: 'Dormir 7h ou mais em todas as noites da semana.', requisito: '7 noites bem dormidas', penalidade: '-10 HP por exaustão.', recompensa: 'Elixir da Vida', recompensaCoins: 90, recompensaXp: 180, recompensaEfeito: 'heal_full', condicao: 'Aparece toda segunda-feira.', derrotado: false, data: null },
  { id: 'b_serpente_impulso', nome: 'Serpente do Gasto por Impulso', icon: '🐍', lore: 'Dá o bote na hora da promoção-relâmpago e some antes da fatura chegar.', dificuldade: 'media', periodo: 'mensal', comoVencer: 'Fechar o mês sem nenhuma compra por impulso (24h de espera antes de qualquer compra não planejada).', requisito: 'Mês sem compras por impulso', penalidade: 'Metas financeiras recuam.', recompensa: 'Baú Grande de Moedas', recompensaCoins: 120, recompensaXp: 200, recompensaEfeito: 'coins_100', condicao: 'Aparece no início de cada mês.', derrotado: false, data: null },
  { id: 'b_cavaleiro_caos', nome: 'Cavaleiro do Caos Digital', icon: '🗡️', lore: 'Cavalga sobre 14 mil arquivos na pasta Downloads e uma área de trabalho apocalíptica.', dificuldade: 'media', periodo: 'mensal', comoVencer: 'Organizar downloads, área de trabalho e galeria de fotos do mês.', requisito: 'Vida digital organizada', penalidade: 'Você nunca acha nada quando precisa.', recompensa: 'Baú de Moedas', recompensaCoins: 80, recompensaXp: 150, recompensaEfeito: 'coins_50', condicao: 'Aparece no início de cada mês.', derrotado: false, data: null },
  { id: 'b_golem_medo', nome: 'Golem de Gelo do Medo', icon: '🧊', lore: 'Congela aquela ligação, aquela conversa, aquele começo que você vem adiando há semanas.', dificuldade: 'dificil', periodo: 'unico', comoVencer: 'Fazer HOJE a coisa que você está adiando por medo ou vergonha.', requisito: 'Encarar o que está sendo adiado', penalidade: 'O gelo engrossa a cada dia adiado.', recompensa: 'Vale Bônus Ultra', recompensaCoins: 150, recompensaXp: 300, recompensaEfeito: 'xp2x_24h', condicao: 'Surge quando algo importante está parado há mais de 7 dias.', derrotado: false, data: null },
  { id: 'b_ciclone_notificacoes', nome: 'Ciclone das Notificações', icon: '🌪️', lore: 'Um redemoinho de pings, badges e vibrações que arranca você de qualquer tarefa.', dificuldade: 'media', periodo: 'semanal', comoVencer: 'Celular no silencioso/não perturbe em todas as sessões de estudo e trabalho da semana.', requisito: 'Semana de sessões sem pings', penalidade: 'Foco em pedaços.', recompensa: 'Poção do Dobro de XP', recompensaCoins: 60, recompensaXp: 120, recompensaEfeito: 'xp2x', condicao: 'Aparece toda segunda-feira.', derrotado: false, data: null },
  { id: 'b_behemoth_delivery', nome: 'Behemoth do Delivery', icon: '🍔', lore: 'Cresce um nível a cada "só hoje" e devora dieta e carteira de uma vez.', dificuldade: 'dificil', periodo: 'mensal', comoVencer: 'Máximo de 2 pedidos de delivery no mês inteiro.', requisito: 'Mês com ≤ 2 deliveries', penalidade: 'Dieta e finanças levam dano juntas.', recompensa: 'Refeição livre garantida', recompensaCoins: 100, recompensaXp: 200, recompensaEfeito: 'coins_50', condicao: 'Aparece no início de cada mês.', derrotado: false, data: null },
  { id: 'b_pavao_comparacao', nome: 'Pavão da Comparação', icon: '🦚', lore: 'Abre a cauda cheia de vidas perfeitas alheias para você esquecer a sua.', dificuldade: 'media', periodo: 'semanal', comoVencer: 'Uma semana sem se comparar: ao pegar o celular pra stalkear, anotar 1 coisa boa do seu dia no lugar.', requisito: 'Semana de gratidão no lugar de comparação', penalidade: 'Autoestima drenada.', recompensa: 'Poção de Cura', recompensaCoins: 50, recompensaXp: 110, recompensaEfeito: 'heal_30', condicao: 'Aparece toda segunda-feira.', derrotado: false, data: null },
  { id: 'b_necromante_materias', nome: 'Necromante das Matérias Atrasadas', icon: '⚰️', lore: 'Ergue um exército de conteúdos não revisados que voltam dos mortos na véspera da prova.', dificuldade: 'epico', periodo: 'unico', comoVencer: 'Colocar em dia TODAS as matérias atrasadas do semestre.', requisito: 'Semestre 100% em dia', penalidade: 'O exército cresce a cada aula ignorada.', recompensa: 'Vale Bônus Ultra', recompensaCoins: 250, recompensaXp: 500, recompensaEfeito: 'xp2x_24h', condicao: 'Surge quando 3+ matérias acumulam atraso.', derrotado: false, data: null },
  { id: 'b_lobo_solidao', nome: 'Lobo da Solidão', icon: '🐺', lore: 'Uiva "depois eu respondo" até as amizades hibernarem.', dificuldade: 'media', periodo: 'mensal', comoVencer: 'Encontrar (de verdade) amigos ou família pelo menos 2x no mês.', requisito: '2 encontros presenciais no mês', penalidade: 'Companheiros esquecem seu cheiro.', recompensa: 'Baú de Moedas', recompensaCoins: 70, recompensaXp: 140, recompensaEfeito: 'coins_50', condicao: 'Aparece no início de cada mês.', derrotado: false, data: null },
  { id: 'b_troll_perfeccionismo', nome: 'Troll do Perfeccionismo', icon: '🧌', lore: 'Segura a ponte gritando que nada seu está bom o suficiente para passar.', dificuldade: 'dificil', periodo: 'mensal', comoVencer: 'Entregar 3 coisas "boas o suficiente" no mês sem retrabalho infinito.', requisito: '3 entregas sem perfeccionismo', penalidade: 'Nada é publicado, nada é entregue.', recompensa: 'Roda da Fortuna', recompensaCoins: 110, recompensaXp: 220, recompensaEfeito: 'roleta', condicao: 'Aparece quando um projeto empaca em ajustes.', derrotado: false, data: null },
  { id: 'b_doppelganger_descanso', nome: 'Doppelgänger do Falso Descanso', icon: '🎭', lore: 'Se disfarça de pausa, mas é só scroll — você "descansa" e acorda mais cansado.', dificuldade: 'media', periodo: 'semanal', comoVencer: '30 minutos de descanso REAL (sem telas) por dia, em 5 dias da semana.', requisito: '5 dias de descanso de verdade', penalidade: 'Energia nunca recarrega por completo.', recompensa: 'Elixir da Vida', recompensaCoins: 60, recompensaXp: 130, recompensaEfeito: 'heal_full', condicao: 'Aparece toda segunda-feira.', derrotado: false, data: null },
  { id: 'b_quimera_metas', nome: 'Quimera das Mil Metas', icon: '🦁', lore: 'Três cabeças, trinta objetivos, zero concluídos — ela adora quando você começa tudo ao mesmo tempo.', dificuldade: 'dificil', periodo: 'mensal', comoVencer: 'Escolher UMA meta principal do mês e avançar nela todos os domingos.', requisito: '1 meta com progresso semanal', penalidade: 'Energia dividida em 30 pedaços.', recompensa: 'Chave Mística', recompensaCoins: 130, recompensaXp: 250, recompensaEfeito: 'coins_100', condicao: 'Aparece quando há metas demais abertas.', derrotado: false, data: null },
];

// ─── Sistema de eventos automáticos (como evento de jogo) ───
// Aleatórios: sorteio diário determinístico, intervalo irregular, duração
// variável, até 2 simultâneos (podem se sobrepor a sazonais). Cada evento
// carrega um bônus OU ônus global (mod multiplica XP/moedas enquanto ativo)
// e uma recompensa de resgate. Sazonais têm data fixa no ano.
export interface EventoTemplate {
  nome: string; icon: string; descricao: string; dur: number;
  recompensa: string; efeito?: string; coins: number;
  mod?: { xpMult?: number; coinsMult?: number };
}

// Pool aleatória — importados do Notion (Meu gamelife V1.1 backup → EVENTOS) + novos.
export const RANDOM_EVENT_POOL: EventoTemplate[] = [
  // Importados do Notion
  { nome: 'Uma invasão de chefões surgiu!', icon: '🏴‍☠️', descricao: '⚔️ Bosses por todo lado! XP aumentado enquanto durar — derrote todos os bosses ativos para o resgate.', dur: 6, recompensa: 'Vale Poder do Chefe', efeito: 'golpe_boss', coins: 60, mod: { xpMult: 1.5 } },
  { nome: 'Terminar rápido é a chave', icon: '⏳', descricao: '🏃 Quem hesita, perde: conclua as tarefas do dia em menos de 24h. XP 1.5x durante o evento.', dur: 3, recompensa: 'Skip de 1 Tarefa', coins: 40, mod: { xpMult: 1.5 } },
  { nome: 'Maratona do Atraso Dobrado', icon: '🔥', descricao: '💥 Tudo em dobro: todas as atividades dão 2x XP. Zere as pendências dentro do prazo para o resgate.', dur: 2, recompensa: 'Vale Day Free', coins: 50, mod: { xpMult: 2 } },
  { nome: 'O Grande Festival', icon: '🎭', descricao: '🎊 Festival das missões: XP triplicado! Conclua 5 missões durante o festival para o resgate.', dur: 6, recompensa: 'Vale Loot de Evento', efeito: 'roleta', coins: 50, mod: { xpMult: 3 } },
  { nome: 'Missão Sobrevivência', icon: '🪖', descricao: '🎖️ Modo guerra: 2x XP em todas as atividades. Conclua pelo menos 10 tarefas para o resgate.', dur: 4, recompensa: 'Vale Buff de Energia', efeito: 'heal_full', coins: 40, mod: { xpMult: 2 } },
  { nome: 'Um surto de XP na sua realidade!', icon: '🏃', descricao: '⚡ Anomalia detectada: 3x XP em TUDO. Aproveite antes que o Sistema se estabilize.', dur: 2, recompensa: 'Vale Bônus Ultra', efeito: 'xp2x_24h', coins: 30, mod: { xpMult: 3 } },
  { nome: 'Semana da Preguiça', icon: '📉', descricao: '🦥 ÔNUS: o Sistema está sonolento — todo XP reduzido pela metade. Sobreviva à semana e resgate o item misterioso.', dur: 6, recompensa: 'Baú Sombrio', efeito: 'bau_sombrio', coins: 20, mod: { xpMult: 0.5 } },
  { nome: 'Modo Fim de Ano', icon: '🎇', descricao: '🎅 Reta final: 2x XP em tudo. Termine 70% das pendências para o resgate.', dur: 6, recompensa: 'Vale Queima de Estoque', efeito: 'coins_100', coins: 60, mod: { xpMult: 2 } },
  // Novos
  { nome: 'Chuva de Moedas', icon: '🪙', descricao: '💰 O céu está chovendo ouro: moedas em DOBRO em tudo que você fizer.', dur: 3, recompensa: 'Baú de Moedas', efeito: 'coins_50', coins: 30, mod: { coinsMult: 2 } },
  { nome: 'Lua Cheia do Foco', icon: '🌕', descricao: '🐺 A lua amplifica sua concentração: 1.5x XP. Faça 3 sessões na Caverna para o resgate.', dur: 2, recompensa: 'Poção do Dobro de XP', efeito: 'xp2x', coins: 30, mod: { xpMult: 1.5 } },
  { nome: 'Hora do Rush', icon: '⚡', descricao: '🚨 Evento-relâmpago de 24h: 3x XP HOJE. Corra!', dur: 1, recompensa: 'Vale Bônus Ultra', efeito: 'xp2x_24h', coins: 20, mod: { xpMult: 3 } },
  { nome: 'Névoa da Confusão', icon: '🌫️', descricao: '👁️ ÔNUS: uma névoa cobre o Sistema — XP reduzido em 30%. Persista e o baú é seu.', dur: 2, recompensa: 'Baú Sombrio', efeito: 'bau_sombrio', coins: 40, mod: { xpMult: 0.7 } },
  { nome: 'Bênção do Sistema', icon: '🧿', descricao: '✨ O Sistema sorri para você: +50% XP e +50% moedas em tudo.', dur: 4, recompensa: 'Escudo de Ofensiva', efeito: 'freeze', coins: 30, mod: { xpMult: 1.5, coinsMult: 1.5 } },
  { nome: 'Seca de Moedas', icon: '🏜️', descricao: '🥵 ÔNUS: a economia secou — moedas pela metade. Quem atravessar o deserto ganha o tesouro.', dur: 3, recompensa: 'Baú Grande de Moedas', efeito: 'coins_100', coins: 0, mod: { coinsMult: 0.5 } },
  { nome: 'Roleta do Destino', icon: '🎰', descricao: '🎲 A sorte gira: complete suas diárias todos os dias do evento e rode a Roda da Fortuna.', dur: 2, recompensa: 'Roda da Fortuna', efeito: 'roleta', coins: 25, mod: { xpMult: 1.25 } },
  { nome: 'Semana do Escudo', icon: '🛡️', descricao: '❄️ Forje sua proteção: mantenha a ofensiva todos os dias e ganhe um escudo para ela.', dur: 5, recompensa: 'Escudo de Ofensiva', efeito: 'freeze', coins: 40, mod: { xpMult: 1.25 } },
  { nome: 'Eclipse do Sistema', icon: '🔮', descricao: '🌑 ÔNUS: eclipse total — XP cai pela metade por 1 dia. Um item raríssimo cai para quem jogar mesmo assim.', dur: 1, recompensa: 'Chave Mística', efeito: 'coins_100', coins: 50, mod: { xpMult: 0.5 } },
  { nome: 'Caçada ao Dragão', icon: '🐲', descricao: '🏹 Temporada de caça: derrote 2 bosses durante o evento. XP +25% enquanto durar.', dur: 5, recompensa: 'Vale Poder do Chefe', efeito: 'golpe_boss', coins: 60, mod: { xpMult: 1.25 } },
  { nome: 'Queima de Estoque', icon: '📦', descricao: '🏷️ Moedas rendem mais: +50% de moedas. Dia perfeito para farmar e gastar no Mercado.', dur: 3, recompensa: 'Vale Queima de Estoque', efeito: 'coins_50', coins: 30, mod: { coinsMult: 1.5 } },
  { nome: 'Festival da Renovação', icon: '🌱', descricao: '🍃 Novo ciclo: 2x XP. Termine o evento com a casa e as diárias em dia para renascer com HP cheio.', dur: 4, recompensa: 'Elixir da Vida', efeito: 'heal_full', coins: 40, mod: { xpMult: 2 } },
  { nome: 'Descontrole de XP', icon: '🧨', descricao: '💥 Um bug no Sistema triplicou o XP! Ninguém sabe quando vão corrigir.', dur: 2, recompensa: 'Vale Bônus Ultra', efeito: 'xp2x_24h', coins: 25, mod: { xpMult: 3 } },
  { nome: 'Vigília Silenciosa', icon: '🕯️', descricao: '🤫 Dois dias de silêncio profundo: 2x XP. Faça pelo menos 1 sessão de foco por dia do evento.', dur: 2, recompensa: 'Poção do Dobro de XP', efeito: 'xp2x', coins: 35, mod: { xpMult: 2 } },
  { nome: 'Tempestade de Neve', icon: '❄️', descricao: '🥶 ÔNUS: nevasca no Sistema — XP -20%. Quem se manter ativo ganha proteção da ofensiva.', dur: 2, recompensa: 'Escudo de Ofensiva', efeito: 'freeze', coins: 30, mod: { xpMult: 0.8 } },
  { nome: 'Dia da Generosidade', icon: '🎁', descricao: '💝 O Sistema retribui em triplo: moedas 3x por 24h. Faça também uma gentileza real hoje.', dur: 1, recompensa: 'Baú de Moedas', efeito: 'coins_50', coins: 20, mod: { coinsMult: 3 } },
  { nome: 'Expedição de Missões', icon: '🗺️', descricao: '🧭 Expedição aberta: 2x XP. Complete 8 missões durante o evento para o loot.', dur: 4, recompensa: 'Vale Loot de Evento', efeito: 'roleta', coins: 45, mod: { xpMult: 2 } },
];

// Sazonais — datas fixas do ano (mês, dia). Podem coexistir com aleatórios.
export const SEASONAL_EVENTS: (EventoTemplate & { key: string; inicio: [number, number]; fim: [number, number] })[] = [
  { key: 'natal', nome: 'Festival de Natal', icon: '🎄', descricao: '🎅 O Sistema entrou no clima: 2x XP e +50% moedas até o Natal. Feliz farm!', inicio: [12, 15], fim: [12, 26], dur: 12, recompensa: 'Baú Grande de Moedas', efeito: 'coins_100', coins: 100, mod: { xpMult: 2, coinsMult: 1.5 } },
  { key: 'anonovo', nome: 'Virada de Ano', icon: '🎆', descricao: '🥂 Novo ano, novo grind: 2x XP para começar com tudo. Defina suas metas do ano!', inicio: [12, 29], fim: [1, 5], dur: 8, recompensa: 'Vale Bônus Ultra', efeito: 'xp2x_24h', coins: 80, mod: { xpMult: 2 } },
  { key: 'carnaval', nome: 'Bloco do Sistema', icon: '🎭', descricao: '🥁 Carnaval! Ninguém está produzindo... quem produzir leva o dobro: 2x XP e 2x moedas.', inicio: [2, 10], fim: [2, 18], dur: 9, recompensa: 'Roda da Fortuna', efeito: 'roleta', coins: 60, mod: { xpMult: 2, coinsMult: 2 } },
  { key: 'junina', nome: 'Arraiá do Progresso', icon: '🌽', descricao: '🔥 Festa junina: pule a fogueira das pendências! +50% XP no arraiá.', inicio: [6, 12], fim: [6, 24], dur: 13, recompensa: 'Baú de Moedas', efeito: 'coins_50', coins: 50, mod: { xpMult: 1.5 } },
  { key: 'estudante', nome: 'Semana do Estudante', icon: '🎓', descricao: '📚 Sua semana: XP em dobro. Mostre por que você é o protagonista.', inicio: [8, 8], fim: [8, 14], dur: 7, recompensa: 'Poção do Dobro de XP', efeito: 'xp2x', coins: 60, mod: { xpMult: 2 } },
  { key: 'halloween', nome: 'Noite das Abóboras', icon: '🎃', descricao: '👻 Os bosses estão mais fortes... e as recompensas também: 1.5x XP e um doce misterioso no fim.', inicio: [10, 24], fim: [10, 31], dur: 8, recompensa: 'Vale Abóbora Secreta', efeito: 'bau_sombrio', coins: 66, mod: { xpMult: 1.5 } },
];

export const BOSS_DIFICULDADE: Record<string, { label: string; color: string }> = {
  facil: { label: 'Fácil', color: 'text-emerald-400' },
  media: { label: 'Média', color: 'text-yellow-400' },
  dificil: { label: 'Difícil', color: 'text-orange-400' },
  epico: { label: 'Épico', color: 'text-red-400' },
};

export const BOSS_PERIODO: Record<string, string> = {
  semanal: 'Semanal', mensal: 'Mensal', unico: 'Único',
};

// Itens de recompensa com efeito real (usados como prêmio de eventos / inventário).
export const REWARD_ITEMS: { id: string; nome: string; icon: string; efeito: string; desc: string }[] = [
  { id: 'xp2x', nome: 'Poção do Dobro de XP', icon: '⚡', efeito: 'xp2x', desc: 'Dobro de XP por 2 horas' },
  { id: 'heal_full', nome: 'Elixir da Vida', icon: '❤️', efeito: 'heal_full', desc: 'Restaura todo o HP' },
  { id: 'heal_30', nome: 'Poção de Cura', icon: '🧪', efeito: 'heal_30', desc: '+30 HP' },
  { id: 'coins_50', nome: 'Baú de Moedas', icon: '🪙', efeito: 'coins_50', desc: '+50 moedas' },
  { id: 'coins_100', nome: 'Baú Grande de Moedas', icon: '💰', efeito: 'coins_100', desc: '+100 moedas' },
  { id: 'freeze', nome: 'Escudo de Ofensiva', icon: '❄️', efeito: 'freeze', desc: 'Protege a ofensiva 1 dia' },
  // "Vales" importados do Notion (Meu gamelife V1.1 backup)
  { id: 'xp2x_24h', nome: 'Vale Bônus Ultra', icon: '🌟', efeito: 'xp2x_24h', desc: 'Dobro de XP por 24 horas' },
  { id: 'bau_sombrio', nome: 'Baú Sombrio', icon: '🖤', efeito: 'bau_sombrio', desc: 'Recompensa misteriosa (sorte ou azar...)' },
  { id: 'roleta', nome: 'Roda da Fortuna', icon: '🎡', efeito: 'roleta', desc: 'Gira e ganha um prêmio aleatório' },
  { id: 'golpe_boss', nome: 'Vale Poder do Chefe', icon: '⚔️', efeito: 'golpe_boss', desc: 'Golpe devastador de 150 no boss atual' },
];

export const PET_STAGES = [
  { icon: '🥚', name: 'Ovo', desc: 'Choca com missões diárias!' },
  { icon: '🐣', name: 'Filhote', desc: 'Streak ≥ 3 para evoluir.' },
  { icon: '🐥', name: 'Jovem', desc: 'Streak ≥ 7 para evoluir.' },
  { icon: '🐦', name: 'Adulto', desc: 'Streak ≥ 14 para evoluir.' },
  { icon: '🦅', name: 'Lendário', desc: 'Streak ≥ 30.' },
];

export const PET_STREAK_REQ = [0, 3, 7, 14, 30];

// Espécies do mascote — cada uma com sua linha evolutiva (mesmos estágios por streak).
export const PET_SPECIES: { id: string; nome: string; stages: string[] }[] = [
  { id: 'fenix', nome: 'Fênix', stages: ['🥚', '🐣', '🐥', '🦅', '🔥'] },
  { id: 'dragao', nome: 'Dragão', stages: ['🥚', '🐣', '🦎', '🐉', '🐲'] },
  { id: 'lobo', nome: 'Lobo', stages: ['🥚', '🐣', '🐶', '🐺', '🌕'] },
  { id: 'felino', nome: 'Felino', stages: ['🥚', '🐣', '🐱', '😼', '🦁'] },
  { id: 'coruja', nome: 'Coruja', stages: ['🥚', '🐣', '🐤', '🦉', '🔮'] },
];

// Faixas de humor do mascote (0-100). Radiante dá bônus real de XP.
export const PET_HUMOR = [
  { min: 80, label: 'Radiante', icon: '🤩', desc: '+10% de XP em tudo!' },
  { min: 55, label: 'Feliz', icon: '😊', desc: 'Tudo em ordem.' },
  { min: 30, label: 'Carente', icon: '🥺', desc: 'Quer carinho ou um petisco.' },
  { min: 0, label: 'Triste', icon: '😢', desc: 'Anda abandonado...' },
];

export const CAPAS = [
  { name: 'Padrão', gradient: 'linear-gradient(135deg, var(--bg), var(--surface))' },
  { name: 'Noite Estrelada', gradient: 'linear-gradient(135deg, #0B0913, #1A1040, #0B0913)' },
  { name: 'Floresta', gradient: 'linear-gradient(135deg, #0B130B, #104010, #0B130B)' },
  { name: 'Fogo', gradient: 'linear-gradient(135deg, #1A0B0B, #401010, #1A0B0B)' },
  { name: 'Oceano', gradient: 'linear-gradient(135deg, #0B0B1A, #104070, #0B0B1A)' },
  { name: 'Neon', gradient: 'linear-gradient(135deg, #0B0913, #20B0D0, #A885F6)' },
];

export const LIGA_NAMES = ['Ferro', 'Bronze', 'Prata', 'Ouro', 'Diamante'];
export const BOT_NAMES = ['Alex', 'Bia', 'Cadu', 'Duda', 'Eva', 'Fábio', 'Gabi', 'Hugo', 'Isa', 'Joca'];

export const DEFAULT_PLAYER = {
  name: 'Aventureiro', avatar: '😺',
  level: 1, xp: 0, xpToNext: 100, title: 'Aprendiz',
  hp: 100, maxHp: 100, coins: 0, streak: 0,
  streakFreeze: 0, dailyCombo: 0, bestCombo: 0,
  dailyXp: 0, metaBatidaHoje: false,
  onboardingDone: false, gameOver: false, deaths: 0, bestStreak: 0,
  totalMissionsDone: 0, totalHabitsDone: 0, totalFocusMinutes: 0,
  skills: { destreza: 0, saude: 0, estudos: 0, gestao: 0 },
  customSkills: [],
  atributos: { disciplina: 0, foco: 0, inteligencia: 0, shape: 0 },
  gear: { head: null, body: null, weapon: null, accessory: null },
  bossHp: 0, bossMaxHp: 100, bossName: '', bossLore: '', bossDefeated: 0, bossActive: false,
  pet: { name: '', stage: 0, xp: 0, evolutions: 0 },
  capa: 0,
};

export const DEFAULT_SETTINGS = {
  theme: 'violeta', hardcoreFail: false, hardcoreHp: false,
  dailyXpGoal: 100, maxDailyXp: 500,
  notifyEnabled: true, notifyHour: 20, notifyMin: 0,
  soundEnabled: true, gentleMode: false,
};

export const INITIAL_MARKET = {
  items: [
    { id: 'potion', name: 'Poção de Cura', desc: 'Recupera 30 HP', cost: 15 },
    { id: 'big_potion', name: '🧪 Poção Grande', desc: 'Recupera 100% do HP', cost: 40 },
    { id: 'streak_freeze', name: '❄️ Congelar Ofensiva', desc: 'Protege sua ofensiva por 1 dia', cost: 30 },
    { id: 'xp_boost', name: '⚡ XP Boost', desc: 'Dobra o XP por 30 minutos', cost: 50 },
    { id: 'loot_bronze', name: '🎁 Baú de Bronze', desc: 'Sorteio de recompensas comuns', cost: 20 },
    { id: 'loot_silver', name: '🎁 Baú de Prata', desc: 'Sorteio com itens raros', cost: 50 },
    { id: 'loot_gold', name: '👑 Baú de Ouro', desc: 'Sorteio com itens épicos', cost: 100 },
  ],
  rewards: [
    { id: 'fastfood', name: '🍔 Fast Food', desc: 'Um lanche liberado', cost: 40, weeklyLimit: 2 },
    { id: 'gamenight', name: '🎮 Noite de Games', desc: '2h de jogo sem culpa', cost: 30, weeklyLimit: 3 },
    { id: 'serie', name: '📺 Episódio de série', desc: 'Assistir 1 episódio', cost: 15, weeklyLimit: 0 },
    { id: 'doce', name: '🍫 Doce', desc: 'Um docinho', cost: 10, weeklyLimit: 4 },
    { id: 'folga', name: '🌴 Dia de folga', desc: 'Um dia off merecido', cost: 150, weeklyLimit: 0 },
    { id: 'cinema', name: '🎬 Cinema', desc: 'Uma ida ao cinema', cost: 60, weeklyLimit: 1 },
    { id: 'pizza', name: '🍕 Pizza no fim de semana', desc: 'Rodada de pizza liberada', cost: 50, weeklyLimit: 1 },
    { id: 'cafe_especial', name: '☕ Café especial', desc: 'Aquele café caro e gostoso', cost: 12, weeklyLimit: 0 },
    { id: 'preguica', name: '🛌 Manhã de preguiça', desc: 'Acordar sem alarme', cost: 80, weeklyLimit: 1 },
    { id: 'album', name: '🎧 Álbum/skin nova', desc: 'Um mimo digital', cost: 25, weeklyLimit: 0 },
  ] as { id: string; name: string; desc: string; cost: number; weeklyLimit: number }[],
  weekStart: '' as string,
  weekBuys: {} as Record<string, number>,
  purchases: [] as string[],
};

// ─── FARM-NEXT extras (Fase 1) ───
export const MEAL_TYPES = ['Café da manhã', 'Lanche da manhã', 'Almoço', 'Café da tarde', 'Pós-treino', 'Jantar'];
export const WEEK_DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export const PRIORIDADES: Record<string, { label: string; color: string }> = {
  urgente: { label: 'Urgente', color: 'text-red-400' },
  algum_dia: { label: 'Algum dia', color: 'text-sky-400' },
  pode_esperar: { label: 'Pode esperar', color: 'text-zinc-400' },
};

export const COMPANION_TIPOS: Record<string, { label: string; emoji: string }> = {
  amigo: { label: 'Amigo', emoji: '🤝' },
  pet: { label: 'Pet', emoji: '🐾' },
  parceiro: { label: 'Parceiro(a)', emoji: '❤️' },
  familia: { label: 'Família', emoji: '👨‍👩‍👧' },
};

// Itens com `auto` são desbloqueados sozinhos pelo Notifier quando o requisito
// é atingido (engine.checkHallUnlocks) — aí é só clicar em Resgatar.
export const DEFAULT_HALL: Trofeu[] = [
  { id: 'h_5kg', nome: 'Perdi 5kg', icon: '⚖️', descricao: 'Marco de transformação física.', tipo: 'trofeu', requisito: 'Perder 5kg', recompensaCoins: 100, recompensaXp: 200, status: 'disponivel', data: null },
  { id: 'h_streak30', nome: 'Constância de Ferro', icon: '🔥', descricao: '30 dias seguidos sem falhar.', tipo: 'medalha', requisito: 'Ofensiva de 30 dias', recompensaCoins: 150, recompensaXp: 300, status: 'disponivel', data: null, auto: { tipo: 'streak', valor: 30 } },
  { id: 'h_boss', nome: 'Caçador de Bosses', icon: '🗡️', descricao: 'Derrotou um chefe.', tipo: 'trofeu', requisito: 'Derrotar 1 boss', recompensaCoins: 100, recompensaXp: 150, status: 'disponivel', data: null, auto: { tipo: 'boss', valor: 1 } },
  { id: 'h_lenda', nome: 'Título: Lenda', icon: '👑', descricao: 'Alcançou o auge.', tipo: 'titulo', requisito: 'Chegar ao nível 10', recompensaCoins: 200, recompensaXp: 0, status: 'disponivel', data: null, auto: { tipo: 'level', valor: 10 } },
  { id: 'h_semestre', nome: 'Semestre Vencido', icon: '🎓', descricao: 'Fechou o semestre com aprovação.', tipo: 'conquista', requisito: 'Concluir o semestre', recompensaCoins: 120, recompensaXp: 250, status: 'disponivel', data: null },
  { id: 'h_semana_perfeita', nome: 'Semana Perfeita', icon: '🌟', descricao: '7 dias seguidos de meta batida.', tipo: 'medalha', requisito: 'Ofensiva de 7 dias', recompensaCoins: 60, recompensaXp: 100, status: 'disponivel', data: null, auto: { tipo: 'streak', valor: 7 } },
  { id: 'h_foco_10h', nome: 'Mestre do Foco', icon: '🧘', descricao: '10 horas de foco profundo acumuladas na Caverna.', tipo: 'trofeu', requisito: '600 min de foco', recompensaCoins: 120, recompensaXp: 200, status: 'disponivel', data: null, auto: { tipo: 'foco', valor: 600 } },
  { id: 'h_hidratado', nome: 'Fonte da Vida', icon: '💧', descricao: 'Meta de água completa em 14 dias.', tipo: 'trofeu', requisito: '14 dias de água em dia', recompensaCoins: 80, recompensaXp: 120, status: 'disponivel', data: null, auto: { tipo: 'agua', valor: 14 } },
  { id: 'h_rico', nome: 'Tesouro do Dragão', icon: '💰', descricao: 'Acumulou 500 moedas de uma vez.', tipo: 'conquista', requisito: 'Ter 500 moedas', recompensaCoins: 0, recompensaXp: 300, status: 'disponivel', data: null, auto: { tipo: 'moedas', valor: 500 } },
  { id: 'h_cacador', nome: 'Caçador Lendário', icon: '🏹', descricao: 'Dez chefes caíram diante de você.', tipo: 'trofeu', requisito: 'Derrotar 10 bosses', recompensaCoins: 200, recompensaXp: 300, status: 'disponivel', data: null, auto: { tipo: 'boss', valor: 10 } },
  { id: 'h_estrategista', nome: 'Título: Estrategista', icon: '♟️', descricao: '50 missões concluídas.', tipo: 'titulo', requisito: 'Concluir 50 missões', recompensaCoins: 150, recompensaXp: 250, status: 'disponivel', data: null, auto: { tipo: 'missoes', valor: 50 } },
  { id: 'h_centuriao', nome: 'Centurião', icon: '💯', descricao: '100 missões concluídas.', tipo: 'medalha', requisito: 'Concluir 100 missões', recompensaCoins: 250, recompensaXp: 400, status: 'disponivel', data: null, auto: { tipo: 'missoes', valor: 100 } },
  { id: 'h_monarca', nome: 'Título: Monarca das Sombras', icon: '👤', descricao: 'O trono mais alto do Sistema.', tipo: 'titulo', requisito: 'Chegar ao nível 25', recompensaCoins: 300, recompensaXp: 0, status: 'disponivel', data: null, auto: { tipo: 'level', valor: 25 } },
  { id: 'h_bibliotecario', nome: 'Título: Bibliotecário de Alexandria', icon: '📚', descricao: 'Cinco livros lidos até o fim.', tipo: 'titulo', requisito: 'Ler 5 livros', recompensaCoins: 100, recompensaXp: 200, status: 'disponivel', data: null, auto: { tipo: 'livros', valor: 5 } },
];

// ─── FARM-NEXT extras (Fase 2) ───
export const ACTIVITY_LEVELS = [
  { v: 1.2, label: 'Sedentário' },
  { v: 1.375, label: 'Leve (1-3x/sem)' },
  { v: 1.55, label: 'Moderado (3-5x)' },
  { v: 1.725, label: 'Ativo (6-7x)' },
  { v: 1.9, label: 'Muito ativo' },
];
export const TREINO_OBJETIVOS: Record<string, { label: string; adj: number }> = {
  cutting: { label: 'Definição (−500 kcal)', adj: -500 },
  manutencao: { label: 'Manutenção', adj: 0 },
  bulking: { label: 'Ganho (+350 kcal)', adj: 350 },
};
export const MUSCLE_GUIDE = [
  { grupo: 'Peito', exercicios: ['Supino reto', 'Supino inclinado', 'Crucifixo', 'Crossover'], dica: 'Empurrar; controle a descida.' },
  { grupo: 'Costas', exercicios: ['Puxada frente', 'Remada curvada', 'Barra fixa', 'Serrote'], dica: 'Puxe com as costas, não com o braço.' },
  { grupo: 'Pernas', exercicios: ['Agachamento', 'Leg press', 'Cadeira extensora', 'Stiff'], dica: 'Amplitude completa, core firme.' },
  { grupo: 'Ombros', exercicios: ['Desenvolvimento', 'Elevação lateral', 'Elevação frontal'], dica: 'Sem balançar o corpo.' },
  { grupo: 'Bíceps', exercicios: ['Rosca direta', 'Rosca alternada', 'Rosca martelo'], dica: 'Cotovelo fixo.' },
  { grupo: 'Tríceps', exercicios: ['Tríceps testa', 'Tríceps corda', 'Mergulho'], dica: 'Isole o cotovelo.' },
];
export const VIAGEM_STATUS: Record<string, string> = {
  quero_ir: 'Quero ir', planejando: 'Planejando', viajando: 'Viajando', ja_fui: 'Já fui', quero_voltar: 'Quero voltar',
};
export const PACKING_TEMPLATE = ['Roupas', 'Higiene', 'Documentos', 'Eletrônicos', 'Outros'];

// Sugestões rápidas de itens de mala por grupo (clique para adicionar).
export const PACKING_SUGGESTIONS: Record<string, string[]> = {
  Roupas: ['Camisas', 'Calça', 'Sapato', 'Meias', 'Cueca/Calcinha', 'Casaco', 'Pijama', 'Roupa de banho'],
  Higiene: ['Escova de dente', 'Pasta', 'Shampoo', 'Sabonete', 'Desodorante', 'Perfume', 'Toalha'],
  Documentos: ['RG/CPF', 'Passaporte', 'Passagens', 'Reservas', 'Cartão', 'Dinheiro'],
  Eletrônicos: ['Carregador', 'Fone', 'Power bank', 'Adaptador', 'Câmera'],
  Outros: ['Remédios', 'Óculos de sol', 'Guarda-chuva', 'Snacks'],
};
// Sons ambiente reais (arquivos em public/sounds, origem Wikimedia Commons —
// ver public/sounds/CREDITS.md). Substituíram o ruído sintetizado.
export const AMBIENT_TRACKS = [
  { id: 'chuva', label: '🌧️ Chuva', src: '/sounds/chuva.ogg' },
  { id: 'tempestade', label: '⛈️ Tempestade', src: '/sounds/tempestade.ogg' },
  { id: 'cafe', label: '☕ Cafeteria', src: '/sounds/cafeteria.ogg' },
  { id: 'transito', label: '🚗 Trânsito', src: '/sounds/transito.ogg' },
  { id: 'vento', label: '🌬️ Vento uivante', src: '/sounds/vento.ogg' },
  { id: 'ondas', label: '🌊 Ondas', src: '/sounds/ondas.ogg' },
  { id: 'fogo', label: '🔥 Fogueira', src: '/sounds/fogueira.ogg' },
  { id: 'gelo', label: '🧊 Gelo estalando', src: '/sounds/gelo.ogg' },
];
export const DEEPWORK_CHECKLIST = [
  'Desligar notificações do celular',
  'Fechar abas desnecessárias',
  'Deixar o celular fora de visão',
  'Pegar garrafa de água',
  'Organizar o local de estudo/trabalho',
  'Reunir os materiais necessários',
];
export const LIVRO_TIPOS = ['Medicina', 'Negócios', 'Mentalidade', 'Ficção', 'Técnico', 'Outro'];

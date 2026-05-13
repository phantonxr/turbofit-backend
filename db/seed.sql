-- TurboFit360 - Seed inicial

-- Limpeza opcional (cuidado em produção)
-- truncate table ai_messages, user_habit_progress, user_workout_progress, videos, habits, workouts restart identity;

delete from videos;
delete from user_habit_progress;
delete from habits;
delete from user_workout_progress;
delete from workouts;

-- =========================
-- 21 TREINOS (10 a 15 min)
-- =========================
insert into workouts (id, day_number, title, focus, duration_minutes, description, video_url) values
(gen_random_uuid(), 1,  'Ativação Corpo Todo Leve',          'Corpo todo', 10, 'Movimentos simples para começar com segurança e criar constância.', 'https://example.com/workouts/dia1'),
(gen_random_uuid(), 2,  'Glúteos Leve + Mobilidade',         'Glúteos',    12, 'Ative o bumbum e solte quadril com exercícios sem impacto.',        'https://example.com/workouts/dia2'),
(gen_random_uuid(), 3,  'Abdômen Suave + Postura',           'Barriga',    10, 'Core leve para firmar e melhorar postura no dia a dia.',           'https://example.com/workouts/dia3'),
(gen_random_uuid(), 4,  'Pernas Leve (Sem Pular)',           'Pernas',     12, 'Base de pernas com foco em técnica e joelhos confortáveis.',       'https://example.com/workouts/dia4'),
(gen_random_uuid(), 5,  'Corpo Todo + Cardio Baixo Impacto', 'Corpo todo', 13, 'Suor leve com movimentos fáceis para acelerar sem se exaurir.',     'https://example.com/workouts/dia5'),
(gen_random_uuid(), 6,  'Alongamento e Respiração',          'Alongamento',10, 'Recuperação ativa: alongue e destrave o corpo.',                    'https://example.com/workouts/dia6'),
(gen_random_uuid(), 7,  'Glúteos + Abdômen Leve',            'Glúteos',    12, 'Ativação do bumbum com core estável e controle.',                   'https://example.com/workouts/dia7'),

(gen_random_uuid(), 8,  'Pernas Definição (Ritmo)',          'Pernas',     12, 'Série contínua para sentir as pernas trabalhando.',                 'https://example.com/workouts/dia8'),
(gen_random_uuid(), 9,  'Abdômen + Cardio Curto',            'Barriga',    12, 'Core + final rápido para aumentar gasto sem impacto alto.',         'https://example.com/workouts/dia9'),
(gen_random_uuid(), 10, 'Glúteos Definição (Queima Boa)',    'Glúteos',    13, 'Mais intensidade no bumbum, com pausas curtas e boa forma.',        'https://example.com/workouts/dia10'),
(gen_random_uuid(), 11, 'Corpo Todo (Circuito Curto)',       'Corpo todo', 15, 'Circuito eficiente: força leve + cardio curto.',                    'https://example.com/workouts/dia11'),
(gen_random_uuid(), 12, 'Pernas + Glúteos (Foco em Base)',   'Pernas',     13, 'Construa base e firmeza com exercícios clássicos.',                 'https://example.com/workouts/dia12'),
(gen_random_uuid(), 13, 'Mobilidade + Core (Recupera)',      'Alongamento',10, 'Destrava quadril/coluna e reforça core sem stress.',                'https://example.com/workouts/dia13'),
(gen_random_uuid(), 14, 'Abdômen Definição (Sem Dor)',       'Barriga',    12, 'Trabalho de core com controle, sem puxar pescoço.',                 'https://example.com/workouts/dia14'),

(gen_random_uuid(), 15, 'Glúteos Intenso (Curto e Forte)',   'Glúteos',    14, 'Mais desafio com movimentos seguros e foco em execução.',           'https://example.com/workouts/dia15'),
(gen_random_uuid(), 16, 'Pernas Intenso (Sem Saltar)',       'Pernas',     14, 'Intensidade maior sem pular: queima, mas com respeito ao corpo.',   'https://example.com/workouts/dia16'),
(gen_random_uuid(), 17, 'Barriga + Corpo Todo (Acelera)',    'Corpo todo', 15, 'Core + circuito final para fechar o treino com energia.',           'https://example.com/workouts/dia17'),
(gen_random_uuid(), 18, 'Corpo Todo Intenso (21 Dias)',      'Corpo todo', 15, 'Treino completo com ritmo e força, sem complicação.',              'https://example.com/workouts/dia18'),
(gen_random_uuid(), 19, 'Glúteos + Pernas (Modelagem)',      'Glúteos',    15, 'Modelagem com foco em bumbum e pernas, com boa amplitude.',         'https://example.com/workouts/dia19'),
(gen_random_uuid(), 20, 'Barriga + Postura (Finalização)',   'Barriga',    12, 'Core e postura para firmar e sustentar a constância.',              'https://example.com/workouts/dia20'),
(gen_random_uuid(), 21, 'Conclusão 21 Dias (Seu Novo Ritmo)', 'Corpo todo', 12, 'Fechamento do ciclo: treino eficiente e motivador.',               'https://example.com/workouts/dia21');

-- =========================
-- 63 HÁBITOS (3 por dia)
-- =========================
insert into habits (id, day_number, title, description) values
-- Semana 1: água, treino, sono, reduzir açúcar à noite, caminhada curta
(gen_random_uuid(), 1,  'Beber 2 copos de água ao acordar', 'Deixe um copo ao lado da cama para facilitar.'),
(gen_random_uuid(), 1,  'Fazer o treino do dia',            '10 a 15 minutos, sem perfeição.'),
(gen_random_uuid(), 1,  'Dormir um pouco mais cedo',        'Tente deitar 20 minutos antes do habitual.'),

(gen_random_uuid(), 2,  'Beber água antes do café',         '1 copo antes do café já muda o dia.'),
(gen_random_uuid(), 2,  'Fazer o treino do dia',            'Se for pouco tempo, faça a versão mais leve.'),
(gen_random_uuid(), 2,  'Evitar açúcar à noite',            'Troque por fruta ou chá sem açúcar.'),

(gen_random_uuid(), 3,  'Beber 2 copos de água ao acordar', 'Hidratação = energia e constância.'),
(gen_random_uuid(), 3,  'Fazer o treino do dia',            'Só comece. O corpo entra no ritmo.'),
(gen_random_uuid(), 3,  'Caminhada curta (5 a 10 min)',     'Pode ser dentro de casa ou no quarteirão.'),

(gen_random_uuid(), 4,  'Beber água ao longo do dia',       'Meta simples: 1 garrafa até o almoço.'),
(gen_random_uuid(), 4,  'Fazer o treino do dia',            'Capriche na postura, sem pressa.'),
(gen_random_uuid(), 4,  'Evitar açúcar à noite',            'Se bater vontade: iogurte natural ou fruta.'),

(gen_random_uuid(), 5,  'Beber 2 copos de água ao acordar', 'Comece o dia com o corpo acordando junto.'),
(gen_random_uuid(), 5,  'Fazer o treino do dia',            'Hoje é dia de suar leve e seguir.'),
(gen_random_uuid(), 5,  'Dormir mais cedo',                 'Desligue telas 15 minutos antes.'),

(gen_random_uuid(), 6,  'Beber água pela manhã',            'Água primeiro, depois o resto.'),
(gen_random_uuid(), 6,  'Fazer alongamento do dia',         'Recuperar também faz parte do plano.'),
(gen_random_uuid(), 6,  'Caminhada curta (5 a 10 min)',     'Movimento leve melhora o humor.'),

(gen_random_uuid(), 7,  'Beber 2 copos de água ao acordar', 'Hábito simples, resultado cumulativo.'),
(gen_random_uuid(), 7,  'Fazer o treino do dia',            'Feche a primeira semana com orgulho.'),
(gen_random_uuid(), 7,  'Evitar açúcar à noite',            'Mantenha o controle sem radicalizar.'),

-- Semana 2: proteína, menos ultraprocessados, alongamento, refeição limpa, constância
(gen_random_uuid(), 8,  'Incluir proteína no café da manhã', 'Ovo, iogurte, queijo, ou o que for possível.'),
(gen_random_uuid(), 8,  'Fazer o treino do dia',             'Semana 2: foco em definição.'),
(gen_random_uuid(), 8,  'Alongar 5 minutos',                 'Quadril, posterior e coluna.'),

(gen_random_uuid(), 9,  'Beber água ao longo do dia',        'Meta: 6 a 8 copos (ajuste à sua rotina).'),
(gen_random_uuid(), 9,  'Fazer o treino do dia',             'Trate como compromisso curto.'),
(gen_random_uuid(), 9,  'Trocar um ultraprocessado',         'Troque por fruta, castanhas ou comida simples.'),

(gen_random_uuid(), 10, 'Incluir proteína no almoço',         'Frango, peixe, carne, ovos ou leguminosas.'),
(gen_random_uuid(), 10, 'Fazer o treino do dia',              'Glúteos em foco: execução > pressa.'),
(gen_random_uuid(), 10, 'Montar uma refeição limpa',          'Prato: proteína + legumes + carbo simples.'),

(gen_random_uuid(), 11, 'Beber água ao acordar',              'Comece já no primeiro minuto.'),
(gen_random_uuid(), 11, 'Fazer o treino do dia',              'Circuito curto: sem negociação.'),
(gen_random_uuid(), 11, 'Evitar beliscos à noite',            'Se precisar: chá ou iogurte.'),

(gen_random_uuid(), 12, 'Incluir proteína em uma refeição',    'Priorize proteína antes do carbo.'),
(gen_random_uuid(), 12, 'Fazer o treino do dia',               'Base forte e estável.'),
(gen_random_uuid(), 12, 'Alongar 5 minutos',                   'Ajuda na recuperação e postura.'),

(gen_random_uuid(), 13, 'Beber água ao longo do dia',          'Tenha uma garrafinha por perto.'),
(gen_random_uuid(), 13, 'Fazer mobilidade/alongamento',        'Dia de recuperar sem parar o plano.'),
(gen_random_uuid(), 13, 'Escolher uma refeição mais limpa',    'Menos molho pronto, mais comida de verdade.'),

(gen_random_uuid(), 14, 'Incluir proteína no jantar',          'Algo simples: omelete ou iogurte com fruta.'),
(gen_random_uuid(), 14, 'Fazer o treino do dia',              'Core com técnica.'),
(gen_random_uuid(), 14, 'Dormir mais cedo',                   'Sono ajuda no apetite e energia.'),

-- Semana 3: disciplina, hidratação, controle de beliscos, sono, treino sem falhar
(gen_random_uuid(), 15, 'Beber água ao acordar',               'A disciplina começa no básico.'),
(gen_random_uuid(), 15, 'Fazer o treino do dia',               'Treino curto e forte: faça o seu melhor seguro.'),
(gen_random_uuid(), 15, 'Evitar açúcar à noite',               'Hoje é sobre consistência.'),

(gen_random_uuid(), 16, 'Beber água ao longo do dia',          'Meta simples: 2 litros (ajuste se necessário).'),
(gen_random_uuid(), 16, 'Fazer o treino do dia',               'Sem saltar, mas com intensidade.'),
(gen_random_uuid(), 16, 'Controlar beliscos',                  'Antes de beliscar: beba água e espere 5 minutos.'),

(gen_random_uuid(), 17, 'Incluir proteína em 2 refeições',      'Mais saciedade e menos vontade de beliscar.'),
(gen_random_uuid(), 17, 'Fazer o treino do dia',               'Acelera sem exagero.'),
(gen_random_uuid(), 17, 'Alongar 5 minutos',                   'Solte quadril e lombar com calma.'),

(gen_random_uuid(), 18, 'Beber água ao acordar',                'Seu corpo responde ao repetido.'),
(gen_random_uuid(), 18, 'Fazer o treino do dia',                'Treino completo do ciclo.'),
(gen_random_uuid(), 18, 'Dormir mais cedo',                     'Recuperação = resultado sustentável.'),

(gen_random_uuid(), 19, 'Beber água ao longo do dia',           'Hidratação ajuda no foco e disposição.'),
(gen_random_uuid(), 19, 'Fazer o treino do dia',                'Modelagem: amplitude segura e controle.'),
(gen_random_uuid(), 19, 'Evitar ultraprocessados hoje',         'Hoje é comida simples e fácil.'),

(gen_random_uuid(), 20, 'Beber água ao acordar',                'Mais um dia, mais uma vitória.'),
(gen_random_uuid(), 20, 'Fazer o treino do dia',                'Core e postura para fechar forte.'),
(gen_random_uuid(), 20, 'Controlar beliscos à noite',           'Se bater fome: proteína leve + água.'),

(gen_random_uuid(), 21, 'Beber água ao acordar',                'Fechamento do ciclo: orgulho do processo.'),
(gen_random_uuid(), 21, 'Fazer o treino do dia',                'Conclua: 10 minutos e você vence.'),
(gen_random_uuid(), 21, 'Planejar o próximo passo',             'Escolha 1 hábito para manter pelos próximos 7 dias.');

-- =========================
-- VÍDEOS PLACEHOLDER
-- =========================
insert into videos (id, title, category, duration_minutes, video_url, thumbnail_url, description) values
(gen_random_uuid(), 'Abdômen sem dor no pescoço', 'Barriga', 12, 'https://example.com/videos/barriga1', 'https://example.com/thumbs/barriga1.jpg', 'Técnica simples para sentir o core com segurança.'),
(gen_random_uuid(), 'Barriga: core em 10 minutos', 'Barriga', 10, 'https://example.com/videos/barriga2', 'https://example.com/thumbs/barriga2.jpg', 'Rotina rápida para dias corridos.'),
(gen_random_uuid(), 'Glúteos: ativação com cadeira', 'Glúteos', 12, 'https://example.com/videos/gluteos1', 'https://example.com/thumbs/gluteos1.jpg', 'Ative o bumbum com apoio e controle.'),
(gen_random_uuid(), 'Glúteos: queima sem impacto', 'Glúteos', 14, 'https://example.com/videos/gluteos2', 'https://example.com/thumbs/gluteos2.jpg', 'Intensidade com respeito às articulações.'),
(gen_random_uuid(), 'Pernas: firmeza e base', 'Pernas', 13, 'https://example.com/videos/pernas1', 'https://example.com/thumbs/pernas1.jpg', 'Fortalecimento com técnica.'),
(gen_random_uuid(), 'Pernas: treino sem pular', 'Pernas', 15, 'https://example.com/videos/pernas2', 'https://example.com/thumbs/pernas2.jpg', 'Perfeito para apartamento.'),
(gen_random_uuid(), 'Corpo todo: circuito 10 min', 'Corpo todo', 10, 'https://example.com/videos/corpotodo1', 'https://example.com/thumbs/corpotodo1.jpg', 'Treino completo, curto e eficiente.'),
(gen_random_uuid(), 'Corpo todo: força leve + cardio', 'Corpo todo', 15, 'https://example.com/videos/corpotodo2', 'https://example.com/thumbs/corpotodo2.jpg', 'Para ganhar disposição.'),
(gen_random_uuid(), 'Alongamento: quadril e lombar', 'Alongamento', 10, 'https://example.com/videos/along1', 'https://example.com/thumbs/along1.jpg', 'Solte o corpo depois do trabalho.'),
(gen_random_uuid(), 'Alongamento: relaxamento noturno', 'Alongamento', 12, 'https://example.com/videos/along2', 'https://example.com/thumbs/along2.jpg', 'Rotina simples para dormir melhor.');

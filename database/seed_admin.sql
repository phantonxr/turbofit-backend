-- TurboFit360 (DEV) — Usuário de teste/admin
-- ATENÇÃO: use apenas em desenvolvimento.
-- Não rode este seed em produção e remova/troque esse usuário antes do deploy.
--
-- Requisitos:
-- - Extensão pgcrypto habilitada (o schema do projeto já cria: `create extension if not exists pgcrypto;`)
-- - Gera bcrypt/Blowfish com `crypt(..., gen_salt('bf'))`

create extension if not exists pgcrypto;

-- Cria ou atualiza o usuário admin de teste.
-- Email é UNIQUE no schema, então o UPSERT funciona via ON CONFLICT (email).
insert into users (
  id,
  name,
  email,
  password_hash,
  main_goal,
  pain_notes,
  subscription_status
)
values (
  gen_random_uuid(),
  'Admin TurboFit360',
  'admin@turbofit360.com',
  crypt('Admin@TurboPhan10', gen_salt('bf', 10)),
  'ganhar disposição',
  null,
  'inactive'
)
on conflict (email) do update
set
  name = excluded.name,
  password_hash = excluded.password_hash,
  main_goal = excluded.main_goal,
  pain_notes = excluded.pain_notes,
  subscription_status = 'inactive';

-- Opcional: ativar assinatura manualmente durante testes
-- update users
-- set subscription_status = 'active'
-- where email = 'admin@turbofit360.com';

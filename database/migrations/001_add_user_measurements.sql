-- Migration: adiciona tabela de medidas corporais do usuário

create table if not exists user_measurements (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  weight_kg numeric(5,2),
  height_cm numeric(5,1),
  waist_cm numeric(5,1),
  hip_cm numeric(5,1),
  chest_cm numeric(5,1),
  thigh_cm numeric(5,1),
  arm_cm numeric(5,1),
  notes text,
  measured_at date not null default current_date,
  created_at timestamp not null default now()
);

create index if not exists user_measurements_user_idx on user_measurements(user_id, measured_at desc);

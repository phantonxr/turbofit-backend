-- TurboFit360 - Banco (PostgreSQL)

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key,
  name text not null,
  email text unique not null,
  password_hash text not null,
  main_goal text not null,
  pain_notes text,
  subscription_status text not null default 'inactive',
  stripe_customer_id text,
  role text not null default 'user',
  created_at timestamp not null default now()
);

create table if not exists workouts (
  id uuid primary key,
  day_number int not null,
  title text not null,
  focus text not null,
  duration_minutes int not null,
  description text,
  video_url text,
  created_at timestamp not null default now()
);

create unique index if not exists workouts_day_number_unique on workouts(day_number);

create table if not exists user_workout_progress (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  workout_id uuid not null references workouts(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamp
);

create unique index if not exists user_workout_progress_unique on user_workout_progress(user_id, workout_id);

create table if not exists habits (
  id uuid primary key,
  day_number int not null,
  title text not null,
  description text,
  created_at timestamp not null default now()
);

create index if not exists habits_day_number_idx on habits(day_number);

create table if not exists user_habit_progress (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  habit_id uuid not null references habits(id) on delete cascade,
  status text,
  fail_reason text,
  completed_at timestamp,
  created_at timestamp not null default now()
);

create unique index if not exists user_habit_progress_unique on user_habit_progress(user_id, habit_id);

create table if not exists videos (
  id uuid primary key,
  title text not null,
  category text not null,
  duration_minutes int not null,
  video_url text,
  thumbnail_url text,
  description text,
  created_at timestamp not null default now()
);

create index if not exists videos_category_idx on videos(category);

create table if not exists ai_messages (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  assistant_type text not null,
  role text not null,
  content text not null,
  created_at timestamp not null default now()
);

create index if not exists ai_messages_user_assistant_idx on ai_messages(user_id, assistant_type, created_at);

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

-- Estrutura futura (MVP apenas prepara a tabela; push notification real fica para depois)
create table if not exists notifications (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  message text not null,
  scheduled_at timestamp,
  read_at timestamp
);

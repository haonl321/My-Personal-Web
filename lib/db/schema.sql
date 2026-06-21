-- Create a table for user settings/profile
create table if not exists user_settings (
  user_id text primary key,
  theme text default 'dark',
  sound_enabled boolean default true,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create a table for failures
create table if not exists failures (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text,
  description text,
  category_id text,
  mood text,
  severity integer,
  lesson text,
  action_plan text,
  occurred_at timestamp with time zone default now() not null
);

-- Create table for favorite quotes
create table if not exists favorite_quotes (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  quote_api_id text not null,
  created_at timestamp with time zone default now() not null
);

-- Create table for todos
create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  description text,
  due_date date,
  due_time text,
  priority text default 'medium',
  category_id text,
  is_completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create table for todo categories
create table if not exists todo_categories (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  color text,
  icon text,
  created_at timestamp with time zone default now() not null
);

-- Create table for missed opportunities
create table if not exists missed_opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  description text,
  reason text not null,
  regret_level integer default 3,
  lesson text,
  action_plan text,
  occurred_at timestamp with time zone default now() not null
);

-- Indexes for performance
create index if not exists failures_user_id_idx on failures(user_id);
create index if not exists favorite_quotes_user_id_idx on favorite_quotes(user_id);
create index if not exists todos_user_id_idx on todos(user_id);
create index if not exists todo_categories_user_id_idx on todo_categories(user_id);
create index if not exists missed_opportunities_user_id_idx on missed_opportunities(user_id);

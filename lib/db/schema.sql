-- Create a table for user settings/profile
create table user_settings (
  user_id text primary key,
  theme text default 'dark',
  sound_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for failures
create table failures (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  count integer not null, -- The running total count at this point? Or just an entry? Plan says "list of failures". 
  -- Actually, "Counter" implies a total number. "Timeline" implies individual failure events.
  -- Let's store individual failure events. The total count can be derived or cached.
  -- But for offline sync simplicity, maybe we store the "total count" in user_settings and individual logs here.
  -- No, let's treat each failure as a row. The "count" in the UI is count(*) of this table for user.
  -- However, user might want to manually set the count.
  -- Let's stick to: failures table stores EVENTS.
  note text,
  occurred_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster querying by user
create index failures_user_id_idx on failures(user_id);

-- Create table for favorite quotes
create table favorite_quotes (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  quote_api_id text not null, -- ID relative to our static quotes list
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index favorite_quotes_user_id_idx on favorite_quotes(user_id);

-- RLS Policies
alter table user_settings enable row level security;
alter table failures enable row level security;
alter table favorite_quotes enable row level security;

-- Policies (assuming we use Supabase Auth or pass user_id manually? 
-- Since we use Clerk, we can't easily use Supabase RLS based on auth.uid() without custom JWT logic.
-- For simplicity in this demo, since we are using Clerk, we might trust the client or set up a custom claims sync.
-- But the prompt said "Authentication: Clerk... Database: Supabase".
-- The easiest way is to use the Supabase client with the ANON key and filter by user_id in the query, 
-- relying on the application layer (API routes) to secure the data.
-- We will implement API routes protected by Clerk middleware that talk to Supabase using a SERVICE_ROLE key (optional) OR
-- simply use the anon key but handle security carefully.
-- Actually, strict RLS with Clerk requires valid JWTs. 
-- Implementation Plan says: "Auth: Clerk, Database: Supabase".
-- We will assume API Route proxy approach for security.

-- So RLS is good but we might bypass it via server-side client if needed, or implement JWT sync.
-- Let's stick to API Routes for all DB interaction to be safe.

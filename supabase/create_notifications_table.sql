-- 1. Create table if not exists
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  application_id uuid references applications(id) on delete cascade,
  message text not null,
  link text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table notifications enable row level security;

-- 3. Drop existing policies to avoid "already exists" errors
drop policy if exists "Users can view their own notifications" on notifications;
drop policy if exists "Users can delete their own notifications" on notifications;
drop policy if exists "Users can insert notifications" on notifications;

-- 4. Re-create policies
create policy "Users can view their own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users can delete their own notifications"
  on notifications for delete
  using (auth.uid() = user_id);

create policy "Users can insert notifications"
  on notifications for insert
  with check (true);

-- 5. Enable Realtime safely
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'notifications') then
    alter publication supabase_realtime add table notifications;
  end if;
end $$;

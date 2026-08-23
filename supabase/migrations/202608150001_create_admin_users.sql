-- Isora Studio administrator allowlist.
-- The customer app historically used `user_id`; new installations use it too.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- SECURITY DEFINER is the only access path the browser needs. This continues
-- to work if an older project happens to use an `id` column instead.
create or replace function public.is_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'admin_users' and column_name = 'user_id'
  ) then
    return exists (select 1 from public.admin_users a where (to_jsonb(a)->>'user_id')::uuid = auth.uid());
  end if;

  return exists (select 1 from public.admin_users a where (to_jsonb(a)->>'id')::uuid = auth.uid());
end;
$$;

revoke all on table public.admin_users from anon, authenticated;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

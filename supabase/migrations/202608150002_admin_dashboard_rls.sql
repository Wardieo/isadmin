-- Allow approved administrators to use all dashboard data.
-- Optional catalog tables are handled only when they exist.

do $$
declare
  table_name text;
begin
  foreach table_name in array array['bookings', 'reviews', 'packages', 'addons']
  loop
    if to_regclass(format('public.%I', table_name)) is not null then
      execute format('alter table public.%I enable row level security', table_name);
      execute format('drop policy if exists "Administrators have full access" on public.%I', table_name);
      execute format(
        'create policy "Administrators have full access" on public.%I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))',
        table_name
      );
      execute format('grant select, insert, update, delete on public.%I to authenticated', table_name);
    end if;
  end loop;
end
$$;

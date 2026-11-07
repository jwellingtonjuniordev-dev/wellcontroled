-- WellControled: user-owned financial entries. Run only in a dedicated project.
create extension if not exists pgcrypto;
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 120),
  category text not null check (char_length(trim(category)) between 1 and 60),
  date date not null,
  amount numeric(14,2) not null check (amount > 0 and amount <= 999999999999.99),
  type text not null check (type in ('income','expense')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists transactions_user_date_idx on public.transactions(user_id,date desc);
alter table public.transactions enable row level security;
create policy "user can read own transactions" on public.transactions for select to authenticated using ((select auth.uid())=user_id);
create policy "user can add own transactions" on public.transactions for insert to authenticated with check ((select auth.uid())=user_id);
create policy "user can edit own transactions" on public.transactions for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "user can delete own transactions" on public.transactions for delete to authenticated using ((select auth.uid())=user_id);
revoke all on public.transactions from anon;
grant select,insert,update,delete on public.transactions to authenticated;

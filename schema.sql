
-- items: 儲存彙整來的文章/連結
create table if not exists public.items (
  id bigserial primary key,
  source text not null,
  title text not null,
  url text not null unique,
  summary text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 方便 updated_at 自動更新
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_items_updated_at on public.items;
create trigger trg_items_updated_at
before update on public.items
for each row execute function public.set_updated_at();

-- 加速搜尋的索引
create extension if not exists pg_trgm; -- 需要在 supabase 啟用
create index if not exists idx_items_title_trgm on public.items using gin (title gin_trgm_ops);
create index if not exists idx_items_published_at on public.items (published_at desc);

-- Row Level Security（簡化：允許匿名讀，禁止匿名寫入）
alter table public.items enable row level security;

drop policy if exists "Allow read to anon" on public.items;
create policy "Allow read to anon"
on public.items for select
to anon
using (true);

drop policy if exists "Disallow anon insert" on public.items;
create policy "Disallow anon insert"
on public.items for insert
to anon
with check (false);

-- 服務端金鑰（service_role）仍可寫入（透過 REST），不受 RLS 限制

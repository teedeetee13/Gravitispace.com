-- =====================================================================
-- Hữu Duyên — lược đồ cơ sở dữ liệu Supabase (PostgreSQL)
-- Chạy một lần trong Supabase Dashboard → SQL Editor → New query → Run.
-- Chạy lại nhiều lần cũng an toàn (dùng IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS).
--
-- Bảo mật: Row Level Security (RLS) bật cho mọi bảng. Khoá "anon" công khai trên web
-- chỉ làm được những gì các chính sách (policy) dưới đây cho phép.
-- =====================================================================

-- 1) Dữ liệu cá nhân: mỗi người dùng một dòng JSON (hồ sơ sinh, bài đã cất, nhật ký lá bài…)
create table if not exists public.user_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint user_state_size check (pg_column_size(data) < 1000000) -- tối đa ~1 MB mỗi người
);

alter table public.user_state enable row level security;

drop policy if exists "user_state: đọc của chính mình"  on public.user_state;
drop policy if exists "user_state: tạo của chính mình"  on public.user_state;
drop policy if exists "user_state: sửa của chính mình"  on public.user_state;
drop policy if exists "user_state: xoá của chính mình"  on public.user_state;

create policy "user_state: đọc của chính mình" on public.user_state
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "user_state: tạo của chính mình" on public.user_state
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "user_state: sửa của chính mình" on public.user_state
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "user_state: xoá của chính mình" on public.user_state
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 2) Bài viết cộng đồng: người dùng gửi ở trạng thái "pending", quản trị viên duyệt trong Table Editor
create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  topic      text not null check (topic in ('tarot', 'chiem-tinh', 'tu-vi')),
  type       text not null check (type in ('trai-bai', 'giai-nghia', 'chia-se', 'hoi-dap', 'loi-nhan')),
  title      text not null default '' check (char_length(title) <= 120),
  body       text not null check (char_length(body) between 20 and 2000),
  author     text not null default 'Một người lạ' check (char_length(author) between 1 and 40),
  refs       text[] not null default '{}' check (cardinality(refs) <= 3),
  lang       text not null default 'vi',
  status     text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  hearts     integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists posts_status_created_idx on public.posts (status, created_at desc);

-- Ngôn ngữ bài viết: khớp danh mục web/assets/js/i18n/langs.js. Viết dạng ALTER để chạy lại trên CSDL cũ cũng cập nhật.
alter table public.posts drop constraint if exists posts_lang_check;
alter table public.posts add constraint posts_lang_check check (lang in ('vi', 'en', 'es', 'fr', 'de', 'zh', 'hi', 'th'));
-- Chống chèn mã / ký tự điều khiển vào tham chiếu (refs chỉ là mã lá bài, cung, con giáp: chữ thường, số, gạch ngang)
alter table public.posts drop constraint if exists posts_refs_format;
alter table public.posts add constraint posts_refs_format check (array_to_string(refs, ',') ~ '^[a-z0-9,-]*$');

alter table public.posts enable row level security;

drop policy if exists "posts: ai cũng đọc được bài đã duyệt" on public.posts;
drop policy if exists "posts: tác giả đọc bài của mình"     on public.posts;
drop policy if exists "posts: gửi bài chờ duyệt"             on public.posts;
drop policy if exists "posts: tác giả xoá bài của mình"     on public.posts;

create policy "posts: ai cũng đọc được bài đã duyệt" on public.posts
  for select to anon, authenticated using (status = 'approved');
create policy "posts: tác giả đọc bài của mình" on public.posts
  for select to authenticated using ((select auth.uid()) = user_id);
-- Người dùng chỉ được gửi bài của chính mình, ở trạng thái chờ duyệt, 0 lượt thích
create policy "posts: gửi bài chờ duyệt" on public.posts
  for insert to authenticated
  with check ((select auth.uid()) = user_id and status = 'pending' and hearts = 0);
create policy "posts: tác giả xoá bài của mình" on public.posts
  for delete to authenticated using ((select auth.uid()) = user_id);
-- Không có policy UPDATE: chỉ quản trị viên (Dashboard / service_role) mới đổi được status.

-- 3) Cho phép người dùng tự xoá tài khoản của mình (dữ liệu liên quan xoá theo nhờ ON DELETE CASCADE)
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

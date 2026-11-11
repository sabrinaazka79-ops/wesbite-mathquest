-- Jalankan di Supabase > SQL Editor
create table if not exists public.akses (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'aktif',
  order_id text,
  dibayar_pada timestamptz default now()
);
alter table public.akses enable row level security;
-- Siswa hanya boleh MEMBACA status miliknya. Tidak ada policy insert/update: hanya server (webhook) yang bisa mengaktifkan.
create policy "akses_baca_sendiri" on public.akses for select to authenticated using (auth.uid() = user_id);

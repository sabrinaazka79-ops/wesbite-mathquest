-- MathQuest Fase 3: kuis buatan pengguna + kode kuis.
-- Jalankan di Supabase: SQL Editor -> New query -> tempel semua -> Run. Aman dijalankan ulang.

-- 1. Tabel kuis (soal disimpan sebagai JSON)
create table if not exists kuis (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique default upper(substr(md5(gen_random_uuid()::text), 1, 6)),
  pembuat uuid not null default auth.uid() references auth.users on delete cascade,
  judul text not null,
  deskripsi text default '',
  soal jsonb not null,
  created_at timestamptz default now(),
  constraint kode_valid check (kode ~ '^[A-Z0-9]{4,10}$')
);
alter table kuis enable row level security;

drop policy if exists "kuis sendiri dibaca" on kuis;
drop policy if exists "kuis sendiri dibuat" on kuis;
drop policy if exists "kuis sendiri dihapus" on kuis;
create policy "kuis sendiri dibaca" on kuis for select using (pembuat = auth.uid());
create policy "kuis sendiri dibuat" on kuis for insert with check (pembuat = auth.uid());
create policy "kuis sendiri dihapus" on kuis for delete using (pembuat = auth.uid());

-- 2. Siswa lain membuka kuis lewat kode (tidak perlu akses ke seluruh tabel)
create or replace function ambil_kuis(kode_input text) returns setof kuis
language sql stable security definer set search_path = public as $$
  select * from kuis where kode = upper(trim(kode_input)) limit 1
$$;

-- 3. Hasil pengerjaan
create table if not exists hasil_kuis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  kuis_id uuid references kuis on delete set null,
  judul text,
  skor integer not null,
  total integer not null,
  created_at timestamptz default now()
);
alter table hasil_kuis enable row level security;
drop policy if exists "hasil sendiri dibaca" on hasil_kuis;
create policy "hasil sendiri dibaca" on hasil_kuis for select using (user_id = auth.uid());

-- Simpan hasil + tambah XP (10 XP per jawaban benar yang melampaui skor terbaik sebelumnya di kuis itu)
create or replace function simpan_hasil_kuis(kid uuid, jdl text, s integer, t integer) returns integer
language plpgsql security definer set search_path = public as $$
declare terbaik integer; tambah integer; xp_baru integer;
begin
  select max(h.skor) into terbaik from hasil_kuis h where h.user_id = auth.uid() and h.kuis_id = kid;
  tambah := greatest(s - coalesce(terbaik, 0), 0) * 10;
  insert into hasil_kuis (user_id, kuis_id, judul, skor, total) values (auth.uid(), kid, jdl, s, t);
  update profiles set xp = xp + tambah where id = auth.uid() returning xp into xp_baru;
  return xp_baru;
end $$;

-- 4. Pembuat kuis melihat hasil siswa yang mengerjakan kuisnya
create or replace function hasil_kuis_saya(kid uuid)
returns table (username text, skor integer, total integer, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select p.username, h.skor, h.total, h.created_at
  from hasil_kuis h
  join kuis k on k.id = h.kuis_id and k.pembuat = auth.uid()
  left join profiles p on p.id = h.user_id
  where h.kuis_id = kid
  order by h.created_at desc
$$;

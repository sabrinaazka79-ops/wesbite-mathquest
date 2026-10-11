-- MathQuest Fase 1. Supabase -> SQL Editor -> New query -> tempel -> Run (sekali saja)

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  xp integer default 0,
  created_at timestamptz default now()
);

create table kelas (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kode text unique not null
);

create table anggota_kelas (
  user_id uuid references auth.users on delete cascade,
  kelas_id uuid references kelas on delete cascade,
  primary key (user_id, kelas_id)
);

create table materi (
  id serial primary key,
  urutan integer not null,
  judul text not null,
  ikon text,
  ringkas text
);

alter table profiles enable row level security;
alter table kelas enable row level security;
alter table anggota_kelas enable row level security;
alter table materi enable row level security;

create policy "profil sendiri dibaca" on profiles for select using (id = auth.uid());
create policy "profil sendiri diubah" on profiles for update using (id = auth.uid());
create policy "anggota sendiri dibaca" on anggota_kelas for select using (user_id = auth.uid());
create policy "kelas milik anggota" on kelas for select
  using (exists (select 1 from anggota_kelas a where a.kelas_id = kelas.id and a.user_id = auth.uid()));
create policy "materi untuk yang login" on materi for select to authenticated using (true);

-- Profil dibuat otomatis saat daftar
create function buat_profil() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  return new;
end $$;
create trigger saat_daftar after insert on auth.users for each row execute function buat_profil();

-- Gabung kelas lewat kode (kode tidak bisa ditebak lewat daftar)
create function gabung_kelas(kode_input text) returns text language plpgsql security definer set search_path = public as $$
declare k kelas%rowtype;
begin
  select * into k from kelas where upper(kode) = upper(trim(kode_input));
  if not found then raise exception 'Kode tidak ditemukan'; end if;
  insert into anggota_kelas (user_id, kelas_id) values (auth.uid(), k.id) on conflict do nothing;
  return k.nama;
end $$;

insert into kelas (nama, kode) values ('Kelas VIII Demo', 'MATH8');

insert into materi (urutan, judul, ikon, ringkas) values
 (1, 'Bilangan Berpangkat', '⚡', 'Perpangkatan, sifat, dan bentuk baku'),
 (2, 'Teorema Pythagoras', '📐', 'Sisi-sisi segitiga siku-siku'),
 (3, 'PLSV dan PTLSV', '🔑', 'Persamaan dan pertidaksamaan linear satu variabel'),
 (4, 'Relasi dan Fungsi', '🔗', 'Memasangkan himpunan dan memahami fungsi'),
 (5, 'Persamaan Garis Lurus', '📈', 'Gradien dan grafik garis pada koordinat'),
 (6, 'Statistika', '🔍', 'Mengolah dan membaca data');

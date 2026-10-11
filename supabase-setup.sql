-- Jalankan di Supabase: SQL Editor -> New query -> tempel -> Run
create table if not exists kursus (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deskripsi text,
  harga integer,
  created_at timestamp default now()
);

alter table kursus enable row level security;

create policy "Boleh dibaca semua" on kursus
  for select using (true);

insert into kursus (judul, deskripsi, harga) values
  ('Dasar Bisnis Online', 'Belajar memulai bisnis dari nol', 100000),
  ('Digital Marketing', 'Strategi promosi lewat media sosial', 150000),
  ('Keuangan untuk Pemula', 'Mengatur modal, untung, dan rugi usaha kecil', 120000);

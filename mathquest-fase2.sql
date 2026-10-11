-- MathQuest Fase 2. Jalankan di SQL Editor (sekali saja)
create table progres (
  user_id uuid references auth.users on delete cascade,
  materi_urutan integer,
  skor integer not null,
  total integer not null,
  updated_at timestamptz default now(),
  primary key (user_id, materi_urutan)
);
alter table progres enable row level security;
create policy "progres sendiri dibaca" on progres for select using (user_id = auth.uid());

-- Simpan skor terbaik dan tambah XP (10 XP per jawaban benar yang baru)
create function simpan_latihan(m integer, s integer, t integer) returns integer
language plpgsql security definer set search_path = public as $$
declare lama integer; tambah integer; xp_baru integer;
begin
  select skor into lama from progres where user_id = auth.uid() and materi_urutan = m;
  tambah := greatest(s - coalesce(lama, 0), 0) * 10;
  insert into progres (user_id, materi_urutan, skor, total) values (auth.uid(), m, s, t)
  on conflict (user_id, materi_urutan) do update
    set skor = greatest(progres.skor, excluded.skor), total = excluded.total, updated_at = now();
  update profiles set xp = xp + tambah where id = auth.uid() returning xp into xp_baru;
  return xp_baru;
end $$;

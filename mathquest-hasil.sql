-- MathQuest: hasil latihan soal & game + daftar konten milik pembuat.
-- Jalankan di Supabase: SQL Editor -> New query -> tempel semua -> Run. Aman dijalankan ulang.
-- (Hasil kuis sudah ada di mathquest-fase3.sql: tabel hasil_kuis + fungsi hasil_kuis_saya.)

create table if not exists hasil_konten (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  jenis text not null check (jenis in ('latihan', 'game')),
  konten_kode text,
  judul text not null,
  skor integer not null,
  total integer not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);
alter table hasil_konten enable row level security;
drop policy if exists "hasil_konten sendiri dibaca" on hasil_konten;
create policy "hasil_konten sendiri dibaca" on hasil_konten for select using (user_id = auth.uid());

-- Apakah baris konten ini milik pengguna yang login? (membaca kolom pembuat apa pun namanya)
create or replace function milik_saya(j jsonb) returns boolean
language sql stable as $$
  select auth.uid() is not null and auth.uid()::text in (j->>'pembuat', j->>'user_id', j->>'owner_id', j->>'dibuat_oleh')
$$;

-- Admin = profiles.role = 'admin' (jika kolom role tidak ada, hasilnya false)
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select to_jsonb(p)->>'role' = 'admin' from profiles p where p.id = auth.uid()), false)
$$;

-- Siswa menyimpan hasil. Pembuat konten yang mencoba kontennya sendiri tidak dicatat.
create or replace function simpan_hasil_konten(p_jenis text, p_judul text, p_skor integer, p_total integer, p_detail jsonb default '{}')
returns boolean language plpgsql security definer set search_path = public as $$
declare n integer; kd text;
begin
  if p_jenis not in ('latihan', 'game') or p_total < 1 or p_total > 200 or p_skor < 0 or p_skor > p_total or coalesce(trim(p_judul), '') = '' then
    return false;
  end if;
  if exists (select 1 from konten c where c.jenis = p_jenis and c.judul = p_judul and milik_saya(to_jsonb(c))) then
    return false;
  end if;
  select count(*), max(c.kode) into n, kd from konten c where c.jenis = p_jenis and c.judul = p_judul;
  insert into hasil_konten (user_id, jenis, konten_kode, judul, skor, total, detail)
  values (auth.uid(), p_jenis, case when n = 1 then kd end, p_judul, p_skor, p_total, coalesce(p_detail, '{}'::jsonb));
  return true;
end $$;

-- Daftar konten (latihan / game) milik pembuat; admin melihat semua
create or replace function konten_saya(p_jenis text)
returns table (judul text, kode text, kelas text)
language sql stable security definer set search_path = public as $$
  select c.judul, c.kode, c.kelas::text from konten c
  where c.jenis = p_jenis and (milik_saya(to_jsonb(c)) or is_admin())
  order by c.dibuat desc
$$;

-- Pembuat melihat hasil siswa pada kontennya
create or replace function hasil_konten_saya(p_jenis text, p_judul text)
returns table (username text, skor integer, total integer, detail jsonb, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select p.username, h.skor, h.total, h.detail, h.created_at
  from hasil_konten h left join profiles p on p.id = h.user_id
  where h.jenis = p_jenis and h.judul = p_judul
    and (is_admin() or exists (select 1 from konten c where c.jenis = p_jenis and c.judul = p_judul and milik_saya(to_jsonb(c))))
  order by h.created_at desc
$$;

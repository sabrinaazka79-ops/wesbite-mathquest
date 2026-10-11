const SUPABASE_URL = 'https://qoeflqydmemenxwjulaw.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_zZom9gkYPDfJFYMcosOXmg_KvBfwFE4'
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const app = document.getElementById('app')

let kelasNama = '', user = null, mode = 'masuk', tab = 'beranda'
// mode: 'masuk' | 'daftar' | 'lupa' | 'baru' (password baru setelah klik link email)

const aman = t => { const e = document.createElement('div'); e.textContent = t ?? ''; return e.innerHTML }
const $ = id => document.getElementById(id)
const pesan = (teks, tipe = 'err') => { $('pesan').innerHTML = `<div class="msg ${tipe}">${aman(teks)}</div>` }

try { const t = localStorage.getItem('tema'); if (t) document.documentElement.dataset.theme = t } catch (e) {}
function gantiTema() {
  const baru = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = baru
  try { localStorage.setItem('tema', baru) } catch (e) {}
}

db.auth.onAuthStateChange((event, s) => {
  user = s?.user ?? null
  if (event === 'PASSWORD_RECOVERY') mode = 'baru'
  if (mode === 'baru' && event !== 'PASSWORD_RECOVERY') return
  render()
})

async function render() {
  if (mode === 'baru') return tampilPasswordBaru()
  if (!user) return tampilAuth()
  const { data } = await db.from('anggota_kelas').select('kelas(nama)').eq('user_id', user.id).limit(1)
  if (!data || !data.length) return tampilKode()
  tampilUtama(data[0].kelas.nama)
}

/* ---------- Daftar / Masuk ---------- */
function tampilAuth() {
  if (mode === 'lupa') return tampilLupa()
  const daftar = mode === 'daftar'
  app.innerHTML = `<div class="auth card">
    <h1>MathQuest</h1><p class="kecil">Belajar matematika jadi lebih seru.</p>
    <div class="tabs">
      <button class="btn ${daftar ? 'alt' : ''}" id="tMasuk">Masuk</button>
      <button class="btn ${daftar ? '' : 'alt'}" id="tDaftar">Daftar</button>
    </div>
    <form id="formAuth">
      <label for="email">Email</label><input id="email" type="email" required autocomplete="email">
      ${daftar ? '<label for="username">Username</label><input id="username" required minlength="3" maxlength="20">' : ''}
      <label for="pw">Password</label><input id="pw" type="password" required minlength="6" autocomplete="${daftar ? 'new-password' : 'current-password'}">
      ${daftar ? '<label for="pw2">Ulangi password</label><input id="pw2" type="password" required>' : ''}
      <p><button class="btn" type="submit">${daftar ? 'Buat akun' : 'Masuk'}</button></p>
      ${daftar ? '' : '<p><a href="#" id="lupa" style="color:var(--p);font-weight:800">Lupa password?</a></p>'}
    </form><div id="pesan"></div></div>`
  $('tMasuk').onclick = () => { mode = 'masuk'; tampilAuth() }
  $('tDaftar').onclick = () => { mode = 'daftar'; tampilAuth() }
  if ($('lupa')) $('lupa').onclick = ev => { ev.preventDefault(); mode = 'lupa'; tampilAuth() }
  $('formAuth').onsubmit = async ev => {
    ev.preventDefault()
    const email = $('email').value.trim(), pw = $('pw').value
    if (daftar) {
      if (pw !== $('pw2').value) return pesan('Password dan ulangi password harus sama.')
      const { data, error } = await db.auth.signUp({ email, password: pw, options: { data: { username: $('username').value.trim() } } })
      if (error) return pesan(error.message)
      if (!data.session) pesan('Akun dibuat. Cek email untuk konfirmasi, lalu masuk.', 'ok')
    } else {
      const { error } = await db.auth.signInWithPassword({ email, password: pw })
      if (error) {
        const m = (error.message || '').toLowerCase()
        if (m.includes('not confirmed')) {
          pesan('Email belum dikonfirmasi. Buka email konfirmasi dari MathQuest dan klik link-nya, lalu masuk lagi.')
          $('pesan').insertAdjacentHTML('beforeend', '<p><button class="btn alt" type="button" id="kirimUlang">Kirim ulang email konfirmasi</button></p>')
          $('kirimUlang').onclick = async () => {
            const { error: e2 } = await db.auth.resend({ type: 'signup', email })
            pesan(e2 ? 'Gagal mengirim ulang: ' + e2.message : 'Email konfirmasi dikirim ulang. Cek Gmail kamu.', e2 ? 'err' : 'ok')
          }
        } else if (m.includes('invalid login')) {
          pesan('Email atau password salah.')
        } else {
          pesan('Gagal masuk: ' + error.message)
        }
      }
    }
  }
}

/* ---------- Lupa password ---------- */
function tampilLupa() {
  app.innerHTML = `<div class="auth card"><h2>Lupa password?</h2>
    <p class="kecil">Masukkan email akunmu. Kami kirim link untuk membuat password baru.</p>
    <form id="formLupa"><label for="email">Email</label><input id="email" type="email" required autocomplete="email">
    <p><button class="btn" type="submit">Kirim link reset</button>
    <button class="btn alt" type="button" id="kembali">Kembali</button></p></form><div id="pesan"></div></div>`
  $('kembali').onclick = () => { mode = 'masuk'; tampilAuth() }
  $('formLupa').onsubmit = async ev => {
    ev.preventDefault()
    const { error } = await db.auth.resetPasswordForEmail($('email').value.trim(), { redirectTo: location.origin + location.pathname })
    if (error) return pesan('Gagal mengirim email: ' + error.message)
    pesan('Link reset sudah dikirim. Cek kotak masuk Gmail (juga folder Spam), klik link-nya, lalu buat password baru.', 'ok')
  }
}

/* ---------- Password baru (setelah klik link di email) ---------- */
function tampilPasswordBaru() {
  app.innerHTML = `<div class="auth card"><h2>Buat password baru</h2>
    <form id="formBaru">
    <label for="pwBaru">Password baru</label><input id="pwBaru" type="password" required minlength="6" autocomplete="new-password">
    <label for="pwBaru2">Ulangi password baru</label><input id="pwBaru2" type="password" required minlength="6" autocomplete="new-password">
    <p><button class="btn" type="submit">Simpan password</button></p></form><div id="pesan"></div></div>`
  $('formBaru').onsubmit = async ev => {
    ev.preventDefault()
    const pw = $('pwBaru').value
    if (pw !== $('pwBaru2').value) return pesan('Password dan ulangi password harus sama.')
    const { error } = await db.auth.updateUser({ password: pw })
    if (error) return pesan('Gagal menyimpan password: ' + error.message)
    history.replaceState(null, '', location.pathname)
    mode = 'masuk'
    render()
  }
}

/* ---------- Kode kelas ---------- */
function tampilKode() {
  app.innerHTML = `<div class="auth card"><h2>Masukkan kode kelas</h2>
    <p class="kecil">Minta kode dari gurumu untuk masuk ke kelas.</p>
    <form id="formKode"><label for="kode">Kode kelas</label><input id="kode" required autocomplete="off">
    <p><button class="btn" type="submit">Masuk kelas</button>
    <button class="btn alt" type="button" id="keluar">Keluar akun</button></p></form><div id="pesan"></div></div>`
  $('keluar').onclick = () => db.auth.signOut()
  $('formKode').onsubmit = async ev => {
    ev.preventDefault()
    const { error } = await db.rpc('gabung_kelas', { kode_input: $('kode').value })
    if (error) return pesan('Kode tidak ditemukan. Periksa lagi kodenya.')
    render()
  }
}

/* ---------- Halaman utama ---------- */
function tampilUtama(namaKelas) {
  kelasNama = namaKelas
  const menu = [['beranda', 'Beranda'], ['dashboard', 'Dashboard'], ['hasil', 'Pencapaian'], ['profil', 'Profil']]
  app.innerHTML = `<div class="bar"><div class="logo">MathQuest</div>
    <nav>${menu.map(([k, n]) => `<button class="${tab === k ? 'on' : ''}" data-tab="${k}">${n}</button>`).join('')}
    <button id="tema" aria-label="Ganti tema">🌓</button></nav></div><div id="isi"></div>`
  app.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; tampilUtama(namaKelas) })
  $('tema').onclick = gantiTema
  ;({ beranda: beranda, dashboard: dashboard, hasil: pencapaian, profil: profil })[tab](namaKelas)
}

async function beranda(namaKelas) {
  $('isi').innerHTML = `<h2>Halo! Ayo belajar</h2><p class="kecil">Kelas: ${aman(namaKelas)}</p><div class="grid" id="grid">Memuat materi...</div>`
  const { data, error } = await db.from('materi').select('*').order('urutan')
  if (error) return $('grid').textContent = 'Gagal memuat materi: ' + error.message
  const { data: pr } = await db.from('progres').select('materi_urutan,skor,total').eq('user_id', user.id)
  const pm = Object.fromEntries((pr || []).map(p => [p.materi_urutan, Math.round(100 * p.skor / p.total)]))
  $('grid').innerHTML = data.map(m => { const p = pm[m.urutan] || 0; return `<div class="card materi">
    <div class="ikon">${aman(m.ikon)}</div><h3>${aman(m.judul)}</h3><p>${aman(m.ringkas)}</p>
    <div class="prog"><span style="width:${p}%"></span></div><p class="kecil">Progres ${p}%</p>
    <button class="btn" data-u="${m.urutan}">Buka materi</button></div>` }).join('')
  $('grid').querySelectorAll('[data-u]').forEach(b => b.onclick = () => bukaMateri(data.find(m => m.urutan == b.dataset.u)))
}

function segera() {
  $('isi').innerHTML = `<div class="card"><h2>Segera hadir</h2><p>Halaman ini dibangun di tahap berikutnya.</p></div>`
}

async function profil() {
  const { data } = await db.from('profiles').select('username,xp').eq('id', user.id).single()
  $('isi').innerHTML = `<div class="card"><h2>Profil</h2>
    <div class="row"><span>Username</span><strong>${aman(data?.username)}</strong></div>
    <div class="row"><span>Email</span><strong>${aman(user.email)}</strong></div>
    <div class="row"><span>XP</span><strong>${data?.xp ?? 0}</strong></div>
    <p><button class="btn" id="logout">Keluar</button></p></div>`
  $('logout').onclick = () => db.auth.signOut()
}

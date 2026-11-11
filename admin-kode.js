/* MathQuest - Dashboard Admin: buat dan kelola kode aktivasi Premium.
   Tombol "Admin" hanya muncul untuk email admin. Pengecekan sebenarnya dilakukan oleh database
   (fungsi adalah_admin, buat_kode, daftar_kode, hapus_kode), jadi orang lain tidak bisa membobolnya
   walaupun mengutak-atik tampilan. */
(function () {
  let adminUid = null, adminHasil = false

  async function cekAdmin() {
    if (!user) return false
    if (adminUid === user.id) return adminHasil
    try {
      const { data, error } = await db.rpc('adalah_admin')
      adminHasil = !error && data === true
    } catch (e) { adminHasil = false }
    adminUid = user.id
    return adminHasil
  }

  /* Dipanggil dari tampilUtama() di app.js: menambah tombol "Admin" di menu bila pengguna adalah admin */
  async function pasangTombolAdmin(namaKelas) {
    if (!(await cekAdmin())) return
    const nav = app.querySelector('nav')
    if (!nav || nav.querySelector('[data-admin]')) return
    const b = document.createElement('button')
    b.dataset.admin = '1'
    b.textContent = 'Admin'
    if (tab === 'admin') b.className = 'on'
    b.onclick = () => { tab = 'admin'; tampilUtama(namaKelas) }
    nav.insertBefore(b, $('tema'))
  }

  const tgl = t => t ? new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
  const info = (teks, tipe = 'err') => { const el = $('pesanAdmin'); if (el) el.innerHTML = `<div class="msg ${tipe}">${aman(teks)}</div>` }

  async function tampilAdmin() {
    if (!(await cekAdmin())) {
      $('isi').innerHTML = '<div class="card"><h2>Khusus admin</h2><p class="kecil">Akun ini tidak punya akses ke halaman admin.</p></div>'
      return
    }
    $('isi').innerHTML = `<div class="card">
      <h2>Kode aktivasi</h2>
      <p class="kecil">Buat kode untuk dijual lewat toko online atau diberikan ke sekolah. Satu kode hanya bisa dipakai sekali.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <select id="adPaket" aria-label="Paket" style="flex:2;min-width:160px;width:auto">
          <option value="premium">Premium (Materi 3-6, kuis &amp; game)</option>
        </select>
        <input id="adJumlah" type="number" min="1" max="500" value="10" aria-label="Jumlah kode" style="flex:1;min-width:90px;width:auto">
        <button class="btn" id="adBuat" type="button">Buat kode</button>
      </div>
      <label for="adCatatan">Catatan (opsional)</label>
      <input id="adCatatan" maxlength="80" placeholder="Contoh: SMP Negeri 1 atau Toko Shopee">
      <label for="adHasil">Kode yang baru dibuat</label>
      <textarea id="adHasil" rows="6" readonly placeholder="Kode yang baru dibuat muncul di sini, satu baris per kode." style="font-family:monospace"></textarea>
      <p><button class="btn alt" id="adSalin" type="button">Salin semua</button></p>
      <div id="pesanAdmin"></div>
    </div>
    <div class="card box"><h2>Daftar kode</h2>
      <p><button class="btn alt" id="adMuat" type="button">Muat ulang</button></p>
      <div id="adDaftar">Memuat...</div></div>`

    $('adBuat').onclick = buat
    $('adSalin').onclick = salin
    $('adMuat').onclick = muatDaftar
    muatDaftar()
  }

  async function buat() {
    const n = parseInt($('adJumlah').value, 10)
    if (!n || n < 1 || n > 500) return info('Jumlah kode harus antara 1 dan 500.')
    const btn = $('adBuat')
    btn.disabled = true; btn.textContent = 'Membuat...'
    const { data, error } = await db.rpc('buat_kode', {
      p_jumlah: n, p_paket: $('adPaket').value, p_catatan: $('adCatatan').value.trim() || null
    })
    btn.disabled = false; btn.textContent = 'Buat kode'
    if (error) return info('Gagal membuat kode: ' + error.message)
    $('adHasil').value = (data || []).map(r => r.hasil_kode).join('\n')
    info(`${(data || []).length} kode berhasil dibuat. Salin dan simpan, lalu bagikan.`, 'ok')
    muatDaftar()
  }

  async function salin() {
    const ta = $('adHasil')
    if (!ta.value) return info('Belum ada kode untuk disalin. Klik "Buat kode" dulu.')
    try { await navigator.clipboard.writeText(ta.value) }
    catch (e) { ta.select(); document.execCommand('copy') }
    info('Kode sudah disalin.', 'ok')
  }

  async function muatDaftar() {
    const box = $('adDaftar')
    if (!box) return
    const { data, error } = await db.rpc('daftar_kode')
    if (error) { box.textContent = 'Gagal memuat daftar: ' + error.message; return }
    if (!data.length) { box.innerHTML = '<p class="kecil">Belum ada kode.</p>'; return }
    const pakai = data.filter(k => k.pemakai).length
    box.innerHTML = `<p class="kecil">${data.length} kode, ${pakai} sudah dipakai, ${data.length - pakai} belum.</p>` +
      data.map(k => `<div class="row" style="align-items:center;flex-wrap:wrap">
        <span><code style="font-weight:800">${aman(k.kode)}</code><br>
          <span class="kecil">${aman(k.paket)}${k.catatan ? ' · ' + aman(k.catatan) : ''} · dibuat ${tgl(k.dibuat_pada)}</span></span>
        <span style="text-align:right">${k.pemakai
          ? `<strong>Dipakai</strong><br><span class="kecil">${aman(k.pemakai)} · ${tgl(k.dipakai_pada)}</span>`
          : `<span class="kecil">Belum dipakai</span> <button class="btn alt" type="button" data-hapus="${aman(k.kode)}">Hapus</button>`}</span></div>`).join('')
    box.querySelectorAll('[data-hapus]').forEach(b => b.onclick = async () => {
      if (!confirm('Hapus kode ' + b.dataset.hapus + '?')) return
      const { error: e } = await db.rpc('hapus_kode', { p_kode: b.dataset.hapus })
      if (e) return info('Gagal menghapus: ' + e.message)
      muatDaftar()
    })
  }

  window.cekAdmin = cekAdmin
  window.pasangTombolAdmin = pasangTombolAdmin
  window.tampilAdmin = tampilAdmin
})()

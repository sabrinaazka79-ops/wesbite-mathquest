/* paket.js: pilihan Gratis / Premium setelah login (Premium Rp35.000, sekali bayar, bebas ganti paket).
   Situs tetap tampil normal (Beranda, Dashboard, Pencapaian, Profil, semua kotak kode). Yang berbeda hanya:
   - Beranda: Gratis = materi 1-2, Premium = materi 3-6
   - Dashboard: Gratis = buat latihan soal + materi; Premium = ditambah kuis + game
   Pasang PALING AKHIR di index.html (setelah semua file lain). File lain tidak diubah. */
(function () {
  const HARGA = 35000                        // harga Premium (sekali bayar). Samakan dengan harga di server/pembayaran
  const GRATIS = [1, 2]                      // urutan materi paket Gratis
  const JUDUL_PREMIUM = ['game saya', 'buat game'] // judul kartu di Dashboard yang khusus Premium (huruf kecil)

  const paket = () => sessionStorage.getItem('mq_paket')
  // Sambungkan ke premium.js: window.apakahPremium = () => true/false
  const punyaPremium = () => {
    try { return typeof window.apakahPremium === 'function' ? !!window.apakahPremium() : localStorage.getItem('mq_premium_' + user.id) === '1' } catch (e) { return false }
  }
  const aktifPremium = () => paket() === 'premium' && punyaPremium()

  document.head.insertAdjacentHTML('beforeend', `<style>
    .pk-pilih{position:fixed;inset:0;z-index:2147483000;overflow:auto;background:var(--bg,#f6f4ff);-webkit-overflow-scrolling:touch}
    .pk-tutup{position:absolute;top:0;right:14px}
    .pk-harga{padding:12px 16px 0}
    .paket-wrap{position:relative;z-index:10000;max-width:780px;margin:28px auto;padding:0 14px;text-align:center}
    .paket-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-top:18px;text-align:left}
    .paket{padding:0;overflow:hidden}
    .paket .pk-top{background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;padding:18px;font-size:1.7rem;display:flex;gap:10px;align-items:center}
    .paket ul{margin:0;padding:16px 16px 0 36px;line-height:1.7}
    .paket .btn{margin:14px 16px 16px;width:calc(100% - 32px)}
    .tile.lock .top{filter:grayscale(.75)} .tile .lk{position:absolute;top:10px;right:14px;font-size:1.3rem}
    #pk-chip{padding:3px 12px;font-size:.8rem;margin-left:8px;vertical-align:middle}
    .pk-ov{position:fixed;inset:0;background:#0008;display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px}
    .pk-ov .card{max-width:360px;text-align:center}
  </style>`)

  /* ---------- Pilih paket ----------
     Layar ini dipasang di <body> (bukan di #app), jadi render ulang apa pun tidak bisa menimpanya.
     Semua klik ditangani lewat satu pendengar di overlay itu sendiri. */
  const rp = n => 'Rp' + Number(n).toLocaleString('id-ID')
  function tutupPilih() { const o = document.getElementById('pk-pilih'); if (o) o.remove(); document.documentElement.style.overflow = '' }
  function tampilPilihPaket() {
    const lama = document.getElementById('pk-pilih'); if (lama) lama.remove()
    const punya = punyaPremium(), sekarang = paket()
    const o = document.createElement('div'); o.id = 'pk-pilih'; o.className = 'pk-pilih'
    o.innerHTML = `<div class="paket-wrap">
      ${sekarang ? '<button class="btn alt pk-tutup" data-aksi="tutup">✕ Tutup</button>' : ''}
      <h1>MathQuest</h1><p class="kecil">Pilih paket belajarmu. Kamu bisa ganti kapan saja.</p>
      <div class="paket-grid">
        <div class="card paket" style="--c1:#16a36a;--c2:#5ed8a2"><div class="pk-top">🎒 <b>Gratis</b></div>
          <ul><li>Materi Bilangan Berpangkat</li><li>Materi Teorema Pythagoras</li><li>Dashboard: buat latihan soal &amp; materi</li></ul>
          <button class="btn" data-aksi="gratis">${sekarang === 'gratis' ? '✓ Sedang dipakai · Masuk' : 'Masuk Gratis'}</button></div>
        <div class="card paket" style="--c1:#6c4cf1;--c2:#a78bfa"><div class="pk-top">👑 <b>Premium</b></div>
          <ul><li>PLSV &amp; PTLSV</li><li>Relasi &amp; Fungsi</li><li>Persamaan Garis Lurus</li><li>Statistika</li><li>Dashboard: latihan soal, materi, kuis &amp; game</li></ul>
          <div class="pk-harga">${punya ? '✅ Sudah kamu miliki' : `<b>${rp(HARGA)}</b> <span class="kecil">sekali bayar, seumur hidup</span>`}</div>
          <button class="btn" data-aksi="premium">${punya ? (sekarang === 'premium' ? '✓ Sedang dipakai · Masuk' : 'Masuk Premium') : `Beli Premium · ${rp(HARGA)}`}</button></div>
      </div><div class="kecil" id="pk-err" style="margin-top:12px;min-height:1.2em"></div></div>`
    o.addEventListener('click', ev => {
      const b = ev.target.closest('[data-aksi]'); if (!b) return
      ev.stopPropagation(); aksiPaket(b.dataset.aksi)
    })
    document.body.appendChild(o); document.documentElement.style.overflow = 'hidden'
  }
  function pesan(t) { const e = document.getElementById('pk-err'); if (e) e.textContent = t }
  function masuk(p) {
    sessionStorage.setItem('mq_paket', p); tutupPilih()
    try { tab = 'beranda' } catch (e) {}
    try { const r = window.render(); if (r && r.catch) r.catch(console.error) } catch (e) { console.error(e) }
  }
  function aksiPaket(a) {
    if (a === 'tutup') return tutupPilih()
    if (a === 'gratis') return masuk('gratis')
    if (a === 'premium') {
      if (punyaPremium()) return masuk('premium')
      if (typeof window.mulaiPembayaran === 'function') { pesan('Membuka pembayaran…'); try { return window.mulaiPembayaran() } catch (e) { return pesan('Gagal membuka pembayaran: ' + e.message) } }
      pesan('Tombol pembayaran belum tersambung (window.mulaiPembayaran di premium.js).')
    }
  }
  // Kembali dari halaman bayar / pindah tab: segarkan status Premium di layar pilih paket
  const segarkan = () => { if (document.getElementById('pk-pilih')) tampilPilihPaket() }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) segarkan() })
  window.addEventListener('focus', segarkan)
  window.pilihPaketLagi = tampilPilihPaket

  /* ---------- Jendela terkunci ---------- */
  function kunci(nama) {
    const lama = document.getElementById('pk-ov'); if (lama) lama.remove()
    document.body.insertAdjacentHTML('beforeend', `<div class="pk-ov" id="pk-ov"><div class="card"><div style="font-size:3rem">🔒</div><h2>${aman(nama)}</h2>
      <p>Bagian ini khusus paket Premium.</p><p><button class="btn" id="pk-up">Upgrade ke Premium</button> <button class="btn alt" id="pk-x">Tutup</button></p><div class="kecil" id="pk-msg"></div></div></div>`)
    document.getElementById('pk-x').onclick = () => document.getElementById('pk-ov').remove()
    document.getElementById('pk-up').onclick = () => {
      if (typeof window.mulaiPembayaran === 'function') { document.getElementById('pk-ov').remove(); window.mulaiPembayaran() }
      else document.getElementById('pk-msg').textContent = 'Tombol pembayaran belum tersambung (window.mulaiPembayaran di premium.js).'
    }
  }

  // Materi di luar paket Gratis wajib premium, dari jalur mana pun dibuka
  const bukaLama = window.bukaMateri
  window.bukaMateri = function (m) {
    if (!GRATIS.includes(+m.urutan) && !punyaPremium()) return kunci(m.judul)
    return bukaLama(m)
  }

  /* ---------- Saring tampilan (dijalankan tiap halaman berubah) ---------- */
  const urutanTile = t => {
    const b = t.querySelector('[data-u]'); if (b) return +b.dataset.u
    const n = t.querySelector('.no'), r = n && n.textContent.match(/(\d+)/); return r ? +r[1] : 0
  }
  function saring() {
    if (!user || !paket()) return
    const p = paket(), prem = aktifPremium()
    document.querySelectorAll('#isi .tile').forEach(t => {
      const u = urutanTile(t); if (!u) return
      const boleh = GRATIS.includes(u) === (p === 'gratis'), want = boleh ? '' : 'none'
      if (t.style.display !== want) t.style.display = want
      if (boleh && !GRATIS.includes(u) && !punyaPremium() && !t.querySelector('.lk')) { t.classList.add('lock'); t.insertAdjacentHTML('beforeend', '<div class="lk">🔒</div>') }
    })
    const h = document.querySelector('#isi h2')
    if (h && document.querySelector('#isi .tile') && !document.getElementById('pk-chip'))
      h.insertAdjacentHTML('beforeend', `<button class="btn alt" id="pk-chip">${p === 'premium' ? '👑 Premium' : '🎒 Gratis'} · ganti</button>`)
    if (prem) return
    // Dashboard: tab Kuis terkunci, pindah otomatis ke tab Materi
    const kt = document.querySelector('.kq-tab[data-tab="kuis"]')
    if (kt) {
      if (!kt.textContent.includes('🔒')) kt.insertAdjacentHTML('afterbegin', '🔒 ')
      if (kt.classList.contains('on')) { const mt = document.querySelector('.kq-tab[data-tab="materi"]'); if (mt) mt.click() }
    }
    // Dashboard: kartu game terkunci
    document.querySelectorAll('#isi h2,#isi h3,#isi b,#isi strong').forEach(e => {
      if (e.children.length || !JUDUL_PREMIUM.includes(e.textContent.trim().toLowerCase())) return
      const c = e.closest('.card'); if (!c || c.style.display === 'none') return
      c.style.display = 'none'
      c.insertAdjacentHTML('afterend', `<div class="card" style="margin-top:12px;text-align:center">🔒 <b>${aman(e.textContent.trim())}</b> khusus Premium <button class="btn" data-pk-up>Upgrade</button></div>`)
    })
  }
  document.addEventListener('click', ev => {
    const t = ev.target
    if (t.closest('#pk-chip')) { ev.preventDefault(); ev.stopPropagation(); return tampilPilihPaket() }
    if (!aktifPremium() && user && t.closest('.kq-tab[data-tab="kuis"]')) { ev.stopPropagation(); ev.preventDefault(); kunci('Buat kuis') }
    if (t.closest('[data-pk-up]')) kunci('Buat game')
  }, true)
  let raf = 0
  new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(saring) }).observe(app, { childList: true, subtree: true })

  /* Setelah login: jika belum memilih paket, tampilkan layar pilih paket (dan pulihkan bila ada yang menutupnya). */
  const perluPilih = () => user && !paket() && !(typeof mode !== 'undefined' && mode === 'baru')
  new MutationObserver(() => { if (perluPilih() && !document.getElementById('pk-pilih')) tampilPilihPaket() }).observe(app, { childList: true })
  const renderLama = window.render
  window.render = async function () {
    if (!user) { sessionStorage.removeItem('mq_paket'); tutupPilih(); return renderLama() }
    const r = renderLama()
    if (perluPilih()) tampilPilihPaket()
    return r
  }
})()

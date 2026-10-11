/* Menyimpan hasil Istana Harta Karun (kuis edukasi) di semua materi ke database, lalu muncul di Pencapaian.
   Memantau layar "Hasil: X dari 5 soal benar" di dalam kotak #game, jadi file materi tidak perlu diubah.
   Muat SETELAH materi1.js sampai materi6.js dan setelah ingat.js. */
(() => {
  let materiAktif = null, modeAktif = 'edukasi'

  /* Catat materi yang sedang dibuka */
  const _buka = window.bukaMateri
  if (_buka) window.bukaMateri = m => { materiAktif = m.urutan; return _buka(m) }

  /* Catat jenis kuis yang dipilih (Kuis Biasa, Mencocokkan, Puzzle, Hitung Cepat) */
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('#game [data-m]')
    if (b) modeAktif = b.dataset.m
  }, true)

  new MutationObserver(async () => {
    const g = document.getElementById('game'); if (!g) return
    const h = g.querySelector('h3'); if (!h || h.dataset.tersimpan) return
    const mt = /Hasil:\s*(\d+)\s*dari\s*(\d+)/.exec(h.textContent); if (!mt) return
    h.dataset.tersimpan = '1'
    let m = materiAktif
    if (m == null && typeof bacaPosisi === 'function') m = (bacaPosisi() || {}).materi
    const info = document.createElement('p'); info.className = 'kecil'; info.textContent = 'Menyimpan hasil...'
    h.insertAdjacentElement('afterend', info)
    if (m == null) { info.textContent = 'Hasil belum tersimpan: materi tidak dikenali.'; return }
    const { data, error } = await db.rpc('simpan_edukasi', { m, jenis_in: modeAktif, s: +mt[1], t: +mt[2] })
    info.textContent = error
      ? 'Hasil belum tersimpan. Penyebab: ' + (error.message || 'tidak diketahui') + ' (jika berkaitan dengan "schema cache" atau "function", jalankan mathquest-edukasi.sql di Supabase).'
      : `Hasil tersimpan di Pencapaian. Total XP kamu: ${data}.`
  }).observe(document.body, { childList: true, subtree: true })
})()

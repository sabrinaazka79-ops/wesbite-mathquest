/* kuis-contoh.js — TAMBAHAN untuk MathQuest. Tidak mengubah kuis.js maupun file lain.
   Isi: contoh otomatis untuk 5 jenis soal kuis (Pilihan ganda, Kartu diacak, Benar/Salah, Essai, Banyak jawaban).
   1) Di halaman "Buat kuis": tombol ✨ untuk menambahkan soal contoh tiap jenis, atau ✨ semua jenis sekaligus.
   2) Di Dashboard, tab Kuis (di bawah daftar "Kuis saya"): tombol untuk mencoba kuis contoh. Hanya dilihat, hasil tidak disimpan.
      Kotak contoh ini gratis untuk semua akun; yang premium hanya tombol "+ Buat kuis".
   Pasang di index.html, PALING BAWAH setelah script lainnya:  tambahkan satu tag script dengan src="kuis-contoh.js" */
;(function () {
  if (window.__kcLoaded) return
  window.__kcLoaded = true

  const URUT = ['pg', 'kartu', 'bs', 'isian', 'mc']
  /* satu contoh soal matematika kelas 8 untuk tiap jenis (bentuknya sama persis dengan soalBaru() di kuis.js) */
  const CONTOH = {
    pg: () => ({
      tipe: 'pg', q: 'Panjang sisi miring segitiga siku-siku dengan sisi 6 cm dan 8 cm adalah ...',
      opsi: ['9 cm', '10 cm', '12 cm', '14 cm'], benar: [1], jawab: '',
      pemb: 'Gunakan c² = a² + b² = 6² + 8² = 36 + 64 = 100, sehingga c = 10 cm.'
    }),
    kartu: () => ({
      tipe: 'kartu', q: 'Hasil dari 2³ × 2² adalah ...',
      opsi: ['2⁵', '2⁶', '4⁵', '4⁶'], benar: [0], jawab: '',
      pemb: 'Pada perkalian bilangan berpangkat dengan bilangan pokok sama, pangkatnya dijumlahkan: 3 + 2 = 5, sehingga hasilnya 2⁵.'
    }),
    bs: () => ({
      tipe: 'bs', q: 'Segitiga dengan panjang sisi 5 cm, 12 cm, dan 13 cm adalah segitiga siku-siku.',
      opsi: [], benar: [], jawab: true,
      pemb: '5² + 12² = 25 + 144 = 169 = 13². Karena memenuhi teorema Pythagoras, pernyataan ini Benar.'
    }),
    isian: () => ({
      tipe: 'isian', q: 'Tentukan nilai x dari persamaan 3x − 7 = 11.',
      opsi: [], benar: [], jawab: '6',
      pemb: 'Tambahkan 7 ke kedua ruas: 3x = 18. Bagi dengan 3, sehingga x = 6.'
    }),
    mc: () => ({
      tipe: 'mc', q: 'Manakah yang merupakan tripel Pythagoras? (pilih semua yang benar)',
      opsi: ['3, 4, 5', '5, 12, 13', '6, 7, 8', '8, 15, 17'], benar: [0, 1, 3], jawab: '',
      pemb: '3² + 4² = 5², 5² + 12² = 13², dan 8² + 15² = 17². Sedangkan 6² + 7² = 85, bukan 8² = 64.'
    })
  }
  const kuisContoh = tipe => ({
    id: null,
    judul: tipe ? 'Contoh soal: ' + TIPE[tipe] : 'Kuis Contoh: 5 Jenis Soal',
    deskripsi: tipe ? TMETA[tipe][2] + '.' : 'Satu soal untuk tiap jenis kotak soal. Ini hanya contoh.',
    soal: (tipe ? [tipe] : URUT).map(t => CONTOH[t]())
  })

  const s = document.createElement('style')
  s.textContent = `
  .kc-demo{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:14px;padding:14px;border:2px dashed var(--p);border-radius:16px;background:var(--bg)}
  .kc-demo .kc-ik{font-size:2rem}.kc-demo .kc-tx{flex:1;min-width:200px}.kc-demo p{margin:2px 0 0}
  .kc-chips{display:flex;gap:6px;flex-wrap:wrap;width:100%}
  .kc-chips .tipe-tile{padding:6px 12px;border-top-width:2px;border-radius:999px;font-weight:800;font-size:.85rem}
  .kc-chips .tipe-tile:hover{transform:none}
  .contoh-bar{margin:6px 0 14px;padding:12px;border:2px dashed var(--line);border-radius:14px}
  .contoh-bar p{margin:0 0 4px}`
  document.head.appendChild(s)

  const chips = aksi => `<div class="kc-chips">${URUT.map(t =>
    `<button type="button" class="tipe-tile" style="--c:${TMETA[t][1]}" ${aksi}="${t}">${TMETA[t][0]} ${TIPE[t]}</button>`).join('')}</div>`

  /* ---------- 1) Halaman "Buat kuis": tombol soal contoh ---------- */
  const builderAsli = builder
  builder = function () {
    builderAsli.apply(this, arguments)
    const grid = document.querySelector('#isi .tipe-grid')
    if (!grid || document.getElementById('contoh-bar')) return
    grid.insertAdjacentHTML('afterend', `<div id="contoh-bar" class="contoh-bar"><p class="kecil">✨ Mau lihat bentuk isinya? Tambahkan soal contoh:</p>
      ${chips('data-contoh')}<p style="margin-top:8px"><button type="button" class="btn alt" data-contoh="semua">✨ Isi dengan contoh semua jenis</button></p></div>`)
  }

  /* ---------- 2) Dashboard, tab Kuis: coba kuis contoh ---------- */
  const kartuDemo = (id, aksi) => `<div id="${id}" class="kc-demo"><div class="kc-ik">✨</div>
    <div class="kc-tx"><b>Contoh kuis siap pakai</b><p class="kecil">Lihat 5 jenis soal: pilihan ganda, kartu diacak, benar/salah, essai, dan banyak jawaban. Hanya contoh, hasilnya tidak disimpan.</p></div>
    <button type="button" class="btn" ${aksi}="semua">▶ Coba kuis contoh</button>
    <p class="kecil" style="width:100%;margin:0">Atau coba satu jenis saja:</p>${chips(aksi)}</div>`

  const dashAsli = dashboard
  dashboard = async function () {
    const r = await dashAsli.apply(this, arguments)
    const daftar = document.getElementById('daftar')
    if (daftar && !document.getElementById('kc-demo')) daftar.insertAdjacentHTML('afterend', kartuDemo('kc-demo', 'data-kcd'))
    return r
  }

  document.addEventListener('click', ev => {
    const d = ev.target.closest('[data-kcd]')
    if (d) {
      const v = d.getAttribute('data-kcd')
      return kerjakan(kuisContoh(v === 'semua' ? null : v), true, dashboard)
    }
    const b = ev.target.closest('[data-contoh]')
    if (!b || typeof draf === 'undefined' || !draf) return
    const v = b.dataset.contoh, baru = (v === 'semua' ? URUT : [v]).map(t => CONTOH[t]())
    const soal = draf.soal, awal = soal.length
    /* kalau baru ada satu soal kosong, ganti dengan contoh supaya tidak ada soal kosong tersisa */
    const kosong = soal.length === 1 && !soal[0].q.trim() && soal[0].opsi.every(o => !o.trim())
    if (kosong) soal.splice(0, 1)
    soal.push(...baru)
    if (v === 'semua' && !draf.judul.trim()) draf.judul = 'Kuis Contoh: 5 Jenis Soal'
    builder()
    const kartuBaru = document.querySelectorAll('#isi .soal-card')[kosong ? 0 : awal]
    if (kartuBaru) kartuBaru.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})()

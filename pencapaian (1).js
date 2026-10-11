/* Pencapaian bergaya dashboard: banner level/XP, kartu per materi, ringkasan pemahaman, rekomendasi.
   Memakai data asli: tabel progres (latihan materi), hasil_kuis (kuis), dan profiles.xp.
   File ini menggantikan fungsi pencapaian() milik kuis.js. Muat SETELAH kuis.js. */
(() => {
  document.head.insertAdjacentHTML('beforeend', `<style>
    .pc-hero { border-radius:24px; padding:22px; color:#fff; background:linear-gradient(135deg,#6c4cf1,#0ea5e9); display:grid; grid-template-columns:1.2fr 1fr; gap:18px; align-items:center }
    .pc-hero h2 { margin:0 0 4px; color:#fff } .pc-hero p { margin:0; opacity:.92 }
    .pc-lv { background:#ffffff26; border-radius:18px; padding:14px 16px }
    .pc-lv .nm { font-weight:800; display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap }
    .pc-bar { height:12px; border-radius:999px; background:#00000026; overflow:hidden; margin:8px 0 }
    .pc-bar span { display:block; height:100%; border-radius:999px; background:linear-gradient(90deg,#fbbf24,#f59e0b) }
    .pc-stat { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; text-align:center; margin-top:8px }
    .pc-stat b { display:block; font-size:1.35rem } .pc-stat span { font-size:.78rem; opacity:.95 }
    .pc-wrap { display:grid; grid-template-columns:2fr 1fr; gap:16px; margin-top:16px; align-items:start }
    .pc-filter { display:flex; gap:8px; flex-wrap:wrap; margin:6px 0 12px }
    .pc-filter button { border:2px solid #6c4cf155; background:transparent; color:inherit; font:inherit; font-weight:800; border-radius:999px; padding:6px 14px; cursor:pointer }
    .pc-filter button.on { background:#6c4cf1; border-color:#6c4cf1; color:#fff }
    .pc-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:12px }
    .pc-m { border-radius:18px; padding:14px; border:2px solid var(--st); background:color-mix(in srgb, var(--st) 9%, transparent) }
    .pc-m .hd { display:flex; gap:10px; align-items:center } .pc-m .ik { font-size:1.8rem }
    .pc-m h4 { margin:0; font-size:1rem }
    .pc-m .bar { height:9px; border-radius:999px; background:#00000018; overflow:hidden; margin:10px 0 }
    .pc-m .bar span { display:block; height:100%; background:var(--st); border-radius:999px }
    .pc-tag { display:inline-block; font-size:.78rem; font-weight:800; padding:3px 10px; border-radius:999px; color:#fff; background:var(--st) }
    .pc-m .ft { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:10px }
    .pc-m .btn { padding:6px 12px; font-size:.85rem }
    .pc-donut { width:130px; height:130px; border-radius:50%; margin:6px auto 12px; display:flex; align-items:center; justify-content:center }
    .pc-donut div { width:84px; height:84px; border-radius:50%; background:var(--card, #fff); display:flex; flex-direction:column; align-items:center; justify-content:center; font-weight:800; font-size:1.3rem; line-height:1.1 }
    .pc-donut small { font-size:.62rem; font-weight:600; text-align:center }
    .pc-leg { display:flex; justify-content:space-between; gap:8px; padding:3px 0 }
    .pc-leg i { display:inline-block; width:11px; height:11px; border-radius:50%; margin-right:6px }
    .pc-rek { border-radius:16px; padding:12px 14px; background:#ef444414; border:2px solid #ef444433; margin-top:14px }
    @media (max-width:820px) { .pc-hero, .pc-wrap { grid-template-columns:1fr } }
  </style>`)

  const STATUS = {
    baik: ['Sangat Baik', '#16a36a'],
    cukup: ['Cukup', '#f59e0b'],
    kurang: ['Perlu Belajar Lagi', '#ef4444'],
    belum: ['Belum Dimulai', '#9ca3af']
  }
  const statusDari = p => p == null ? 'belum' : p >= 80 ? 'baik' : p >= 60 ? 'cukup' : 'kurang'
  const GELAR = ['Pemula', 'Penjelajah', 'Petualang Matematika', 'Ahli Matematika', 'Master Matematika']
  const XP_PER_LEVEL = 100

  window.pencapaian = async function () {
    $('isi').innerHTML = '<div id="pc">Memuat...</div>'
    const [pr, hk, pf] = await Promise.all([
      db.from('progres').select('*').eq('user_id', user.id),
      db.from('hasil_kuis').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      db.from('profiles').select('xp,username').eq('id', user.id).single()
    ])
    const lat = pr.data || [], kuisH = hk.data || [], xp = pf.data?.xp ?? 0

    /* Data per materi (dari tabel progres) */
    const materi = DAFTAR_MATERI.map(m => {
      const r = lat.find(p => p.materi_urutan === m.urutan)
      const pct = r && r.total ? Math.round(100 * r.skor / r.total) : null
      return { ...m, r, pct, st: statusDari(pct) }
    })
    const jml = k => materi.filter(m => m.st === k).length
    const total = materi.length
    const level = Math.floor(xp / XP_PER_LEVEL) + 1, sisa = xp % XP_PER_LEVEL
    const gelar = GELAR[Math.min(level - 1, GELAR.length - 1)]
    const badge = [
      ['🌟', 'First Quiz', 'Selesaikan 1 kuis', kuisH.length >= 1],
      ['🧭', 'Math Explorer', 'Selesaikan 1 latihan materi', lat.length >= 1]
    ]
    const jmlBadge = badge.filter(b => b[3]).length

    /* Diagram lingkaran */
    let dari = 0
    const potong = ['baik', 'cukup', 'kurang', 'belum'].map(k => {
      const a = dari, b = dari + 100 * jml(k) / total; dari = b
      return `${STATUS[k][1]} ${a}% ${b}%`
    }).join(', ')

    /* Rekomendasi */
    const lemah = materi.filter(m => m.st === 'kurang' || m.st === 'cukup').sort((a, b) => a.pct - b.pct)
    const belum = materi.filter(m => m.st === 'belum')
    const target = lemah[0] || belum[0]
    const rekTeks = lemah.length
      ? `Kamu masih perlu memperdalam materi <b>${lemah.slice(0, 3).map(m => aman(m.judul)).join(', ')}</b>.`
      : belum.length ? 'Hebat! Nilai latihanmu sudah bagus. Yuk mulai materi yang belum dikerjakan.' : 'Luar biasa! Semua materi sudah kamu kuasai dengan baik. 🎉'

    $('pc').innerHTML = `
      <div class="pc-hero">
        <div><h2>🎯 Capaian Pembelajaran</h2><p>${aman(pf.data?.username || 'Siswa')}, lihat progresmu dan kuasai setiap materi dengan lebih baik. Terus belajar, kamu pasti bisa!</p></div>
        <div class="pc-lv">
          <div class="nm"><span>🛡️ Lv ${level} · ${gelar}</span><span>${sisa} / ${XP_PER_LEVEL} XP</span></div>
          <div class="pc-bar"><span style="width:${sisa}%"></span></div>
          <div class="pc-stat">
            <div><b>⭐ ${xp}</b><span>Total XP</span></div>
            <div><b>📖 ${lat.length}</b><span>Materi Selesai</span></div>
            <div><b>👑 ${kuisH.length}</b><span>Kuis Dikerjakan</span></div>
            <div><b>🏅 ${jmlBadge}</b><span>Badge</span></div>
          </div>
        </div>
      </div>

      <div class="pc-wrap">
        <div class="card">
          <h3 style="margin-top:0">Capaian per Materi</h3>
          <p class="kecil">Warna menunjukkan sejauh mana pemahamanmu. Skor diambil dari latihan di setiap materi.</p>
          <div class="pc-filter" id="pcFilter">
            <button class="on" data-f="semua">Semua</button>
            <button data-f="baik">✓ Selesai</button>
            <button data-f="kurang">! Perlu Belajar Lagi</button>
          </div>
          <div class="pc-grid" id="pcGrid"></div>
        </div>

        <div>
          <div class="card">
            <h3 style="margin-top:0">Ringkasan Pemahaman</h3>
            <div class="pc-donut" style="background:conic-gradient(${potong})"><div>${Math.round(100 * jml('baik') / total)}%<small>dipahami dengan baik</small></div></div>
            ${['baik', 'cukup', 'kurang', 'belum'].map(k => `<div class="pc-leg"><span><i style="background:${STATUS[k][1]}"></i>${STATUS[k][0]}</span><span>${jml(k)} materi</span></div>`).join('')}
          </div>
          <div class="card" style="margin-top:16px">
            <h3 style="margin-top:0">🎯 Rekomendasi untukmu</h3>
            <p style="margin:0">${rekTeks}</p>
            ${lemah.length ? `<div class="pc-rek"><p class="kecil" style="margin:0 0 6px">Kami sarankan untuk:</p>
              <div>✔ Membaca kembali rangkuman materi</div><div>✔ Mengerjakan latihan soal yang tersedia</div><div>✔ Mencoba kuis ulang setelah belajar</div></div>` : ''}
            ${target ? `<p><button class="btn" id="pcMulai" style="width:100%">${lemah.length ? 'Mulai Belajar Lagi' : 'Mulai Materi Baru'} →</button></p>` : ''}
          </div>
        </div>
      </div>

      <div class="card box" style="margin-top:16px"><h3>Badge</h3>
        <div class="grid">${badge.map(([ik, n, d, ok]) => `<div class="card ${ok ? '' : 'kunci'}"><div class="ikon" style="font-size:2rem">${ik}</div><b>${n}</b><p class="kecil">${d}</p></div>`).join('')}</div></div>

      <div class="card box"><h3>Riwayat</h3>${[...lat.map(p => ['Latihan materi ' + p.materi_urutan, p.skor, p.total, p.updated_at]), ...kuisH.map(h => ['Kuis: ' + h.judul, h.skor, h.total, h.created_at])]
        .sort((a, b) => new Date(b[3]) - new Date(a[3])).slice(0, 15).map(r => `<div class="row"><span>${aman(r[0])}</span><strong>${r[1]}/${r[2]}</strong></div>`).join('') || '<p class="kecil">Belum ada riwayat.</p>'}</div>`

    /* Kartu materi + filter */
    const gambarKartu = f => {
      const daftar = materi.filter(m => f === 'semua' || m.st === f)
      $('pcGrid').innerHTML = daftar.map(m => `
        <div class="pc-m" style="--st:${STATUS[m.st][1]}">
          <div class="hd"><span class="ik">${m.ikon}</span><h4>${aman(m.judul)}</h4></div>
          <div class="bar"><span style="width:${m.pct ?? 0}%"></span></div>
          <span class="pc-tag">${STATUS[m.st][0]}</span>
          <div class="ft"><span class="kecil">⭐ Skor ${m.r ? `${m.r.skor}/${m.r.total}` : '-'}</span>
            <button class="btn alt" data-m="${m.urutan}">Lihat Detail →</button></div>
        </div>`).join('') || '<p class="kecil">Belum ada materi pada kategori ini.</p>'
      $('pcGrid').querySelectorAll('[data-m]').forEach(b => b.onclick = () => bukaMateri(DAFTAR_MATERI.find(m => m.urutan == b.dataset.m)))
    }
    gambarKartu('semua')
    $('pcFilter').querySelectorAll('[data-f]').forEach(b => b.onclick = () => {
      $('pcFilter').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b))
      gambarKartu(b.dataset.f)
    })
    if ($('pcMulai')) $('pcMulai').onclick = () => bukaMateri(DAFTAR_MATERI.find(m => m.urutan === target.urutan))
  }
})()

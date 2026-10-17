/* hasil.js: tab "Hasil" di Dashboard (di samping Game) + pencatat hasil latihan soal & game milik siswa.
   Muat PALING AKHIR di index.html (setelah dashboard-konten.js, kuis.js, game.js). Jalankan mathquest-hasil.sql di Supabase dulu. */
(function () {
  const esc = t => { const d = document.createElement('div'); d.textContent = t ?? ''; return d.innerHTML }
  const $ = id => document.getElementById(id)
  const JENIS = [['kuis', '🏆 Kuis'], ['game', '🎮 Game'], ['latihan', '✏️ Latihan Soal']]
  let aktif = false, jenis = 'kuis', items = [], dipilih = '', rows = null, galat = ''

  document.head.insertAdjacentHTML('beforeend', `<style>
    body.hs-on #kq>*:not(.kq-tabs):not(.kq-stats):not(#kqh-panel){display:none!important}
    body.hs-on #kq + *{display:none!important}
    .hs-box{background:var(--card,#fff);border:2px solid var(--line,#e0daf7);border-radius:20px;padding:16px;margin-top:12px}
    .hs-box h3{margin:0 0 4px}
    .hs-sub{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}
    .hs-sub button{border:2px solid var(--line,#e0daf7);background:var(--card,#fff);color:var(--ink,#1d1740);border-radius:999px;padding:7px 14px;font:inherit;font-weight:800;cursor:pointer}
    .hs-sub button.on{background:var(--p,#6c4cf1);border-color:var(--p,#6c4cf1);color:#fff}
    #hs-pilih{width:100%;padding:10px;border-radius:12px;border:2px solid var(--line,#e0daf7);background:var(--bg,#f3f0ff);color:var(--ink,#1d1740);font:inherit;margin:6px 0 12px}
    .hs-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:12px}
    .hs-stats div{background:var(--bg,#f3f0ff);border-radius:14px;padding:10px 12px}.hs-stats b{display:block;font-size:1.4rem}.hs-stats span{font-size:.8rem;color:var(--muted,#6b6590)}
    .hs-tb{overflow-x:auto}.hs-tb table{width:100%;border-collapse:collapse;min-width:420px}
    .hs-tb th,.hs-tb td{text-align:left;padding:9px 8px;border-bottom:1px solid var(--line,#e0daf7);font-size:.92rem}
    .hs-err{background:#e5484d22;color:#d23a3f;border-radius:12px;padding:10px 12px;margin:8px 0}
  </style>`)

  const pct = (s, t) => t ? Math.round(100 * s / t) : 0
  const tgl = d => new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  const det = r => r.detail || {}
  const pesanGalat = e => /function|schema cache|does not exist/i.test(e.message || '') ? 'Fitur hasil belum aktif. Jalankan mathquest-hasil.sql di Supabase (SQL Editor).' : 'Gagal memuat: ' + ((e && e.message) || 'tidak diketahui')
  const hasilTeks = r => jenis === 'game' ? `${det(r).menang ? '🏆 Menang' : '⏰ Kalah'} · ⭐ ${r.skor} · 🪙 ${det(r).koin ?? 0}` : `${r.skor} / ${r.total} (${pct(r.skor, r.total)}%)`

  async function muatItem() {
    items = []; dipilih = ''; rows = null; galat = ''; gambar()
    try {
      if (jenis === 'kuis') {
        const r = await db.from('kuis').select('id,judul,kode').order('created_at', { ascending: false })
        if (r.error) throw r.error
        items = (r.data || []).map(x => ({ key: x.id, judul: x.judul, kode: x.kode }))
      } else {
        const r = await db.rpc('konten_saya', { p_jenis: jenis })
        if (r.error) throw r.error
        items = (r.data || []).map(x => ({ key: x.judul, judul: x.judul, kode: x.kode }))
      }
    } catch (e) { galat = pesanGalat(e) }
    gambar()
  }
  async function muatHasil() {
    rows = null; galat = ''; gambar(); if (!dipilih) return
    try {
      const r = jenis === 'kuis' ? await db.rpc('hasil_kuis_saya', { kid: dipilih }) : await db.rpc('hasil_konten_saya', { p_jenis: jenis, p_judul: dipilih })
      if (r.error) throw r.error
      rows = r.data || []
    } catch (e) { galat = pesanGalat(e); rows = [] }
    gambar()
  }

  function ringkasan() {
    if (!rows.length) return '<p class="kecil">Belum ada siswa yang mengerjakan.</p>'
    const g = jenis === 'game', n = rows.length, siswa = new Set(rows.map(r => r.username || '-')).size
    const kartu = g
      ? [[n, 'Pengerjaan'], [siswa, 'Siswa'], [pct(rows.filter(r => det(r).menang).length, n) + '%', 'Menang'], [(rows.reduce((a, r) => a + r.skor, 0) / n).toFixed(1), 'Rata-rata ⭐']]
      : [[n, 'Pengerjaan'], [siswa, 'Siswa'], [Math.round(rows.reduce((a, r) => a + pct(r.skor, r.total), 0) / n) + '%', 'Rata-rata nilai'], [Math.max(...rows.map(r => pct(r.skor, r.total))) + '%', 'Tertinggi']]
    return `<div class="hs-stats">${kartu.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>
      <div class="hs-tb"><table><thead><tr><th>#</th><th>Nama</th><th>Hasil</th><th>Waktu</th></tr></thead><tbody>${rows.map((r, i) =>
        `<tr><td>${i + 1}</td><td>${esc(r.username || 'Siswa')}</td><td>${esc(hasilTeks(r))}</td><td>${tgl(r.created_at)}</td></tr>`).join('')}</tbody></table></div>
      <p><button type="button" class="btn alt" data-hcsv>⬇️ Unduh CSV</button></p>`
  }

  function gambar() {
    const p = $('kqh-panel'); if (!p) return
    let isi = galat ? `<div class="hs-err">${esc(galat)}</div>` : ''
    if (!items.length && !galat) isi += '<p class="kecil">Belum ada konten di bagian ini. Buat dulu, lalu bagikan kodenya ke siswa.</p>'
    if (items.length) isi += `<label for="hs-pilih" class="kecil">Pilih yang ingin dilihat</label><select id="hs-pilih"><option value="">Pilih…</option>${items.map(x =>
      `<option value="${esc(x.key)}"${x.key === dipilih ? ' selected' : ''}>${esc(x.judul)}${x.kode ? ' · ' + esc(x.kode) : ''}</option>`).join('')}</select>`
    if (rows) isi += ringkasan()
    p.innerHTML = `<div class="hs-box"><h3>📊 Hasil siswa</h3><p class="kecil">Lihat siapa saja yang sudah mengerjakan kuis, game, dan latihan soal buatanmu.</p>
      <div class="hs-sub">${JENIS.map(([k, v]) => `<button type="button" class="${k === jenis ? 'on' : ''}" data-hj="${k}">${v}</button>`).join('')}</div>${isi}</div>`
  }

  function unduh() {
    const q = s => '"' + String(s).replace(/"/g, '""') + '"'
    const baris = [['No', 'Nama', 'Hasil', 'Waktu']].concat(rows.map((r, i) => [i + 1, r.username || 'Siswa', hasilTeks(r), new Date(r.created_at).toLocaleString('id-ID')]))
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['\ufeff' + baris.map(b => b.map(q).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' }))
    a.download = 'hasil-' + jenis + '.csv'; document.body.appendChild(a); a.click(); a.remove()
  }

  /* ---------- tab Hasil di samping Game ---------- */
  function pasang() {
    const w = $('kq'), tabs = w && w.querySelector('.kq-tabs')
    if (!tabs) { document.body.classList.remove('hs-on'); return }
    let b = tabs.querySelector('[data-htab]')
    if (!b) { tabs.insertAdjacentHTML('beforeend', '<button class="kq-tab" data-htab="1">📊 Hasil</button>'); b = tabs.lastElementChild }
    document.body.classList.toggle('hs-on', aktif)
    if (!aktif) return
    ;[].forEach.call(tabs.children, x => x.classList.toggle('on', x === b))
    if (!$('kqh-panel')) { const p = document.createElement('div'); p.id = 'kqh-panel'; w.appendChild(p); gambar(); if (!items.length && !galat) muatItem() }
  }
  function matikan() { aktif = false; document.body.classList.remove('hs-on'); const p = $('kqh-panel'); if (p) p.remove() }

  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-htab],[data-hj],[data-hcsv],[data-tab],[data-gtab]'); if (!t) return
    if (t.hasAttribute('data-htab')) { aktif = true; pasang() }
    else if (t.hasAttribute('data-hj')) { jenis = t.dataset.hj; muatItem() }
    else if (t.hasAttribute('data-hcsv')) { if (rows) unduh() }
    else if (aktif) matikan()
  }, true)
  document.addEventListener('change', e => { if (e.target && e.target.id === 'hs-pilih') { dipilih = e.target.value; muatHasil() } })

  /* ---------- catat hasil siswa (latihan soal & game) ---------- */
  async function kirim(j, judul, s, t, detail) {
    if (!judul || typeof db === 'undefined') return
    try { await db.rpc('simpan_hasil_konten', { p_jenis: j, p_judul: judul, p_skor: s, p_total: t, p_detail: detail }) } catch (e) {}
  }
  function catat() {
    const dlg = document.querySelector('.kq-dlg'), res = dlg && dlg.querySelector('.kq-res:not([data-hs])'); if (!res) return
    res.dataset.hs = '1'
    const h = dlg.querySelector('.kq-mh h3'), judul = h ? h.textContent.trim() : ''
    if (res.classList.contains('kqg-reward')) {
      const tr = res.querySelector('.kqg-trophy'), c = res.querySelector('#kqg-cnt')
      kirim('game', judul.replace(/^\S+\s+/, ''), res.querySelectorAll('.kqg-starsrow .s.on').length, 3, { menang: !!tr && tr.textContent.includes('🏆'), koin: c ? +c.dataset.to : 0 })
    } else if (/Latihan selesai/i.test(res.textContent) && !/Pratinjau/i.test(dlg.textContent)) {
      const m = /(\d+)\s*\/\s*(\d+)/.exec((res.querySelector('.sc') || {}).textContent || '')
      if (m) kirim('latihan', judul, +m[1], +m[2], {})
    }
  }
  let raf = 0
  new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { pasang(); catat() }) }).observe(document.body, { childList: true, subtree: true })
})()

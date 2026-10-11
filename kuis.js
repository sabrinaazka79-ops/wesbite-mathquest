const atr = t => aman(t).replace(/"/g, '&quot;')
const TIPE = { pg: 'Pilihan ganda', kartu: 'Kartu diacak', bs: 'Benar / Salah', isian: 'Essai', mc: 'Banyak jawaban' }
/* ikon, warna, keterangan singkat tiap jenis kotak soal */
const TMETA = {
  pg: ['🔘', '#6c4cf1', 'Pilih satu jawaban dari beberapa pilihan'],
  kartu: ['🎴', '#ff7a59', 'Kartu diacak dulu, dibuka, lalu pilih jawaban'],
  bs: ['⚖️', '#16a36a', 'Siswa memilih Benar atau Salah'],
  isian: ['✍️', '#2b8cf0', 'Siswa mengetik jawabannya sendiri'],
  mc: ['☑️', '#c24fd0', 'Boleh memilih lebih dari satu jawaban']
}
const ADA_PILIHAN = t => t === 'pg' || t === 'mc' || t === 'kartu'
let draf = null

const soalBaru = (tipe = 'pg') => ({
  tipe, q: '', pemb: '',
  opsi: ADA_PILIHAN(tipe) ? ['', '', '', ''] : [], benar: [],
  jawab: tipe === 'bs' ? true : ''
})
const acakArr = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a }

;(function () {
  if (document.getElementById('kuis-css')) return
  const s = document.createElement('style'); s.id = 'kuis-css'
  s.textContent = `
  .tipe-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:10px 0}
  .tipe-tile{font:inherit;text-align:left;cursor:pointer;background:var(--card);color:var(--ink);border:2px solid var(--line);border-top:6px solid var(--c);border-radius:14px;padding:10px 12px;transition:transform .15s}
  .tipe-tile:hover{transform:translateY(-2px);border-color:var(--c)}
  .tipe-tile b{display:block;font-size:.98rem}.tipe-tile small{color:var(--muted);font-size:.78rem;line-height:1.25;display:block;margin-top:2px}
  .tipe-tile.on{background:var(--c);color:#fff}.tipe-tile.on small{color:#fffd}
  .tipe-tile .ik{font-size:1.5rem;display:block}
  .tipe-kecil{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 4px}
  .tipe-kecil .tipe-tile{padding:6px 10px;border-top-width:2px;border-radius:999px;font-weight:800;font-size:.85rem}
  .tipe-kecil .tipe-tile:hover{transform:none}
  .soal-card{border-left:8px solid var(--c)}
  .lencana{display:inline-block;background:var(--c);color:#fff;border-radius:999px;padding:2px 12px;font-weight:800;font-size:.82rem;margin-left:8px;vertical-align:middle}
  .kartu-depan{display:flex;flex-direction:column;align-items:center;gap:4px;width:100%;font:inherit;cursor:pointer;border:3px dashed #fff8;border-radius:18px;padding:28px 12px;color:#fff;background:linear-gradient(135deg,#ff7a59,#c24fd0);box-shadow:0 6px 0 #0002;transition:transform .15s}
  .kartu-depan:hover{transform:rotate(-1deg) scale(1.01)}.kartu-depan .ik{font-size:2.6rem}.kartu-depan b{font-size:1.15rem}
  .kartu-depan[hidden],.kartu-isi[hidden]{display:none}
  .kartu-isi{animation:balik .45s ease}
  @keyframes balik{from{transform:rotateY(90deg);opacity:0}to{transform:none;opacity:1}}
  .bs-dua{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
  .bsx{display:flex;align-items:center;justify-content:center;gap:8px;margin:0;padding:16px;border:2px solid var(--line);border-radius:14px;cursor:pointer;font-weight:800;font-size:1.1rem;background:var(--bg)}
  .bsx input{position:absolute;opacity:0;width:0;height:0}
  .bsx.b:has(input:checked){background:#16a36a33;border-color:var(--ok)}
  .bsx.s:has(input:checked){background:#d93a4a33;border-color:var(--err)}
  .bsx:has(input:focus-visible){outline:3px solid var(--p2)}
  .opsi-baca{display:flex;gap:10px;align-items:center;margin:8px 0;padding:10px 12px;border:2px solid var(--line);border-radius:12px;background:var(--bg);cursor:pointer;font-weight:600}
  .opsi-baca:has(input:checked){border-color:var(--c,var(--p));background:color-mix(in srgb,var(--c,var(--p)) 15%,transparent)}
  .opsi-baca input{width:auto}
  .kodebox{font-family:'Baloo 2',sans-serif;font-size:2.6rem;font-weight:800;letter-spacing:.2em;color:var(--p);background:var(--bg);border:3px dashed var(--p);border-radius:16px;display:inline-block;padding:4px 22px}
  textarea.essai{min-height:80px}
  `
  document.head.appendChild(s)
})()

const soalBadge = t => `<span class="lencana">${TMETA[t][0]} ${TIPE[t]}</span>`
const tileHTML = (t, aksi, extra = '', on = false) => `<button type="button" class="tipe-tile ${on ? 'on' : ''}" style="--c:${TMETA[t][1]}" data-act="${aksi}" data-t="${t}" ${extra}><span class="ik">${TMETA[t][0]}</span><b>${TIPE[t]}</b><small>${TMETA[t][2]}</small></button>`

/* ---------- Dashboard ---------- */
async function dashboard() {
  $('isi').innerHTML = `<h2>Dashboard</h2>
    <div class="card"><div class="row" style="border:0"><h3>Kuis saya</h3><button class="btn" id="baru">+ Buat kuis</button></div><div id="daftar">Memuat...</div></div>`
  $('baru').onclick = () => { draf = { judul: '', deskripsi: '', kode: '', soal: [soalBaru('pg')] }; builder() }
  const { data, error } = await db.from('kuis').select('*').eq('pembuat', user.id).order('created_at', { ascending: false })
  if (error) return $('daftar').innerHTML = `<div class="msg err">Kuis belum bisa dimuat: ${aman(error.message)}. Jalankan mathquest-fase3.sql di Supabase.</div>`
  $('daftar').innerHTML = !data || !data.length ? '<p class="kecil">Belum ada kuis. Klik "Buat kuis" untuk mulai.</p>' : data.map((k, i) => `
    <div class="row" style="flex-wrap:wrap"><div><b>${aman(k.judul)}</b><br><span class="kecil">${k.soal.length} soal. Kode: <b>${aman(k.kode)}</b></span></div>
    <div><button class="btn alt" data-c="${i}">Salin kode</button> <button class="btn alt" data-p="${i}">Preview</button> <button class="btn alt" data-r="${i}">Hasil</button> <button class="btn alt" data-h="${i}">Hapus</button></div></div>`).join('')
  const q = s => $('daftar').querySelectorAll(s)
  q('[data-p]').forEach(b => b.onclick = () => kerjakan(data[b.dataset.p], true, dashboard))
  q('[data-c]').forEach(b => b.onclick = async () => {
    try { await navigator.clipboard.writeText(data[b.dataset.c].kode); b.textContent = 'Tersalin ✓' } catch (e) { b.textContent = data[b.dataset.c].kode }
  })
  q('[data-r]').forEach(b => b.onclick = () => hasilKuis(data[b.dataset.r]))
  q('[data-h]').forEach(b => b.onclick = async () => {
    if (!confirm('Hapus kuis ini?')) return
    await db.from('kuis').delete().eq('id', data[b.dataset.h].id); dashboard()
  })
}

/* ---------- Hasil siswa untuk pembuat kuis ---------- */
async function hasilKuis(k) {
  $('isi').innerHTML = `<p><button class="btn alt" id="bk">← Kembali</button></p><h2>Hasil: ${aman(k.judul)}</h2><p class="kecil">Kode: <b>${aman(k.kode)}</b></p><div class="card" id="hk">Memuat...</div>`
  $('bk').onclick = dashboard
  const { data, error } = await db.rpc('hasil_kuis_saya', { kid: k.id })
  $('hk').innerHTML = error ? 'Hasil belum bisa dimuat. Jalankan mathquest-fase3.sql.' : !data || !data.length ? '<p class="kecil">Belum ada siswa yang mengerjakan.</p>'
    : data.map(r => `<div class="row"><span>${aman(r.username || 'Siswa')}</span><strong>${r.skor}/${r.total}</strong></div>`).join('')
}

/* ---------- Pembuat kuis ---------- */
function builder() {
  const s = draf.soal
  $('isi').innerHTML = `<p><button class="btn alt" data-act="batal">← Kembali</button></p><h2>Buat kuis</h2>
    <div class="card"><label for="jd">Judul kuis</label><input id="jd" data-f="judul" value="${atr(draf.judul)}">
    <label for="ds">Deskripsi (opsional)</label><input id="ds" data-f="deskripsi" value="${atr(draf.deskripsi)}">
    <label for="kd">Kode kuis (opsional)</label><input id="kd" data-f="kode" maxlength="10" placeholder="Kosongkan agar dibuat otomatis, atau tulis sendiri, mis. KELAS8A" value="${atr(draf.kode)}" style="text-transform:uppercase">
    <p class="kecil">Kode 4 sampai 10 huruf atau angka. Siswa memasukkan kode ini di Dashboard.</p></div>
    ${s.map((x, i) => `<div class="card box soal-card" style="--c:${TMETA[x.tipe][1]}"><div class="row" style="border:0"><h3>Soal ${i + 1} ${soalBadge(x.tipe)}</h3>${s.length > 1 ? `<button class="btn alt" data-act="hapus" data-i="${i}">Hapus soal</button>` : ''}</div>
      <div class="tipe-kecil" role="group" aria-label="Ganti jenis soal">${Object.keys(TIPE).map(t => `<button type="button" class="tipe-tile ${x.tipe === t ? 'on' : ''}" style="--c:${TMETA[t][1]}" data-act="tipe" data-t="${t}" data-i="${i}">${TMETA[t][0]} ${TIPE[t]}</button>`).join('')}</div>
      <label>${x.tipe === 'kartu' ? 'Pertanyaan (tersembunyi di balik kartu)' : x.tipe === 'bs' ? 'Pernyataan' : 'Pertanyaan'}</label><textarea rows="2" data-f="q" data-i="${i}">${aman(x.q)}</textarea>
      ${ADA_PILIHAN(x.tipe) ? `<label>Pilihan jawaban (${x.tipe === 'mc' ? 'centang semua yang benar' : 'pilih satu yang benar'})</label>${x.opsi.map((o, n) => `
        <div style="display:flex;gap:8px;align-items:center;margin:6px 0"><input style="width:auto" type="${x.tipe === 'mc' ? 'checkbox' : 'radio'}" name="b${i}" data-f="benar" data-i="${i}" data-o="${n}" ${x.benar.includes(n) ? 'checked' : ''} aria-label="Jawaban benar">
        <input data-f="opsi" data-i="${i}" data-o="${n}" value="${atr(o)}" placeholder="Pilihan ${String.fromCharCode(65 + n)}">
        ${x.opsi.length > 2 ? `<button class="btn alt" data-act="hapusopsi" data-i="${i}" data-o="${n}" aria-label="Hapus pilihan">✕</button>` : ''}</div>`).join('')}
        ${x.opsi.length < 6 ? `<button class="btn alt" data-act="opsi" data-i="${i}">+ Pilihan</button>` : ''}` : ''}
      ${x.tipe === 'isian' ? `<label>Kunci jawaban</label><input data-f="jawab" data-i="${i}" value="${atr(x.jawab)}" placeholder="Contoh: 25"><p class="kecil">Boleh beberapa jawaban yang dianggap benar, pisahkan dengan tanda | , misalnya: 0,5 | 1/2</p>` : ''}
      ${x.tipe === 'bs' ? `<label>Jawaban yang benar</label><div class="bs-dua"><label class="bsx b"><input type="radio" name="t${i}" data-f="bs" data-i="${i}" value="true" ${x.jawab === true ? 'checked' : ''}>✔ Benar</label>
        <label class="bsx s"><input type="radio" name="t${i}" data-f="bs" data-i="${i}" value="false" ${x.jawab === false ? 'checked' : ''}>✖ Salah</label></div>` : ''}
      <label>Pembahasan (opsional)</label><textarea rows="2" data-f="pemb" data-i="${i}">${aman(x.pemb)}</textarea></div>`).join('')}
    <div class="card box"><h3>+ Tambah soal baru</h3><p class="kecil">Pilih jenis kotak soalnya:</p><div class="tipe-grid">${Object.keys(TIPE).map(t => tileHTML(t, 'tambah')).join('')}</div></div>
    <p><button class="btn alt" data-act="preview">Preview</button> <button class="btn" data-act="publish">Publish</button></p><div id="pesan"></div>`

  const kuisEl = $('isi')
  kuisEl.oninput = kuisEl.onchange = ev => {
    const e = ev.target, f = e.dataset.f; if (!f) return
    if (f === 'judul' || f === 'deskripsi') return void (draf[f] = e.value)
    if (f === 'kode') return void (draf.kode = e.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))
    const x = s[e.dataset.i], o = +e.dataset.o
    if (f === 'q' || f === 'pemb' || f === 'jawab') x[f] = e.value
    else if (f === 'opsi') x.opsi[o] = e.value
    else if (f === 'bs') x.jawab = e.value === 'true'
    else if (f === 'benar') x.benar = x.tipe !== 'mc' ? [o] : (e.checked ? [...new Set([...x.benar, o])].sort((m, n) => m - n) : x.benar.filter(v => v !== o))
  }
  kuisEl.onclick = async ev => {
    const e = ev.target.closest('[data-act]'); if (!e) return
    const a = e.dataset.act, i = +e.dataset.i, o = +e.dataset.o
    if (a === 'batal') return dashboard()
    if (a === 'tambah') { s.push(soalBaru(e.dataset.t)); builder(); return window.scrollTo(0, document.body.scrollHeight) }
    if (a === 'tipe') {
      const x = s[i], t = e.dataset.t; if (x.tipe === t) return
      if (ADA_PILIHAN(x.tipe) && ADA_PILIHAN(t)) { x.tipe = t; if (t !== 'mc') x.benar = x.benar.slice(0, 1) }
      else Object.assign(x, soalBaru(t), { q: x.q, pemb: x.pemb })
      return builder()
    }
    if (a === 'hapus') { s.splice(i, 1); return builder() }
    if (a === 'opsi') { s[i].opsi.push(''); return builder() }
    if (a === 'hapusopsi') { s[i].opsi.splice(o, 1); s[i].benar = s[i].benar.filter(v => v !== o).map(v => v > o ? v - 1 : v); return builder() }
    const err = cek()
    if (err) return pesan(err)
    if (a === 'preview') return kerjakan({ ...draf, id: null }, true, builder)
    if (a === 'publish') {
      e.disabled = true
      const baris = { judul: draf.judul.trim(), deskripsi: draf.deskripsi, soal: draf.soal }
      if (draf.kode) baris.kode = draf.kode
      const { data, error } = await db.from('kuis').insert(baris).select('kode').single()
      e.disabled = false
      if (error) return pesan(error.code === '23505' ? 'Kode itu sudah dipakai kuis lain. Pilih kode yang berbeda.' : 'Gagal menyimpan: ' + error.message)
      $('isi').innerHTML = `<div class="card"><h2>Kuis dipublikasikan! 🎉</h2><p>Bagikan kode ini ke temanmu. Mereka memasukkannya di Beranda, pada kartu "Kode Kuis".</p>
        <p><span class="kodebox">${aman(data.kode)}</span></p><p><button class="btn alt" id="salin">Salin kode</button> <button class="btn" id="ok">Ke Dashboard</button></p></div>`
      $('salin').onclick = async () => { try { await navigator.clipboard.writeText(data.kode); $('salin').textContent = 'Tersalin ✓' } catch (er) {} }
      $('ok').onclick = dashboard
    }
  }
}

function cek() {
  if (!draf.judul.trim()) return 'Judul kuis belum diisi.'
  if (draf.kode && !/^[A-Z0-9]{4,10}$/.test(draf.kode)) return 'Kode kuis harus 4 sampai 10 huruf atau angka (tanpa spasi).'
  for (const [n, x] of draf.soal.entries()) {
    const p = `Soal ${n + 1}: `
    if (!x.q.trim()) return p + 'pertanyaan belum diisi.'
    if (ADA_PILIHAN(x.tipe)) {
      if (x.opsi.some(o => !o.trim())) return p + 'semua pilihan harus diisi.'
      if (!x.benar.length) return p + 'pilih jawaban yang benar.'
    }
    if (x.tipe === 'isian' && !String(x.jawab).trim()) return p + 'kunci jawaban belum diisi.'
  }
  return ''
}

/* ---------- Mengerjakan kuis ---------- */
const norm = t => String(t ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
const kunciIsian = x => String(x.jawab).split('|').map(norm).filter(Boolean)
function benarkah(x, j) {
  if (x.tipe === 'pg' || x.tipe === 'kartu') return j.length === 1 && +j[0] === x.benar[0]
  if (x.tipe === 'mc') return j.length === x.benar.length && j.every(v => x.benar.includes(+v))
  if (x.tipe === 'isian') return kunciIsian(x).includes(norm(j[0]))
  return j[0] === String(x.jawab)
}
const jawabanBenar = x => ADA_PILIHAN(x.tipe) ? x.benar.map(n => x.opsi[n]).join(', ') : x.tipe === 'bs' ? (x.jawab ? 'Benar' : 'Salah') : String(x.jawab).split('|').map(v => v.trim()).join(' / ')
const jawabanSiswa = (x, j) => !j.length || (j.length === 1 && !j[0]) ? '(kosong)' : ADA_PILIHAN(x.tipe) ? j.map(n => x.opsi[+n]).join(', ') : x.tipe === 'bs' ? (j[0] === 'true' ? 'Benar' : 'Salah') : j[0]

function isiSoalHTML(x, i) {
  const c = TMETA[x.tipe][1]
  if (ADA_PILIHAN(x.tipe)) {
    const urut = x.tipe === 'kartu' ? acakArr(x.opsi.map((_, n) => n)) : x.opsi.map((_, n) => n)
    return `<p><b>${i + 1}. ${aman(x.q)}</b></p>${x.tipe === 'mc' ? '<p class="kecil">Boleh memilih lebih dari satu jawaban.</p>' : ''}` + urut.map(n => `<label class="opsi-baca" style="--c:${c}"><input type="${x.tipe === 'mc' ? 'checkbox' : 'radio'}" name="s${i}" value="${n}"> ${aman(x.opsi[n])}</label>`).join('')
  }
  if (x.tipe === 'bs') return `<p><b>${i + 1}. ${aman(x.q)}</b></p><div class="bs-dua"><label class="bsx b"><input type="radio" name="s${i}" value="true">✔ Benar</label><label class="bsx s"><input type="radio" name="s${i}" value="false">✖ Salah</label></div>`
  return `<p><b>${i + 1}. ${aman(x.q)}</b></p><textarea class="essai" name="s${i}" rows="3" autocomplete="off" placeholder="Tulis jawabanmu di sini" aria-label="Jawaban"></textarea>`
}

function kerjakan(k, preview, balik) {
  /* urutan tampil: soal kartu diacak posisinya */
  const urut = k.soal.map((_, i) => i)
  const posK = urut.filter(i => k.soal[i].tipe === 'kartu'), isiK = acakArr(posK)
  posK.forEach((p, n) => urut[p] = isiK[n])
  $('isi').innerHTML = `<p><button class="btn alt" id="bk">← Kembali</button></p><h2>${aman(k.judul)}</h2><p class="kecil">${aman(k.deskripsi)}${preview ? ' (Mode preview: hasil tidak disimpan)' : ''}</p>
    <form id="fk">${urut.map(i => {
      const x = k.soal[i], c = TMETA[x.tipe][1]
      if (x.tipe === 'kartu') return `<div class="card box soal-card" style="--c:${c}"><button type="button" class="kartu-depan" data-buka><span class="ik">🎴</span><b>Kartu misteri</b><span>Ketuk untuk membuka soalnya</span></button><div class="kartu-isi" hidden>${isiSoalHTML(x, i)}</div></div>`
      return `<div class="card box soal-card" style="--c:${c}">${isiSoalHTML(x, i)}</div>`
    }).join('')}<p><button class="btn" type="submit">Kirim jawaban</button></p><div id="pesan"></div></form>`
  $('bk').onclick = balik
  $('fk').querySelectorAll('[data-buka]').forEach(b => b.onclick = () => { b.hidden = true; b.nextElementSibling.hidden = false })
  $('fk').onsubmit = async ev => {
    ev.preventDefault()
    if ($('fk').querySelector('[data-buka]:not([hidden])')) return pesan('Masih ada kartu yang belum dibuka. Ketuk kartunya dulu.')
    const fd = new FormData(ev.target)
    const jaw = k.soal.map((_, i) => fd.getAll('s' + i))
    const hasil = k.soal.map((x, i) => benarkah(x, jaw[i]))
    const skor = hasil.filter(Boolean).length
    $('isi').innerHTML = `<h2>Hasil: ${skor} dari ${k.soal.length} benar</h2><div id="xp" class="kecil"></div>
      ${k.soal.map((x, i) => `<div class="card box soal-card" style="--c:${TMETA[x.tipe][1]}"><p><b>${i + 1}. ${aman(x.q)}</b> ${soalBadge(x.tipe)}</p><div class="msg ${hasil[i] ? 'ok' : 'err'}">${hasil[i] ? 'Tepat!' : 'Belum tepat. Jawaban benar: ' + aman(jawabanBenar(x))}</div><p class="kecil">Jawabanmu: ${aman(jawabanSiswa(x, jaw[i]))}</p>${x.pemb ? `<p class="kecil">Pembahasan: ${aman(x.pemb)}</p>` : ''}</div>`).join('')}
      <p><button class="btn" id="bk2">Selesai</button></p>`
    $('bk2').onclick = balik
    if (!preview) {
      const { data, error } = await db.rpc('simpan_hasil_kuis', { kid: k.id, jdl: k.judul, s: skor, t: k.soal.length })
      $('xp').textContent = error ? 'Hasil belum tersimpan. Pastikan mathquest-fase3.sql sudah dijalankan.' : `Hasil tersimpan. Total XP kamu: ${data}.`
    }
  }
}


/* ---------- Kartu "Kode Kuis" di Beranda ---------- */
async function mulaiDenganKode(kode, tampilPesan) {
  const { data, error } = await db.rpc('ambil_kuis', { kode_input: kode.trim() })
  if (error) return tampilPesan('Fitur kuis belum siap. Jalankan mathquest-fase3.sql di Supabase.')
  if (!data || !data.length) return tampilPesan('Kode kuis tidak ditemukan. Periksa lagi kodenya.')
  kerjakan(data[0], false, () => { tab = 'beranda'; tampilUtama(kelasNama) })
}

/* ---------- Pencapaian ---------- */
async function pencapaian() {
  $('isi').innerHTML = '<h2>Pencapaian</h2><div id="pc">Memuat...</div>'
  const [pr, hk, pf] = await Promise.all([
    db.from('progres').select('*').eq('user_id', user.id),
    db.from('hasil_kuis').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    db.from('profiles').select('xp').eq('id', user.id).single()
  ])
  const lat = pr.data || [], kuisH = hk.data || []
  const badge = [
    ['🌟', 'First Quiz', 'Selesaikan 1 kuis', kuisH.length >= 1],
    ['🧭', 'Math Explorer', 'Selesaikan 1 latihan materi', lat.length >= 1],
    ['📐', 'Pythagoras Master', 'Nilai sempurna di latihan Pythagoras', lat.some(p => p.materi_urutan === 2 && p.skor === p.total)]
  ]
  $('pc').innerHTML = `<div class="grid">
    <div class="card"><h3>${pf.data?.xp ?? 0}</h3><p class="kecil">Total XP</p></div>
    <div class="card"><h3>${lat.length} dari 6</h3><p class="kecil">Materi dengan latihan selesai</p></div>
    <div class="card"><h3>${kuisH.length}</h3><p class="kecil">Kuis dikerjakan</p></div></div>
    <div class="card box"><h3>Badge</h3><div class="grid">${badge.map(([ik, n, d, ok]) => `<div class="card ${ok ? '' : 'kunci'}"><div class="ikon" style="font-size:2rem">${ik}</div><b>${n}</b><p class="kecil">${d}</p></div>`).join('')}</div></div>
    <div class="card box"><h3>Riwayat</h3>${[...lat.map(p => ['Latihan materi ' + p.materi_urutan, p.skor, p.total, p.updated_at]), ...kuisH.map(h => ['Kuis: ' + h.judul, h.skor, h.total, h.created_at])]
      .sort((a, b) => new Date(b[3]) - new Date(a[3])).slice(0, 15).map(r => `<div class="row"><span>${aman(r[0])}</span><strong>${r[1]}/${r[2]}</strong></div>`).join('') || '<p class="kecil">Belum ada riwayat.</p>'}</div>`
}

/* Materi 5: Persamaan Garis Lurus (penjelasan, visual, ringkasan, contoh, latihan, kuis)
   Muat SETELAH Materi1.js dan materi.js (tidak membutuhkan materi2.js).
   Urutan di index.html: materi.js, materi1.js, materi2.js, materi5.js */
const mn5 = v => String(v).replace('-', '−')
const g5 = (a, b) => b ? g5(b, a % b) : Math.abs(a)
const sm5 = (p, q) => { if (q < 0) { p = -p; q = -q } const g = g5(p, q) || 1; return [p / g, q / g] }
const ft5 = (p, q = 1) => { [p, q] = sm5(p, q); return q === 1 ? mn5(p) : `${mn5(p)}/${q}` }
const fh5 = (p, q = 1) => { [p, q] = sm5(p, q); return q === 1 ? mn5(p) : `${p < 0 ? '−' : ''}${fr(Math.abs(p), q)}` }
const sb5 = v => v < 0 ? `+ ${-v}` : `− ${v}`
const pa5 = v => v < 0 ? `(${mn5(v)})` : String(v)
const tt5 = (x, y) => `(${mn5(x)}, ${mn5(y)})`
const kx5 = (p, q = 1) => { [p, q] = sm5(p, q); if (q === 1) return p === 1 ? 'x' : p === -1 ? '−x' : mn5(p) + 'x'; return (p < 0 ? '−' : '') + fr(Math.abs(p), q) + 'x' }
const pt5 = (m, c) => 'y = ' + (m === 1 ? 'x' : m === -1 ? '−x' : mn5(m) + 'x') + (c > 0 ? ` + ${c}` : c < 0 ? ` − ${-c}` : '')
const pe5 = (mp, mq, cp, cq = 1) => {
  [mp, mq] = sm5(mp, mq); [cp, cq] = sm5(cp, cq)
  if (mp === 0) return 'y = ' + fh5(cp, cq)
  return 'y = ' + kx5(mp, mq) + (cp === 0 ? '' : ` ${cp < 0 ? '−' : '+'} ${cq === 1 ? Math.abs(cp) : fr(Math.abs(cp), cq)}`)
}
const gu5 = (a, b, c) => { const t = []; const add = (v, s) => { if (!v) return; const ab = Math.abs(v), body = s ? (ab === 1 ? s : ab + s) : String(ab); t.push((t.length ? (v < 0 ? ' − ' : ' + ') : (v < 0 ? '−' : '')) + body) }; add(a, 'x'); add(b, 'y'); add(c, ''); return (t.join('') || '0') + ' = 0' }
const ugt5 = (mp, mq, cp, cq = 1) => { [mp, mq] = sm5(mp, mq); [cp, cq] = sm5(cp, cq); const l = mq * cq / g5(mq, cq); let a = mp * l / mq, b = -l, c = cp * l / cq; if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; c = -c } return [a, b, c] }
const ug5 = (...z) => gu5(...ugt5(...z))

document.head.insertAdjacentHTML('beforeend', `<style>
  .svg5 { width:100%; max-width:400px; display:block; margin:8px auto; color:var(--ink) }
  .svg5 text { fill:currentColor; font:800 13px sans-serif; paint-order:stroke; stroke:var(--card,#fff); stroke-width:3.5px; stroke-linejoin:round }
  .svg5 text.sb { font:700 10px sans-serif; opacity:.7; stroke:none }
</style>`)

const M5 = {
  bagian: [
    ['A.1 Bentuk Umum Persamaan Garis Lurus', ps('Halo, Petualang! Aku Kapten Koordinat. Hari ini kita pelajari garis lurus dan persamaannya.') + `
      <p>Garis lurus adalah kumpulan titik (x, y) yang memenuhi sebuah persamaan linear. Coba lihat y = 2x: titik (0, 0), (1, 2), (2, 4), (3, 6) semuanya terletak pada satu garis lurus.</p>
      <h4 class="sub">1. Bentuk y = mx</h4>
      <div class="rumus">y = mx</div>
      <p>Garisnya selalu melalui <b>titik asal (0, 0)</b>. Huruf <b>m</b> disebut <b>kemiringan</b> (gradien). Contoh y = 3x: titik (1, 3) dan (2, 6) ada pada garis, dan garisnya naik ke kanan.</p>
      <h4 class="sub">2. Bentuk y = mx + c</h4>
      <div class="rumus">y = mx + c</div>
      <p><b>m</b> adalah kemiringan dan <b>c</b> adalah titik potong dengan sumbu y, yaitu titik (0, c). Contoh y = 2x − 3: kemiringannya 2 dan garis memotong sumbu y di (0, −3). Titik potong sumbu x dicari dengan y = 0: 0 = 2x − 3, jadi x = 3/2.</p>
      <h4 class="sub">3. Bentuk ax + by + c = 0</h4>
      <div class="rumus">ax + by + c = 0 &nbsp; (a dan b tidak keduanya 0)</div>
      <p>Contoh: 2x − y + 3 = 0. Bentuk ini bisa diubah menjadi y = mx + c dengan memindahkan suku-sukunya:</p>
      <p>2x + 3y − 6 = 0 → 3y = −2x + 6 → y = −2/3 x + 2. Jadi m = −2/3 dan c = 2.</p>
      <p>Sebaliknya, y = ½x + 3: kalikan 2 menjadi 2y = x + 6, lalu pindahkan ke kiri: x − 2y + 6 = 0.</p>
      <div class="tip">💡 Titik potong sumbu y: isi x = 0. Titik potong sumbu x: isi y = 0.</div>`, true],
    ['A.2 Menyajikan Persamaan Garis Lurus', `
      <p>Untuk menyajikan (menggambar atau menuliskan) persamaan garis, kita butuh dua informasi: satu titik dan kemiringan, atau dua titik.</p>
      <h4 class="sub">a. Satu titik dan kemiringan tertentu</h4>
      <div class="rumus">y − y₁ = m(x − x₁)</div>
      <p>Garis melalui (2, 3) dengan m = 2: y − 3 = 2(x − 2) → y = 2x − 4 + 3 → <b>y = 2x − 1</b>.</p>
      <p>Cara menggambar: tandai titik (2, 3). Karena m = 2/1, dari titik itu geser 1 ke kanan lalu naik 2, sampai ke (3, 5). Hubungkan kedua titik dengan penggaris.</p>
      <h4 class="sub">b. Dua titik koordinat</h4>
      <p>Garis melalui A(1, 2) dan B(3, 6). Langkah 1, cari kemiringan: m = (6 − 2) ÷ (3 − 1) = 2. Langkah 2, pakai titik A: y − 2 = 2(x − 1) → y = 2x − 2 + 2 → <b>y = 2x</b>. Periksa titik B: 2 × 3 = 6 ✔.</p>
      <div class="rumus">${fr('y − y₁', 'y₂ − y₁')} = ${fr('x − x₁', 'x₂ − x₁')}</div>
      <p>Itu rumus langsungnya, hasilnya sama saja dengan cara di atas.</p>
      <h4 class="sub">c. Menggambar lewat titik potong sumbu</h4>
      <p>2x + y = 4. Isi x = 0 → y = 4, titiknya (0, 4). Isi y = 0 → x = 2, titiknya (2, 0). Hubungkan dua titik itu.</p>
      <div class="tip">💡 Coba semua ini di Laboratorium Garis: tab "Grafik" dan tab "Dua Titik".</div>`]
  ],
  bagianB: [
    ['B.1 Pengertian Kemiringan Garis Lurus', `
      <p>Kemiringan menunjukkan <b>seberapa curam</b> sebuah garis, seperti tanjakan jalan atau tangga. Kita hitung dengan membandingkan seberapa tinggi garis naik dengan seberapa jauh ia bergeser mendatar.</p>
      <div class="rumus">m = ${fr('naik / turun (tegak)', 'geser mendatar')}</div>
      <ul><li>Garis <b>naik</b> dari kiri ke kanan → m positif</li><li>Garis <b>turun</b> dari kiri ke kanan → m negatif</li><li>Garis <b>datar</b> → m = 0</li><li>Garis <b>tegak</b> → m tidak terdefinisi</li></ul>
      <p>Contoh: tangga naik 3 m untuk jarak mendatar 4 m, maka m = 3/4. Makin besar nilai |m|, makin curam garisnya.</p>`],
    ['B.2 Perhitungan Kemiringan', `
      <h4 class="sub">Rumus kemiringan dari dua titik</h4>
      <div class="rumus">m = ${fr('y₂ − y₁', 'x₂ − x₁')}</div>
      <p>Contoh: A(1, 2) dan B(4, 8) → m = (8 − 2) ÷ (4 − 1) = 6 ÷ 3 = 2.</p>
      <p>Contoh lain: A(−1, 5) dan B(3, 1) → m = (1 − 5) ÷ (3 − (−1)) = −4 ÷ 4 = −1. Garisnya turun.</p>
      <div class="tip">⚠️ Urutan titik boleh ditukar, asal atas dan bawah memakai urutan yang sama.</div>
      <h4 class="sub">Kemiringan dari persamaan garis</h4>
      <p>Bentuk y = mx + c: m adalah angka di depan x. Contoh y = 4x − 7, maka m = 4.</p>
      <p>Bentuk ax + by + c = 0: <b>m = −a/b</b>. Contoh 3x + 2y − 6 = 0, maka m = −3/2.</p>`],
    ['B.3 Sifat-Sifat Kemiringan Garis Lurus', `
      <h4 class="sub">a. Garis sejajar sumbu x (mendatar)</h4>
      <p>Persamaannya y = k, misalnya y = 3. Selisih y selalu 0, sehingga <b>m = 0</b>.</p>
      <h4 class="sub">b. Garis sejajar sumbu y (tegak)</h4>
      <p>Persamaannya x = k, misalnya x = −2. Selisih x selalu 0, dan pembagian dengan 0 tidak bisa dilakukan, sehingga kemiringannya <b>tidak terdefinisi</b>.</p>
      <h4 class="sub">c. Garis yang saling sejajar</h4>
      <div class="rumus">m₁ = m₂</div>
      <p>Contoh: y = 2x + 1 dan y = 2x − 5 sama-sama bermiringan 2, jadi sejajar dan tidak pernah berpotongan.</p>
      <h4 class="sub">d. Garis yang saling tegak lurus</h4>
      <div class="rumus">m₁ × m₂ = −1</div>
      <p>Contoh: y = 2x + 1 (m₁ = 2) dan y = −½x + 3 (m₂ = −½). Hasil kali: 2 × (−½) = −1, jadi keduanya tegak lurus.</p>
      <div class="tip">💡 Kalau m = p/q, kemiringan yang tegak lurus adalah −q/p: pecahannya dibalik, lalu tandanya diganti.</div>`]
  ],
  ringkasan: [
    'Bentuk garis lurus: y = mx (lewat titik asal), y = mx + c (c = titik potong sumbu y), dan ax + by + c = 0.',
    'Mengubah ax + by + c = 0 ke y = mx + c: m = −a/b dan titik potong sumbu y = −c/b.',
    'Satu titik dan kemiringan: y − y₁ = m(x − x₁).',
    'Dua titik: cari m = (y₂ − y₁)/(x₂ − x₁), lalu pakai salah satu titik pada y − y₁ = m(x − x₁).',
    'Kemiringan: naik → m positif, turun → m negatif, datar → m = 0, tegak → tidak terdefinisi.',
    'Garis y = k sejajar sumbu x (m = 0). Garis x = k sejajar sumbu y (m tidak terdefinisi).',
    'Garis sejajar: m₁ = m₂. Garis tegak lurus: m₁ × m₂ = −1.',
    'Titik potong sumbu y: isi x = 0. Titik potong sumbu x: isi y = 0.'
  ],
  tips: ['Setelah menemukan persamaan garis, masukkan kedua titik yang diketahui. Kalau keduanya cocok, persamaanmu benar.', 'Pada rumus kemiringan, jangan tertukar: y selalu di atas (pembilang), x di bawah (penyebut).', 'Garis naik berarti m positif, garis turun berarti m negatif. Pakai ini untuk mengecek hasilmu.'],
  contoh: [
    { tag: 'Bentuk umum ke y = mx + c', r: 'ax + by + c = 0 → y = −(a/b)x − c/b', q: 'Ubah 2x + 3y − 6 = 0 ke bentuk y = mx + c, lalu tentukan m dan c.', l: ['Pindahkan 2x dan −6 ke ruas kanan: 3y = −2x + 6.', 'Bagi kedua ruas dengan 3: y = −2/3 x + 2.', 'Jadi m = −2/3 dan c = 2.'], j: 'y = −2/3 x + 2, m = −2/3, c = 2' },
    { tag: 'Bentuk y = mx', r: 'y = mx melalui titik asal, m = y ÷ x', q: 'Garis y = mx melalui titik (2, 6). Tentukan persamaan garisnya.', l: ['Masukkan titik (2, 6): 6 = m × 2.', 'm = 6 ÷ 2 = 3.', 'Persamaannya y = 3x.'], j: 'y = 3x' },
    { tag: 'Titik potong sumbu', r: 'Sumbu y: x = 0. Sumbu x: y = 0', q: 'Tentukan titik potong garis y = 2x − 6 dengan sumbu x dan sumbu y.', l: ['Sumbu y: x = 0 → y = −6, titiknya (0, −6).', 'Sumbu x: y = 0 → 0 = 2x − 6 → x = 3, titiknya (3, 0).', 'Kedua titik itu cukup untuk menggambar garisnya.'], j: '(0, −6) dan (3, 0)' },
    { tag: 'Satu titik dan kemiringan', r: 'y − y₁ = m(x − x₁)', q: 'Tentukan persamaan garis yang melalui titik (−1, 4) dengan kemiringan −2.', l: ['Masukkan ke rumus: y − 4 = −2(x − (−1)) = −2(x + 1).', 'Kalikan kurung: y − 4 = −2x − 2.', 'Tambah 4: y = −2x + 2.'], j: 'y = −2x + 2' },
    { tag: 'Dua titik koordinat', r: 'm = (y₂ − y₁)/(x₂ − x₁), lalu y − y₁ = m(x − x₁)', q: 'Tentukan persamaan garis yang melalui A(−2, −1) dan B(2, 7).', l: ['Kemiringan: m = (7 − (−1)) ÷ (2 − (−2)) = 8 ÷ 4 = 2.', 'Pakai titik A: y − (−1) = 2(x − (−2)), yaitu y + 1 = 2x + 4.', 'y = 2x + 3. Periksa B: 2(2) + 3 = 7 ✔.'], j: 'y = 2x + 3' },
    { tag: 'Bentuk umum dari dua titik', r: 'Cari y = mx + c, lalu pindahkan ke ax + by + c = 0', q: 'Tuliskan persamaan garis yang melalui (1, 3) dan (3, 7) dalam bentuk ax + by + c = 0.', l: ['m = (7 − 3) ÷ (3 − 1) = 2.', 'y − 3 = 2(x − 1) → y = 2x + 1.', 'Pindahkan semua ke kiri: 2x − y + 1 = 0.'], j: '2x − y + 1 = 0' },
    { tag: 'Kemiringan dari dua titik', r: 'm = tegak ÷ mendatar', q: 'Sebuah tanjakan naik 6 m pada jarak mendatar 24 m. Berapa kemiringannya?', l: ['Naik (tegak) = 6 dan mendatar = 24.', 'm = 6 ÷ 24.', 'Sederhanakan: m = 1/4.'], j: 'm = 1/4' },
    { tag: 'Kemiringan dari persamaan', r: 'ax + by + c = 0 → m = −a/b', q: 'Tentukan kemiringan garis 4x − 2y + 5 = 0.', l: ['Di sini a = 4 dan b = −2.', 'm = −a/b = −4 ÷ (−2).', 'm = 2.'], j: 'm = 2' },
    { tag: 'Sejajar sumbu x dan sumbu y', r: 'y = k → m = 0. x = k → tidak terdefinisi', q: 'Tentukan kemiringan garis y = 5 dan garis x = −3.', l: ['Garis y = 5 mendatar (sejajar sumbu x), selisih y = 0, jadi m = 0.', 'Garis x = −3 tegak (sejajar sumbu y), selisih x = 0.', 'Pembagian dengan 0 tidak terdefinisi, jadi kemiringan garis x = −3 tidak terdefinisi.'], j: 'y = 5 → m = 0; x = −3 → tidak terdefinisi' },
    { tag: 'Garis sejajar', r: 'Sejajar → m₁ = m₂', q: 'Tentukan persamaan garis yang melalui (1, 5) dan sejajar dengan garis 2x − y + 3 = 0.', l: ['Kemiringan garis 2x − y + 3 = 0 adalah m = −2/(−1) = 2.', 'Sejajar berarti m sama, jadi m = 2. Rumus: y − 5 = 2(x − 1).', 'y = 2x − 2 + 5 = 2x + 3.'], j: 'y = 2x + 3' },
    { tag: 'Garis tegak lurus', r: 'Tegak lurus → m₁ × m₂ = −1', q: 'Tentukan persamaan garis yang melalui (2, 1) dan tegak lurus dengan garis y = ½x + 3.', l: ['Kemiringan garis itu m₁ = 1/2, jadi m₂ = −1 ÷ (1/2) = −2.', 'y − 1 = −2(x − 2) → y − 1 = −2x + 4.', 'y = −2x + 5.'], j: 'y = −2x + 5' }
  ],
  soal: [
    { q: 'Kemiringan garis y = 4x − 7 adalah ...', o: ['4', '−7', '7', '−4'], j: 0, p: 'Pada y = mx + c, m adalah angka di depan x, jadi m = 4.' },
    { q: 'Garis 2x + y − 6 = 0 memotong sumbu y di titik ...', o: ['(0, 6)', '(0, −6)', '(3, 0)', '(0, 3)'], j: 0, p: 'Sumbu y: x = 0. Maka y − 6 = 0, jadi y = 6 dan titiknya (0, 6).' },
    { q: 'Kemiringan garis yang melalui A(1, 3) dan B(3, 11) adalah ...', o: ['2', '4', '8', '1/4'], j: 1, p: 'm = (11 − 3) ÷ (3 − 1) = 8 ÷ 2 = 4.' },
    { q: 'Kemiringan garis 3x − 6y + 12 = 0 adalah ...', o: ['2', '−2', '1/2', '−1/2'], j: 2, p: 'a = 3 dan b = −6, sehingga m = −a/b = −3/(−6) = 1/2.' },
    { q: 'Persamaan garis yang melalui (2, 5) dengan kemiringan 3 adalah ...', o: ['y = 3x + 1', 'y = 3x − 1', 'y = 3x + 5', 'y = 3x − 6'], j: 1, p: 'y − 5 = 3(x − 2) → y = 3x − 6 + 5 → y = 3x − 1.' },
    { q: 'Persamaan garis yang melalui (0, 1) dan (2, 5) adalah ...', o: ['y = x + 1', 'y = 2x + 5', 'y = 2x + 1', 'y = 3x + 1'], j: 2, p: 'm = (5 − 1) ÷ (2 − 0) = 2. Titik (0, 1) memberi c = 1, jadi y = 2x + 1.' },
    { q: 'Kemiringan garis y = −3 adalah ...', o: ['−3', '3', '0', 'tidak terdefinisi'], j: 2, p: 'Garis y = −3 mendatar (sejajar sumbu x), sehingga kemiringannya 0.' },
    { q: 'Garis yang sejajar dengan garis y = 2x + 5 adalah ...', o: ['y = −2x + 5', 'y = ½x + 5', 'y = 2x − 1', 'y = −½x − 1'], j: 2, p: 'Garis sejajar punya kemiringan sama. Hanya y = 2x − 1 yang kemiringannya 2.' },
    { q: 'Kemiringan garis yang tegak lurus dengan garis y = 3x − 1 adalah ...', o: ['3', '−3', '1/3', '−1/3'], j: 3, p: 'm₁ × m₂ = −1 → 3 × m₂ = −1 → m₂ = −1/3.' },
    { q: 'Garis melalui (1, 2) dan (3, p) sejajar dengan garis y = 2x + 5. Nilai p adalah ...', o: ['4', '5', '6', '8'], j: 2, p: 'Sejajar berarti m = 2. (p − 2) ÷ (3 − 1) = 2 → p − 2 = 4 → p = 6.' }
  ]
}

const LANGKAH5 = [
  { k: 'belajar', ik: '📖', t: 'Perpustakaan Kuno', n: 'Penjelasan & Ringkasan', d: 'Pahami bentuk garis dan kemiringan', c1: '#ff7a59', c2: '#ffb347' },
  { k: 'visual', ik: '📈', t: 'Laboratorium Garis', n: 'Visual Interaktif', d: 'Gambar garis, dua titik, sifat garis', c1: '#6c4cf1', c2: '#a78bfa' },
  { k: 'contoh', ik: '🗺️', t: 'Peta Rahasia', n: 'Contoh Soal', d: 'Pembahasan langkah demi langkah', c1: '#16a36a', c2: '#5ed8a2' },
  { k: 'latihan', ik: '⚔️', t: 'Arena Latihan', n: 'Latihan Interaktif', d: 'Tanpa batas waktu, ada feedback', c1: '#0ea5e9', c2: '#6ee7f9' },
  { k: 'game', ik: '🏰', t: 'Istana Harta Karun', n: 'Kuis Edukasi', d: '4 jenis kuis, 5 soal per sesi', c1: '#ec4899', c2: '#f9a8d4' }
]

/* ---------- Visual interaktif ---------- */
function visual5() {
  const TB = [['g', '📈 Grafik y = mx + c'], ['d', '📍 Dua Titik'], ['s', '🔀 Sifat Garis']]
  const S = { g: { mp: 2, mq: 1, c: 1 }, d: { x1: 1, y1: 2, x2: 3, y2: 6 }, s: { rel: 'sj', mp: 2, mq: 1, c1: 1, c2: -2 } }
  let tab = 'g'
  const MS = ['-4/1', '-3/1', '-2/1', '-1/1', '-1/2', '0/1', '1/2', '1/1', '2/1', '3/1', '4/1'], MS2 = MS.filter(x => x !== '0/1')
  const mlab = s => { const [p, q] = s.split('/').map(Number); return q === 1 ? mn5(p) : `${mn5(p)}/${q}` }
  const sel = (k, arr, cur, lab) => `<label>${lab} <select data-k="${k}">${arr.map(([v, t]) => `<option value="${v}" ${String(v) === String(cur) ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`
  const rg = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => [lo + i, mn5(lo + i)])
  const msel = (v, lab, list) => sel('m', list.map(s => [s, mlab(s)]), `${v.mp}/${v.mq}`, lab)
  const PX = x => 150 + 22 * x, PY = y => 150 - 22 * y
  const gl = (m, c, w) => `<line x1="${PX(-7)}" y1="${PY(-7 * m + c)}" x2="${PX(7)}" y2="${PY(7 * m + c)}" stroke="${w}" stroke-width="4" stroke-linecap="round"/>`
  const gv = (x, w) => `<line x1="${PX(x)}" y1="0" x2="${PX(x)}" y2="300" stroke="${w}" stroke-width="4" stroke-linecap="round"/>`
  const dot = (x, y, w) => `<circle cx="${PX(x)}" cy="${PY(y)}" r="6.5" fill="${w}"/>`
  const lab = (x, y, t) => { const px = PX(x), py = PY(y), an = px > 215 ? 'end' : 'start'; return `<text x="${px + (an === 'end' ? -11 : 11)}" y="${py > 40 ? py - 10 : py + 20}" text-anchor="${an}">${t}</text>` }
  const bidang = (garis, lain) => `<svg class="svg5" viewBox="0 0 300 300" role="img" aria-label="Bidang koordinat"><defs><clipPath id="kp5"><rect x="18" y="18" width="264" height="264"/></clipPath></defs>
    <g stroke="currentColor" opacity=".15">${Array.from({ length: 13 }, (_, i) => `<line x1="${PX(i - 6)}" y1="18" x2="${PX(i - 6)}" y2="282"/><line x1="18" y1="${PY(i - 6)}" x2="282" y2="${PY(i - 6)}"/>`).join('')}</g>
    <g stroke="currentColor" stroke-width="1.8"><line x1="14" y1="150" x2="286" y2="150"/><line x1="150" y1="14" x2="150" y2="286"/></g>
    ${Array.from({ length: 13 }, (_, i) => i === 6 ? '' : `<text class="sb" x="${PX(i - 6)}" y="164" text-anchor="middle">${i - 6}</text><text class="sb" x="141" y="${PY(i - 6) + 4}" text-anchor="end">${i - 6}</text>`).join('')}
    <text class="sb" x="292" y="146" text-anchor="end" style="font-size:12px">x</text><text class="sb" x="157" y="12" style="font-size:12px">y</text>
    <g clip-path="url(#kp5)">${garis}</g>${lain}</svg>`
  const gambar = () => {
    const v = S[tab]; let ctl, eq, isi, tip, tombol = ''
    if (tab === 'g') {
      const { mp, mq, c } = v, m = mp / mq
      ctl = msel(v, 'Kemiringan m', MS) + sel('c', rg(-5, 5), c, 'Titik potong sumbu y (c)')
      tombol = `<div class="pilih">${[['Garis naik', 1], ['Garis turun', 2], ['Garis datar', 3], ['y = mx (c = 0)', 4], ['🎲 Acak', 5]].map(([t, i]) => `<button class="btn alt" data-p="${i}">${t}</button>`).join('')}</div>`
      eq = `<div class="besar">${pe5(mp, mq, c)}</div><div class="kecil">Bentuk umum: ${ug5(mp, mq, c)}</div>`
      let tri = ''
      if (mp !== 0) {
        let xs = 0, ys = c; if (Math.abs(c + mp) > 6 || mq > 6) { xs = -mq; ys = c - mp }
        const xe = xs + mq, ye = ys + mp, naik = mp > 0
        tri = `<path d="M${PX(xs)} ${PY(ys)}H${PX(xe)}V${PY(ye)}" fill="none" stroke="#16a36a" stroke-width="3.5" stroke-dasharray="6 5"/>
          <text x="${(PX(xs) + PX(xe)) / 2}" y="${PY(ys) + (naik ? 17 : -8)}" text-anchor="middle" style="fill:#16a36a">→ ${mq}</text>
          <text x="${PX(xe) + (PX(xe) > 245 ? -8 : 8)}" y="${(PY(ys) + PY(ye)) / 2 + 4}" text-anchor="${PX(xe) > 245 ? 'end' : 'start'}" style="fill:#16a36a">${naik ? '↑' : '↓'} ${Math.abs(mp)}</text>`
      }
      const x0 = mp === 0 ? null : -c * mq / mp
      isi = bidang(gl(m, c, '#6c4cf1'), tri + dot(0, c, '#ff7a59') + (x0 !== null && Math.abs(x0) <= 6 ? dot(x0, 0, '#0ea5e9') : '') + `<text x="${PX(0) - 12}" y="${PY(c) + (m > 0 ? -10 : 18)}" text-anchor="end">(0, ${mn5(c)})</text>`) +
        `<p class="kecil">🟣 Garis. 🟠 Titik potong sumbu y. ${x0 !== null && Math.abs(x0) <= 6 ? '🔵 Titik potong sumbu x. ' : ''}🟢 Segitiga kemiringan.</p>
        <h4 class="sub">Cara membacanya</h4><ol>
        <li>Titik potong sumbu y adalah (0, c) = (0, ${mn5(c)}).</li>
        <li>${mp === 0 ? 'Kemiringan m = 0, jadi garisnya <b>datar</b> (sejajar sumbu x).' : `Kemiringan m = ${fh5(mp, mq)}: setiap geser ${mq} ke kanan, garis ${mp > 0 ? 'naik' : 'turun'} ${Math.abs(mp)}. Karena m ${mp > 0 ? 'positif' : 'negatif'}, garis ${mp > 0 ? 'naik' : 'turun'} dari kiri ke kanan.`}</li>
        <li>${mp === 0 ? 'Garis datar tidak memotong sumbu x (kecuali c = 0, yaitu sumbu x itu sendiri).' : `Titik potong sumbu x: isi y = 0 → x = −c/m = ${fh5(-c * mq, mp)}.`}</li></ol>`
      tip = 'Ubah m dan c. Perhatikan: c menggeser garis naik atau turun, sedangkan m mengatur curamnya.'
    } else if (tab === 'd') {
      const { x1, y1, x2, y2 } = v, dx = x2 - x1, dy = y2 - y1
      ctl = ['A', 'B'].map((t, i) => `<label>Koordinat ${t} (x${i ? '₂' : '₁'}, y${i ? '₂' : '₁'}) <select data-k="x${i + 1}" aria-label="x titik ${t}">${rg(-5, 5).map(([a, b]) => `<option value="${a}" ${a === v['x' + (i + 1)] ? 'selected' : ''}>${b}</option>`).join('')}</select> <select data-k="y${i + 1}" aria-label="y titik ${t}">${rg(-5, 5).map(([a, b]) => `<option value="${a}" ${a === v['y' + (i + 1)] ? 'selected' : ''}>${b}</option>`).join('')}</select></label>`).join('')
      tombol = `<div class="pilih">${['Contoh 1', 'Contoh 2', 'Contoh 3', '🎲 Acak'].map((t, i) => `<button class="btn alt" data-p="${i + 1}">${t}</button>`).join('')}</div>`
      const pts = dot(x1, y1, '#0ea5e9') + dot(x2, y2, '#ff7a59') + lab(x1, y1, `A${tt5(x1, y1)}`) + lab(x2, y2, `B${tt5(x2, y2)}`)
      if (dx === 0 && dy === 0) {
        eq = '<div class="besar">Titik A = titik B</div><div class="kecil">Dua titik yang sama belum membentuk garis.</div>'
        isi = bidang('', pts) + '<div class="tip">Ubah salah satu titik supaya A dan B berbeda.</div>'
      } else if (dx === 0) {
        eq = `<div class="besar">x = ${mn5(x1)}</div><div class="kecil">Garis tegak. Kemiringan tidak terdefinisi.</div>`
        isi = bidang(gv(x1, '#6c4cf1'), pts) + `<p>Kedua titik punya x yang sama (${mn5(x1)}), jadi selisih x = 0. Rumus m = ${fr('y₂ − y₁', 'x₂ − x₁')} berarti pembagian dengan 0, sehingga <b>kemiringan tidak terdefinisi</b>. Garisnya sejajar sumbu y dengan persamaan <b>x = ${mn5(x1)}</b>.</p>`
      } else {
        const [mp, mq] = sm5(dy, dx), cp = y1 * mq - mp * x1, cq = mq, [cs, cn] = sm5(cp, cq), cstr = fh5(cs, cn), cpar = cs < 0 ? `(${cstr})` : cstr
        eq = `<div class="besar">${pe5(mp, mq, cp, cq)}</div><div class="kecil">Bentuk umum: ${ug5(mp, mq, cp, cq)}</div>`
        isi = bidang(gl(mp / mq, cp / cq, '#6c4cf1'), pts) + `<h4 class="sub">Langkah demi langkah</h4><ol>
          <li><b>Cari kemiringan:</b> m = ${fr('y₂ − y₁', 'x₂ − x₁')} = ${fr(`${mn5(y2)} ${sb5(y1)}`, `${mn5(x2)} ${sb5(x1)}`)} = ${fr(mn5(dy), mn5(dx))} = <b>${fh5(mp, mq)}</b>.</li>
          <li><b>Pakai titik A:</b> y − y₁ = m(x − x₁) → y ${sb5(y1)} = ${fh5(mp, mq)}(x ${sb5(x1)}).</li>
          <li><b>Sederhanakan:</b> c = y₁ − m × x₁ = ${mn5(y1)} − ${mp < 0 ? `(${fh5(mp, mq)})` : fh5(mp, mq)} × ${pa5(x1)} = <b>${fh5(cs, cn)}</b>, sehingga ${pe5(mp, mq, cp, cq)}.</li>
          <li><b>Periksa titik B:</b> m × x₂ + c = ${mp < 0 ? `(${fh5(mp, mq)})` : fh5(mp, mq)} × ${pa5(x2)} + ${cpar} = ${mn5(y2)} ✔</li></ol>
          <p class="kecil">${mp === 0 ? 'Garisnya datar, karena y₁ = y₂.' : mp > 0 ? 'Garisnya naik dari kiri ke kanan (m positif).' : 'Garisnya turun dari kiri ke kanan (m negatif).'}</p>`
      }
      tip = 'Garis lurus ditentukan oleh dua titik. Pilih titik yang berbeda dan lihat kemiringan serta persamaannya berubah.'
    } else {
      const { rel, mp, mq, c1, c2 } = v, m = mp / mq
      ctl = sel('rel', [['sj', 'Sejajar'], ['tl', 'Tegak lurus'], ['sx', 'Sejajar sumbu x'], ['sy', 'Sejajar sumbu y']], rel, 'Sifat')
      if (rel === 'sj' || rel === 'tl') ctl += msel(v, 'Kemiringan garis 1 (m₁)', MS2)
      ctl += sel('c1', rg(-5, 5), c1, rel === 'sx' ? 'Garis 1: y =' : rel === 'sy' ? 'Garis 1: x =' : 'c₁') + sel('c2', rg(-5, 5), c2, rel === 'sx' ? 'Garis 2: y =' : rel === 'sy' ? 'Garis 2: x =' : 'c₂')
      if (rel === 'sx' || rel === 'sy') {
        const g = rel === 'sx' ? (k, w) => gl(0, k, w) : (k, w) => gv(k, w), nm = rel === 'sx' ? 'y' : 'x'
        eq = `<div class="besar">${nm} = ${mn5(c1)} &nbsp; dan &nbsp; ${nm} = ${mn5(c2)}</div><div class="kecil">${rel === 'sx' ? 'Kemiringan kedua garis = 0' : 'Kemiringan kedua garis tidak terdefinisi'}</div>`
        isi = bidang(g(c1, '#6c4cf1') + g(c2, '#16a36a'), '') + (rel === 'sx'
          ? '<p>Garis mendatar punya selisih y = 0, sehingga <b>m = 0</b>. Semua garis y = k sejajar sumbu x, dan juga sejajar satu sama lain.</p>'
          : '<p>Garis tegak punya selisih x = 0, sehingga kemiringannya <b>tidak terdefinisi</b> (pembagian dengan 0). Semua garis x = k sejajar sumbu y, dan juga sejajar satu sama lain.</p>') + (c1 === c2 ? '<p class="kecil">Kedua nilai sama, jadi kedua garis berimpit.</p>' : '')
        tip = 'Garis y = k datar, garis x = k tegak. Ubah nilai k dan lihat garisnya bergeser.'
      } else {
        const [qp, qq] = rel === 'sj' ? [mp, mq] : sm5(-mq, mp), m2 = qp / qq
        eq = `<div class="besar" style="font-size:1.55rem">Garis 1: ${pe5(mp, mq, c1)}<br>Garis 2: ${pe5(qp, qq, c2)}</div><div class="kecil">${rel === 'sj' ? 'm₁ = m₂' : 'm₁ × m₂ = −1'}</div>`
        isi = bidang(gl(m, c1, '#6c4cf1') + gl(m2, c2, '#16a36a'), '') + `<p class="kecil">🟣 Garis 1 (m₁ = ${fh5(mp, mq)}). 🟢 Garis 2 (m₂ = ${fh5(qp, qq)}).</p>` + (rel === 'sj'
          ? `<p>Garis sejajar punya kemiringan yang sama: m₁ = m₂ = ${fh5(mp, mq)}. ${c1 === c2 ? '<b>Karena c₁ = c₂, kedua garis berimpit</b> (menjadi satu garis).' : 'Karena c₁ dan c₂ berbeda, kedua garis tidak pernah berpotongan.'}</p>`
          : `<p>Garis tegak lurus: m₂ = −1 ÷ m₁ = −1 ÷ ${fh5(mp, mq)} = ${fh5(qp, qq)} (pecahan dibalik, tanda diganti).</p><p>Periksa: m₁ × m₂ = ${fh5(mp, mq)} × ${pa5(fh5(qp, qq))} = <b>−1</b> ✔. Kedua garis berpotongan membentuk sudut 90°.</p>`)
        tip = rel === 'sj' ? 'Coba ubah m₁: garis kedua ikut berubah dan tetap sejajar.' : 'Coba m₁ = 2: m₂ = −1/2. Pecahan dibalik dan tandanya diganti.'
      }
    }
    $('vis').innerHTML = `<div class="tabsv">${TB.map(([k, nm]) => `<button data-t="${k}" class="${k === tab ? 'on' : ''}">${nm}</button>`).join('')}</div><div class="pilih">${ctl}</div>${tombol}<div class="hasil">${eq}</div><div style="margin:10px 0">${isi}</div><div class="tip">💡 ${tip}</div>`
    $('vis').querySelectorAll('[data-t]').forEach(x => x.onclick = () => { tab = x.dataset.t; gambar() })
    $('vis').querySelectorAll('select').forEach(s => s.onchange = () => { const k = s.dataset.k; if (k === 'm') { const [p, q] = s.value.split('/').map(Number); v.mp = p; v.mq = q } else v[k] = k === 'rel' ? s.value : +s.value; gambar() })
    const r = n => Math.floor(Math.random() * n), pk = a => a[r(a.length)]
    $('vis').querySelectorAll('[data-p]').forEach(b => b.onclick = () => {
      const i = +b.dataset.p
      if (tab === 'g') { const P = [[[1, 1], [2, 1], [3, 1]], [[-1, 1], [-2, 1], [-1, 2]], [[0, 1]]]; if (i === 4) v.c = 0; else if (i === 5) { [v.mp, v.mq] = pk(MS).split('/').map(Number); v.c = r(11) - 5 } else { const [p, q] = pk(P[i - 1]); v.mp = p; v.mq = q } }
      else Object.assign(v, [{ x1: 1, y1: 2, x2: 3, y2: 6 }, { x1: -2, y1: -1, x2: 2, y2: 3 }, { x1: -3, y1: 4, x2: 1, y2: -4 }][i - 1] || { x1: r(11) - 5, y1: r(11) - 5, x2: r(11) - 5, y2: r(11) - 5 })
      gambar()
    })
  }
  gambar()
}

/* ---------- Bank soal kuis (dibangkitkan dari rumus) ---------- */
const MP5 = (() => { const a = []; for (let p = 1; p <= 5; p++) for (let q = 1; q <= 5; q++) if (p !== q && g5(p, q) === 1) a.push([p, q]); return a })()
const ML5 = [-3, -2, -1, 1, 2, 3, 4]
const FAM5 = [
  { id: 'gradTitik', n: 576, lv: 1, int: 1, pair: 1, mk: i => { const [a, b, c, d] = D(i, 6, 6, 4, 4), x1 = a - 2, y1 = b - 2, dx = 1 + c, m = 1 + d, x2 = x1 + dx, y2 = y1 + m * dx
    return { e: `A${tt5(x1, y1)}, B${tt5(x2, y2)}`, q: `Kemiringan garis yang melalui titik A${tt5(x1, y1)} dan B${tt5(x2, y2)} adalah ...`, a: m, w: [dx, m + 1, m + 2], tip: 'Kemiringan = selisih y dibagi selisih x.', s: [`m = (y₂ − y₁) ÷ (x₂ − x₁) = (${y2} ${sb5(y1)}) ÷ (${x2} ${sb5(x1)})`, `m = ${y2 - y1} ÷ ${dx}`, `m = ${m}`] } } },
  { id: 'gradPers', n: 171, lv: 1, int: 1, pair: 1, mk: i => { const [a, b] = D(i, 9, 19), m = 1 + a, c = b - 9
    return { e: pt5(m, c), q: `Kemiringan garis ${pt5(m, c)} adalah ...`, a: m, w: [Math.abs(c), m + 1, m - 1], tip: 'Pada y = mx + c, kemiringan adalah angka di depan x.', s: [`Bentuk y = mx + c dengan m di depan x`, `Pada ${pt5(m, c)}, angka di depan x adalah ${m}`, `m = ${m}`] } } },
  { id: 'titikY', n: 60, lv: 1, int: 1, pair: 1, mk: i => { const [a, b] = D(i, 5, 12), m = 1 + a, c = 1 + b
    return { e: pt5(m, c), q: `Garis ${pt5(m, c)} memotong sumbu y di titik (0, ...). Berapa nilainya?`, a: c, w: [m, c + m, c + 1], tip: 'Titik potong sumbu y: isi x = 0.', s: ['Sumbu y: x = 0', `y = ${m}(0) ${c < 0 ? '−' : '+'} ${Math.abs(c)}`, `y = ${c}`] } } },
  { id: 'gradUmum', n: 255, lv: 2, int: 1, pair: 1, mk: i => { const [a, b, c] = D(i, 3, 5, 17), k = 1 + a, m = 1 + b, cc = c - 8, A = m * k
    return { e: gu5(A, -k, cc), q: `Kemiringan garis ${gu5(A, -k, cc)} adalah ...`, a: m, w: [A, k, m + 1], tip: 'Bentuk ax + by + c = 0 memiliki kemiringan m = −a/b.', s: [`a = ${A} dan b = ${-k}`, `m = −a/b = −${A} ÷ (${-k})`, `m = ${m}`] } } },
  { id: 'titikX', n: 40, lv: 2, int: 1, pair: 1, mk: i => { const [a, b] = D(i, 5, 8), m = 1 + a, x0 = 1 + b, c = -m * x0
    return { e: pt5(m, c), q: `Garis ${pt5(m, c)} memotong sumbu x di titik (..., 0). Berapa nilainya?`, a: x0, w: [m, -c, x0 + 1], tip: 'Titik potong sumbu x: isi y = 0.', s: ['Sumbu x: y = 0', `0 = ${m}x − ${-c}, sehingga ${m}x = ${-c}`, `x = ${x0}`] } } },
  { id: 'subst', n: 144, lv: 2, int: 1, pair: 1, mk: i => { const [a, b, c] = D(i, 4, 6, 6), m = 1 + a, x = 1 + b, cc = c, y = m * x + cc
    return { e: `titik (${x}, ?) pada ${pt5(m, cc)}`, q: `Titik (${x}, p) terletak pada garis ${pt5(m, cc)}. Nilai p adalah ...`, a: y, w: [m + x + cc, m * x, x + cc], tip: 'Titik terletak pada garis jika koordinatnya memenuhi persamaan garis.', s: [`Masukkan x = ${x} ke ${pt5(m, cc)}`, `p = ${m} × ${x} + ${cc}`, `p = ${y}`] } } },
  { id: 'sejajarP', n: 1200, lv: 2, int: 1, pair: 1, mk: i => { const [a, b, c, d, e] = D(i, 5, 4, 4, 5, 3), y1 = 1 + a, m = 1 + b, dx = 1 + c, cc = 1 + d, x1 = e, p = y1 + m * dx
    return { e: `sejajar ${pt5(m, cc)}`, q: `Garis melalui titik ${tt5(x1, y1)} dan ${tt5(x1 + dx, 'p')} sejajar dengan garis ${pt5(m, cc)}. Nilai p adalah ...`, a: p, w: [y1 + dx, m * dx, p + m], tip: 'Garis sejajar memiliki kemiringan yang sama.', s: [`Sejajar, jadi m = ${m}`, `(p − ${y1}) ÷ (${x1 + dx} ${sb5(x1)}) = ${m}`, `p = ${y1} + ${m} × ${dx} = ${p}`] } } },
  { id: 'persSatu', n: 336, lv: 2, pair: 1, mk: i => { const [a, b, c] = D(i, 7, 6, 8), m = ML5[a], x1 = b - 2, y1 = c - 3, cc = y1 - m * x1
    return { e: `${tt5(x1, y1)}, m = ${mn5(m)}`, q: `Persamaan garis yang melalui titik ${tt5(x1, y1)} dengan kemiringan ${mn5(m)} adalah ...`, a: pt5(m, cc), w: [pt5(m, y1), pt5(m, -cc), pt5(m, y1 + m * x1)], f: j => pt5(m, cc + j + 1), tip: 'Pakai y − y₁ = m(x − x₁).', s: [`y ${sb5(y1)} = ${mn5(m)}(x ${sb5(x1)})`, `y = ${mn5(m)}x ${m * x1 > 0 ? '−' : '+'} ${Math.abs(m * x1)} ${y1 < 0 ? '−' : '+'} ${Math.abs(y1)}`, pt5(m, cc)] } } },
  { id: 'sumbu', n: 18, lv: 2, pair: 1, mk: i => { const [a, b] = D(i, 2, 9), k = b - 4, ke = k === 0 ? 1 : k
    return a === 0
      ? { e: `y = ${mn5(ke)}`, q: `Garis y = ${mn5(ke)} sejajar dengan sumbu x. Kemiringan garis tersebut adalah ...`, a: '0', w: ['tidak terdefinisi', '1', mn5(ke)], f: j => String(j + 2), tip: 'Garis mendatar punya selisih y = 0.', s: ['Garis y = k mendatar', 'Selisih y = 0, sehingga m = 0 ÷ selisih x', 'm = 0'] }
      : { e: `x = ${mn5(ke)}`, q: `Garis x = ${mn5(ke)} sejajar dengan sumbu y. Kemiringan garis tersebut adalah ...`, a: 'tidak terdefinisi', w: ['0', '1', mn5(ke)], f: j => String(j + 2), tip: 'Garis tegak punya selisih x = 0, pembagian dengan nol tidak terdefinisi.', s: ['Garis x = k tegak', 'Selisih x = 0, jadi m = selisih y ÷ 0', 'm tidak terdefinisi'] } } },
  { id: 'duaTitik', n: 1155, lv: 3, pair: 1, mk: i => { const [a, b, c, d] = D(i, 7, 11, 5, 3), m = ML5[a], cc = b - 5, x1 = c - 2, dx = 1 + d, x2 = x1 + dx, y1 = m * x1 + cc, y2 = m * x2 + cc
    return { e: `A${tt5(x1, y1)}, B${tt5(x2, y2)}`, q: `Persamaan garis yang melalui titik A${tt5(x1, y1)} dan B${tt5(x2, y2)} adalah ...`, a: pt5(m, cc), w: [pt5(-m, cc), pt5(m, -cc), pt5(m, cc + m)], f: j => pt5(m + j, cc), tip: 'Cari kemiringan dulu, lalu pakai salah satu titik.', s: [`m = (${y2} ${sb5(y1)}) ÷ (${x2} ${sb5(x1)}) = ${mn5(m)}`, `y ${sb5(y1)} = ${mn5(m)}(x ${sb5(x1)})`, pt5(m, cc)] } } },
  { id: 'tegak', n: 36, lv: 3, pair: 1, mk: i => { const [a, b] = D(i, MP5.length, 2), [p, q] = MP5[a], sg = b ? -1 : 1, m = ft5(sg * p, q), ans = ft5(-sg * q, p)
    return { e: `m = ${m}`, q: `Garis g memiliki kemiringan ${m}. Kemiringan garis yang tegak lurus dengan garis g adalah ...`, a: ans, w: [m, ft5(-sg * p, q), ft5(sg * q, p)], f: j => ft5(sg * (p + j + 1), q + j), tip: 'Tegak lurus: m₁ × m₂ = −1. Balik pecahannya, lalu ganti tandanya.', s: ['Tegak lurus: m₁ × m₂ = −1', `m₂ = −1 ÷ (${m})`, `m₂ = ${ans}`] } } }
]
const TOTAL5 = FAM5.reduce((t, f) => t + f.n, 0)
const sudah5 = new Set()

const bangun5 = (f, i) => { const x = f.mk(i); x.q = x.q || `${x.e} = ?`; x.fam = f.id; x.int = !!f.int; return x }
const tarik5 = (lv, fl) => {
  const c = FAM5.filter(f => f.lv === lv && fl(f)), pool = c.length ? c : FAM5.filter(fl)
  for (let t = 0; t < 40; t++) { const f = pool[Math.floor(Math.random() * pool.length)], i = Math.floor(Math.random() * f.n); if (!sudah5.has(f.id + ':' + i)) { sudah5.add(f.id + ':' + i); return bangun5(f, i) } }
  const f = pool[0]; return bangun5(f, Math.floor(Math.random() * f.n))
}
const pilihan5 = x => {
  const set = new Set([T(x.a)]); x.w.forEach(v => { if (typeof v !== 'number' || v > 0) set.add(T(v)) })
  let j = 1; while (set.size < 4) set.add(T(x.f ? x.f(j++) : x.a + j++ * 2))
  const o = acak(set); return { o, ok: o.indexOf(T(x.a)) }
}

/* ---------- Halaman materi (peta petualangan + 5 langkah) ---------- */
function bukaMateri5(m, aktif) {
  window.scrollTo(0, 0); clearInterval(window._kuisTimer)
  if (window.ingatPosisi) ingatPosisi({ tab: 'beranda', materi: 5, langkah: aktif || null })
  const k = LANGKAH5.findIndex(x => x.k === aktif), judul = `<h2>${aman(m.ikon)} ${aman(m.judul)}</h2>`
  if (k < 0) {
    const X = [30, 70, 30, 70, 30], Y = LANGKAH5.map((_, i) => 10 + i * 20)
    let d = `M${X[0]} ${Y[0]}`
    for (let i = 1; i < X.length; i++) { const ym = (Y[i - 1] + Y[i]) / 2; d += ` C${X[i - 1]} ${ym} ${X[i]} ${ym} ${X[i]} ${Y[i]}` }
    $('isi').innerHTML = `<p><button class="btn alt" id="kembali">← Kembali</button></p>${judul}
      <p class="kecil">🧭 Petualangan di Negeri Koordinat. Pilih tempat yang ingin kamu kunjungi dulu, lalu ikuti jalurnya.</p>
      <div class="peta"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" class="jalur"/></svg>
        <span class="dek" style="left:3%;top:3%">☁️</span><span class="dek" style="right:4%;top:20%">⛰️</span><span class="dek" style="left:3%;top:40%">🌴</span>
        <span class="dek" style="right:3%;top:58%">☁️</span><span class="dek" style="left:4%;top:78%">⛰️</span><span class="dek" style="right:4%;top:93%">🌴</span>
        <span class="mulai">🏁 Mulai petualangan</span>
        ${LANGKAH5.map((x, i) => `<button class="nd" style="left:${X[i]}%;top:${Y[i]}%;--c1:${x.c1};--c2:${x.c2};--w:${i * .4}s" data-k="${x.k}" aria-label="${x.t}: ${x.n}">
          <span class="bola">${x.ik}<i class="no">${i + 1}</i></span><span class="lb"><b>${x.t}</b><small>${x.n}</small></span></button>`).join('')}</div>`
    $('kembali').onclick = () => tampilUtama(kelasNama)
    return $('isi').querySelectorAll('[data-k]').forEach(b => b.onclick = () => bukaMateri5(m, b.dataset.k))
  }
  const L = LANGKAH5[k], akhir = k === LANGKAH5.length - 1
  const konten = {
    belajar: `<div class="card"><h3>📖 Perpustakaan Kuno</h3><p class="kecil">Buka bagian satu per satu.</p>${[['A. Grafik Persamaan Garis Lurus', 'bagian'], ['B. Kemiringan Garis Lurus', 'bagianB']].map(([g, k]) => `<h4 class="grp">${g}</h4>${det(M5[k])}`).join('')}</div>
      <div class="card box"><h3>🏆 Ringkasan Inti</h3><ul>${M5.ringkasan.map(r => `<li>${r}</li>`).join('')}</ul>
        <h4 class="sub">Cara mudah mengingat</h4>${M5.tips.map(t => `<div class="tip">💡 ${t}</div>`).join('')}</div>`,
    visual: `<div class="card vis"><h3>📈 Laboratorium Garis</h3><p class="kecil">Pilih topik, ubah angkanya, lalu lihat bagaimana rumusnya terbentuk.</p><div id="vis"></div></div>`,
    contoh: `<div class="card"><h3>🗺️ Peta Rahasia</h3><p class="kecil">Setiap contoh punya 3 bagian: konsep yang dipakai, langkah penyelesaian, dan jawaban akhir.</p></div>
      ${M5.contoh.map((c, i) => `<div class="card box"><div class="cx-head"><span class="cx-no">Contoh ${i + 1}</span><span class="cx-tag">${c.tag}</span></div>
        <div class="cx-soal">${c.q}</div><div class="cx-r">📌 <b>Konsep:</b> ${c.r}</div>
        ${c.l.map((x, n) => `<div class="lg"><span class="no">${n + 1}</span><div>${x}</div></div>`).join('')}
        <div class="cx-j">✅ <b>Jawaban:</b> ${c.j}</div></div>`).join('')}`,
    latihan: `<div class="card"><h3>⚔️ Arena Latihan</h3><p class="kecil">Tanpa batas waktu. Kalau salah, kamu boleh coba lagi atau langsung lihat pembahasan.</p><div id="latihan"></div></div>`,
    game: `<div class="card"><h3>🏰 Kuis Edukasi</h3><p class="kecil">Pilih jenis kuis. Tiap sesi 5 soal dengan batas waktu.</p><div id="game"></div></div>`
  }[L.k]
  $('isi').innerHTML = `<p><button class="btn alt" id="menu">☰ Peta petualangan</button></p>${judul}
    <p class="kecil" style="margin:2px 0 6px">Langkah ${k + 1} dari ${LANGKAH5.length}: <b>${L.t}</b> (${L.n})</p>
    <div class="prog"><span style="width:${(k + 1) * 100 / LANGKAH5.length}%"></span></div>
    <div style="margin-top:14px">${konten}</div>
    <div class="navlang">${k > 0 ? '<button class="btn alt" id="sblm">← Sebelumnya</button>' : '<span></span>'}<button class="btn" id="lanjut1">${akhir ? 'Selesai ✔' : 'Berikutnya →'}</button></div>`
  $('menu').onclick = () => bukaMateri5(m)
  if (k > 0) $('sblm').onclick = () => bukaMateri5(m, LANGKAH5[k - 1].k)
  $('lanjut1').onclick = () => akhir ? bukaMateri5(m) : bukaMateri5(m, LANGKAH5[k + 1].k)
  if (L.k === 'visual') visual5()
  if (L.k === 'latihan') latihan5()
  if (L.k === 'game') kuis5()
}

/* ---------- Latihan ---------- */
function latihan5() {
  const el = $('latihan'), Q = M5.soal; let i = 0, benar = 0, pertama = true
  const tampil = () => {
    const s = Q[i]; pertama = true
    el.innerHTML = `<p class="kecil">Soal ${i + 1} dari ${Q.length}</p><p><b>${s.q}</b></p>${s.o.map((t, n) => `<button class="opsi" data-n="${n}">${t}</button>`).join('')}<div id="fb"></div>`
    el.querySelectorAll('.opsi').forEach(b => b.onclick = () => jawab(b))
  }
  const lanjut = () => `<button class="btn" id="lj">${i + 1 < Q.length ? 'Soal berikutnya' : 'Lihat hasil'}</button>`
  const pasang = () => { $('lj').onclick = () => { i++; i < Q.length ? tampil() : selesai() } }
  const kunci = () => el.querySelectorAll('.opsi').forEach((b, x) => { b.disabled = true; if (x === Q[i].j) b.classList.add('benar') })
  const jawab = b => {
    const s = Q[i], n = +b.dataset.n
    if (n === s.j) {
      if (pertama) benar++
      kunci(); $('fb').innerHTML = `<div class="msg ok">Tepat sekali! 🎉</div><p>${s.p}</p>${lanjut()}`; return pasang()
    }
    pertama = false; b.disabled = true; b.classList.add('salah')
    $('fb').innerHTML = `<div class="msg err">Belum tepat. Mau apa sekarang?</div><p><button class="btn" id="ulang">🔁 Coba lagi</button> <button class="btn alt" id="lihat">📖 Lihat pembahasan</button></p>`
    $('ulang').onclick = () => { $('fb').innerHTML = '' }
    $('lihat').onclick = () => { kunci(); $('fb').innerHTML = `<div class="msg ok">Jawaban yang benar sudah ditandai hijau.</div><p>${s.p}</p>${lanjut()}`; pasang() }
  }
  const selesai = async () => {
    el.innerHTML = `<p><b>Kamu menjawab ${benar} dari ${Q.length} soal dengan benar di percobaan pertama.</b></p><div id="xp" class="kecil">Menyimpan progres...</div><button class="btn" id="lagi">Ulangi latihan</button>`
    $('lagi').onclick = () => { i = 0; benar = 0; tampil() }
    const { data, error } = await db.rpc('simpan_latihan', { m: 5, s: benar, t: Q.length })
    $('xp').textContent = error ? 'Progres belum tersimpan.' : `Progres tersimpan. Total XP kamu: ${data}.`
  }
  tampil()
}

/* ---------- Kuis edukasi: 4 jenis, 5 soal per sesi ---------- */
function kuis5() {
  const el = $('game'), qs = (sel, f) => $('kbody').querySelectorAll(sel).forEach(f)
  const MODE = {
    biasa: { n: 'Kuis Biasa', ik: '📝', w: 180, d: '5 soal pilihan ganda' },
    cocok: { n: 'Mencocokkan', ik: '🔗', w: 120, d: 'Pasangkan 5 soal dengan hasilnya' },
    puzzle: { n: 'Puzzle', ik: '🧩', w: 240, d: 'Susun langkah penyelesaian dari 5 soal' },
    cepat: { n: 'Hitung Cepat', ik: '⚡', w: 90, d: 'Ketik jawaban 5 soal secepatnya' }
  }
  const wkt = d => d >= 60 ? `${Math.floor(d / 60)} menit${d % 60 ? ' ' + d % 60 + ' detik' : ''}` : `${d} detik`
  const mm = d => `${Math.floor(d / 60)}:${String(d % 60).padStart(2, '0')}`
  let S = null
  const stop = () => clearInterval(window._kuisTimer)

  const menu = () => {
    stop()
    el.innerHTML = `<p class="kecil">Bank soal: <b>${fmt(TOTAL5)}</b> soal berbeda, dibuat dari angka-angka yang berganti. Tiap sesi berisi 5 soal dengan batas waktu. Di akhir kamu bisa melihat benar-salahnya beserta pembahasan, lalu main lagi dengan soal yang berbeda.</p>
      <div class="grid">${Object.entries(MODE).map(([k, m]) => `<div class="card materi"><div class="ikon">${m.ik}</div><h3>${m.n}</h3><p>${m.d}</p><p class="kecil">Waktu: ${wkt(m.w)}</p><button class="btn" data-m="${k}">Mulai</button></div>`).join('')}</div>`
    el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => mulai(b.dataset.m))
  }

  const mulai = mode => {
    const M = MODE[mode], lv = mode === 'cepat' || mode === 'cocok' ? [1, 1, 2, 2, 2] : [1, 1, 2, 2, 3]
    const fl = mode === 'cepat' ? f => f.int : mode === 'cocok' ? f => f.pair : () => true, soal = []
    lv.forEach(l => { for (let t = 0; t < 25; t++) { const x = tarik5(l, fl); if (mode !== 'cocok' || t === 24 || !soal.some(o => T(o.a) === T(x.a))) { soal.push(x); break } } })
    soal.forEach(x => {
      if (mode === 'biasa') x.p = pilihan5(x)
      if (mode === 'puzzle') { let p; do { p = acak(x.s.map((_, k) => k)) } while (p.every((v, k) => v === k)); x.perm = p }
    })
    S = { mode, soal, jwb: Array(5).fill(null), i: 0, cur: [], pasang: Array(5).fill(null), sel: null, R: acak([0, 1, 2, 3, 4]), akhir: Date.now() + M.w * 1000 }
    el.innerHTML = `<div class="kecil" style="display:flex;justify-content:space-between"><b>${M.ik} ${M.n}</b><span>⏱ <b id="tsisa">${mm(M.w)}</b></span></div><div class="prog"><span id="tbar" style="width:100%"></span></div><div id="kbody" style="margin-top:12px"></div>`
    stop(); window._kuisTimer = setInterval(tick, 500); tampil()
  }
  const tick = () => {
    if (!$('tsisa') || !S) return stop()
    const sisa = Math.max(0, Math.ceil((S.akhir - Date.now()) / 1000))
    $('tsisa').textContent = mm(sisa); $('tbar').style.width = (sisa / MODE[S.mode].w * 100) + '%'
    if (sisa <= 0) selesai(true)
  }
  const lanjut = () => { S.i++; S.i < 5 ? tampil() : selesai(false) }
  const tampil = () => ({ biasa: tBiasa, cepat: tCepat, puzzle: tPuzzle, cocok: tCocok })[S.mode]()

  const tBiasa = () => {
    const x = S.soal[S.i]
    $('kbody').innerHTML = `<p class="kecil">Soal ${S.i + 1} dari 5</p><div class="soalbesar">${x.q}</div><div class="pilgrid">${x.p.o.map((t, n) => `<button class="opsi" data-n="${n}">${t}</button>`).join('')}</div>`
    qs('.opsi', b => b.onclick = () => { S.jwb[S.i] = +b.dataset.n; lanjut() })
  }
  const tCepat = () => {
    const x = S.soal[S.i]
    $('kbody').innerHTML = `<p class="kecil">Soal ${S.i + 1} dari 5. Ketik jawabanmu lalu tekan Enter.</p><div class="soalbesar">${x.q}</div>
      <div style="display:flex;gap:8px"><input id="ans" inputmode="numeric" autocomplete="off" placeholder="Jawabanmu"><button class="btn" id="kirim">Jawab</button></div>`
    const kirim = () => { const v = $('ans').value.trim(); if (!v) return; S.jwb[S.i] = v; lanjut() }
    $('kirim').onclick = kirim; $('ans').onkeydown = e => { if (e.key === 'Enter') kirim() }; $('ans').focus()
  }
  const tPuzzle = () => {
    const x = S.soal[S.i], c = S.cur
    $('kbody').innerHTML = `<p class="kecil">Soal ${S.i + 1} dari 5. Susun langkah penyelesaian dengan urutan yang benar.</p><div class="soalbesar">${x.q}</div>
      ${x.s.map((_, k) => `<div class="slot"><b>${k + 1}.</b> ${c[k] !== undefined ? x.s[c[k]] : '<span class="kecil">pilih langkah ...</span>'}</div>`).join('')}
      <p class="kecil" style="margin-bottom:0">Pilih langkah berikutnya:</p>${x.perm.filter(k => !c.includes(k)).map(k => `<button class="opsi" data-k="${k}">${x.s[k]}</button>`).join('')}
      <p><button class="btn alt" id="undo" ${c.length ? '' : 'disabled'}>↩ Hapus langkah terakhir</button> <button class="btn" id="lj" ${c.length === x.s.length ? '' : 'disabled'}>${S.i < 4 ? 'Lanjut' : 'Selesai'}</button></p>`
    qs('[data-k]', b => b.onclick = () => { c.push(+b.dataset.k); tPuzzle() })
    $('undo').onclick = () => { c.pop(); tPuzzle() }
    $('lj').onclick = () => { S.jwb[S.i] = c.slice(); S.cur = []; lanjut() }
  }
  const tCocok = () => {
    const P = S.pasang, L = 'ABCDE'
    $('kbody').innerHTML = `<p class="kecil">Klik soal di kiri, lalu klik hasil yang cocok di kanan. Kamu boleh mengubah pasangan sebelum menekan Selesai.</p>
      <div class="cocok"><div>${S.soal.map((x, i) => `<button class="opsi ${S.sel === i ? 'pilih' : ''}" data-l="${i}">${i + 1}. ${x.e}${P[i] !== null ? `<b class="lbl">→ ${L[S.R.indexOf(P[i])]}</b>` : ''}</button>`).join('')}</div>
      <div>${S.R.map((id, j) => `<button class="opsi ${P.includes(id) ? 'terpakai' : ''}" data-r="${id}"><b>${L[j]}.</b> ${T(S.soal[id].a)}</button>`).join('')}</div></div>
      <p><button class="btn" id="cek" ${P.includes(null) ? 'disabled' : ''}>Selesai dan periksa</button></p>`
    qs('[data-l]', b => b.onclick = () => { S.sel = +b.dataset.l; tCocok() })
    qs('[data-r]', b => b.onclick = () => { if (S.sel === null) return; const id = +b.dataset.r; P.forEach((v, k) => { if (v === id) P[k] = null }); P[S.sel] = id; S.sel = null; tCocok() })
    $('cek').onclick = () => selesai(false)
  }

  const selesai = habis => {
    stop(); const M = MODE[S.mode], pakai = M.w - Math.max(0, Math.ceil((S.akhir - Date.now()) / 1000))
    if (S.mode === 'puzzle' && S.cur.length && S.jwb[S.i] == null) S.jwb[S.i] = S.cur
    const num = v => Number(String(v).replace(/[.\s]/g, '').replace(',', '.'))
    const R = S.soal.map((x, i) => {
      const j = S.jwb[i]; let ok, jw, bn, q = x.q
      if (S.mode === 'biasa') { ok = j === x.p.ok; jw = j == null ? null : x.p.o[j]; bn = x.p.o[x.p.ok] }
      else if (S.mode === 'cepat') { ok = j != null && num(j) === x.a; jw = j; bn = T(x.a) }
      else if (S.mode === 'puzzle') { ok = !!j && j.length === x.s.length && j.every((v, k) => v === k); jw = j && j.length ? j.map(v => x.s[v]).join(' → ') : null; bn = x.s.join(' → ') }
      else { const p = S.pasang[i]; ok = p === i; jw = p == null ? null : T(S.soal[p].a); bn = T(x.a); q = x.e }
      return { ok, jw, bn, q, x }
    })
    const benar = R.filter(r => r.ok).length
    el.innerHTML = `<h3>Hasil: ${benar} dari 5 soal benar ${benar === 5 ? '🎉' : ''}</h3>
      <p class="kecil">${habis ? '⏰ Waktu habis. ' : ''}Waktu terpakai: ${mm(pakai)} dari ${mm(M.w)}. Berikut penjelasan tiap soal:</p>
      ${R.map((r, i) => `<div class="rv ${r.ok ? 'b' : 's'}"><b>${r.ok ? '✅ Benar' : '❌ Salah'}</b> <span class="kecil">Soal ${i + 1}</span><div class="rq">${r.q}</div>
        <div class="kecil">Jawabanmu: ${r.jw == null ? '<i>belum dijawab</i>' : r.jw}</div>${r.ok ? '' : `<div class="kecil">Jawaban yang benar: <b>${r.bn}</b></div>`}
        <div class="pb"><b>Pembahasan:</b><ol>${r.x.s.map(t => `<li>${t}</li>`).join('')}</ol></div></div>`).join('')}
      <p><button class="btn" id="lagi">🔁 Kuis lagi (soal berbeda)</button> <button class="btn alt" id="pilih">☰ Pilih jenis kuis</button></p>`
    $('lagi').onclick = () => mulai(S.mode); $('pilih').onclick = menu
  }
  menu()
}

const _bukaSebelum5 = window.bukaMateri
window.bukaMateri = m => m.urutan === 5 ? bukaMateri5(m) : _bukaSebelum5(m)

/* Materi 6: Statistika (penjelasan, visual, ringkasan, contoh, latihan, kuis)
   Muat SETELAH Materi1.js dan materi.js (tidak membutuhkan materi2.js / materi5.js).
   Urutan di index.html: materi.js, materi1.js, ..., materi6.js */
const nf6 = v => String(Math.round(v * 100) / 100).replace('.', ',')
const srt6 = a => [...a].sort((x, y) => x - y)
const med6 = s => s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2
const kuar6 = s => { const n = s.length, h = Math.floor(n / 2), lo = s.slice(0, h), hi = s.slice(n - h); return { lo, hi, q1: med6(lo), q2: med6(s), q3: med6(hi) } }
const rn6 = seed => { let a = (seed * 2654435761 + 12345) >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296 } }

document.head.insertAdjacentHTML('beforeend', `<style>
  .svg6 { width:100%; max-width:420px; display:block; margin:8px auto; color:var(--ink) }
  .svg6 text { fill:currentColor; font:800 12px sans-serif; paint-order:stroke; stroke:var(--card,#fff); stroke-width:3px; stroke-linejoin:round }
  .svg6 text.sb { font:700 10px sans-serif; opacity:.75; stroke:none }
  .dc6 { display:inline-block; min-width:34px; text-align:center; padding:4px 7px; margin:3px; border-radius:9px; background:var(--soft); font-weight:800 }
  .dc6.md { background:#6c4cf1; color:#fff } .dc6.mo { background:#ff7a59; color:#fff } .dc6.q { background:#16a36a; color:#fff } .dc6.mm { background:#0ea5e9; color:#fff }
</style>`)

const M6 = {
  bagian: [
    ['A.1 Modus', ps('Halo, Petualang! Aku Detektif Data. Tugas kita hari ini: membaca "cerita" di balik sekumpulan angka.') + `
      <p><b>Data</b> adalah kumpulan keterangan, misalnya nilai ulangan, tinggi badan, atau ukuran sepatu. Untuk meringkas data, kita memakai satu nilai yang mewakili pusatnya. Ada tiga: <b>modus</b>, <b>median</b>, dan <b>rata-rata</b>.</p>
      <h4 class="sub">Modus = nilai yang paling sering muncul</h4>
      <p>Nilai ulangan 7 siswa: 7, 8, 8, 9, 6, 8, 7. Hitung kemunculannya: 6 muncul 1 kali, 7 muncul 2 kali, 8 muncul 3 kali, 9 muncul 1 kali. Jadi <b>modus = 8</b>.</p>
      <ul><li>Modus bisa <b>lebih dari satu</b>. Data 2, 3, 3, 5, 5, 6 punya dua modus: 3 dan 5.</li><li>Modus bisa <b>tidak ada</b>, kalau semua nilai muncul sama sering. Data 1, 2, 3, 4 tidak punya modus.</li><li>Modus juga dipakai untuk data bukan angka, misalnya warna favorit atau ukuran sepatu yang paling laku.</li></ul>
      <div class="tip">💡 Kata kunci modus: "paling banyak" atau "paling sering". Penjual sepatu memakai modus untuk menentukan ukuran yang harus paling banyak distok.</div>`, true],
    ['A.2 Median', `
      <p><b>Median</b> adalah nilai tengah data setelah data <b>diurutkan</b> dari yang terkecil sampai yang terbesar. Separuh data ada di bawahnya dan separuh lagi di atasnya.</p>
      <div class="tip">⚠️ Langkah pertama selalu: <b>urutkan dulu!</b> Nilai tengah dari data yang belum urut bukan median.</div>
      <h4 class="sub">a. Banyak data ganjil</h4>
      <div class="rumus">Median = data ke-${fr('n + 1', 2)}</div>
      <p>Data: 12, 7, 15, 9, 10, 8, 14 (n = 7). Diurutkan: 7, 8, 9, <b>10</b>, 12, 14, 15. Median = data ke-(7 + 1) ÷ 2 = data ke-4 = <b>10</b>.</p>
      <h4 class="sub">b. Banyak data genap</h4>
      <div class="rumus">Median = ${fr('data ke-n/2 + data ke-(n/2 + 1)', 2)}</div>
      <p>Data: 6, 2, 9, 4, 7, 5 (n = 6). Diurutkan: 2, 4, <b>5</b>, <b>6</b>, 7, 9. Dua data tengahnya adalah data ke-3 dan ke-4, yaitu 5 dan 6. Median = (5 + 6) ÷ 2 = <b>5,5</b>.</p>
      <h4 class="sub">c. Data acak yang heterogen</h4>
      <p>Data heterogen artinya nilainya sangat beragam dan urutannya acak, kadang ada nilai yang jauh sekali dari yang lain (disebut pencilan). Contoh: 12, 3, 8, 95, 7, 5, 9.</p>
      <p>Langkah: (1) urutkan menjadi 3, 5, 7, <b>8</b>, 9, 12, 95; (2) n = 7 (ganjil), jadi median = data ke-4 = <b>8</b>.</p>
      <p>Bandingkan dengan rata-rata: (12 + 3 + 8 + 95 + 7 + 5 + 9) ÷ 7 = 139 ÷ 7 ≈ 19,86. Rata-rata "tertarik" oleh angka 95, sedangkan median tetap 8. Jadi pada data dengan pencilan, median lebih mewakili.</p>`],
    ['A.3 Rata-rata (Mean)', `
      <div class="rumus">Rata-rata = ${fr('jumlah semua data', 'banyak data')}</div>
      <p>Nilai: 70, 80, 90, 85, 75. Jumlah = 400, banyak data = 5. Rata-rata = 400 ÷ 5 = <b>80</b>.</p>
      <h4 class="sub">Mencari data yang belum diketahui</h4>
      <p>Rata-rata 5 nilai ulangan adalah 80. Berapa nilai keenam supaya rata-rata 6 nilai menjadi 82?</p>
      <ol><li>Jumlah 5 nilai pertama = 80 × 5 = 400.</li><li>Jumlah 6 nilai yang diinginkan = 82 × 6 = 492.</li><li>Nilai keenam = 492 − 400 = <b>92</b>.</li></ol>
      <div class="rumus">Jumlah data = rata-rata × banyak data</div>
      <h4 class="sub">Kapan memakai yang mana?</h4>
      <ul><li><b>Rata-rata</b>: data tidak punya pencilan, dan semua nilai ingin diperhitungkan.</li><li><b>Median</b>: data punya pencilan atau sangat tidak seimbang, misalnya gaji atau harga rumah.</li><li><b>Modus</b>: mencari yang paling banyak atau paling laku, termasuk untuk data bukan angka.</li></ul>`]
  ],
  bagianB: [
    ['B.1 Jangkauan (Range)', `
      <p>Pemusatan data belum cukup. Dua kelas bisa sama-sama rata-rata 80, tetapi nilainya sangat berbeda: kelas A semua di sekitar 80, kelas B ada yang 40 dan ada yang 100. Karena itu kita juga perlu mengukur <b>penyebaran</b> data.</p>
      <div class="rumus">Jangkauan = data terbesar − data terkecil</div>
      <p>Data: 15, 22, 9, 31, 18, 27. Terbesar 31, terkecil 9. Jangkauan = 31 − 9 = <b>22</b>.</p>
      <div class="tip">💡 Makin besar jangkauan, makin menyebar datanya. Kekurangannya: jangkauan hanya melihat dua data, yaitu yang terkecil dan terbesar.</div>`],
    ['B.2 Kuartil', `
      <p><b>Kuartil</b> membagi data yang sudah urut menjadi <b>empat bagian sama banyak</b>. Ada tiga kuartil: <b>Q₁</b> (kuartil bawah), <b>Q₂</b> (kuartil tengah, sama dengan median), dan <b>Q₃</b> (kuartil atas).</p>
      <h4 class="sub">Langkah menentukan kuartil</h4>
      <ol><li>Urutkan data dari terkecil sampai terbesar.</li><li>Tentukan Q₂ = median seluruh data.</li><li>Pisahkan data menjadi kelompok bawah dan kelompok atas. Kalau banyak data ganjil, median (Q₂) <b>tidak dimasukkan</b> ke kedua kelompok.</li><li>Q₁ = median kelompok bawah. Q₃ = median kelompok atas.</li></ol>
      <h4 class="sub">a. Banyak data ganjil</h4>
      <p>Data: 9, 2, 12, 4, 8, 5, 7. Diurutkan: 2, 4, 5, <b>7</b>, 8, 9, 12. Q₂ = 7. Kelompok bawah: 2, 4, 5 → Q₁ = 4. Kelompok atas: 8, 9, 12 → Q₃ = 9.</p>
      <h4 class="sub">b. Banyak data genap</h4>
      <p>Data: 15, 3, 10, 6, 12, 4, 9, 7. Diurutkan: 3, 4, 6, 7, 9, 10, 12, 15. Q₂ = (7 + 9) ÷ 2 = 8. Kelompok bawah: 3, 4, 6, 7 → Q₁ = (4 + 6) ÷ 2 = 5. Kelompok atas: 9, 10, 12, 15 → Q₃ = (10 + 12) ÷ 2 = 11.</p>
      <div class="tip">💡 Coba semuanya di tab "Penyebaran Data" pada Laboratorium. Ubah datanya dan lihat kuartil serta diagram kotaknya berubah.</div>`],
    ['B.3 Jangkauan Kuartil dan Simpangan Kuartil', `
      <div class="rumus">Jangkauan kuartil: H = Q₃ − Q₁</div>
      <div class="rumus">Simpangan kuartil: Qd = ½ × (Q₃ − Q₁) = ½ × H</div>
      <p>Dari data genap sebelumnya, Q₁ = 5 dan Q₃ = 11. Maka H = 11 − 5 = <b>6</b> dan Qd = ½ × 6 = <b>3</b>.</p>
      <p>H menunjukkan seberapa lebar sebaran <b>50% data yang di tengah</b>. Karena nilai terkecil dan terbesar tidak ikut dihitung, H tidak terpengaruh pencilan, berbeda dengan jangkauan biasa.</p>
      <p>Contoh perbandingan: data 3, 5, 7, 8, 9, 12, 95 punya jangkauan 92, tetapi Q₁ = 5, Q₃ = 12, jadi H = 7. H menggambarkan sebaran data inti dengan lebih adil.</p>`]
  ],
  ringkasan: [
    'Modus: nilai yang paling sering muncul. Bisa lebih dari satu, atau tidak ada kalau semua muncul sama sering.',
    'Median: nilai tengah data yang SUDAH diurutkan. Ganjil: data ke-(n + 1)/2. Genap: rata-rata data ke-n/2 dan data ke-(n/2 + 1).',
    'Pada data acak dengan pencilan, urutkan dulu. Median tidak terpengaruh pencilan, rata-rata terpengaruh.',
    'Rata-rata = jumlah data ÷ banyak data. Jumlah data = rata-rata × banyak data.',
    'Jangkauan = data terbesar − data terkecil.',
    'Kuartil: Q₁ (median kelompok bawah), Q₂ (median), Q₃ (median kelompok atas). Pada data ganjil, median tidak masuk kelompok.',
    'Jangkauan kuartil: H = Q₃ − Q₁.',
    'Simpangan kuartil: Qd = ½ × (Q₃ − Q₁).'
  ],
  tips: ['Urutkan dulu sebelum mencari median dan kuartil. Ini kesalahan yang paling sering terjadi.', 'Pada banyak data genap, median adalah rata-rata dua data tengah, jadi hasilnya boleh berupa desimal.', 'Mencari data yang hilang: hitung dulu jumlah data lama dan jumlah data baru, lalu selisihkan.'],
  contoh: [
    { tag: 'Modus', r: 'Modus = nilai yang paling sering muncul', q: 'Nilai ulangan 7 siswa: 7, 8, 8, 9, 6, 8, 7. Tentukan modusnya.', l: ['Hitung kemunculan tiap nilai: 6 (1 kali), 7 (2 kali), 8 (3 kali), 9 (1 kali).', 'Nilai 8 muncul paling banyak, yaitu 3 kali.', 'Jadi modusnya 8.'], j: 'Modus = 8' },
    { tag: 'Modus lebih dari satu atau tidak ada', r: 'Modus bisa lebih dari satu, atau tidak ada', q: 'Tentukan modus dari (a) 2, 3, 3, 5, 5, 6 dan (b) 1, 2, 3, 4.', l: ['(a) 3 muncul 2 kali, 5 muncul 2 kali, sisanya 1 kali. Dua nilai sama-sama paling sering.', '(b) Semua nilai hanya muncul 1 kali, sama sering.', 'Jadi (a) modusnya 3 dan 5, sedangkan (b) tidak ada modus.'], j: '(a) 3 dan 5; (b) tidak ada modus' },
    { tag: 'Median: data ganjil', r: 'Urutkan, lalu ambil data ke-(n + 1)/2', q: 'Tentukan median dari 12, 7, 15, 9, 10, 8, 14.', l: ['Urutkan: 7, 8, 9, 10, 12, 14, 15.', 'n = 7 (ganjil), jadi median = data ke-(7 + 1) ÷ 2 = data ke-4.', 'Data ke-4 adalah 10.'], j: 'Median = 10' },
    { tag: 'Median: data genap', r: 'Rata-rata dua data tengah', q: 'Tentukan median dari 6, 2, 9, 4, 7, 5.', l: ['Urutkan: 2, 4, 5, 6, 7, 9.', 'n = 6 (genap). Dua data tengah adalah data ke-3 dan ke-4, yaitu 5 dan 6.', 'Median = (5 + 6) ÷ 2 = 5,5.'], j: 'Median = 5,5' },
    { tag: 'Median: data acak heterogen', r: 'Urutkan dulu; median tidak terpengaruh pencilan', q: 'Tentukan median dan rata-rata dari 12, 3, 8, 95, 7, 5, 9. Mana yang lebih mewakili data?', l: ['Urutkan: 3, 5, 7, 8, 9, 12, 95. n = 7, median = data ke-4 = 8.', 'Jumlah = 12 + 3 + 8 + 95 + 7 + 5 + 9 = 139, rata-rata = 139 ÷ 7 ≈ 19,86.', 'Angka 95 (pencilan) menarik rata-rata jauh ke atas, sedangkan sebagian besar data di sekitar 3 sampai 12. Median 8 lebih mewakili.'], j: 'Median = 8, rata-rata ≈ 19,86; median lebih mewakili' },
    { tag: 'Rata-rata', r: 'Rata-rata = jumlah data ÷ banyak data', q: 'Nilai lima siswa: 70, 80, 90, 85, 75. Hitung rata-ratanya.', l: ['Jumlah = 70 + 80 + 90 + 85 + 75 = 400.', 'Banyak data = 5.', 'Rata-rata = 400 ÷ 5 = 80.'], j: 'Rata-rata = 80' },
    { tag: 'Rata-rata dan data yang hilang', r: 'Jumlah data = rata-rata × banyak data', q: 'Rata-rata 5 nilai ulangan adalah 80. Berapa nilai keenam supaya rata-rata 6 nilai menjadi 82?', l: ['Jumlah 5 nilai = 80 × 5 = 400.', 'Jumlah 6 nilai yang diinginkan = 82 × 6 = 492.', 'Nilai keenam = 492 − 400 = 92.'], j: 'Nilai keenam = 92' },
    { tag: 'Jangkauan', r: 'Jangkauan = data terbesar − data terkecil', q: 'Tentukan jangkauan dari 15, 22, 9, 31, 18, 27.', l: ['Data terbesar = 31 dan data terkecil = 9.', 'Jangkauan = 31 − 9.', 'Jangkauan = 22.'], j: 'Jangkauan = 22' },
    { tag: 'Kuartil: data ganjil', r: 'Q₂ = median; Q₁ dan Q₃ = median kelompok bawah dan atas (median tidak ikut)', q: 'Tentukan Q₁, Q₂, dan Q₃ dari 9, 2, 12, 4, 8, 5, 7.', l: ['Urutkan: 2, 4, 5, 7, 8, 9, 12. Q₂ = data ke-4 = 7.', 'Kelompok bawah: 2, 4, 5 → Q₁ = 4. Kelompok atas: 8, 9, 12 → Q₃ = 9.', 'Median (7) tidak dimasukkan ke dalam kedua kelompok.'], j: 'Q₁ = 4, Q₂ = 7, Q₃ = 9' },
    { tag: 'Kuartil: data genap', r: 'Bagi dua kelompok sama banyak, lalu cari median tiap kelompok', q: 'Tentukan Q₁, Q₂, dan Q₃ dari 15, 3, 10, 6, 12, 4, 9, 7.', l: ['Urutkan: 3, 4, 6, 7, 9, 10, 12, 15. Q₂ = (7 + 9) ÷ 2 = 8.', 'Kelompok bawah 3, 4, 6, 7 → Q₁ = (4 + 6) ÷ 2 = 5.', 'Kelompok atas 9, 10, 12, 15 → Q₃ = (10 + 12) ÷ 2 = 11.'], j: 'Q₁ = 5, Q₂ = 8, Q₃ = 11' },
    { tag: 'Jangkauan dan simpangan kuartil', r: 'H = Q₃ − Q₁ dan Qd = ½ × H', q: 'Dari data pada contoh sebelumnya (Q₁ = 5 dan Q₃ = 11), tentukan jangkauan kuartil dan simpangan kuartil.', l: ['Jangkauan kuartil: H = Q₃ − Q₁ = 11 − 5 = 6.', 'Simpangan kuartil: Qd = ½ × H = ½ × 6.', 'Qd = 3.'], j: 'H = 6 dan Qd = 3' }
  ],
  soal: [
    { q: 'Modus dari data 4, 5, 5, 6, 7, 5, 8, 6 adalah ...', o: ['4', '5', '6', '8'], j: 1, p: 'Angka 5 muncul 3 kali, lebih sering daripada 6 (2 kali) dan yang lain (1 kali). Modusnya 5.' },
    { q: 'Median dari data 8, 3, 6, 9, 5 adalah ...', o: ['5', '6,2', '6', '9'], j: 2, p: 'Urutkan: 3, 5, 6, 8, 9. Data ke-3 adalah 6, jadi median = 6. (6,2 adalah rata-ratanya, bukan median.)' },
    { q: 'Median dari data 4, 9, 6, 2, 8, 7 adalah ...', o: ['6', '7', '6,5', '5,5'], j: 2, p: 'Urutkan: 2, 4, 6, 7, 8, 9. Dua data tengahnya 6 dan 7, jadi median = (6 + 7) ÷ 2 = 6,5.' },
    { q: 'Rata-rata dari data 6, 8, 10, 7, 9 adalah ...', o: ['7', '8', '9', '10'], j: 1, p: 'Jumlah = 6 + 8 + 10 + 7 + 9 = 40. Rata-rata = 40 ÷ 5 = 8.' },
    { q: 'Jangkauan dari data 12, 5, 20, 8, 15 adalah ...', o: ['12', '15', '20', '25'], j: 1, p: 'Jangkauan = terbesar − terkecil = 20 − 5 = 15.' },
    { q: 'Kuartil bawah (Q₁) dari data 3, 5, 6, 8, 9, 11, 14 adalah ...', o: ['5', '6', '8', '9'], j: 0, p: 'Median = 8 (data ke-4). Kelompok bawah: 3, 5, 6, sehingga Q₁ = 5.' },
    { q: 'Kuartil atas (Q₃) dari data 3, 5, 6, 8, 9, 11, 14 adalah ...', o: ['9', '11', '12', '14'], j: 1, p: 'Kelompok atas (tanpa median 8) adalah 9, 11, 14, sehingga Q₃ = 11.' },
    { q: 'Jangkauan kuartil dari data 2, 4, 5, 7, 8, 9, 12 adalah ...', o: ['3', '4', '5', '10'], j: 2, p: 'Q₁ = 4 dan Q₃ = 9, maka H = Q₃ − Q₁ = 9 − 4 = 5.' },
    { q: 'Jika Q₁ = 12 dan Q₃ = 20, simpangan kuartilnya adalah ...', o: ['4', '8', '16', '32'], j: 0, p: 'Qd = ½ × (Q₃ − Q₁) = ½ × (20 − 12) = ½ × 8 = 4.' },
    { q: 'Rata-rata 4 nilai adalah 75. Setelah ditambah satu nilai, rata-rata 5 nilai menjadi 77. Nilai yang ditambahkan adalah ...', o: ['77', '80', '85', '90'], j: 2, p: 'Jumlah 5 nilai = 77 × 5 = 385. Jumlah 4 nilai = 75 × 4 = 300. Nilai tambahan = 385 − 300 = 85.' }
  ]
}

const LANGKAH6 = [
  { k: 'belajar', ik: '📖', t: 'Perpustakaan Kuno', n: 'Penjelasan & Ringkasan', d: 'Pahami pemusatan dan penyebaran data', c1: '#ff7a59', c2: '#ffb347' },
  { k: 'visual', ik: '📊', t: 'Laboratorium Data', n: 'Visual Interaktif', d: 'Ubah data, lihat modus, median, kuartil', c1: '#6c4cf1', c2: '#a78bfa' },
  { k: 'contoh', ik: '🗺️', t: 'Peta Rahasia', n: 'Contoh Soal', d: 'Pembahasan langkah demi langkah', c1: '#16a36a', c2: '#5ed8a2' },
  { k: 'latihan', ik: '⚔️', t: 'Arena Latihan', n: 'Latihan Interaktif', d: 'Tanpa batas waktu, ada feedback', c1: '#0ea5e9', c2: '#6ee7f9' },
  { k: 'game', ik: '🏰', t: 'Istana Harta Karun', n: 'Kuis Edukasi', d: '4 jenis kuis, 5 soal per sesi', c1: '#ec4899', c2: '#f9a8d4' }
]

/* ---------- Visual interaktif ---------- */
function visual6() {
  const TB = [['p', '📊 Pemusatan Data'], ['s', '📦 Penyebaran Data']]
  const PRE = [[6, 8, 7, 9, 8, 5, 7, 8, 10], [4, 9, 6, 2, 8, 7], [3, 5, 2, 19, 4, 6, 3], [12, 7, 15, 9, 10, 8, 14, 11]]
  const S = { data: [...PRE[0]], add: 7, st: 1 }
  let tab = 'p'
  const chips = (a, cls) => a.map((v, i) => `<span class="dc6 ${cls(v, i) || ''}">${v}</span>`).join('')
  const midIdx = (off, n) => n % 2 ? [off + (n - 1) / 2] : [off + n / 2 - 1, off + n / 2]
  const gambar = () => {
    const d = S.data, s = srt6(d), n = s.length, sum = d.reduce((a, b) => a + b, 0), mean = sum / n, med = med6(s)
    const fq = {}; d.forEach(v => fq[v] = (fq[v] || 0) + 1)
    const maxf = Math.max(...Object.values(fq)), modes = Object.keys(fq).filter(k => fq[k] === maxf).map(Number).sort((a, b) => a - b), tidak = modes.length === Object.keys(fq).length
    const vmin = s[0], vmax = s[n - 1], medI = midIdx(0, n)
    let eq, isi, tip
    if (tab === 'p') {
      const k = vmax - vmin + 1, bw = 280 / k, vals = Array.from({ length: k }, (_, i) => vmin + i)
      eq = `<div class="besar" style="font-size:1.45rem;line-height:1.6"><span style="white-space:nowrap">Modus = ${tidak ? 'tidak ada' : modes.join(' dan ')}</span> · <span style="white-space:nowrap">Median = ${nf6(med)}</span> · <span style="white-space:nowrap">Rata-rata = ${nf6(mean)}</span></div><div class="kecil">Banyak data n = ${n}</div>`
      isi = `<p><b>Data acak:</b> ${d.join(', ')}</p><p><b>Diurutkan:</b><br>${chips(s, (v, i) => medI.includes(i) ? 'md' : (!tidak && modes.includes(v)) ? 'mo' : '')}</p>
        <p class="kecil">🟣 Nilai tengah (median). 🟠 Modus (paling sering muncul).</p>
        <svg class="svg6" viewBox="0 0 320 170" role="img" aria-label="Diagram frekuensi data"><line x1="20" y1="130" x2="310" y2="130" stroke="currentColor" stroke-width="1.8"/>
        ${vals.map((v, i) => { const f = fq[v] || 0, h = f / maxf * 90, x = 25 + i * bw; return `<rect x="${x + bw * .12}" y="${130 - h}" width="${bw * .76}" height="${h}" rx="3" fill="${f === maxf && !tidak ? '#ff7a59' : '#6c4cf1'}" opacity="${f ? 1 : 0}"/><text x="${x + bw / 2}" y="${126 - h}" text-anchor="middle" style="font-size:11px">${f || ''}</text><text class="sb" x="${x + bw / 2}" y="146" text-anchor="middle">${v}</text>` }).join('')}
        <text class="sb" x="165" y="164" text-anchor="middle">nilai data (angka di atas batang = frekuensi)</text></svg>
        <h4 class="sub">Langkah-langkahnya</h4><ol>
        <li><b>Modus:</b> ${tidak ? `tidak ada, karena semua nilai muncul sama sering (${maxf} kali).` : modes.length === 1 ? `nilai <b>${modes[0]}</b> muncul paling sering, yaitu ${maxf} kali.` : `ada lebih dari satu: <b>${modes.join(' dan ')}</b>, masing-masing muncul ${maxf} kali.`}</li>
        <li><b>Median:</b> setelah diurutkan, n = ${n} (${n % 2 ? 'ganjil' : 'genap'}). ${n % 2 ? `Median = data ke-${(n + 1) / 2} = <b>${med}</b>.` : `Median = rata-rata data ke-${n / 2} dan ke-${n / 2 + 1} = (${s[n / 2 - 1]} + ${s[n / 2]}) ÷ 2 = <b>${nf6(med)}</b>.`}</li>
        <li><b>Rata-rata:</b> jumlah = ${s.join(' + ')} = ${sum}. Rata-rata = ${sum} ÷ ${n} = <b>${nf6(mean)}</b>.</li></ol>`
      tip = 'Tambahkan nilai yang besar sekali (misalnya 20). Rata-rata bergeser jauh, sedangkan median hampir tidak berubah.'
    } else if (n < 4) {
      eq = '<div class="besar">Butuh minimal 4 data</div><div class="kecil">Kuartil baru bisa dihitung kalau data minimal 4.</div>'
      isi = `<p><b>Data saat ini:</b> ${d.join(', ')}</p>`
      tip = 'Tambahkan data lagi dengan tombol "Tambah data".'
    } else {
      const { lo, hi, q1, q2, q3 } = kuar6(s), h = Math.floor(n / 2), R = vmax - vmin, H = q3 - q1, Qd = H / 2, st = S.st, JML = 7
      const cw = Math.min(40, 336 / n), x0 = (360 - n * cw) / 2, xc = i => x0 + i * cw + cw / 2, fz = n > 10 ? 11 : 13
      const mid = (a, b) => (xc(a) + xc(b)) / 2
      const qI = (off, m) => m % 2 ? [off + (m - 1) / 2] : [off + m / 2 - 1, off + m / 2]
      const qX = (off, m) => { const k = qI(off, m); return k.length === 1 ? xc(k[0]) : mid(k[0], k[1]) }
      const xq1 = qX(0, h), xq2 = qX(0, n), xq3 = qX(n - h, h), mI = qI(0, n), lI = qI(0, h), uI = qI(n - h, h)
      const G = '#16a36a', P = '#6c4cf1', B = '#0ea5e9', O = '#ff7a59'
      const FIL = { n: ['var(--soft)', 'var(--line)', ''], b: [B, B, '#fff'], md: [P, P, '#fff'], g: [G + '33', G, ''], gd: [G, G, '#fff'] }
      const chip = (i, mode, op) => { const f = FIL[mode]; return `<g opacity="${op || 1}"><rect x="${x0 + i * cw + 2}" y="58" width="${cw - 4}" height="30" rx="7" style="fill:${f[0]};stroke:${f[1]};stroke-width:2"/><text x="${xc(i)}" y="78" text-anchor="middle" style="font-size:${fz}px;stroke:none${f[2] ? ';fill:' + f[2] : ''}">${s[i]}</text></g>` }
      const row = fn => s.map((_, i) => { const r = fn(i); return chip(i, r[0], r[1]) }).join('')
      const tl = (x, y, t, col) => { const w = t.length * 6.6; let a = 'middle', xx = x; if (x - w / 2 < 6) { a = 'start'; xx = 6 } else if (x + w / 2 > 354) { a = 'end'; xx = 354 } return `<text x="${xx}" y="${y}" text-anchor="${a}" style="fill:${col}">${t}</text>` }
      const tick = (x, col) => `<path d="M${x} 42V55m-4-4l4 5 4-5" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`
      const dv = (x, col) => `<line x1="${x}" y1="46" x2="${x}" y2="98" stroke="${col}" stroke-width="2.5" stroke-dasharray="5 4"/>`
      const br = (xa, xb, y, col, l1, l2) => `<path d="M${xa} ${y - 6}v6H${xb}v-6" fill="none" stroke="${col}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="${(xa + xb) / 2}" y="${y + 16}" text-anchor="middle" style="fill:${col};font-size:11px">${l1}</text>${l2 ? `<text x="${(xa + xb) / 2}" y="${y + 30}" text-anchor="middle" style="fill:${col};font-size:11px">${l2}</text>` : ''}`
      const svg = (inner, tinggi) => `<svg class="svg6" viewBox="0 0 360 ${tinggi || 200}" role="img" aria-label="Gambar langkah ${st}">${inner}</svg>`
      const medTxt = (a, m, v) => m % 2 ? `${nf6(v)}` : `(${a[Math.floor(a.length / 2) - 1]} + ${a[Math.floor(a.length / 2)]}) ÷ 2 = ${nf6(v)}`
      const rgb = (ar, m) => m % 2 ? `data ke-${(m + 1) / 2} dari kelompok = <b>${nf6(med6(ar))}</b>` : `(${ar[m / 2 - 1]} + ${ar[m / 2]}) ÷ 2 = <b>${nf6(med6(ar))}</b>`
      const judul = ['Urutkan data', 'Jangkauan', 'Q₂ (median)', 'Q₁ (kuartil bawah)', 'Q₃ (kuartil atas)', 'Jangkauan kuartil dan simpangan kuartil', 'Diagram kotak: semua hasil jadi satu gambar'][st - 1]
      let gb = '', jelas = '', tip2 = '', ekstra = ''
      if (st === 1) {
        gb = svg(`<path d="M${xc(0)} 40H${xc(n - 1)}m-7-6l7 6-7 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="180" y="28" text-anchor="middle" style="font-size:12px">dari kecil ke besar</text>${row(() => ['n'])}${s.map((_, i) => `<text class="sb" x="${xc(i)}" y="106" text-anchor="middle">${i + 1}</text>`).join('')}<text class="sb" x="180" y="124" text-anchor="middle">nomor urut data (data ke-1, ke-2, ...)</text>`, 140)
        jelas = `Data acak: ${d.join(', ')}.<br>Urutkan dari yang <b>terkecil</b> sampai <b>terbesar</b>: <b>${s.join(', ')}</b>.<br>Banyak data n = <b>${n}</b>. Semua langkah berikutnya memakai data yang sudah urut ini.`
        tip2 = 'Urutkan dulu. Median dan kuartil tidak bisa dicari dari data yang masih acak.'
      } else if (st === 2) {
        gb = svg(`${tl(xc(0), 36, 'terkecil', B)}${tick(xc(0), B)}${tl(xc(n - 1), 36, 'terbesar', B)}${tick(xc(n - 1), B)}${row(i => i === 0 || i === n - 1 ? ['b'] : ['n', .3])}${br(xc(0), xc(n - 1), 106, B, `Jangkauan = ${vmax} − ${vmin} = ${R}`)}`, 140)
        jelas = `Data terkecil = <b>${vmin}</b> (paling kiri) dan data terbesar = <b>${vmax}</b> (paling kanan).<br>Jangkauan = terbesar − terkecil = ${vmax} − ${vmin} = <b>${R}</b>.<br>Garis biru di gambar menunjukkan jarak dari data terkecil sampai data terbesar.`
        tip2 = 'Jangkauan hanya memakai dua data: yang terkecil dan yang terbesar.'
      } else if (st === 3) {
        gb = svg(`${tl(xq2, 36, 'Q₂ = ' + medTxt(s, n, q2), P)}${n % 2 ? tick(xq2, P) : dv(xq2, P)}${row(i => mI.includes(i) ? ['md'] : ['n'])}${br(xc(0), xc(h - 1), 106, G, 'kelompok', 'bawah')}${br(xc(n - h), xc(n - 1), 106, G, 'kelompok', 'atas')}${n % 2 ? `<path d="M${xq2} 94V146" stroke="${P}" stroke-width="2" stroke-dasharray="3 4"/><text x="${xq2}" y="160" text-anchor="middle" style="fill:${P};font-size:11px">median tidak ikut</text><text x="${xq2}" y="174" text-anchor="middle" style="fill:${P};font-size:11px">kelompok mana pun</text>` : ''}`, n % 2 ? 184 : 150)
        jelas = n % 2
          ? `Banyak data n = ${n} (<b>ganjil</b>), jadi median adalah data ke-${(n + 1) / 2}, yaitu <b>${nf6(q2)}</b> (kotak ungu). Itu <b>Q₂</b>.<br>Median membagi data menjadi dua kelompok sama banyak: <b>kelompok bawah</b> (${lo.join(', ')}) dan <b>kelompok atas</b> (${hi.join(', ')}). Karena n ganjil, median <b>tidak ikut</b> ke kelompok mana pun.`
          : `Banyak data n = ${n} (<b>genap</b>), jadi median adalah rata-rata dua data tengah, yaitu data ke-${n / 2} (${s[n / 2 - 1]}) dan data ke-${n / 2 + 1} (${s[n / 2]}): (${s[n / 2 - 1]} + ${s[n / 2]}) ÷ 2 = <b>${nf6(q2)}</b>. Itu <b>Q₂</b>.<br>Garis putus-putus ungu memisahkan data menjadi <b>kelompok bawah</b> (${lo.join(', ')}) dan <b>kelompok atas</b> (${hi.join(', ')}), masing-masing ${h} data.`
        tip2 = n % 2 ? 'Pada data ganjil, median tidak dimasukkan ke kelompok bawah maupun kelompok atas.' : 'Pada data genap, kedua kelompok langsung terpisah di tengah, tidak ada data yang dibuang.'
      } else if (st === 4 || st === 5) {
        const bawah = st === 4, ar = bawah ? lo : hi, kI = bawah ? lI : uI, qx = bawah ? xq1 : xq3, qv = bawah ? q1 : q3, nm = bawah ? 'bawah' : 'atas', qn = bawah ? 'Q₁' : 'Q₃', ina = i => bawah ? i < h : i >= n - h
        gb = svg(`${tl(qx, 36, qn + ' = ' + medTxt(ar, h, qv), G)}${h % 2 ? tick(qx, G) : dv(qx, G)}${row(i => ina(i) ? (kI.includes(i) ? ['gd'] : ['g']) : mI.includes(i) ? ['md', .3] : ['n', .3])}${br(bawah ? xc(0) : xc(n - h), bawah ? xc(h - 1) : xc(n - 1), 106, G, 'kelompok ' + nm, h % 2 ? 'median = data tengah' : 'median = rata-rata dua tengah')}`, 150)
        jelas = `<b>${qn}</b> adalah median kelompok ${nm}. Kelompok ${nm} (hijau) berisi ${h} data: ${ar.join(', ')}.<br>${h % 2 ? `Banyaknya ganjil, jadi mediannya adalah data yang paling tengah: <b>${nf6(qv)}</b>.` : `Banyaknya genap, jadi mediannya adalah rata-rata dua data tengah: (${ar[h / 2 - 1]} + ${ar[h / 2]}) ÷ 2 = <b>${nf6(qv)}</b>.`}<br>Jadi ${qn} = <b>${nf6(qv)}</b>.`
        tip2 = bawah ? 'Q₁ = median dari kelompok bawah saja, bukan median seluruh data.' : 'Q₃ = median dari kelompok atas saja, bukan median seluruh data.'
      } else if (st === 6) {
        const xm = (xq1 + xq3) / 2
        gb = svg(`${tl(xq1, 36, 'Q₁ = ' + nf6(q1), G)}${tl(xq3, 36, 'Q₃ = ' + nf6(q3), G)}${row(() => ['n', .25])}<line x1="${xq1}" y1="44" x2="${xq1}" y2="100" stroke="${G}" stroke-width="3"/><line x1="${xq3}" y1="44" x2="${xq3}" y2="100" stroke="${G}" stroke-width="3"/>${br(xq1, xq3, 112, G, 'H = Q₃ − Q₁', `= ${nf6(q3)} − ${nf6(q1)} = ${nf6(H)}`)}${br(xq1, xm, 162, O, 'Qd = ½ × H', `= ½ × ${nf6(H)} = ${nf6(Qd)}`)}`, 200)
        jelas = `<b>Jangkauan kuartil</b>: H = Q₃ − Q₁ = ${nf6(q3)} − ${nf6(q1)} = <b>${nf6(H)}</b>. Ini lebar sebaran 50% data yang di tengah (antara Q₁ dan Q₃).<br><b>Simpangan kuartil</b> adalah setengahnya: Qd = ½ × H = ½ × ${nf6(H)} = <b>${nf6(Qd)}</b>.`
        ekstra = '<p class="kecil">Panjang garis pada gambar ini hanya penanda posisi Q₁ dan Q₃. Nilai H dan Qd dihitung dari selisih angkanya.</p>'
        tip2 = 'Karena data terkecil dan terbesar tidak ikut dihitung, H tidak terpengaruh nilai yang ekstrem.'
      } else {
        const d0 = vmin - 1, d1 = vmax + 1, px = v => 20 + (v - d0) / (d1 - d0) * 320, stp = d1 - d0 > 14 ? 2 : 1, seen = {}
        const mx = Math.max(...s.map(v => s.filter(u => u === v).length)), gp = Math.min(9, 30 / Math.max(1, mx - 1)), rd = gp < 8 ? 2.8 : 3.8
        const dots = s.map(v => { seen[v] = (seen[v] || 0) + 1; return `<circle cx="${px(v)}" cy="${132 - (seen[v] - 1) * gp}" r="${rd}" fill="${P}" opacity=".6"/>` }).join('')
        gb = svg(`<line x1="${px(vmin)}" y1="60" x2="${px(q1)}" y2="60" stroke="currentColor" stroke-width="2.5"/><line x1="${px(q3)}" y1="60" x2="${px(vmax)}" y2="60" stroke="currentColor" stroke-width="2.5"/>
          <line x1="${px(vmin)}" y1="48" x2="${px(vmin)}" y2="72" stroke="${B}" stroke-width="4"/><line x1="${px(vmax)}" y1="48" x2="${px(vmax)}" y2="72" stroke="${B}" stroke-width="4"/>
          <rect x="${px(q1)}" y="40" width="${Math.max(2, px(q3) - px(q1))}" height="40" fill="${G}" opacity=".3" stroke="${G}" stroke-width="3"/><line x1="${px(q2)}" y1="40" x2="${px(q2)}" y2="80" stroke="${P}" stroke-width="4"/>
          <text x="${px(q1)}" y="32" text-anchor="middle" style="fill:${G}">Q₁ ${nf6(q1)}</text><text x="${px(q2)}" y="16" text-anchor="middle" style="fill:${P}">Q₂ ${nf6(q2)}</text><text x="${px(q3)}" y="32" text-anchor="middle" style="fill:${G}">Q₃ ${nf6(q3)}</text>
          <text x="${px(vmin)}" y="94" text-anchor="middle" style="fill:${B};font-size:11px">${vmin}</text><text x="${px(vmax)}" y="94" text-anchor="middle" style="fill:${B};font-size:11px">${vmax}</text>${dots}
          <line x1="14" y1="140" x2="346" y2="140" stroke="currentColor"/>${Array.from({ length: d1 - d0 + 1 }, (_, i) => d0 + i).filter((v, i) => i % stp === 0).map(v => `<line x1="${px(v)}" y1="136" x2="${px(v)}" y2="144" stroke="currentColor"/><text class="sb" x="${px(v)}" y="157" text-anchor="middle">${v}</text>`).join('')}
          ${br(px(q1), px(q3), 166, G, `H = ${nf6(H)}`)}${br(px(vmin), px(vmax), 196, B, `Jangkauan = ${R}`)}`, 232)
        jelas = `Semua hasil tadi digambar menjadi satu <b>diagram kotak</b>. Sumbu bawah adalah nilai data, jadi posisinya sesuai angkanya.`
        ekstra = `<ul><li>🔵 <b>Garis biru di kiri dan kanan</b>: data terkecil (${vmin}) dan data terbesar (${vmax}). Jaraknya = jangkauan = ${R}.</li><li>🟩 <b>Kotak hijau</b>: dari Q₁ (${nf6(q1)}) sampai Q₃ (${nf6(q3)}). Isinya 50% data yang di tengah, lebarnya = H = ${nf6(H)}. Simpangan kuartil Qd = ½ × ${nf6(H)} = ${nf6(Qd)}.</li><li>🟣 <b>Garis ungu di dalam kotak</b>: Q₂ = median = ${nf6(q2)}.</li><li>⚫ <b>Garis hitam</b>: dari data terkecil ke Q₁, dan dari Q₃ ke data terbesar.</li><li>🟣 <b>Titik-titik</b>: tiap data dari langkah 1 (data yang sama ditumpuk).</li></ul>`
        tip2 = 'Kotak hijau menunjukkan 50% data yang di tengah. Makin lebar kotaknya, makin besar H dan makin menyebar datanya.'
      }
      const hs = [`n = ${n}`]
      if (st >= 2) hs.push(`Jangkauan = ${R}`)
      if (st >= 3) hs.push(`Q₂ = ${nf6(q2)}`)
      if (st >= 4) hs.push(`Q₁ = ${nf6(q1)}`)
      if (st >= 5) hs.push(`Q₃ = ${nf6(q3)}`)
      if (st >= 6) hs.push(`H = ${nf6(H)}`, `Qd = ${nf6(Qd)}`)
      eq = `<div class="besar" style="font-size:1.35rem;line-height:1.7">${hs.map(p => `<span style="white-space:nowrap">${p}</span>`).join(' · ')}</div><div class="kecil">Hasil yang sudah dihitung sampai langkah ${st}</div>`
      isi = `<div class="tabsv" role="group" aria-label="Pilih langkah">${Array.from({ length: JML }, (_, i) => `<button data-st="${i + 1}" class="${i + 1 === st ? 'on' : ''}" aria-label="Langkah ${i + 1}">${i + 1}</button>`).join('')}</div>
        <h4 class="sub">Langkah ${st} dari ${JML}: ${judul}</h4>${gb}<p>${jelas}</p>${ekstra}
        <div class="pilih"><button class="btn alt" data-stp="-1" ${st === 1 ? 'disabled' : ''}>◀ Sebelumnya</button><button class="btn" data-stp="1" ${st === JML ? 'disabled' : ''}>Langkah berikutnya ▶</button></div>`
      tip = tip2
    }
    const ctl = `<label>Nilai yang ditambahkan <select data-k="add">${Array.from({ length: 20 }, (_, i) => `<option value="${i + 1}" ${i + 1 === S.add ? 'selected' : ''}>${i + 1}</option>`).join('')}</select></label>`
    const tombol = `<div class="pilih"><button class="btn" data-act="add" ${n >= 14 ? 'disabled' : ''}>➕ Tambah data</button><button class="btn alt" data-act="del" ${n <= 3 ? 'disabled' : ''}>↩ Hapus data terakhir</button></div><div class="pilih">${['Contoh 1', 'Contoh 2', 'Contoh 3', 'Contoh 4', '🎲 Acak'].map((t, i) => `<button class="btn alt" data-p="${i + 1}">${t}</button>`).join('')}</div>`
    $('vis').innerHTML = `<div class="tabsv">${TB.map(([k, nm]) => `<button data-t="${k}" class="${k === tab ? 'on' : ''}">${nm}</button>`).join('')}</div><div class="pilih">${ctl}</div>${tombol}<div class="hasil">${eq}</div><div style="margin:10px 0">${isi}</div><div class="tip">💡 ${tip}</div>`
    $('vis').querySelectorAll('[data-t]').forEach(x => x.onclick = () => { tab = x.dataset.t; S.st = 1; gambar() })
    $('vis').querySelectorAll('[data-st]').forEach(x => x.onclick = () => { S.st = +x.dataset.st; gambar() })
    $('vis').querySelectorAll('[data-stp]').forEach(x => x.onclick = () => { S.st = Math.max(1, Math.min(7, S.st + +x.dataset.stp)); gambar() })
    $('vis').querySelectorAll('select').forEach(x => x.onchange = () => { S.add = +x.value; })
    $('vis').querySelectorAll('[data-act]').forEach(x => x.onclick = () => { S.st = 1; if (x.dataset.act === 'add') { if (S.data.length < 14) S.data.push(S.add) } else if (S.data.length > 3) S.data.pop(); gambar() })
    $('vis').querySelectorAll('[data-p]').forEach(x => x.onclick = () => { S.st = 1; const i = +x.dataset.p; S.data = PRE[i - 1] ? [...PRE[i - 1]] : Array.from({ length: 6 + Math.floor(Math.random() * 6) }, () => 1 + Math.floor(Math.random() * 12)); gambar() })
  }
  gambar()
}

/* ---------- Bank soal kuis (dibangkitkan dari rumus) ---------- */
const Dt6 = a => a.join(', ')
const kocok6 = (a, R) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1));[b[i], b[j]] = [b[j], b[i]] } return b }
const naik6 = (R, n, lo, st) => { const a = []; let v = lo; for (let i = 0; i < n; i++) { v += 1 + Math.floor(R() * st); a.push(v) } return a }
const FAM6 = [
  { id: 'modus', n: 400, lv: 1, int: 1, pair: 1, mk: i => { const R = rn6(i + 11), ri = (a, b) => a + Math.floor(R() * (b - a + 1)), m = ri(2, 12), c = ri(3, 4), pool = [], cnt = {}
    for (let t = 0; t < 4; t++) { let v; do { v = ri(1, 14) } while (v === m || cnt[v] >= 2); cnt[v] = (cnt[v] || 0) + 1; pool.push(v) } for (let t = 0; t < ri(1, 2); t++) { let v; do { v = ri(1, 14) } while (v === m || (cnt[v] || 0) >= 2); cnt[v] = (cnt[v] || 0) + 1; pool.push(v) }
    const data = kocok6([...Array(c).fill(m), ...pool], R), f = data.filter(v => v === m).length
    return { e: `Modus: ${Dt6(data)}`, q: `Modus dari data ${Dt6(data)} adalah ...`, a: m, w: [pool[0], pool[1], m + 1], tip: 'Modus adalah nilai yang paling sering muncul.', s: [`Hitung kemunculan tiap nilai`, `Nilai ${m} muncul ${f} kali, paling banyak`, `Modus = ${m}`] } } },
  { id: 'medGanjil', n: 400, lv: 1, int: 1, pair: 1, mk: i => { const R = rn6(i + 23), n = [5, 7, 9][Math.floor(R() * 3)], s = naik6(R, n, 1, 4), data = kocok6(s, R), m = s[(n - 1) / 2]
    return { e: `Median: ${Dt6(data)}`, q: `Median dari data ${Dt6(data)} adalah ...`, a: m, w: [data[(n - 1) / 2], s[n - 1], s[(n - 3) / 2]], tip: 'Urutkan dulu, lalu ambil nilai yang di tengah.', s: [`Urutkan: ${Dt6(s)}`, `n = ${n} (ganjil), median = data ke-${(n + 1) / 2}`, `Median = ${m}`] } } },
  { id: 'rata', n: 400, lv: 1, int: 1, pair: 1, mk: i => { const R = rn6(i + 37), ri = (a, b) => a + Math.floor(R() * (b - a + 1)), n = ri(4, 6), M = ri(6, 16), dv = []
    for (let t = 0; t < n - 1; t++) dv.push(ri(-4, 4)); const data0 = dv.map(x => M + x); data0.push(M - dv.reduce((a, b) => a + b, 0)); const data = kocok6(data0, R), sm = M * n
    return { e: `Rata-rata: ${Dt6(data)}`, q: `Rata-rata dari data ${Dt6(data)} adalah ...`, a: M, w: [med6(srt6(data)), M + 1, M - 1], tip: 'Rata-rata = jumlah data ÷ banyak data.', s: [`Jumlah = ${data.join(' + ')} = ${sm}`, `Banyak data = ${n}`, `Rata-rata = ${sm} ÷ ${n} = ${M}`] } } },
  { id: 'jangkauan', n: 400, lv: 1, int: 1, pair: 1, mk: i => { const R = rn6(i + 41), n = 6 + Math.floor(R() * 4), s = naik6(R, n, 1, 6), data = kocok6(s, R), r = s[n - 1] - s[0]
    return { e: `Jangkauan: ${Dt6(data)}`, q: `Jangkauan dari data ${Dt6(data)} adalah ...`, a: r, w: [s[n - 1], s[0], s[n - 1] + s[0]], tip: 'Jangkauan = data terbesar − data terkecil.', s: [`Terbesar = ${s[n - 1]}, terkecil = ${s[0]}`, `Jangkauan = ${s[n - 1]} − ${s[0]}`, `Jangkauan = ${r}`] } } },
  { id: 'medGenap', n: 400, lv: 2, int: 1, pair: 1, mk: i => { const R = rn6(i + 53), n = [6, 8, 10][Math.floor(R() * 3)], s = naik6(R, n, 1, 4), a = s[n / 2 - 1]; if ((a + s[n / 2]) % 2) for (let t = n / 2; t < n; t++) s[t]++
    const b = s[n / 2], m = (a + b) / 2, data = kocok6(s, R)
    return { e: `Median: ${Dt6(data)}`, q: `Median dari data ${Dt6(data)} adalah ...`, a: m, w: [a, b, m + 1], tip: 'Banyak data genap: median = rata-rata dua data tengah.', s: [`Urutkan: ${Dt6(s)}`, `n = ${n} (genap), dua data tengah: ${a} dan ${b}`, `Median = (${a} + ${b}) ÷ 2 = ${m}`] } } },
  { id: 'rataBaru', n: 400, lv: 2, int: 1, pair: 1, mk: i => { const R = rn6(i + 67), ri = (a, b) => a + Math.floor(R() * (b - a + 1)), n = ri(4, 8), M = ri(60, 90), dd = ri(1, 4), x = M + dd * (n + 1)
    return { e: `${n} nilai rata-rata ${M} → ${M + dd}`, q: `Rata-rata ${n} nilai ulangan adalah ${M}. Agar rata-rata menjadi ${M + dd} setelah ditambah satu nilai, nilai yang ditambahkan harus ...`, a: x, w: [M + dd, M + dd * n, (n + 1) * dd], tip: 'Jumlah data = rata-rata × banyak data. Cari selisih jumlah baru dan jumlah lama.', s: [`Jumlah lama = ${M} × ${n} = ${M * n}`, `Jumlah baru = ${M + dd} × ${n + 1} = ${(M + dd) * (n + 1)}`, `Nilai tambahan = ${(M + dd) * (n + 1)} − ${M * n} = ${x}`] } } },
  { id: 'kuartil', n: 400, lv: 2, int: 1, pair: 1, mk: i => { const R = rn6(i + 79), n = [7, 11][Math.floor(R() * 2)], s = naik6(R, n, 1, 5), data = kocok6(s, R), { lo, hi, q1, q2, q3 } = kuar6(s), minta = Math.floor(R() * 2) ? 'atas (Q₃)' : 'bawah (Q₁)', a = minta === 'atas (Q₃)' ? q3 : q1, kel = minta === 'atas (Q₃)' ? hi : lo
    return { e: `Kuartil ${minta}: ${Dt6(data)}`, q: `Kuartil ${minta} dari data ${Dt6(data)} adalah ...`, a, w: [q2, a === q3 ? q1 : q3, s[0]], tip: 'Urutkan, cari median, pisahkan dua kelompok, lalu cari median tiap kelompok.', s: [`Urutkan: ${Dt6(s)}, Q₂ = ${q2}`, `Kelompok ${minta === 'atas (Q₃)' ? 'atas' : 'bawah'} (median tidak ikut): ${Dt6(kel)}`, `Mediannya = ${a}`] } } },
  { id: 'hKuartil', n: 400, lv: 3, int: 1, pair: 1, mk: i => { const R = rn6(i + 83), n = [7, 11][Math.floor(R() * 2)], s = naik6(R, n, 1, 5), data = kocok6(s, R), { q1, q3 } = kuar6(s), H = q3 - q1
    return { e: `H: ${Dt6(data)}`, q: `Jangkauan kuartil dari data ${Dt6(data)} adalah ...`, a: H, w: [q3, q1, s[n - 1] - s[0]], tip: 'Jangkauan kuartil H = Q₃ − Q₁.', s: [`Urutkan: ${Dt6(s)}`, `Q₁ = ${q1} dan Q₃ = ${q3}`, `H = ${q3} − ${q1} = ${H}`] } } },
  { id: 'qd', n: 400, lv: 3, int: 1, pair: 1, mk: i => { const R = rn6(i + 97), n = [7, 11][Math.floor(R() * 2)], s = naik6(R, n, 1, 5); let k = kuar6(s); if ((k.q3 - k.q1) % 2) { for (let t = n - Math.floor(n / 2); t < n; t++) s[t]++; k = kuar6(s) }
    const data = kocok6(s, R), H = k.q3 - k.q1, qd = H / 2
    return { e: `Qd: ${Dt6(data)}`, q: `Simpangan kuartil dari data ${Dt6(data)} adalah ...`, a: qd, w: [H, k.q3, k.q1], tip: 'Simpangan kuartil Qd = ½ × (Q₃ − Q₁).', s: [`Urutkan: ${Dt6(s)}`, `Q₁ = ${k.q1} dan Q₃ = ${k.q3}, H = ${H}`, `Qd = ½ × ${H} = ${qd}`] } } },
  { id: 'medDes', n: 400, lv: 3, pair: 1, mk: i => { const R = rn6(i + 101), n = [6, 8, 10][Math.floor(R() * 3)], s = naik6(R, n, 1, 4), a = s[n / 2 - 1]; if (!((a + s[n / 2]) % 2)) for (let t = n / 2; t < n; t++) s[t]++
    const b = s[n / 2], m = (a + b) / 2, data = kocok6(s, R)
    return { e: `Median: ${Dt6(data)}`, q: `Median dari data ${Dt6(data)} adalah ...`, a: nf6(m), w: [String(a), String(b), nf6(m + 1)], f: j => nf6(m + j + 1), tip: 'Banyak data genap: median = rata-rata dua data tengah, boleh berupa desimal.', s: [`Urutkan: ${Dt6(s)}`, `n = ${n}, dua data tengah: ${a} dan ${b}`, `Median = (${a} + ${b}) ÷ 2 = ${nf6(m)}`] } } }
]
const TOTAL6 = FAM6.reduce((t, f) => t + f.n, 0)
const sudah6 = new Set()

const bangun6 = (f, i) => { const x = f.mk(i); x.q = x.q || `${x.e} = ?`; x.fam = f.id; x.int = !!f.int; return x }
const tarik6 = (lv, fl) => {
  const c = FAM6.filter(f => f.lv === lv && fl(f)), pool = c.length ? c : FAM6.filter(fl)
  for (let t = 0; t < 40; t++) { const f = pool[Math.floor(Math.random() * pool.length)], i = Math.floor(Math.random() * f.n); if (!sudah6.has(f.id + ':' + i)) { sudah6.add(f.id + ':' + i); return bangun6(f, i) } }
  const f = pool[0]; return bangun6(f, Math.floor(Math.random() * f.n))
}
const pilihan6 = x => {
  const set = new Set([T(x.a)]); x.w.forEach(v => { if (typeof v !== 'number' || v > 0) set.add(T(v)) })
  let j = 1; while (set.size < 4) set.add(T(x.f ? x.f(j++) : x.a + j++ * 2))
  const o = acak(set); return { o, ok: o.indexOf(T(x.a)) }
}

/* ---------- Halaman materi (peta petualangan + 5 langkah) ---------- */
function bukaMateri6(m, aktif) {
  window.scrollTo(0, 0); clearInterval(window._kuisTimer)
  if (window.ingatPosisi) ingatPosisi({ tab: 'beranda', materi: 6, langkah: aktif || null })
  const k = LANGKAH6.findIndex(x => x.k === aktif), judul = `<h2>${aman(m.ikon)} ${aman(m.judul)}</h2>`
  if (k < 0) {
    const X = [30, 70, 30, 70, 30], Y = LANGKAH6.map((_, i) => 10 + i * 20)
    let d = `M${X[0]} ${Y[0]}`
    for (let i = 1; i < X.length; i++) { const ym = (Y[i - 1] + Y[i]) / 2; d += ` C${X[i - 1]} ${ym} ${X[i]} ${ym} ${X[i]} ${Y[i]}` }
    $('isi').innerHTML = `<p><button class="btn alt" id="kembali">← Kembali</button></p>${judul}
      <p class="kecil">🧭 Petualangan di Negeri Data. Pilih tempat yang ingin kamu kunjungi dulu, lalu ikuti jalurnya.</p>
      <div class="peta"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" class="jalur"/></svg>
        <span class="dek" style="left:3%;top:3%">☁️</span><span class="dek" style="right:4%;top:20%">⛰️</span><span class="dek" style="left:3%;top:40%">🌴</span>
        <span class="dek" style="right:3%;top:58%">☁️</span><span class="dek" style="left:4%;top:78%">⛰️</span><span class="dek" style="right:4%;top:93%">🌴</span>
        <span class="mulai">🏁 Mulai petualangan</span>
        ${LANGKAH6.map((x, i) => `<button class="nd" style="left:${X[i]}%;top:${Y[i]}%;--c1:${x.c1};--c2:${x.c2};--w:${i * .4}s" data-k="${x.k}" aria-label="${x.t}: ${x.n}">
          <span class="bola">${x.ik}<i class="no">${i + 1}</i></span><span class="lb"><b>${x.t}</b><small>${x.n}</small></span></button>`).join('')}</div>`
    $('kembali').onclick = () => tampilUtama(kelasNama)
    return $('isi').querySelectorAll('[data-k]').forEach(b => b.onclick = () => bukaMateri6(m, b.dataset.k))
  }
  const L = LANGKAH6[k], akhir = k === LANGKAH6.length - 1
  const konten = {
    belajar: `<div class="card"><h3>📖 Perpustakaan Kuno</h3><p class="kecil">Buka bagian satu per satu.</p>${[['A. Pemusatan Data', 'bagian'], ['B. Penyebaran Data', 'bagianB']].map(([g, k]) => `<h4 class="grp">${g}</h4>${det(M6[k])}`).join('')}</div>
      <div class="card box"><h3>🏆 Ringkasan Inti</h3><ul>${M6.ringkasan.map(r => `<li>${r}</li>`).join('')}</ul>
        <h4 class="sub">Cara mudah mengingat</h4>${M6.tips.map(t => `<div class="tip">💡 ${t}</div>`).join('')}</div>`,
    visual: `<div class="card vis"><h3>📊 Laboratorium Data</h3><p class="kecil">Pilih topik, ubah angkanya, lalu lihat bagaimana rumusnya terbentuk.</p><div id="vis"></div></div>`,
    contoh: `<div class="card"><h3>🗺️ Peta Rahasia</h3><p class="kecil">Setiap contoh punya 3 bagian: konsep yang dipakai, langkah penyelesaian, dan jawaban akhir.</p></div>
      ${M6.contoh.map((c, i) => `<div class="card box"><div class="cx-head"><span class="cx-no">Contoh ${i + 1}</span><span class="cx-tag">${c.tag}</span></div>
        <div class="cx-soal">${c.q}</div><div class="cx-r">📌 <b>Konsep:</b> ${c.r}</div>
        ${c.l.map((x, n) => `<div class="lg"><span class="no">${n + 1}</span><div>${x}</div></div>`).join('')}
        <div class="cx-j">✅ <b>Jawaban:</b> ${c.j}</div></div>`).join('')}`,
    latihan: `<div class="card"><h3>⚔️ Arena Latihan</h3><p class="kecil">Tanpa batas waktu. Kalau salah, kamu boleh coba lagi atau langsung lihat pembahasan.</p><div id="latihan"></div></div>`,
    game: `<div class="card"><h3>🏰 Kuis Edukasi</h3><p class="kecil">Pilih jenis kuis. Tiap sesi 5 soal dengan batas waktu.</p><div id="game"></div></div>`
  }[L.k]
  $('isi').innerHTML = `<p><button class="btn alt" id="menu">☰ Peta petualangan</button></p>${judul}
    <p class="kecil" style="margin:2px 0 6px">Langkah ${k + 1} dari ${LANGKAH6.length}: <b>${L.t}</b> (${L.n})</p>
    <div class="prog"><span style="width:${(k + 1) * 100 / LANGKAH6.length}%"></span></div>
    <div style="margin-top:14px">${konten}</div>
    <div class="navlang">${k > 0 ? '<button class="btn alt" id="sblm">← Sebelumnya</button>' : '<span></span>'}<button class="btn" id="lanjut1">${akhir ? 'Selesai ✔' : 'Berikutnya →'}</button></div>`
  $('menu').onclick = () => bukaMateri6(m)
  if (k > 0) $('sblm').onclick = () => bukaMateri6(m, LANGKAH6[k - 1].k)
  $('lanjut1').onclick = () => akhir ? bukaMateri6(m) : bukaMateri6(m, LANGKAH6[k + 1].k)
  if (L.k === 'visual') visual6()
  if (L.k === 'latihan') latihan6()
  if (L.k === 'game') kuis6()
}

/* ---------- Latihan ---------- */
function latihan6() {
  const el = $('latihan'), Q = M6.soal; let i = 0, benar = 0, pertama = true
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
    const { data, error } = await db.rpc('simpan_latihan', { m: 6, s: benar, t: Q.length })
    $('xp').textContent = error ? 'Progres belum tersimpan.' : `Progres tersimpan. Total XP kamu: ${data}.`
  }
  tampil()
}

/* ---------- Kuis edukasi: 4 jenis, 5 soal per sesi ---------- */
function kuis6() {
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
    el.innerHTML = `<p class="kecil">Bank soal: <b>${fmt(TOTAL6)}</b> soal berbeda, dibuat dari angka-angka yang berganti. Tiap sesi berisi 5 soal dengan batas waktu. Di akhir kamu bisa melihat benar-salahnya beserta pembahasan, lalu main lagi dengan soal yang berbeda.</p>
      <div class="grid">${Object.entries(MODE).map(([k, m]) => `<div class="card materi"><div class="ikon">${m.ik}</div><h3>${m.n}</h3><p>${m.d}</p><p class="kecil">Waktu: ${wkt(m.w)}</p><button class="btn" data-m="${k}">Mulai</button></div>`).join('')}</div>`
    el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => mulai(b.dataset.m))
  }

  const mulai = mode => {
    const M = MODE[mode], lv = mode === 'cepat' || mode === 'cocok' ? [1, 1, 2, 2, 2] : [1, 1, 2, 2, 3]
    const fl = mode === 'cepat' ? f => f.int : mode === 'cocok' ? f => f.pair : () => true, soal = []
    lv.forEach(l => { for (let t = 0; t < 25; t++) { const x = tarik6(l, fl); if (mode !== 'cocok' || t === 24 || !soal.some(o => T(o.a) === T(x.a))) { soal.push(x); break } } })
    soal.forEach(x => {
      if (mode === 'biasa') x.p = pilihan6(x)
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

const _bukaSebelum6 = window.bukaMateri
window.bukaMateri = m => m.urutan === 6 ? bukaMateri6(m) : _bukaSebelum6(m)

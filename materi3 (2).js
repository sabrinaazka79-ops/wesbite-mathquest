/* Materi 3: Persamaan dan Pertidaksamaan Linier Satu Variabel (lengkap: penjelasan, visual, ringkasan, contoh, latihan, kuis)
   Muat SETELAH Materi1.js dan Materi2.js (memakai helper dan gaya dari Materi1.js). */
const ang3 = v => v < 0 ? '−' + (-v) : String(v)
const T3 = v => typeof v === 'number' ? ang3(v) : String(v)
const gcd3 = (a, b) => b ? gcd3(b, a % b) : Math.abs(a)
const rng3 = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
const pc3 = (n, d) => `<span class="pc3"><i>${n}</i><i>${d}</i></span>`
const red3 = (n, d) => { const g = gcd3(n, d) || 1; n /= g; d /= g; if (d < 0) { n = -n; d = -d } return [n, d] }
const pec3 = (n, d) => { [n, d] = red3(n, d); return d === 1 ? ang3(n) : `${ang3(n)}/${d}` }
const bagi3 = (n, d) => { [n, d] = red3(n, d); return d === 1 ? ang3(n) : (n < 0 ? '−' : '') + pc3(Math.abs(n), d) }
const koef3 = a => a === 1 ? '' : a === -1 ? '−' : ang3(a)
const suku3 = (a, b) => `${koef3(a)}x${b === 0 ? '' : b < 0 ? ' − ' + (-b) : ' + ' + b}`
const PL3 = 'ax + b = c'

document.head.insertAdjacentHTML('beforeend', `<style>
  .svg3 { width:100%; max-width:400px; display:block; margin:8px auto; color:var(--ink) }
  .svg3 text { fill:currentColor; font:800 13px sans-serif; paint-order:stroke; stroke:var(--card,#fff); stroke-width:3.5px; stroke-linejoin:round }
  .svg3 text.sb { stroke:none; font:700 11px sans-serif; opacity:.7 }
  .pc3 { display:inline-flex; flex-direction:column; vertical-align:middle; text-align:center; line-height:1.2; margin:0 .2em }
  .pc3 > i { font-style:normal; padding:0 .25em }
  .pc3 > i:first-child { border-bottom:.09em solid currentColor }
  .chip3 { display:inline-block; margin:3px; padding:4px 9px; border-radius:10px; font-weight:700; font-size:.88rem }
  .chip3.y { background:#16a36a33 } .chip3.n { background:#ef444422 }
  .prin3 { text-align:center; padding:8px 12px; margin:6px 0; border-radius:12px; border:2px dashed #6c4cf1; background:#6c4cf11a; font-size:.92rem }
  .aksi3 { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin:8px 0 }
  .aksi3 .btn { margin:0 }
  .svgn3 { max-width:460px }
</style>`)

const M3 = {
  bagian: [
    ['A.1 Menentukan Kalimat Terbuka dan Tertutup', ps('Halo, Petualang! Aku Profesor Neraca. Hari ini kita belajar menjaga timbangan tetap seimbang dan mencari bilangan yang belum diketahui.') + `
      <p>Perhatikan tiga kalimat berikut: (1) 5 + 3 = 8, (2) 7 − 2 = 4, (3) x + 3 = 8. Kalimat (1) pasti benar dan kalimat (2) pasti salah. Kalimat (3) belum bisa dinilai karena kita belum tahu nilai x.</p>
      <h4 class="sub">Kalimat tertutup</h4>
      <p><b>Kalimat tertutup</b> adalah kalimat yang sudah pasti benar atau pasti salah (tidak mungkin keduanya). Contoh: "9 − 4 = 5" (benar), "3 × 4 = 11" (salah), "Segitiga memiliki 3 sisi" (benar), "Satu minggu ada 5 hari" (salah).</p>
      <h4 class="sub">Kalimat terbuka</h4>
      <p><b>Kalimat terbuka</b> adalah kalimat yang memuat <b>variabel</b> sehingga belum bisa ditentukan benar atau salahnya. Variabel adalah huruf (misalnya x, y, n) yang mewakili bilangan yang belum diketahui. Contoh: x + 3 = 8, 2y &lt; 10, n − 4 = 1.</p>
      <h4 class="sub">Mengubah kalimat terbuka menjadi tertutup</h4>
      <p>Ganti variabel dengan bilangan. Pada x + 3 = 8: kalau x = 5 maka 5 + 3 = 8 (benar), kalau x = 2 maka 2 + 3 = 8 (salah). Nilai variabel yang membuat kalimat terbuka menjadi <b>benar</b> disebut <b>penyelesaian</b>. Kumpulan semua penyelesaian disebut <b>himpunan penyelesaian</b>.</p>
      <div class="tip">💡 Kalimat tanya ("Berapa umurmu?") dan kalimat perintah ("Tutup pintu!") bukan kalimat terbuka maupun tertutup dalam matematika, karena tidak bisa dinilai benar atau salah.</div>`, true],
    ['A.2 Menemukan Bentuk Umum Persamaan Linier Satu Variabel', `
      <p>Kalimat terbuka yang memakai tanda sama dengan (=) disebut <b>persamaan</b>. Sebuah persamaan disebut <b>linier satu variabel (PLSV)</b> kalau variabelnya hanya satu jenis dan berpangkat satu.</p>
      <h4 class="sub">Periksa dulu, mana yang PLSV?</h4>
      <ul><li>2x + 3 = 11 → PLSV ✔ (satu variabel, pangkat 1, ada "=")</li><li>x² − 3 = 6 → bukan, x berpangkat 2</li><li>2x + y = 7 → bukan, ada dua variabel</li><li>4x + 1 → bukan persamaan, tidak ada tanda "="</li></ul>
      <h4 class="sub">Menemukan bentuk umumnya dari cerita</h4>
      <p>Umur Rina x tahun. Empat tahun lagi umurnya 15 tahun: x + 4 = 15. Tiga kali suatu bilangan dikurangi 5 hasilnya 16: 3x − 5 = 16. Dua kali suatu bilangan sama dengan 10: 2x = 10. Ketiganya punya pola yang sama:</p>
      <div class="rumus">${PL} &nbsp; (a ≠ 0)</div>
      <ul><li>x + 4 = 15 → a = 1, b = 4, c = 15</li><li>3x − 5 = 16 → a = 3, b = −5, c = 16</li><li>2x = 10 → a = 2, b = 0, c = 10</li></ul>
      <p><b>a</b> disebut koefisien x, sedangkan <b>b</b> dan <b>c</b> adalah konstanta. Syarat a ≠ 0 penting: kalau a = 0, variabelnya hilang dan yang tersisa hanya pernyataan bilangan biasa.</p>
      <div class="tip">⚠️ Persamaan seperti 5x + 3 = 2x + 18 (variabel di kedua ruas) tetap PLSV, karena bisa disederhanakan menjadi bentuk ${PL}. Caranya kita pelajari di bagian B.</div>`]
  ],
  bagianB: [
    ['B.1 Persamaan Ekuivalen dan Prinsip Neraca', `
      <p>Persamaan ibarat <b>neraca seimbang</b>. Ruas kiri dan ruas kanan harus selalu sama berat. Kalau satu sisi diberi perlakuan, sisi lainnya harus diberi perlakuan yang sama.</p>
      <p>Dua persamaan yang punya penyelesaian sama disebut <b>persamaan ekuivalen</b>. Persamaan ekuivalen diperoleh dengan:</p>
      <ul><li>menambah atau mengurangi kedua ruas dengan bilangan yang sama,</li><li>mengalikan atau membagi kedua ruas dengan bilangan yang sama, <b>bukan nol</b>.</li></ul>
      <p>Contoh: x + 3 = 8 ekuivalen dengan x = 5 (kedua ruas dikurangi 3). Tujuan kita selalu sama: membuat <b>x sendirian</b> di salah satu ruas.</p>`],
    ['B.2 Langkah Menyelesaikan PLSV', `
      <h4 class="sub">a. Bentuk x + p = q atau x − p = q</h4>
      <p>x + 7 = 12 → kurangi kedua ruas dengan 7 → x = 5. x − 4 = 9 → tambahkan 4 pada kedua ruas → x = 13. Lawan dari "+" adalah "−", dan sebaliknya.</p>
      <h4 class="sub">b. Bentuk ax = c</h4>
      <p>4x = 20 → bagi kedua ruas dengan 4 → x = 5. Untuk ${pc3('x', 3)} = 6, kalikan kedua ruas dengan 3 → x = 18.</p>
      <h4 class="sub">c. Bentuk ax + b = c</h4>
      <p>3x + 5 = 20. Kurangi 5: 3x = 15. Bagi 3: x = 5. Selalu <b>pindahkan konstanta dulu</b>, baru bagi dengan koefisien.</p>
      <h4 class="sub">d. Variabel di kedua ruas</h4>
      <p>5x + 3 = 2x + 18. Kurangi kedua ruas dengan 2x: 3x + 3 = 18. Kurangi 3: 3x = 15. Bagi 3: x = 5. Kumpulkan suku x di satu ruas, konstanta di ruas lain.</p>
      <h4 class="sub">e. Persamaan berbentuk pecahan</h4>
      <p>${pc3('x', 3)} + 2 = 6. Kurangi 2: ${pc3('x', 3)} = 4. Kalikan 3: x = 12. Kalau ada beberapa penyebut, kalikan semua suku dengan KPK penyebutnya.</p>
      <div class="tip">✅ Selalu periksa jawabanmu: masukkan nilai x ke persamaan awal. Kalau kedua ruas sama, jawabannya benar.</div>`],
    ['B.3 Model Matematika dan Soal Cerita', `
      <p>Banyak masalah sehari-hari bisa diselesaikan dengan PLSV. Langkahnya:</p>
      <ol><li><b>Misalkan</b> hal yang ditanyakan dengan x.</li><li><b>Buat model</b>: ubah kalimat cerita menjadi persamaan.</li><li><b>Selesaikan</b> persamaan.</li><li><b>Jawab</b> sesuai pertanyaan, lengkap dengan satuan, lalu cek apakah masuk akal.</li></ol>
      <p>Contoh: umur ayah 4 kali umur Dika dan jumlah umur mereka 45 tahun. Misalkan umur Dika = x, umur ayah = 4x. Model: x + 4x = 45, jadi 5x = 45 dan x = 9. Umur Dika 9 tahun, umur ayah 36 tahun.</p>
      <p>Contoh lain: keliling persegi panjang 38 cm, panjangnya 3 cm lebih dari lebarnya. Lebar = x, panjang = x + 3. Model: 2(x + 3 + x) = 38, jadi 4x + 6 = 38, 4x = 32, x = 8. Lebar 8 cm dan panjang 11 cm.</p>`]
  ],
  bagianC: [
    ['C.1 Dari Persamaan ke Pertidaksamaan', `
      <p>Tidak semua hal di dunia nyata "sama persis". Lift dibatasi <b>paling banyak</b> 500 kg, tiket konser <b>paling sedikit</b> Rp100.000, tinggi wahana <b>kurang dari</b> 150 cm. Hubungan seperti ini ditulis dengan <b>pertidaksamaan</b>.</p>
      <table class="tbl"><tr><th>Tanda</th><th>Dibaca</th><th>Kata kunci</th></tr>
        <tr><td>&lt;</td><td>kurang dari</td><td>kurang dari, di bawah</td></tr>
        <tr><td>&gt;</td><td>lebih dari</td><td>lebih dari, di atas</td></tr>
        <tr><td>≤</td><td>kurang dari atau sama dengan</td><td>paling banyak, maksimum, tidak lebih dari</td></tr>
        <tr><td>≥</td><td>lebih dari atau sama dengan</td><td>paling sedikit, minimum, tidak kurang dari</td></tr></table>
      <p>Pertidaksamaan linier satu variabel (PtLSV) adalah kalimat terbuka dengan satu variabel berpangkat satu yang dihubungkan tanda &lt;, &gt;, ≤, atau ≥. Contoh: 2x + 1 &lt; 9 dan 3x − 5 ≥ 7.</p>
      <div class="rumus">ax + b &lt; c &nbsp; (atau &gt;, ≤, ≥) &nbsp; dengan a ≠ 0</div>`],
    ['C.2 Menemukan Sifat-Sifat Pertidaksamaan', `
      <p>Mari kita temukan aturannya dari pertidaksamaan yang pasti benar: <b>2 &lt; 5</b>.</p>
      <ul><li><b>Ditambah 3</b>: 5 dan 8. Hasilnya 5 &lt; 8, tanda tetap.</li><li><b>Dikurangi 4</b>: −2 dan 1. Hasilnya −2 &lt; 1, tanda tetap.</li><li><b>Dikali 3</b> (positif): 6 dan 15. Hasilnya 6 &lt; 15, tanda tetap.</li><li><b>Dikali −1</b> (negatif): −2 dan −5. Sekarang −2 &gt; −5, <b>tanda berbalik!</b></li></ul>
      <div class="rumus">Dikali atau dibagi bilangan <b>negatif</b> → tanda pertidaksamaan <b>dibalik</b></div>
      <p>Jadi: menambah atau mengurangi kedua ruas dengan bilangan yang sama tidak mengubah tanda. Mengalikan atau membagi dengan bilangan positif juga tidak mengubah tanda. Tetapi mengalikan atau membagi dengan bilangan <b>negatif</b> membalik tanda: &lt; menjadi &gt;, ≤ menjadi ≥, dan sebaliknya.</p>
      <div class="tip">⚠️ Ini perbedaan terbesar antara persamaan dan pertidaksamaan. Pada persamaan, membagi −2 tidak mengubah apa-apa. Pada pertidaksamaan, tandanya berbalik.</div>`],
    ['C.3 Himpunan Penyelesaian dan Garis Bilangan', `
      <p>Pertidaksamaan biasanya punya <b>banyak</b> penyelesaian, bukan satu. Pada x &gt; 3, nilai x bisa 4, 5, 3,5, 100, dan seterusnya. Cara terbaik menggambarkannya adalah dengan <b>garis bilangan</b>:</p>
      <ul><li><b>Lingkaran kosong (○)</b> untuk tanda &lt; atau &gt;: nilai batas <b>tidak ikut</b>.</li><li><b>Lingkaran penuh (●)</b> untuk tanda ≤ atau ≥: nilai batas <b>ikut</b>.</li><li>Garis tebal mengarah ke <b>kanan</b> untuk &gt; dan ≥, ke <b>kiri</b> untuk &lt; dan ≤.</li></ul>
      <p>Contoh: x ≥ 2 digambar lingkaran penuh di 2 dan garis tebal ke kanan. x &lt; −1 digambar lingkaran kosong di −1 dan garis tebal ke kiri. Coba semuanya di Laboratorium Neraca pada langkah berikutnya.</p>`]
  ],
  bagianD: [
    ['D.1 Menyelesaikan Pertidaksamaan Linier Satu Variabel', `
      <p>Langkahnya sama seperti persamaan, dengan satu tambahan: <b>perhatikan tanda saat mengalikan atau membagi bilangan negatif</b>.</p>
      <h4 class="sub">a. Koefisien positif</h4>
      <p>3x − 4 &gt; 11 → 3x &gt; 15 → x &gt; 5. Tanda tetap karena dibagi 3 (positif).</p>
      <h4 class="sub">b. Koefisien negatif</h4>
      <p>−2x + 5 ≥ 13 → −2x ≥ 8 → bagi −2, tanda dibalik: x ≤ −4.</p>
      <h4 class="sub">c. Variabel di kedua ruas</h4>
      <p>4x − 7 &lt; x + 8 → 4x − x &lt; 8 + 7 → 3x &lt; 15 → x &lt; 5.</p>
      <div class="tip">✅ Cek dengan mengambil satu nilai uji. Pada x ≤ −4, coba x = −5: −2(−5) + 5 = 15 ≥ 13 ✔. Coba x = 0 (tidak termasuk): 5 ≥ 13 salah, sesuai.</div>`],
    ['D.2 Masalah Kontekstual dengan Pertidaksamaan', `
      <p>Kata kunci dalam cerita menentukan tandanya: <b>paling banyak / maksimum</b> → ≤, <b>paling sedikit / minimum</b> → ≥, <b>kurang dari</b> → &lt;, <b>lebih dari</b> → &gt;.</p>
      <p><b>Lift:</b> lift paling banyak mengangkat 500 kg. Budi (60 kg) membawa kotak masing-masing 25 kg. Model: 60 + 25x ≤ 500, jadi 25x ≤ 440 dan x ≤ 17,6. Karena banyak kotak bilangan bulat, paling banyak <b>17 kotak</b>.</p>
      <p><b>Tabungan:</b> Sinta punya Rp50.000 dan menabung Rp15.000 per minggu. Agar tabungannya paling sedikit Rp200.000: 50.000 + 15.000x ≥ 200.000, jadi 15.000x ≥ 150.000 dan x ≥ 10. Butuh paling sedikit <b>10 minggu</b>.</p>
      <ol><li>Misalkan hal yang ditanyakan dengan x.</li><li>Pilih tanda dari kata kunci, lalu susun model.</li><li>Selesaikan, ingat membalik tanda kalau membagi bilangan negatif.</li><li>Sesuaikan dengan konteks: banyak orang atau barang harus bilangan bulat.</li></ol>`],
    ['D.3 Menentukan Bilangan yang Memenuhi', `
      <p>Setelah mendapat himpunan penyelesaian, soal sering menanyakan bilangan tertentu.</p>
      <ul><li>2x − 3 &lt; 9 → x &lt; 6. <b>Bilangan asli</b> yang memenuhi: 1, 2, 3, 4, 5 (ada 5). <b>Bilangan bulat terbesar</b>: 5.</li><li>3x + 1 ≥ 10 → x ≥ 3. <b>Bilangan bulat terkecil</b>: 3.</li><li>2x &gt; 7 → x &gt; 3,5. <b>Bilangan bulat terkecil</b>: 4 (bukan 3,5 dan bukan 3).</li></ul>
      <div class="tip">💡 Perhatikan tanda batasnya. Pada x &lt; 6, angka 6 <b>tidak ikut</b>. Pada x ≤ 6, angka 6 ikut. Banyak kesalahan terjadi di sini.</div>`]
  ],
  ringkasan: [
    'Kalimat tertutup pasti benar atau salah. Kalimat terbuka memuat variabel. Nilai variabel yang membuat kalimat terbuka benar disebut penyelesaian.',
    `PLSV berbentuk ${PL} dengan a ≠ 0, variabel hanya satu dan berpangkat 1.`,
    'Persamaan ekuivalen diperoleh dengan menambah, mengurangi, mengalikan, atau membagi kedua ruas dengan bilangan sama (bukan nol untuk kali dan bagi).',
    'Langkah menyelesaikan: kumpulkan x di satu ruas dan konstanta di ruas lain, bagi dengan koefisien x, lalu periksa jawaban.',
    'Soal cerita: misalkan, buat model, selesaikan, jawab dengan satuan.',
    'Pertidaksamaan memakai tanda &lt;, &gt;, ≤, ≥ dengan bentuk umum ax + b &lt; c (atau &gt;, ≤, ≥), a ≠ 0.',
    'Tambah atau kurang kedua ruas: tanda tetap. Kali atau bagi bilangan positif: tanda tetap. Kali atau bagi bilangan <b>negatif</b>: tanda <b>dibalik</b>.',
    'Garis bilangan: lingkaran kosong untuk &lt; dan &gt;, lingkaran penuh untuk ≤ dan ≥.',
    'Kata kunci: paling banyak → ≤, paling sedikit → ≥, kurang dari → &lt;, lebih dari → &gt;.'
  ],
  tips: ['Pikirkan neraca: apa pun yang kamu lakukan di ruas kiri harus juga dilakukan di ruas kanan.', 'Pada pertidaksamaan, setiap kali kamu mengalikan atau membagi dengan bilangan negatif, langsung balik tandanya.', 'Selalu cek jawaban dengan mengganti x ke soal awal, dan pada pertidaksamaan coba satu nilai uji.'],
  contoh: [
    { tag: 'Kalimat terbuka dan tertutup', r: 'Kalimat tertutup bisa ditentukan benar atau salah. Kalimat terbuka memuat variabel.', q: 'Tentukan apakah kalimat berikut terbuka atau tertutup. Jika tertutup, tentukan benar atau salah: (a) 12 − 5 = 7, (b) 3 × 4 = 11, (c) y + 6 = 10.', l: ['(a) Tidak ada variabel dan 12 − 5 memang 7, jadi kalimat tertutup yang benar.', '(b) 3 × 4 = 12, bukan 11, jadi kalimat tertutup yang salah.', '(c) Memuat variabel y sehingga belum bisa dinilai, jadi kalimat terbuka.'], j: '(a) tertutup, benar; (b) tertutup, salah; (c) terbuka' },
    { tag: 'Nilai pengganti', r: 'Penyelesaian adalah nilai variabel yang membuat kalimat menjadi benar', q: 'Dari himpunan {1, 2, 3, 4, 5}, tentukan nilai x yang membuat 3x − 2 = 10 menjadi kalimat benar.', l: ['Coba x = 1, 2, 3: hasilnya 1, 4, 7. Semuanya bukan 10.', 'Coba x = 4: 3(4) − 2 = 12 − 2 = 10. Benar ✔.', 'Coba x = 5: 3(5) − 2 = 13, bukan 10.'], j: 'x = 4' },
    { tag: 'Bentuk umum PLSV', r: `${PL}, a ≠ 0, satu variabel berpangkat 1`, q: 'Manakah yang PLSV? (a) 5x − 8 = 12, (b) x² − 3 = 6, (c) 2x + y = 7, (d) 4x + 1. Untuk PLSV, tentukan a, b, dan c.', l: ['(a) Satu variabel, pangkat 1, ada tanda "=". Jadi PLSV dengan a = 5, b = −8, c = 12.', '(b) x berpangkat 2, bukan PLSV.', '(c) Ada dua variabel, bukan PLSV. (d) Tidak ada tanda "=", bukan persamaan.'], j: 'Hanya (a): a = 5, b = −8, c = 12' },
    { tag: 'Bentuk x − p = q', r: 'Lawan dari mengurangi 7 adalah menambah 7', q: 'Selesaikan x − 7 = 12.', l: ['Agar x sendirian, tambahkan 7 pada kedua ruas.', 'x − 7 + 7 = 12 + 7', 'x = 19. Periksa: 19 − 7 = 12 ✔.'], j: 'x = 19' },
    { tag: 'Bentuk ax = c', r: 'Bagi kedua ruas dengan koefisien x', q: 'Selesaikan −4x = 28.', l: ['Bagi kedua ruas dengan −4.', 'x = 28 ÷ (−4) = −7.', 'Periksa: −4 × (−7) = 28 ✔.'], j: 'x = −7' },
    { tag: 'Bentuk ax + b = c', r: 'Pindahkan konstanta dulu, lalu bagi dengan koefisien', q: 'Selesaikan 3x − 5 = 16.', l: ['Tambahkan 5 pada kedua ruas: 3x = 21.', 'Bagi kedua ruas dengan 3: x = 7.', 'Periksa: 3(7) − 5 = 16 ✔.'], j: 'x = 7' },
    { tag: 'Variabel di kedua ruas', r: 'Kumpulkan suku x di satu ruas dan konstanta di ruas lain', q: 'Selesaikan 5x + 3 = 2x + 18.', l: ['Kurangi kedua ruas dengan 2x: 3x + 3 = 18.', 'Kurangi kedua ruas dengan 3: 3x = 15.', 'Bagi dengan 3: x = 5. Periksa: 28 = 28 ✔.'], j: 'x = 5' },
    { tag: 'Persamaan pecahan', r: 'Kalikan kedua ruas dengan penyebut', q: `Selesaikan ${pc3('x', 3)} + 2 = 6.`, l: [`Kurangi kedua ruas dengan 2: ${pc3('x', 3)} = 4.`, 'Kalikan kedua ruas dengan 3.', 'x = 12. Periksa: 12 ÷ 3 + 2 = 6 ✔.'], j: 'x = 12' },
    { tag: 'Soal cerita persamaan', r: 'Misalkan, buat model, selesaikan, jawab', q: 'Panjang sebuah persegi panjang 3 cm lebihnya dari lebarnya. Jika kelilingnya 38 cm, tentukan panjang dan lebarnya.', l: ['Misalkan lebar = x, maka panjang = x + 3.', 'Keliling: 2(x + 3 + x) = 38, jadi 4x + 6 = 38 dan 4x = 32, sehingga x = 8.', 'Panjang = 8 + 3 = 11. Periksa: 2(11 + 8) = 38 ✔.'], j: 'Lebar 8 cm dan panjang 11 cm' },
    { tag: 'Pertidaksamaan, koefisien positif', r: 'Tanda tetap kalau dibagi bilangan positif', q: 'Tentukan penyelesaian 3x − 4 > 11 dan gambarkan pada garis bilangan.', l: ['Tambahkan 4: 3x > 15.', 'Bagi dengan 3 (positif, tanda tetap): x > 5.', 'Garis bilangan: lingkaran kosong di 5, garis tebal ke kanan.'], j: 'x > 5' },
    { tag: 'Pertidaksamaan, koefisien negatif', r: 'Dibagi bilangan negatif, tanda dibalik', q: 'Tentukan penyelesaian −2x + 5 ≥ 13.', l: ['Kurangi 5: −2x ≥ 8.', 'Bagi dengan −2 dan balik tandanya: x ≤ −4.', 'Garis bilangan: lingkaran penuh di −4, garis tebal ke kiri.'], j: 'x ≤ −4' },
    { tag: 'Variabel di kedua ruas', r: 'Kumpulkan suku x di satu ruas', q: 'Tentukan penyelesaian 4x − 7 < x + 8.', l: ['Kurangi kedua ruas dengan x: 3x − 7 < 8.', 'Tambahkan 7: 3x < 15.', 'Bagi dengan 3: x < 5.'], j: 'x < 5' },
    { tag: 'Soal cerita pertidaksamaan', r: '"Paling banyak" berarti ≤', q: 'Sebuah lift paling banyak mengangkat beban 500 kg. Budi (60 kg) membawa kotak yang masing-masing 25 kg. Berapa kotak paling banyak yang boleh dibawa?', l: ['Misalkan banyak kotak = x. Model: 60 + 25x ≤ 500.', '25x ≤ 440, sehingga x ≤ 17,6.', 'Banyak kotak harus bilangan bulat, jadi yang terbesar adalah 17.'], j: '17 kotak' }
  ],
  soal: [
    { q: 'Manakah yang merupakan kalimat terbuka?', o: ['8 − 3 = 5', 'x + 4 = 9', '3 × 4 = 11', 'Segitiga memiliki tiga sisi'], j: 1, p: 'Hanya x + 4 = 9 yang memuat variabel, sehingga belum bisa ditentukan benar atau salah.' },
    { q: 'Penyelesaian persamaan 3x − 4 = 11 adalah x = ...', o: ['3', '4', '5', '7'], j: 2, p: '3x = 11 + 4 = 15, sehingga x = 15 ÷ 3 = 5.' },
    { q: 'Manakah yang merupakan persamaan linier satu variabel?', o: ['x² + 2 = 11', '2x + y = 9', '5x − 3 = 12', '7x + 1'], j: 2, p: '5x − 3 = 12 punya satu variabel berpangkat 1 dan tanda "=". Pilihan lain berpangkat 2, dua variabel, atau tidak ada tanda "=".' },
    { q: 'Penyelesaian dari 5x + 3 = 2x + 18 adalah x = ...', o: ['3', '5', '7', '21'], j: 1, p: '5x − 2x = 18 − 3, jadi 3x = 15 dan x = 5.' },
    { q: 'Jika 2(x − 3) = 14, nilai x adalah ...', o: ['4', '7', '10', '17'], j: 2, p: '2x − 6 = 14, jadi 2x = 20 dan x = 10.' },
    { q: 'Penyelesaian pertidaksamaan 2x − 5 > 9 adalah ...', o: ['x > 2', 'x > 7', 'x < 7', 'x > 14'], j: 1, p: '2x > 14, dibagi 2 (positif) menjadi x > 7.' },
    { q: 'Penyelesaian pertidaksamaan −3x ≤ 12 adalah ...', o: ['x ≤ −4', 'x ≥ −4', 'x ≤ 4', 'x ≥ 4'], j: 1, p: 'Dibagi −3 (negatif) sehingga tanda dibalik: x ≥ −4.' },
    { q: 'Bilangan bulat terbesar yang memenuhi 4x − 3 < 17 adalah ...', o: ['3', '4', '5', '6'], j: 1, p: '4x < 20, jadi x < 5. Bilangan bulat terbesar yang kurang dari 5 adalah 4.' },
    { q: 'Sebuah lift paling banyak mengangkat 400 kg. Pak Dani (80 kg) membawa kardus masing-masing 20 kg. Banyak kardus paling banyak adalah ...', o: ['12', '15', '16', '20'], j: 2, p: '80 + 20x ≤ 400, jadi 20x ≤ 320 dan x ≤ 16.' },
    { q: 'Umur ayah 4 kali umur Dika. Jumlah umur mereka 45 tahun. Umur Dika adalah ... tahun.', o: ['5', '9', '11', '36'], j: 1, p: 'x + 4x = 45, jadi 5x = 45 dan x = 9.' }
  ]
}

const LANGKAH3 = [
  { k: 'belajar', ik: '📖', t: 'Perpustakaan Aljabar', n: 'Penjelasan & Ringkasan', d: 'Pahami konsep dan aturan pentingnya', c1: '#ff7a59', c2: '#ffb347' },
  { k: 'visual', ik: '⚖️', t: 'Laboratorium Neraca', n: 'Visual Interaktif', d: 'Lihat neraca, kalimat terbuka, dan garis bilangan', c1: '#6c4cf1', c2: '#a78bfa' },
  { k: 'contoh', ik: '🗺️', t: 'Peta Rahasia', n: 'Contoh Soal', d: 'Pembahasan langkah demi langkah', c1: '#16a36a', c2: '#5ed8a2' },
  { k: 'latihan', ik: '⚔️', t: 'Arena Latihan', n: 'Latihan Interaktif', d: 'Tanpa batas waktu, ada feedback', c1: '#0ea5e9', c2: '#6ee7f9' },
  { k: 'game', ik: '🏰', t: 'Istana Harta Karun', n: 'Kuis Edukasi', d: '4 jenis kuis, 5 soal per sesi', c1: '#ec4899', c2: '#f9a8d4' }
]

/* ---------- Visual interaktif ---------- */
function visual3() {
  const TB = [['k', '🔍 Kalimat Terbuka'], ['n', '⚖️ Neraca'], ['g', '📏 Garis Bilangan']]
  const N = { a: 2, b: 1, x: 4, op: 'kurang', num: 1, cur: null, hist: [], bad: null, msg: '', ok: true, hint: false, deg: 0, from: 0 }
  const S = { k: { a: 2, b: 3, c: 11, t: 3 }, n: N, g: { a: 2, b: -1, c: 7, op: 'gt' } }
  const pick0 = arr => arr[Math.floor(Math.random() * arr.length)]
  const eqN = ({ p, q, r }) => `${p === 1 ? '' : p}x${q ? ' + ' + q : ''} = ${r}`
  const seimbang = c => N.x * c.p + c.q === c.r
  const selesai = c => c.p === 1 && c.q === 0 && seimbang(c)
  const sisiTxt = { both: 'kedua sisi', left: 'ruas kiri saja', right: 'ruas kanan saja' }
  const aksiTxt = (op, n, sd) => op === 'kurang' ? `Kurangi ${n} dari ${sisiTxt[sd]}` : op === 'tambah' ? `Tambah ${n} pada ${sisiTxt[sd]}` : `Bagi ${sisiTxt[sd]} dengan ${n}`
  const saran = c => c.q > 0 ? { op: 'kurang', n: c.q, txt: `Ada ${c.q} blok angka 1 di ruas kiri. Hilangkan dengan: Kurangi ${c.q} dari kedua sisi.` } : c.p > 1 ? { op: 'bagi', n: c.p, txt: `Ada ${c.p} blok x. Bagi kedua sisi dengan ${c.p} supaya tersisa 1 blok x.` } : null
  const nAtur = () => { const s = saran(N.cur); if (s) { N.op = s.op; N.num = s.n } }
  const nMulai = () => {
    N.cur = { p: N.a, q: N.b, r: N.a * N.x + N.b }
    N.hist = [{ ...N.cur, txt: 'Persamaan awal' }]; N.bad = null; N.msg = ''; N.ok = true; N.hint = false; N.deg = 0; N.from = 0; nAtur()
  }
  const nTerap = (c, op, n, sd) => {
    let { p, q, r } = c; const kiri = sd !== 'right', kanan = sd !== 'left'
    if (op === 'kurang') {
      if (kiri && q < n) return `Di ruas kiri hanya ada ${q} blok angka 1, jadi belum bisa dikurangi ${n}. Blok x tidak bisa dikurangi dengan angka.`
      if (kanan && r < n) return `Blok di ruas kanan hanya ${r}, tidak cukup untuk dikurangi ${n}.`
      if (kiri) q -= n
      if (kanan) r -= n
    } else if (op === 'tambah') {
      if (kiri) q += n
      if (kanan) r += n
      if (p + q > 18) return 'Terlalu banyak blok di ruas kiri. Coba tindakan lain.'
    } else {
      if (kiri && (p % n || q % n)) return `Ruas kiri (${p}x dan ${q}) tidak habis dibagi ${n}. Coba bilangan lain.`
      if (kanan && r % n) return `Ruas kanan (${r}) tidak habis dibagi ${n}. Coba bilangan lain.`
      if (kiri) { p /= n; q /= n }
      if (kanan) r /= n
    }
    return { p, q, r }
  }
  const nSet = (k, val) => {
    if (k === 'a') { N.a = val; if (N.a === 1 && N.b === 0) N.b = 1; nMulai() }
    else if (k === 'b') { N.b = val; nMulai() }
    else if (k === 'c') { N.x = (val - N.b) / N.a; nMulai() }
    else if (k === 'op') { N.op = val; if (val === 'bagi' && N.num < 2) N.num = 2 }
    else if (k === 'num') N.num = val
  }
  const nAksi = sd => {
    const { op, num: n } = N, r = nTerap(N.cur, op, n, sd)
    if (typeof r === 'string') { N.msg = r; N.ok = false; return }
    N.hint = false; N.cur = r
    if (seimbang(r)) {
      const lama = N.hist[N.hist.length - 1]
      N.hist.push({ ...r, txt: aksiTxt(op, n, 'both') }); N.bad = null; N.deg = 0
      if (selesai(r)) { N.ok = true; N.msg = `🎉 Berhasil! Neraca seimbang dan x sudah sendirian: <b>x = ${r.r}</b>.` }
      else { N.ok = true; N.msg = (r.q < lama.q || r.p < lama.p) ? '✔ Timbangan tetap seimbang dan persamaannya jadi lebih sederhana.' : '✔ Timbangan tetap seimbang, tetapi x belum sendirian. Coba tindakan lain.'; nAtur() }
    } else {
      const d = N.x * r.p + r.q - r.r
      N.deg = Math.sign(d) * Math.min(14, 5 + Math.abs(d)); N.ok = false; N.bad = { op, n, sd }
      N.msg = `⚠️ <b>Timbangan tidak seimbang!</b> Kamu hanya mengubah ${sd === 'left' ? 'ruas kiri' : 'ruas kanan'}. Apa yang dilakukan di kiri, lakukan juga di kanan.`
    }
  }
  const nUndo = () => { const h = N.hist; if (N.bad) { N.cur = { ...h[h.length - 1] } } else if (h.length > 1) { h.pop(); N.cur = { ...h[h.length - 1] } } N.bad = null; N.deg = 0; N.msg = ''; N.ok = true; N.hint = false; nAtur() }
  const nFix = () => {
    const { op, n, sd } = N.bad, lain = sd === 'left' ? 'right' : 'left', r = nTerap(N.cur, op, n, lain)
    if (typeof r === 'string') { N.msg = r; N.ok = false; return }
    N.cur = r; N.hist.push({ ...r, txt: aksiTxt(op, n, 'both') }); N.bad = null; N.deg = 0; N.ok = true; N.hint = false
    N.msg = selesai(r) ? `🎉 Berhasil! x = <b>${r.r}</b>.` : '✔ Nah, kedua sisi dikerjakan sama, jadi timbangan seimbang lagi.'; nAtur()
  }
  const nSvg = deg => {
    const { p, q, r } = N.cur, rad = deg * Math.PI / 180, cx = 220, cy = 60, H = 160, W = 124, off = 120
    const ex = H * Math.cos(rad), ey = H * Math.sin(rad), lx = cx - ex, ly = cy + ey, rx = cx + ex, ry = cy - ey, pl = ly + off, pr = ry + off
    const n = p + q, s = n <= 8 ? 30 : n <= 14 ? 25 : 21, per = Math.max(1, Math.floor((W - 6) / (s + 3)))
    const items = [...Array(p).fill('x'), ...Array(q).fill('1')]
    const blk = items.map((t, i) => {
      const row = Math.floor(i / per), inRow = Math.min(per, n - row * per), w0 = inRow * (s + 3) - 3
      const X = lx - w0 / 2 + (i % per) * (s + 3), Y = pl - 3 - s - row * (s + 3), isx = t === 'x'
      return `<rect x="${X}" y="${Y}" width="${s}" height="${s}" rx="5" fill="${isx ? '#6c4cf155' : '#ff7a5955'}" stroke="${isx ? '#6c4cf1' : '#ff7a59'}" stroke-width="2"/><text x="${X + s / 2}" y="${Y + s / 2 + 5}" text-anchor="middle" style="font-size:${s > 24 ? 15 : 12}px">${t}</text>`
    }).join('')
    const tali = (X, Y, P) => `<path d="M${X} ${Y}L${X - W / 2} ${P}M${X} ${Y}L${X + W / 2} ${P}" stroke="currentColor" stroke-width="1.5" opacity=".5" fill="none"/><line x1="${X - W / 2}" y1="${P}" x2="${X + W / 2}" y2="${P}" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`
    return `<svg class="svg3 svgn3" viewBox="0 0 440 290" role="img" aria-label="Timbangan: ruas kiri ${eqN(N.cur).split(' = ')[0]}, ruas kanan ${r}${N.bad ? ', tidak seimbang' : ', seimbang'}">
      <polygon points="${cx},${cy} ${cx - 26},272 ${cx + 26},272" fill="currentColor" opacity=".15"/><line x1="170" y1="272" x2="270" y2="272" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
      <line x1="${lx}" y1="${ly}" x2="${rx}" y2="${ry}" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="8" fill="currentColor"/>
      ${tali(lx, ly, pl)}${tali(rx, ry, pr)}${blk}
      <rect x="${rx - 32}" y="${pr - 41}" width="64" height="38" rx="8" fill="#16a36a44" stroke="#16a36a" stroke-width="2"/><text x="${rx}" y="${pr - 16}" text-anchor="middle" style="font-size:18px">${r}</text>
      <text class="sb" x="${lx}" y="${pl + 20}" text-anchor="middle">ruas kiri</text><text class="sb" x="${rx}" y="${pr + 20}" text-anchor="middle">ruas kanan</text>
      ${N.bad ? `<text x="${cx}" y="22" text-anchor="middle" style="fill:#ef4444;font-size:15px">Timbangan tidak seimbang!</text>` : ''}</svg>`
  }
  let animId = 0
  const nAnim = (a, b) => {
    const id = ++animId, t0 = performance.now(), D = 600
    const f = t => { if (id !== animId || !$('nsvg')) return; const u = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - u, 3); $('nsvg').innerHTML = nSvg(a + (b - a) * e); if (u < 1) requestAnimationFrame(f) }
    requestAnimationFrame(f)
  }
  nMulai()
  const OPS = { lt: '&lt;', le: '≤', gt: '&gt;', ge: '≥' }, FL = { lt: 'gt', le: 'ge', gt: 'lt', ge: 'le' }
  const SAT = (l, op, r) => ({ lt: l < r, le: l <= r, gt: l > r, ge: l >= r })[op]
  const pil = (arr, sel, f) => arr.map(x => `<option value="${x}"${x === sel ? ' selected' : ''}>${f ? f(x) : ang3(x)}</option>`).join('')
  let tab = 'k'
  const gambar = () => {
    const v = S[tab]; let isi, eq, tip, ctl, pre = ''
    if (tab === 'k') {
      const { a, b, c, t } = v, kiri = a * t + b, ok = kiri === c, N = c - b
      ctl = [['a', 'a', pil(rng3(1, 5), a)], ['b', 'b', pil(rng3(-5, 9), b)], ['c', 'c', pil(rng3(0, 20), c)], ['t', 'Coba x =', pil(rng3(-3, 12), t)]]
      eq = `<div class="besar">${suku3(a, b)} = ${c}</div><div class="kecil">Kalimat terbuka: belum bisa dinilai benar atau salah.</div>`
      const par = t < 0 ? `(${ang3(t)})` : t
      isi = `<p>Ganti <b>x</b> dengan <b>${ang3(t)}</b>:</p><div class="besar">${a} × ${par}${b ? (b < 0 ? ' − ' : ' + ') + Math.abs(b) : ''} = ${ang3(kiri)}</div>
        <div class="msg ${ok ? 'ok' : 'err'}">${ang3(kiri)} ${ok ? '=' : '≠'} ${c}. Kalimat tertutup yang <b>${ok ? 'BENAR ✔' : 'SALAH ✘'}</b>, jadi x = ${ang3(t)} ${ok ? 'adalah penyelesaian' : 'bukan penyelesaian'}.</div>
        <p class="kecil">Hasil ruas kiri untuk beberapa nilai x:</p><div>${rng3(0, 6).map(z => { const h = a * z + b; return `<span class="chip3 ${h === c ? 'y' : 'n'}">x = ${z} → ${ang3(h)} ${h === c ? '✔' : '✘'}</span>` }).join('')}</div>
        <p>${N % a === 0 ? `Penyelesaian persamaan ini: <b>x = ${ang3(N / a)}</b>.` : `Penyelesaiannya <b>x = ${pec3(N, a)}</b>, bukan bilangan bulat.`}</p>`
      tip = 'Kalimat terbuka baru punya nilai kebenaran setelah variabelnya diganti bilangan. Pada PLSV, hanya satu nilai x yang membuatnya benar.'
    } else if (tab === 'n') {
      const cur = N.cur, c0 = N.a * N.x + N.b, done = selesai(cur), bad = !!N.bad
      const OPN = { kurang: '➖ Kurangi', tambah: '➕ Tambah', bagi: '➗ Bagi' }
      ctl = [['a', 'a (banyak x)', pil(rng3(1, 4), N.a)], ['b', 'b (konstanta)', pil(rng3(N.a === 1 ? 1 : 0, 6), N.b)], ['c', 'Hasil (ruas kanan)', pil(rng3(1, 9).map(z => N.a * z + N.b), c0)]]
      pre = `<div class="pilih"><button class="btn alt" data-nr="acak">🎲 Soal acak</button><button class="btn alt" data-nr="ulang">↻ Ulangi dari awal</button></div>`
      const kiriTxt = eqN(cur).split(' = ')[0]
      eq = `<div class="besar">${bad ? kiriTxt + ' ≠ ' + cur.r : eqN(cur)}</div><div class="kecil">${bad ? 'Timbangan miring, ini bukan persamaan yang seimbang.' : done ? 'x sudah sendirian di satu ruas.' : 'Tujuan: buat blok x sendirian di satu ruas, sambil menjaga timbangan tetap seimbang.'}</div>`
      const maxN = Math.max(12, cur.q, cur.p)
      const aksi = done ? '' : bad
        ? `<div class="aksi3"><button class="btn" data-nf>⚖️ Lakukan juga di ruas ${N.bad.sd === 'left' ? 'kanan' : 'kiri'}</button><button class="btn alt" data-nu>↩️ Batalkan</button></div>`
        : `<p class="kecil" style="text-align:center">Pilih tindakan dan bilangannya, lalu klik tombol di bawah.</p>
          <div class="pilih"><label>Tindakan <select data-k="op">${['kurang', 'tambah', 'bagi'].map(o => `<option value="${o}"${o === N.op ? ' selected' : ''}>${OPN[o]}</option>`).join('')}</select></label>
          <label>Bilangan <select data-k="num">${pil(rng3(N.op === 'bagi' ? 2 : 1, maxN), N.num)}</select></label></div>
          <div class="aksi3"><button class="btn" data-n="both">⚖️ ${aksiTxt(N.op, N.num, 'both')}</button><button class="btn alt" data-n="left">⬅️ ${aksiTxt(N.op, N.num, 'left')}</button><button class="btn alt" data-n="right">➡️ ${aksiTxt(N.op, N.num, 'right')}</button></div>
          <div class="aksi3"><button class="btn alt" data-nh>💡 Petunjuk</button>${N.hist.length > 1 ? '<button class="btn alt" data-nu>↩️ Mundur satu langkah</button>' : ''}</div>`
      const sr = saran(cur), hint = N.hint && !bad && !done && sr ? `<div class="tip">💡 ${sr.txt}</div>` : ''
      const msg = N.msg ? `<div class="msg ${N.ok ? 'ok' : 'err'}">${N.msg}</div>` : ''
      isi = `<div class="prin3">⚖️ <b>Prinsip neraca:</b> Apa yang dilakukan di kiri, lakukan juga di kanan.</div>
        <div id="nsvg">${nSvg(N.from)}</div>
        <p class="kecil" style="text-align:center">🟪 blok x = bilangan yang belum diketahui &nbsp; 🟧 blok 1 = angka 1 &nbsp; 🟩 blok hijau = angka di ruas kanan</p>
        ${msg}${hint}${aksi}
        <h4 class="sub">Langkah penyelesaian</h4><ol>${N.hist.map((h, i) => `<li>${i ? h.txt + ' → ' : 'Persamaan awal: '}<b>${eqN(h)}</b></li>`).join('')}${done ? `<li>Periksa: ${N.a} × ${cur.r}${N.b ? ' + ' + N.b : ''} = ${c0} ✔</li>` : ''}</ol>`
      tip = 'Neraca tetap seimbang kalau kedua sisi diberi perlakuan yang sama. Coba juga sengaja mengubah satu sisi saja, lalu lihat apa yang terjadi pada timbangan.'
    } else {
      const { a, b, c, op } = v, N = c - b, t = N / a, flip = a < 0, op2 = flip ? FL[op] : op
      const kanan = op2 === 'gt' || op2 === 'ge', strict = op2 === 'lt' || op2 === 'gt', px = z => 195 + 15 * z, X = px(t)
      const an = X < 55 ? 'start' : X > 335 ? 'end' : 'middle', end = kanan ? 382 : 8
      const bil = rng3(-12, 12).filter(z => SAT(a * z + b, op, c)), contoh = kanan ? bil.slice(0, 5) : bil.slice(-5)
      ctl = [['a', 'a', pil([-3, -2, -1, 1, 2, 3], a)], ['b', 'b', pil(rng3(-6, 6), b)], ['op', 'Tanda', pil(['lt', 'le', 'gt', 'ge'], op, k => OPS[k])], ['c', 'c', pil(rng3(-6, 6), c)]]
      pre = `<div class="pilih">${['Contoh biasa', 'Koefisien negatif', 'Pakai ≤', '🎲 Acak'].map((t, i) => `<button class="btn alt" data-p="${i}">${t}</button>`).join('')}</div>`
      eq = `<div class="besar">${suku3(a, b)} ${OPS[op]} ${ang3(c)}</div><div class="kecil">Penyelesaian: x ${OPS[op2]} ${pec3(N, a)}</div>`
      isi = `<svg class="svg3" viewBox="0 0 390 100" role="img" aria-label="Garis bilangan untuk x ${OPS[op2]} ${pec3(N, a)}">
        <line x1="8" y1="50" x2="382" y2="50" stroke="currentColor" stroke-width="2"/>
        ${rng3(-12, 12).map(z => `<line x1="${px(z)}" y1="44" x2="${px(z)}" y2="56" stroke="currentColor" opacity="${z === 0 ? 1 : .45}"/>${z % 2 === 0 ? `<text class="sb" x="${px(z)}" y="76" text-anchor="middle">${z}</text>` : ''}`).join('')}
        <line x1="${X}" y1="50" x2="${end}" y2="50" stroke="#6c4cf1" stroke-width="7" stroke-linecap="round"/>
        <polygon points="${kanan ? '388,50 378,44 378,56' : '2,50 12,44 12,56'}" fill="#6c4cf1"/>
        <circle cx="${X}" cy="50" r="7.5" fill="${strict ? 'var(--card,#fff)' : '#6c4cf1'}" stroke="#6c4cf1" stroke-width="3"/>
        <text x="${X}" y="26" text-anchor="${an}">x = ${pec3(N, a)}</text></svg>
        <p class="kecil">${strict ? '○ Lingkaran kosong: nilai batas tidak ikut.' : '● Lingkaran penuh: nilai batas ikut.'} Garis tebal mengarah ke ${kanan ? 'kanan' : 'kiri'}.</p>
        <h4 class="sub">Cara menyelesaikan, langkah demi langkah</h4><ol>
        <li>Mulai: <b>${suku3(a, b)} ${OPS[op]} ${ang3(c)}</b></li>
        ${b ? `<li>Pindahkan ${ang3(b)} ke ruas kanan: ${koef3(a)}x ${OPS[op]} ${ang3(c)} ${b < 0 ? '+' : '−'} ${Math.abs(b)} = <b>${ang3(N)}</b></li>` : ''}
        <li>Bagi kedua ruas dengan ${ang3(a)}. ${flip ? `<b>Karena pembaginya negatif, tanda DIBALIK</b> (${OPS[op]} menjadi ${OPS[op2]}).` : `Pembaginya positif, tanda tetap ${OPS[op]}.`} Hasilnya: <b>x ${OPS[op2]} ${bagi3(N, a)}</b></li></ol>
        <p class="kecil">Contoh bilangan bulat yang memenuhi: ${contoh.length ? (kanan ? contoh.map(ang3).join(', ') + ', ...' : '..., ' + contoh.map(ang3).join(', ')) : 'tidak ada pada rentang −12 sampai 12'}.</p>`
      tip = flip ? 'Perhatikan: a bernilai negatif, jadi saat membagi dengan a tanda pertidaksamaan berbalik. Ubah a menjadi positif dan lihat bedanya.' : 'Ubah a menjadi negatif (misalnya −2) dan perhatikan tanda serta arah garis tebal yang berbalik.'
    }
    $('vis').innerHTML = `<div class="tabsv">${TB.map(([k, nm]) => `<button data-t="${k}" class="${k === tab ? 'on' : ''}">${nm}</button>`).join('')}</div>
      <div class="pilih">${ctl.map(([k, l, o]) => `<label>${l} <select data-k="${k}">${o}</select></label>`).join('')}</div>
      ${pre}<div class="hasil">${eq}</div><div style="margin:10px 0">${isi}</div><div class="tip">💡 ${tip}</div>`
    $('vis').querySelectorAll('[data-t]').forEach(x => x.onclick = () => { tab = x.dataset.t; gambar() })
    $('vis').querySelectorAll('select').forEach(s => s.onchange = () => { const val = isNaN(+s.value) ? s.value : +s.value; if (tab === 'n') nSet(s.dataset.k, val); else v[s.dataset.k] = val; gambar() })
    if (tab === 'n') {
      const go = fn => { fn(); gambar() }
      $('vis').querySelectorAll('[data-n]').forEach(b => b.onclick = () => { N.from = N.deg; go(() => nAksi(b.dataset.n)) })
      $('vis').querySelectorAll('[data-nu]').forEach(b => b.onclick = () => { N.from = N.deg; go(nUndo) })
      $('vis').querySelectorAll('[data-nf]').forEach(b => b.onclick = () => { N.from = N.deg; go(nFix) })
      $('vis').querySelectorAll('[data-nh]').forEach(b => b.onclick = () => go(() => { N.hint = !N.hint; N.msg = '' }))
      $('vis').querySelectorAll('[data-nr]').forEach(b => b.onclick = () => go(() => {
        if (b.dataset.nr === 'acak') { N.a = pick0([1, 2, 3, 4]); N.b = pick0(rng3(N.a === 1 ? 1 : 0, 6)); N.x = pick0(rng3(1, 9)) }
        nMulai()
      }))
      if (N.from !== N.deg) { const a0 = N.from; N.from = N.deg; nAnim(a0, N.deg) }
    }
    const PJ = [{ a: 2, b: -1, c: 7, op: 'gt' }, { a: -2, b: 3, c: 9, op: 'lt' }, { a: 3, b: 2, c: -1, op: 'le' }]
    const pick = arr => arr[Math.floor(Math.random() * arr.length)]
    $('vis').querySelectorAll('[data-p]').forEach(b => b.onclick = () => { Object.assign(v, PJ[+b.dataset.p] || { a: pick([-3, -2, -1, 1, 2, 3]), b: pick(rng3(-6, 6)), c: pick(rng3(-6, 6)), op: pick(['lt', 'le', 'gt', 'ge']) }); gambar() })
  }
  gambar()
}

/* ---------- Bank soal kuis (dibangkitkan dari rumus) ---------- */
const KATA3 = ['', '', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh']
const FAM3 = [
  { id: 'tambah', n: 60, lv: 1, int: 1, pair: 1, mk: i => { const [x, y] = D(i, 10, 6), p = 2 + x, t = 1 + 2 * y, kur = (x + y) % 2, s = kur ? t + p : t, q = kur ? t : p + s, e = `x ${kur ? '−' : '+'} ${p} = ${q}`
    return { e, q: `Penyelesaian persamaan ${e} adalah x = ...`, a: s, w: [kur ? t - p : q + p, s + 1, s - 1], tip: kur ? 'Lawan dari mengurangi adalah menambah.' : 'Lawan dari menambah adalah mengurangi.', s: [e, `x = ${q} ${kur ? '+' : '−'} ${p}`, `x = ${s}`] } } },
  { id: 'kali', n: 72, lv: 1, int: 1, pair: 1, mk: i => { const [x, y] = D(i, 8, 9), a = 2 + x, s = 2 + y, bg = (x + y) % 3 === 0, c = a * s
    const e = bg ? `${pc3('x', a)} = ${s}` : `${a}x = ${c}`, h = bg ? c : s
    return { e, q: `Penyelesaian persamaan ${e} adalah x = ...`, a: h, w: bg ? [s, a + s, c + a] : [c, s + 1, a + s], tip: bg ? 'Kalikan kedua ruas dengan penyebutnya.' : 'Bagi kedua ruas dengan koefisien x.', s: bg ? [e, `x = ${s} × ${a}`, `x = ${h}`] : [e, `x = ${c} ÷ ${a}`, `x = ${h}`] } } },
  { id: 'dua', n: 336, lv: 2, int: 1, pair: 1, mk: i => { const [d0, d1, d2] = D(i, 7, 8, 6), a = 2 + d0, s = d1 - 2, b = ((d0 + d2) % 2 ? -1 : 1) * (1 + 2 * d2), c = a * s + b, e = `${suku3(a, b)} = ${ang3(c)}`
    return { e, q: `Penyelesaian persamaan ${e} adalah x = ...`, a: s, w: [s + 1, s - 1, c - b], tip: 'Pindahkan konstanta dulu, baru bagi dengan koefisien x.', s: [e, `${a}x = ${ang3(c)} ${b < 0 ? '+' : '−'} ${Math.abs(b)} = ${ang3(a * s)}`, `x = ${ang3(a * s)} ÷ ${a} = ${ang3(s)}`] } } },
  { id: 'bilangan', n: 144, lv: 2, int: 1, pair: 1, mk: i => { const [d0, d1, d2] = D(i, 6, 8, 3), a = 2 + d0, s = 2 + d1, p = 1 + d2, tb = (d0 + d1) % 2 === 0, q = tb ? a * s + p : a * s - p, e = `${a}x ${tb ? '+' : '−'} ${p} = ${q}`
    return { e, q: `${KATA3[a]} kali suatu bilangan ${tb ? 'ditambah' : 'dikurangi'} ${p} hasilnya ${q}. Bilangan tersebut adalah ...`, a: s, w: [s + 1, s - 1, a * s], tip: 'Misalkan bilangannya x, ubah cerita menjadi persamaan.', s: [`Model: ${e}`, `${a}x = ${q} ${tb ? '−' : '+'} ${p} = ${a * s}`, `x = ${a * s} ÷ ${a} = ${s}`] } } },
  { id: 'duaRuas', n: 180, lv: 3, int: 1, pair: 1, mk: i => { const [d0, d1, d2] = D(i, 5, 6, 6), p = 2 + d0, s = 1 + d1, c = 1 + d2 % 3, a = c + p, b = 2 + d2, d = b + p * s, e = `${a}x + ${b} = ${c}x + ${d}`
    return { e, q: `Penyelesaian persamaan ${e} adalah x = ...`, a: s, w: [s + 1, s - 1, d + b], tip: 'Kumpulkan suku x di satu ruas dan konstanta di ruas lain.', s: [`${a}x − ${c}x = ${d} − ${b}`, `${p}x = ${p * s}`, `x = ${p * s} ÷ ${p} = ${s}`] } } },
  { id: 'keliling', n: 60, lv: 3, int: 1, pair: 1, mk: i => { const [x, y] = D(i, 10, 6), s = 3 + x, p = 2 + y, K = 4 * s + 2 * p
    return { e: `keliling ${K}, panjang x + ${p}`, q: `Panjang sebuah persegi panjang (x + ${p}) cm dan lebarnya x cm. Jika kelilingnya ${K} cm, berapa nilai x?`, a: s, w: [s + 1, s - 1, 4 * s], tip: 'Keliling = 2 × (panjang + lebar).', s: [`2 × ((x + ${p}) + x) = ${K}`, `4x + ${2 * p} = ${K}, jadi 4x = ${K - 2 * p}`, `x = ${K - 2 * p} ÷ 4 = ${s}`] } } },
  { id: 'ptMin', n: 120, lv: 2, int: 1, pair: 1, mk: i => { const [d0, d1, d2] = D(i, 8, 5, 3), a = 2 + d0, t0 = 1 + 2 * d1, r = d2 % a, b = 1 + (d0 + d1) % 5, N = a * t0 - r, c = N + b, e = `${a}x + ${b} ≥ ${c}`
    return { e, q: `Bilangan bulat terkecil x yang memenuhi ${e} adalah ...`, a: t0, w: [t0 - 1, t0 + 1, N], tip: 'Selesaikan pertidaksamaannya, lalu cari bilangan bulat pertama yang memenuhi.', s: [`${a}x ≥ ${c} − ${b} = ${N}`, r ? `x ≥ ${pc3(N, a)}` : `x ≥ ${t0}`, `Bilangan bulat terkecil yang memenuhi adalah ${t0}`] } } },
  { id: 'ptKebalik', n: 240, lv: 2, mk: i => { const [d0, d1, d2] = D(i, 6, 8, 5), a = 2 + d0, B = d1 < 4 ? d1 - 4 : d1 - 3, b = 1 + d2, c = b - a * B, lt = (d0 + d2) % 2 === 1, o = lt ? '&lt;' : '≤', f = lt ? '&gt;' : '≥'
    return { e: '', q: `Penyelesaian pertidaksamaan ${suku3(-a, b)} ${o} ${ang3(c)} adalah ...`, a: `x ${f} ${ang3(B)}`, w: [`x ${o} ${ang3(B)}`, `x ${f} ${ang3(-B)}`, `x ${o} ${ang3(-B)}`], tip: 'Dibagi bilangan negatif, tanda pertidaksamaan dibalik.', s: [`${suku3(-a, b)} ${o} ${ang3(c)}`, `${ang3(-a)}x ${o} ${ang3(c)} − ${b} = ${ang3(c - b)}`, `Dibagi ${ang3(-a)} (negatif), tanda dibalik: x ${f} ${ang3(B)}`] } } },
  { id: 'ptBanyak', n: 168, lv: 3, int: 1, pair: 1, mk: i => { const [d0, d1, d2] = D(i, 7, 6, 4), a = 2 + d0, k = 3 + d1, r = 1 + d2 % (a - 1), b = 1 + (d0 + d2) % 5, M = a * k + r, c = M - b, e = `${a}x − ${b} &lt; ${c}`
    return { e, q: `Banyak bilangan asli x yang memenuhi ${e} adalah ...`, a: k, w: [k - 1, k + 1, k + 2], tip: 'Bilangan asli dimulai dari 1. Lihat apakah nilai batas ikut atau tidak.', s: [`${a}x &lt; ${c} + ${b} = ${M}`, `x &lt; ${pc3(M, a)} (nilainya antara ${k} dan ${k + 1})`, `Bilangan asli yang memenuhi: 1, 2, ..., ${k}. Banyaknya ${k}`] } } },
  { id: 'ptCerita', n: 168, lv: 3, int: 1, pair: 1, mk: i => { const [d0, d1, d2] = D(i, 6, 7, 4), q = 2 + d0, k = 3 + d1, p = 4 + 2 * d2, r = (d0 + d1) % q, M = p + q * k + r
    return { e: `taksi ${p}.000 + ${q}.000/km, uang ${M}.000`, q: `Tarif sebuah taksi Rp${p}.000 (tarif awal) ditambah Rp${q}.000 untuk setiap kilometer. Dengan uang Rp${M}.000, berapa kilometer (bilangan bulat) paling jauh yang dapat ditempuh?`, a: k, w: [k + 1, k - 1, M - p], tip: '"Dengan uang sebesar M" berarti biaya paling banyak M, jadi tandanya ≤.', s: [`${p} + ${q}x ≤ ${M} (dalam ribuan rupiah)`, `${q}x ≤ ${M} − ${p} = ${q * k + r}`, `x ≤ ${pc3(q * k + r, q)}, sehingga x bulat terbesar adalah ${k}`] } } }
]
const TOTAL3 = FAM3.reduce((t, f) => t + f.n, 0)
const sudah3 = new Set()
const bangun3 = (f, i) => { const x = f.mk(i); x.q = x.q || `${x.e} = ?`; x.fam = f.id; x.int = !!f.int; return x }
const tarik3 = (lv, fl) => {
  const c = FAM3.filter(f => f.lv === lv && fl(f)), pool = c.length ? c : FAM3.filter(fl)
  for (let t = 0; t < 40; t++) { const f = pool[Math.floor(Math.random() * pool.length)], i = Math.floor(Math.random() * f.n); if (!sudah3.has(f.id + ':' + i)) { sudah3.add(f.id + ':' + i); return bangun3(f, i) } }
  const f = pool[0]; return bangun3(f, Math.floor(Math.random() * f.n))
}
const pilihan3 = x => {
  const set = new Set([T3(x.a)]); x.w.forEach(v => set.add(T3(v)))
  let j = 1; while (set.size < 4) set.add(T3(x.a + 2 * j++))
  const o = acak(set); return { o, ok: o.indexOf(T3(x.a)) }
}

/* ---------- Halaman materi (peta petualangan + 5 langkah) ---------- */
function bukaMateri3(m, aktif) {
  window.scrollTo(0, 0); clearInterval(window._kuisTimer)
  if (window.ingatPosisi) ingatPosisi({ tab: 'beranda', materi: 3, langkah: aktif || null })
  const k = LANGKAH3.findIndex(x => x.k === aktif), judul = `<h2>${aman(m.ikon)} ${aman(m.judul)}</h2>`
  if (k < 0) {
    const X = [30, 70, 30, 70, 30], Y = LANGKAH3.map((_, i) => 10 + i * 20)
    let d = `M${X[0]} ${Y[0]}`
    for (let i = 1; i < X.length; i++) { const ym = (Y[i - 1] + Y[i]) / 2; d += ` C${X[i - 1]} ${ym} ${X[i]} ${ym} ${X[i]} ${Y[i]}` }
    $('isi').innerHTML = `<p><button class="btn alt" id="kembali">← Kembali</button></p>${judul}
      <p class="kecil">🧭 Petualangan di Negeri Neraca. Pilih tempat yang ingin kamu kunjungi dulu, lalu ikuti jalurnya.</p>
      <div class="peta"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" class="jalur"/></svg>
        <span class="dek" style="left:3%;top:3%">☁️</span><span class="dek" style="right:4%;top:20%">⛰️</span><span class="dek" style="left:3%;top:40%">🌴</span>
        <span class="dek" style="right:3%;top:58%">☁️</span><span class="dek" style="left:4%;top:78%">⛰️</span><span class="dek" style="right:4%;top:93%">🌴</span>
        <span class="mulai">🏁 Mulai petualangan</span>
        ${LANGKAH3.map((x, i) => `<button class="nd" style="left:${X[i]}%;top:${Y[i]}%;--c1:${x.c1};--c2:${x.c2};--w:${i * .4}s" data-k="${x.k}" aria-label="${x.t}: ${x.n}">
          <span class="bola">${x.ik}<i class="no">${i + 1}</i></span><span class="lb"><b>${x.t}</b><small>${x.n}</small></span></button>`).join('')}</div>`
    $('kembali').onclick = () => tampilUtama(kelasNama)
    return $('isi').querySelectorAll('[data-k]').forEach(b => b.onclick = () => bukaMateri3(m, b.dataset.k))
  }
  const L = LANGKAH3[k], akhir = k === LANGKAH3.length - 1
  const konten = {
    belajar: `<div class="card"><h3>📖 Perpustakaan Aljabar</h3><p class="kecil">Buka bagian satu per satu.</p>${[['A. Memahami Konsep Persamaan Linier Satu Variabel', 'bagian'], ['B. Menyelesaikan Persamaan Linier Satu Variabel', 'bagianB'], ['C. Menemukan Konsep Pertidaksamaan Linier Satu Variabel', 'bagianC'], ['D. Menyelesaikan Masalah terkait Pertidaksamaan Linier Satu Variabel', 'bagianD']].map(([g, k]) => `<h4 class="grp">${g}</h4>${det(M3[k])}`).join('')}</div>
      <div class="card box"><h3>🏆 Ringkasan Inti</h3><ul>${M3.ringkasan.map(r => `<li>${r}</li>`).join('')}</ul>
        <h4 class="sub">Cara mudah mengingat</h4>${M3.tips.map(t => `<div class="tip">💡 ${t}</div>`).join('')}</div>`,
    visual: `<div class="card vis"><h3>⚖️ Laboratorium Neraca</h3><p class="kecil">Pilih topik, ubah angkanya, lalu lihat bagaimana persamaan dan pertidaksamaan diselesaikan.</p><div id="vis"></div></div>`,
    contoh: `<div class="card"><h3>🗺️ Peta Rahasia</h3><p class="kecil">Setiap contoh punya 3 bagian: konsep yang dipakai, langkah penyelesaian, dan jawaban akhir.</p></div>
      ${M3.contoh.map((c, i) => `<div class="card box"><div class="cx-head"><span class="cx-no">Contoh ${i + 1}</span><span class="cx-tag">${c.tag}</span></div>
        <div class="cx-soal">${c.q}</div><div class="cx-r">📌 <b>Konsep:</b> ${c.r}</div>
        ${c.l.map((x, n) => `<div class="lg"><span class="no">${n + 1}</span><div>${x}</div></div>`).join('')}
        <div class="cx-j">✅ <b>Jawaban:</b> ${c.j}</div></div>`).join('')}`,
    latihan: `<div class="card"><h3>⚔️ Arena Latihan</h3><p class="kecil">Tanpa batas waktu. Kalau salah, kamu boleh coba lagi atau langsung lihat pembahasan.</p><div id="latihan"></div></div>`,
    game: `<div class="card"><h3>🏰 Kuis Edukasi</h3><p class="kecil">Pilih jenis kuis. Tiap sesi 5 soal dengan batas waktu.</p><div id="game"></div></div>`
  }[L.k]
  $('isi').innerHTML = `<p><button class="btn alt" id="menu">☰ Peta petualangan</button></p>${judul}
    <p class="kecil" style="margin:2px 0 6px">Langkah ${k + 1} dari ${LANGKAH3.length}: <b>${L.t}</b> (${L.n})</p>
    <div class="prog"><span style="width:${(k + 1) * 100 / LANGKAH3.length}%"></span></div>
    <div style="margin-top:14px">${konten}</div>
    <div class="navlang">${k > 0 ? '<button class="btn alt" id="sblm">← Sebelumnya</button>' : '<span></span>'}<button class="btn" id="lanjut1">${akhir ? 'Selesai ✔' : 'Berikutnya →'}</button></div>`
  $('menu').onclick = () => bukaMateri3(m)
  if (k > 0) $('sblm').onclick = () => bukaMateri3(m, LANGKAH3[k - 1].k)
  $('lanjut1').onclick = () => akhir ? bukaMateri3(m) : bukaMateri3(m, LANGKAH3[k + 1].k)
  if (L.k === 'visual') visual3()
  if (L.k === 'latihan') latihan3()
  if (L.k === 'game') kuis3()
}

/* ---------- Latihan ---------- */
function latihan3() {
  const el = $('latihan'), Q = M3.soal; let i = 0, benar = 0, pertama = true
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
    const { data, error } = await db.rpc('simpan_latihan', { m: 3, s: benar, t: Q.length })
    $('xp').textContent = error ? 'Progres belum tersimpan.' : `Progres tersimpan. Total XP kamu: ${data}.`
  }
  tampil()
}

/* ---------- Kuis edukasi: 4 jenis, 5 soal per sesi ---------- */
function kuis3() {
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
    el.innerHTML = `<p class="kecil">Bank soal: <b>${fmt(TOTAL3)}</b> soal berbeda, dibuat dari angka-angka yang berganti. Tiap sesi berisi 5 soal dengan batas waktu. Di akhir kamu bisa melihat benar-salahnya beserta pembahasan, lalu main lagi dengan soal yang berbeda.</p>
      <div class="grid">${Object.entries(MODE).map(([k, m]) => `<div class="card materi"><div class="ikon">${m.ik}</div><h3>${m.n}</h3><p>${m.d}</p><p class="kecil">Waktu: ${wkt(m.w)}</p><button class="btn" data-m="${k}">Mulai</button></div>`).join('')}</div>`
    el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => mulai(b.dataset.m))
  }

  const mulai = mode => {
    const M = MODE[mode], lv = mode === 'cepat' || mode === 'cocok' ? [1, 1, 2, 2, 2] : [1, 1, 2, 2, 3]
    const fl = mode === 'cepat' ? f => f.int : mode === 'cocok' ? f => f.pair : () => true, soal = []
    lv.forEach(l => { for (let t = 0; t < 25; t++) { const x = tarik3(l, fl); if (mode !== 'cocok' || t === 24 || !soal.some(o => T3(o.a) === T3(x.a))) { soal.push(x); break } } })
    soal.forEach(x => {
      if (mode === 'biasa') x.p = pilihan3(x)
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
    $('kbody').innerHTML = `<p class="kecil">Soal ${S.i + 1} dari 5. Ketik jawabanmu lalu tekan Enter. Untuk bilangan negatif, pakai tanda minus (-).</p><div class="soalbesar">${x.q}</div>
      <div style="display:flex;gap:8px"><input id="ans" inputmode="text" autocomplete="off" placeholder="Jawabanmu"><button class="btn" id="kirim">Jawab</button></div>`
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
      <div>${S.R.map((id, j) => `<button class="opsi ${P.includes(id) ? 'terpakai' : ''}" data-r="${id}"><b>${L[j]}.</b> ${T3(S.soal[id].a)}</button>`).join('')}</div></div>
      <p><button class="btn" id="cek" ${P.includes(null) ? 'disabled' : ''}>Selesai dan periksa</button></p>`
    qs('[data-l]', b => b.onclick = () => { S.sel = +b.dataset.l; tCocok() })
    qs('[data-r]', b => b.onclick = () => { if (S.sel === null) return; const id = +b.dataset.r; P.forEach((v, k) => { if (v === id) P[k] = null }); P[S.sel] = id; S.sel = null; tCocok() })
    $('cek').onclick = () => selesai(false)
  }

  const selesai = habis => {
    stop(); const M = MODE[S.mode], pakai = M.w - Math.max(0, Math.ceil((S.akhir - Date.now()) / 1000))
    if (S.mode === 'puzzle' && S.cur.length && S.jwb[S.i] == null) S.jwb[S.i] = S.cur
    const num = v => Number(String(v).replace(/[.\s]/g, '').replace(',', '.').replace('−', '-'))
    const R = S.soal.map((x, i) => {
      const j = S.jwb[i]; let ok, jw, bn, q = x.q
      if (S.mode === 'biasa') { ok = j === x.p.ok; jw = j == null ? null : x.p.o[j]; bn = x.p.o[x.p.ok] }
      else if (S.mode === 'cepat') { ok = j != null && num(j) === x.a; jw = j; bn = T3(x.a) }
      else if (S.mode === 'puzzle') { ok = !!j && j.length === x.s.length && j.every((v, k) => v === k); jw = j && j.length ? j.map(v => x.s[v]).join(' → ') : null; bn = x.s.join(' → ') }
      else { const p = S.pasang[i]; ok = p === i; jw = p == null ? null : T3(S.soal[p].a); bn = T3(x.a); q = x.e }
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

const _bukaSebelum3 = window.bukaMateri
window.bukaMateri = m => m.urutan === 3 ? bukaMateri3(m) : _bukaSebelum3(m)

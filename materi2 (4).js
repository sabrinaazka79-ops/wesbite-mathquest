/* Materi 2: Teorema Pythagoras (lengkap: penjelasan, visual, ringkasan, contoh, latihan, kuis)
   Muat SETELAH Materi1.js (memakai helper dan gaya dari Materi1.js). */
const kuad = x => sup(x, 2)
const PY = `${kuad('a')} + ${kuad('b')} = ${kuad('c')}`
const ak2 = (n, x) => `<span class="ak2"><span class="rad"></span><span class="ba2">${x}</span></span>`
const rt2 = (k, r) => (k === 1 ? '' : k) + ak2(2, r)
const tri = (a, b, c) => `<b>(${a}, ${b}, ${c})</b>`

document.head.insertAdjacentHTML('beforeend', `<style>
  .svgv { width:100%; max-width:390px; display:block; margin:8px auto; color:var(--ink) }
  .svgv text { fill:currentColor; font:800 13px sans-serif }
  .svgv text { paint-order:stroke; stroke:var(--card,#fff); stroke-width:3.5px; stroke-linejoin:round }
  .svgv text.sb { stroke:none; font:700 11px sans-serif; opacity:.7 }
  .luasbar { display:flex; align-items:center; gap:8px; margin:6px 0; font-weight:800 } .luasbar > span { min-width:96px }
  .luasbar .batang { flex:1; margin:0 }
  .ak2 { display:inline-block; position:relative; padding-left:.8em; white-space:nowrap; line-height:1.15; vertical-align:baseline; text-align:left }
  .ak2 .rad { position:absolute; left:0; top:0; bottom:-.12em; width:.85em; background:currentColor; -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 24' preserveAspectRatio='none'%3E%3Cpath d='M.6 15.2 2.6 13.6 5 21.6 9.6 1.4' fill='none' stroke='black' stroke-width='1.7' vector-effect='non-scaling-stroke' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat 0 0/100% 100%; mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 24' preserveAspectRatio='none'%3E%3Cpath d='M.6 15.2 2.6 13.6 5 21.6 9.6 1.4' fill='none' stroke='black' stroke-width='1.7' vector-effect='non-scaling-stroke' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat 0 0/100% 100% }
  .ak2 .ba2 { display:block; border-top:.085em solid currentColor; padding:.1em .14em 0 .04em }
</style>`)

const M2 = {
  bagian: [
    ['A.1 Menemukan Konsep Teorema Pythagoras', ps('Halo, Petualang! Aku Profesor Pythagoras. Hari ini kita temukan rahasia segitiga siku-siku.') + `
      <p>Segitiga siku-siku punya satu sudut 90°. Dua sisi yang membentuk sudut itu disebut <b>sisi siku-siku</b> (kita sebut a dan b). Sisi di depan sudut siku-siku disebut <b>hipotenusa</b> (c), dan selalu yang <b>terpanjang</b>.</p>
      <h4 class="sub">Menemukan konsepnya lewat luas persegi</h4>
      <p>Gambar persegi pada setiap sisi segitiga siku-siku 3, 4, 5. Persegi pada sisi 3 luasnya ${kuad(3)} = 9, pada sisi 4 luasnya ${kuad(4)} = 16, dan pada hipotenusa 5 luasnya ${kuad(5)} = 25. Perhatikan: 9 + 16 = 25! Luas dua persegi kecil jika digabung sama dengan luas persegi terbesar.</p>
      <div class="rumus">${PY}</div>
      <p>Itulah <b>Teorema Pythagoras</b>: pada segitiga siku-siku, kuadrat hipotenusa sama dengan jumlah kuadrat kedua sisi siku-sikunya. Coba dengan 6 dan 8: 36 + 64 = 100 = ${kuad(10)}.</p>
      <div class="rumus">c = ${ak2(2, 'a² + b²')} &nbsp; a = ${ak2(2, 'c² − b²')} &nbsp; b = ${ak2(2, 'c² − a²')}</div>
      <div class="tip">⚠️ Teorema ini hanya berlaku untuk segitiga <b>siku-siku</b>. Pastikan c adalah sisi di depan sudut 90°, bukan sembarang sisi.</div>`, true],
    ['A.2 Teorema Pythagoras pada Segitiga', `
      <p>Langkahnya: (1) cari sudut siku-siku, (2) tentukan hipotenusa, (3) pakai ${PY}.</p>
      <h4 class="sub">a. Segitiga siku-siku</h4>
      <p>Sisi siku-siku 9 cm dan 12 cm. Hipotenusa = ${ak2(2, '9² + 12²')} = ${ak2(2, '81 + 144')} = ${ak2(2, 225)} = 15 cm. Kalau yang dicari sisi siku-siku: hipotenusa 13 cm dan satu sisi 5 cm, maka sisi lainnya = ${ak2(2, '13² − 5²')} = ${ak2(2, '169 − 25')} = ${ak2(2, 144)} = 12 cm.</p>
      <h4 class="sub">b. Segitiga sama kaki (mencari tinggi)</h4>
      <p>Segitiga sama kaki beralas 10 cm dengan kaki 13 cm. Garis tinggi membagi alas menjadi dua sama panjang (5 cm), sehingga terbentuk segitiga siku-siku dengan hipotenusa 13 dan sisi 5. Tinggi = ${ak2(2, '13² − 5²')} = 12 cm. Luasnya = ½ × 10 × 12 = 60 cm².</p>`],
    ['A.3 Teorema Pythagoras pada Trapesium', `
      <p>Trapesium bukan segitiga, tetapi kita bisa <b>membuat segitiga siku-siku</b> di dalamnya dengan menarik garis tinggi.</p>
      <h4 class="sub">a. Trapesium sama kaki</h4>
      <p>Sisi sejajar 25 cm dan 15 cm, tinggi 12 cm. Tarik dua garis tinggi dari ujung sisi atas. Sisa alas (25 − 15) = 10 cm terbagi sama di kiri dan kanan, masing-masing 5 cm. Kaki trapesium adalah hipotenusa segitiga siku-siku bersisi 5 dan 12: ${ak2(2, '5² + 12²')} = ${ak2(2, 169)} = 13 cm.</p>
      <h4 class="sub">b. Trapesium siku-siku</h4>
      <p>Sisi sejajar 14 cm dan 8 cm, tinggi 8 cm. Sisi miringnya membentuk segitiga siku-siku bersisi (14 − 8) = 6 cm dan 8 cm. Sisi miring = ${ak2(2, '6² + 8²')} = ${ak2(2, 100)} = 10 cm, sehingga kelilingnya 14 + 8 + 8 + 10 = 40 cm.</p>
      <div class="tip">💡 Selisih sisi sejajar (dibagi dua pada trapesium sama kaki) dan tinggi menjadi dua sisi siku-siku. Kaki trapesium adalah hipotenusanya.</div>`],
    ['A.4 Kebalikan Teorema: Jenis Segitiga', `
      <p>Kalau tiga sisi segitiga diketahui, bandingkan kuadrat sisi terpanjang (c) dengan ${kuad('a')} + ${kuad('b')}:</p>
      <ul><li>${kuad('c')} = ${kuad('a')} + ${kuad('b')} → segitiga <b>siku-siku</b></li><li>${kuad('c')} &gt; ${kuad('a')} + ${kuad('b')} → segitiga <b>tumpul</b></li><li>${kuad('c')} &lt; ${kuad('a')} + ${kuad('b')} → segitiga <b>lancip</b></li></ul>
      <p>Contoh: sisi 7, 9, 12 → ${kuad(12)} = 144, sedangkan 49 + 81 = 130. Karena 144 &gt; 130, segitiganya tumpul. Sisi 6, 7, 8 → 64 &lt; 36 + 49 = 85, jadi lancip.</p>`]
  ],
  bagianB: [
    ['B.1 Pengertian Tripel Pythagoras', `
      <p><b>Tripel Pythagoras</b> adalah tiga bilangan bulat positif a, b, c yang memenuhi ${PY}. Jadi pasti bisa menjadi sisi segitiga siku-siku dengan panjang sisi bulat.</p>
      <p>Tripel yang sering muncul: ${tri(3, 4, 5)}, ${tri(5, 12, 13)}, ${tri(8, 15, 17)}, ${tri(7, 24, 25)}, ${tri(20, 21, 29)}.</p>
      <p><b>Kelipatan tripel juga tripel.</b> Dari (3, 4, 5): dikali 2 menjadi (6, 8, 10), dikali 3 menjadi (9, 12, 15), dikali 10 menjadi (30, 40, 50). Soal dengan sisi kelipatan tripel bisa dijawab tanpa menghitung akar.</p>
      <div class="tip">💡 Hafalkan 3-4-5 dan 5-12-13 beserta kelipatannya, supaya hitungan jauh lebih cepat.</div>`],
    ['B.2 Memeriksa dan Menemukan Tripel', `
      <h4 class="sub">a. Memeriksa tripel</h4>
      <p>Kuadratkan dua bilangan yang lebih kecil, jumlahkan, lalu bandingkan dengan kuadrat bilangan terbesar. (9, 12, 15): 81 + 144 = 225 = ${kuad(15)}, jadi tripel. (6, 7, 9): 36 + 49 = 85, sedangkan ${kuad(9)} = 81, jadi bukan tripel.</p>
      <h4 class="sub">b. Membuat tripel sendiri</h4>
      <div class="rumus">Untuk m &gt; n: ${kuad('m')} − ${kuad('n')}, 2mn, ${kuad('m')} + ${kuad('n')}</div>
      <p>m = 2, n = 1 → 4 − 1 = 3, 2·2·1 = 4, 4 + 1 = 5, yaitu (3, 4, 5). m = 3, n = 2 → 5, 12, 13. m = 4, n = 1 → 15, 8, 17.</p>`]
  ],
  bagianC: [
    ['C.1 Segitiga Siku-siku Sama Kaki (45°, 45°, 90°)', `
      <p>Kalau dua sisi siku-sikunya sama panjang (s), kedua sudut lancipnya 45°. Hipotenusanya ${ak2(2, 's² + s²')} = ${ak2(2, '2s²')} = s${ak2(2, 2)}.</p>
      <div class="rumus">sisi : sisi : hipotenusa = 1 : 1 : ${ak2(2, 2)}</div>
      <p>Contoh: s = 5 cm → hipotenusa 5${ak2(2, 2)} cm. Diagonal persegi bersisi s adalah s${ak2(2, 2)}, sebab diagonal membagi persegi menjadi dua segitiga 45°-45°-90°. Kebalikannya, hipotenusa 8${ak2(2, 2)} berarti sisinya 8 cm.</p>`],
    ['C.2 Segitiga 30°, 60°, 90°', `
      <p>Segitiga sama sisi bersisi 2x dibelah garis tinggi menjadi dua segitiga siku-siku 30°-60°-90°. Sisi di depan 30° adalah x, hipotenusa 2x, dan sisi di depan 60° adalah ${ak2(2, '(2x)² − x²')} = x${ak2(2, 3)}.</p>
      <div class="rumus">depan 30° : depan 60° : hipotenusa = 1 : ${ak2(2, 3)} : 2</div>
      <p>Contoh: sisi di depan 30° = 6 cm → sisi di depan 60° = 6${ak2(2, 3)} cm dan hipotenusa 12 cm. Tinggi segitiga sama sisi bersisi 10 cm adalah 5${ak2(2, 3)} cm.</p>
      <div class="tip">💡 Sudut kecil → sisi terpendek (x), 60° → sisi tengah (x${ak2(2, 3)}), 90° → sisi terpanjang (2x).</div>`]
  ],
  bagianD: [
    ['D.1 Tinggi dan Jarak (Tangga, Tiang, Tali)', `
      <p>Tanah dan dinding (atau tiang) saling tegak lurus, jadi banyak masalah nyata membentuk segitiga siku-siku.</p>
      <p><b>Tangga:</b> tangga 5 m disandarkan ke dinding, kaki tangga 3 m dari dinding. Tinggi ujung atas = ${ak2(2, '5² − 3²')} = ${ak2(2, 16)} = 4 m.</p>
      <p><b>Tiang bendera:</b> tiang tegak setinggi 12 m, tali dari puncak ke tanah berjarak 5 m dari kaki tiang. Panjang tali minimal = ${ak2(2, '12² + 5²')} = 13 m.</p>`],
    ['D.2 Diagonal Bangun Datar', `
      <p>Diagonal persegi panjang membagi bangunnya menjadi dua segitiga siku-siku. Layar 24 cm × 7 cm punya diagonal ${ak2(2, '24² + 7²')} = ${ak2(2, 625)} = 25 cm. Diagonal persegi bersisi s adalah s${ak2(2, 2)}.</p>
      <p>Belah ketupat berdiagonal 16 cm dan 12 cm: kedua diagonal saling tegak lurus dan saling membagi dua, jadi sisinya ${ak2(2, '8² + 6²')} = 10 cm.</p>`],
    ['D.3 Jalan Pintas dan Soal Cerita', `
      <p>Ali berjalan 60 m ke timur lalu 80 m ke utara. Jarak lurus dari titik awal: ${ak2(2, '60² + 80²')} = 100 m. Jalan pintas menghemat 140 − 100 = 40 m.</p>
      <p><b>Langkah menyelesaikan soal cerita:</b></p>
      <ol><li>Buat sketsa dan tandai sudut siku-siku.</li><li>Tentukan hipotenusa (di depan sudut siku-siku).</li><li>Cari c dengan menjumlahkan kuadrat, atau cari sisi siku-siku dengan mengurangkan kuadrat.</li><li>Ambil akarnya, tulis satuannya, lalu cek: hipotenusa harus yang terpanjang.</li></ol>`]
  ],
  bagianE: [
    ['E.1 Rumus Jarak Dua Titik (Pengayaan)', `
      <p>Titik pada bidang koordinat ditulis (x, y): <b>x</b> adalah banyak kotak ke kanan dari pojok kiri bawah, <b>y</b> adalah banyak kotak ke atas. Untuk mengukur jarak lurus titik A ke titik B, kita "berjalan" dari A ke B dengan dua geseran: satu mendatar, satu tegak. Dua geseran itu membentuk segitiga siku-siku, dan jarak AB adalah sisi miringnya. Jadi rumus jarak hanyalah teorema Pythagoras yang dipakai di peta.</p>
      <div class="rumus">AB = ${ak2(2, '(x₂ − x₁)² + (y₂ − y₁)²')}</div>
      <p>Contoh: A(1, 2) dan B(4, 6). Geser mendatar: 4 − 1 = 3 kotak. Geser tegak: 6 − 2 = 4 kotak. Jadi AB = ${ak2(2, '3² + 4²')} = ${ak2(2, 25)} = 5 satuan. Kalau hasil pengurangannya negatif, tidak masalah karena nanti dikuadratkan.</p>`],
    ['E.2 Jarak ke Titik Pusat dan Penerapannya', `
      <p>Jarak titik P(x, y) ke pusat O(0, 0) adalah ${ak2(2, 'x² + y²')}. Contoh: P(5, 12) → ${ak2(2, 169)} = 13. Kalau hasilnya tidak bulat, sederhanakan: Q(2, 4) → ${ak2(2, 20)} = 2${ak2(2, 5)}.</p>
      <p>Penerapan: drone terbang dari (2, 1) ke (10, 7) pada peta berskala km. Selisihnya 8 dan 6, jadi jaraknya ${ak2(2, '8² + 6²')} = 10 km. Aplikasi peta dan permainan komputer memakai cara yang sama.</p>
      <div class="tip">💡 Rumus jarak adalah teorema Pythagoras yang dipasang pada bidang koordinat.</div>`]
  ],
  ringkasan: [
    `Teorema Pythagoras: ${PY}, dengan c = hipotenusa (sisi terpanjang, di depan sudut 90°).`,
    `Mencari hipotenusa: c = ${ak2(2, 'a² + b²')}. Mencari sisi siku-siku: a = ${ak2(2, 'c² − b²')}.`,
    'Trapesium: tarik garis tinggi. Selisih sisi sejajar (dibagi dua pada trapesium sama kaki) dan tinggi menjadi sisi siku-siku, kaki trapesium adalah hipotenusa.',
    `Kebalikan: ${kuad('c')} = ${kuad('a')} + ${kuad('b')} siku-siku, lebih besar tumpul, lebih kecil lancip.`,
    `Tripel Pythagoras: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25) dan kelipatannya. Rumus: ${kuad('m')} − ${kuad('n')}, 2mn, ${kuad('m')} + ${kuad('n')}.`,
    `Segitiga 45°-45°-90° berperbandingan 1 : 1 : ${ak2(2, 2)}. Segitiga 30°-60°-90° berperbandingan 1 : ${ak2(2, 3)} : 2.`,
    'Penerapan: tangga, tiang, diagonal bangun datar, dan jalan pintas.',
    `Jarak dua titik: AB = ${ak2(2, '(x₂ − x₁)² + (y₂ − y₁)²')}.`
  ],
  tips: ['Selalu cari dulu hipotenusa, yaitu sisi di depan sudut siku-siku. Hanya hipotenusa yang berdiri sendiri di satu ruas rumus.', 'Hipotenusa adalah sisi terpanjang. Kalau hasil hitunganmu lebih pendek dari salah satu sisi siku-siku, ada yang keliru.', 'Pada trapesium, jangan lupa: tarik garis tinggi dulu supaya segitiga siku-sikunya muncul.'],
  contoh: [
    { tag: 'Segitiga siku-siku', r: PY, q: 'Sisi siku-siku sebuah segitiga 9 cm dan 12 cm. Hitung panjang hipotenusanya.', l: ['Hipotenusa dicari dengan menjumlahkan kuadrat kedua sisi siku-siku.', 'c² = 9² + 12² = 81 + 144 = 225.', 'c = √225 = 15.'], j: '15 cm' },
    { tag: 'Segitiga siku-siku', r: `a = ${ak2(2, 'c² − b²')} (mencari sisi siku-siku)`, q: 'Hipotenusa segitiga siku-siku 17 cm dan salah satu sisi siku-sikunya 8 cm. Berapa sisi siku-siku yang lain?', l: ['Yang dicari sisi siku-siku, jadi kuadratnya dikurangkan.', 'a² = 17² − 8² = 289 − 64 = 225.', 'a = √225 = 15.'], j: '15 cm' },
    { tag: 'Segitiga sama kaki', r: 'Garis tinggi membagi alas menjadi dua sama panjang', q: 'Segitiga sama kaki beralas 16 cm dan panjang kaki 10 cm. Hitung tinggi dan luasnya.', l: ['Garis tinggi membagi alas menjadi 8 cm dan 8 cm, sehingga terbentuk segitiga siku-siku dengan hipotenusa 10 dan sisi 8.', 't² = 10² − 8² = 100 − 64 = 36, jadi t = 6 cm.', 'Luas = ½ × alas × tinggi = ½ × 16 × 6 = 48 cm².'], j: 'Tinggi 6 cm, luas 48 cm²' },
    { tag: 'Trapesium sama kaki', r: 'Setengah selisih sisi sejajar dan tinggi menjadi sisi siku-siku, kaki adalah hipotenusa', q: 'Trapesium sama kaki memiliki sisi sejajar 25 cm dan 7 cm, serta tinggi 12 cm. Hitung panjang kaki dan keliling trapesium.', l: ['Selisih sisi sejajar = 25 − 7 = 18 cm, dibagi dua menjadi 9 cm di kiri dan kanan.', 'Kaki² = 9² + 12² = 81 + 144 = 225, jadi kaki = 15 cm.', 'Keliling = 25 + 7 + 15 + 15 = 62 cm.'], j: 'Kaki 15 cm, keliling 62 cm' },
    { tag: 'Trapesium siku-siku', r: 'Selisih sisi sejajar dan tinggi menjadi sisi siku-siku, sisi miring adalah hipotenusa', q: 'Trapesium siku-siku memiliki sisi sejajar 18 cm dan 10 cm, serta tinggi 15 cm. Hitung panjang sisi miring dan luasnya.', l: ['Selisih sisi sejajar = 18 − 10 = 8 cm.', 'Sisi miring² = 8² + 15² = 64 + 225 = 289, jadi sisi miring = 17 cm.', 'Luas = ½ × (18 + 10) × 15 = ½ × 28 × 15 = 210 cm².'], j: 'Sisi miring 17 cm, luas 210 cm²' },
    { tag: 'Tripel Pythagoras', r: `${kuad('m')} − ${kuad('n')}, 2mn, ${kuad('m')} + ${kuad('n')}`, q: 'Tentukan tripel Pythagoras untuk m = 5 dan n = 2, lalu buktikan.', l: ['Sisi pertama: 5² − 2² = 25 − 4 = 21.', 'Sisi kedua: 2 × 5 × 2 = 20. Sisi ketiga: 5² + 2² = 29.', 'Bukti: 20² + 21² = 400 + 441 = 841 = 29². ✔'], j: '(20, 21, 29)' },
    { tag: 'Segitiga 45°-45°-90°', r: `hipotenusa = sisi × ${ak2(2, 2)}`, q: 'Hitunglah panjang diagonal sebuah persegi yang sisinya 6 cm.', l: ['Diagonal membagi persegi menjadi dua segitiga siku-siku sama kaki.', `Perbandingan sisi : sisi : hipotenusa = 1 : 1 : ${ak2(2, 2)}.`, `Diagonal = 6 × ${ak2(2, 2)} = 6${ak2(2, 2)}.`], j: `6${ak2(2, 2)} cm` },
    { tag: 'Segitiga 30°-60°-90°', r: `1 : ${ak2(2, 3)} : 2 (depan 30° : depan 60° : hipotenusa)`, q: 'Pada segitiga siku-siku 30°-60°-90°, sisi terpendeknya 7 cm. Hitung dua sisi lainnya.', l: ['Sisi terpendek (depan 30°) x = 7.', `Sisi depan 60° = x${ak2(2, 3)} = 7${ak2(2, 3)}.`, 'Hipotenusa = 2x = 14.'], j: `7${ak2(2, 3)} cm dan 14 cm` },
    { tag: 'Penerapan: tangga', r: PY, q: 'Tangga 13 m bersandar pada dinding tegak. Kaki tangga berjarak 5 m dari dinding. Berapa tinggi ujung atas tangga?', l: ['Tangga adalah hipotenusa (13 m), jarak kaki ke dinding sisi siku-siku (5 m).', 't² = 13² − 5² = 169 − 25 = 144.', 't = √144 = 12.'], j: '12 m' },
    { tag: 'Penerapan: jalan pintas', r: 'Jarak lurus = hipotenusa', q: 'Rani berjalan 40 m ke barat lalu 30 m ke selatan. Berapa jarak lurus Rani dari titik awal?', l: ['Arah barat dan selatan saling tegak lurus, jadi membentuk segitiga siku-siku.', 'Jarak² = 40² + 30² = 1.600 + 900 = 2.500.', 'Jarak = √2.500 = 50.'], j: '50 m' },
    { tag: 'Rumus jarak (pengayaan)', r: `AB = ${ak2(2, '(x₂ − x₁)² + (y₂ − y₁)²')}`, q: 'Hitung jarak titik A(−2, 1) dan B(4, 9).', l: ['Selisih x = 4 − (−2) = 6. Selisih y = 9 − 1 = 8.', 'AB² = 6² + 8² = 36 + 64 = 100.', 'AB = √100 = 10.'], j: '10 satuan' }
  ],
  soal: [
    { q: 'Sisi siku-siku sebuah segitiga 6 cm dan 8 cm. Panjang hipotenusanya adalah ...', o: ['10 cm', '12 cm', '14 cm', '48 cm'], j: 0, p: '6² + 8² = 36 + 64 = 100, sehingga hipotenusa = √100 = 10 cm.' },
    { q: 'Hipotenusa 25 cm dan satu sisi siku-siku 7 cm. Sisi siku-siku lainnya adalah ...', o: ['18 cm', '20 cm', '24 cm', '32 cm'], j: 2, p: '25² − 7² = 625 − 49 = 576, dan √576 = 24 cm.' },
    { q: 'Manakah yang merupakan tripel Pythagoras?', o: ['(4, 5, 6)', '(6, 8, 10)', '(5, 7, 9)', '(7, 8, 10)'], j: 1, p: '6² + 8² = 36 + 64 = 100 = 10². Pilihan lain tidak memenuhi, misalnya 4² + 5² = 41 sedangkan 6² = 36.' },
    { q: 'Segitiga dengan sisi 5 cm, 6 cm, dan 8 cm adalah segitiga ...', o: ['siku-siku', 'lancip', 'tumpul', 'sama sisi'], j: 2, p: '8² = 64, sedangkan 5² + 6² = 25 + 36 = 61. Karena 64 > 61, segitiganya tumpul.' },
    { q: 'Trapesium sama kaki memiliki sisi sejajar 20 cm dan 10 cm, serta tinggi 12 cm. Panjang kakinya adalah ...', o: ['12 cm', '13 cm', '15 cm', '17 cm'], j: 1, p: 'Setengah selisih sisi sejajar = (20 − 10) ÷ 2 = 5. Kaki = √(5² + 12²) = √169 = 13 cm.' },
    { q: 'Trapesium siku-siku memiliki sisi sejajar 17 cm dan 9 cm, serta tinggi 15 cm. Panjang sisi miringnya adalah ...', o: ['15 cm', '16 cm', '17 cm', '18 cm'], j: 2, p: 'Selisih sisi sejajar = 17 − 9 = 8. Sisi miring = √(8² + 15²) = √289 = 17 cm.' },
    { q: 'Panjang diagonal persegi yang sisinya 9 cm adalah ...', o: [`9${ak2(2, 2)} cm`, `9${ak2(2, 3)} cm`, '18 cm', '9 cm'], j: 0, p: `Diagonal = sisi × ${ak2(2, 2)} = 9${ak2(2, 2)} cm.` },
    { q: 'Pada segitiga 30°-60°-90°, sisi terpendeknya 5 cm. Panjang hipotenusanya adalah ...', o: [`5${ak2(2, 3)} cm`, '10 cm', `10${ak2(2, 3)} cm`, '15 cm'], j: 1, p: 'Hipotenusa = 2 × sisi terpendek = 2 × 5 = 10 cm.' },
    { q: 'Tangga 13 m bersandar pada dinding. Kaki tangga 5 m dari dinding. Tinggi ujung atas tangga adalah ...', o: ['8 m', '10 m', '12 m', '18 m'], j: 2, p: '13² − 5² = 169 − 25 = 144, dan √144 = 12 m.' },
    { q: 'Jarak titik A(2, 3) dan B(8, 11) adalah ...', o: ['8 satuan', '10 satuan', '12 satuan', '14 satuan'], j: 1, p: 'Selisih x = 6 dan selisih y = 8. AB = √(36 + 64) = √100 = 10 satuan.' }
  ]
}

const LANGKAH2 = [
  { k: 'belajar', ik: '📖', t: 'Perpustakaan Kuno', n: 'Penjelasan & Ringkasan', d: 'Pahami konsep dan rumus pentingnya', c1: '#ff7a59', c2: '#ffb347' },
  { k: 'visual', ik: '📐', t: 'Laboratorium Segitiga', n: 'Visual Interaktif', d: 'Lihat luas persegi, tripel, dan jarak', c1: '#6c4cf1', c2: '#a78bfa' },
  { k: 'contoh', ik: '🗺️', t: 'Peta Rahasia', n: 'Contoh Soal', d: 'Pembahasan langkah demi langkah', c1: '#16a36a', c2: '#5ed8a2' },
  { k: 'latihan', ik: '⚔️', t: 'Arena Latihan', n: 'Latihan Interaktif', d: 'Tanpa batas waktu, ada feedback', c1: '#0ea5e9', c2: '#6ee7f9' },
  { k: 'game', ik: '🏰', t: 'Istana Harta Karun', n: 'Kuis Edukasi', d: '4 jenis kuis, 5 soal per sesi', c1: '#ec4899', c2: '#f9a8d4' }
]

/* ---------- Visual interaktif ---------- */
function visual2() {
  const TB = [['l', '🟦 Luas Persegi'], ['t', '🔺 Tripel'], ['j', '📍 Rumus Jarak']]
  const CFG = { l: [['a', 'Sisi a', 1, 12], ['b', 'Sisi b', 1, 12]], t: [['m', 'm', 2, 9], ['n', 'n', 1, 8], ['k', 'Kelipatan', 1, 3]], j: [['x1', 'A: ke kanan (x)', 0, 8], ['y1', 'A: ke atas (y)', 0, 8], ['x2', 'B: ke kanan (x)', 0, 8], ['y2', 'B: ke atas (y)', 0, 8]] }
  const S = { l: { a: 3, b: 4 }, t: { m: 2, n: 1, k: 1 }, j: { x1: 1, y1: 2, x2: 4, y2: 6 } }
  let tab = 'l'
  const akarTxt = s => { if (s === 0) return '0'; const [k, n] = simp(s); return n === 1 ? String(k) : rt2(k, n) }
  const gambar = () => {
    const v = S[tab]; let isi, eq, tip, pre = ''
    if (tab === 't' && v.n >= v.m) v.n = v.m - 1
    if (tab === 'l') {
      const { a, b } = v, s = a * a + b * b, u = 190 / Math.max(a, b), X = 20, Y = 215, bulat = Number.isInteger(Math.sqrt(s))
      eq = `<div class="besar">${a}² + ${b}² = ${a * a} + ${b * b} = ${s}</div><div class="kecil">c = √${s} = ${akarTxt(s)} ${bulat ? '(tripel Pythagoras!)' : '(bukan bilangan bulat)'}</div>`
      isi = `<svg class="svgv" viewBox="0 0 240 240" aria-hidden="true"><polygon points="${X},${Y} ${X + a * u},${Y} ${X},${Y - b * u}" fill="#6c4cf133" stroke="#6c4cf1" stroke-width="3"/><path d="M${X} ${Y - 14}h14v14" fill="none" stroke="currentColor"/>
        <text x="${X + a * u / 2 - 14}" y="${Y + 18}">a = ${a}</text><text x="${X + 6}" y="${Y - b * u / 2}">b = ${b}</text><text x="${X + a * u / 2 + 6}" y="${Y - b * u / 2 - 6}">c</text></svg>
        ${[['a²', a * a], ['b²', b * b], ['c²', s]].map(([n, x]) => `<div class="luasbar"><span>${n} = ${x}</span><div class="batang"><i style="width:${x / s * 100}%"></i></div></div>`).join('')}`
      tip = `Luas persegi pada sisi a (${a * a}) ditambah luas persegi pada sisi b (${b * b}) sama dengan luas persegi pada hipotenusa (${s}). Ubah a dan b, hasilnya selalu begitu.`
    } else if (tab === 't') {
      const { m, n, k } = v, [P, Q] = [m * m - n * n, 2 * m * n].sort((x, y) => x - y), R = m * m + n * n
      eq = `<div class="besar">(${P * k}, ${Q * k}, ${R * k})</div><div class="kecil">${P * k}² + ${Q * k}² = ${(P * k) ** 2} + ${(Q * k) ** 2} = ${(R * k) ** 2} = ${R * k}² ✔</div>`
      isi = `<p>m² − n² = ${m * m} − ${n * n} = ${m * m - n * n}<br>2mn = 2 × ${m} × ${n} = ${2 * m * n}<br>m² + n² = ${m * m} + ${n * n} = ${R}</p>${k > 1 ? `<p>Semuanya dikali ${k}: (${P}, ${Q}, ${R}) menjadi (${P * k}, ${Q * k}, ${R * k}).</p>` : ''}`
      tip = 'Untuk m dan n berapa pun (m lebih besar dari n), rumusnya selalu menghasilkan tripel Pythagoras. Kelipatannya juga tripel.'
    } else {
      const { x1, y1, x2, y2 } = v, dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1), s = dx * dx + dy * dy
      const px = x => 30 + 30 * x, py = y => 270 - 30 * y, ra = Math.sqrt(s), bulat = Number.isInteger(ra), f = Math.floor(ra), hampir = ra.toFixed(2).replace('.', ','), [kk] = simp(s)
      const cx = px(x2), cy = py(y1), hx = Math.sign(px(x1) - cx), vy = Math.sign(py(y2) - cy), mx = (px(x1) + cx) / 2, my = (cy + py(y2)) / 2
      const L = Math.hypot(mx - cx, my - cy) || 1, lx = mx + (mx - cx) / L * 18, ly = my + (my - cy) / L * 18 + 4
      const aY = vy < 0 ? (cy + 18 > 282 ? cy - 9 : cy + 18) : (cy - 9 < 24 ? cy + 18 : cy - 9), bs = hx > 0 && cx - 55 >= 26 ? -1 : 1
      const lab = (x, y, others, t, dd) => {
        let fx = 0, fy = 0; others.forEach(([ox, oy]) => { const n = Math.hypot(ox - x, oy - y) || 1; fx -= (ox - x) / n; fy -= (oy - y) / n })
        const n = Math.hypot(fx, fy); if (n > .2) { fx /= n; fy /= n } else { [fx, fy] = dd }
        let an = fx > .35 ? 'start' : fx < -.35 ? 'end' : 'middle', ty = y + fy * 18 + 4
        let tx = x + (an === 'start' ? 12 : an === 'end' ? -12 : fx * 14)
        if (ty > 278) { ty = 306; an = 'middle'; tx = x } else if (an === 'end' && x < 100) { ty = y + (fy >= 0 ? 22 : -12); if (x >= 88) tx = x + 6; else { an = 'middle'; tx = x } }
        return `<text x="${tx}" y="${Math.max(14, ty)}" text-anchor="${an}">${t}</text>`
      }
      pre = `<div class="pilih">${['Contoh 3-4-5', 'Contoh 6-8-10', 'Contoh hasil akar', '🎲 Acak'].map((t, i) => `<button class="btn alt" data-p="${i}">${t}</button>`).join('')}</div>`
      const rumus = dx && dy ? `<div style="font-size:1.05rem;line-height:2.2;margin-bottom:8px">AB = ${ak2(2, 'a² + b²')}<br>AB = ${ak2(2, `${dx}² + ${dy}²`)}<br>AB = ${ak2(2, `${dx * dx} + ${dy * dy}`)} = ${ak2(2, s)}${bulat ? ` = ${ra}` : kk > 1 ? ` = ${akarTxt(s)}` : ''}</div>` : ''
      eq = `${rumus}<div class="besar">AB = ${akarTxt(s)}</div><div class="kecil">${s === 0 ? 'Titik A dan B berimpit.' : bulat ? `Jaraknya tepat ${ra} kotak.` : `Sekitar ${hampir} kotak.`}</div>`
      const svg = `<svg class="svgv" viewBox="-30 0 370 320" role="img" aria-label="Titik A dan B pada kotak koordinat">
        <g stroke="currentColor" opacity=".18">${Array.from({ length: 9 }, (_, i) => `<line x1="${px(i)}" y1="30" x2="${px(i)}" y2="270"/><line x1="30" y1="${py(i)}" x2="270" y2="${py(i)}"/>`).join('')}</g>
        ${Array.from({ length: 9 }, (_, i) => `<text class="sb" x="${px(i)}" y="288" text-anchor="middle">${i}</text><text class="sb" x="16" y="${py(i) + 4}" text-anchor="middle">${i}</text>`).join('')}
        ${dx && dy ? `<path d="M${px(x1)} ${cy}H${cx}V${py(y2)}" fill="none" stroke="#16a36a" stroke-width="4" stroke-dasharray="7 5"/><path d="M${cx} ${cy}h${hx * 15}v${vy * 15}h${-hx * 15}z" fill="#16a36a33" stroke="currentColor" stroke-width="2"/>
        <text x="${(px(x1) + cx) / 2}" y="${aY}" text-anchor="middle" style="fill:#16a36a">a = ${dx}</text>
        <text x="${cx + bs * 9}" y="${my + 4}" text-anchor="${bs < 0 ? 'end' : 'start'}" style="fill:#16a36a">b = ${dy}</text>` : ''}
        <line x1="${px(x1)}" y1="${py(y1)}" x2="${px(x2)}" y2="${py(y2)}" stroke="#6c4cf1" stroke-width="4"/>
        ${dx && dy ? `<text x="${lx}" y="${ly}" text-anchor="middle" style="fill:#6c4cf1">AB</text>` : ''}
        <circle cx="${px(x1)}" cy="${py(y1)}" r="7" fill="#0ea5e9"/><circle cx="${px(x2)}" cy="${py(y2)}" r="7" fill="#ff7a59"/>
        ${lab(px(x1), py(y1), dx && dy ? [[px(x2), py(y2)], [cx, cy]] : [[px(x2), py(y2)]], `A(${x1}, ${y1})`, [.7, -.7])}${lab(px(x2), py(y2), dx && dy ? [[px(x1), py(y1)], [cx, cy]] : [[px(x1), py(y1)]], `B(${x2}, ${y2})`, [-.7, -.7])}</svg>
        <p class="kecil">🟢 Garis hijau putus-putus: dua geseran dari A ke B. 🟣 Garis ungu: jarak AB yang kita cari. Kotak kecil di sudut = sudut siku-siku (90°).</p>`
      const lang = s === 0 ? '<div class="tip">Titik A dan B berada di tempat yang sama, jadi jaraknya 0. Coba ubah salah satu angka.</div>'
        : !dx || !dy ? `<div class="tip">A dan B berada pada garis lurus ${dx ? 'mendatar' : 'tegak'}, jadi tidak terbentuk segitiga. Jaraknya cukup dihitung dari banyak kotaknya: <b>${dx || dy} kotak</b>. Coba ubah angkanya supaya garisnya miring.</div>`
        : `<h4 class="sub">Cara mencari jarak AB, langkah demi langkah</h4><ol>
          <li><b>Geser mendatar</b> (kiri-kanan) dari A ke B: ${Math.max(x1, x2)} − ${Math.min(x1, x2)} = <b>${dx} kotak</b>. Kita sebut sisi <b>a</b>.</li>
          <li><b>Geser tegak</b> (atas-bawah) dari A ke B: ${Math.max(y1, y2)} − ${Math.min(y1, y2)} = <b>${dy} kotak</b>. Kita sebut sisi <b>b</b>.</li>
          <li>Dua geseran itu membentuk <b>segitiga siku-siku</b>. Jarak AB adalah sisi miringnya, jadi kita pakai Pythagoras.</li>
          <li>AB² = a² + b² = ${dx}² + ${dy}² = ${dx * dx} + ${dy * dy} = <b>${s}</b>, sehingga AB = ${ak2(2, s)}${bulat ? ` = <b>${ra}</b> kotak.` : `${kk > 1 ? ` = ${akarTxt(s)}` : ''} ≈ <b>${hampir}</b> kotak.`}</li></ol>
          <p class="kecil">${bulat ? `Hasilnya bilangan bulat karena (${Math.min(dx, dy)}, ${Math.max(dx, dy)}, ${ra}) adalah tripel Pythagoras.` : `Hasil tidak bulat itu normal. ${ak2(2, s)} artinya bilangan yang kalau dikali dirinya sendiri hasilnya ${s}. Karena ${f}×${f} = ${f * f} dan ${f + 1}×${f + 1} = ${(f + 1) ** 2}, nilainya ada di antara ${f} dan ${f + 1}.`}</p>`
      isi = svg + lang
      tip = 'Bayangkan peta kota: A dan B adalah dua tempat, dan kita ingin tahu jarak lurusnya. Titik (x, y) artinya x kotak ke kanan dari pojok kiri bawah, lalu y kotak ke atas. Ubah angkanya atau tekan tombol contoh.'
    }
    $('vis').innerHTML = `<div class="tabsv">${TB.map(([k, nm]) => `<button data-t="${k}" class="${k === tab ? 'on' : ''}">${nm}</button>`).join('')}</div>
      <div class="pilih">${tab === 'j' ? ['A', 'B'].map((t, i) => `<label>Koordinat ${t} (x${i ? '₂' : '₁'}, y${i ? '₂' : '₁'}) <select data-k="x${i + 1}" aria-label="x titik ${t}">${opt(0, 8, v['x' + (i + 1)])}</select> <select data-k="y${i + 1}" aria-label="y titik ${t}">${opt(0, 8, v['y' + (i + 1)])}</select></label>`).join('') : CFG[tab].map(([k, l, lo, hi]) => `<label>${l} <select data-k="${k}">${opt(lo, hi, v[k])}</select></label>`).join('')}</div>
      ${pre}<div class="hasil">${eq}</div><div style="margin:10px 0">${isi}</div><div class="tip">💡 ${tip}</div>`
    $('vis').querySelectorAll('[data-t]').forEach(x => x.onclick = () => { tab = x.dataset.t; gambar() })
    $('vis').querySelectorAll('select').forEach(s => s.onchange = () => { v[s.dataset.k] = +s.value; gambar() })
    const PJ = [{ x1: 1, y1: 1, x2: 4, y2: 5 }, { x1: 1, y1: 0, x2: 7, y2: 8 }, { x1: 0, y1: 2, x2: 5, y2: 7 }], r9 = () => Math.floor(Math.random() * 9)
    $('vis').querySelectorAll('[data-p]').forEach(b => b.onclick = () => { Object.assign(v, PJ[+b.dataset.p] || { x1: r9(), y1: r9(), x2: r9(), y2: r9() }); gambar() })
  }
  gambar()
}

/* ---------- Bank soal kuis (dibangkitkan dari rumus) ---------- */
const PT = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]]
const FAM2 = [
  { id: 'hipo', n: 24, lv: 1, int: 1, pair: 1, mk: i => { const [x, y] = D(i, 6, 4), [p, q, r] = PT[x], k = 1 + y, P = p * k, Q = q * k, a = r * k
    return { e: `sisi ${P} dan ${Q}`, q: `Sisi siku-siku sebuah segitiga ${P} cm dan ${Q} cm. Berapa panjang hipotenusanya (cm)?`, a, w: [P + Q, a + k, a - k], tip: 'Hipotenusa: jumlahkan kuadrat kedua sisi siku-siku, lalu akarkan.', s: [`c² = ${P}² + ${Q}² = ${fmt(P * P)} + ${fmt(Q * Q)}`, `c² = ${fmt(a * a)}`, `c = ${a}`] } } },
  { id: 'sisi', n: 24, lv: 1, int: 1, pair: 1, mk: i => { const [x, y] = D(i, 6, 4), [p, q, r] = PT[x], k = 1 + y, P = p * k, Q = q * k, a = r * k
    return { e: `hipotenusa ${a}, sisi ${P}`, q: `Hipotenusa segitiga siku-siku ${a} cm dan salah satu sisi siku-sikunya ${P} cm. Berapa sisi siku-siku yang lain (cm)?`, a: Q, w: [a - P, a + P, Q + k], tip: 'Mencari sisi siku-siku: kurangkan kuadrat hipotenusa dengan kuadrat sisi yang diketahui.', s: [`b² = ${a}² − ${P}² = ${fmt(a * a)} − ${fmt(P * P)}`, `b² = ${fmt(Q * Q)}`, `b = ${Q}`] } } },
  { id: 'tangga', n: 24, lv: 2, int: 1, pair: 1, mk: i => { const [x, y] = D(i, 6, 4), [p, q, r] = PT[x], k = 1 + y, P = p * k, Q = q * k, a = r * k
    return { e: `tangga ${a} m, kaki ${P} m`, q: `Tangga ${a} m bersandar pada dinding tegak. Ujung bawahnya berjarak ${P} m dari dinding. Berapa tinggi ujung atas tangga (m)?`, a: Q, w: [P + Q, a - 1, a + P], tip: 'Tangga adalah hipotenusa. Tinggi dicari dengan mengurangkan kuadrat.', s: [`Tangga = hipotenusa (${a}), kaki ke dinding = ${P}`, `t² = ${a}² − ${P}² = ${fmt(a * a)} − ${fmt(P * P)} = ${fmt(Q * Q)}`, `t = ${Q}`] } } },
  { id: 'tripelMN', n: 30, lv: 2, int: 1, pair: 1, mk: i => { const [x, y] = D(i, 5, 6), m = 3 + x, n = 1 + y % (m - 1), a = m * m + n * n
    return { e: `m = ${m}, n = ${n}`, q: `Rumus tripel: m² − n², 2mn, m² + n². Untuk m = ${m} dan n = ${n}, berapa sisi terpanjangnya (m² + n²)?`, a, w: [m * m - n * n, 2 * m * n, (m + n) ** 2], tip: 'Sisi terpanjang tripel adalah m² + n².', s: [`m² = ${m * m} dan n² = ${n * n}`, `m² + n² = ${m * m} + ${n * n}`, `Hasil: ${a}`] } } },
  { id: 'jarak', n: 64, lv: 2, int: 1, pair: 1, mk: i => { const [x, z, u] = D(i, 4, 4, 4), [p, q, r] = PT[x], sg = (x + z) % 2 ? -1 : 1, x1 = z, y1 = u, x2 = x1 + sg * p, y2 = y1 + q
    return { e: `A(${x1}, ${y1}) dan B(${x2}, ${y2})`, q: `Berapa jarak titik A(${x1}, ${y1}) dan B(${x2}, ${y2})?`, a: r, w: [p + q, r + 1, r - 1], tip: 'Jarak dua titik: akar dari kuadrat selisih x ditambah kuadrat selisih y.', s: [`Selisih x = ${Math.abs(p)}, selisih y = ${q}`, `AB² = ${p}² + ${q}² = ${p * p} + ${q * q} = ${r * r}`, `AB = ${r}`] } } },
  { id: 'diagonal', n: 8, lv: 2, pair: 1, mk: i => { const [x] = D(i, 8), s = 2 + x
    return { e: `diagonal persegi sisi ${s}`, q: `Sisi sebuah persegi ${s} cm. Berapa panjang diagonalnya?`, a: rt2(s, 2), w: [rt2(s, 3), rt2(2 * s, 2), String(2 * s)], f: j => rt2(s + 1 + j, 2), tip: 'Diagonal persegi = sisi × √2.', s: ['Diagonal membagi persegi menjadi dua segitiga siku-siku sama kaki', `d = ${ak2(2, `${s}² + ${s}²`)} = ${ak2(2, 2 * s * s)}`, `Hasil: ${rt2(s, 2)}`] } } },
  { id: 'istimewa30', n: 12, lv: 3, int: 1, pair: 1, mk: i => { const [x] = D(i, 12), s = 3 + x
    return { e: `30°-60°-90°, terpendek ${s}`, q: `Pada segitiga siku-siku 30°-60°-90°, sisi terpendeknya ${s} cm. Berapa panjang hipotenusanya (cm)?`, a: 2 * s, w: [s + 2, 4 * s, 3 * s], tip: 'Hipotenusa = 2 × sisi di depan sudut 30°.', s: ['Sisi di depan 30° adalah yang terpendek (x)', `Hipotenusa = 2x = 2 × ${s}`, `Hasil: ${2 * s}`] } } },
  { id: 'trapKaki', n: 108, lv: 3, int: 1, pair: 1, mk: i => { const [x, y, z, u] = D(i, 6, 3, 2, 3), [p, q, r] = PT[x], k = 1 + y, h = z ? q * k : p * k, t = z ? p * k : q * k, atas = 4 + 3 * u, bawah = atas + 2 * h, a = r * k
    return { e: `trapesium ${bawah} dan ${atas}, tinggi ${t}`, q: `Trapesium sama kaki memiliki sisi sejajar ${bawah} cm dan ${atas} cm, serta tinggi ${t} cm. Berapa panjang kaki trapesium (cm)?`, a, w: [h + t, a + k, a - k], tip: 'Setengah selisih sisi sejajar dan tinggi adalah sisi siku-siku; kaki adalah hipotenusa.', s: [`Setengah selisih sisi sejajar = (${bawah} − ${atas}) ÷ 2 = ${h}`, `Kaki² = ${h}² + ${t}² = ${fmt(h * h)} + ${fmt(t * t)} = ${fmt(a * a)}`, `Kaki = ${a}`] } } }
]
const TOTAL2 = FAM2.reduce((t, f) => t + f.n, 0)
const sudah2 = new Set()
const bangun2 = (f, i) => { const x = f.mk(i); x.q = x.q || `${x.e} = ?`; x.fam = f.id; x.int = !!f.int; return x }
const tarik2 = (lv, fl) => {
  const c = FAM2.filter(f => f.lv === lv && fl(f)), pool = c.length ? c : FAM2.filter(fl)
  for (let t = 0; t < 40; t++) { const f = pool[Math.floor(Math.random() * pool.length)], i = Math.floor(Math.random() * f.n); if (!sudah2.has(f.id + ':' + i)) { sudah2.add(f.id + ':' + i); return bangun2(f, i) } }
  const f = pool[0]; return bangun2(f, Math.floor(Math.random() * f.n))
}
const pilihan2 = x => {
  const set = new Set([T(x.a)]); x.w.forEach(v => { if (typeof v !== 'number' || v > 0) set.add(T(v)) })
  let j = 1; while (set.size < 4) set.add(T(x.f ? x.f(j++) : x.a + j++ * 2))
  const o = acak(set); return { o, ok: o.indexOf(T(x.a)) }
}

/* ---------- Halaman materi (peta petualangan + 5 langkah) ---------- */
function bukaMateri2(m, aktif) {
  window.scrollTo(0, 0); clearInterval(window._kuisTimer)
  if (window.ingatPosisi) ingatPosisi({ tab: 'beranda', materi: 2, langkah: aktif || null })
  const k = LANGKAH2.findIndex(x => x.k === aktif), judul = `<h2>${aman(m.ikon)} ${aman(m.judul)}</h2>`
  if (k < 0) {
    const X = [30, 70, 30, 70, 30], Y = LANGKAH2.map((_, i) => 10 + i * 20)
    let d = `M${X[0]} ${Y[0]}`
    for (let i = 1; i < X.length; i++) { const ym = (Y[i - 1] + Y[i]) / 2; d += ` C${X[i - 1]} ${ym} ${X[i]} ${ym} ${X[i]} ${Y[i]}` }
    $('isi').innerHTML = `<p><button class="btn alt" id="kembali">← Kembali</button></p>${judul}
      <p class="kecil">🧭 Petualangan di Negeri Segitiga. Pilih tempat yang ingin kamu kunjungi dulu, lalu ikuti jalurnya.</p>
      <div class="peta"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" class="jalur"/></svg>
        <span class="dek" style="left:3%;top:3%">☁️</span><span class="dek" style="right:4%;top:20%">⛰️</span><span class="dek" style="left:3%;top:40%">🌴</span>
        <span class="dek" style="right:3%;top:58%">☁️</span><span class="dek" style="left:4%;top:78%">⛰️</span><span class="dek" style="right:4%;top:93%">🌴</span>
        <span class="mulai">🏁 Mulai petualangan</span>
        ${LANGKAH2.map((x, i) => `<button class="nd" style="left:${X[i]}%;top:${Y[i]}%;--c1:${x.c1};--c2:${x.c2};--w:${i * .4}s" data-k="${x.k}" aria-label="${x.t}: ${x.n}">
          <span class="bola">${x.ik}<i class="no">${i + 1}</i></span><span class="lb"><b>${x.t}</b><small>${x.n}</small></span></button>`).join('')}</div>`
    $('kembali').onclick = () => tampilUtama(kelasNama)
    return $('isi').querySelectorAll('[data-k]').forEach(b => b.onclick = () => bukaMateri2(m, b.dataset.k))
  }
  const L = LANGKAH2[k], akhir = k === LANGKAH2.length - 1
  const konten = {
    belajar: `<div class="card"><h3>📖 Perpustakaan Kuno</h3><p class="kecil">Buka bagian satu per satu.</p>${[['A. Konsep Teorema Pythagoras', 'bagian'], ['B. Tripel Pythagoras', 'bagianB'], ['C. Segitiga Istimewa', 'bagianC'], ['D. Penerapan Teorema Pythagoras', 'bagianD'], ['E. Rumus Jarak (Pengayaan)', 'bagianE']].map(([g, k]) => `<h4 class="grp">${g}</h4>${det(M2[k])}`).join('')}</div>
      <div class="card box"><h3>🏆 Ringkasan Inti</h3><ul>${M2.ringkasan.map(r => `<li>${r}</li>`).join('')}</ul>
        <h4 class="sub">Cara mudah mengingat</h4>${M2.tips.map(t => `<div class="tip">💡 ${t}</div>`).join('')}</div>`,
    visual: `<div class="card vis"><h3>📐 Laboratorium Segitiga</h3><p class="kecil">Pilih topik, ubah angkanya, lalu lihat bagaimana rumusnya terbentuk.</p><div id="vis"></div></div>`,
    contoh: `<div class="card"><h3>🗺️ Peta Rahasia</h3><p class="kecil">Setiap contoh punya 3 bagian: konsep yang dipakai, langkah penyelesaian, dan jawaban akhir.</p></div>
      ${M2.contoh.map((c, i) => `<div class="card box"><div class="cx-head"><span class="cx-no">Contoh ${i + 1}</span><span class="cx-tag">${c.tag}</span></div>
        <div class="cx-soal">${c.q}</div><div class="cx-r">📌 <b>Konsep:</b> ${c.r}</div>
        ${c.l.map((x, n) => `<div class="lg"><span class="no">${n + 1}</span><div>${x}</div></div>`).join('')}
        <div class="cx-j">✅ <b>Jawaban:</b> ${c.j}</div></div>`).join('')}`,
    latihan: `<div class="card"><h3>⚔️ Arena Latihan</h3><p class="kecil">Tanpa batas waktu. Kalau salah, kamu boleh coba lagi atau langsung lihat pembahasan.</p><div id="latihan"></div></div>`,
    game: `<div class="card"><h3>🏰 Kuis Edukasi</h3><p class="kecil">Pilih jenis kuis. Tiap sesi 5 soal dengan batas waktu.</p><div id="game"></div></div>`
  }[L.k]
  $('isi').innerHTML = `<p><button class="btn alt" id="menu">☰ Peta petualangan</button></p>${judul}
    <p class="kecil" style="margin:2px 0 6px">Langkah ${k + 1} dari ${LANGKAH2.length}: <b>${L.t}</b> (${L.n})</p>
    <div class="prog"><span style="width:${(k + 1) * 100 / LANGKAH2.length}%"></span></div>
    <div style="margin-top:14px">${konten}</div>
    <div class="navlang">${k > 0 ? '<button class="btn alt" id="sblm">← Sebelumnya</button>' : '<span></span>'}<button class="btn" id="lanjut1">${akhir ? 'Selesai ✔' : 'Berikutnya →'}</button></div>`
  $('menu').onclick = () => bukaMateri2(m)
  if (k > 0) $('sblm').onclick = () => bukaMateri2(m, LANGKAH2[k - 1].k)
  $('lanjut1').onclick = () => akhir ? bukaMateri2(m) : bukaMateri2(m, LANGKAH2[k + 1].k)
  if (L.k === 'visual') visual2()
  if (L.k === 'latihan') latihan2()
  if (L.k === 'game') kuis2()
}

/* ---------- Latihan ---------- */
function latihan2() {
  const el = $('latihan'), Q = M2.soal; let i = 0, benar = 0, pertama = true
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
    const { data, error } = await db.rpc('simpan_latihan', { m: 2, s: benar, t: Q.length })
    $('xp').textContent = error ? 'Progres belum tersimpan.' : `Progres tersimpan. Total XP kamu: ${data}.`
  }
  tampil()
}

/* ---------- Kuis edukasi: 4 jenis, 5 soal per sesi ---------- */
function kuis2() {
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
    el.innerHTML = `<p class="kecil">Bank soal: <b>${fmt(TOTAL2)}</b> soal berbeda, dibuat dari angka-angka yang berganti. Tiap sesi berisi 5 soal dengan batas waktu. Di akhir kamu bisa melihat benar-salahnya beserta pembahasan, lalu main lagi dengan soal yang berbeda.</p>
      <div class="grid">${Object.entries(MODE).map(([k, m]) => `<div class="card materi"><div class="ikon">${m.ik}</div><h3>${m.n}</h3><p>${m.d}</p><p class="kecil">Waktu: ${wkt(m.w)}</p><button class="btn" data-m="${k}">Mulai</button></div>`).join('')}</div>`
    el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => mulai(b.dataset.m))
  }

  const mulai = mode => {
    const M = MODE[mode], lv = mode === 'cepat' || mode === 'cocok' ? [1, 1, 2, 2, 2] : [1, 1, 2, 2, 3]
    const fl = mode === 'cepat' ? f => f.int : mode === 'cocok' ? f => f.pair : () => true, soal = []
    lv.forEach(l => { for (let t = 0; t < 25; t++) { const x = tarik2(l, fl); if (mode !== 'cocok' || t === 24 || !soal.some(o => T(o.a) === T(x.a))) { soal.push(x); break } } })
    soal.forEach(x => {
      if (mode === 'biasa') x.p = pilihan2(x)
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

const _bukaSebelum2 = window.bukaMateri
window.bukaMateri = m => m.urutan === 2 ? bukaMateri2(m) : _bukaSebelum2(m)

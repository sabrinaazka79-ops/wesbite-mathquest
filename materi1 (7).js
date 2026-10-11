/* Materi 1: Bilangan Berpangkat (lengkap: penjelasan, visual, ringkasan, contoh, latihan, game) */
const sup = (b, n) => `${b}<sup>${n}</sup>`
const fmt = v => Number(v).toLocaleString('id-ID')

document.head.insertAdjacentHTML('beforeend', `<style>
  .rantai { display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin:14px 0; min-height:56px }
  .chip { min-width:48px; height:48px; padding:0 8px; border-radius:14px; background:#6c4cf122; border:2px solid var(--p); color:var(--ink); font-weight:800; font-size:1.3rem; display:flex; align-items:center; justify-content:center; animation:pop .35s both }
  .x { font-weight:800; color:var(--muted) }
  @keyframes pop { from { transform:scale(.3); opacity:0 } to { transform:scale(1); opacity:1 } }
  .robot { font-size:3.4rem; text-align:center; transition:transform .3s } .robot.full { animation:pop .5s both; transform:scale(1.2) }
  .tip { background:#16a36a1f; border:2px solid var(--ok); border-radius:12px; padding:10px 14px; margin-top:12px; font-weight:700 }
  .vis .pilih, .pilih { display:flex; gap:16px; flex-wrap:wrap; margin:14px 0 } .pilih label { display:flex; align-items:center; gap:8px; margin:0 } .pilih select { width:auto }
  .hasil { background:linear-gradient(135deg,#6c4cf122,#0ea5e922); border-radius:16px; padding:18px; text-align:center }
  .hasil .besar { font-family:'Baloo 2',sans-serif; font-size:2.6rem; font-weight:800 }
  .grid3 { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:10px; margin-top:12px }
  .grid3 > div { border:2px solid var(--line); border-radius:14px; padding:12px } .grid3 p { margin:4px 0 0 }
  .navlang { display:flex; justify-content:space-between; gap:8px; margin-top:16px }
  .peta { position:relative; height:880px; margin-top:12px; border-radius:26px; overflow:hidden; border:2px solid var(--line); background:linear-gradient(#b9e4ff, #dff3cf 55%, #f7e7b0) }
  :root[data-theme="dark"] .peta { background:linear-gradient(#1c2860, #1b3d3a 55%, #3b3320) }
  .peta svg { position:absolute; inset:0; width:100%; height:100% }
  .jalur { fill:none; stroke:#fff; stroke-width:5; stroke-dasharray:3 3; stroke-linecap:round; vector-effect:non-scaling-stroke; animation:jalan 1.2s linear infinite }
  @keyframes jalan { to { stroke-dashoffset:-6 } }
  .dek { position:absolute; font-size:2rem; opacity:.85; pointer-events:none }
  .mulai { position:absolute; left:50%; top:10px; transform:translateX(-50%); background:var(--card); color:var(--ink); font-weight:800; font-size:.85rem; padding:4px 12px; border-radius:999px; border:2px solid var(--line) }
  .nd { position:absolute; width:140px; transform:translate(-50%,-40px); background:none; border:0; padding:0; cursor:pointer; font:inherit; color:var(--ink); display:flex; flex-direction:column; align-items:center; gap:8px }
  .nd .bola { position:relative; width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg,var(--c1),var(--c2)); border:4px solid #fff; box-shadow:0 8px 18px #0003; display:flex; align-items:center; justify-content:center; font-size:2.3rem; animation:ambang 2.6s ease-in-out var(--w) infinite; transition:transform .15s }
  .nd:hover .bola, .nd:focus-visible .bola { transform:scale(1.12) } .nd:focus-visible { outline:3px solid var(--p2); outline-offset:4px; border-radius:16px }
  .nd .no { position:absolute; top:-6px; right:-6px; width:28px; height:28px; border-radius:50%; background:var(--ink); color:var(--bg); font-style:normal; font-weight:800; font-size:.9rem; display:flex; align-items:center; justify-content:center; border:2px solid #fff }
  .nd .lb { background:var(--card); border:2px solid var(--line); border-radius:14px; padding:6px 10px; text-align:center; line-height:1.2 }
  .nd .lb b { display:block; font-size:.95rem } .nd .lb small { color:var(--muted); font-size:.78rem }
  @keyframes ambang { 50% { transform:translateY(-7px) } }
  @media (prefers-reduced-motion:reduce) { .jalur, .nd .bola { animation:none } }
</style>`)

document.head.insertAdjacentHTML('beforeend', `<style>
  details.misi { border:2px solid var(--line); border-radius:16px; padding:12px 16px; margin:10px 0; background:var(--card) }
  details.misi summary { font-weight:800; cursor:pointer; font-family:'Baloo 2',sans-serif; font-size:1.1rem }
  details.misi .isi { margin-top:8px } .bub { display:flex; gap:12px; align-items:flex-start } .av { font-size:2.6rem }
  .chip.o { background:#ff7a5933; border-color:#ff7a59 } .chip.b { background:#0ea5e933; border-color:#0ea5e9 } .chip.x { opacity:.35; text-decoration:line-through; border-style:dashed }
  .baris { display:flex; flex-wrap:wrap; gap:6px; margin:8px 0 } .panah { text-align:center; font-weight:800; color:var(--muted) }
  .tabsv { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px } .tabsv button { font:inherit; font-weight:800; padding:8px 12px; border-radius:999px; border:2px solid var(--line); background:var(--bg); color:var(--ink); cursor:pointer }
  .tabsv button.on { background:var(--p); color:#fff; border-color:var(--p) }
  .tangga { display:flex; justify-content:space-between; padding:8px 14px; border-radius:12px; background:#6c4cf11f; margin:2px 0; font-weight:800; animation:pop .4s both }
  .tangga.nol { background:#16a36a33; border:2px solid var(--ok) } .turun { text-align:center; color:var(--muted); font-size:.85rem }
  .rute { display:flex; justify-content:space-between; gap:4px; margin-bottom:8px } .ttk { flex:1; text-align:center; padding:6px 2px; border-radius:12px; background:var(--bg); border:2px solid var(--line); font-size:1.3rem }
  .ttk.skrg { border-color:var(--p); background:#6c4cf122; transform:scale(1.06) } .ttk.selesai { background:#16a36a22; border-color:var(--ok) }
  .adegan { position:relative; height:210px; border-radius:20px; overflow:hidden; border:2px solid var(--line) }
  .adegan::after { content:''; position:absolute; left:0; right:0; bottom:0; height:34px; background:#0002 }
  .dk { position:absolute; top:10px; left:0; right:0; text-align:center; font-size:2rem; letter-spacing:18px; opacity:.8 }
  .hero, .mon { position:absolute; bottom:30px; font-size:3.4rem; z-index:2 } .hero { left:12%; animation:ambang 1.4s ease-in-out infinite } .mon { right:12%; font-size:4rem; animation:ambang 2s ease-in-out infinite }
  .hero.lari { animation:lari 1s forwards } .hero.kena { animation:getar .4s } .mon.marah { animation:getar .4s, besar .4s forwards } .mon.luka { animation:getar .5s } .mon.kalah { animation:kalah .8s forwards }
  .hpbar { position:absolute; top:8px; right:12px; z-index:3 }
  .soalbesar { font-size:1.7rem; font-weight:800; margin:6px 0 }
  .pilgrid { display:grid; grid-template-columns:1fr 1fr; gap:8px } .pilgrid .opsi { margin:0; text-align:center; font-size:1.1rem }
  @keyframes lari { to { left:78% } } @keyframes getar { 25% { transform:translateX(-10px) } 75% { transform:translateX(10px) } }
  @keyframes besar { to { transform:scale(1.2) } } @keyframes kalah { to { transform:rotate(540deg) scale(0); opacity:0 } }
  @keyframes jatuh { from { transform:translateY(-30px); opacity:1 } to { transform:translateY(260px); opacity:0 } }
  .konfeti { position:absolute; top:0; font-size:1.6rem; animation:jatuh 2.4s ease-in infinite; pointer-events:none }
  .peti { font-size:4.5rem; text-align:center; animation:pop .6s both }
</style>`)

document.head.insertAdjacentHTML('beforeend', `<style>
  .rumus { background:var(--bg); border:2px dashed var(--p); border-radius:12px; padding:8px 12px; text-align:center; font-weight:800; margin:8px 0 }
  .sub { margin:16px 0 4px; color:var(--p); font-family:'Baloo 2',sans-serif; font-size:1.05rem }
  .pec { display:inline-flex; flex-direction:column; align-items:center; vertical-align:middle; line-height:1.15; margin:0 2px; font-weight:800 }
  .pec > span:first-child { border-bottom:2px solid currentColor; padding:0 4px } .pec > span:last-child { padding:0 4px }
  .batang { height:18px; background:var(--line); border-radius:9px; overflow:hidden; margin:3px 0 10px } .batang i { display:block; height:100%; background:var(--p2); transition:width .4s }
</style>`)

document.head.insertAdjacentHTML('beforeend', `<style>
  .cx-head { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px } .cx-no { background:var(--p); color:#fff; font-weight:800; border-radius:999px; padding:3px 14px }
  .cx-tag { color:var(--muted); font-weight:800; font-size:.85rem } .cx-soal { font-weight:800; font-size:1.15rem; margin:6px 0 10px }
  .cx-r { background:var(--bg); border-left:5px solid var(--p2); border-radius:8px; padding:8px 12px; margin-bottom:10px; font-size:.95rem }
  .lg { display:flex; gap:10px; align-items:flex-start; margin:8px 0 } .lg .no { flex:none; width:28px; height:28px; border-radius:50%; background:var(--p); color:#fff; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:.9rem }
  .cx-j { background:#16a36a1f; border:2px solid var(--ok); border-radius:12px; padding:10px 14px; margin-top:10px }
  .rv { background:var(--card); border:2px solid var(--line); border-radius:14px; padding:12px; margin:10px 0 } .rv.b { border-left:6px solid var(--ok) } .rv.s { border-left:6px solid var(--err) }
  .rq { font-weight:800; font-size:1.1rem; margin:4px 0 } .pb { background:var(--bg); border-radius:10px; padding:8px 12px; margin-top:6px } .pb ol { margin:4px 0 0; padding-left:20px }
  .slot { border:2px dashed var(--line); border-radius:10px; padding:8px 10px; margin:6px 0; min-height:38px }
  .cocok { display:grid; grid-template-columns:1fr 1fr; gap:10px } .opsi.pilih { border-color:var(--p); background:#6c4cf122 } .opsi.terpakai { opacity:.65 } .lbl { float:right; color:var(--p) }
  .akar { white-space:nowrap } .akar sup { font-size:.65em; margin-right:-1px } .ba { border-top:2px solid currentColor; padding:0 2px; margin-left:1px }
  h4.grp { margin:16px 0 4px; padding:6px 12px; border-radius:10px; background:var(--p); color:#fff; font-family:'Baloo 2',sans-serif; font-size:1.05rem }
  .grupv button { border-radius:12px }
</style>`)

const ak = (n, x) => `<span class="akar">${n !== 2 ? `<sup>${n}</sup>` : ''}√<span class="ba">${x}</span></span>`
const rt = (k, r) => (k === 1 ? '' : k) + ak(2, r)
const simp = n => { let k = 1; for (let d = 2; d * d <= n; d++) while (n % (d * d) === 0) { n /= d * d; k *= d } return [k, n] }
const fr = (p, q) => `<span class="pec"><span>${p}</span><span>${q}</span></span>`
const ps = t => `<div class="bub"><span class="av">🧙‍♂️</span><div>${t}</div></div>`
const M1 = {
  bagian: [
    ['1. Pengertian Bilangan Berpangkat', ps('Halo, Petualang! Aku Profesor Pangkat. Kita mulai dari dasarnya dulu ya.') + `
      <p>Perhatikan perkalian ini: 2 × 2 × 2 × 2 × 2. Angka 2 diulang sebanyak 5 kali. Daripada menulis panjang-panjang, kita singkat menjadi <b>${sup(2, 5)}</b>.</p>
      <div class="rumus">${sup('a', 'n')} = a × a × a × ... × a (sebanyak n faktor)</div>
      <ul><li><b>a</b> disebut <b>basis</b>, yaitu angka yang dikalikan berulang.</li><li><b>n</b> disebut <b>pangkat</b> (eksponen), yaitu banyaknya pengulangan.</li><li>Dibaca "a pangkat n".</li></ul>
      <p>Contoh: ${sup(3, 4)} = 3 × 3 × 3 × 3 = 81. Contoh dalam cerita: 1 bakteri membelah menjadi 2 setiap jam, jadi setelah 5 jam ada ${sup(2, 5)} = 32 bakteri.</p>
      <div class="tip">⚠️ Hati-hati! ${sup(2, 3)} bukan 2 × 3 = 6, melainkan 2 × 2 × 2 = 8. Perhatikan juga: (−2)<sup>2</sup> = 4, sedangkan −2<sup>2</sup> = −4 (tanda minus tidak ikut dipangkatkan).</div>`, true],
    ['2. Sifat-sifat Bilangan Berpangkat', `
      <h4 class="sub">a. Sifat perkalian bilangan berpangkat</h4>
      <div class="rumus">${sup('a', 'm')} × ${sup('a', 'n')} = ${sup('a', 'm+n')}</div>
      <p>Hitung ${sup(2, 3)} × ${sup(2, 4)}. Kalau ditulis panjang: (2×2×2) × (2×2×2×2). Totalnya ada 3 + 4 = 7 faktor 2, jadi hasilnya ${sup(2, 7)} = 128. <b>Syarat: basisnya harus sama.</b> Pangkat <b>dijumlahkan</b>.</p>
      <h4 class="sub">b. Sifat pembagian bilangan berpangkat</h4>
      <div class="rumus">${sup('a', 'm')} ÷ ${sup('a', 'n')} = ${sup('a', 'm−n')} (a ≠ 0)</div>
      <p>Hitung ${sup(2, 5)} ÷ ${sup(2, 2)}. Tulis sebagai pecahan: (2×2×2×2×2) / (2×2). Dua faktor 2 di atas dicoret dengan dua faktor 2 di bawah, sisa 3 faktor, yaitu ${sup(2, 3)} = 8. Pangkat <b>dikurangkan</b>.</p>
      <h4 class="sub">c. Sifat perpangkatan bilangan berpangkat</h4>
      <div class="rumus">(${sup('a', 'm')})<sup>n</sup> = ${sup('a', 'm×n')}</div>
      <p>(${sup(2, 3)})<sup>2</sup> artinya ${sup(2, 3)} dikalikan sebanyak 2 kali: ${sup(2, 3)} × ${sup(2, 3)} = ${sup(2, 6)} = 64. Jalan pintasnya, pangkat <b>dikalikan</b>: 3 × 2 = 6.</p>
      <h4 class="sub">d. Perpangkatan pada perkalian bilangan</h4>
      <div class="rumus">(a × b)<sup>n</sup> = ${sup('a', 'n')} × ${sup('b', 'n')}</div>
      <p>(2 × 3)<sup>3</sup> = (2×3) × (2×3) × (2×3). Kelompokkan angka yang sama: (2×2×2) × (3×3×3) = ${sup(2, 3)} × ${sup(3, 3)} = 8 × 27 = 216. Jadi pangkatnya <b>dibagikan ke setiap faktor</b>.</p>`],
    ['3. Bilangan Pangkat Nol dan Pangkat Negatif', `
      <p>Perhatikan pola tangga ini. Setiap turun satu anak tangga, pangkat berkurang 1 dan hasilnya <b>dibagi 2</b>:</p>
      <p style="text-align:center">${sup(2, 3)} = 8 → ${sup(2, 2)} = 4 → ${sup(2, 1)} = 2 → <b>${sup(2, 0)} = 1</b> → <b>${sup(2, '−1')} = 1/2</b> → ${sup(2, '−2')} = 1/4</p>
      <div class="rumus">${sup('a', 0)} = 1 (a ≠ 0)</div><div class="rumus">${sup('a', '−n')} = 1 / ${sup('a', 'n')}</div>
      <p>Contoh: ${sup(5, 0)} = 1 dan ${sup(2, '−3')} = 1/${sup(2, 3)} = 1/8.</p>
      <div class="tip">💡 Pangkat negatif tidak membuat hasilnya negatif. Artinya hanya kebalikan (dibalik menjadi pecahan).</div>`],
    ['4. Bilangan Pecahan Berpangkat', `
      <p>Bagaimana kalau yang dipangkatkan adalah pecahan? Pecahan dikalikan dirinya sendiri: pembilang dikali pembilang, penyebut dikali penyebut.</p>
      <div class="rumus">(${fr('a', 'b')})<sup>n</sup> = ${fr(sup('a', 'n'), sup('b', 'n'))} (b ≠ 0)</div>
      <p>Contoh: (${fr(2, 3)})<sup>3</sup> = ${fr(2, 3)} × ${fr(2, 3)} × ${fr(2, 3)} = ${fr(8, 27)}. Pembilang dan penyebut <b>sama-sama dipangkatkan</b>.</p>
      <p>Pangkat negatif pada pecahan: pecahannya dibalik. (${fr(2, 3)})<sup>−2</sup> = (${fr(3, 2)})<sup>2</sup> = ${fr(9, 4)}.</p>`],
    ['5. Penerapan Bilangan Berpangkat dalam Kehidupan Sehari-hari', `
      <p>Bilangan berpangkat dipakai untuk menuliskan angka yang bertambah sangat cepat, atau yang sangat besar dan sangat kecil. Beberapa contohnya:</p>
      <h4 class="sub">a. Pertumbuhan yang terus berlipat</h4>
      <p>Satu sel bakteri membelah menjadi 2. Setelah 6 kali membelah ada ${sup(2, 6)} = 64 sel. Selembar kertas yang dilipat dua berulang kali juga begitu: 1 lipatan jadi 2 lapis, 2 lipatan jadi 4 lapis, dan 10 lipatan sudah menjadi ${sup(2, 10)} = 1.024 lapis.</p>
      <h4 class="sub">b. Pesan berantai atau video viral</h4>
      <p>Jika setiap orang meneruskan pesan ke 3 orang baru, maka putaran ke-1 ada 3 orang, ke-2 ada ${sup(3, 2)} = 9 orang, dan putaran ke-5 sudah ada ${sup(3, 5)} = 243 orang.</p>
      <h4 class="sub">c. Luas dan volume</h4>
      <p>Luas persegi bersisi s adalah ${sup('s', 2)}, dan volume kubus bersisi s adalah ${sup('s', 3)}. Kardus berbentuk kubus dengan sisi 5 dm punya volume ${sup(5, 3)} = 125 dm³ = 125 liter.</p>
      <h4 class="sub">d. Ukuran data di komputer</h4>
      <p>Dalam hitungan komputer, 1 kilobyte (KB) = ${sup(2, 10)} byte = 1.024 byte. Karena itu ukuran memori sering berupa 2, 4, 8, 16, 32, 64 (semuanya bilangan berpangkat dari 2).</p>
      <h4 class="sub">e. Satuan ukuran</h4>
      <p>1 kilometer = ${sup(10, 3)} meter = 1.000 meter. Sebaliknya, 1 milimeter = ${sup(10, '−3')} meter = 1/1.000 meter. Pangkat negatif dipakai untuk ukuran yang sangat kecil.</p>
      <div class="tip">💡 Kalau ada sesuatu yang bertambah dengan cara dikalikan terus-menerus (×2, ×3, dan seterusnya), biasanya itu bilangan berpangkat.</div>`]
  ],
  ringkasan: [
    `Bentuk umum: ${sup('a', 'n')} = a × a × ... × a sebanyak n kali (a = basis, n = pangkat).`,
    `Perkalian, basis sama: ${sup('a', 'm')} × ${sup('a', 'n')} = ${sup('a', 'm+n')}.`,
    `Pembagian, basis sama: ${sup('a', 'm')} ÷ ${sup('a', 'n')} = ${sup('a', 'm−n')}.`,
    `Perpangkatan: (${sup('a', 'm')})<sup>n</sup> = ${sup('a', 'm×n')}.`,
    `Pangkat pada perkalian: (a × b)<sup>n</sup> = ${sup('a', 'n')} × ${sup('b', 'n')}.`,
    `Pangkat nol dan negatif: ${sup('a', 0)} = 1 dan ${sup('a', '−n')} = 1 / ${sup('a', 'n')}.`,
    `Pecahan berpangkat: (${fr('a', 'b')})<sup>n</sup> = ${fr(sup('a', 'n'), sup('b', 'n'))}.`,
    `Penerapan: pertumbuhan berlipat (${sup(2, 'n')}), volume kubus (${sup('s', 3)}), dan satuan seperti ${sup(10, 3)} serta ${sup(10, '−3')}.`
  ],
  tips: ['Perkalian → pangkat <b>dijumlah</b>. Pembagian → pangkat <b>dikurang</b>. Pangkat dipangkatkan → pangkat <b>dikali</b>.', 'Sifat perkalian dan pembagian hanya berlaku kalau <b>basisnya sama</b>.', 'Selalu cek: tanda minus pada pangkat berarti kebalikan, bukan hasil negatif.'],
  contoh: [
    { tag: 'Pengertian', r: `${sup('a', 'n')} = a × a × ... × a (sebanyak n kali)`, q: 'Tuliskan 5 × 5 × 5 × 5 dalam bentuk pangkat, lalu hitung nilainya.', l: ['Hitung berapa kali angka 5 muncul: ada 4 kali.', 'Tulis dalam bentuk pangkat: 5<sup>4</sup>.', 'Hitung bertahap: 5 × 5 = 25, lalu 25 × 5 = 125, lalu 125 × 5 = 625.'], j: '5<sup>4</sup> = 625' },
    { tag: 'Perkalian', r: `${sup('a', 'm')} × ${sup('a', 'n')} = ${sup('a', 'm+n')} (basis harus sama)`, q: `Sederhanakan ${sup(2, 3)} × ${sup(2, 4)}.`, l: ['Cek basis: keduanya 2, jadi sifat perkalian boleh dipakai.', 'Jumlahkan pangkatnya: 3 + 4 = 7.', 'Tulis hasilnya: 2<sup>7</sup>.', 'Hitung nilainya: 2<sup>7</sup> = 128.'], j: '128' },
    { tag: 'Pembagian', r: `${sup('a', 'm')} ÷ ${sup('a', 'n')} = ${sup('a', 'm−n')} (basis harus sama)`, q: `Sederhanakan ${sup(5, 7)} ÷ ${sup(5, 4)}.`, l: ['Cek basis: keduanya 5, jadi sifat pembagian boleh dipakai.', 'Kurangkan pangkatnya: 7 − 4 = 3.', 'Tulis hasilnya: 5<sup>3</sup>.', 'Hitung nilainya: 5 × 5 × 5 = 125.'], j: '125' },
    { tag: 'Perpangkatan', r: `(${sup('a', 'm')})<sup>n</sup> = ${sup('a', 'm×n')}`, q: `Hitunglah (${sup(3, 2)})<sup>3</sup>.`, l: ['Ada pangkat di dalam dan di luar kurung, jadi pangkatnya dikalikan.', 'Kalikan: 2 × 3 = 6, jadi hasilnya 3<sup>6</sup>.', 'Hitung nilainya: 3<sup>6</sup> = 729.'], j: '729' },
    { tag: 'Pangkat pada perkalian', r: `(a × b)<sup>n</sup> = ${sup('a', 'n')} × ${sup('b', 'n')}`, q: 'Hitunglah (2 × 5)<sup>2</sup>.', l: ['Pangkat 2 dibagikan ke setiap faktor: 2<sup>2</sup> × 5<sup>2</sup>.', 'Hitung masing-masing: 2<sup>2</sup> = 4 dan 5<sup>2</sup> = 25.', 'Kalikan: 4 × 25 = 100.', 'Cek: (2 × 5) = 10, lalu 10<sup>2</sup> = 100. Hasilnya sama ✔.'], j: '100' },
    { tag: 'Pangkat nol dan negatif', r: `${sup('a', 0)} = 1 dan ${sup('a', '−n')} = 1 / ${sup('a', 'n')}`, q: `Hitunglah ${sup(4, 0)} + ${sup(3, '−2')}.`, l: ['Pangkat nol: 4<sup>0</sup> = 1.', 'Pangkat negatif jadi kebalikan: 3<sup>−2</sup> = 1 / 3<sup>2</sup> = 1/9.', 'Jumlahkan: 1 + 1/9 = 9/9 + 1/9 = 10/9.'], j: '10/9' },
    { tag: 'Pecahan berpangkat', r: `(${fr('a', 'b')})<sup>n</sup> = ${fr(sup('a', 'n'), sup('b', 'n'))}`, q: `Hitunglah (${fr(2, 3)})<sup>3</sup>.`, l: ['Pembilang dan penyebut sama-sama dipangkatkan 3.', 'Pembilang: 2<sup>3</sup> = 2 × 2 × 2 = 8.', 'Penyebut: 3<sup>3</sup> = 3 × 3 × 3 = 27.', 'Susun kembali menjadi pecahan: 8/27.'], j: '8/27' },
    { tag: 'Gabungan sifat', r: 'Kerjakan dari kiri ke kanan, gunakan sifat yang sesuai', q: `Sederhanakan ${sup(2, 5)} × ${sup(2, 3)} ÷ ${sup(2, 6)}.`, l: ['Kerjakan perkalian dulu: 2<sup>5</sup> × 2<sup>3</sup> = 2<sup>5+3</sup> = 2<sup>8</sup>.', 'Lanjut pembagian: 2<sup>8</sup> ÷ 2<sup>6</sup> = 2<sup>8−6</sup> = 2<sup>2</sup>.', 'Hitung nilainya: 2<sup>2</sup> = 4.'], j: '4' },
    { tag: 'Penerapan sehari-hari', r: `Penggandaan berulang = ${sup(2, 'n')}`, q: 'Selembar kertas dilipat dua berulang kali. Setiap lipatan menggandakan jumlah lapisnya. Berapa lapis kertas setelah 6 kali dilipat?', l: ['Tiap lipatan, jumlah lapis dikali 2.', 'Setelah 6 lipatan: 2 × 2 × 2 × 2 × 2 × 2 = 2<sup>6</sup>.', 'Hitung bertahap: 2, 4, 8, 16, 32, 64.'], j: '64 lapis' }
  ],
  soal: [
    { q: `Berapakah nilai ${sup(2, 5)}?`, o: ['10', '25', '32', '64'], j: 2, p: '2 × 2 × 2 × 2 × 2 = 32. Pangkat berarti dikalikan berulang, bukan dikali dengan pangkatnya.' },
    { q: 'Bentuk pangkat dari 4 × 4 × 4 adalah ...', o: [sup(4, 3), sup(3, 4), '4 × 3', '12'], j: 0, p: 'Angka 4 diulang 3 kali, jadi 4<sup>3</sup>.' },
    { q: `${sup(3, 2)} × ${sup(3, 3)} = ...`, o: [sup(3, 6), sup(3, 5), sup(9, 5), sup(3, 1)], j: 1, p: 'Basis sama dikali, pangkat dijumlah: 2 + 3 = 5, jadi 3<sup>5</sup>.' },
    { q: `${sup(7, 6)} ÷ ${sup(7, 2)} = ...`, o: [sup(7, 8), sup(7, 3), sup(7, 4), sup(1, 4)], j: 2, p: 'Basis sama dibagi, pangkat dikurang: 6 − 2 = 4, jadi 7<sup>4</sup>.' },
    { q: `(${sup(5, 2)})<sup>3</sup> = ...`, o: [sup(5, 5), sup(5, 6), sup(5, 8), sup(15, 2)], j: 1, p: 'Perpangkatan: pangkat dikalikan, 2 × 3 = 6, jadi 5<sup>6</sup>.' },
    { q: '(2 × 3)<sup>2</sup> = ...', o: ['12', '36', '18', '8'], j: 1, p: 'Pangkat dibagikan: 2<sup>2</sup> × 3<sup>2</sup> = 4 × 9 = 36. Cek: 6<sup>2</sup> = 36.' },
    { q: `Berapakah nilai ${sup(9, 0)}?`, o: ['0', '1', '9', 'Tidak terdefinisi'], j: 1, p: 'Bilangan apa pun (selain 0) berpangkat nol hasilnya 1.' },
    { q: `${sup(2, '−3')} = ...`, o: ['−8', '−6', '1/6', '1/8'], j: 3, p: 'Pangkat negatif berarti kebalikan: 1 / 2<sup>3</sup> = 1/8. Hasilnya tidak negatif.' },
    { q: `(${fr(2, 3)})<sup>2</sup> = ...`, o: [fr(4, 9), fr(4, 3), fr(2, 9), fr(4, 6)], j: 0, p: 'Pembilang dan penyebut sama-sama dipangkatkan: 2<sup>2</sup> / 3<sup>2</sup> = 4/9.' },
    { q: `${sup(2, 4)} × ${sup(2, 3)} ÷ ${sup(2, 5)} = ...`, o: ['2', '4', '8', '16'], j: 1, p: '2<sup>4+3</sup> = 2<sup>7</sup>, lalu 2<sup>7−5</sup> = 2<sup>2</sup> = 4.' }
  ]
}

M1.bagianB = [
  ['B.1 Mengubah Bilangan Berpangkat Pecahan ke Bentuk Akar', `
    <p>Di Bagian A pangkatnya bilangan bulat. Sekarang pangkatnya boleh <b>pecahan</b>, dan ternyata pangkat pecahan sama dengan <b>akar</b>.</p>
    <p>Kamu sudah kenal akar kuadrat: ${ak(2, 9)} = 3, karena 3 × 3 = 9. Akar adalah "kebalikan" dari pangkat. Ada juga akar pangkat tiga: ${ak(3, 8)} = 2, karena 2 × 2 × 2 = 8.</p>
    <div class="rumus">${sup('a', fr(1, 'n'))} = ${ak('n', 'a')}</div>
    <div class="rumus">${sup('a', fr('m', 'n'))} = ${ak('n', sup('a', 'm'))} = (${ak('n', 'a')})<sup>m</sup></div>
    <ul><li>Penyebut pangkat (n) menjadi <b>indeks akar</b> (akar ke-n).</li><li>Pembilang pangkat (m) menjadi <b>pangkat bilangan di dalam akar</b>.</li><li>Kalau indeksnya 2, angka 2 tidak ditulis. ${ak(2, 'a')} dibaca "akar a".</li></ul>
    <p>Contoh: ${sup(9, fr(1, 2))} = ${ak(2, 9)} = 3, lalu ${sup(8, fr(1, 3))} = ${ak(3, 8)} = 2, dan ${sup(16, fr(3, 4))} = (${ak(4, 16)})<sup>3</sup> = 2<sup>3</sup> = 8.</p>
    <div class="tip">💡 Ingat: "penyebut jadi indeks akar, pembilang jadi pangkat". Misalnya ${sup(5, fr(2, 3))} = ${ak(3, sup(5, 2))}.</div>`],
  ['B.2 Sifat-sifat Operasi Aljabar Bilangan Bentuk Akar', `
    <h4 class="sub">Menyederhanakan bentuk akar (dipakai di semua operasi)</h4>
    <div class="rumus">${ak(2, 'a × b')} = ${ak(2, 'a')} × ${ak(2, 'b')}</div>
    <p>Cari faktor kuadrat (4, 9, 16, 25, ...) di dalam akar. ${ak(2, 50)} = ${ak(2, '25 × 2')} = ${ak(2, 25)} × ${ak(2, 2)} = 5${ak(2, 2)}.</p>
    <h4 class="sub">a. Penjumlahan dan pengurangan bentuk akar</h4>
    <div class="rumus">p${ak(2, 'c')} + q${ak(2, 'c')} = (p + q)${ak(2, 'c')} dan p${ak(2, 'c')} − q${ak(2, 'c')} = (p − q)${ak(2, 'c')}</div>
    <p>Hanya <b>akar sejenis</b> (isi akarnya sama) yang boleh dijumlah atau dikurang. Bayangkan ${ak(2, 'c')} seperti sebuah benda: 3 apel + 2 apel = 5 apel, jadi 3${ak(2, 5)} + 2${ak(2, 5)} = 5${ak(2, 5)}. Tetapi ${ak(2, 2)} + ${ak(2, 3)} tidak bisa disatukan (seperti apel + jeruk). Kalau belum sejenis, sederhanakan dulu: ${ak(2, 12)} + ${ak(2, 27)} = 2${ak(2, 3)} + 3${ak(2, 3)} = 5${ak(2, 3)}.</p>
    <h4 class="sub">b. Perkalian bentuk akar</h4>
    <div class="rumus">${ak(2, 'a')} × ${ak(2, 'b')} = ${ak(2, 'a × b')} dan p${ak(2, 'a')} × q${ak(2, 'b')} = pq${ak(2, 'a × b')}</div>
    <p>Koefisien dikali koefisien, isi akar dikali isi akar. 2${ak(2, 3)} × 4${ak(2, 5)} = 8${ak(2, 15)}. Ingat juga ${ak(2, 'a')} × ${ak(2, 'a')} = a, misalnya ${ak(2, 7)} × ${ak(2, 7)} = 7.</p>
    <h4 class="sub">c. Pembagian bentuk akar</h4>
    <div class="rumus">${ak(2, 'a')} ÷ ${ak(2, 'b')} = ${ak(2, 'a ÷ b')} (b ≠ 0)</div>
    <p>${ak(2, 48)} ÷ ${ak(2, 3)} = ${ak(2, 16)} = 4. Untuk 12${ak(2, 10)} ÷ 4${ak(2, 5)}: bagi koefisiennya 12 ÷ 4 = 3 dan isi akarnya 10 ÷ 5 = 2, jadi hasilnya 3${ak(2, 2)}.</p>`],
  ['B.3 Merasionalkan Penyebut', `
    <p>Penyebut pecahan sebaiknya bukan bentuk akar. Mengubah penyebut berakar menjadi bilangan bulat disebut <b>merasionalkan penyebut</b>. Triknya: kalikan dengan bentuk "1" yang sesuai, supaya nilai pecahan tidak berubah.</p>
    <h4 class="sub">Penyebut berbentuk ${ak(2, 'b')}</h4>
    <div class="rumus">${fr('a', ak(2, 'b'))} × ${fr(ak(2, 'b'), ak(2, 'b'))} = ${fr(`a${ak(2, 'b')}`, 'b')}</div>
    <p>Contoh: ${fr(6, ak(2, 3))} × ${fr(ak(2, 3), ak(2, 3))} = ${fr(`6${ak(2, 3)}`, 3)} = 2${ak(2, 3)}.</p>
    <h4 class="sub">Penyebut berbentuk (${ak(2, 'b')} ± ${ak(2, 'c')}): kalikan dengan sekawannya</h4>
    <p>Sekawan dari (${ak(2, 'b')} + ${ak(2, 'c')}) adalah (${ak(2, 'b')} − ${ak(2, 'c')}), dan sebaliknya. Hasil kalinya tidak lagi berakar: (${ak(2, 'b')} + ${ak(2, 'c')})(${ak(2, 'b')} − ${ak(2, 'c')}) = b − c.</p>
    <p>Contoh: ${fr(2, `${ak(2, 3)} + ${ak(2, 2)}`)} × ${fr(`${ak(2, 3)} − ${ak(2, 2)}`, `${ak(2, 3)} − ${ak(2, 2)}`)} = ${fr(`2(${ak(2, 3)} − ${ak(2, 2)})`, '3 − 2')} = 2${ak(2, 3)} − 2${ak(2, 2)}.</p>`]
]
M1.bagianC = [
  ['C.1 Penulisan Bentuk Baku', `
    <p>Bagaimana menulis jarak Bumi ke Matahari (150.000.000 km) atau ukuran virus (0,0000001 m) tanpa pusing menghitung nolnya? Pakai <b>bentuk baku</b> (notasi ilmiah).</p>
    <div class="rumus">a × 10<sup>n</sup> dengan 1 ≤ a &lt; 10 dan n bilangan bulat</div>
    <ol><li>Geser koma sampai tepat di belakang <b>angka pertama yang bukan nol</b> (itu nilai a).</li><li>Hitung berapa langkah koma bergeser, itu nilai |n|.</li><li>Koma bergeser ke <b>kiri</b> → n positif. Koma bergeser ke <b>kanan</b> → n negatif.</li></ol>
    <p>Contoh: 45.000.000 = 4,5 × ${sup(10, 7)} (koma bergeser 7 langkah ke kiri). 0,00032 = 3,2 × ${sup(10, '−4')} (koma bergeser 4 langkah ke kanan).</p>
    <p>Penerapan: jarak Bumi ke Matahari ≈ 1,5 × ${sup(10, 8)} km, dan ukuran virus ≈ 1 × ${sup(10, '−7')} m.</p>
    <div class="tip">⚠️ 45 × ${sup(10, 6)} bukan bentuk baku, karena angka depannya (45) tidak di antara 1 dan 10. Yang benar 4,5 × ${sup(10, 7)}.</div>`],
  ['C.2 Penulisan Bentuk Biasa', `
    <p>Bentuk biasa adalah cara kita menulis bilangan sehari-hari, misalnya 670.000 atau 0,0025. Untuk mengubah bentuk baku kembali ke bentuk biasa, lakukan kebalikannya:</p>
    <ul><li>Pangkat 10 <b>positif</b> → koma digeser ke <b>kanan</b> sebanyak n langkah (tambahkan nol kalau angkanya habis).</li><li>Pangkat 10 <b>negatif</b> → koma digeser ke <b>kiri</b> sebanyak |n| langkah (tambahkan nol di depan).</li></ul>
    <p>Contoh: 6,7 × ${sup(10, 5)} = 670.000 (koma ke kanan 5 langkah). 2,5 × ${sup(10, '−3')} = 0,0025 (koma ke kiri 3 langkah).</p>
    <div class="tip">💡 Pangkat positif membuat bilangan besar, pangkat negatif membuat bilangan kecil. Dari bentuk biasa ke baku: koma ke kiri berarti pangkat positif. Dari baku ke biasa arahnya berlawanan.</div>`]
]
M1.ringkasan.push(
  `Pangkat pecahan: ${sup('a', fr(1, 'n'))} = ${ak('n', 'a')} dan ${sup('a', fr('m', 'n'))} = ${ak('n', sup('a', 'm'))} (penyebut jadi indeks akar, pembilang jadi pangkat).`,
  `Sederhanakan akar dengan faktor kuadrat: ${ak(2, 50)} = ${ak(2, '25 × 2')} = 5${ak(2, 2)}.`,
  `Jumlah dan kurang akar (hanya akar sejenis): p${ak(2, 'c')} ± q${ak(2, 'c')} = (p ± q)${ak(2, 'c')}.`,
  `Kali dan bagi akar: ${ak(2, 'a')} × ${ak(2, 'b')} = ${ak(2, 'a × b')}, dan ${ak(2, 'a')} ÷ ${ak(2, 'b')} = ${ak(2, 'a ÷ b')}.`,
  `Merasionalkan: ${fr('a', ak(2, 'b'))} = ${fr(`a${ak(2, 'b')}`, 'b')}. Untuk (${ak(2, 'b')} ± ${ak(2, 'c')}), kalikan dengan sekawannya.`,
  'Bentuk baku: a × 10<sup>n</sup> dengan 1 ≤ a &lt; 10 dan n bilangan bulat.',
  'Biasa → baku: koma ke kiri berarti pangkat positif, koma ke kanan berarti pangkat negatif. Baku → biasa: arahnya berlawanan.'
)
M1.tips.push('Akar itu seperti benda: hanya akar sejenis (isi akarnya sama) yang boleh dijumlah atau dikurang.', 'Pada bentuk baku, angka depan harus 1 sampai kurang dari 10. Kalau tidak, geser lagi komanya.')
M1.contoh.push(
  { tag: 'B.1 Pangkat pecahan ke akar', r: `${sup('a', fr('m', 'n'))} = ${ak('n', sup('a', 'm'))}`, q: `Ubah ${sup(3, fr(2, 5))} ke bentuk akar.`, l: ['Penyebut pangkat (5) menjadi indeks akar, jadi akar pangkat 5.', 'Pembilang pangkat (2) menjadi pangkat bilangan di dalam akar: 3<sup>2</sup>.', `Susun hasilnya: ${ak(5, sup(3, 2))} = ${ak(5, 9)}.`], j: ak(5, 9) },
  { tag: 'B.1 Pangkat pecahan ke akar', r: `${sup('a', fr('m', 'n'))} = (${ak('n', 'a')})<sup>m</sup>`, q: `Hitunglah ${sup(27, fr(2, 3))}.`, l: ['Pangkat 2/3 berarti akar pangkat 3, lalu hasilnya dipangkatkan 2.', `Hitung akarnya dulu: ${ak(3, 27)} = 3, karena 3 × 3 × 3 = 27.`, 'Pangkatkan hasilnya: 3<sup>2</sup> = 9.'], j: '9' },
  { tag: 'B.2 Penjumlahan dan pengurangan', r: `p${ak(2, 'c')} ± q${ak(2, 'c')} = (p ± q)${ak(2, 'c')} (isi akar harus sama)`, q: `Sederhanakan 3${ak(2, 5)} + 2${ak(2, 5)} − ${ak(2, 5)}.`, l: ['Isi akarnya sama (5), jadi boleh dijumlah dan dikurang.', `Operasikan koefisiennya: 3 + 2 − 1 = 4. (Ingat, ${ak(2, 5)} berarti 1${ak(2, 5)}.)`, `Tulis hasilnya: 4${ak(2, 5)}.`], j: `4${ak(2, 5)}` },
  { tag: 'B.2 Penjumlahan (sederhanakan dulu)', r: `Sederhanakan akar dulu supaya isi akarnya sejenis`, q: `Sederhanakan ${ak(2, 12)} + ${ak(2, 27)}.`, l: [`Sederhanakan ${ak(2, 12)} = ${ak(2, 4)} × ${ak(2, 3)} = 2${ak(2, 3)}.`, `Sederhanakan ${ak(2, 27)} = ${ak(2, 9)} × ${ak(2, 3)} = 3${ak(2, 3)}.`, `Sekarang isi akarnya sama: 2${ak(2, 3)} + 3${ak(2, 3)} = 5${ak(2, 3)}.`], j: `5${ak(2, 3)}` },
  { tag: 'B.2 Perkalian', r: `${ak(2, 'a')} × ${ak(2, 'b')} = ${ak(2, 'a × b')}`, q: `Hitunglah ${ak(2, 6)} × ${ak(2, 15)}.`, l: [`Kalikan isi akarnya: ${ak(2, 6)} × ${ak(2, 15)} = ${ak(2, 90)}.`, `Sederhanakan: 90 = 9 × 10, jadi ${ak(2, 90)} = ${ak(2, 9)} × ${ak(2, 10)} = 3${ak(2, 10)}.`, `Isi akar 10 tidak punya faktor kuadrat lagi, jadi sudah sederhana.`], j: `3${ak(2, 10)}` },
  { tag: 'B.2 Perkalian dengan koefisien', r: `p${ak(2, 'a')} × q${ak(2, 'b')} = pq${ak(2, 'a × b')}`, q: `Hitunglah 2${ak(2, 3)} × 4${ak(2, 5)}.`, l: ['Kalikan koefisiennya: 2 × 4 = 8.', `Kalikan isi akarnya: ${ak(2, 3)} × ${ak(2, 5)} = ${ak(2, 15)}.`, `Gabungkan keduanya: 8${ak(2, 15)}.`], j: `8${ak(2, 15)}` },
  { tag: 'B.2 Pembagian', r: `${ak(2, 'a')} ÷ ${ak(2, 'b')} = ${ak(2, 'a ÷ b')}`, q: `Hitunglah ${ak(2, 72)} ÷ ${ak(2, 6)}.`, l: [`Bagi isi akarnya: ${ak(2, 72)} ÷ ${ak(2, 6)} = ${ak(2, 12)}.`, `Sederhanakan: 12 = 4 × 3, jadi ${ak(2, 12)} = 2${ak(2, 3)}.`], j: `2${ak(2, 3)}` },
  { tag: 'B.3 Merasionalkan penyebut', r: 'Kalikan pembilang dan penyebut dengan akar yang sama', q: `Rasionalkan penyebut ${fr(6, ak(2, 3))}.`, l: [`Kalikan pembilang dan penyebut dengan ${ak(2, 3)} (nilainya 1, jadi pecahan tidak berubah).`, `Penyebut: ${ak(2, 3)} × ${ak(2, 3)} = 3. Pembilang: 6 × ${ak(2, 3)} = 6${ak(2, 3)}.`, `Pecahan menjadi ${fr(`6${ak(2, 3)}`, 3)}. Sederhanakan 6 ÷ 3 = 2, jadi hasilnya 2${ak(2, 3)}.`], j: `2${ak(2, 3)}` },
  { tag: 'B.3 Merasionalkan (sekawan)', r: `Sekawan dari (${ak(2, 'b')} + ${ak(2, 'c')}) adalah (${ak(2, 'b')} − ${ak(2, 'c')}), hasil kalinya b − c`, q: `Rasionalkan penyebut ${fr(4, `${ak(2, 5)} − 1`)}.`, l: [`Sekawan dari (${ak(2, 5)} − 1) adalah (${ak(2, 5)} + 1). Kalikan pembilang dan penyebut dengan sekawan itu.`, `Penyebut: (${ak(2, 5)} − 1)(${ak(2, 5)} + 1) = 5 − 1 = 4.`, `Pembilang: 4(${ak(2, 5)} + 1).`, `Pecahan menjadi ${fr(`4(${ak(2, 5)} + 1)`, 4)}. Bagi 4 dengan 4, hasilnya ${ak(2, 5)} + 1.`], j: `${ak(2, 5)} + 1` },
  { tag: 'C.1 Bentuk baku', r: 'a × 10<sup>n</sup> dengan 1 ≤ a &lt; 10', q: 'Tuliskan 45.000.000 dalam bentuk baku.', l: ['Geser koma sampai tepat di belakang angka pertama yang bukan nol: 4,5.', 'Koma semula ada di paling kanan, dan bergeser 7 langkah ke kiri.', 'Bergeser ke kiri berarti pangkatnya positif, yaitu 10<sup>7</sup>.', `Tulis hasilnya: 4,5 × ${sup(10, 7)}.`], j: `4,5 × ${sup(10, 7)}` },
  { tag: 'C.1 Bentuk baku', r: 'a × 10<sup>n</sup> dengan 1 ≤ a &lt; 10', q: 'Tuliskan 0,00032 dalam bentuk baku.', l: ['Geser koma sampai tepat di belakang angka bukan nol pertama: 3,2.', 'Koma bergeser 4 langkah ke kanan.', 'Bergeser ke kanan berarti pangkatnya negatif, yaitu 10<sup>−4</sup>.', `Tulis hasilnya: 3,2 × ${sup(10, '−4')}.`], j: `3,2 × ${sup(10, '−4')}` },
  { tag: 'C.2 Bentuk biasa', r: 'Pangkat positif: koma ke kanan. Pangkat negatif: koma ke kiri.', q: `Tuliskan 6,7 × ${sup(10, 5)} dalam bentuk biasa.`, l: ['Pangkat 5 positif, jadi koma digeser 5 langkah ke kanan.', 'Angka 6,7 punya 1 angka di belakang koma. Geser 1 langkah menjadi 67, sisa 4 langkah diisi nol menjadi 670000.', 'Beri titik pemisah ribuan: 670.000.'], j: '670.000' },
  { tag: 'C.2 Penerapan', r: 'Biasa ke baku: geser koma sampai di belakang angka pertama', q: 'Jarak Bumi ke Matahari kira-kira 150.000.000 km. Tuliskan dalam bentuk baku.', l: ['Geser koma sampai tepat di belakang angka 1: 1,5.', 'Koma bergeser 8 langkah ke kiri, jadi pangkatnya 8.', `Tulis hasilnya: 1,5 × ${sup(10, 8)} km.`], j: `1,5 × ${sup(10, 8)} km` }
)
M1.soal.push(
  { q: `Bentuk akar dari ${sup(7, fr(1, 2))} adalah ...`, o: [ak(2, 7), `7${ak(2, 2)}`, ak(3, 7), '49'], j: 0, p: 'Penyebut 2 menjadi indeks akar (akar kuadrat), pembilang 1 menjadi pangkat. Jadi hasilnya akar dari 7.' },
  { q: `${sup(8, fr(1, 3))} = ...`, o: ['2', '4', '8/3', '24'], j: 0, p: `Pangkat 1/3 berarti akar pangkat 3. ${ak(3, 8)} = 2, karena 2 × 2 × 2 = 8.` },
  { q: `${sup(16, fr(3, 4))} = ...`, o: ['4', '8', '12', '64'], j: 1, p: `Akar pangkat 4 dari 16 adalah 2, lalu dipangkatkan 3: 2<sup>3</sup> = 8.` },
  { q: `3${ak(2, 5)} + 2${ak(2, 5)} = ...`, o: [`5${ak(2, 5)}`, `5${ak(2, 10)}`, `6${ak(2, 5)}`, `6${ak(2, 25)}`], j: 0, p: `Isi akarnya sama, jadi koefisiennya dijumlah: 3 + 2 = 5. Hasilnya 5${ak(2, 5)}.` },
  { q: `${ak(2, 3)} × ${ak(2, 12)} = ...`, o: ['6', ak(2, 15), `3${ak(2, 4)}`, '36'], j: 0, p: `${ak(2, 3)} × ${ak(2, 12)} = ${ak(2, 36)} = 6.` },
  { q: `${ak(2, 48)} ÷ ${ak(2, 3)} = ...`, o: ['16', '4', `4${ak(2, 3)}`, ak(2, 45)], j: 1, p: `${ak(2, 48)} ÷ ${ak(2, 3)} = ${ak(2, 16)} = 4.` },
  { q: `${ak(2, 18)} + ${ak(2, 8)} = ...`, o: [ak(2, 26), `5${ak(2, 2)}`, `5${ak(2, 10)}`, `10${ak(2, 2)}`], j: 1, p: `Sederhanakan dulu: ${ak(2, 18)} = 3${ak(2, 2)} dan ${ak(2, 8)} = 2${ak(2, 2)}. Jumlahkan: 3${ak(2, 2)} + 2${ak(2, 2)} = 5${ak(2, 2)}.` },
  { q: `Bentuk rasional dari ${fr(6, ak(2, 3))} adalah ...`, o: [`2${ak(2, 3)}`, `3${ak(2, 2)}`, `6${ak(2, 3)}`, fr(2, ak(2, 3))], j: 0, p: `Kalikan dengan ${fr(ak(2, 3), ak(2, 3))}: hasilnya ${fr(`6${ak(2, 3)}`, 3)} = 2${ak(2, 3)}.` },
  { q: `Bentuk rasional dari ${fr(2, `${ak(2, 3)} − 1`)} adalah ...`, o: [`${ak(2, 3)} − 1`, `${ak(2, 3)} + 1`, `2${ak(2, 3)} + 2`, fr(`${ak(2, 3)} + 1`, 2)], j: 1, p: `Kalikan dengan sekawan (${ak(2, 3)} + 1). Penyebut: 3 − 1 = 2. Pembilang: 2(${ak(2, 3)} + 1). Setelah dibagi 2, hasilnya ${ak(2, 3)} + 1.` },
  { q: 'Bentuk baku dari 45.000.000 adalah ...', o: [`4,5 × ${sup(10, 7)}`, `45 × ${sup(10, 6)}`, `4,5 × ${sup(10, 6)}`, `0,45 × ${sup(10, 8)}`], j: 0, p: 'Koma digeser 7 langkah ke kiri sampai di belakang angka 4, jadi 4,5 × 10<sup>7</sup>. Pilihan lain angka depannya tidak di antara 1 dan 10 atau pangkatnya salah.' },
  { q: 'Bentuk baku dari 0,00032 adalah ...', o: [`3,2 × ${sup(10, '−3')}`, `3,2 × ${sup(10, '−4')}`, `3,2 × ${sup(10, 4)}`, `32 × ${sup(10, '−5')}`], j: 1, p: 'Koma digeser 4 langkah ke kanan sampai di belakang angka 3, jadi pangkatnya negatif: 3,2 × 10<sup>−4</sup>.' },
  { q: `Bentuk biasa dari 6,7 × ${sup(10, 5)} adalah ...`, o: ['67.000', '670.000', '6.700.000', '6.700'], j: 1, p: 'Pangkat 5 positif, koma digeser 5 langkah ke kanan: 6,7 menjadi 670000, ditulis 670.000.' },
  { q: `Bentuk biasa dari 2,5 × ${sup(10, '−3')} adalah ...`, o: ['0,025', '0,0025', '0,00025', '2.500'], j: 1, p: 'Pangkat −3 negatif, koma digeser 3 langkah ke kiri: 2,5 menjadi 0,0025.' }
)

const LANGKAH1 = [
  { k: 'belajar', ik: '📖', t: 'Perpustakaan Kuno', n: 'Penjelasan & Ringkasan', d: 'Pahami konsep dan rumus pentingnya', c1: '#ff7a59', c2: '#ffb347' },
  { k: 'visual', ik: '🔋', t: 'Laboratorium Energi', n: 'Visual Interaktif', d: 'Lihat pangkat sebagai perkalian berulang', c1: '#6c4cf1', c2: '#a78bfa' },
  { k: 'contoh', ik: '🗺️', t: 'Peta Rahasia', n: 'Contoh Soal', d: 'Pembahasan langkah demi langkah', c1: '#16a36a', c2: '#5ed8a2' },
  { k: 'latihan', ik: '⚔️', t: 'Arena Latihan', n: 'Latihan Interaktif', d: 'Tanpa batas waktu, ada feedback', c1: '#0ea5e9', c2: '#6ee7f9' },
  { k: 'game', ik: '🏰', t: 'Istana Harta Karun', n: 'Kuis Edukasi', d: '4 jenis kuis, 5 soal per sesi', c1: '#ec4899', c2: '#f9a8d4' }
]
const det = L => L.map(([t, h, o]) => `<details class="misi" ${o ? 'open' : ''}><summary>${t}</summary><div class="isi">${h}</div></details>`).join('')
const opt = (a, b, s, L) => Array.from({ length: b - a + 1 }, (_, i) => `<option value="${a + i}" ${a + i === s ? 'selected' : ''}>${L ? L[i] : a + i}</option>`).join('')

function bukaMateri1(m, aktif) {
  window.scrollTo(0, 0); clearInterval(window._kuisTimer)
  if (window.ingatPosisi) ingatPosisi({ tab: 'beranda', materi: 1, langkah: aktif || null })
  const k = LANGKAH1.findIndex(x => x.k === aktif), judul = `<h2>${aman(m.ikon)} ${aman(m.judul)}</h2>`
  if (k < 0) {
    const X = [30, 70, 30, 70, 30], Y = LANGKAH1.map((_, i) => 10 + i * 20)
    let d = `M${X[0]} ${Y[0]}`
    for (let i = 1; i < X.length; i++) { const ym = (Y[i - 1] + Y[i]) / 2; d += ` C${X[i - 1]} ${ym} ${X[i]} ${ym} ${X[i]} ${Y[i]}` }
    $('isi').innerHTML = `<p><button class="btn alt" id="kembali">← Kembali</button></p>${judul}
      <p class="kecil">🧭 Petualangan di Negeri Pangkat. Pilih tempat yang ingin kamu kunjungi dulu, lalu ikuti jalurnya.</p>
      <div class="peta"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" class="jalur"/></svg>
        <span class="dek" style="left:3%;top:3%">☁️</span><span class="dek" style="right:4%;top:20%">⛰️</span><span class="dek" style="left:3%;top:40%">🌴</span>
        <span class="dek" style="right:3%;top:58%">☁️</span><span class="dek" style="left:4%;top:78%">⛰️</span><span class="dek" style="right:4%;top:93%">🌴</span>
        <span class="mulai">🏁 Mulai petualangan</span>
        ${LANGKAH1.map((x, i) => `<button class="nd" style="left:${X[i]}%;top:${Y[i]}%;--c1:${x.c1};--c2:${x.c2};--w:${i * .4}s" data-k="${x.k}" aria-label="${x.t}: ${x.n}">
          <span class="bola">${x.ik}<i class="no">${i + 1}</i></span><span class="lb"><b>${x.t}</b><small>${x.n}</small></span></button>`).join('')}</div>`
    $('kembali').onclick = () => tampilUtama(kelasNama)
    return $('isi').querySelectorAll('[data-k]').forEach(b => b.onclick = () => bukaMateri1(m, b.dataset.k))
  }
  const L = LANGKAH1[k], akhir = k === LANGKAH1.length - 1
  const konten = {
    belajar: `<div class="card"><h3>📖 Perpustakaan Kuno</h3><p class="kecil">Buka bagian satu per satu.</p><h4 class="grp">A. Bilangan Berpangkat</h4>
        ${det(M1.bagian)}<h4 class="grp">B. Bilangan Bentuk Akar</h4>${det(M1.bagianB)}<h4 class="grp">C. Bentuk Baku dan Bentuk Biasa</h4>${det(M1.bagianC)}</div>
      <div class="card box"><h3>🏆 Ringkasan Inti</h3><ul>${M1.ringkasan.map(r => `<li>${r}</li>`).join('')}</ul>
        <h4 class="sub">Cara mudah mengingat</h4>${M1.tips.map(t => `<div class="tip">💡 ${t}</div>`).join('')}</div>`,
    visual: `<div class="card vis"><h3>🔋 Laboratorium Energi</h3><p class="kecil">Pilih topik, ubah angkanya, lalu lihat bagaimana rumusnya terbentuk.</p><div id="vis"></div></div>`,
    contoh: `<div class="card"><h3>🗺️ Peta Rahasia</h3><p class="kecil">Setiap contoh punya 3 bagian: konsep yang dipakai, langkah penyelesaian, dan jawaban akhir.</p></div>
      ${M1.contoh.map((c, i) => `<div class="card box"><div class="cx-head"><span class="cx-no">Contoh ${i + 1}</span><span class="cx-tag">${c.tag}</span></div>
        <div class="cx-soal">${c.q}</div><div class="cx-r">📌 <b>Konsep:</b> ${c.r}</div>
        ${c.l.map((x, n) => `<div class="lg"><span class="no">${n + 1}</span><div>${x}</div></div>`).join('')}
        <div class="cx-j">✅ <b>Jawaban:</b> ${c.j}</div></div>`).join('')}`,
    latihan: `<div class="card"><h3>⚔️ Arena Latihan</h3><p class="kecil">Tanpa batas waktu. Kalau salah, kamu boleh coba lagi atau langsung lihat pembahasan.</p><div id="latihan"></div></div>`,
    game: `<div class="card"><h3>🏰 Kuis Edukasi</h3><p class="kecil">Pilih jenis kuis. Tiap sesi 5 soal dengan batas waktu.</p><div id="game"></div></div>`
  }[L.k]
  $('isi').innerHTML = `<p><button class="btn alt" id="menu">☰ Peta petualangan</button></p>${judul}
    <p class="kecil" style="margin:2px 0 6px">Langkah ${k + 1} dari ${LANGKAH1.length}: <b>${L.t}</b> (${L.n})</p>
    <div class="prog"><span style="width:${(k + 1) * 100 / LANGKAH1.length}%"></span></div>
    <div style="margin-top:14px">${konten}</div>
    <div class="navlang">${k > 0 ? '<button class="btn alt" id="sblm">← Sebelumnya</button>' : '<span></span>'}<button class="btn" id="lanjut1">${akhir ? 'Selesai ✔' : 'Berikutnya →'}</button></div>`
  $('menu').onclick = () => bukaMateri1(m)
  if (k > 0) $('sblm').onclick = () => bukaMateri1(m, LANGKAH1[k - 1].k)
  $('lanjut1').onclick = () => akhir ? bukaMateri1(m) : bukaMateri1(m, LANGKAH1[k + 1].k)
  if (L.k === 'visual') visual1()
  if (L.k === 'latihan') latihan1()
  if (L.k === 'game') kuis1()
}

/* ---------- Visual interaktif: satu tab per topik ---------- */
/* ---------- Data dan helper untuk bentuk akar dan bentuk baku ---------- */
const XL = [2, 3, 5, 7, 8, 9, 16, 25, 27, 32, 64, 81], BL = [2, 3, 5, 6, 7, 10, 11], CL = [2, 3, 5], CS = [2, 3, 5, 6, 7], PL = [2, 3, 5, 6, 7, 8, 10, 11, 12]
const ML = ['1,2', '3,45', '5', '6,7', '8,25', '2,5', '9,1', '4,8', '7,3', '1,05', '9,99', '1']
const BEX = ['45000000', '0,00032', '6700', '0,0052', '120000000000', '0,000000071', '830000', '0,0000904']
const pk = d => d.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
const fb = s => { const [ip, fp] = s.split(','); return pk(ip) + (fp !== undefined ? ',' + fp : '') }
const bakuKeBiasa = (mant, n) => {
  const dg = mant.replace(',', ''), pos = 1 + n
  if (pos >= dg.length) return pk(dg + '0'.repeat(pos - dg.length))
  if (pos <= 0) return '0,' + '0'.repeat(-pos) + dg
  return pk(dg.slice(0, pos)) + ',' + dg.slice(pos)
}
const bakuDari = s => {
  const [ip, fp = ''] = s.split(','), dg = ip + fp, f = dg.search(/[1-9]/), e = ip.length - f - 1
  let m = dg.slice(f).replace(/0+$/, ''); m = m.length > 1 ? m[0] + ',' + m.slice(1) : m
  return { m, e }
}

function visualBC(tab, v) {
  const lg = a => a.map((t, i) => `<div class="lg"><span class="no">${i + 1}</span><div>${t}</div></div>`).join('')
  const dec = x => x.toFixed(3).replace('.', ','), hsl = (K, r) => r === 1 ? String(K) : rt(K, r)
  if (tab === 'ak') {
    const X = XL[v.x - 1], n = v.n, m = v.m, r = Math.round(X ** (1 / n)), eksak = r ** n === X, val = X ** (m / n)
    return {
      eq: `<div class="besar">${sup(X, fr(m, n))} = ${ak(n, m > 1 ? sup(X, m) : X)}</div><div class="kecil">= (${ak(n, X)})${m > 1 ? `<sup>${m}</sup>` : ''}</div>`,
      isi: lg([`Penyebut pangkat adalah <b>${n}</b>, jadi indeks akarnya ${n}${n === 2 ? ' (akar kuadrat)' : n === 3 ? ' (akar pangkat tiga)' : ''}.`, `Pembilang pangkat adalah <b>${m}</b>, jadi bilangan di dalam akar dipangkatkan ${m}.`,
        eksak ? `${ak(n, X)} = ${r}, karena ${sup(r, n)} = ${X}. Maka hasilnya ${sup(r, m)} = <b>${r ** m}</b>.` : `${ak(n, X)} bukan bilangan bulat. Nilainya sekitar <b>${dec(val)}</b> (dibulatkan 3 angka di belakang koma).`]),
      tip: 'Penyebut pangkat menjadi indeks akar, pembilang pangkat menjadi pangkat bilangan di dalam akar. Coba ganti angkanya untuk melihat polanya.' }
  }
  if (tab === 'aj') {
    const c = CS[v.c - 1], a = v.a, plus = v.op === 1; if (!plus && v.b > a) v.b = a
    const b = v.b, h = plus ? a + b : a - b, chip = (cnt, cl) => Array.from({ length: cnt }, () => `<span class="chip ${cl}">${ak(2, c)}</span>`).join('')
    return {
      eq: `<div class="besar">${rt(a, c)} ${plus ? '+' : '−'} ${rt(b, c)} = ${h === 0 ? 0 : rt(h, c)}</div><div class="kecil">(${a} ${plus ? '+' : '−'} ${b})${ak(2, c)}</div>`,
      isi: plus ? `<div class="baris">${chip(a, 'o')}</div><div class="panah">+</div><div class="baris">${chip(b, 'b')}</div><div class="panah">⬇ digabung ⬇</div><div class="baris">${chip(a, 'o')}${chip(b, 'b')}</div>`
        : `<div class="baris">${chip(a - b, 'o')}${Array.from({ length: b }, () => `<span class="chip x">${ak(2, c)}</span>`).join('')}</div><p class="kecil">Yang dicoret adalah ${b} buah ${ak(2, c)} yang dikurangkan.</p>`,
      tip: `Isi akarnya sama (${c}), jadi ${ak(2, c)} seperti benda yang sejenis. Kita hanya menghitung banyaknya: ${a} ${plus ? '+' : '−'} ${b} = ${h}.` }
  }
  if (tab === 'ax') {
    const a = v.a, p = PL[v.p - 1], b = v.b, q = PL[v.q - 1], [k, r] = simp(p * q), K = a * b * k, nilai = a * Math.sqrt(p) * b * Math.sqrt(q)
    return {
      eq: `<div class="besar">${rt(a, p)} × ${rt(b, q)} = ${hsl(K, r)}</div><div class="kecil">≈ ${dec(nilai)}</div>`,
      isi: lg([`Kalikan koefisien: ${a} × ${b} = ${a * b}.`, `Kalikan isi akar: ${ak(2, p)} × ${ak(2, q)} = ${ak(2, p * q)}.`, k > 1 ? `Sederhanakan: ${p * q} = ${k * k} × ${r}, jadi ${ak(2, p * q)} = ${rt(k, r)}.` : `${ak(2, p * q)} sudah sederhana (tidak punya faktor kuadrat).`, `Hasil akhir: ${hsl(K, r)}.`]),
      tip: `Koefisien dikali koefisien, isi akar dikali isi akar. Nilai desimalnya ${dec(nilai)}, sama dengan hasil kalkulator.` }
  }
  if (tab === 'ab') {
    const q = PL[v.q - 1], r = v.r, [k, rr] = simp(r)
    return {
      eq: `<div class="besar">${ak(2, q * r)} ÷ ${ak(2, q)} = ${ak(2, r)}${k > 1 || rr === 1 ? ' = ' + hsl(k, rr) : ''}</div><div class="kecil">≈ ${dec(Math.sqrt(r))}</div>`,
      isi: lg([`Bagi isi akar: ${q * r} ÷ ${q} = ${r}.`, `Tulis hasilnya: ${ak(2, r)}.`, k > 1 ? `Sederhanakan: ${r} = ${k * k} × ${rr}, jadi ${ak(2, r)} = ${rt(k, rr)}.` : rr === 1 ? `${ak(2, r)} = ${k}.` : `${ak(2, r)} sudah sederhana.`]),
      tip: `Akar dibagi akar sama dengan akar dari hasil bagi isi akarnya: ${ak(2, 'a')} ÷ ${ak(2, 'b')} = ${ak(2, 'a ÷ b')}.` }
  }
  if (tab === 'ar') {
    const a = v.a, CA = CL[v.c - 1]; let b = BL[v.b - 1]; if (v.t > 1 && b <= CA) b = BL.find(x => x > CA)
    if (v.t === 1) {
      const g = gcd(a, b), hasil = a % b === 0 ? rt(a / b, b) : fr(rt(a / g, b), b / g), nil = a / Math.sqrt(b)
      return { eq: `<div class="besar">${fr(a, ak(2, b))} = ${hasil}</div><div class="kecil">nilainya ≈ ${dec(nil)} (sebelum dan sesudah sama)</div>`,
        isi: lg([`Kalikan pembilang dan penyebut dengan ${ak(2, b)}: ${fr(a, ak(2, b))} × ${fr(ak(2, b), ak(2, b))}.`, `Penyebut: ${ak(2, b)} × ${ak(2, b)} = ${b}. Pembilang: ${rt(a, b)}.`, `Hasil: ${fr(rt(a, b), b)}${g > 1 || a % b === 0 ? ', lalu disederhanakan menjadi ' + hasil : ''}.`]),
        tip: 'Mengalikan dengan akar yang sama di atas dan di bawah tidak mengubah nilai pecahan, tetapi penyebutnya menjadi bilangan bulat.' }
    }
    const pl = v.t === 2, d = b - CA, tg = pl ? '−' : '+', hasil = a % d === 0 ? `${a / d}(${ak(2, b)} ${tg} ${ak(2, CA)})` : fr(`${a}(${ak(2, b)} ${tg} ${ak(2, CA)})`, d)
    const nil = a / (Math.sqrt(b) + (pl ? 1 : -1) * Math.sqrt(CA))
    return { eq: `<div class="besar">${fr(a, `${ak(2, b)} ${pl ? '+' : '−'} ${ak(2, CA)}`)} = ${hasil}</div><div class="kecil">nilainya ≈ ${dec(nil)} (sebelum dan sesudah sama)</div>`,
      isi: lg([`Sekawan dari (${ak(2, b)} ${pl ? '+' : '−'} ${ak(2, CA)}) adalah (${ak(2, b)} ${tg} ${ak(2, CA)}). Kalikan pembilang dan penyebut dengan sekawan itu.`, `Penyebut: (${ak(2, b)} ${pl ? '+' : '−'} ${ak(2, CA)})(${ak(2, b)} ${tg} ${ak(2, CA)}) = ${b} − ${CA} = ${d}.`, `Pembilang: ${a}(${ak(2, b)} ${tg} ${ak(2, CA)}).`, `Hasil: ${hasil}.`]),
      tip: 'Hasil kali sekawan selalu tidak berakar: (√b + √c)(√b − √c) = b − c. Itulah kenapa penyebutnya menjadi bilangan bulat.' }
  }
  if (tab === 'bk') {
    const mant = ML[v.i - 1], n = v.n, h = bakuKeBiasa(mant, n), cs = [...h].map(c => c === ',' ? '<span class="chip o">,</span>' : c === '.' ? '<span class="x">.</span>' : `<span class="chip">${c}</span>`).join('')
    return { eq: `<div class="besar">${mant} × ${sup(10, ex(n))} = ${h}</div><div class="kecil">bentuk baku → bentuk biasa</div>`,
      isi: `<div class="baris">${cs}</div>` + lg([`Pangkat 10 adalah ${ex(n)}, jadi koma ${n === 0 ? 'tidak digeser (dikali 1)' : `digeser ${Math.abs(n)} langkah ke ${n > 0 ? 'kanan' : 'kiri'}`}.`, `Angka ${mant} ${n > 0 ? 'menjadi lebih besar' : n < 0 ? 'menjadi lebih kecil' : 'tetap'}: ${h}.`]),
      tip: n > 0 ? 'Pangkat positif membuat bilangan besar: koma bergeser ke kanan, dan nol ditambahkan kalau angkanya habis.' : n < 0 ? 'Pangkat negatif membuat bilangan kecil: koma bergeser ke kiri, dan nol ditambahkan di depan.' : '10 pangkat 0 sama dengan 1, jadi angkanya tidak berubah.' }
  }
  const s = BEX[v.i - 1], { m, e } = bakuDari(s), cs = [...fb(s)].map(c => c === ',' ? '<span class="chip o">,</span>' : c === '.' ? '<span class="x">.</span>' : `<span class="chip">${c}</span>`).join('')
  return { eq: `<div class="besar">${fb(s)} = ${m} × ${sup(10, ex(e))}</div><div class="kecil">bentuk biasa → bentuk baku</div>`,
    isi: `<div class="baris">${cs}</div>` + lg([`Geser koma sampai tepat di belakang angka pertama yang bukan nol, sehingga a = ${m}.`, `Koma bergeser ${Math.abs(e)} langkah ke ${e >= 0 ? 'kiri' : 'kanan'}.`, `Ke ${e >= 0 ? 'kiri berarti pangkat positif' : 'kanan berarti pangkat negatif'}: ${m} × ${sup(10, ex(e))}.`]),
    tip: `Syarat bentuk baku: angka depan (${m}) harus antara 1 dan 10. ${e >= 0 ? 'Bilangan besar punya pangkat 10 positif.' : 'Bilangan kecil (kurang dari 1) punya pangkat 10 negatif.'}` }
}

function visual1() {
  const T = [['p', '🔢 Pengertian'], ['k', '✖️ Perkalian'], ['b', '➗ Pembagian'], ['pp', '🔁 Perpangkatan'], ['pk', '🧩 Pangkat pada perkalian'], ['n', '🪜 Nol & Negatif'], ['pc', '🍰 Pecahan'], ['hs', '🌍 Sehari-hari'], ['ak', '🌳 Pangkat → Akar'], ['aj', '➕ Jumlah & Kurang Akar'], ['ax', '✖️ Kali Akar'], ['ab', '➗ Bagi Akar'], ['ar', '🧮 Rasionalkan Penyebut'], ['bk', '🔬 Baku → Biasa'], ['bb', '📏 Biasa → Baku']]
  const GRUP = { A: ['p', 'k', 'b', 'pp', 'pk', 'n', 'pc', 'hs'], B: ['ak', 'aj', 'ax', 'ab', 'ar'], C: ['bk', 'bb'] }; let grup = 'A'
  const CFG = { p: [['a', 'Bilangan dasar', 2, 9], ['n', 'Pangkat', 0, 8]], k: [['a', 'Basis', 2, 5], ['m', 'm', 1, 5], ['n', 'n', 1, 5]],
    b: [['a', 'Basis', 2, 5], ['m', 'm', 2, 7], ['n', 'n', 1, 5]], pp: [['a', 'Basis', 2, 4], ['m', 'm', 1, 4], ['n', 'n', 1, 4]],
    pk: [['a', 'a', 2, 4], ['b', 'b', 2, 4], ['n', 'Pangkat', 1, 3]], n: [['a', 'Basis', 2, 5]], pc: [['p', 'Pembilang', 1, 5], ['q', 'Penyebut', 2, 6], ['n', 'Pangkat', 1, 4]],
    hs: [['a', 'Skenario', 1, 3, ['Lipat kertas', 'Pesan berantai', 'Bakteri membelah']], ['n', 'Langkah', 1, 10]],
    ak: [['x', 'Bilangan', 1, 12, XL.map(String)], ['n', 'Akar ke-n (penyebut)', 2, 4], ['m', 'Pangkat (pembilang)', 1, 3]],
    aj: [['c', 'Isi akar', 1, 5, CS.map(String)], ['a', 'p', 1, 9], ['b', 'q', 1, 9], ['op', 'Operasi', 1, 2, ['Penjumlahan (+)', 'Pengurangan (−)']]],
    ax: [['a', 'Koefisien 1', 1, 5], ['p', 'Isi akar 1', 1, 9, PL.map(String)], ['b', 'Koefisien 2', 1, 5], ['q', 'Isi akar 2', 1, 9, PL.map(String)]],
    ab: [['q', 'Pembagi (isi akar)', 1, 9, PL.map(String)], ['r', 'Hasil bagi isi akar', 2, 12]],
    ar: [['t', 'Bentuk', 1, 3, ['a / √b', 'a / (√b + √c)', 'a / (√b − √c)']], ['a', 'a', 1, 12], ['b', 'b', 1, 7, BL.map(String)], ['c', 'c', 1, 3, CL.map(String)]],
    bk: [['i', 'Angka depan (a)', 1, 8, ML.slice(0, 8)], ['n', 'Pangkat 10 (n)', -6, 9]], bb: [['i', 'Bentuk biasa', 1, 8, BEX.map(fb)]] }
  const S = { p: { a: 3, n: 5 }, k: { a: 2, m: 3, n: 2 }, b: { a: 3, m: 5, n: 2 }, pp: { a: 2, m: 3, n: 2 }, pk: { a: 2, b: 3, n: 2 }, n: { a: 2 }, pc: { p: 2, q: 3, n: 3 }, hs: { a: 1, n: 5 }, ak: { x: 5, n: 3, m: 2 }, aj: { c: 1, a: 3, b: 2, op: 1 }, ax: { a: 2, p: 2, b: 4, q: 3 }, ab: { q: 4, r: 12 }, ar: { t: 1, a: 6, b: 2, c: 1 }, bk: { i: 2, n: 5 }, bb: { i: 1 } }
  const chips = (n, a, c = '') => Array.from({ length: n }, (_, i) => `<span class="chip ${c}" style="animation-delay:${i * 50}ms">${a}</span>`).join('')
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1))
  let tab = 'p'
  const gambar = () => {
    const v = S[tab]; if (tab === 'b' && v.n > v.m) v.n = v.m; if (tab === 'pc' && v.q <= v.p) v.q = v.p + 1
    const { a, b, m, n, p, q } = v; let isi, eq, tip
    if (tab === 'p') {
      isi = `<div class="baris">${n === 0 ? '<span class="chip">1</span>' : chips(n, a)}</div>`
      eq = `<div class="besar">${sup(a, n)} = ${fmt(a ** n)}</div><div class="kecil">Artinya: ${n === 0 ? '1 (pangkat nol)' : Array(n).fill(a).join(' × ')}</div>`
      tip = n === 0 ? `${a} pangkat 0 hasilnya selalu 1.` : n === 1 ? `${a} pangkat 1 adalah angka ${a} itu sendiri.` : `${a} pangkat ${n} berarti angka ${a} dikalikan dengan dirinya sendiri ${n} kali.`
    } else if (tab === 'k') {
      isi = `<div class="baris">${chips(m, a, 'o')}</div><div class="panah">×</div><div class="baris">${chips(n, a, 'b')}</div><div class="panah">⬇ digabung ⬇</div><div class="baris">${chips(m, a, 'o')}${chips(n, a, 'b')}</div>`
      eq = `<div class="besar">${sup(a, m)} × ${sup(a, n)} = ${sup(a, m + n)}</div><div class="kecil">= ${fmt(a ** (m + n))}</div>`
      tip = `Ada ${m} faktor oranye dan ${n} faktor biru. Setelah digabung ada ${m} + ${n} = ${m + n} faktor, jadi pangkatnya dijumlahkan.`
    } else if (tab === 'b') {
      isi = `<div class="baris">${Array.from({ length: m }, (_, i) => `<span class="chip ${i < n ? 'x' : 'o'}">${a}</span>`).join('')}</div>`
      eq = `<div class="besar">${sup(a, m)} ÷ ${sup(a, n)} = ${sup(a, m - n)}</div><div class="kecil">= ${fmt(a ** (m - n))}</div>`
      tip = `Dari ${m} faktor, ${n} faktor dicoret karena punya pasangan di pembagi. Sisa ${m} − ${n} = ${m - n} faktor, jadi pangkatnya dikurangkan.`
    } else if (tab === 'pp') {
      isi = Array.from({ length: n }, () => `<div class="baris">${chips(m, a, 'o')}</div>`).join('')
      eq = `<div class="besar">(${sup(a, m)})<sup>${n}</sup> = ${sup(a, m * n)}</div><div class="kecil">= ${fmt(a ** (m * n))}</div>`
      tip = `Ada ${n} baris, tiap baris berisi ${m} faktor. Totalnya ${n} × ${m} = ${m * n} faktor, jadi pangkatnya dikalikan.`
    } else if (tab === 'pk') {
      isi = `<p class="kecil">(${a} × ${b}) ditulis ${n} kali:</p>` + Array.from({ length: n }, () => `<div class="baris">${chips(1, a, 'o')}<span class="x">×</span>${chips(1, b, 'b')}</div>`).join('')
        + `<div class="panah">⬇ kelompokkan yang sama ⬇</div><div class="baris">${chips(n, a, 'o')}</div><div class="baris">${chips(n, b, 'b')}</div>`
      eq = `<div class="besar">(${a} × ${b})<sup>${n}</sup> = ${sup(a, n)} × ${sup(b, n)}</div><div class="kecil">= ${a ** n} × ${b ** n} = ${fmt((a * b) ** n)}</div>`
      tip = `Ada ${n} faktor ${a} (oranye) dan ${n} faktor ${b} (biru). Jadi pangkat ${n} berlaku untuk masing-masing faktor.`
    } else if (tab === 'n') {
      isi = [4, 3, 2, 1, 0, -1, -2, -3].map((e, i) => `${i ? `<div class="turun">⬇ dibagi ${a}</div>` : ''}<div class="tangga ${e === 0 ? 'nol' : ''}" style="animation-delay:${i * 70}ms"><span>${sup(a, e < 0 ? '−' + -e : e)}</span><span>${e >= 0 ? fmt(a ** e) : '1/' + fmt(a ** -e)}</span></div>`).join('')
      eq = `<div class="besar">${sup(a, 0)} = 1</div><div class="kecil">Pangkat nol selalu 1</div>`
      tip = `Tiap turun satu anak tangga, hasilnya dibagi ${a}. Sampai pangkat 0 hasilnya 1, lalu berubah menjadi pecahan (pangkat negatif).`
    } else if (tab === 'pc') {
      isi = Array.from({ length: n }, (_, i) => `<div>(${fr(p, q)})<sup>${i + 1}</sup> = ${fr(p ** (i + 1), q ** (i + 1))}<div class="batang"><i style="width:${(p / q) ** (i + 1) * 100}%"></i></div></div>`).join('')
      eq = `<div class="besar">(${fr(p, q)})<sup>${n}</sup> = ${fr(sup(p, n), sup(q, n))} = ${fr(p ** n, q ** n)}</div>`
      tip = `Pembilang dan penyebut sama-sama dipangkatkan ${n}. Perhatikan batangnya: pecahan antara 0 dan 1 justru makin kecil kalau dipangkatkan.`
    } else if (tab === 'hs') {
      const SK = [{ b: 2, u: 'lapis', t: 'Setiap lipatan menggandakan jumlah lapis kertas' }, { b: 3, u: 'orang', t: 'Setiap orang meneruskan pesan ke 3 orang baru' }, { b: 2, u: 'sel bakteri', t: 'Setiap sel membelah menjadi 2' }][a - 1], mx = SK.b ** n
      isi = Array.from({ length: n }, (_, i) => `<div>Langkah ${i + 1}: ${sup(SK.b, i + 1)} = <b>${fmt(SK.b ** (i + 1))}</b> ${SK.u}<div class="batang"><i style="width:${SK.b ** (i + 1) / mx * 100}%"></i></div></div>`).join('')
      eq = `<div class="besar">${sup(SK.b, n)} = ${fmt(mx)} ${SK.u}</div><div class="kecil">${SK.t}</div>`
      tip = `Tiap langkah jumlahnya dikali ${SK.b}. Perhatikan batangnya: langkah terakhir jauh lebih panjang daripada langkah-langkah awal. Itulah kekuatan bilangan berpangkat!`
    } else { ({ isi, eq, tip } = visualBC(tab, v)) }
    $('vis').innerHTML = `<div class="tabsv grupv">${['A', 'B', 'C'].map(g => `<button data-g="${g}" class="${g === grup ? 'on' : ''}">${{ A: 'A. Bilangan Berpangkat', B: 'B. Bentuk Akar', C: 'C. Bentuk Baku' }[g]}</button>`).join('')}</div><div class="tabsv">${T.filter(([k]) => GRUP[grup].includes(k)).map(([k, nm]) => `<button data-t="${k}" class="${k === tab ? 'on' : ''}">${nm}</button>`).join('')}</div>
      <div class="pilih">${CFG[tab].map(([k, l, lo, hi, LB]) => `<label>${l} <select data-k="${k}">${opt(lo, hi, v[k], LB)}</select></label>`).join('')}${tab === 'p' ? '<button class="btn alt" id="acak">🎲 Coba Acak</button>' : ''}</div>
      <div class="hasil">${eq}</div><div style="margin:10px 0">${isi}</div><div class="tip">💡 ${tip}</div>`
    $('vis').querySelectorAll('[data-g]').forEach(x => x.onclick = () => { grup = x.dataset.g; tab = GRUP[grup][0]; gambar() })
    $('vis').querySelectorAll('[data-t]').forEach(x => x.onclick = () => { tab = x.dataset.t; gambar() })
    $('vis').querySelectorAll('select').forEach(s => s.onchange = () => { v[s.dataset.k] = +s.value; gambar() })
    if (tab === 'p') $('acak').onclick = () => { v.a = rnd(2, 9); v.n = rnd(1, 7); gambar() }
  }
  gambar()
}

/* ---------- Latihan: salah boleh coba lagi atau lihat pembahasan ---------- */
function latihan1() {
  const el = $('latihan'), Q = M1.soal; let i = 0, benar = 0, pertama = true
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
    const { data, error } = await db.rpc('simpan_latihan', { m: 1, s: benar, t: Q.length })
    $('xp').textContent = error ? 'Progres belum tersimpan.' : `Progres tersimpan. Total XP kamu: ${data}.`
  }
  tampil()
}

/* ---------- Bank soal kuis (dibangkitkan dari rumus, tiap nomor = soal berbeda) ---------- */
const gcd = (a, b) => b ? gcd(b, a % b) : a
const ex = r => r < 0 ? '−' + (-r) : r
const fq = (u, v) => v === 1 ? String(u) : fr(u, v)
const pw = (b, r) => r > 0 ? sup(b, r) : r === 0 ? '1' : fr(1, sup(b, -r))
const hasilTxt = (b, r) => r > 0 ? `Hasil: ${sup(b, r)}` : r === 0 ? `${sup(b, 0)} = 1` : `${sup(b, ex(r))} = 1/${sup(b, -r)} (pangkat negatif = kebalikan)`
const D = (i, ...r) => r.map(x => { const v = i % x; i = Math.floor(i / x); return v })
const T = v => typeof v === 'number' ? fmt(v) : String(v)
const acak = a => [...a].sort(() => Math.random() - .5)
const CERITA = [
  (x, g, t) => `Satu koloni bakteri berjumlah ${x} ribu sel dan menjadi ${g} kali lipat setiap jam. Berapa ribu sel setelah ${t} jam?`,
  (x, g, t) => `Sebuah pesan berantai dikirim oleh ${x} orang. Tiap putaran jumlah penerimanya menjadi ${g} kali jumlah sebelumnya. Berapa orang pada putaran ke-${t}?`,
  (x, g, t) => `Jamur di sebuah kebun massanya ${x} gram dan menjadi ${g} kali lipat setiap hari. Berapa gram massanya ${t} hari kemudian?`,
  (x, g, t) => `Di sebuah permainan, koin menjadi ${g} kali lipat setiap naik level. Pada level awal ada ${x} koin. Berapa koin setelah naik ${t} level?`,
  (x, g, t) => `Seorang kreator punya ${x} ribu pengikut. Jumlah pengikutnya menjadi ${g} kali lipat setiap bulan. Berapa ribu pengikut setelah ${t} bulan?`,
  (x, g, t) => `Sebuah tanaman air mula-mula menutupi ${x} meter persegi kolam dan menjadi ${g} kali lipat setiap pekan. Berapa meter persegi setelah ${t} pekan?`
]
const LA = [2, 3, 5, 6, 7, 10, 11, 13]
const FAM = [
  { id: 'hitung', n: 40, lv: 1, int: 1, pair: 1, mk: i => { const [x, y] = D(i, 8, 5), b = 2 + x, n = 2 + y, a = b ** n
    return { e: sup(b, n), a, w: [b * n, b ** (n + 1), b ** (n - 1)], tip: 'Basis dikalikan berulang sebanyak pangkatnya.', s: [`${sup(b, n)} artinya ${b} dikalikan sebanyak ${n} kali`, Array(n).fill(b).join(' × '), `= ${fmt(a)}`] } } },
  { id: 'kaliNilai', n: 128, lv: 1, int: 1, pair: 1, mk: i => { const [x, y, z] = D(i, 8, 4, 4), b = 2 + x, m = 1 + y, n = 1 + z, a = b ** (m + n)
    return { e: `${sup(b, m)} × ${sup(b, n)}`, a, w: [b ** (m * n), b * (m + n), a + b], tip: 'Basis sama dikali, pangkat dijumlahkan.', s: [`Basis sama (${b}): pangkat dijumlahkan, ${m} + ${n} = ${m + n}`, sup(b, m + n), `= ${fmt(a)}`] } } },
  { id: 'bagiNilai', n: 288, lv: 1, int: 1, pair: 1, mk: i => { const [x, y, z] = D(i, 8, 6, 6), b = 2 + x, r = 1 + y, n = 1 + z, m = n + r, a = b ** r
    return { e: `${sup(b, m)} ÷ ${sup(b, n)}`, a, w: [b ** (m + n), b * r, b ** (r + 1)], tip: 'Basis sama dibagi, pangkat dikurangkan.', s: [`Basis sama (${b}): pangkat dikurangkan, ${m} − ${n} = ${r}`, sup(b, r), `= ${fmt(a)}`] } } },
  { id: 'nol', n: 576, lv: 1, int: 1, pair: 1, mk: i => { const [x, y, z] = D(i, 8, 8, 9), b = 2 + x, c = 2 + y, d = 1 + z
    return { e: `${sup(b, 0)} × ${d} + ${sup(c, 0)}`, a: d + 1, w: [d, b + d, d + 2], tip: 'Bilangan apa pun (selain 0) berpangkat nol hasilnya 1.', s: [`Pangkat nol hasilnya 1: ${sup(b, 0)} = 1 dan ${sup(c, 0)} = 1`, `1 × ${d} + 1`, `= ${d + 1}`] } } },
  { id: 'neg', n: 40, lv: 1, pair: 1, mk: i => { const [x, y] = D(i, 8, 5), b = 2 + x, n = 1 + y, r = b ** n
    return { e: sup(b, '−' + n), a: fr(1, r), w: ['−' + r, fr(1, b * n), String(r)], f: j => fr(1, r + j), tip: 'Pangkat negatif berarti kebalikan, bukan hasil negatif.', s: [`Pangkat negatif berarti kebalikan: ${sup(b, '−' + n)} = 1/${sup(b, n)}`, `${sup(b, n)} = ${r}`, `Hasil: 1/${r}`] } } },
  { id: 'bentuk', n: 56, lv: 1, int: 1, mk: i => { const [x, y] = D(i, 8, 7), b = 2 + x, n = 2 + y
    return { q: `${fmt(b ** n)} = ${sup(b, '?')}. Berapakah pangkat yang tepat?`, a: n, w: [n + 1, n - 1, b], tip: 'Kalikan basis berulang sampai hasilnya sama dengan bilangan itu.', s: [`Kalikan ${b} berulang sampai mencapai ${fmt(b ** n)}`, Array.from({ length: n }, (_, k) => fmt(b ** (k + 1))).join(' → '), `${b} dikalikan ${n} kali, jadi pangkatnya ${n}`] } } },
  { id: 'kali', n: 648, lv: 2, pair: 1, mk: i => { const [x, y, z] = D(i, 8, 9, 9), b = 2 + x, m = 1 + y, n = 1 + z
    return { e: `${sup(b, m)} × ${sup(b, n)}`, a: sup(b, m + n), w: [sup(b, m * n), sup(b * b, m + n), sup(b, m + n + 1)], f: j => sup(b, m + n + 1 + j), tip: 'Basis sama dikali, pangkat dijumlahkan.', s: [`Basis sama (${b}), jadi pangkat dijumlahkan`, `${m} + ${n} = ${m + n}`, `Hasil: ${sup(b, m + n)}`] } } },
  { id: 'bagi', n: 1568, lv: 2, pair: 1, mk: i => { const [x, y, z] = D(i, 8, 14, 14), b = 2 + x, m = 2 + y, n = 1 + z, r = m - n
    return { e: `${sup(b, m)} ÷ ${sup(b, n)}`, a: pw(b, r), w: [pw(b, m + n), pw(b, m * n), pw(b, r + 1)], f: j => pw(b, r + 1 + j), tip: 'Basis sama dibagi, pangkat dikurangkan.', s: [`Basis sama (${b}), jadi pangkat dikurangkan`, `${m} − ${n} = ${ex(r)}`, hasilTxt(b, r)] } } },
  { id: 'pp', n: 512, lv: 2, pair: 1, mk: i => { const [x, y, z] = D(i, 8, 8, 8), b = 2 + x, m = 2 + y, n = 2 + z
    return { e: `(${sup(b, m)})<sup>${n}</sup>`, a: sup(b, m * n), w: [sup(b, m + n), sup(b, m * n - 1), sup(b, m * n + 1)], f: j => sup(b, m * n + 1 + j), tip: 'Pangkat dari pangkat, pangkatnya dikalikan.', s: ['Perpangkatan: pangkatnya dikalikan', `${m} × ${n} = ${m * n}`, `Hasil: ${sup(b, m * n)}`] } } },
  { id: 'pk', n: 192, lv: 2, int: 1, pair: 1, mk: i => { const [x, y, z] = D(i, 8, 8, 3), a = 2 + x, b = 2 + y, n = 2 + z, r = (a * b) ** n
    return { e: `(${a} × ${b})<sup>${n}</sup>`, a: r, w: [a * b * n, a ** n * b, a ** n + b ** n], tip: 'Pangkat dibagikan ke setiap faktor.', s: [`Pangkat dibagikan ke tiap faktor: ${sup(a, n)} × ${sup(b, n)}`, `${a ** n} × ${b ** n}`, `= ${fmt(r)}`] } } },
  { id: 'negKali', n: 648, lv: 2, pair: 1, mk: i => { const [x, y, z] = D(i, 8, 9, 9), b = 2 + x, m = 1 + y, n = 1 + z, r = n - m
    return { e: `${sup(b, '−' + m)} × ${sup(b, n)}`, a: pw(b, r), w: [pw(b, m + n), pw(b, -(m + n)), pw(b, r + 1)], f: j => pw(b, r + 1 + j), tip: 'Basis sama dikali, pangkat dijumlahkan (termasuk pangkat negatif).', s: ['Basis sama, jadi pangkat dijumlahkan', `(−${m}) + ${n} = ${ex(r)}`, hasilTxt(b, r)] } } },
  { id: 'pecahan', n: 396, lv: 2, pair: 1, mk: i => { const [x, y, z] = D(i, 9, 11, 4), p = 1 + x, q0 = 2 + y, q = q0 === p ? 13 : q0, n = 2 + z, P = p ** n, Q = q ** n, g = gcd(P, Q)
    return { e: `(${fr(p, q)})<sup>${n}</sup>`, q: `(${fr(p, q)})<sup>${n}</sup> = ?${g > 1 ? ' (bentuk paling sederhana)' : ''}`, a: fq(P / g, Q / g), w: [fr(P, q), fr(p, Q), fr(p * n, Q)], f: j => fr(P / g, Q / g + j), tip: 'Pembilang dan penyebut sama-sama dipangkatkan.', s: [`Pembilang dan penyebut sama-sama dipangkatkan ${n}`, `${sup(p, n)} / ${sup(q, n)} = ${P}/${Q}`, g > 1 ? `Sederhanakan: ${P}/${Q} = ${P / g}/${Q / g}` : `Hasil: ${P}/${Q}`] } } },
  { id: 'gab', n: 13824, lv: 2, pair: 1, mk: i => { const [x, y, z, u] = D(i, 8, 12, 12, 12), b = 2 + x, m = 1 + y, n = 1 + z, k = 1 + u, r = m + n - k
    return { e: `${sup(b, m)} × ${sup(b, n)} ÷ ${sup(b, k)}`, a: pw(b, r), w: [pw(b, m + n + k), pw(b, m * n - k), pw(b, r + 1)], f: j => pw(b, r + 1 + j), tip: 'Kerjakan dari kiri: perkalian menjumlah pangkat, pembagian mengurangi pangkat.', s: [`Perkalian dulu: pangkat dijumlahkan, ${m} + ${n} = ${m + n}`, `Lalu pembagian: pangkat dikurangkan, ${m + n} − ${k} = ${ex(r)}`, hasilTxt(b, r)] } } },
  { id: 'cerita', n: 1512, lv: 2, int: 1, mk: i => { const [sc, y, z, u] = D(i, 6, 9, 7, 4), x0 = 1 + y, t = 2 + z, g = 2 + u, a = x0 * g ** t
    return { q: CERITA[sc](x0, g, t), a, w: [x0 * g * t, g ** t, x0 * g ** (t - 1)], tip: 'Setiap periode jumlahnya dikali g, jadi setelah t periode dikali g pangkat t.', s: [`Tiap periode dikali ${g}, jadi setelah ${t} periode dikali ${sup(g, t)}`, `${sup(g, t)} = ${fmt(g ** t)}`, `${x0} × ${fmt(g ** t)} = ${fmt(a)}`] } } },
  { id: 'cariX', n: 1152, lv: 2, int: 1, mk: i => { const [x, y, z] = D(i, 8, 12, 12), b = 2 + x, c = 1 + y, m = 1 + z
    return { q: `${sup(b, 'x')} × ${sup(b, m)} = ${sup(b, c + m)}. Berapakah x?`, a: c, w: [m, c + m, c * m], tip: 'Basis sama dikali, pangkat dijumlahkan.', s: [`Basis sama, pangkat dijumlahkan: x + ${m} = ${c + m}`, `x = ${c + m} − ${m}`, `x = ${c}`] } } },
  { id: 'cariX2', n: 864, lv: 2, int: 1, mk: i => { const [x, y, z] = D(i, 8, 9, 12), b = 2 + x, r = 1 + y, c = 1 + z
    return { q: `${sup(b, r + c)} ÷ ${sup(b, 'x')} = ${sup(b, r)}. Berapakah x?`, a: c, w: [r, r + c, r * c], tip: 'Basis sama dibagi, pangkat dikurangkan.', s: [`Basis sama, pangkat dikurangkan: ${r + c} − x = ${r}`, `x = ${r + c} − ${r}`, `x = ${c}`] } } },
  { id: 'pkBentuk', n: 768, lv: 3, mk: i => { const [x, y, z, u, v] = D(i, 4, 4, 4, 4, 3), a = 2 + x, b = a + 1 + y, m = 1 + z, n = 1 + u, p = 2 + v
    return { e: `(${sup(a, m)} × ${sup(b, n)})<sup>${p}</sup>`, a: `${sup(a, m * p)} × ${sup(b, n * p)}`, w: [`${sup(a, m + p)} × ${sup(b, n + p)}`, `${sup(a, m * p)} × ${sup(b, n)}`, `${sup(a, m)} × ${sup(b, n * p)}`], f: j => `${sup(a, m * p + j)} × ${sup(b, n * p)}`, tip: 'Pangkat dibagikan ke tiap faktor, lalu pangkat dari pangkat dikalikan.', s: [`Pangkat ${p} dibagikan ke tiap faktor`, `(${sup(a, m)})<sup>${p}</sup> × (${sup(b, n)})<sup>${p}</sup>`, `${sup(a, m * p)} × ${sup(b, n * p)}`] } } },
  { id: 'pecNeg', n: 396, lv: 3, pair: 1, mk: i => { const [x, y, z] = D(i, 9, 11, 4), p = 1 + x, q0 = 2 + y, q = q0 === p ? 13 : q0, n = 2 + z, P = p ** n, Q = q ** n, g = gcd(P, Q)
    return { e: `(${fr(p, q)})<sup>−${n}</sup>`, a: fq(Q / g, P / g), w: [fr(P, Q), fq(Q, p), fq(q, P)], f: j => fq(Q / g + j, P / g), tip: 'Pangkat negatif pada pecahan: pecahan dibalik, lalu dipangkatkan.', s: ['Pangkat negatif pada pecahan: pecahannya dibalik', `(${fr(q, p)})<sup>${n}</sup> = ${Q}/${P}`, g > 1 ? `Sederhanakan: ${Q}/${P} = ${Q / g}/${P / g}` : `Hasil: ${Q}/${P}`] } } },
  { id: 'mix', n: 64800, lv: 3, mk: i => { const [x, y, z, u, v] = D(i, 8, 9, 9, 5, 20), b = 2 + x, m = 1 + y, n = 1 + z, p = 2 + u, k = 1 + v, r = p * (m + n) - k
    return { e: `(${sup(b, m)} × ${sup(b, n)})<sup>${p}</sup> ÷ ${sup(b, k)}`, a: pw(b, r), w: [pw(b, m + n + p - k), pw(b, m * n * p - k), pw(b, r + 1)], f: j => pw(b, r + 1 + j), tip: 'Kurung dulu (pangkat dijumlah), lalu dipangkatkan (dikali), lalu dibagi (dikurang).', s: [`Dalam kurung: pangkat dijumlahkan, ${m} + ${n} = ${m + n}`, `Dipangkatkan ${p}: pangkat dikalikan, ${m + n} × ${p} = ${(m + n) * p}`, `Dibagi ${sup(b, k)}: pangkat dikurangkan, ${(m + n) * p} − ${k} = ${ex(r)}`, hasilTxt(b, r)] } } },
  { id: 'mix2', n: 25920, lv: 3, mk: i => { const [x, y, z, u, v] = D(i, 8, 9, 9, 4, 10), b = 2 + x, m = 2 + y, n = 1 + z, p = 2 + u, k = 1 + v, d = m - n, r = p * d + k
    return { e: `(${sup(b, m)} ÷ ${sup(b, n)})<sup>${p}</sup> × ${sup(b, k)}`, a: pw(b, r), w: [pw(b, p * d - k), pw(b, d + p + k), pw(b, r + 1)], f: j => pw(b, r + 1 + j), tip: 'Kurung dulu (pangkat dikurang), lalu dipangkatkan (dikali), lalu dikali (dijumlah).', s: [`Dalam kurung: pangkat dikurangkan, ${m} − ${n} = ${ex(d)}`, `Dipangkatkan ${p}: pangkat dikalikan, ${ex(d)} × ${p} = ${ex(d * p)}`, `Dikali ${sup(b, k)}: pangkat dijumlahkan, ${ex(d * p)} + ${k} = ${ex(r)}`, hasilTxt(b, r)] } } },
  { id: 'akarKonv', n: 176, lv: 2, pair: 1, mk: i => { const [x, y, z] = D(i, 11, 4, 4), b = 2 + x, n = 2 + y, m = 1 + z, isi = m === 1 ? b : sup(b, m)
    return { e: sup(b, fr(m, n)), q: `Bentuk akar dari ${sup(b, fr(m, n))} adalah ...`, a: ak(n, isi), w: [m === 1 ? ak(n + 1, b) : ak(m, sup(b, n)), ak(n, b * m), ak(n + 1, isi)], f: j => ak(n + 1 + j, isi), tip: 'Penyebut pangkat menjadi indeks akar, pembilang menjadi pangkat bilangan di dalam akar.',
      s: [`Penyebut pangkat (${n}) menjadi indeks akar`, `Pembilang pangkat (${m}) menjadi pangkat bilangan di dalam akar`, `Hasil: ${ak(n, isi)}`] } } },
  { id: 'akarNilai', n: 72, lv: 2, int: 1, pair: 1, mk: i => { const [x, y, z] = D(i, 8, 3, 3), b = 2 + x, n = 2 + y, m = 1 + z, X = b ** n
    return { e: sup(X, fr(m, n)), a: b ** m, w: [b * m, X * m, b ** (m + 1)], tip: 'Pangkat pecahan: ambil akarnya dulu, lalu pangkatkan.',
      s: [`Penyebut ${n} berarti akar pangkat ${n}: ${ak(n, X)} = ${b}, karena ${sup(b, n)} = ${X}`, `Pembilang ${m} berarti dipangkatkan ${m}: ${sup(b, m)}`, `= ${b ** m}`] } } },
  { id: 'akarSeder', n: 64, lv: 2, pair: 1, mk: i => { const [x, y] = D(i, 8, 8), k = 2 + x, r = LA[y]
    return { e: ak(2, k * k * r), q: `Bentuk paling sederhana dari ${ak(2, k * k * r)} adalah ...`, a: rt(k, r), w: [rt(k * k, r), rt(k, r + 2), rt(r, k)], f: j => rt(k + j, r), tip: 'Cari faktor kuadrat di dalam akar.',
      s: [`Cari faktor kuadrat: ${k * k * r} = ${k * k} × ${r}`, `${ak(2, k * k * r)} = ${ak(2, k * k)} × ${ak(2, r)}`, `${ak(2, k * k)} = ${k}, jadi hasilnya ${rt(k, r)}`] } } },
  { id: 'akarJumlah', n: 640, lv: 2, pair: 1, mk: i => { const [x, y, z, o] = D(i, 5, 8, 8, 2), c = CS[x], p = 2 + y, q = 1 + z
    const plus = o === 0, hasil = plus ? p + q : p
    return { e: plus ? `${rt(p, c)} + ${rt(q, c)}` : `${rt(p + q, c)} − ${rt(q, c)}`, a: rt(hasil, c), w: plus ? [rt(p * q, c), rt(p + q, 2 * c), ak(2, (p + q) * c)] : [rt(p + 2 * q, c), rt(p - 1, c), ak(2, p * c)], f: j => rt(hasil + j, c), tip: 'Akar sejenis (isi akar sama): operasikan koefisiennya saja.',
      s: [`Isi akarnya sama (${c}), jadi koefisien boleh dioperasikan`, plus ? `${p} + ${q} = ${p + q}` : `${p + q} − ${q} = ${p}`, `Hasil: ${rt(hasil, c)}`] } } },
  { id: 'akarKali', n: 1650, lv: 2, pair: 1, mk: i => { const [x, y, z, u] = D(i, 6, 11, 5, 5), p = [2, 3, 5, 6, 7, 10][x], q = 2 + y, a1 = 1 + z, b1 = 1 + u, [k, r] = simp(p * q), K = a1 * b1 * k, a = r === 1 ? K : rt(K, r)
    return { e: `${rt(a1, p)} × ${rt(b1, q)}`, a, w: [rt(a1 * b1, p + q), rt(a1 + b1, p * q), rt(a1 * b1, p * q)], f: j => rt(K + j, r), tip: 'Koefisien dikali koefisien, isi akar dikali isi akar, lalu sederhanakan.',
      s: [`Kalikan koefisien: ${a1} × ${b1} = ${a1 * b1}`, `Kalikan isi akar: ${ak(2, p)} × ${ak(2, q)} = ${ak(2, p * q)}`, k > 1 ? `Sederhanakan: ${ak(2, p * q)} = ${rt(k, r)} (karena ${p * q} = ${k * k} × ${r})` : 'Isi akar sudah sederhana (tidak ada faktor kuadrat)', `Hasil: ${a}`] } } },
  { id: 'akarBagi', n: 1320, lv: 2, pair: 1, mk: i => { const [x, y, z, u] = D(i, 6, 11, 4, 5), q = [2, 3, 5, 6, 7, 10][x], r = 2 + y, b1 = 1 + z, c1 = 1 + u, [k, rr] = simp(r), K = c1 * k, a = rr === 1 ? K : rt(K, rr)
    return { e: `${rt(c1 * b1, q * r)} ÷ ${rt(b1, q)}`, a, w: [rt(c1, q * r), rt(c1 * b1, r), rt(c1 + b1, r)], f: j => rt(K + j, rr === 1 ? 2 : rr), tip: 'Koefisien dibagi koefisien, isi akar dibagi isi akar, lalu sederhanakan.',
      s: [`Bagi koefisien: ${c1 * b1} ÷ ${b1} = ${c1}`, `Bagi isi akar: ${ak(2, q * r)} ÷ ${ak(2, q)} = ${ak(2, r)}`, k > 1 ? `Sederhanakan: ${ak(2, r)} = ${rt(k, rr)} (karena ${r} = ${k * k} × ${rr})` : rr === 1 ? `${ak(2, r)} = ${k}` : 'Isi akar sudah sederhana', `Hasil: ${a}`] } } },
  { id: 'rasional', n: 96, lv: 2, pair: 1, mk: i => { const [x, y] = D(i, 12, 8), a = 1 + x, b = LA[y], g = gcd(a, b), res = a % b === 0 ? rt(a / b, b) : fr(rt(a / g, b), b / g)
    return { e: fr(a, ak(2, b)), q: `Rasionalkan penyebut ${fr(a, ak(2, b))} (bentuk paling sederhana)`, a: res, w: [fr(a, b), rt(a, b), fr(rt(b, a), b)], f: j => fr(rt(a / g + j, b), b / g), tip: 'Kalikan pembilang dan penyebut dengan akar yang sama.',
      s: [`Kalikan pembilang dan penyebut dengan ${ak(2, b)}`, `Penyebut: ${ak(2, b)} × ${ak(2, b)} = ${b}. Pembilang: ${a} × ${ak(2, b)} = ${rt(a, b)}`, g > 1 || a % b === 0 ? `Sederhanakan: ${res}` : `Hasil: ${res}`] } } },
  { id: 'rasional2', n: 324, lv: 3, mk: i => { const [x, y, z, o] = D(i, 3, 6, 9, 2), c = CL[x], b = [6, 7, 10, 11, 13, 14][y], a = 1 + z, d = b - c, mn = o === 0 ? '+' : '−', sw = o === 0 ? '−' : '+'
    const dalam = `${ak(2, b)} ${sw} ${ak(2, c)}`, res = a % d === 0 ? `${a / d}(${dalam})` : fr(`${a}(${dalam})`, d)
    return { e: fr(a, `${ak(2, b)} ${mn} ${ak(2, c)}`), q: `Rasionalkan penyebut ${fr(a, `${ak(2, b)} ${mn} ${ak(2, c)}`)}`, a: res, w: [fr(`${a}(${ak(2, b)} ${mn} ${ak(2, c)})`, d), fr(`${a}(${dalam})`, b + c), `${a}(${dalam})`], f: j => fr(`${a}(${dalam})`, d + j), tip: 'Kalikan dengan sekawan penyebut. Hasil kali sekawan: b − c.',
      s: [`Sekawan penyebut adalah (${dalam}). Kalikan pembilang dan penyebut dengan sekawan itu`, `Penyebut: (${ak(2, b)} ${mn} ${ak(2, c)})(${dalam}) = ${b} − ${c} = ${d}`, `Pembilang: ${a}(${dalam})`, `Hasil: ${res}`] } } },
  { id: 'bakuBiasa', n: 192, lv: 2, pair: 1, mk: i => { const [x, y] = D(i, 12, 16), mant = ML[x], n = y - 6, a = bakuKeBiasa(mant, n)
    return { e: `${mant} × ${sup(10, ex(n))}`, q: `Ubah ${mant} × ${sup(10, ex(n))} ke bentuk biasa`, a, w: [bakuKeBiasa(mant, n + 1), bakuKeBiasa(mant, n - 1), bakuKeBiasa(mant, -n)], f: j => bakuKeBiasa(mant, n + 1 + j), tip: 'Pangkat positif: koma ke kanan. Pangkat negatif: koma ke kiri.',
      s: [n === 0 ? 'Pangkat 0: dikali 1, jadi koma tidak bergeser' : `Pangkat ${ex(n)} berarti koma digeser ${Math.abs(n)} langkah ke ${n > 0 ? 'kanan' : 'kiri'}`, `Angka dasarnya ${mant.replace(',', '')}, atur posisi koma dan nolnya`, `Hasil: ${a}`] } } },
  { id: 'biasaBaku', n: 216, lv: 2, pair: 1, mk: i => { const [x, y] = D(i, 12, 18), mant = ML[x], n = y - 7, biasa = bakuKeBiasa(mant, n), a = `${mant} × ${sup(10, ex(n))}`
    return { e: biasa, q: `Ubah ${biasa} ke bentuk baku`, a, w: [`${mant} × ${sup(10, ex(n + 1))}`, `${mant} × ${sup(10, ex(n - 1))}`, `${mant} × ${sup(10, ex(-n))}`], f: j => `${mant} × ${sup(10, ex(n + 1 + j))}`, tip: 'Geser koma sampai di belakang angka pertama yang bukan nol.',
      s: [`Geser koma sampai tepat di belakang angka pertama yang bukan nol: ${mant}`, n === 0 ? 'Koma tidak bergeser, jadi pangkatnya 0' : `Koma bergeser ${Math.abs(n)} langkah ke ${n > 0 ? 'kiri' : 'kanan'}, jadi pangkatnya ${ex(n)}`, `Hasil: ${a}`] } } }
]
const TOTAL = FAM.reduce((t, f) => t + f.n, 0)
const sudah = new Set()
const bangun = (f, i) => { const x = f.mk(i); x.q = x.q || `${x.e} = ?`; x.fam = f.id; x.int = !!f.int; return x }
const tarik = (lv, fl) => {
  const c = FAM.filter(f => f.lv === lv && fl(f)), pool = c.length ? c : FAM.filter(fl)
  for (let t = 0; t < 40; t++) { const f = pool[Math.floor(Math.random() * pool.length)], i = Math.floor(Math.random() * f.n); if (!sudah.has(f.id + ':' + i)) { sudah.add(f.id + ':' + i); return bangun(f, i) } }
  const f = pool[0]; return bangun(f, Math.floor(Math.random() * f.n))
}
const pilihan = x => {
  const set = new Set([T(x.a)]); x.w.forEach(v => { if (typeof v !== 'number' || v > 0) set.add(T(v)) })
  let j = 1; while (set.size < 4) set.add(T(x.f ? x.f(j++) : x.a + j++ * 2))
  const o = acak(set); return { o, ok: o.indexOf(T(x.a)) }
}

/* ---------- Kuis edukasi: 4 jenis, 5 soal per sesi, ada batas waktu ---------- */
function kuis1() {
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
    el.innerHTML = `<p class="kecil">Bank soal: <b>${fmt(TOTAL)}</b> soal berbeda, dibuat dari angka-angka yang berganti. Tiap sesi berisi 5 soal dengan batas waktu. Di akhir kamu bisa melihat benar-salahnya beserta pembahasan, lalu main lagi dengan soal yang berbeda.</p>
      <div class="grid">${Object.entries(MODE).map(([k, m]) => `<div class="card materi"><div class="ikon">${m.ik}</div><h3>${m.n}</h3><p>${m.d}</p><p class="kecil">Waktu: ${wkt(m.w)}</p><button class="btn" data-m="${k}">Mulai</button></div>`).join('')}</div>`
    el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => mulai(b.dataset.m))
  }

  const mulai = mode => {
    const M = MODE[mode], lv = mode === 'cepat' || mode === 'cocok' ? [1, 1, 2, 2, 2] : [1, 1, 2, 2, 3]
    const fl = mode === 'cepat' ? f => f.int : mode === 'cocok' ? f => f.pair : () => true, soal = []
    lv.forEach(l => { for (let t = 0; t < 25; t++) { const x = tarik(l, fl); if (mode !== 'cocok' || t === 24 || !soal.some(o => T(o.a) === T(x.a))) { soal.push(x); break } } })
    soal.forEach(x => {
      if (mode === 'biasa') x.p = pilihan(x)
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

const _bukaAsli = bukaMateri
window.bukaMateri = m => m.urutan === 1 ? bukaMateri1(m) : _bukaAsli(m)

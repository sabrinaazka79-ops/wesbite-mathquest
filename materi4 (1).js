/* Materi 4: Relasi dan Fungsi (lengkap: penjelasan, visual interaktif, ringkasan, contoh, latihan, kuis).
   Muat SETELAH Materi1.js, Materi2.js, dan Materi3.js (memakai helper dan gaya yang sama). */
const ang4 = v => v < 0 ? '−' + (-v) : String(v)
const T4 = v => typeof v === 'number' ? ang4(v) : String(v)
const fak4 = n => n <= 1 ? 1 : n * fak4(n - 1)
const rg4 = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
const rum4 = (a, b) => `${a === 1 ? '' : a === -1 ? '−' : ang4(a)}x${b === 0 ? '' : b < 0 ? ' − ' + (-b) : ' + ' + b}`
const him4 = arr => '{' + arr.join(', ') + '}'
const psg4 = (A, B, P) => him4(P.map(([i, j]) => `(${A[i]}, ${B[j]})`))
const per4 = n => n <= 1 ? [[0]] : per4(n - 1).flatMap(p => Array.from({ length: n }, (_, k) => [...p.slice(0, k), n - 1, ...p.slice(k)]))
const kap4 = (svg, t) => `<div>${svg}<div class="kecil">${t}</div></div>`

document.head.insertAdjacentHTML('beforeend', `<style>
  .svg4 { width:100%; display:block; margin:8px auto; color:var(--ink) }
  .svg4 text { fill:currentColor; font:800 13px sans-serif; paint-order:stroke; stroke:var(--card,#fff); stroke-width:3.5px; stroke-linejoin:round }
  .svg4 text.sb { stroke:none; font:700 11px sans-serif; opacity:.7 }
  .dg4 { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin:8px 0 }
  .dg4 > div { text-align:center; flex:0 1 auto }
  .tb4 { width:100%; border-collapse:collapse; margin:8px 0 }
  .tb4 th, .tb4 td { border:1px solid var(--line,#ddd); padding:6px 8px; text-align:center; vertical-align:middle }
  .tb4 th { background:#6c4cf122 }
  .gr4 { display:grid; gap:4px; max-width:300px; margin:8px auto }
  .gr4 span { padding:8px 0; text-align:center; font-weight:800 }
  .gr4 button { padding:8px 0; border-radius:10px; font:inherit; font-weight:800; border:2px solid var(--line,#ddd); background:transparent; color:inherit; cursor:pointer }
  .gr4 button.on { border-color:#6c4cf1; background:#6c4cf133 }
</style>`)

/* Diagram panah: A di kiri, B di kanan, P = pasangan indeks [i, j] */
const panah4 = (A, B, P, o = {}) => {
  const rx = o.rx || 24, g = o.g || 24, w = o.w || 2 * rx + 150, rows = Math.max(A.length, B.length), cap = o.cap ? 14 : 0
  const h = rows * g + 22 + cap, xa = rx + 14, xb = w - xa, cy = 11 + rows * g / 2
  const y = (k, n) => 11 + (rows - n) * g / 2 + k * g + g / 2
  const oval = (x, n) => `<ellipse cx="${x}" cy="${cy}" rx="${rx}" ry="${n * g / 2 + 5}" fill="currentColor" fill-opacity=".05" stroke="currentColor" stroke-opacity=".5" stroke-width="1.5"/>`
  const lab = (x, arr) => arr.map((t, k) => `<text x="${x}" y="${y(k, arr.length) + 4}" text-anchor="middle">${t}</text>`).join('')
  const ar = P.map(([i, j]) => `<line x1="${xa + rx - 9}" y1="${y(i, A.length)}" x2="${xb - rx + 6}" y2="${y(j, B.length)}" stroke="#6c4cf1" stroke-width="1.8" marker-end="url(#ar4)"/>`).join('')
  return `<svg class="svg4" viewBox="0 0 ${w} ${h}" style="max-width:${w}px" role="img" aria-label="Diagram panah: ${psg4(A, B, P)}">
    <defs><marker id="ar4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z" fill="#6c4cf1"/></marker></defs>
    ${oval(xa, A.length)}${oval(xb, B.length)}${ar}${lab(xa, A)}${lab(xb, B)}
    ${o.cap ? `<text class="sb" x="${xa}" y="${h - 3}" text-anchor="middle">${o.cap[0]}</text><text class="sb" x="${xb}" y="${h - 3}" text-anchor="middle">${o.cap[1]}</text>` : ''}</svg>`
}

/* Diagram Cartesius: titik-titik dan (opsional) garis o.line = [a, b] */
let uid4 = 0
const kartesius4 = (pts, o) => {
  const { x0, x1, y0, y1 } = o, s = Math.min(o.s || 24, 300 / (x1 - x0), 250 / (y1 - y0)), m = 20
  const W = (x1 - x0) * s + 2 * m, H = (y1 - y0) * s + 2 * m, id = 'cp4_' + (++uid4), sy = o.sy || Math.ceil((y1 - y0) / 12), sx = o.sx || 1
  const X = x => m + (x - x0) * s, Y = y => m + (y1 - y) * s
  const gx = rg4(x0, x1).map(x => `<line x1="${X(x)}" y1="${m}" x2="${X(x)}" y2="${H - m}" stroke="currentColor" opacity="${x === 0 ? .9 : .12}" stroke-width="${x === 0 ? 1.6 : 1}"/>${x !== 0 && x % sx === 0 ? `<text class="sb" x="${X(x)}" y="${Y(0) + 12}" text-anchor="middle">${ang4(x)}</text>` : ''}`).join('')
  const gy = rg4(y0, y1).map(y => `<line x1="${m}" y1="${Y(y)}" x2="${W - m}" y2="${Y(y)}" stroke="currentColor" opacity="${y === 0 ? .9 : .12}" stroke-width="${y === 0 ? 1.6 : 1}"/>${y !== 0 && y % sy === 0 ? `<text class="sb" x="${X(0) - 4}" y="${Y(y) + 4}" text-anchor="end">${ang4(y)}</text>` : ''}`).join('')
  const gl = o.line ? `<line x1="${X(x0)}" y1="${Y(o.line[0] * x0 + o.line[1])}" x2="${X(x1)}" y2="${Y(o.line[0] * x1 + o.line[1])}" clip-path="url(#${id})" stroke="#6c4cf1" stroke-width="2.5"/>` : ''
  const dt = pts.map(([x, y]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="4.5" fill="#6c4cf1"/>${o.lab ? `<text class="sb" x="${X(x) + 6}" y="${Y(y) - 6}">(${ang4(x)}, ${ang4(y)})</text>` : ''}`).join('')
  return `<svg class="svg4" viewBox="0 0 ${W} ${H}" style="max-width:${Math.round(W)}px" role="img" aria-label="Diagram Cartesius dengan titik ${pts.map(p => `(${ang4(p[0])}, ${ang4(p[1])})`).join(', ')}">
    <defs><clipPath id="${id}"><rect x="${m}" y="${m}" width="${W - 2 * m}" height="${H - 2 * m}"/></clipPath></defs>
    ${gx}${gy}${gl}${dt}<text x="${W - 6}" y="${Y(0) - 6}" text-anchor="end">x</text><text x="${X(0) + 8}" y="13">y</text></svg>`
}

/* Semua korespondensi satu-satu untuk n anggota (diagram mini) */
const kor4 = n => `<div class="dg4">${per4(n).map((p, k) => kap4(panah4(['1', '2', '3', '4'].slice(0, n), ['a', 'b', 'c', 'd'].slice(0, n), p.map((j, i) => [i, j]), { w: 100, rx: 15, g: 16 }), `#${k + 1}`)).join('')}</div>`

const M4 = {
  bagian: [
    ['A.1 Pengertian Himpunan', ps('Halo, Petualang! Aku Kapten Panah. Di Negeri Pasangan, setiap petualang punya teman seperjalanan. Hari ini kita belajar menghubungkan dua kelompok benda dengan aturan yang jelas.') + `
      <p>Sebelum belajar relasi, kenali dulu <b>himpunan</b>, karena relasi selalu menghubungkan dua himpunan.</p>
      <h4 class="sub">Pengertian himpunan</h4>
      <p><b>Himpunan</b> adalah kumpulan benda atau objek yang <b>batasnya jelas</b>, sehingga kita bisa memastikan suatu benda termasuk anggota atau bukan. Contoh: "bilangan genap kurang dari 10" adalah himpunan. "Makanan yang enak" bukan himpunan, karena enak menurut tiap orang berbeda.</p>
      <h4 class="sub">Notasi himpunan</h4>
      <ul><li>Nama himpunan memakai huruf kapital dan anggotanya ditulis di dalam kurung kurawal: A = {2, 4, 6, 8}.</li>
      <li>∈ dibaca "anggota dari" dan ∉ dibaca "bukan anggota dari". Jadi 4 ∈ A dan 5 ∉ A.</li>
      <li>n(A) adalah banyak anggota himpunan A. Di sini n(A) = 4.</li>
      <li>Himpunan kosong tidak punya anggota, ditulis { } atau ∅.</li></ul>
      <h4 class="sub">Dua cara menyatakan himpunan</h4>
      <p><b>Mendaftar anggota:</b> A = {2, 4, 6, 8}. <b>Menyebutkan sifat:</b> A = {x | x bilangan genap, 2 ≤ x ≤ 8}.</p>
      <div class="tip">💡 Dalam relasi dan fungsi kita selalu memakai dua himpunan: himpunan asal (A) dan himpunan tujuan (B).</div>`],
    ['A.2 Pengertian Relasi', `
      <p><b>Relasi</b> dari himpunan A ke himpunan B adalah aturan yang memasangkan anggota-anggota A dengan anggota-anggota B.</p>
      <p><b>Contoh.</b> A = {Ani, Budi, Cici} dan B = {Basket, Renang, Voli}. Relasinya adalah "gemar bermain". Ani gemar Basket, Budi gemar Renang dan Voli, dan Cici gemar Renang.</p>
      ${panah4(['Ani', 'Budi', 'Cici'], ['Basket', 'Renang', 'Voli'], [[0, 0], [1, 1], [1, 2], [2, 1]], { w: 270, rx: 38, cap: ['A', 'B'] })}
      <p>Relasi memberi nama pada hubungan antara dua himpunan. Pada bilangan, contoh nama relasi adalah "lebih dari", "kurang dari", "faktor dari", "setengah dari", dan "dua kali dari".</p>
      <p><b>Contoh relasi bilangan.</b> Relasi "faktor dari" dari A = {1, 2, 3} ke B = {2, 3, 4, 6}: 1 adalah faktor dari 2, 3, 4, 6; 2 adalah faktor dari 2, 4, 6; 3 adalah faktor dari 3 dan 6.</p>
      ${panah4(['1', '2', '3'], ['2', '3', '4', '6'], [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 2], [1, 3], [2, 1], [2, 3]], { cap: ['A', 'B'] })}
      <div class="tip">⚠️ Perhatikan arahnya: relasi <b>dari A ke B</b>. Pada relasi, satu anggota A boleh punya banyak pasangan, dan boleh juga tidak punya pasangan sama sekali.</div>`],
    ['A.3 Menyajikan Relasi', `
      <p>Sebuah relasi dapat disajikan dengan tiga cara. Kita pakai satu contoh: relasi <b>"kurang dari"</b> dari A = {1, 2, 3} ke B = {2, 3, 4}.</p>
      <h4 class="sub">1. Diagram panah</h4>
      <p>Anggota A dan B digambar dalam dua lingkaran. Anak panah menghubungkan anggota A dengan pasangannya di B.</p>
      ${panah4(['1', '2', '3'], ['2', '3', '4'], [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [2, 2]], { cap: ['A', 'B'] })}
      <h4 class="sub">2. Himpunan pasangan berurutan</h4>
      <p>Setiap pasangan ditulis (a, b) dengan a anggota A dan b anggota B. <b>Urutannya penting</b>: (1, 2) tidak sama dengan (2, 1).</p>
      <div class="rumus">{(1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (3, 4)}</div>
      <h4 class="sub">3. Diagram Cartesius</h4>
      <p>Anggota A diletakkan pada sumbu mendatar (sumbu-x) dan anggota B pada sumbu tegak (sumbu-y). Setiap pasangan digambar sebagai satu titik.</p>
      ${kartesius4([[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]], { x0: 0, x1: 4, y0: 0, y1: 5, s: 30 })}
      <div class="tip">💡 Ketiga cara itu menyajikan relasi yang sama. Banyaknya anak panah = banyaknya pasangan berurutan = banyaknya titik (di sini 6).</div>`]
  ],
  bagianB: [
    ['B.1 Pengertian Fungsi, Karakteristik, dan Ciri-Ciri Fungsi', `
      <h4 class="sub">Pengertian fungsi</h4>
      <p><b>Fungsi</b> (disebut juga <b>pemetaan</b>) dari A ke B adalah relasi khusus yang memasangkan <b>setiap anggota A dengan tepat satu anggota B</b>. Fungsi ditulis f: A → B.</p>
      <h4 class="sub">Karakteristik fungsi pada diagram panah</h4>
      <ol><li>Setiap anggota A punya pasangan, tidak boleh ada yang menganggur.</li>
      <li>Setiap anggota A hanya punya <b>satu</b> pasangan, tidak boleh ada anak panah yang bercabang.</li>
      <li>Anggota B boleh tidak mendapat pasangan, dan boleh dipasangi lebih dari satu anggota A.</li></ol>
      <div class="dg4">${kap4(panah4(['1', '2', '3'], ['a', 'b', 'c'], [[0, 0], [1, 1], [2, 1]]), '✅ Fungsi')}${kap4(panah4(['1', '2', '3'], ['a', 'b', 'c'], [[0, 0], [1, 1]]), '❌ 3 tidak punya pasangan')}${kap4(panah4(['1', '2', '3'], ['a', 'b', 'c'], [[0, 0], [0, 1], [1, 2], [2, 2]]), '❌ 1 punya dua pasangan')}</div>
      <h4 class="sub">Ciri-ciri fungsi</h4>
      <ul><li><b>Pada diagram panah:</b> dari setiap anggota A keluar tepat satu anak panah.</li>
      <li><b>Pada pasangan berurutan:</b> semua anggota A muncul sebagai komponen pertama, dan tidak ada dua pasangan dengan komponen pertama sama tetapi komponen kedua berbeda. {(1, a), (2, b), (3, b)} adalah fungsi, sedangkan {(1, a), (1, b), (2, c)} bukan.</li>
      <li><b>Pada diagram Cartesius:</b> setiap garis tegak yang melalui anggota A memuat tepat satu titik.</li></ul>
      <div class="tip">💡 Cara cepat menguji: tunjuk satu per satu anggota A. Kalau tiap anggota punya tepat satu panah keluar, relasi itu fungsi. Jumlah fungsi yang mungkin dari A ke B adalah n(B)<sup>n(A)</sup>.</div>`],
    ['B.2 Domain, Kodomain, dan Range', `
      <p>Pada fungsi f: A → B, ada tiga himpunan penting.</p>
      <ul><li><b>Domain</b> (daerah asal): himpunan A, yaitu semua anggota yang dipetakan.</li>
      <li><b>Kodomain</b> (daerah kawan): himpunan B, yaitu tempat hasil pemetaan.</li>
      <li><b>Range</b> (daerah hasil): anggota B yang benar-benar mendapat pasangan dari A.</li></ul>
      <p><b>Contoh.</b> f: A → B dengan f(x) = x + 2, A = {1, 2, 3}, dan B = {2, 3, 4, 5, 6}. Maka f(1) = 3, f(2) = 4, f(3) = 5.</p>
      ${panah4(['1', '2', '3'], ['2', '3', '4', '5', '6'], [[0, 1], [1, 2], [2, 3]], { cap: ['Domain', 'Kodomain'] })}
      <table class="tb4"><tr><th>Domain</th><th>Kodomain</th><th>Range</th></tr><tr><td>{1, 2, 3}</td><td>{2, 3, 4, 5, 6}</td><td>{3, 4, 5}</td></tr></table>
      <div class="tip">💡 Range selalu bagian dari kodomain. Anggota kodomain yang tidak mendapat pasangan (2 dan 6) tidak masuk range.</div>`],
    ['B.3 Grafik Fungsi', `
      <p><b>Grafik fungsi</b> adalah kumpulan titik (x, f(x)) pada bidang Cartesius. Domain menjadi sumbu-x dan hasil fungsi menjadi sumbu-y.</p>
      <h4 class="sub">Langkah menggambar grafik</h4>
      <ol><li>Buat tabel nilai x dan f(x).</li><li>Tulis pasangan berurutan (x, f(x)).</li><li>Gambar tiap pasangan sebagai titik pada bidang Cartesius.</li><li>Kalau domainnya semua bilangan real, hubungkan titik-titik dengan garis.</li></ol>
      <p><b>Contoh.</b> f(x) = 2x − 1 dengan domain {0, 1, 2, 3}.</p>
      <table class="tb4"><tr><th>x</th><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><th>f(x)</th><td>−1</td><td>1</td><td>3</td><td>5</td></tr></table>
      <p>Pasangan berurutannya: (0, −1), (1, 1), (2, 3), (3, 5). Karena domainnya hanya empat bilangan, grafiknya berupa <b>titik-titik terpisah</b>.</p>
      ${kartesius4([[0, -1], [1, 1], [2, 3], [3, 5]], { x0: -1, x1: 4, y0: -2, y1: 6, s: 28, lab: 1 })}
      <p>Kalau domainnya <b>semua bilangan real</b>, titik-titik itu tersambung menjadi sebuah garis lurus.</p>
      ${kartesius4([[0, -1], [1, 1], [2, 3], [3, 5]], { x0: -2, x1: 4, y0: -5, y1: 7, s: 26, line: [2, -1] })}`],
    ['B.4 Rumus Fungsi', `
      <p>Fungsi sering ditulis dengan rumus. Pada kelas VIII bentuk yang dipakai adalah <b>f(x) = ax + b</b>, atau ditulis f: x → ax + b. Contoh: f(x) = 3x − 2.</p>
      <div class="rumus">f(x) = ax + b</div>
      <h4 class="sub">a. Menghitung nilai fungsi</h4>
      <p>Ganti x dengan bilangan yang diminta. Untuk f(x) = 3x − 2: f(4) = 3(4) − 2 = 10, dan f(−1) = 3(−1) − 2 = −5.</p>
      <h4 class="sub">b. Mencari x jika nilai fungsinya diketahui</h4>
      <p>Jika f(x) = 2x + 3 dan f(m) = 11, maka 2m + 3 = 11, jadi 2m = 8 dan m = 4.</p>
      <h4 class="sub">c. Menentukan rumus fungsi</h4>
      <p>Diketahui f(x) = ax + b, f(1) = 5, dan f(3) = 11. Maka a + b = 5 dan 3a + b = 11. Kurangkan: 2a = 6, sehingga a = 3. Lalu b = 5 − 3 = 2. Rumusnya f(x) = 3x + 2.</p>
      <div class="tip">✅ Periksa dengan mengganti kembali: f(1) = 3 + 2 = 5 dan f(3) = 9 + 2 = 11. Keduanya cocok.</div>`]
  ],
  bagianC: [
    ['C.1 Pengertian Korespondensi Satu-Satu', `
      <p><b>Korespondensi satu-satu</b> adalah fungsi dari A ke B yang setiap anggota A punya tepat satu pasangan di B, dan <b>setiap anggota B juga punya tepat satu pasangan di A</b>. Akibatnya n(A) = n(B).</p>
      <div class="dg4">${kap4(panah4(['1', '2', '3'], ['a', 'b', 'c'], [[0, 1], [1, 2], [2, 0]]), '✅ Korespondensi satu-satu')}${kap4(panah4(['1', '2', '3'], ['a', 'b', 'c'], [[0, 0], [1, 1], [2, 1]]), '❌ b dipasangi dua, c menganggur')}${kap4(panah4(['1', '2'], ['a', 'b', 'c'], [[0, 0], [1, 2]]), '❌ b menganggur')}</div>
      <div class="tip">💡 Periksa dari dua arah. Tiap anggota A punya satu panah keluar, dan tiap anggota B menerima satu panah masuk.</div>`],
    ['C.2 Banyak Korespondensi Satu-Satu', `
      <p>Berapa banyak korespondensi satu-satu yang bisa dibuat dari A ke B jika keduanya punya n anggota? Tabel berikut memperlihatkan semua diagram panahnya.</p>
      <table class="tb4"><tr><th>n(A) = n(B)</th><th>Semua korespondensi satu-satu</th><th>Banyak</th></tr>
      <tr><td>1</td><td>${kor4(1)}</td><td><b>1</b></td></tr>
      <tr><td>2</td><td>${kor4(2)}</td><td><b>2</b></td></tr>
      <tr><td>3</td><td>${kor4(3)}</td><td><b>6</b></td></tr>
      <tr><td>4</td><td>Ada 24 diagram, terlalu banyak untuk digambar semuanya.</td><td><b>24</b></td></tr></table>
      <h4 class="sub">Mengapa begitu?</h4>
      <p>Anggota pertama A punya n pilihan pasangan. Anggota kedua punya satu pilihan lebih sedikit, yaitu n − 1, karena satu anggota B sudah terpakai. Begitu seterusnya sampai anggota terakhir hanya punya 1 pilihan.</p>
      <div class="rumus">Banyak korespondensi = n × (n − 1) × ... × 2 × 1 = n!</div>
      <p>Untuk n = 3: 3 × 2 × 1 = 6. Untuk n = 4: 4 × 3 × 2 × 1 = 24. Untuk n = 5: 5 × 4 × 3 × 2 × 1 = 120.</p>`]
  ],
  ringkasan: [
    'Himpunan adalah kumpulan objek yang batasnya jelas. Anggota ditulis dalam { }, ∈ berarti anggota, dan n(A) adalah banyak anggota A.',
    'Relasi dari A ke B adalah aturan yang memasangkan anggota A dengan anggota B.',
    'Relasi disajikan dengan diagram panah, himpunan pasangan berurutan, atau diagram Cartesius.',
    'Fungsi adalah relasi yang memasangkan setiap anggota A dengan tepat satu anggota B.',
    'Ciri fungsi: tidak ada anggota A tanpa pasangan, tidak ada anggota A yang punya dua pasangan. Anggota B boleh menganggur atau dipasangi lebih dari satu anggota A.',
    'Domain adalah daerah asal (A), kodomain adalah daerah kawan (B), dan range adalah daerah hasil, yaitu anggota B yang mendapat pasangan.',
    'Grafik fungsi terdiri dari titik (x, f(x)). Jika domainnya bilangan real, grafik f(x) = ax + b berupa garis lurus.',
    'Pada f(x) = ax + b, nilai f(k) dicari dengan mengganti x dengan k. Banyak fungsi dari A ke B adalah n(B)<sup>n(A)</sup>.',
    'Korespondensi satu-satu adalah fungsi yang setiap anggota B juga punya tepat satu pasangan di A, sehingga n(A) = n(B).',
    'Banyak korespondensi satu-satu dari A ke B dengan n anggota adalah n! = n × (n − 1) × ... × 1.'
  ],
  tips: ['Untuk menguji fungsi, tunjuk satu per satu anggota A. Harus keluar tepat satu panah dari masing-masing.', 'Domain berisi nilai x, range berisi hasil f(x) yang benar-benar terpakai. Range tidak boleh memuat anggota kodomain yang menganggur.', 'Untuk korespondensi satu-satu, periksa dua arah: tiap anggota A satu panah keluar, tiap anggota B satu panah masuk.'],
  contoh: [
    { tag: 'Pengertian himpunan', r: 'Himpunan harus punya batas yang jelas', q: 'Manakah yang merupakan himpunan? (a) bilangan asli kurang dari 6, (b) hewan yang berbahaya, (c) huruf vokal.', l: ['(a) Batasnya jelas: A = {1, 2, 3, 4, 5}, sehingga n(A) = 5.', '(b) "Berbahaya" menurut tiap orang bisa berbeda, jadi bukan himpunan.', '(c) Batasnya jelas: {a, i, u, e, o}.'], j: '(a) dan (c) adalah himpunan' },
    { tag: 'Menyatakan himpunan', r: 'Daftarkan semua anggota yang memenuhi sifat', q: 'Tuliskan P = {x | x bilangan ganjil, 1 < x < 10} dengan mendaftar anggotanya, lalu tentukan n(P).', l: ['Bilangan ganjil di antara 1 dan 10 (1 dan 10 tidak ikut).', 'P = {3, 5, 7, 9}.', 'Banyak anggotanya n(P) = 4.'], j: 'P = {3, 5, 7, 9} dan n(P) = 4' },
    { tag: 'Menentukan relasi', r: 'Cek setiap anggota A terhadap setiap anggota B', q: 'Tentukan pasangan berurutan relasi "faktor dari" dari A = {2, 3, 4} ke B = {4, 6, 8, 9}.', l: ['2 adalah faktor dari 4, 6, 8.', '3 adalah faktor dari 6 dan 9.', '4 adalah faktor dari 4 dan 8.'], j: '{(2, 4), (2, 6), (2, 8), (3, 6), (3, 9), (4, 4), (4, 8)}' },
    { tag: 'Menyajikan relasi', r: 'Diagram panah, pasangan berurutan, dan diagram Cartesius menyatakan relasi yang sama', q: 'Relasi "setengah dari" dari A = {1, 2, 3} ke B = {2, 4, 6, 8}. Sajikan dengan diagram panah dan pasangan berurutan.', l: ['1 setengah dari 2, 2 setengah dari 4, dan 3 setengah dari 6.', 'Pasangan berurutan: (1, 2), (2, 4), (3, 6).', panah4(['1', '2', '3'], ['2', '4', '6', '8'], [[0, 0], [1, 1], [2, 2]], { cap: ['A', 'B'] })], j: '{(1, 2), (2, 4), (3, 6)}' },
    { tag: 'Fungsi atau bukan', r: 'Setiap anggota A punya tepat satu pasangan', q: 'Dari A = {1, 2, 3} ke B = {a, b}: P₁ = {(1, a), (2, a), (3, b)}, P₂ = {(1, a), (2, b)}, P₃ = {(1, a), (1, b), (2, b), (3, b)}. Manakah yang fungsi?', l: ['P₁: 1, 2, 3 masing-masing punya tepat satu pasangan. Fungsi.', 'P₂: anggota 3 tidak punya pasangan. Bukan fungsi.', 'P₃: anggota 1 punya dua pasangan (a dan b). Bukan fungsi.'], j: 'Hanya P₁ yang merupakan fungsi' },
    { tag: 'Domain, kodomain, range', r: 'Range adalah anggota kodomain yang mendapat pasangan', q: 'Fungsi f: A → B dengan f(x) = 2x + 1, A = {0, 1, 2, 3}, dan B = {1, 2, 3, 4, 5, 6, 7, 8}. Tentukan domain, kodomain, dan range.', l: ['Domain adalah A = {0, 1, 2, 3} dan kodomain adalah B = {1, 2, 3, 4, 5, 6, 7, 8}.', 'Hitung: f(0) = 1, f(1) = 3, f(2) = 5, f(3) = 7.', 'Range adalah hasil yang terpakai: {1, 3, 5, 7}.'], j: 'Range = {1, 3, 5, 7}' },
    { tag: 'Nilai fungsi', r: 'Ganti x dengan bilangan yang diminta', q: 'Diketahui f(x) = 3x − 2. Tentukan f(4), f(−1), dan nilai a jika f(a) = 13.', l: ['f(4) = 3(4) − 2 = 12 − 2 = 10.', 'f(−1) = 3(−1) − 2 = −3 − 2 = −5.', 'f(a) = 13 → 3a − 2 = 13 → 3a = 15 → a = 5.'], j: 'f(4) = 10, f(−1) = −5, a = 5' },
    { tag: 'Grafik fungsi', r: 'Grafik adalah titik-titik (x, f(x))', q: 'Gambarkan grafik f(x) = x − 2 dengan domain {0, 1, 2, 3, 4}.', l: ['Hitung nilainya: f(0) = −2, f(1) = −1, f(2) = 0, f(3) = 1, f(4) = 2.', 'Pasangan berurutan: (0, −2), (1, −1), (2, 0), (3, 1), (4, 2).', kartesius4([[0, -2], [1, -1], [2, 0], [3, 1], [4, 2]], { x0: -1, x1: 5, y0: -3, y1: 3, s: 28 })], j: 'Grafiknya berupa 5 titik yang terletak segaris' },
    { tag: 'Menentukan rumus fungsi', r: 'Dua nilai fungsi cukup untuk mencari a dan b', q: 'Fungsi f(x) = ax + b memenuhi f(1) = 5 dan f(3) = 11. Tentukan rumus fungsinya dan f(10).', l: ['a + b = 5 dan 3a + b = 11. Kurangkan: 2a = 6, jadi a = 3.', 'b = 5 − 3 = 2, sehingga f(x) = 3x + 2.', 'f(10) = 3(10) + 2 = 32.'], j: 'f(x) = 3x + 2 dan f(10) = 32' },
    { tag: 'Banyak fungsi dan korespondensi', r: 'Banyak fungsi n(B)ⁿ⁽ᴬ⁾, banyak korespondensi n!', q: 'Diketahui A = {a, b} dan B = {1, 2, 3}. (a) Berapa banyak fungsi dari A ke B? (b) Jika A dan B masing-masing 3 anggota, berapa banyak korespondensi satu-satu?', l: ['(a) Setiap anggota A bebas memilih 1 dari 3 anggota B: 3 × 3 = 3² = 9.', '(b) Pilihan anggota pertama 3, kedua 2, ketiga 1.', '3 × 2 × 1 = 3! = 6.'], j: '(a) 9 fungsi, (b) 6 korespondensi satu-satu' }
  ],
  soal: [
    { q: 'Manakah yang merupakan himpunan?', o: ['Kumpulan bunga yang indah', 'Kumpulan bilangan prima kurang dari 10', 'Kumpulan siswa yang pintar', 'Kumpulan makanan yang lezat'], j: 1, p: 'Bilangan prima kurang dari 10 punya batas yang jelas: {2, 3, 5, 7}. Yang lain tergantung penilaian orang.' },
    { q: 'Banyak anggota himpunan P = {x | x faktor dari 12} adalah ...', o: ['4', '5', '6', '12'], j: 2, p: 'Faktor 12: 1, 2, 3, 4, 6, 12. Jadi n(P) = 6.' },
    { q: 'Relasi "kurang dari" dari A = {1, 2, 3} ke B = {2, 3} memiliki pasangan berurutan sebanyak ...', o: ['2', '3', '4', '5'], j: 1, p: 'Pasangannya (1, 2), (1, 3), dan (2, 3). 3 tidak kurang dari 2 maupun 3. Jadi ada 3 pasangan.' },
    { q: 'Relasi "setengah dari" dari A = {1, 2, 3} ke B = {2, 4, 6, 8} dinyatakan dengan ...', o: ['{(1, 2), (2, 4), (3, 6)}', '{(1, 2), (2, 3), (3, 4)}', '{(2, 1), (4, 2), (6, 3)}', '{(1, 1), (2, 2), (3, 3)}'], j: 0, p: '1 adalah setengah dari 2, 2 setengah dari 4, dan 3 setengah dari 6. Anggota A ditulis lebih dulu.' },
    { q: 'Dari A = {1, 2, 3} ke B = {a, b, c}, manakah yang BUKAN fungsi?', o: ['{(1, a), (2, a), (3, b)}', '{(1, a), (2, b), (3, c)}', '{(1, a), (1, b), (2, c), (3, c)}', '{(1, c), (2, b), (3, a)}'], j: 2, p: 'Pada pilihan ketiga, anggota 1 punya dua pasangan (a dan b), sehingga bukan fungsi.' },
    { q: 'Fungsi f: A → B dengan f(x) = 2x − 1, A = {1, 2, 3}, dan B = {0, 1, 2, 3, 4, 5, 6}. Range fungsi tersebut adalah ...', o: ['{1, 2, 3}', '{1, 3, 5}', '{0, 1, 2, 3, 4, 5, 6}', '{2, 4, 6}'], j: 1, p: 'f(1) = 1, f(2) = 3, f(3) = 5. Range adalah hasil yang terpakai, yaitu {1, 3, 5}.' },
    { q: 'Jika f(x) = 3x − 2, nilai f(4) adalah ...', o: ['10', '12', '14', '6'], j: 0, p: 'f(4) = 3(4) − 2 = 12 − 2 = 10.' },
    { q: 'Jika f(x) = 2x + 5 dan f(a) = −1, nilai a adalah ...', o: ['−3', '−2', '2', '3'], j: 0, p: '2a + 5 = −1, jadi 2a = −6 dan a = −3.' },
    { q: 'Titik yang terletak pada grafik f(x) = x − 1 adalah ...', o: ['(2, 0)', '(3, 2)', '(0, 1)', '(1, 1)'], j: 1, p: 'f(3) = 3 − 1 = 2, jadi titik (3, 2) terletak pada grafik. Titik lain tidak memenuhi.' },
    { q: 'Banyak fungsi dari himpunan A dengan 2 anggota ke himpunan B dengan 3 anggota adalah ...', o: ['5', '6', '8', '9'], j: 3, p: 'Banyak fungsi = n(B) pangkat n(A) = 3² = 9.' },
    { q: 'Jika A dan B masing-masing memiliki 4 anggota, banyak korespondensi satu-satu dari A ke B adalah ...', o: ['4', '12', '16', '24'], j: 3, p: '4! = 4 × 3 × 2 × 1 = 24.' }
  ]
}

const LANGKAH4 = [
  { k: 'belajar', ik: '📖', t: 'Perpustakaan Relasi', n: 'Penjelasan & Ringkasan', d: 'Pahami himpunan, relasi, fungsi, dan korespondensi', c1: '#ff7a59', c2: '#ffb347' },
  { k: 'visual', ik: '🔗', t: 'Laboratorium Pasangan', n: 'Visual Interaktif', d: 'Bangun relasi, jelajahi fungsi, dan hitung korespondensi', c1: '#6c4cf1', c2: '#a78bfa' },
  { k: 'contoh', ik: '🗺️', t: 'Peta Rahasia', n: 'Contoh Soal', d: 'Pembahasan langkah demi langkah', c1: '#16a36a', c2: '#5ed8a2' },
  { k: 'latihan', ik: '⚔️', t: 'Arena Latihan', n: 'Latihan Interaktif', d: 'Tanpa batas waktu, ada feedback', c1: '#0ea5e9', c2: '#6ee7f9' },
  { k: 'game', ik: '🏰', t: 'Istana Harta Karun', n: 'Kuis Edukasi', d: '4 jenis kuis, 5 soal per sesi', c1: '#ec4899', c2: '#f9a8d4' }
]

/* ---------- Visual interaktif: 3 tab ---------- */
function visual4() {
  const TB = [['r', '🔗 Bangun Relasi'], ['f', '📈 Fungsi'], ['k', '🎯 Korespondensi']]
  const A = ['1', '2', '3'], B = ['a', 'b', 'c']
  const S = { r: { P: [[0, 0], [1, 1], [2, 1]] }, f: { a: 2, b: -1, dom: 'dis', t: 3 }, k: { n: 3 } }
  const PS = { fungsi: [[0, 0], [1, 1], [2, 1]], kor: [[0, 1], [1, 2], [2, 0]], cabang: [[0, 0], [0, 1], [1, 2], [2, 2]], kosong: [] }
  const pil = (arr, sel, f) => arr.map(x => `<option value="${x}"${x === sel ? ' selected' : ''}>${f ? f(x) : ang4(x)}</option>`).join('')
  let tab = 'r'
  const gambar = () => {
    const v = S[tab]; let isi, eq, tip, ctl = [], pre = ''
    if (tab === 'r') {
      const P = v.P, ada = (i, j) => P.some(p => p[0] === i && p[1] === j)
      const cnt = A.map((_, i) => P.filter(p => p[0] === i).length), pakai = B.map((_, j) => P.filter(p => p[1] === j).length)
      const kosong = A.filter((_, i) => cnt[i] === 0), cabang = A.filter((_, i) => cnt[i] > 1)
      const fungsi = P.length > 0 && !kosong.length && !cabang.length, kor = fungsi && pakai.every(c => c === 1)
      pre = `<div class="pilih">${[['fungsi', 'Contoh fungsi'], ['kor', 'Korespondensi 1-1'], ['cabang', 'Bukan fungsi'], ['kosong', 'Hapus semua'], ['acak', '🎲 Acak']].map(([k, t]) => `<button class="btn alt" data-n="${k}">${t}</button>`).join('')}</div>`
      eq = `<div class="besar">${psg4(A, B, P)}</div><div class="kecil">Pasangan berurutan dari A = ${him4(A)} ke B = ${him4(B)}</div>`
      const msg = !P.length ? '<p class="kecil">Belum ada pasangan. Klik kotak pada tabel untuk membuatnya.</p>'
        : fungsi ? `<div class="msg ok">✅ Ini <b>fungsi</b>: setiap anggota A punya tepat satu pasangan. ${kor ? 'Bahkan ini <b>korespondensi satu-satu</b>, karena setiap anggota B juga punya tepat satu pasangan.' : 'Tetapi bukan korespondensi satu-satu, karena ada anggota B yang menganggur atau punya lebih dari satu pasangan.'}</div><p>Domain = ${him4(A)}, kodomain = ${him4(B)}, range = ${him4(B.filter((_, j) => pakai[j] > 0))}.</p>`
          : `<div class="msg err">❌ Bukan fungsi. ${kosong.length ? `Anggota ${kosong.join(', ')} belum punya pasangan. ` : ''}${cabang.length ? `Anggota ${cabang.join(', ')} punya lebih dari satu pasangan.` : ''}</div>`
      const grid = `<div class="gr4" style="grid-template-columns:34px repeat(3,1fr)"><span></span>${B.map(t => `<span>${t}</span>`).join('')}${A.map((t, i) => `<span>${t}</span>` + B.map((_, j) => `<button class="${ada(i, j) ? 'on' : ''}" data-c="${i},${j}" aria-label="pasangan ${t} dan ${B[j]}">${ada(i, j) ? '✓' : ''}</button>`).join('')).join('')}</div>`
      isi = `<p class="kecil">Klik kotak untuk menambah atau menghapus pasangan (baris = anggota A, kolom = anggota B).</p>${grid}${panah4(A, B, P, { cap: ['A', 'B'] })}${msg}`
      tip = 'Coba ubah relasinya sampai menjadi fungsi, lalu ubah lagi sampai menjadi korespondensi satu-satu.'
    } else if (tab === 'f') {
      const { a, b, dom, t } = v, F = x => a * x + b, dis = dom === 'dis'
      const X = dis ? [0, 1, 2, 3] : [-2, -1, 0, 1, 2], pts = X.map(x => [x, F(x)])
      const R = [...new Set(pts.map(p => p[1]))].sort((p, q) => p - q)
      ctl = [['a', 'a', pil([-3, -2, -1, 1, 2, 3], a)], ['b', 'b', pil(rg4(-5, 5), b)], ['dom', 'Domain', pil(['dis', 'ril'], dom, k => k === 'dis' ? '{0, 1, 2, 3}' : 'semua bilangan real')], ['t', 'Coba x =', pil(rg4(-3, 5), t)]]
      eq = `<div class="besar">f(x) = ${rum4(a, b)}</div><div class="kecil">${dis ? 'Domain = {0, 1, 2, 3}' : 'Domain = semua bilangan real, grafiknya garis lurus'}</div>`
      const yb = dis ? [Math.min(0, ...pts.map(p => p[1])) - 1, Math.max(0, ...pts.map(p => p[1])) + 1] : (m => [-m, m])(Math.min(10, Math.max(4, Math.abs(F(-4)), Math.abs(F(4)))))
      const gr = kartesius4(pts, { x0: dis ? -1 : -4, x1: dis ? 4 : 4, y0: yb[0], y1: yb[1], s: 24, line: dis ? null : [a, b] })
      isi = `<div class="msg ok">f(${ang4(t)}) = ${ang4(a)} × ${t < 0 ? '(' + ang4(t) + ')' : t} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = <b>${ang4(F(t))}</b></div>
        <table class="tb4"><tr><th>x</th>${X.map(x => `<td>${ang4(x)}</td>`).join('')}</tr><tr><th>f(x)</th>${pts.map(p => `<td>${ang4(p[1])}</td>`).join('')}</tr></table>
        ${dis ? panah4(X.map(ang4), R.map(ang4), X.map((x, i) => [i, R.indexOf(F(x))]), { cap: ['Domain', 'Range'] }) + `<p class="kecil">Range = ${him4(R.map(ang4))}</p>` : '<p class="kecil">Tabel hanya memuat beberapa nilai x. Domain yang sebenarnya mencakup semua bilangan real.</p>'}${gr}`
      tip = dis ? 'Pada domain {0, 1, 2, 3}, grafiknya berupa titik-titik terpisah. Pilih domain "semua bilangan real" untuk melihat garis lurusnya.' : 'Pada domain bilangan real, titik-titik tersambung menjadi garis lurus. Ubah a untuk mengubah kemiringan dan b untuk menggeser garis.'
    } else {
      const n = v.n, AL = ['1', '2', '3', '4'].slice(0, n), BL = ['a', 'b', 'c', 'd'].slice(0, n), kali = AL.map((_, i) => n - i).join(' × ')
      ctl = [['n', 'Banyak anggota A dan B (n)', pil([1, 2, 3, 4], n)]]
      eq = `<div class="besar">${n}! = ${kali} = ${fak4(n)}</div><div class="kecil">Banyak korespondensi satu-satu dari A = ${him4(AL)} ke B = ${him4(BL)}</div>`
      isi = `<p class="kecil">Setiap diagram berikut adalah satu korespondensi satu-satu yang berbeda.</p>${kor4(n)}
        <p>Anggota pertama A punya ${n} pilihan, ${n > 1 ? `anggota kedua punya ${n - 1} pilihan` : 'dan hanya itu'}${n > 2 ? ', dan seterusnya sampai 1 pilihan' : ''}. Jadi banyaknya ${kali} = <b>${fak4(n)}</b>.</p>`
      tip = 'Untuk n = 5 ada 5! = 120 korespondensi satu-satu, terlalu banyak untuk digambar. Rumusnya tetap sama: n × (n − 1) × ... × 1.'
    }
    $('vis').innerHTML = `<div class="tabsv">${TB.map(([k, nm]) => `<button data-t="${k}" class="${k === tab ? 'on' : ''}">${nm}</button>`).join('')}</div>
      <div class="pilih">${ctl.map(([k, l, o]) => `<label>${l} <select data-k="${k}">${o}</select></label>`).join('')}</div>
      ${pre}<div class="hasil">${eq}</div><div style="margin:10px 0">${isi}</div><div class="tip">💡 ${tip}</div>`
    $('vis').querySelectorAll('[data-t]').forEach(x => x.onclick = () => { tab = x.dataset.t; gambar() })
    $('vis').querySelectorAll('select').forEach(s => s.onchange = () => { v[s.dataset.k] = isNaN(+s.value) ? s.value : +s.value; gambar() })
    $('vis').querySelectorAll('[data-c]').forEach(b => b.onclick = () => {
      const [i, j] = b.dataset.c.split(',').map(Number), k = v.P.findIndex(p => p[0] === i && p[1] === j)
      k < 0 ? v.P.push([i, j]) : v.P.splice(k, 1); gambar()
    })
    $('vis').querySelectorAll('[data-n]').forEach(b => b.onclick = () => {
      v.P = b.dataset.n === 'acak' ? A.flatMap((_, i) => B.map((_, j) => [i, j])).filter(() => Math.random() < .4) : PS[b.dataset.n].map(p => p.slice()); gambar()
    })
  }
  gambar()
}

/* ---------- Bank soal kuis (dibangkitkan dari rumus) ---------- */
const bnz4 = y => y < 4 ? y - 4 : y - 3
const tb4 = b => b < 0 ? '−' : '+'
const JENIS4 = ['korespondensi satu-satu', 'fungsi, tetapi bukan korespondensi satu-satu', 'bukan fungsi karena ada anggota A yang tidak punya pasangan', 'bukan fungsi karena ada anggota A yang punya dua pasangan']
const B4 = ['a', 'b', 'c']
const PERM4 = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]
const FAM4 = [
  { id: 'pasangan', n: 36, lv: 1, int: 1, pair: 1, mk: i => { const [x, y] = D(i, 6, 6), m = 2 + x, k = 2 + y
    return { e: `n(A) = ${m}, n(B) = ${k}`, q: `Himpunan A memiliki ${m} anggota dan himpunan B memiliki ${k} anggota. Banyak pasangan berurutan pada A × B adalah ...`, a: m * k, w: [m + k, m * k + m, m * k - k], tip: 'Setiap anggota A dipasangkan dengan setiap anggota B.', s: ['n(A × B) = n(A) × n(B)', `= ${m} × ${k}`, `= ${m * k}`] } } },
  { id: 'sumbuY', n: 45, lv: 1, int: 1, pair: 1, mk: i => { const [x, y] = D(i, 5, 9), a = 1 + x, b = bnz4(y)
    return { e: `f(x) = ${rum4(a, b)}, titik potong sumbu-Y`, q: `Grafik fungsi f(x) = ${rum4(a, b)} memotong sumbu-Y di titik (0, ...)`, a: b, w: [a, -b, a + b], tip: 'Pada sumbu-Y nilai x adalah 0.', s: ['Pada sumbu-Y, x = 0', `f(0) = ${a}(0) ${tb4(b)} ${Math.abs(b)}`, `f(0) = ${ang4(b)}`] } } },
  { id: 'nilai', n: 216, lv: 1, int: 1, pair: 1, mk: i => { const [x, y, z] = D(i, 4, 9, 6), a = 2 + x, b = bnz4(y), k = z - 2, r = a * k + b
    return { e: `f(${ang4(k)}) jika f(x) = ${rum4(a, b)}`, q: `Diketahui f(x) = ${rum4(a, b)}. Nilai f(${ang4(k)}) adalah ...`, a: r, w: [a * k - b, a + k + b, r + a], tip: 'Ganti x dengan bilangan yang diminta.', s: [`f(${ang4(k)}) = ${a}(${ang4(k)}) ${tb4(b)} ${Math.abs(b)}`, `= ${ang4(a * k)} ${tb4(b)} ${Math.abs(b)}`, `= ${ang4(r)}`] } } },
  { id: 'cariX', n: 288, lv: 2, int: 1, pair: 1, mk: i => { const [x, y, z] = D(i, 4, 9, 8), a = 2 + x, b = bnz4(y), p = z - 3, r = a * p + b
    return { e: `f(m) = ${ang4(r)} jika f(x) = ${rum4(a, b)}`, q: `Diketahui f(x) = ${rum4(a, b)}. Jika f(m) = ${ang4(r)}, nilai m adalah ...`, a: p, w: [p + 1, p - 1, r - a], tip: 'Samakan rumus fungsi dengan nilainya, lalu selesaikan seperti persamaan.', s: [`${a}m ${tb4(b)} ${Math.abs(b)} = ${ang4(r)}`, `${a}m = ${ang4(r)} ${b < 0 ? '+' : '−'} ${Math.abs(b)} = ${ang4(a * p)}`, `m = ${ang4(a * p)} ÷ ${a} = ${ang4(p)}`] } } },
  { id: 'rangeMaks', n: 144, lv: 2, int: 1, pair: 1, mk: i => { const [x, y, z] = D(i, 4, 9, 4), a = 2 + x, b = bnz4(y), k = z - 1, r = a * (k + 2) + b
    return { e: `nilai terbesar range, f(x) = ${rum4(a, b)}, A = {${ang4(k)}, ${ang4(k + 1)}, ${ang4(k + 2)}}`, q: `Fungsi f: A → B ditentukan oleh f(x) = ${rum4(a, b)} dengan A = {${ang4(k)}, ${ang4(k + 1)}, ${ang4(k + 2)}}. Nilai terbesar pada range f adalah ...`, a: r, w: [a * k + b, a * (k + 1) + b, r + a], tip: 'Karena a positif, hasil terbesar muncul pada x terbesar.', s: [`Nilai f terbesar dicapai pada x terbesar, yaitu x = ${ang4(k + 2)}`, `f(${ang4(k + 2)}) = ${a}(${ang4(k + 2)}) ${tb4(b)} ${Math.abs(b)}`, `= ${ang4(r)}`] } } },
  { id: 'banyakFungsi', n: 12, lv: 2, int: 1, pair: 1, mk: i => { const [x, y] = D(i, 4, 3), m = 2 + x, k = 2 + y, r = k ** m
    return { e: `n(A) = ${m}, n(B) = ${k}`, q: `Banyak fungsi yang mungkin dari himpunan A ke himpunan B jika n(A) = ${m} dan n(B) = ${k} adalah ...`, a: r, w: [m ** k, m * k, m + k], tip: 'Setiap anggota A bebas memilih salah satu anggota B.', s: [`Setiap anggota A punya ${k} pilihan pasangan`, `Banyak fungsi = n(B)<sup>n(A)</sup> = ${k}<sup>${m}</sup>`, `= ${r}`] } } },
  { id: 'jenis', n: 24, lv: 2, mk: i => { const [p, u] = D(i, 4, 6), A3 = ['1', '2', '3']
    const P = [[[0, 0], [1, 1], [2, 2]], [[0, 0], [1, 0], [2, 1]], [[0, 0], [1, 1]], [[0, 0], [0, 1], [1, 2], [2, 2]]][p].map(([s, t]) => [s, PERM4[u][t]])
    return { q: `Diketahui A = {1, 2, 3} dan B = {a, b, c}. Relasi dari A ke B dinyatakan dengan ${psg4(A3, B4, P)}. Relasi tersebut adalah ...`, a: JENIS4[p], w: JENIS4.filter((_, k) => k !== p), tip: 'Periksa satu per satu anggota A, lalu periksa anggota B.', s: [`Pasangan: ${psg4(A3, B4, P)}`, [`Tiap anggota A punya satu pasangan dan tiap anggota B terpakai satu kali`, `Tiap anggota A punya satu pasangan, tetapi ada anggota B yang menganggur atau dipasangi dua kali`, `Anggota 3 tidak punya pasangan`, `Anggota 1 punya dua pasangan`][p], `Jadi relasi tersebut ${JENIS4[p]}`] } } },
  { id: 'rumusDua', n: 36, lv: 3, int: 1, pair: 1, mk: i => { const [x, y] = D(i, 4, 9), a = 2 + x, b = bnz4(y), u = a + b, v = 3 * a + b, r = 5 * a + b
    return { e: `f(1) = ${ang4(u)}, f(3) = ${ang4(v)}, cari f(5)`, q: `Fungsi f dirumuskan f(x) = ax + b. Jika f(1) = ${ang4(u)} dan f(3) = ${ang4(v)}, nilai f(5) adalah ...`, a: r, w: [v + (v - u), 5 * a, u + v], tip: 'Buat dua persamaan dari dua nilai fungsi, lalu cari a dan b.', s: [`a + b = ${ang4(u)} dan 3a + b = ${ang4(v)}`, `Dikurangkan: 2a = ${v - u}, sehingga a = ${a} dan b = ${ang4(b)}`, `f(5) = ${a}(5) ${tb4(b)} ${Math.abs(b)} = ${ang4(r)}`] } } },
  { id: 'korespon', n: 5, lv: 3, int: 1, pair: 1, mk: i => { const [x] = D(i, 5), m = 2 + x, r = fak4(m), kali = Array.from({ length: m }, (_, k) => m - k).join(' × ')
    return { e: `n(A) = n(B) = ${m}`, q: `Himpunan A dan B masing-masing memiliki ${m} anggota. Banyak korespondensi satu-satu yang dapat dibuat dari A ke B adalah ...`, a: r, w: [m ** m, 2 * m, r + m], tip: 'Anggota pertama punya m pilihan, berikutnya satu pilihan lebih sedikit.', s: [`Anggota pertama A punya ${m} pilihan pasangan`, `Anggota berikutnya punya satu pilihan lebih sedikit, sampai tinggal 1 pilihan`, `${m}! = ${kali} = ${r}`] } } }
]
const TOTAL4 = FAM4.reduce((t, f) => t + f.n, 0)


const sudah4 = new Set()
const bangun4 = (f, i) => { const x = f.mk(i); x.q = x.q || `${x.e} = ?`; x.fam = f.id; x.int = !!f.int; return x }
const tarik4 = (lv, fl) => {
  const c = FAM4.filter(f => f.lv === lv && fl(f)), pool = c.length ? c : FAM4.filter(fl)
  for (let t = 0; t < 40; t++) { const f = pool[Math.floor(Math.random() * pool.length)], i = Math.floor(Math.random() * f.n); if (!sudah4.has(f.id + ':' + i)) { sudah4.add(f.id + ':' + i); return bangun4(f, i) } }
  const f = pool[0]; return bangun4(f, Math.floor(Math.random() * f.n))
}
const pilihan4 = x => {
  const set = new Set([T4(x.a)]); x.w.forEach(v => set.add(T4(v)))
  let j = 1; while (set.size < 4) set.add(T4(x.a + 2 * j++))
  const o = acak(set); return { o, ok: o.indexOf(T4(x.a)) }
}

/* ---------- Halaman materi (peta petualangan + 5 langkah) ---------- */
function bukaMateri4(m, aktif) {
  window.scrollTo(0, 0); clearInterval(window._kuisTimer)
  if (window.ingatPosisi) ingatPosisi({ tab: 'beranda', materi: 4, langkah: aktif || null })
  const k = LANGKAH4.findIndex(x => x.k === aktif), judul = `<h2>${aman(m.ikon)} ${aman(m.judul)}</h2>`
  if (k < 0) {
    const X = [30, 70, 30, 70, 30], Y = LANGKAH4.map((_, i) => 10 + i * 20)
    let d = `M${X[0]} ${Y[0]}`
    for (let i = 1; i < X.length; i++) { const ym = (Y[i - 1] + Y[i]) / 2; d += ` C${X[i - 1]} ${ym} ${X[i]} ${ym} ${X[i]} ${Y[i]}` }
    $('isi').innerHTML = `<p><button class="btn alt" id="kembali">← Kembali</button></p>${judul}
      <p class="kecil">🧭 Petualangan di Negeri Pasangan. Pilih tempat yang ingin kamu kunjungi dulu, lalu ikuti jalurnya.</p>
      <div class="peta"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" class="jalur"/></svg>
        <span class="dek" style="left:3%;top:3%">☁️</span><span class="dek" style="right:4%;top:20%">⛰️</span><span class="dek" style="left:3%;top:40%">🌴</span>
        <span class="dek" style="right:3%;top:58%">☁️</span><span class="dek" style="left:4%;top:78%">⛰️</span><span class="dek" style="right:4%;top:93%">🌴</span>
        <span class="mulai">🏁 Mulai petualangan</span>
        ${LANGKAH4.map((x, i) => `<button class="nd" style="left:${X[i]}%;top:${Y[i]}%;--c1:${x.c1};--c2:${x.c2};--w:${i * .4}s" data-k="${x.k}" aria-label="${x.t}: ${x.n}">
          <span class="bola">${x.ik}<i class="no">${i + 1}</i></span><span class="lb"><b>${x.t}</b><small>${x.n}</small></span></button>`).join('')}</div>`
    $('kembali').onclick = () => tampilUtama(kelasNama)
    return $('isi').querySelectorAll('[data-k]').forEach(b => b.onclick = () => bukaMateri4(m, b.dataset.k))
  }
  const L = LANGKAH4[k], akhir = k === LANGKAH4.length - 1
  const konten = {
    belajar: `<div class="card"><h3>📖 Perpustakaan Relasi</h3><p class="kecil">Buka bagian satu per satu.</p>${[['A. Memahami Relasi', 'bagian'], ['B. Fungsi', 'bagianB'], ['C. Korespondensi Satu-Satu (Pengayaan)', 'bagianC']].map(([g, k]) => `<h4 class="grp">${g}</h4>${det(M4[k])}`).join('')}</div>
      <div class="card box"><h3>🏆 Ringkasan Inti</h3><ul>${M4.ringkasan.map(r => `<li>${r}</li>`).join('')}</ul>
        <h4 class="sub">Cara mudah mengingat</h4>${M4.tips.map(t => `<div class="tip">💡 ${t}</div>`).join('')}</div>`,
    visual: `<div class="card vis"><h3>⚖️ Laboratorium Pasangan</h3><p class="kecil">Pilih tab, lalu klik dan ubah pilihannya untuk melihat bagaimana relasi, fungsi, dan korespondensi bekerja.</p><div id="vis"></div></div>`,
    contoh: `<div class="card"><h3>🗺️ Peta Rahasia</h3><p class="kecil">Setiap contoh punya 3 bagian: konsep yang dipakai, langkah penyelesaian, dan jawaban akhir.</p></div>
      ${M4.contoh.map((c, i) => `<div class="card box"><div class="cx-head"><span class="cx-no">Contoh ${i + 1}</span><span class="cx-tag">${c.tag}</span></div>
        <div class="cx-soal">${c.q}</div><div class="cx-r">📌 <b>Konsep:</b> ${c.r}</div>
        ${c.l.map((x, n) => `<div class="lg"><span class="no">${n + 1}</span><div>${x}</div></div>`).join('')}
        <div class="cx-j">✅ <b>Jawaban:</b> ${c.j}</div></div>`).join('')}`,
    latihan: `<div class="card"><h3>⚔️ Arena Latihan</h3><p class="kecil">Tanpa batas waktu. Kalau salah, kamu boleh coba lagi atau langsung lihat pembahasan.</p><div id="latihan"></div></div>`,
    game: `<div class="card"><h3>🏰 Kuis Edukasi</h3><p class="kecil">Pilih jenis kuis. Tiap sesi 5 soal dengan batas waktu.</p><div id="game"></div></div>`
  }[L.k]
  $('isi').innerHTML = `<p><button class="btn alt" id="menu">☰ Peta petualangan</button></p>${judul}
    <p class="kecil" style="margin:2px 0 6px">Langkah ${k + 1} dari ${LANGKAH4.length}: <b>${L.t}</b> (${L.n})</p>
    <div class="prog"><span style="width:${(k + 1) * 100 / LANGKAH4.length}%"></span></div>
    <div style="margin-top:14px">${konten}</div>
    <div class="navlang">${k > 0 ? '<button class="btn alt" id="sblm">← Sebelumnya</button>' : '<span></span>'}<button class="btn" id="lanjut1">${akhir ? 'Selesai ✔' : 'Berikutnya →'}</button></div>`
  $('menu').onclick = () => bukaMateri4(m)
  if (k > 0) $('sblm').onclick = () => bukaMateri4(m, LANGKAH4[k - 1].k)
  $('lanjut1').onclick = () => akhir ? bukaMateri4(m) : bukaMateri4(m, LANGKAH4[k + 1].k)
  if (L.k === 'visual') visual4()
  if (L.k === 'latihan') latihan4()
  if (L.k === 'game') kuis4()
}

/* ---------- Latihan ---------- */
function latihan4() {
  const el = $('latihan'), Q = M4.soal; let i = 0, benar = 0, pertama = true
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
    const { data, error } = await db.rpc('simpan_latihan', { m: 4, s: benar, t: Q.length })
    $('xp').textContent = error ? 'Progres belum tersimpan.' : `Progres tersimpan. Total XP kamu: ${data}.`
  }
  tampil()
}

/* ---------- Kuis edukasi: 4 jenis, 5 soal per sesi ---------- */
function kuis4() {
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
    el.innerHTML = `<p class="kecil">Bank soal: <b>${fmt(TOTAL4)}</b> soal berbeda, dibuat dari angka-angka yang berganti. Tiap sesi berisi 5 soal dengan batas waktu. Di akhir kamu bisa melihat benar-salahnya beserta pembahasan, lalu main lagi dengan soal yang berbeda.</p>
      <div class="grid">${Object.entries(MODE).map(([k, m]) => `<div class="card materi"><div class="ikon">${m.ik}</div><h3>${m.n}</h3><p>${m.d}</p><p class="kecil">Waktu: ${wkt(m.w)}</p><button class="btn" data-m="${k}">Mulai</button></div>`).join('')}</div>`
    el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => mulai(b.dataset.m))
  }

  const mulai = mode => {
    const M = MODE[mode], lv = mode === 'cepat' || mode === 'cocok' ? [1, 1, 2, 2, 2] : [1, 1, 2, 2, 3]
    const fl = mode === 'cepat' ? f => f.int : mode === 'cocok' ? f => f.pair : () => true, soal = []
    lv.forEach(l => { for (let t = 0; t < 25; t++) { const x = tarik4(l, fl); if (mode !== 'cocok' || t === 24 || !soal.some(o => T4(o.a) === T4(x.a))) { soal.push(x); break } } })
    soal.forEach(x => {
      if (mode === 'biasa') x.p = pilihan4(x)
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
      <div>${S.R.map((id, j) => `<button class="opsi ${P.includes(id) ? 'terpakai' : ''}" data-r="${id}"><b>${L[j]}.</b> ${T4(S.soal[id].a)}</button>`).join('')}</div></div>
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
      else if (S.mode === 'cepat') { ok = j != null && num(j) === x.a; jw = j; bn = T4(x.a) }
      else if (S.mode === 'puzzle') { ok = !!j && j.length === x.s.length && j.every((v, k) => v === k); jw = j && j.length ? j.map(v => x.s[v]).join(' → ') : null; bn = x.s.join(' → ') }
      else { const p = S.pasang[i]; ok = p === i; jw = p == null ? null : T4(S.soal[p].a); bn = T4(x.a); q = x.e }
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

const _bukaSebelum4 = window.bukaMateri
window.bukaMateri = m => m.urutan === 4 ? bukaMateri4(m) : _bukaSebelum4(m)

/* Konten materi. Materi lain mengikuti pola yang sama. */
const KONTEN = {
  2: {
    penjelasan: `<p>Pada segitiga siku-siku, sisi terpanjang (sisi miring, <b>c</b>) selalu berada di depan sudut siku-siku. Dua sisi lainnya disebut sisi tegak <b>a</b> dan <b>b</b>.</p>
      <p>Pythagoras menemukan bahwa luas persegi pada sisi miring sama dengan jumlah luas persegi pada kedua sisi tegak. Jadi kalau dua sisi diketahui, sisi ketiga bisa dihitung.</p>`,
    ringkasan: ['Rumus: a² + b² = c², dengan c sisi miring.', 'Sisi miring: c = √(a² + b²).', 'Sisi tegak: a = √(c² − b²).', 'Tripel Pythagoras yang sering muncul: 3-4-5, 5-12-13, 8-15-17, 7-24-25.', 'Sisi miring selalu sisi terpanjang.'],
    contoh: [
      ['Segitiga siku-siku punya sisi tegak 6 cm dan 8 cm. Berapa sisi miringnya?', 'c² = 6² + 8² = 36 + 64 = 100, sehingga c = √100 = 10 cm.'],
      ['Sisi miring 13 cm dan satu sisi tegak 5 cm. Berapa sisi tegak lainnya?', 'b² = 13² − 5² = 169 − 25 = 144, sehingga b = √144 = 12 cm.']
    ],
    soal: [
      { q: 'Sisi tegak sebuah segitiga siku-siku 6 cm dan 8 cm. Berapa panjang sisi miringnya?', o: ['14 cm', '10 cm', '12 cm', '100 cm'], j: 1, p: '6² + 8² = 36 + 64 = 100, jadi c = √100 = 10 cm.' },
      { q: 'Sisi miring 13 cm, satu sisi tegak 5 cm. Berapa sisi tegak yang lain?', o: ['8 cm', '12 cm', '18 cm', '144 cm'], j: 1, p: '13² − 5² = 169 − 25 = 144, jadi sisinya √144 = 12 cm.' },
      { q: 'Manakah yang merupakan tripel Pythagoras?', o: ['4, 5, 6', '5, 12, 13', '6, 7, 8', '7, 8, 9'], j: 1, p: '5² + 12² = 25 + 144 = 169 = 13². Pasangan lain tidak memenuhi a² + b² = c².' },
      { q: 'Tangga 10 m disandarkan ke dinding. Kaki tangga 6 m dari dinding. Setinggi apa ujung tangga di dinding?', o: ['4 m', '7 m', '8 m', '16 m'], j: 2, p: 'Tangga adalah sisi miring: 10² − 6² = 100 − 36 = 64, jadi tingginya 8 m.' },
      { q: 'Persegi panjang berukuran 12 cm × 16 cm. Berapa panjang diagonalnya?', o: ['20 cm', '28 cm', '14 cm', '4 cm'], j: 0, p: 'Diagonal adalah sisi miring: 12² + 16² = 144 + 256 = 400, jadi 20 cm.' }
    ],
    visual: true
  }
}

function bukaMateri(m) {
  const k = KONTEN[m.urutan]
  const atas = `<p><button class="btn alt" id="kembali">← Kembali</button></p><h2>${aman(m.ikon)} ${aman(m.judul)}</h2>`
  if (!k) {
    $('isi').innerHTML = atas + `<div class="card"><p>Materi ini sedang disiapkan. Coba materi Teorema Pythagoras dulu.</p></div>`
    return $('kembali').onclick = () => tampilUtama(kelasNama)
  }
  $('isi').innerHTML = atas + `
    <div class="card"><h3>Penjelasan</h3>${k.penjelasan}</div>
    ${k.visual ? `<div class="card box"><h3>Visual interaktif</h3><p class="kecil">Geser a dan b, lihat sisi miring c berubah.</p>
      <svg id="svg" viewBox="0 0 260 230" width="100%" style="max-width:360px" role="img" aria-label="Segitiga siku-siku"></svg>
      <label for="ra">a = <span id="va">3</span></label><input id="ra" type="range" min="1" max="12" value="3">
      <label for="rb">b = <span id="vb">4</span></label><input id="rb" type="range" min="1" max="12" value="4">
      <p id="hasil" style="font-weight:800"></p></div>` : ''}
    <div class="card box"><h3>Ringkasan inti</h3><ul>${k.ringkasan.map(r => `<li>${r}</li>`).join('')}</ul></div>
    <div class="card box"><h3>Contoh soal</h3>${k.contoh.map(([s, p], i) => `<p><b>${i + 1}. ${s}</b><br><span class="kecil">${p}</span></p>`).join('')}</div>
    <div class="card box"><h3>Latihan interaktif</h3><p class="kecil">Tanpa batas waktu. Santai saja.</p><div id="latihan"></div></div>
    <div class="card box"><h3>Game</h3><p class="kecil">Game untuk materi ini hadir di tahap berikutnya.</p></div>`
  $('kembali').onclick = () => tampilUtama(kelasNama)
  if (k.visual) visualPythagoras()
  latihan(m.urutan, k.soal)
}

function visualPythagoras() {
  const gambar = () => {
    const a = +$('ra').value, b = +$('rb').value, c = Math.sqrt(a * a + b * b), s = 16, x0 = 30, y0 = 205
    $('va').textContent = a; $('vb').textContent = b
    $('svg').innerHTML = `<polygon points="${x0},${y0} ${x0 + b * s},${y0} ${x0},${y0 - a * s}" fill="var(--p)" fill-opacity=".2" stroke="var(--p)" stroke-width="3"/>
      <rect x="${x0}" y="${y0 - 12}" width="12" height="12" fill="none" stroke="var(--ink)"/>
      <text x="${x0 - 22}" y="${y0 - a * s / 2}" fill="var(--ink)">a</text>
      <text x="${x0 + b * s / 2}" y="${y0 + 18}" fill="var(--ink)">b</text>
      <text x="${x0 + b * s / 2 + 6}" y="${y0 - a * s / 2 - 6}" fill="var(--p2)" font-weight="800">c</text>`
    $('hasil').textContent = `${a}² + ${b}² = ${a * a + b * b}, jadi c = √${a * a + b * b} ≈ ${c.toFixed(2)}`
  }
  $('ra').oninput = gambar; $('rb').oninput = gambar; gambar()
}

function latihan(urutan, soal) {
  let i = 0, benar = 0
  const el = $('latihan')
  const tampil = () => {
    const s = soal[i]
    el.innerHTML = `<p class="kecil">Soal ${i + 1} dari ${soal.length}</p><p><b>${s.q}</b></p>
      ${s.o.map((t, n) => `<button class="opsi" data-n="${n}">${t}</button>`).join('')}<div id="fb"></div>`
    el.querySelectorAll('.opsi').forEach(b => b.onclick = () => jawab(+b.dataset.n))
  }
  const jawab = n => {
    const s = soal[i], ok = n === s.j
    if (ok) benar++
    el.querySelectorAll('.opsi').forEach((b, x) => { b.disabled = true; if (x === s.j) b.classList.add('benar'); else if (x === n) b.classList.add('salah') })
    $('fb').innerHTML = `<div class="msg ${ok ? 'ok' : 'err'}">${ok ? 'Tepat sekali!' : 'Belum tepat, yuk lihat pembahasannya.'}</div>
      <p>${s.p}</p><button class="btn" id="lanjut">${i + 1 < soal.length ? 'Soal berikutnya' : 'Lihat hasil'}</button>`
    $('lanjut').onclick = () => { i++; i < soal.length ? tampil() : selesai() }
  }
  const selesai = async () => {
    el.innerHTML = `<p><b>Kamu menjawab ${benar} dari ${soal.length} dengan benar.</b></p><div id="xp" class="kecil">Menyimpan progres...</div>
      <button class="btn" id="ulang">Coba lagi</button>`
    $('ulang').onclick = () => { i = 0; benar = 0; tampil() }
    const { data, error } = await db.rpc('simpan_latihan', { m: urutan, s: benar, t: soal.length })
    $('xp').textContent = error ? 'Progres belum tersimpan. Pastikan SQL Fase 2 sudah dijalankan.' : `Progres tersimpan. Total XP kamu: ${data}.`
  }
  tampil()
}

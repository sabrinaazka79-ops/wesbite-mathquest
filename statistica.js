/* STATISTICA: The Data Mystery Adventure - game edukasi Materi 6 (Statistika). 3D cartoon, tanpa aset eksternal.
   Dipanggil dari materi6.js: Statistica.mulai(elemen). Progres tersimpan lewat mathquest-statistica.sql (tanpa SQL: disimpan di perangkat). */
(function () {
  'use strict'
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1))
  const pick = a => a[Math.floor(Math.random() * a.length)]
  const mix = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1])
  const esc = t => { const d = document.createElement('div'); d.textContent = t ?? ''; return d.innerHTML }
  const nf = v => String(Math.round(v * 100) / 100).replace('.', ',')
  const parse = s => { const v = parseFloat(String(s).replace(',', '.')); return isNaN(v) ? NaN : v }

  /* ---------- Statistika (metode kuartil sesuai materi: median tidak ikut kelompok bila data ganjil) ---------- */
  const srt = a => [...a].sort((x, y) => x - y)
  const med = a => { const s = srt(a), n = s.length, h = n >> 1; return n % 2 ? s[h] : (s[h - 1] + s[h]) / 2 }
  const quart = a => { const s = srt(a), n = s.length, h = n >> 1; return { q1: med(s.slice(0, h)), q2: med(s), q3: med(s.slice(n % 2 ? h + 1 : h)) } }
  const mean = a => a.reduce((x, y) => x + y, 0) / a.length
  const modes = a => { const c = {}; a.forEach(v => c[v] = (c[v] || 0) + 1); const mx = Math.max(...Object.values(c)); return Object.keys(c).filter(k => c[k] === mx).map(Number) }
  const stats = a => { const q = quart(a), s = srt(a); return { mean: mean(a), median: q.q2, min: s[0], max: s[s.length - 1], range: s[s.length - 1] - s[0], q1: q.q1, q2: q.q2, q3: q.q3, H: q.q3 - q.q1, Qd: (q.q3 - q.q1) / 2 } }
  const LBL = { mean: 'Rata-rata', median: 'Median', range: 'Jangkauan', q1: 'Q₁', q3: 'Q₃', H: 'H = Q₃ − Q₁', Qd: 'Qd' }
  const gen = (n, lo, hi, o = {}) => { for (;;) { const a = Array.from({ length: n }, () => R(lo, hi))
    if (o.mean) { const r = a.reduce((x, y) => x + y, 0) % n; a[0] -= r; if (a[0] < lo) a[0] += n }
    if (a.some(v => v < lo || v > hi)) continue
    if (o.mode) { const m = modes(a); if (m.length !== 1 || a.filter(v => v === m[0]).length < 2) continue }
    if (o.uniq && new Set(a).size !== n) continue
    return a } }

  /* ---------- Komponen interaktif ---------- */
  const mc = (box, opts, ci) => { let s = -1
    box.innerHTML = `<div class="sa-mc">${opts.map((o, i) => `<button class="sa-o" data-i="${i}">${o}</button>`).join('')}</div>`
    box.querySelectorAll('.sa-o').forEach(b => b.onclick = () => { s = +b.dataset.i; box.querySelectorAll('.sa-o').forEach(x => x.classList.toggle('on', x === b)) })
    return () => s === ci }
  const fields = (fs, id) => `<div class="sa-fs"${id ? ` id="${id}"` : ''}>${fs.map(l => `<label>${l}<input class="sa-i" inputmode="decimal" autocomplete="off"></label>`).join('')}</div>`
  const okFields = (box, vals) => { const ins = [...box.querySelectorAll('.sa-i')]; return vals.every((v, i) => Math.abs(parse(ins[i].value) - v) < 1e-6) }

  function sortPhase(box, data, wrong, done) { let rest = mix(data.map((v, i) => ({ v, i }))), out = []
    const draw = () => { box.innerHTML = `<p class="sa-k">Urutkan dari <b>terkecil</b> ke terbesar: ketuk kartu angka yang paling kecil lebih dulu.</p><div class="sa-cards">${rest.map(c => `<button class="sa-card" data-i="${c.i}">${c.v}</button>`).join('')}</div><div class="sa-line">${out.map(c => `<span class="sa-card s">${c.v}</span>`).join('') || '<i>Barisan terurut masih kosong</i>'}</div>`
      box.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { const c = rest.find(x => x.i == b.dataset.i)
        if (c.v !== Math.min(...rest.map(x => x.v))) { wrong('Itu bukan yang terkecil. Cari angka terkecil yang tersisa.'); return }
        rest = rest.filter(x => x !== c); out.push(c); draw(); if (!rest.length) done() }) }
    draw() }

  function sortThen(box, data, fs, api, extra) { let sorted = false, ph = 0, sus
    box.innerHTML = '<div id="saS"></div><div id="saF"></div>'; const F = box.querySelector('#saF')
    sortPhase(box.querySelector('#saS'), data, api.wrong, () => { sorted = true; F.innerHTML = fields(fs.map(f => f[0])) })
    return () => { if (!sorted) return 'Urutkan dulu semua kartu angka.'
      if (ph === 0) { if (!okFields(F, fs.map(f => f[1]))) return false
        if (!extra) return true
        ph = 1; F.insertAdjacentHTML('beforeend', `<p class="sa-k" style="margin-top:12px">${extra.q}</p><div id="saU"></div>`); sus = mc(F.querySelector('#saU'), extra.opts, extra.ci); return 'Hitunganmu benar! Sekarang pilih tersangka.' }
      return sus() } }

  const bpx = (st, hi) => { const x = v => 10 + v / hi * 280
    return `<svg viewBox="0 0 300 84" class="sa-bp" role="img" aria-label="Diagram kotak garis"><line x1="${x(st.min)}" y1="31" x2="${x(st.max)}" y2="31" stroke="#1f2a5a" stroke-width="3"/><rect x="${x(st.q1)}" y="14" width="${Math.max(2, x(st.q3) - x(st.q1))}" height="34" rx="6" fill="#fbbf24" stroke="#1f2a5a" stroke-width="3"/>
      <line x1="${x(st.q2)}" y1="14" x2="${x(st.q2)}" y2="48" stroke="#1f2a5a" stroke-width="4"/>${[st.min, st.max].map(v => `<line x1="${x(v)}" y1="21" x2="${x(v)}" y2="41" stroke="#1f2a5a" stroke-width="3"/>`).join('')}
      <line x1="10" y1="58" x2="290" y2="58" stroke="#5b5680" stroke-width="1.5"/>${[0, 10, 20, 30].filter(t => t <= hi).map(t => `<line x1="${x(t)}" y1="55" x2="${x(t)}" y2="61" stroke="#5b5680" stroke-width="1.5"/><text x="${x(t)}" y="75" text-anchor="middle" font-size="10" fill="#5b5680">${t}</text>`).join('')}</svg>` }
  const barsUI = (box, a, o) => { const H = 150
    const draw = () => { const st = stats(a)
      box.innerHTML = `<div class="sa-plot" style="height:${H}px">${o.meanLine ? `<i class="sa-ml" style="bottom:${st.mean / o.hi * H}px"><u>x̄ = ${nf(st.mean)}</u></i>` : ''}${a.map(v => `<div class="sa-bar" style="height:${v / o.hi * H}px"><b>${v}</b></div>`).join('')}</div>
        <div class="sa-pms">${a.map((_, i) => `<span><button data-d="${i},-1" aria-label="Kurangi data ${i + 1}">−</button><button data-d="${i},1" aria-label="Tambah data ${i + 1}">+</button></span>`).join('')}</div>
        <div class="sa-st">${o.show.map(k => `<span>${LBL[k]} = <b>${nf(st[k])}</b></span>`).join('')}</div>${o.bp ? bpx(st, o.hi) : ''}`
      box.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { const [i, d] = b.dataset.d.split(',').map(Number); a[i] = Math.max(1, Math.min(o.hi, a[i] + d)); draw() }) }
    draw() }

  function peaks(box, a) { let tool = 'max', val = ''; const mk = { max: -1, min: -1 }
    const draw = () => { box.innerHTML = `<div class="sa-tl"><button class="sa-n${tool === 'max' ? ' on' : ''}" data-t="max">🚩 Tandai tertinggi</button><button class="sa-n${tool === 'min' ? ' on' : ''}" data-t="min">🏁 Tandai terendah</button></div>
        <div class="sa-pks">${a.map((v, i) => `<button class="sa-pk${mk.max === i ? ' mx' : ''}${mk.min === i ? ' mn' : ''}" data-p="${i}" style="height:${40 + v * 1.1}px"><span>${v}</span></button>`).join('')}</div>${fields(['Jangkauan'])}`
      const inp = box.querySelector('.sa-i'); inp.value = val; inp.oninput = () => { val = inp.value }
      box.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { tool = b.dataset.t; draw() })
      box.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { mk[tool] = +b.dataset.p; draw() }) }
    draw(); const s = stats(a)
    return () => { if (mk.max < 0 || mk.min < 0) return 'Tandai puncak tertinggi dan terendah dulu.'; return a[mk.max] === s.max && a[mk.min] === s.min && parse(val) === s.range } }

  function qsel(box, data, api) { const s = srt(data), n = s.length, h = n >> 1, G = [[0, n - 1], [0, h - 1], [n % 2 ? h + 1 : h, n - 1]], NM = ['Q₂ (median seluruh data)', 'Q₁ (median kelompok bawah)', 'Q₃ (median kelompok atas)']
    const mid = ([f, t]) => { const L = t - f + 1, m = f + (L >> 1); return L % 2 ? [m] : [m - 1, m] }
    let st = 0, sel = new Set(), found = []; const q = quart(data)
    const draw = () => { const g = G[Math.min(st, 2)]
      box.innerHTML = `<p class="sa-k">${st < 3 ? `Ketuk kartu nilai tengah untuk <b>${NM[st]}</b>. Jika ada dua kartu tengah, ketuk keduanya.` : 'Semua kuartil ditemukan! Tulis nilainya.'}</p>
        <div class="sa-cards">${s.map((v, i) => `<button class="sa-card${st < 3 && i >= g[0] && i <= g[1] ? '' : ' dim'}${sel.has(i) ? ' on' : ''}${found.includes(i) ? ' fd' : ''}" data-i="${i}">${v}</button>`).join('')}</div>
        ${st < 3 ? '<p style="text-align:center"><button class="sa-b g" id="saQ">Cek pilihan</button></p>' : fields(['Q₁', 'Q₂', 'Q₃'])}`
      box.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { const i = +b.dataset.i; if (st > 2 || i < g[0] || i > g[1]) return; sel.has(i) ? sel.delete(i) : sel.add(i); draw() })
      const c = box.querySelector('#saQ'); if (c) c.onclick = () => { const m = mid(G[st])
        if (sel.size === m.length && m.every(i => sel.has(i))) { found.push(...m); sel = new Set(); st++; draw() } else { api.wrong('Belum tepat. Ingat: median = nilai tengah (atau rata-rata dua nilai tengah).'); sel = new Set(); draw() } } }
    draw(); return () => st < 3 ? 'Selesaikan pemilihan kartu dulu.' : okFields(box, [q.q1, q.q2, q.q3]) }

  /* ---------- Bank misi (data diacak setiap bermain) ---------- */
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
  const jitter = (S, hi) => { for (;;) { const a = S.map(v => clamp(v + pick([-4, -3, -2, 2, 3, 4]), 1, hi)); if (a.some((v, i) => v !== S[i])) return a } }
  const MIS = {
    median: { t: 'Kasus Nilai Tengah', gen: () => { const d = gen(pick([7, 8]), 4, 30), m = med(d)
      return { story: `Tersangka bersembunyi di angka tengah! Urutkan kartu data <b>${d.join(', ')}</b>, lalu temukan <b>mediannya</b>.`, hint: 'Setelah terurut: data ganjil → ambil nilai paling tengah. Data genap → rata-rata dua nilai tengah.',
        exp: `Terurut: ${srt(d).join(', ')}. Median = ${nf(m)}.`, build: (box, api) => sortThen(box, d, [['Median', m]], api) } } },
    rata: { t: 'Laboratorium Penyelidik', gen: () => { const S = gen(5, 4, 20, { mean: true }), M = mean(S), D = med(S), a = jitter(S, 30)
      return { story: `Atur tinggi batang dengan tombol + dan − sampai <b>rata-rata = ${M}</b> dan <b>median = ${D}</b>.`, hint: `Rata-rata = jumlah ÷ 5, jadi jumlah semua batang harus ${M * 5}. Median = batang tengah setelah diurutkan.`,
        exp: `Salah satu jawaban: ${srt(S).join(', ')} (jumlah ${M * 5}, median ${D}).`, build: box => { barsUI(box, a, { hi: 30, show: ['mean', 'median'], meanLine: true }); return () => { const s = stats(a); return s.mean === M && s.median === D } } } } },
    puncak: { t: 'Puncak Tertinggi dan Terendah', gen: () => { const d = gen(6, 20, 95, { uniq: true }), s = stats(d)
      return { story: `Para pendaki mencatat tinggi puncak (dalam meter). Tandai puncak <b>tertinggi</b> dan <b>terendah</b>, lalu hitung <b>jangkauannya</b>.`, hint: 'Jangkauan = data terbesar − data terkecil.', exp: `Terbesar ${s.max}, terkecil ${s.min}. Jangkauan = ${s.max} − ${s.min} = ${s.range}.`, build: box => peaks(box, d) } } },
    atur: { t: 'Atur Pegunungan', gen: () => { const r = R(15, 30), mx = R(r + 2, 40), S = [mx, mx - r, ...Array.from({ length: 3 }, () => R(mx - r, mx))], a = jitter(S, 40)
      return { story: `Ubah tinggi pegunungan sampai <b>data terbesar = ${mx}</b> dan <b>jangkauan = ${r}</b>.`, hint: 'Jangkauan = terbesar − terkecil. Jadi berapa data terkecil yang dibutuhkan?', exp: `Terkecil = ${mx} − ${r} = ${mx - r}. Contoh: ${srt(S).join(', ')}.`,
        build: box => { barsUI(box, a, { hi: 40, show: ['range'] }); return () => { const s = stats(a); return s.max === mx && s.range === r } } } } },
    bagi: { t: 'Taman Empat Bagian', gen: () => { const d = gen(pick([7, 8]), 3, 30)
      return { story: `Bagi data bunga <b>${d.join(', ')}</b> menjadi empat bagian sama banyak. Cari Q₂ dulu, lalu Q₁ dan Q₃.`, hint: 'Q₂ = median seluruh data. Q₁ = median kelompok bawah. Q₃ = median kelompok atas. Jika data ganjil, Q₂ tidak ikut kelompok.',
        exp: `Terurut: ${srt(d).join(', ')}. Q₁ = ${nf(quart(d).q1)}, Q₂ = ${nf(quart(d).q2)}, Q₃ = ${nf(quart(d).q3)}.`, build: (box, api) => qsel(box, d, api) } } },
    brankas: { t: 'Kode Brankas Taman', gen: () => { const d = gen(pick([9, 10, 11]), 3, 40), q = quart(d)
      return { story: `Kode brankas adalah <b>Q₁, Q₂, Q₃</b> dari data <b>${d.join(', ')}</b>. Urutkan dulu, lalu isi kodenya.`, hint: 'Urutkan, cari median (Q₂), lalu median kelompok bawah (Q₁) dan kelompok atas (Q₃).',
        exp: `Terurut: ${srt(d).join(', ')}. Q₁ = ${nf(q.q1)}, Q₂ = ${nf(q.q2)}, Q₃ = ${nf(q.q3)}.`, build: (box, api) => sortThen(box, d, [['Q₁', q.q1], ['Q₂', q.q2], ['Q₃', q.q3]], api) } } },
    kotak: { t: 'Kotak Ajaib Gua', gen: () => { const t = R(4, 12); let S; do { S = gen(7, 3, 28) } while (stats(S).H !== t); const a = jitter(S, 30)
      return { story: `Atur data sampai <b>jangkauan kuartil H = ${t}</b>. Lihat kotak kuning pada diagram kotak garis berubah ukuran!`, hint: 'H = Q₃ − Q₁. Perhatikan lebar kotak kuning: dari Q₁ sampai Q₃.', exp: `Contoh data: ${srt(S).join(', ')} → Q₁ = ${nf(stats(S).q1)}, Q₃ = ${nf(stats(S).q3)}, H = ${t}.`,
        build: box => { barsUI(box, a, { hi: 30, show: ['q1', 'q3', 'H', 'Qd'], bp: true }); return () => stats(a).H === t } } } },
    simpangan: { t: 'Kode Pintu Gua', gen: () => { const d = gen(pick([8, 9, 10]), 3, 40), q = quart(d), H = q.q3 - q.q1
      return { story: `Buka pintu gua dengan <b>Q₁, Q₃, H, dan Qd</b> dari data <b>${d.join(', ')}</b>. Desimal ditulis dengan koma atau titik.`, hint: 'H = Q₃ − Q₁ dan Qd = ½ × H.', exp: `Terurut: ${srt(d).join(', ')}. Q₁ = ${nf(q.q1)}, Q₃ = ${nf(q.q3)}, H = ${nf(H)}, Qd = ½ × ${nf(H)} = ${nf(H / 2)}.`,
        build: (box, api) => sortThen(box, d, [['Q₁', q.q1], ['Q₃', q.q3], ['H', H], ['Qd', H / 2]], api) } } },
    master: { t: 'Siapa Pencuri Nilai?', gen: () => { let d, s, q, A, B, C
      for (;;) { d = gen(pick([9, 11]), 40, 98, { mean: true, mode: true }); q = quart(d); s = srt(d)
        A = s.filter(v => v > q.q2 && v < q.q3); B = s.filter(v => v <= q.q1); C = s.filter(v => v >= q.q3); if (A.length && B.length && C.length) break }
      const st = stats(d), md = modes(d)[0], nm = mix(['Bima', 'Citra', 'Dewi']), val = [pick(A), pick(B), pick(C)], order = mix([0, 1, 2])
      const opts = order.map(k => `🕵️ ${nm[k]} (nilai ${val[k]})`), idx = order.indexOf(0)
      return { story: `Nilai ulangan <b>${d.join(', ')}</b> dicuri! Hitung semua statistik data ini untuk membuka petunjuk terakhir.`, hint: 'Urutkan dulu. Mean = jumlah ÷ banyak data. Modus = angka paling sering. Kuartil: median kelompok bawah/atas. Qd = ½H.',
        exp: `Terurut: ${s.join(', ')}. Mean ${nf(st.mean)}, Median ${nf(st.median)}, Modus ${md}, Jangkauan ${st.range}, Q₁ ${nf(st.q1)}, Q₃ ${nf(st.q3)}, H ${nf(st.H)}, Qd ${nf(st.Qd)}. Pelaku bernilai ${val[0]} (di antara Q₂ dan Q₃).`,
        build: (box, api) => sortThen(box, d, [['Rata-rata', st.mean], ['Median', st.median], ['Modus', md], ['Jangkauan', st.range], ['Q₁', st.q1], ['Q₃', st.q3], ['H', st.H], ['Qd', st.Qd]], api,
          { q: `Petunjuk: nilai pelaku <b>lebih dari Q₂ (median)</b> tetapi <b>kurang dari Q₃</b>. Siapa pelakunya?`, opts, ci: idx }) } } }
  }

  const LOK = [
    { k: 'city', n: 'Central Data City', e: '🏙️', c: '#3b82f6', d: 'Mean, median, dan modus', m: ['median', 'rata'],
      b: `<p><b>Mean (rata-rata)</b> = jumlah seluruh data ÷ banyak data.</p><div class="sa-rm">x̄ = (x₁ + x₂ + … + xₙ) ÷ n</div><p><b>Median</b> = nilai tengah setelah data diurutkan. Data ganjil: satu nilai di tengah. Data genap: rata-rata dua nilai tengah.</p><p><b>Modus</b> = nilai yang paling sering muncul.</p>
        <div class="sa-ex"><b>Contoh:</b> data 6, 8, 7, 8, 9, 8, 10<ol><li>Jumlah = 56, banyak data 7, jadi mean = 56 ÷ 7 = 8.</li><li>Diurutkan: 6, 7, 8, 8, 8, 9, 10. Nilai tengah (ke-4) = 8, jadi median = 8.</li><li>Angka 8 muncul 3 kali, jadi modus = 8.</li></ol></div>` },
    { k: 'mtn', n: 'Range Mountain', e: '⛰️', c: '#10b981', d: 'Jangkauan (range)', m: ['puncak', 'atur'],
      b: `<p><b>Jangkauan</b> menunjukkan seberapa lebar penyebaran data, dihitung dari selisih data terbesar dan terkecil.</p><div class="sa-rm">Jangkauan = data terbesar − data terkecil</div>
        <div class="sa-ex"><b>Contoh:</b> tinggi puncak 12, 15, 9, 18, 13<ol><li>Terbesar = 18, terkecil = 9.</li><li>Jangkauan = 18 − 9 = 9.</li></ol></div><p class="sa-tip">💡 Kekurangannya: jangkauan hanya melihat dua data, yaitu yang terkecil dan terbesar.</p>` },
    { k: 'garden', n: 'Quartile Garden', e: '🌷', c: '#ec4899', d: 'Kuartil Q₁, Q₂, Q₃', m: ['bagi', 'brankas'],
      b: `<p><b>Kuartil</b> membagi data terurut menjadi <b>empat bagian sama banyak</b>.</p><ol><li>Urutkan data.</li><li>Q₂ = median seluruh data.</li><li>Pisahkan kelompok bawah dan atas. Jika data ganjil, Q₂ tidak ikut kedua kelompok.</li><li>Q₁ = median kelompok bawah, Q₃ = median kelompok atas.</li></ol>
        <div class="sa-ex"><b>Contoh:</b> 2, 4, 5, 7, 8, 9, 12<ol><li>Q₂ = 7.</li><li>Kelompok bawah: 2, 4, 5 → Q₁ = 4.</li><li>Kelompok atas: 8, 9, 12 → Q₃ = 9.</li></ol></div>` },
    { k: 'cave', n: 'Deviation Cave', e: '🦇', c: '#8b5cf6', d: 'Jangkauan kuartil & simpangan kuartil', m: ['kotak', 'simpangan'],
      b: `<div class="sa-rm">H = Q₃ − Q₁ &nbsp;&nbsp; Qd = ½ × H</div><p><b>H</b> (jangkauan kuartil) adalah lebar kotak pada diagram kotak garis. <b>Qd</b> (simpangan kuartil) adalah setengah dari H.</p>
        <div class="sa-ex"><b>Contoh:</b> Q₁ = 5 dan Q₃ = 11<ol><li>H = 11 − 5 = 6.</li><li>Qd = ½ × 6 = 3.</li></ol></div>` },
    { k: 'master', n: 'Master Detective Challenge', e: '🕵️', c: '#f59e0b', d: 'Tantangan akhir gabungan', m: ['master'],
      b: `<p>Kasus terakhir memakai <b>semua</b> ilmumu. Urutan kerja detektif data:</p><ol><li>Urutkan data.</li><li>Hitung mean, median, modus, dan jangkauan.</li><li>Cari Q₁ dan Q₃, lalu hitung H dan Qd.</li><li>Gunakan petunjuk kuartil untuk menemukan pelaku.</li></ol>` }
  ]

  const mulut = { hi: 'M48 60 Q60 70 72 60', ok: 'M46 58 Q60 76 74 58 Z', sad: 'M50 66 Q60 58 70 66' }
  const guide = (m = 'hi') => `<svg viewBox="0 0 120 150" class="sa-svg" role="img" aria-label="Detektif Dani, maskot siswa SMP"><defs>
    <radialGradient id="saGk" cx=".4" cy=".3"><stop offset="0" stop-color="#ffe3c7"/><stop offset="1" stop-color="#eeb07f"/></radialGradient>
    <linearGradient id="saGc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c58a4a"/><stop offset="1" stop-color="#7c4a1e"/></linearGradient>
    <linearGradient id="saGb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#d6e4ff"/></linearGradient></defs>
    <ellipse cx="60" cy="145" rx="36" ry="5" fill="#0003"/><path d="M26 86 Q60 70 94 86 L100 132 L20 132 Z" fill="#7c4a1e"/>
    <rect x="42" y="118" width="15" height="24" rx="5" fill="#27399e"/><rect x="63" y="118" width="15" height="24" rx="5" fill="#27399e"/>
    <rect x="38" y="138" width="20" height="8" rx="4" fill="#fff" stroke="#c9c9d6"/><rect x="62" y="138" width="20" height="8" rx="4" fill="#fff" stroke="#c9c9d6"/>
    <rect x="35" y="82" width="50" height="40" rx="14" fill="url(#saGb)" stroke="#c3d3f5"/><path d="M54 84 L60 98 L66 84 Z" fill="#ef4444"/>
    <circle cx="30" cy="100" r="8" fill="url(#saGk)"/><circle cx="90" cy="100" r="8" fill="url(#saGk)"/>
    <circle cx="100" cy="108" r="12" fill="#fff" fill-opacity=".35" stroke="#f59e0b" stroke-width="4"/><path d="M92 116 L84 126" stroke="#b45309" stroke-width="5" stroke-linecap="round"/>
    <circle cx="60" cy="50" r="30" fill="url(#saGk)"/><path d="M28 44 Q30 12 60 12 Q90 12 92 44 Q60 30 28 44 Z" fill="url(#saGc)"/><path d="M22 46 Q60 34 98 46 L96 52 Q60 42 24 52 Z" fill="#7c4a1e"/><path d="M52 14 Q60 4 68 14" fill="none" stroke="#7c4a1e" stroke-width="4"/>
    <circle cx="48" cy="56" r="4.5" fill="#2b1b12"/><circle cx="72" cy="56" r="4.5" fill="#2b1b12"/><circle cx="50" cy="54" r="1.6" fill="#fff"/><circle cx="74" cy="54" r="1.6" fill="#fff"/>
    <circle cx="38" cy="66" r="4.5" fill="#ff8fa3" opacity=".55"/><circle cx="82" cy="66" r="4.5" fill="#ff8fa3" opacity=".55"/>
    <path d="${mulut[m]}" transform="translate(0 6)" fill="${m === 'ok' ? '#c2263a' : 'none'}" stroke="#7a2a2a" stroke-width="2.5" stroke-linecap="round"/></svg>`

  const CSS = `
  .sa{font-family:'Nunito',system-ui,sans-serif;color:#1f2a5a}.sa *{box-sizing:border-box}
  .sa-bar2{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;align-items:center}.sa-chip{background:#fff;border:2px solid #fcd34d;border-radius:999px;padding:4px 12px;font-weight:800;box-shadow:0 3px 0 #f59e0b;color:#1f2a5a;font-size:.9rem}
  button.sa-chip{cursor:pointer;font-family:inherit}.sa-xp{height:10px;width:90px;background:#e5e7f5;border-radius:99px;overflow:hidden;display:inline-block;vertical-align:middle;margin-left:6px}.sa-xp i{display:block;height:100%;background:linear-gradient(90deg,#fbbf24,#f97316)}
  .sa-hero,.sa-stage,.sa-world{position:relative;border-radius:24px;border:3px solid #fff;box-shadow:0 8px 0 #4f46e5,0 16px 24px #0003;padding:14px;overflow:hidden}
  .sa-hero{background:linear-gradient(160deg,#312e81,#4f46e5 55%,#f59e0b);color:#fff}.sa-stage{background:linear-gradient(#eef2ff,#e0f2fe 60%,#fef3c7)}
  .sa-logo{text-align:center;margin:4px 0 10px}.sa-logo span{display:block;font:800 clamp(2rem,9vw,3.4rem)/1 'Baloo 2',sans-serif;color:#fde68a;text-shadow:0 2px 0 #f59e0b,0 4px 0 #b45309,0 6px 0 #78350f,0 10px 12px #0006;letter-spacing:2px}.sa-logo small{font-weight:800;letter-spacing:3px;color:#fff;text-transform:uppercase;font-size:.8rem}
  .sa-row{display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap;margin:8px 0}.sa-g{width:104px;flex:none;animation:saB 2.4s ease-in-out infinite}.sa-g.big{width:130px}.sa-svg{width:100%;height:auto;filter:drop-shadow(0 6px 4px #0003)}
  .sa-say{flex:1;min-width:210px;background:#fff;border:3px solid #1f2a5a;border-radius:20px;padding:12px 14px;position:relative;box-shadow:0 5px 0 #0002;font-weight:700;line-height:1.5;color:#1f2a5a}
  .sa-say:before{content:'';position:absolute;left:-14px;bottom:26px;border:9px solid transparent;border-right:14px solid #1f2a5a}.sa-tag{display:inline-block;font-size:.75rem;font-weight:800;color:#fff;background:#4f46e5;border-radius:999px;padding:1px 10px;margin-bottom:4px}
  .sa-in{margin-top:8px;width:100%;font:800 1.1rem 'Nunito',sans-serif;border:3px solid #4f46e5;border-radius:12px;padding:8px 10px;background:#eef2ff;color:#1f2a5a}
  .sa-b,.sa-n,.sa-o,.sa-card{font:800 1.02rem 'Nunito',sans-serif;border:0;border-radius:14px;cursor:pointer}.sa-b{padding:11px 18px;color:#fff;background:#4f46e5;box-shadow:0 5px 0 #3730a3}.sa-b:active{transform:translateY(4px);box-shadow:0 1px 0 #3730a3}
  .sa-b.g{background:#10b981;box-shadow:0 5px 0 #047857}.sa-b.o{background:#f97316;box-shadow:0 5px 0 #c2410c}.sa-b:disabled{opacity:.5}
  .sa-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}.sa-n{padding:9px 14px;background:#e0e7ff;color:#1f2a5a;box-shadow:0 4px 0 #818cf8}.sa-n.on,.sa-o.on{background:#fbbf24;box-shadow:0 4px 0 #d99a00}
  .sa-world{background:linear-gradient(#7dd3fc,#e0f2fe 38%,#bbf7d0 38%,#4ade80);height:720px;padding:0}.sa-world svg{position:absolute;inset:0;width:100%;height:100%}
  .sa-dec{position:absolute;transform:translate(-50%,-50%);pointer-events:none;filter:drop-shadow(0 4px 2px #0003)}
  .sa-nd{position:absolute;transform:translate(-50%,-50%);width:132px;border:0;cursor:pointer;color:#fff;padding:12px 6px 10px;border-radius:26px;background:linear-gradient(160deg,var(--c),#0004 140%),var(--c);font-family:inherit;box-shadow:0 8px 0 #0004,0 16px 16px #0003;animation:saF 3s ease-in-out infinite alternate;text-align:center}
  .sa-nd:disabled{filter:grayscale(.85);opacity:.75;cursor:default;animation:none}.sa-nd .ic{display:block;font-size:2.4rem;filter:drop-shadow(0 3px 2px #0004)}.sa-nd b{display:block;font:800 .95rem 'Baloo 2',sans-serif;line-height:1.1}.sa-nd small{display:block;font-size:.72rem;font-weight:700;margin-top:2px}.sa-nd em{position:absolute;top:-14px;right:-6px;font-style:normal;font-size:1.5rem}
  .sa-box{margin-top:12px;background:#fff;border:3px solid #c7d2fe;border-radius:20px;padding:12px;box-shadow:0 5px 0 #818cf8;color:#1f2a5a}.sa-k{margin:0 0 8px;font-weight:700}
  .sa-cards,.sa-line{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:8px 0}.sa-card{min-width:50px;padding:12px 10px;background:linear-gradient(#fff,#fef3c7);color:#1f2a5a;box-shadow:0 5px 0 #f59e0b,0 8px 8px #0002;font-size:1.15rem}.sa-card.s{background:linear-gradient(#ecfdf5,#a7f3d0);box-shadow:0 5px 0 #10b981;cursor:default}.sa-card.dim{opacity:.4}.sa-card.on{background:#fbbf24}.sa-card.fd{background:linear-gradient(#e0e7ff,#a5b4fc);box-shadow:0 5px 0 #6366f1}
  .sa-line{min-height:52px;padding:8px;border-radius:14px;background:#eef2ff;border:2px dashed #818cf8}.sa-shake{animation:saS .3s}
  .sa-fs{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:10px}.sa-fs label{font-weight:800;display:flex;flex-direction:column;align-items:center;gap:3px}
  .sa-i{width:96px;text-align:center;font:800 1.2rem 'Baloo 2',sans-serif;border:3px solid #4f46e5;border-radius:12px;background:#eef2ff;color:#1f2a5a;padding:4px}
  .sa-plot{position:relative;display:flex;align-items:flex-end;gap:6px;border-bottom:3px solid #1f2a5a;padding:0 4px}.sa-bar{flex:1;min-width:0;border-radius:10px 10px 0 0;background:linear-gradient(90deg,#60a5fa,#3b82f6 60%,#1d4ed8);box-shadow:inset -6px 0 0 #0002,0 -2px 0 #fff4;text-align:center;color:#fff;transition:height .15s}.sa-bar b{font-size:.8rem;display:block;padding-top:3px}
  .sa-ml{position:absolute;left:0;right:0;border-top:3px dashed #ef4444;z-index:2;pointer-events:none}.sa-ml u{position:absolute;right:0;top:-22px;text-decoration:none;font-size:.75rem;font-weight:800;background:#ef4444;color:#fff;border-radius:8px;padding:0 6px}
  .sa-pms{display:flex;gap:6px;padding:6px 4px 0}.sa-pms span{flex:1;display:flex;flex-direction:column;gap:4px}.sa-pms button{border:0;border-radius:8px;background:#fcd34d;font:800 1rem 'Nunito';cursor:pointer;padding:3px 0;box-shadow:0 3px 0 #d99a00;color:#1f2a5a}
  .sa-st{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:10px}.sa-st span{background:#eef2ff;border-radius:999px;padding:3px 12px;font-weight:700}.sa-bp{width:100%;max-width:340px;display:block;margin:10px auto 0;background:#fffbeb;border-radius:12px}
  .sa-tl{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.sa-pks{display:flex;align-items:flex-end;gap:4px;margin:10px 0;min-height:150px}.sa-pk{flex:1;min-width:0;border:0;cursor:pointer;background:linear-gradient(90deg,#6ee7b7,#10b981 55%,#047857);clip-path:polygon(50% 0,100% 100%,0 100%);display:flex;align-items:flex-end;justify-content:center;padding-bottom:4px;color:#fff;font-weight:800}.sa-pk.mx{background:linear-gradient(#fde047,#f59e0b)}.sa-pk.mn{background:linear-gradient(#fca5a5,#ef4444)}
  .sa-mc{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}.sa-o{padding:11px 16px;background:#e0f2fe;color:#1f2a5a;box-shadow:0 4px 0 #60a5fa}
  .sa-res{margin-top:12px;border-radius:14px;padding:10px 12px;font-weight:700}.sa-res.ok{background:#10b98122;border:2px solid #10b981}.sa-res.no{background:#ef444422;border:2px solid #ef4444}.sa-res.in{background:#4f46e522;border:2px solid #4f46e5}
  .sa-act{display:flex;gap:8px;justify-content:flex-end;margin-top:12px;flex-wrap:wrap}.sa-stars{font-size:2.6rem;text-align:center;letter-spacing:6px;filter:drop-shadow(0 4px 2px #0003)}
  .sa-rm{background:#fef3c7;border:2px dashed #f59e0b;border-radius:12px;padding:8px 12px;font-weight:800;margin:8px 0;text-align:center}.sa-ex{background:#eef2ff;border-radius:14px;padding:10px 14px;margin:10px 0}.sa-tip{background:#ecfdf5;border-radius:12px;padding:8px 12px}
  .sa-list{display:grid;gap:10px;margin-top:10px}.sa-mi{display:flex;justify-content:space-between;align-items:center;gap:8px;background:#fff;border:3px solid #c7d2fe;border-radius:16px;padding:10px 14px;box-shadow:0 4px 0 #818cf8;color:#1f2a5a}
  .sa-bd{display:flex;gap:8px;flex-wrap:wrap}.sa-bd span{font-size:2rem;background:#fff;border-radius:16px;padding:4px 10px;box-shadow:0 4px 0 #fcd34d;border:2px solid #fde68a}.sa-bd span.off{filter:grayscale(1);opacity:.35}
  .sa-ac{background:#fff;border:2px solid #e0e7ff;border-radius:14px;padding:8px 12px;margin:6px 0;color:#1f2a5a}.sa-ac.off{opacity:.45}
  @keyframes saB{50%{transform:translateY(-6px)}}@keyframes saF{to{transform:translate(-50%,-54%)}}@keyframes saS{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
  @media(max-width:520px){.sa-g{width:80px}.sa-say:before{display:none}.sa-nd{width:112px}.sa-world{height:680px}}@media(prefers-reduced-motion:reduce){.sa *{animation:none!important;transition:none!important}}`
  if (!document.getElementById('sa-css')) document.head.insertAdjacentHTML('beforeend', `<style id="sa-css">${CSS}</style>`)

  /* ---------- Penyimpanan progres: Supabase bila ada, jika tidak di perangkat ---------- */
  const KEY = 'statistica_v1', adaDb = () => { try { return typeof db !== 'undefined' && db && typeof db.rpc === 'function' } catch (e) { return false } }
  const ALLM = LOK.flatMap(l => l.m), LOKM = k => LOK.find(l => l.m.includes(k))

  function mulai(el) {
    if (!el) return
    let S = { nama: 'Detektif', m: {}, koin: 0 }
    const bintang = () => Object.values(S.m).reduce((a, x) => a + (x.b || 0), 0), xp = () => bintang() * 20, level = () => 1 + Math.floor(xp() / 60)
    const done = id => (S.m[id] && S.m[id].b >= 1), lokDone = l => l.m.every(done), buka = i => i === 0 || lokDone(LOK[i - 1])
    const ACH = [['🔍', 'Detektif Baru', 'Selesaikan misi pertama', () => ALLM.some(done)], ['⭐', 'Bintang Tiga', 'Raih ⭐⭐⭐ di 3 misi', () => Object.values(S.m).filter(x => x.b === 3).length >= 3],
      ['💰', 'Kolektor Koin', 'Kumpulkan 100 koin', () => S.koin >= 100], ['🗺️', 'Penjelajah', 'Buka semua lokasi', () => LOK.every((l, i) => buka(i))], ['🕵️', 'Detektif Master', 'Selesaikan Master Challenge', () => done('master')]]
    const achSet = () => ACH.filter(a => a[3]()).map(a => a[1])
    const simpan = async () => { let ok = false
      if (adaDb()) { try { const r = await db.rpc('simpan_statistica', { p_data: S }); ok = !(r && r.error) } catch (e) {} }
      if (!ok) { try { localStorage.setItem(KEY, JSON.stringify(S)) } catch (e) {} } }   // cadangan di perangkat bila Supabase/SQL belum siap
    const muat = async () => { try { let d = null, dbok = false
        if (adaDb()) { try { const r = await db.from('statistica_progres').select('data').maybeSingle(); if (!r.error) { dbok = true; d = r.data && r.data.data } } catch (e) {} }
        if (!dbok) { try { d = JSON.parse(localStorage.getItem(KEY)) } catch (e) {} }
        if (d && d.m) { Object.entries(d.m).forEach(([k, v]) => { if (ALLM.includes(k)) S.m[k] = { b: Math.max((S.m[k] || {}).b || 0, Math.min(3, v.b || 0)) } }); S.koin = Math.max(S.koin, d.koin || 0); if (d.nama) S.nama = String(d.nama).slice(0, 16) } } catch (e) {} }

    const top = (back) => `<div class="sa-bar2">${back ? '<button class="sa-chip" id="saBack">🗺️ Peta</button>' : ''}<span class="sa-chip">🎖️ Level ${level()}<span class="sa-xp"><i style="width:${(xp() % 60) / 60 * 100}%"></i></span></span><span class="sa-chip">⭐ ${bintang()}</span><span class="sa-chip">🪙 ${S.koin}</span></div>`
    const bs = n => '⭐'.repeat(n) + '☆'.repeat(3 - n)

    function home() {
      const ada = bintang() > 0
      el.innerHTML = `<div class="sa"><div class="sa-hero"><div class="sa-logo"><span>STATISTICA</span><small>The Data Mystery Adventure</small></div>
        <div class="sa-row"><div class="sa-g big">${guide('hi')}</div><div class="sa-say"><span class="sa-tag">Detektif Dani</span><br>Halo, calon detektif data! Kota ini penuh misteri, dan hanya statistika yang bisa memecahkannya. Siapa namamu?<input id="saNm" class="sa-in" maxlength="16" placeholder="Nama detektif" value="${esc(S.nama === 'Detektif' ? '' : S.nama).replace(/"/g, '&quot;')}" aria-label="Nama detektif"></div></div>
        <p style="text-align:center;margin:14px 0 0"><button class="sa-b g" id="saGo">🕵️ ${ada ? 'Lanjutkan' : 'Mulai'} petualangan</button></p></div></div>`
      document.getElementById('saGo').onclick = () => { S.nama = document.getElementById('saNm').value.trim().slice(0, 16) || 'Detektif'; simpan(); hub('peta') } }

    function hub(tab) {
      const T = [['peta', '🗺️ Peta'], ['profil', '👤 Profil'], ['lab', '🔬 Lab Data']]
      el.innerHTML = `<div class="sa">${top()}<div class="sa-tabs">${T.map(t => `<button class="sa-n${tab === t[0] ? ' on' : ''}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div><div id="saV"></div></div>`
      el.querySelectorAll('[data-t]').forEach(b => b.onclick = () => hub(b.dataset.t))
      const V = document.getElementById('saV'), P = [[26, 13], [74, 30], [26, 48], [74, 66], [42, 85]]
      if (tab === 'peta') {
        V.innerHTML = `<div class="sa-world"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M26 13 C26 23,74 20,74 30 C74 40,26 38,26 48 C26 58,74 56,74 66 C74 76,42 75,42 85" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 2.4" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>
          ${[['☁️', 10, 4, 2.8], ['☁️', 58, 3, 2.2], ['☀️', 90, 6, 2.8], ['🌳', 7, 42, 2.6], ['🌲', 93, 47, 2.6], ['🌷', 50, 52, 1.8], ['🌳', 8, 68, 2.6], ['🌲', 94, 80, 2.4], ['🌻', 62, 93, 1.8], ['🌳', 12, 92, 2.4], ['🪨', 50, 30, 1.6]].map(d => `<span class="sa-dec" aria-hidden="true" style="left:${d[1]}%;top:${d[2]}%;font-size:${d[3]}rem">${d[0]}</span>`).join('')}
          ${LOK.map((l, i) => { const o = buka(i), st = l.m.reduce((a, k) => a + ((S.m[k] || {}).b || 0), 0)
            return `<button class="sa-nd" style="--c:${l.c};left:${P[i][0]}%;top:${P[i][1]}%" data-l="${i}" ${o ? '' : 'disabled'}>${lokDone(l) ? '<em>🏅</em>' : ''}<span class="ic">${o ? l.e : '🔒'}</span><b>${l.n}</b><small>${o ? bs(Math.min(3, Math.round(st / l.m.length))) : 'Selesaikan area sebelumnya'}</small></button>` }).join('')}</div>`
        V.querySelectorAll('[data-l]').forEach(b => b.onclick = () => lokasi(+b.dataset.l))
      } else if (tab === 'profil') {
        const as = achSet()
        V.innerHTML = `<div class="sa-box"><div class="sa-row" style="align-items:center"><div class="sa-g">${guide('ok')}</div><div><b style="font-size:1.3rem">🕵️ ${esc(S.nama)}</b><br>Level ${level()} · ${xp()} XP · ⭐ ${bintang()} · 🪙 ${S.koin}</div></div>
          <label style="font-weight:800">Ganti nama detektif<input id="saNm2" class="sa-in" maxlength="16" value="${esc(S.nama).replace(/"/g, '&quot;')}"></label>
          <h4>🏅 Badge lokasi</h4><div class="sa-bd">${LOK.map(l => `<span class="${lokDone(l) ? '' : 'off'}" title="${l.n}">${l.e}</span>`).join('')}</div>
          <h4>🏆 Prestasi</h4>${ACH.map(a => `<div class="sa-ac${as.includes(a[1]) ? '' : ' off'}">${a[0]} <b>${a[1]}</b>: ${a[2]}${as.includes(a[1]) ? ' ✅' : ''}</div>`).join('')}
          <p><button class="sa-b o" id="saRst">Reset progres</button></p></div>`
        document.getElementById('saNm2').onchange = e => { S.nama = e.target.value.trim().slice(0, 16) || 'Detektif'; simpan(); hub('profil') }
        document.getElementById('saRst').onclick = () => { if (confirm('Hapus semua progres Statistica?')) { S = { nama: S.nama, m: {}, koin: 0 }; simpan(); hub('profil') } }
      } else {
        V.innerHTML = '<div class="sa-box"><p class="sa-k">🔬 <b>Lab Data</b>: ubah batang data dan lihat semua statistik berubah langsung. Bebas bereksperimen, tanpa nilai.</p><div id="saLb"></div><p style="text-align:center"><button class="sa-b" id="saAc">🎲 Acak data</button></p></div>'
        const draw = () => barsUI(document.getElementById('saLb'), gen(7, 3, 28), { hi: 30, show: ['mean', 'median', 'range', 'q1', 'q3', 'H', 'Qd'], bp: true, meanLine: true }); draw(); document.getElementById('saAc').onclick = draw } }

    function lokasi(i) {
      const l = LOK[i]
      el.innerHTML = `<div class="sa">${top(true)}<div class="sa-stage" style="--c:${l.c}"><div class="sa-row"><div class="sa-g">${guide('hi')}</div><div class="sa-say"><span class="sa-tag">${l.e} ${l.n}</span><br>${l.d}. Belajar dulu di ruang belajar, lalu selesaikan misinya!</div></div>
        <div class="sa-list"><div class="sa-mi"><b>📖 Ruang Belajar</b><button class="sa-b" id="saBl">Buka</button></div>${l.m.map(k => `<div class="sa-mi"><span><b>${MIS[k].t}</b><br>${bs((S.m[k] || {}).b || 0)}</span><button class="sa-b g" data-m="${k}">${done(k) ? 'Main lagi' : 'Mulai misi'}</button></div>`).join('')}</div></div></div>`
      document.getElementById('saBack').onclick = () => hub('peta'); document.getElementById('saBl').onclick = () => belajar(i)
      el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => misi(b.dataset.m)) }

    function belajar(i) { const l = LOK[i]
      el.innerHTML = `<div class="sa">${top(true)}<div class="sa-stage"><h3 style="margin:0 0 6px">${l.e} Ruang Belajar: ${l.n}</h3>${l.b}<p style="text-align:right"><button class="sa-b g" id="saOk">Siap bermisi →</button></p></div></div>`
      document.getElementById('saBack').onclick = () => hub('peta'); document.getElementById('saOk').onclick = () => lokasi(i) }

    function misi(id) {
      const M = MIS[id], l = LOKM(id), m = M.gen(); let mist = 0, hint = false, fin = false
      el.innerHTML = `<div class="sa">${top(true)}<div class="sa-stage"><div class="sa-row"><div class="sa-g" id="saG">${guide('hi')}</div><div class="sa-say"><span class="sa-tag">${l.e} ${l.n} · ${M.t}</span><br>${m.story}</div></div>
        <div class="sa-box" id="saBox"></div><div class="sa-act"><button class="sa-b o" id="saH">💡 Petunjuk</button><button class="sa-b" id="saC">✅ Periksa</button></div><div id="saM"></div></div></div>`
      document.getElementById('saBack').onclick = () => lokasi(LOK.indexOf(l))
      const info = (t, c) => { document.getElementById('saM').innerHTML = `<div class="sa-res ${c}">${t}</div>` }
      const cek = m.build(document.getElementById('saBox'), { wrong: t => { mist++; info(t, 'no') } })
      document.getElementById('saH').onclick = () => { if (!hint) { hint = true; mist++ } info('💡 ' + m.hint, 'in') }
      document.getElementById('saC').onclick = () => { if (fin) return; const r = cek()
        if (r === true) return selesai(mist === 0 ? 3 : mist <= 2 ? 2 : 1)
        if (typeof r === 'string') return info(r, 'in')
        mist++; info('Belum tepat. Periksa lagi hitunganmu, atau buka petunjuk.' + (mist >= 4 ? ' <button class="sa-b o" id="saEx">📖 Lihat pembahasan</button>' : ''), 'no')
        const x = document.getElementById('saEx'); if (x) x.onclick = () => { info('📖 ' + m.exp, 'in'); selesai(1, true) } }
      function selesai(b, lihat) { fin = true; const lv0 = level(), a0 = achSet(), best = (S.m[id] || {}).b || 0, beda = Math.max(0, b - best), plus = lihat ? 0 : beda * 10 + (best === 0 ? 5 : 0)
        if (b > best) S.m[id] = { b }; S.koin += plus; simpan(); const baru = achSet().filter(x => !a0.includes(x))
        document.getElementById('saG').innerHTML = guide('ok'); document.getElementById('saC').disabled = true; document.getElementById('saH').disabled = true
        document.getElementById('saM').insertAdjacentHTML('beforeend', `<div class="sa-res ok"><div class="sa-stars">${bs(b)}</div><b>${lihat ? 'Misi selesai dengan pembahasan.' : '🎉 Kasus terpecahkan!'}</b> 🪙 +${plus} koin${level() > lv0 ? ` · 🎖️ <b>Level naik ke ${level()}!</b>` : ''}${baru.length ? `<br>🏆 Prestasi baru: ${baru.map(esc).join(', ')}` : ''}${m.exp && !lihat ? `<br><small>${m.exp}</small>` : ''}</div>
          <div class="sa-act"><button class="sa-b" id="saAg">🔄 Main lagi</button><button class="sa-b g" id="saMp">🗺️ Kembali ke peta</button></div>`)
        document.getElementById('saAg').onclick = () => misi(id); document.getElementById('saMp').onclick = () => lokasi(LOK.indexOf(l)) } }

    home()
    muat().then(() => { const nm = document.getElementById('saNm'); if (el.querySelector('.sa-hero') && nm && !nm.value) home() })
  }
  window.Statistica = { mulai }
})()

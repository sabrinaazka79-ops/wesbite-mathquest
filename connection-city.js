/* Connection City - game edukasi Materi 4 (Relasi & Fungsi). Gaya 3D cartoon, tanpa aset eksternal.
   Dipanggil dari materi4.js: ConnectionCity.mulai(elemen). Progres & XP lewat mathquest-kota.sql (opsional: tanpa SQL game tetap jalan). */
(function () {
  'use strict'
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1))
  const pick = a => a[Math.floor(Math.random() * a.length)]
  const mix = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1])
  const uniq = a => [...new Set(a)]
  const esc = t => { const d = document.createElement('div'); d.textContent = t ?? ''; return d.innerHTML }
  const fx = (a, b) => `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`
  const lin = (m, c) => (m === 1 ? 'x' : m === -1 ? '−x' : m + 'x') + (c ? ` ${c < 0 ? '−' : '+'} ${Math.abs(c)}` : '')
  const rd = (box, i) => { const v = box.querySelectorAll('.kc-i')[i].value; return v === '' ? NaN : +v }
  const inp = () => '<input class="kc-i" type="number" inputmode="numeric" aria-label="Jawaban">'

  const AREA = [
    { k: 'park', n: 'Relation Park', e: '🎡', c: '#8b5cf6', t: '#fff', jud: 'Pasangkan anggota himpunan', lulus: 2 },
    { k: 'map', n: 'Mapping Station', e: '🚉', c: '#3b82f6', t: '#fff', jud: 'Susun diagram panah', lulus: 2 },
    { k: 'fac', n: 'Function Factory', e: '🏭', c: '#10b981', t: '#fff', jud: 'Input, output, nilai fungsi', lulus: 2 },
    { k: 'graph', n: 'Graph Station', e: '📍', c: '#fbbf24', t: '#1d1740', jud: 'Pasangan berurutan & Kartesius', lulus: 2 },
    { k: 'center', n: 'Challenge Center', e: '🏆', c: '#6d28d9', t: '#fff', jud: 'Evaluasi gabungan', lulus: 4 }
  ]

  /* ---------- Pemilih jawaban & diagram panah ---------- */
  /* Seret & lepas: seret anggota A ke anggota B (mouse atau sentuhan). Mode ketuk-lalu-ketuk tetap berfungsi. */
  const seret = box => box.addEventListener('pointerdown', e => {
    const s = e.target.closest('[data-a]'); if (!s) return
    const sx = e.clientX, sy = e.clientY; let g = null
    const mv = v => { if (!g && Math.hypot(v.clientX - sx, v.clientY - sy) > 6) { g = s.cloneNode(true); g.className = 'kc-n kc-ghost'; document.body.appendChild(g); s.style.opacity = '.35' }
      if (g) { g.style.left = v.clientX - 22 + 'px'; g.style.top = v.clientY - 22 + 'px' } }
    const up = v => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); if (!g) return; g.remove(); s.style.opacity = ''
      const t = document.elementFromPoint(v.clientX, v.clientY)?.closest('[data-b]')
      if (t && box.contains(t)) { const bv = t.dataset.b; s.click(); box.querySelector(`[data-b="${bv}"]`)?.click() } }
    addEventListener('pointermove', mv); addEventListener('pointerup', up)
  })
  const mc = (box, opts, ci) => { let s = -1
    box.innerHTML = `<div class="kc-mc">${opts.map((o, i) => `<button class="kc-o" data-i="${i}">${o}</button>`).join('')}</div>`
    box.querySelectorAll('.kc-o').forEach(b => b.onclick = () => { s = +b.dataset.i; box.querySelectorAll('.kc-o').forEach(x => x.classList.toggle('on', x === b)) })
    return () => s === ci }
  const diag = (A, B, ar) => { const H = Math.max(A.length, B.length) * 44 + 22, y = i => 40 + i * 44
    const nd = (arr, x, f) => arr.map((v, i) => `<circle cx="${x}" cy="${y(i)}" r="17" fill="${f}"/><text x="${x}" y="${y(i) + 6}" text-anchor="middle" fill="#fff" font-weight="800" font-size="16">${v}</text>`).join('')
    return `<svg viewBox="0 0 300 ${H}" class="kc-dg" role="img" aria-label="Diagram panah"><defs><marker id="kcA" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#6d28d9"/></marker></defs>
      <text x="60" y="12" text-anchor="middle" font-weight="800" fill="#6d28d9">A</text><text x="240" y="12" text-anchor="middle" font-weight="800" fill="#2563eb">B</text>
      ${ar.map(([a, b]) => `<line x1="78" y1="${y(A.indexOf(a))}" x2="220" y2="${y(B.indexOf(b))}" stroke="#6d28d9" stroke-width="3" marker-end="url(#kcA)"/>`).join('')}${nd(A, 60, '#8b5cf6')}${nd(B, 240, '#3b82f6')}</svg>` }
  const gsvg = (sel, hit) => { const S = 30, O = 135, ax = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
    return `<svg viewBox="0 0 270 270" class="kc-gr" role="img" aria-label="Bidang Kartesius">${ax.map(i => `<line x1="${O + i * S}" y1="5" x2="${O + i * S}" y2="265" stroke="${i ? '#d8ccf7' : '#4c1d95'}" stroke-width="${i ? 1 : 2.5}"/><line x1="5" y1="${O + i * S}" x2="265" y2="${O + i * S}" stroke="${i ? '#d8ccf7' : '#4c1d95'}" stroke-width="${i ? 1 : 2.5}"/>`).join('')}
      ${ax.filter(i => i).map(i => `<text x="${O + i * S}" y="${O + 14}" text-anchor="middle" font-size="10" fill="#5b5680">${i}</text><text x="${O - 6}" y="${O - i * S + 4}" text-anchor="end" font-size="10" fill="#5b5680">${i}</text>`).join('')}
      ${hit ? ax.flatMap(i => ax.map(j => `<circle cx="${O + i * S}" cy="${O - j * S}" r="12" fill="#fff0" data-k="${i},${j}" style="cursor:pointer"/>`)).join('') : ''}
      ${[...sel].map(k => { const [i, j] = k.split(',').map(Number); return `<circle cx="${O + i * S}" cy="${O - j * S}" r="7" fill="#f59e0b" stroke="#fff" stroke-width="2.5"/>` }).join('')}</svg>` }
  const plot = (box, single, svgExtra) => { const sel = new Set()
    const draw = () => { box.innerHTML = gsvg(sel, true); box.querySelectorAll('[data-k]').forEach(c => c.onclick = () => { const k = c.dataset.k; if (single) { sel.clear(); sel.add(k) } else sel.has(k) ? sel.delete(k) : sel.add(k); draw() }) }
    draw(); return sel }

  /* Menggambar garis: ketuk 2 kali di titik awal (kunci), lalu tarik/geser ke titik tujuan. Titik otomatis menempel ke perpotongan kisi. */
  const ext = (A, B) => { const d = [B[0] - A[0], B[1] - A[1]]; let lo = -1e9, hi = 1e9
    ;[0, 1].forEach(i => { if (d[i]) { const t1 = (-4 - A[i]) / d[i], t2 = (4 - A[i]) / d[i]; lo = Math.max(lo, Math.min(t1, t2)); hi = Math.min(hi, Math.max(t1, t2)) } })
    return [[A[0] + lo * d[0], A[1] + lo * d[1]], [A[0] + hi * d[0], A[1] + hi * d[1]]] }
  const lineDraw = (box, m, c) => {
    box.innerHTML = gsvg(new Set(), false).replace('</svg>', '<g id="kcL"></g></svg>') + '<p class="kc-st" id="kcS">Ketuk <b>2 kali</b> di titik awal untuk mengunci, lalu tarik ke titik tujuan.</p><p style="text-align:center;margin:6px 0 0"><button class="kc-n" id="kcR">↺ Ulangi garis</button></p>'
    const svg = box.querySelector('svg'), L = box.querySelector('#kcL'), S = box.querySelector('#kcS'), st = { A: null, B: null, drag: false, tap: null, down: null }
    const X = v => 135 + v * 30, Y = v => 135 - v * 30, fm = p => `(${p[0]}, ${p[1]})`, key = p => p.join(','), cl = v => Math.max(-4, Math.min(4, v))
    const snap = e => { const r = svg.getBoundingClientRect(); return [cl(Math.round(((e.clientX - r.left) / r.width * 270 - 135) / 30)), cl(Math.round((135 - (e.clientY - r.top) / r.height * 270) / 30))] }
    const upd = () => { const { A, B, tap } = st; let h = ''
      if (A && B && key(A) !== key(B)) { const [p, q] = ext(A, B)
        h += `<line x1="${X(p[0])}" y1="${Y(p[1])}" x2="${X(q[0])}" y2="${Y(q[1])}" stroke="#a78bfa" stroke-width="2" stroke-dasharray="5 4"/><line x1="${X(A[0])}" y1="${Y(A[1])}" x2="${X(B[0])}" y2="${Y(B[1])}" stroke="#7c3aed" stroke-width="4" stroke-linecap="round"/>` }
      if (tap && !A) h += `<circle cx="${X(tap.p[0])}" cy="${Y(tap.p[1])}" r="10" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4 3"/>`
      if (A) h += `<circle cx="${X(A[0])}" cy="${Y(A[1])}" r="9" fill="#f59e0b" stroke="#fff" stroke-width="3"/>`
      if (B) h += `<circle cx="${X(B[0])}" cy="${Y(B[1])}" r="7" fill="#7c3aed" stroke="#fff" stroke-width="2.5"/>`
      L.innerHTML = h
      S.textContent = B ? `Garis dari ${fm(A)} ke ${fm(B)}. Tarik lagi untuk menggeser titik tujuan.` : A ? `Titik awal ${fm(A)} terkunci. Sekarang tarik/geser ke titik tujuan.` : tap ? `Titik ${fm(tap.p)} dipilih. Ketuk sekali lagi di titik yang sama untuk mengunci titik awal.` : 'Ketuk 2 kali di titik awal untuk mengunci, lalu tarik ke titik tujuan.' }
    svg.addEventListener('pointerdown', e => { const p = snap(e); if (!st.A) { st.down = p; return }; st.drag = true; try { svg.setPointerCapture(e.pointerId) } catch (x) {} st.B = p; upd() })
    svg.addEventListener('pointermove', e => { if (st.drag) { st.B = snap(e); upd() } })
    svg.addEventListener('pointerup', () => { if (st.drag) { st.drag = false; return }
      if (st.A || !st.down) return; const q = st.down, t = Date.now(); st.down = null
      if (st.tap && st.tap.k === key(q) && t - st.tap.t < 600) { st.A = q; st.tap = null; svg.style.touchAction = 'none' } else st.tap = { p: q, k: key(q), t }
      upd() })
    svg.addEventListener('pointercancel', () => { st.drag = false })
    box.querySelector('#kcR').onclick = () => { st.A = st.B = st.tap = st.down = null; st.drag = false; svg.style.touchAction = 'auto'; upd() }
    return () => !!(st.A && st.B && key(st.A) !== key(st.B) && st.A[1] === m * st.A[0] + c && st.B[1] === m * st.B[0] + c) }

  /* ---------- Bank ronde tiap area (acak setiap sesi) ---------- */
  const RULES = [['faktor dari', (a, b) => b % a === 0, a => a * R(2, 4)], ['setengah dari', (a, b) => b === 2 * a, a => 2 * a], ['2 kurang dari', (a, b) => b === a + 2, a => a + 2]]
  const rPark = () => { const [nm, f, g] = pick(RULES), A = mix([2, 3, 4, 5, 6]).slice(0, 3).sort((x, y) => x - y)
    let B = uniq([...mix(A).slice(0, 2).map(g), R(3, 18), R(3, 18)]); while (B.length < 4) B = uniq([...B, R(3, 18)]); B.sort((x, y) => x - y)
    const V = new Set(); A.forEach(a => B.forEach(b => f(a, b) && V.add(a + ',' + b)))
    return { q: `Relasi dari himpunan A ke B: “x adalah ${nm} y”. Pasangkan semua anggota A dengan anggota B yang sesuai. Seret anggota A ke anggota B (atau ketuk keduanya).`,
      build(box) { let sel = null; const P = new Set()
        const draw = () => { box.innerHTML = `<div class="kc-two"><div><b>A</b>${A.map(a => `<button class="kc-n${sel === a ? ' on' : ''}" data-a="${a}">${a}</button>`).join('')}</div><div><b>B</b>${B.map(b => `<button class="kc-n" data-b="${b}">${b}</button>`).join('')}</div></div>
          <div class="kc-pairs">${[...P].map(p => `<span class="kc-pr" data-p="${p}">(${p.replace(',', ', ')}) ✕</span>`).join('') || '<i>Pilih anggota A, lalu anggota B untuk membuat pasangan.</i>'}</div>`
          box.querySelectorAll('[data-a]').forEach(x => x.onclick = () => { sel = +x.dataset.a; draw() })
          box.querySelectorAll('[data-b]').forEach(x => x.onclick = () => { if (sel == null) return; const k = sel + ',' + x.dataset.b; P.has(k) ? P.delete(k) : P.add(k); draw() })
          box.querySelectorAll('[data-p]').forEach(x => x.onclick = () => { P.delete(x.dataset.p); draw() }) }
        seret(box); draw(); return () => P.size === V.size && [...P].every(k => V.has(k)) },
      exp: `Pasangan yang memenuhi: {${[...V].map(p => `(${p.replace(',', ', ')})`).join(', ')}}.` } }

  const MAPR = [['x + 2', x => x + 2], ['2x', x => 2 * x], ['3x − 1', x => 3 * x - 1], ['x − 1', x => x - 1], ['2x + 1', x => 2 * x + 1]]
  const bset = (img, n) => { let B = uniq([...img, R(1, 10)]); while (B.length < n) B = uniq([...B, R(1, 12)]); return B.sort((x, y) => x - y) }
  const rMap = () => { const [nm, f] = pick(MAPR), A = [1, 2, 3], B = bset(A.map(f), 5)
    return { q: `Susun diagram panah untuk fungsi f(x) = ${nm} dari A = {1, 2, 3}. Seret anggota A ke pasangannya di B (atau ketuk keduanya).`,
      build(box) { const M = {}; let sel = null
        const draw = () => { box.innerHTML = diag(A, B, Object.entries(M).map(([a, b]) => [+a, b])) + `<div class="kc-two"><div><b>Dari A</b>${A.map(a => `<button class="kc-n${sel === a ? ' on' : ''}" data-a="${a}">${a}</button>`).join('')}</div><div><b>Ke B</b>${B.map(b => `<button class="kc-n" data-b="${b}">${b}</button>`).join('')}</div></div>`
          box.querySelectorAll('[data-a]').forEach(x => x.onclick = () => { sel = +x.dataset.a; draw() })
          box.querySelectorAll('[data-b]').forEach(x => x.onclick = () => { if (sel != null) { M[sel] = +x.dataset.b; draw() } }) }
        seret(box); draw(); return () => A.every(a => M[a] === f(a)) },
      exp: `${A.map(a => `f(${a}) = ${f(a)}`).join(', ')}. Setiap anggota A harus punya tepat satu panah.` } }
  const rFungsi = () => { const [, f] = pick(MAPR), A = [1, 2, 3], B = bset(A.map(f), 4); let ar = A.map(a => [a, f(a)]), why = '', bad = Math.random() < .5
    if (bad) { const a = pick(A); if (Math.random() < .5) { ar.push([a, pick(B.filter(b => b !== f(a)))]); why = `anggota ${a} memiliki dua pasangan` } else { ar = ar.filter(p => p[0] !== a); why = `anggota ${a} tidak memiliki pasangan` } }
    return { q: 'Perhatikan diagram panah berikut. Apakah relasi dari A ke B ini merupakan fungsi?', build(box) { box.innerHTML = diag(A, B, ar) + '<div id="kcX"></div>'; return mc(box.querySelector('#kcX'), ['Fungsi', 'Bukan fungsi'], bad ? 1 : 0) },
      exp: bad ? `Bukan fungsi karena ${why}.` : 'Fungsi, karena setiap anggota A memiliki tepat satu pasangan di B.' } }

  const mach = (t, i, o) => `<div class="kc-fac"><span>📥 ${i}</span><div class="kc-mach">⚙️<b>${t}</b></div><span>📤 ${o}</span></div>`
  const rFac = n => { const a = R(2, 5), b = pick([-3, -2, -1, 1, 2, 3, 4, 5]), t = `f(x) = ${fx(a, b)}`, f = x => a * x + b, p = R(1, 6), q = f(p), sg = b < 0 ? '−' : '+'
    if (n === 0) return { q: `Mesin pabrik bekerja dengan aturan ${t}. Masukkan x = ${p}. Berapa keluarannya?`, build(box) { box.innerHTML = mach(t, 'x = ' + p, `f(${p}) = ?`) + inp(); return () => rd(box, 0) === q }, exp: `f(${p}) = ${a}(${p}) ${sg} ${Math.abs(b)} = ${q}.` }
    if (n === 1) return { q: `Mesin ${t} mengeluarkan nilai ${q}. Berapa nilai x yang dimasukkan?`, build(box) { box.innerHTML = mach(t, 'x = ?', 'f(x) = ' + q) + inp(); return () => rd(box, 0) === p }, exp: `${fx(a, b)} = ${q} → ${a}x = ${q - b} → x = ${p}.` }
    const X = [0, 1, 2]; return { q: `Lengkapi tabel keluaran mesin ${t}.`, build(box) { box.innerHTML = mach(t, 'x = 0, 1, 2', 'f(x) = ?, ?, ?') + `<div class="kc-tb">${X.map(x => `<label>f(${x}) = ${inp()}</label>`).join('')}</div>`; return () => X.every((x, i) => rd(box, i) === f(x)) }, exp: `f(0) = ${f(0)}, f(1) = ${f(1)}, f(2) = ${f(2)}.` } }

  const rGraph = n => { if (n === 0) { let a, b; do { a = R(-4, 4); b = R(-4, 4) } while (!a || !b)
      return { q: `Gambarlah titik (${a}, ${b}) pada bidang Kartesius. Ketuk titik potong garis yang tepat.`, build(box) { const s = plot(box, true); return () => s.size === 1 && s.has(a + ',' + b) }, exp: `Titik (${a}, ${b}): geser ${Math.abs(a)} satuan ke ${a < 0 ? 'kiri' : 'kanan'} (sumbu-x), lalu ${Math.abs(b)} satuan ke ${b < 0 ? 'bawah' : 'atas'} (sumbu-y).` } }
    if (n === 1) { let a, b; do { a = R(-4, 4); b = R(-4, 4) } while (!a || !b || a === b)
      const O = mix([[`(${a}, ${b})`, 1], [`(${b}, ${a})`, 0], [`(${-a}, ${b})`, 0], [`(${a}, ${-b})`, 0]])
      return { q: 'Tentukan koordinat titik kuning pada bidang Kartesius berikut.', build(box) { box.innerHTML = gsvg(new Set([a + ',' + b]), false) + '<div id="kcX"></div>'; return mc(box.querySelector('#kcX'), O.map(o => o[0]), O.findIndex(o => o[1])) }, exp: `Titik berada di x = ${a} dan y = ${b}, jadi koordinatnya (${a}, ${b}). Urutan (x, y) tidak boleh tertukar.` } }
    const m = pick([1, 2, -1]), c = R(-2, 2), X = [-1, 0, 1]
    return { q: `Gambarlah garis grafik fungsi f(x) = ${lin(m, c)}. Hitung dulu pasangan berurutan (x, f(x)). Lalu ketuk 2 kali di titik awal untuk mengunci, dan tarik/geser ke titik tujuan yang dilalui garis.`, build: box => lineDraw(box, m, c),
      exp: `Pasangan berurutan: ${X.map(x => `(${x}, ${m * x + c})`).join(', ')}. Garis melalui titik-titik ini, jadi titik awal dan titik tujuanmu harus memenuhi y = ${lin(m, c)}.` } }

  const numq = (q, ans, extra, exp) => { const w = uniq([...extra, ans + 1, ans - 1, ans + 2]).filter(v => v !== ans).slice(0, 3), o = mix([[ans, 1], ...w.map(v => [v, 0])]); return { q, build: box => mc(box, o.map(x => x[0]), o.findIndex(x => x[1])), exp } }
  const rCenter = () => {
    const a = R(2, 4), b = R(-3, 4) || 2, p = R(1, 5), v = a * p + b, m = pick([2, 3]), n = pick([2, 3]), k = pick([3, 4]), x = R(-4, 4) || 2, y = R(-4, 4) || -3, F = [1, 1, 2, 6, 24]
    const qd = x > 0 && y > 0 ? 0 : x < 0 && y > 0 ? 1 : x < 0 ? 2 : 3
    const rg = (aa, bb) => `{${[p, p + 1, p + 2].map(t => aa * t + bb).join(', ')}}`, ro = mix([[rg(a, b), 1], [rg(a + 1, b), 0], [rg(a, b + 1), 0], [rg(a, b - 1), 0]])
    return mix([numq(`Diketahui f(x) = ${fx(a, b)}. Nilai f(${p}) adalah ...`, v, [v + a], `f(${p}) = ${a}(${p}) ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${v}.`),
      numq(`Jika n(A) = ${m} dan n(B) = ${n}, banyak pemetaan dari A ke B adalah ...`, n ** m, [m ** n, m * n, m + n], `Banyak pemetaan = n(B)^n(A) = ${n}^${m} = ${n ** m}.`),
      numq(`Jika n(A) = n(B) = ${k}, banyak korespondensi satu-satu dari A ke B adalah ...`, F[k], [k * k, k * 2, k + 1], `${k}! = ${F[k]}.`),
      { q: `Titik (${x}, ${y}) terletak pada kuadran ...`, build: box => mc(box, ['I', 'II', 'III', 'IV'], qd), exp: `x ${x > 0 ? 'positif' : 'negatif'} dan y ${y > 0 ? 'positif' : 'negatif'}, sehingga titik berada di kuadran ${['I', 'II', 'III', 'IV'][qd]}.` },
      { q: `Fungsi f(x) = ${fx(a, b)} dengan domain {${p}, ${p + 1}, ${p + 2}}. Daerah hasilnya adalah ...`, build: box => mc(box, ro.map(o => o[0]), ro.findIndex(o => o[1])), exp: `Daerah hasil = ${rg(a, b)}.` }]) }
  const GEN = { park: () => [rPark(), rPark(), rPark()], map: () => [rMap(), rMap(), rFungsi()], fac: () => [rFac(0), rFac(1), rFac(2)], graph: () => [rGraph(0), rGraph(1), rGraph(2)], center: rCenter }

  /* ---------- Maskot Raka: siswa SMP ---------- */
  const mulut = { hi: 'M48 60 Q60 70 72 60', ok: 'M46 58 Q60 76 74 58 Z', sad: 'M50 66 Q60 58 70 66' }
  const guide = (m = 'hi') => `<svg viewBox="0 0 120 150" class="kc-svg" role="img" aria-label="Raka, maskot siswa SMP"><defs>
    <radialGradient id="kcK" cx=".4" cy=".3"><stop offset="0" stop-color="#ffe3c7"/><stop offset="1" stop-color="#eeb07f"/></radialGradient>
    <linearGradient id="kcB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#d6e4ff"/></linearGradient>
    <linearGradient id="kcN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f6bed"/><stop offset="1" stop-color="#27399e"/></linearGradient></defs>
    <ellipse cx="60" cy="145" rx="36" ry="5" fill="#0003"/><rect x="24" y="80" width="72" height="48" rx="18" fill="#8b5cf6"/>
    <rect x="42" y="112" width="15" height="30" rx="5" fill="url(#kcN)"/><rect x="63" y="112" width="15" height="30" rx="5" fill="url(#kcN)"/>
    <rect x="38" y="138" width="20" height="8" rx="4" fill="#fff" stroke="#c9c9d6"/><rect x="62" y="138" width="20" height="8" rx="4" fill="#fff" stroke="#c9c9d6"/>
    <rect x="35" y="82" width="50" height="38" rx="14" fill="url(#kcB)" stroke="#c3d3f5"/><path d="M54 84 L60 98 L66 84 Z" fill="#fbbf24"/>
    <circle cx="30" cy="100" r="8" fill="url(#kcK)"/><circle cx="90" cy="100" r="8" fill="url(#kcK)"/><circle cx="60" cy="48" r="31" fill="url(#kcK)"/>
    <path d="M28 48 Q24 14 60 12 Q96 14 92 48 Q82 28 60 30 Q38 28 28 48 Z" fill="#2f2a55"/><path d="M40 20 L46 6 L54 18 L62 4 L68 18 L78 8 L80 24 Z" fill="#2f2a55"/>
    <circle cx="48" cy="48" r="9" fill="#fff" fill-opacity=".35" stroke="#4c1d95" stroke-width="2"/><circle cx="72" cy="48" r="9" fill="#fff" fill-opacity=".35" stroke="#4c1d95" stroke-width="2"/><path d="M57 48 H63" stroke="#4c1d95" stroke-width="2"/>
    <circle cx="48" cy="48" r="4.5" fill="#2b1b12"/><circle cx="72" cy="48" r="4.5" fill="#2b1b12"/><circle cx="50" cy="46" r="1.6" fill="#fff"/><circle cx="74" cy="46" r="1.6" fill="#fff"/>
    <circle cx="38" cy="60" r="4.5" fill="#ff8fa3" opacity=".55"/><circle cx="82" cy="60" r="4.5" fill="#ff8fa3" opacity=".55"/>
    <path d="${mulut[m]}" fill="${m === 'ok' ? '#c2263a' : 'none'}" stroke="#7a2a2a" stroke-width="2.5" stroke-linecap="round"/></svg>`

  const CSS = `
  .kc{font-family:'Nunito',system-ui,sans-serif;color:#1d1740}.kc *{box-sizing:border-box}
  .kc-bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}.kc-chip{background:#fff;border:2px solid #c4b5fd;border-radius:999px;padding:4px 12px;font-weight:800;box-shadow:0 3px 0 #8b5cf6;color:#1d1740}
  .kc-city,.kc-stage{position:relative;border-radius:24px;border:3px solid #fff;box-shadow:0 8px 0 #8b5cf6,0 16px 24px #0003;padding:14px;overflow:hidden}
  .kc-city{background:linear-gradient(#a5d8ff,#e0f2fe 45%,#bbf7d0 45%,#6ee7b7)}.kc-stage{background:linear-gradient(#ede9fe,#e0f2fe 60%,#d1fae5)}
  .kc-city h3{margin:0;font:800 1.6rem 'Baloo 2',sans-serif;color:#4c1d95;text-shadow:0 2px 0 #fff}.kc-city small{font-weight:800;color:#2563eb}
  .kc-row{display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap;margin:8px 0}.kc-g{width:110px;flex:none;animation:kcB 2.4s ease-in-out infinite}.kc-svg{width:100%;height:auto;filter:drop-shadow(0 6px 4px #0003)}
  .kc-say{flex:1;min-width:210px;background:#fff;border:3px solid #1d1740;border-radius:20px;padding:12px 14px;position:relative;box-shadow:0 5px 0 #0002;font-weight:700;line-height:1.45}
  .kc-say:before{content:'';position:absolute;left:-14px;bottom:26px;border:9px solid transparent;border-right:14px solid #1d1740}
  .kc-tag{display:inline-block;font-size:.75rem;font-weight:800;color:#fff;background:#6d28d9;border-radius:999px;padding:1px 10px;margin-bottom:4px}
  .kc-street{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:22px 14px;margin-top:22px;align-items:end}
  .kc-bd{position:relative;border:0;cursor:pointer;color:var(--t,#fff);background:var(--c);font-family:inherit;padding:26px 8px 12px;border-radius:12px 12px 6px 6px;text-align:center;min-height:150px;
    box-shadow:inset -14px 0 0 #0002,inset 0 -10px 0 #0002,0 8px 0 #0003,0 14px 14px #0003;transition:transform .12s}
  .kc-bd:before{content:'';position:absolute;top:-10px;left:-6px;right:-6px;height:14px;border-radius:8px;background:#fff;box-shadow:0 4px 0 #0003}
  .kc-bd:hover:not(:disabled){transform:translateY(-6px)}.kc-bd:disabled{filter:grayscale(.7);cursor:default;opacity:.8}
  .kc-bd .ic{display:block;font-size:2.2rem;filter:drop-shadow(0 3px 2px #0004)}.kc-bd b{display:block;font:800 1rem 'Baloo 2',sans-serif}.kc-bd small{display:block;font-weight:700;font-size:.72rem;opacity:.95;color:inherit}.kc-bd em{position:absolute;top:-30px;right:2px;font-size:1.6rem;font-style:normal;filter:drop-shadow(0 2px 2px #0004)}
  .kc-prog{height:14px;border-radius:99px;background:#fff9;margin-top:16px;overflow:hidden}.kc-prog span{display:block;height:100%;background:linear-gradient(90deg,#8b5cf6,#fbbf24);transition:width .4s}
  .kc-box{margin-top:12px;background:#fff;border:3px solid #c4b5fd;border-radius:20px;padding:12px;box-shadow:0 5px 0 #8b5cf6;color:#1d1740}
  .kc-two{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;margin-top:8px}.kc-two>div{display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center}.kc-two b{width:100%;text-align:center;color:#6d28d9}
  .kc-two .kc-n{touch-action:none;cursor:grab}.kc-ghost{position:fixed;z-index:9999;pointer-events:none;transform:scale(1.15) rotate(-5deg);background:#ffe28a}
  .kc-n,.kc-o,.kc-b{font:800 1.05rem 'Nunito',sans-serif;border:0;border-radius:14px;cursor:pointer}
  .kc-n{min-width:48px;padding:9px 12px;background:#ede9fe;color:#1d1740;box-shadow:0 4px 0 #a78bfa}.kc-n.on,.kc-o.on{background:#fbbf24;box-shadow:0 4px 0 #d99a00}
  .kc-o{padding:11px 16px;background:#e0f2fe;color:#1d1740;box-shadow:0 4px 0 #60a5fa}.kc-mc{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
  .kc-b{padding:11px 18px;color:#fff;background:#6d28d9;box-shadow:0 5px 0 #4c1d95}.kc-b:active{transform:translateY(4px);box-shadow:0 1px 0 #4c1d95}.kc-b.g{background:#10b981;box-shadow:0 5px 0 #047857}
  .kc-pairs{margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;justify-content:center;min-height:30px}.kc-pr{background:#d1fae5;border:2px solid #10b981;border-radius:999px;padding:2px 10px;font-weight:800;cursor:pointer}
  .kc-dg{width:100%;max-width:320px;display:block;margin:0 auto}.kc-gr{width:100%;max-width:300px;display:block;margin:0 auto;background:#faf8ff;border-radius:14px;user-select:none;-webkit-user-select:none}.kc-st{text-align:center;font-weight:700;font-size:.9rem;margin:8px 0 0;color:#4c1d95}
  .kc-fac{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;font-weight:800;margin-bottom:10px}.kc-mach{background:linear-gradient(160deg,#6ee7b7,#10b981);color:#fff;border-radius:16px;padding:8px 16px;box-shadow:0 6px 0 #047857;text-align:center}.kc-mach b{display:block;font-family:'Baloo 2',sans-serif}
  .kc-tb{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}.kc-tb label{font-weight:800}
  .kc-i{width:90px;text-align:center;font:800 1.3rem 'Baloo 2',sans-serif;border:3px solid #8b5cf6;border-radius:12px;background:#f5f3ff;color:#1d1740;padding:4px}.kc-fac+.kc-i{display:block;margin:0 auto}
  .kc-res{margin-top:12px;border-radius:14px;padding:10px 12px;font-weight:700}.kc-res.ok{background:#10b98122;border:2px solid #10b981}.kc-res.no{background:#e11d4822;border:2px solid #e11d48}
  .kc-coin{position:absolute;right:18px;top:20px;font-size:2rem;animation:kcC 1s ease-out forwards;pointer-events:none}
  @keyframes kcB{50%{transform:translateY(-6px)}}@keyframes kcC{to{transform:translateY(-50px) scale(1.5);opacity:0}}
  @media(max-width:520px){.kc-g{width:80px}.kc-say:before{display:none}}@media(prefers-reduced-motion:reduce){.kc *{animation:none!important;transition:none!important}}`
  if (!document.getElementById('kc-css')) document.head.insertAdjacentHTML('beforeend', `<style id="kc-css">${CSS}</style>`)

  /* ---------- Alur permainan ---------- */
  function mulai(el) {
    if (!el) return
    const P = {}; let koin = 0
    const lulus = a => (P[a.k] || 0) >= a.lulus
    const chips = (ekstra = '') => `<div class="kc-bar"><span class="kc-chip">🏙️ Level ${1 + AREA.filter(lulus).length}</span><span class="kc-chip">🏅 ${AREA.filter(lulus).length}/5 badge</span><span class="kc-chip">🪙 ${koin}</span>${ekstra}</div>`

    function kota() {
      const nb = AREA.filter(lulus).length, buka = AREA.slice(0, 4).every(lulus)
      el.innerHTML = `<div class="kc">${chips()}<div class="kc-city"><h3>🏙️ Connection City</h3><small>Explore • Connect • Discover</small>
        <div class="kc-row"><div class="kc-g">${guide('hi')}</div><div class="kc-say"><span class="kc-tag">Raka, pemandu kota</span><br>Selamat datang di Connection City! Kunjungi tiap gedung, selesaikan tantangannya, dan kumpulkan <b>badge</b>. Challenge Center terbuka setelah 4 area pertama selesai.</div></div>
        <div class="kc-street">${AREA.map(a => { const lock = a.k === 'center' && !buka; return `<button class="kc-bd" style="--c:${a.c};--t:${a.t}" data-k="${a.k}" ${lock ? 'disabled' : ''}>${lulus(a) ? '<em>🏅</em>' : ''}<span class="ic">${a.e}</span><b>${a.n}</b><small>${lock ? '🔒 Selesaikan 4 area dulu' : a.jud}</small></button>` }).join('')}</div>
        <div class="kc-prog" role="progressbar" aria-valuenow="${nb * 20}" aria-valuemin="0" aria-valuemax="100"><span style="width:${nb * 20}%"></span></div></div></div>`
      el.querySelectorAll('.kc-bd').forEach(b => b.onclick = () => main(AREA.find(a => a.k === b.dataset.k)))
    }

    function main(a) {
      const rounds = GEN[a.k](), tot = rounds.length; let i = 0, benar = 0, streak = 0, dapat = 0
      const show = () => { const r = rounds[i]
        el.innerHTML = `<div class="kc">${chips(`<span class="kc-chip">${a.e} ${a.n} · ${i + 1}/${tot}</span><span class="kc-chip">⭐ ${benar}</span>`)}<div class="kc-stage"><div class="kc-row"><div class="kc-g" id="kcG">${guide('hi')}</div><div class="kc-say"><span class="kc-tag">${a.n}</span><br>${esc(r.q)}</div></div>
          <div class="kc-box" id="kcBox"></div><p style="text-align:right;margin:12px 0 0"><button class="kc-b" id="kcCek">✅ Periksa jawaban</button></p><div id="kcRes"></div></div></div>`
        const box = document.getElementById('kcBox'), cek = r.build(box)
        document.getElementById('kcCek').onclick = ev => { const ok = !!cek(); ev.target.remove(); box.style.pointerEvents = 'none'
          if (ok) { benar++; streak++; const g = 10 + (streak > 1 ? 5 : 0); koin += g; dapat += g } else streak = 0
          document.getElementById('kcG').innerHTML = guide(ok ? 'ok' : 'sad')
          document.getElementById('kcRes').innerHTML = `<div class="kc-res ${ok ? 'ok' : 'no'}"><b>${ok ? '🎉 Tepat! Koneksi berhasil.' : '😅 Belum tepat.'}</b><br>${esc(r.exp)}</div><p style="text-align:right;margin:10px 0 0"><button class="kc-b g" id="kcNext">${i < tot - 1 ? 'Ronde berikutnya →' : 'Lihat hasil 🏆'}</button></p>`
          if (ok) document.querySelector('.kc-stage').insertAdjacentHTML('beforeend', '<span class="kc-coin">🪙</span>')
          document.getElementById('kcNext').onclick = () => { i++; i < tot ? show() : akhir() } } }
      async function akhir() { const lolos = benar >= a.lulus; P[a.k] = Math.max(P[a.k] || 0, benar)
        el.innerHTML = `<div class="kc">${chips()}<div class="kc-stage"><div class="kc-row"><div class="kc-g">${guide(lolos ? 'ok' : 'sad')}</div><div class="kc-say"><span class="kc-tag">Raka</span><br>${lolos ? `Hebat! Badge <b>${a.n}</b> kamu dapatkan 🏅` : 'Belum lulus. Baca lagi materinya lalu coba lagi, kamu pasti bisa!'}</div></div>
          <div class="kc-box" style="text-align:center"><b style="font-size:1.2rem">${benar} dari ${tot} benar · 🪙 +${dapat}</b><div id="kcXp" style="margin-top:6px;font-size:.9rem">Menyimpan hasil...</div><p><button class="kc-b g" id="kcBack">🏙️ Kembali ke kota</button> <button class="kc-b" id="kcAgain">🔄 Ulangi area ini</button></p></div></div></div>`
        document.getElementById('kcBack').onclick = kota; document.getElementById('kcAgain').onclick = () => main(a)
        try { const { data, error } = await db.rpc('simpan_kota', { p_area: a.k, p_benar: benar, p_total: tot, p_koin: dapat })
          const x = document.getElementById('kcXp'); if (x) x.textContent = error ? 'Hasil belum tersimpan (jalankan mathquest-kota.sql di Supabase). Game tetap bisa dimainkan.' : `Hasil tersimpan. Total XP kamu: ${data}.`
        } catch (e) { const x = document.getElementById('kcXp'); if (x) x.textContent = 'Hasil belum tersimpan.' } }
      show()
    }

    kota()
    ;(async () => { try { const { data } = await db.from('hasil_kota').select('area,benar'); (data || []).forEach(r => { P[r.area] = Math.max(P[r.area] || 0, r.benar) }); if (el.querySelector('.kc-street')) kota() } catch (e) {} })()
  }
  window.ConnectionCity = { mulai }
})()

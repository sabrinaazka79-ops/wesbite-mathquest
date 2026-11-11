/* Math Market - game edukasi Materi 3 (PLSV & PTLSV). Gaya 3D cartoon, tanpa gambar/aset eksternal.
   Dipanggil dari materi3.js: MathMarket.mulai(elemen). Hasil disimpan lewat RPC simpan_market (mathquest-market.sql).
   Jika SQL belum dijalankan, game tetap jalan; hanya penyimpanan XP yang dilewati. */
(function () {
  'use strict'
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1))
  const pick = a => a[Math.floor(Math.random() * a.length)]
  const rp = v => 'Rp' + v + '.000'
  const esc = t => { const d = document.createElement('div'); d.textContent = t ?? ''; return d.innerHTML }
  const ITEM = [['📓', 'buku tulis'], ['✏️', 'pensil'], ['🍞', 'roti'], ['🥛', 'susu kotak'], ['🍎', 'apel'], ['🧃', 'jus'], ['🍪', 'biskuit'], ['🖍️', 'krayon']]
  const cut = n => Number(n.toFixed(2))

  /* ---------- Bank misi: dibangkitkan acak, jawabannya selalu bilangan bulat ---------- */
  const PLSV = [
    () => { const [e, n] = pick(ITEM), k = R(3, 8), x = R(2, 12), T = k * x
      return { e, q: `Kamu membeli ${k} ${n} dengan total ${rp(T)}. Berapa harga satu ${n}?`, eq: `${k}x = ${T}`, ans: x, pre: 'Rp', suf: '.000',
        shelf: Array(Math.min(k, 6)).fill([e, '?']), L: [`Misalkan harga satu ${n} = x (ribu rupiah).`, `${k}x = ${T}`, `x = ${T} ÷ ${k} = ${x}`], fin: `Harga satu ${n} = ${rp(x)}` } },
    () => { const [e, n] = pick(ITEM), k = R(2, 6), x = R(3, 12), b = R(2, 8), T = k * x + b
      return { e, q: `Kamu membeli ${k} ${n} dan 1 tas belanja seharga ${rp(b)}. Total bayar ${rp(T)}. Berapa harga satu ${n}?`, eq: `${k}x + ${b} = ${T}`, ans: x, pre: 'Rp', suf: '.000',
        shelf: [...Array(Math.min(k, 5)).fill([e, '?']), ['🛍️', rp(b)]], L: [`Misalkan harga satu ${n} = x.`, `${k}x + ${b} = ${T}`, `${k}x = ${T} − ${b} = ${T - b}`, `x = ${T - b} ÷ ${k} = ${x}`], fin: `Harga satu ${n} = ${rp(x)}` } },
    () => { const [e, n] = pick(ITEM), h = R(3, 9), k = R(3, 9), K = R(1, 9), U = h * k + K
      return { e, q: `Satu ${n} harganya ${rp(h)}. Kamu membayar ${rp(U)} dan menerima kembalian ${rp(K)}. Berapa ${n} yang kamu beli?`, eq: `${h}n + ${K} = ${U}`, ans: k, pre: '', suf: 'buah',
        shelf: [[e, rp(h)], ['💵', rp(U)], ['🪙', 'kembali ' + rp(K)]], L: [`Misalkan banyak ${n} = n.`, `${h}n + ${K} = ${U}`, `${h}n = ${U} − ${K} = ${U - K}`, `n = ${U - K} ÷ ${h} = ${k}`], fin: `Kamu membeli ${k} ${n}` } },
    () => { const p = R(2, 4), x = R(2, 8), d = R(1, 5), T = p * x + x + d
      return { e: '🍞', q: `Roti harganya x. Susu kotak ${rp(d)} lebih mahal dari roti. ${p} roti dan 1 susu kotak harganya ${rp(T)}. Berapa harga satu roti?`, eq: `${p}x + (x + ${d}) = ${T}`, ans: x, pre: 'Rp', suf: '.000',
        shelf: [...Array(p).fill(['🍞', 'x']), ['🥛', 'x + ' + d]], L: [`Roti = x, susu = x + ${d}.`, `${p}x + (x + ${d}) = ${T}`, `${p + 1}x + ${d} = ${T}`, `${p + 1}x = ${T - d}`, `x = ${T - d} ÷ ${p + 1} = ${x}`], fin: `Harga satu roti = ${rp(x)}` } }
  ]
  const PTLSV = [
    () => { const [e, n] = pick(ITEM), h = R(3, 9), b = R(2, 8), k = R(3, 9), B = h * k + b + R(0, h - 1), l = cut((B - b) / h)
      return { e, q: `Uangmu ${rp(B)}. Kamu harus membeli 1 tas belanja ${rp(b)}, sisanya ${n} seharga ${rp(h)}. Paling banyak berapa ${n} yang bisa dibeli?`, eq: `${h}n + ${b} ≤ ${B}`, ans: k, pre: '', suf: 'buah',
        calc: n => h * n + b, lim: B, ok: v => v <= B, okT: 'Masih cukup ✅', noT: 'Melebihi anggaran ❌', shelf: [[e, rp(h)], ['🛍️', rp(b)], ['👛', rp(B)]],
        L: [`Misalkan banyak ${n} = n.`, `${h}n + ${b} ≤ ${B}`, `${h}n ≤ ${B - b}`, `n ≤ ${B - b} ÷ ${h} = ${l}`, `n bilangan bulat, jadi paling banyak ${k}.`], fin: `Maksimal ${k} ${n}` } },
    () => { const w = R(2, 6), w0 = R(5, 15), k = R(4, 12), C = w * k + w0 + R(0, w - 1), l = cut((C - w0) / w)
      return { e: '📦', q: `Troli belanja beratnya ${w0} kg dan kuat menampung beban total ${C} kg. Setiap kardus berat ${w} kg. Paling banyak berapa kardus yang boleh dimasukkan?`, eq: `${w}n + ${w0} ≤ ${C}`, ans: k, pre: '', suf: 'kardus',
        calc: n => w * n + w0, lim: C, ok: v => v <= C, okT: 'Troli masih kuat ✅', noT: 'Troli kelebihan beban ❌', shelf: [['📦', w + ' kg'], ['🛒', w0 + ' kg'], ['⚖️', 'maks ' + C + ' kg']],
        L: [`Misalkan banyak kardus = n.`, `${w}n + ${w0} ≤ ${C}`, `${w}n ≤ ${C - w0}`, `n ≤ ${C - w0} ÷ ${w} = ${l}`, `n bilangan bulat, jadi paling banyak ${k}.`], fin: `Maksimal ${k} kardus` } },
    () => { const [e, n] = pick(ITEM), h = R(4, 9), k = R(3, 8), M = h * (k - 1) + R(1, h - 1), l = cut(M / h)
      return { e, q: `Toko memberi GRATIS ONGKIR untuk belanja minimal ${rp(M)}. Satu ${n} harganya ${rp(h)}. Paling sedikit berapa ${n} yang harus dibeli?`, eq: `${h}n ≥ ${M}`, ans: k, pre: '', suf: 'buah',
        calc: n => h * n, lim: M, ok: v => v >= M, okT: 'Gratis ongkir ✅', noT: 'Belum cukup ❌', shelf: [[e, rp(h)], ['🚚', 'min ' + rp(M)]],
        L: [`Misalkan banyak ${n} = n.`, `${h}n ≥ ${M}`, `n ≥ ${M} ÷ ${h} = ${l}`, `n bilangan bulat, jadi paling sedikit ${k}.`], fin: `Minimal ${k} ${n}` } },
    () => { const [e, n] = pick(ITEM), s = R(2, 4), q = R(2, 5), h = R(3, 8), k = R(3, 8), b = s * q, B = h * k + b + R(0, h - 1), l = cut((B - b) / h)
      return { e, q: `Anggaranmu ${rp(B)}. Kamu sudah mengambil ${q} pensil warna @${rp(s)}. Sisanya untuk ${n} seharga ${rp(h)}. Paling banyak berapa ${n} yang bisa dibeli?`, eq: `${h}n + ${s}·${q} ≤ ${B}`, ans: k, pre: '', suf: 'buah',
        calc: n => h * n + b, lim: B, ok: v => v <= B, okT: 'Masih cukup ✅', noT: 'Melebihi anggaran ❌', shelf: [[e, rp(h)], ...Array(Math.min(q, 4)).fill(['🖍️', rp(s)])],
        L: [`Misalkan banyak ${n} = n. Pensil warna = ${q} × ${s} = ${b}.`, `${h}n + ${b} ≤ ${B}`, `${h}n ≤ ${B - b}`, `n ≤ ${B - b} ÷ ${h} = ${l}`, `n bilangan bulat, jadi paling banyak ${k}.`], fin: `Maksimal ${k} ${n}` } }
  ]
  const TOKO = [['Toko Alat Tulis', '#ff5d73'], ['Warung Roti', '#ff9f1c'], ['Mini Market', '#2ec4b6'], ['Kasir Anggaran', '#6c4cf1'], ['Gudang Diskon', '#0ea5e9'], ['Super Market Besar', '#ec4899']]
  const mix = a => a.map(f => [Math.random(), f]).sort((x, y) => x[0] - y[0]).map(x => x[1])
  const buatSesi = () => [...mix(PLSV).slice(0, 3).map(f => ({ t: 'PLSV', ...f() })), ...mix(PTLSV).slice(0, 3).map(f => ({ t: 'PTLSV', ...f() }))]

  /* ---------- Tokoh pemandu: siswa SMP (SVG dengan gradien agar tampak 3D) ---------- */
  const mulut = { hi: 'M48 60 Q60 70 72 60', ok: 'M46 58 Q60 76 74 58 Z', sad: 'M50 66 Q60 58 70 66' }
  const guide = (m = 'hi') => `<svg viewBox="0 0 120 150" class="mm-svg" aria-label="Nadia, siswa SMP pemandu belanja" role="img"><defs>
    <radialGradient id="mmK" cx=".4" cy=".3"><stop offset="0" stop-color="#ffe6cc"/><stop offset="1" stop-color="#f2b283"/></radialGradient>
    <linearGradient id="mmB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#d9e6ff"/></linearGradient>
    <linearGradient id="mmR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b5bdb"/><stop offset="1" stop-color="#1e3a9f"/></linearGradient>
    <radialGradient id="mmH" cx=".4" cy=".2"><stop offset="0" stop-color="#7b4a2a"/><stop offset="1" stop-color="#3d2312"/></radialGradient></defs>
    <ellipse cx="60" cy="145" rx="36" ry="5" fill="#0003"/><rect x="26" y="82" width="68" height="46" rx="18" fill="#ff7a59"/>
    <rect x="44" y="124" width="12" height="18" rx="5" fill="url(#mmK)"/><rect x="64" y="124" width="12" height="18" rx="5" fill="url(#mmK)"/>
    <rect x="40" y="138" width="18" height="8" rx="4" fill="#fff" stroke="#c9c9d6"/><rect x="62" y="138" width="18" height="8" rx="4" fill="#fff" stroke="#c9c9d6"/>
    <path d="M36 112 L84 112 L92 132 L28 132 Z" fill="url(#mmR)"/><rect x="36" y="82" width="48" height="36" rx="14" fill="url(#mmB)" stroke="#c3d3f5"/>
    <path d="M54 84 L60 98 L66 84 Z" fill="#d93a4a"/><circle cx="31" cy="100" r="8" fill="url(#mmK)"/><circle cx="89" cy="100" r="8" fill="url(#mmK)"/>
    <circle cx="96" cy="40" r="13" fill="url(#mmH)"/><circle cx="60" cy="48" r="31" fill="url(#mmK)"/>
    <path d="M28 46 Q30 16 60 16 Q90 16 92 46 Q78 30 60 32 Q42 30 28 46 Z" fill="url(#mmH)"/>
    <circle cx="48" cy="48" r="5" fill="#2b1b12"/><circle cx="72" cy="48" r="5" fill="#2b1b12"/><circle cx="50" cy="46" r="1.8" fill="#fff"/><circle cx="74" cy="46" r="1.8" fill="#fff"/>
    <circle cx="40" cy="58" r="5" fill="#ff8fa3" opacity=".6"/><circle cx="80" cy="58" r="5" fill="#ff8fa3" opacity=".6"/>
    <path d="${mulut[m]}" fill="${m === 'ok' ? '#c2263a' : 'none'}" stroke="#7a2a2a" stroke-width="2.5" stroke-linecap="round"/></svg>`

  const CSS = `
  .mm{font-family:'Nunito',system-ui,sans-serif;color:#1d1740}
  .mm *{box-sizing:border-box}
  .mm-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between;margin-bottom:10px;color:var(--ink,#1d1740)}
  .mm-chip{background:#fff;border:2px solid #ffd166;border-radius:999px;padding:4px 12px;font-weight:800;box-shadow:0 3px 0 #e0a800;color:#1d1740}
  .mm-scene{position:relative;border-radius:24px;overflow:hidden;border:3px solid #fff;box-shadow:0 8px 0 #7aa2e8,0 16px 24px #0003;background:linear-gradient(#8fd3ff,#d8f3ff 55%,#ffe9a8 55%,#ffd27a);padding:0 12px 14px;min-height:340px}
  .mm-awn{height:46px;margin:0 -12px 12px;background:repeating-linear-gradient(90deg,var(--ac) 0 34px,#fff 34px 68px);border-bottom:6px solid #0002;box-shadow:0 6px 0 #0001;display:flex;align-items:center;justify-content:center;
    -webkit-mask:radial-gradient(circle 17px at 17px 100%,#0000 98%,#000) 0 0/34px 100%;mask:radial-gradient(circle 17px at 17px 100%,#0000 98%,#000) 0 0/34px 100%}
  .mm-nm{position:absolute;top:8px;left:50%;transform:translateX(-50%);background:#fff;border:3px solid var(--ac);border-radius:12px;padding:1px 14px;font:800 1.05rem 'Baloo 2',sans-serif;box-shadow:0 3px 0 #0003;white-space:nowrap;z-index:2;color:#1d1740}
  .mm-row{display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap}
  .mm-g{width:120px;flex:none;animation:mmB 2.4s ease-in-out infinite}.mm-svg{width:100%;height:auto;filter:drop-shadow(0 6px 4px #0003)}
  .mm-say{flex:1;min-width:220px;background:#fff;border:3px solid #1d1740;border-radius:20px;padding:12px 14px;position:relative;box-shadow:0 5px 0 #0002;font-weight:700;line-height:1.45}
  .mm-say:before{content:'';position:absolute;left:-14px;bottom:26px;border:9px solid transparent;border-right:14px solid #1d1740}
  .mm-tag{display:inline-block;font-size:.75rem;font-weight:800;color:#fff;background:var(--ac);border-radius:999px;padding:1px 10px;margin-bottom:4px}
  .mm-shelf{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:14px 10px 18px;margin-top:14px;border-radius:14px;background:linear-gradient(#d9a066,#b9773c);box-shadow:0 8px 0 #8a5528,inset 0 4px 0 #ecc08b}
  .mm-it{width:84px;padding:8px 4px 6px;text-align:center;background:linear-gradient(160deg,#fff,#fff1c2);border-radius:18px;box-shadow:0 6px 0 #e0a800,0 12px 12px #0004;transform:perspective(400px) rotateX(10deg);animation:mmF 2.6s ease-in-out infinite alternate;color:#1d1740}
  .mm-it:nth-child(2n){animation-delay:.5s}.mm-it:nth-child(3n){animation-delay:1s}
  .mm-it b{display:block;font-size:2rem;line-height:1.2;filter:drop-shadow(0 3px 2px #0003)}.mm-it small{display:block;font-weight:800;background:#ff5d73;color:#fff;border-radius:8px;margin:2px 6px 0;font-size:.72rem;padding:1px 2px}
  .mm-pan{margin-top:14px;background:#fff;border:3px solid #ffd166;border-radius:20px;padding:14px;box-shadow:0 6px 0 #e0a800;color:#1d1740}
  .mm-in{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .mm-in input{width:96px!important;text-align:center;font:800 1.4rem 'Baloo 2',sans-serif!important;border:3px solid #6c4cf1!important;border-radius:14px!important;background:#f4f1ff!important;color:#1d1740!important}
  .mm-b{font:800 1rem 'Nunito',sans-serif;border:0;border-radius:14px;padding:11px 18px;cursor:pointer;color:#fff;background:#6c4cf1;box-shadow:0 5px 0 #4a30c4;transition:transform .08s}
  .mm-b:active{transform:translateY(4px);box-shadow:0 1px 0 #4a30c4}.mm-b.g{background:#16a36a;box-shadow:0 5px 0 #0d7a4e}.mm-b.o{background:#ff7a59;box-shadow:0 5px 0 #d9532f}.mm-b:disabled{opacity:.5;cursor:default}
  .mm-meter{height:16px;border-radius:99px;background:#e0daf7;overflow:hidden;margin:8px 0 4px}.mm-meter i{display:block;height:100%;background:#16a36a;transition:width .3s}.mm-meter i.x{background:#d93a4a}
  .mm-res{margin-top:12px;border-radius:14px;padding:10px 12px;font-weight:700}.mm-res.ok{background:#16a36a22;border:2px solid #16a36a}.mm-res.no{background:#d93a4a22;border:2px solid #d93a4a}
  .mm-res ol{margin:6px 0 6px 18px;padding:0}.mm-eqn{font-family:monospace;background:#f4f1ff;border-radius:8px;padding:1px 8px;font-weight:800}
  .mm-stars{font-size:2.6rem;letter-spacing:6px;text-align:center;filter:drop-shadow(0 4px 2px #0003)}
  .mm-coin{position:absolute;right:16px;top:60px;font-size:2rem;animation:mmC 1s ease-out forwards;pointer-events:none}
  @keyframes mmB{50%{transform:translateY(-6px)}}@keyframes mmF{to{transform:perspective(400px) rotateX(10deg) translateY(-5px)}}@keyframes mmC{to{transform:translateY(-60px) scale(1.5);opacity:0}}
  @media(max-width:520px){.mm-g{width:84px}.mm-say:before{display:none}}
  @media(prefers-reduced-motion:reduce){.mm *{animation:none!important}}`
  if (!document.getElementById('mm-css')) document.head.insertAdjacentHTML('beforeend', `<style id="mm-css">${CSS}</style>`)

  /* ---------- Alur permainan ---------- */
  function mulai(el) {
    if (!el) return
    let S = [], i = 0, benar = 0, koin = 0, streak = 0, coba = 3, petunjuk = false

    const scene = (m, mood, isi) => `<div class="mm"><div class="mm-bar"><span class="mm-chip">🛒 Misi ${i + 1}/6</span><span class="mm-chip">⭐ ${benar} benar</span><span class="mm-chip">🪙 ${koin}</span></div>
      <div class="mm-scene" style="--ac:${m.c}"><div class="mm-awn"></div><div class="mm-nm">${esc(m.nama)}</div>${isi}</div></div>`

    function intro() {
      el.innerHTML = `<div class="mm"><div class="mm-scene" style="--ac:#ff5d73"><div class="mm-awn"></div><div class="mm-nm">🛒 Math Market</div>
        <div class="mm-row"><div class="mm-g">${guide('hi')}</div><div class="mm-say"><span class="mm-tag">Nadia, pemandu belanja</span><br>Hai, aku Nadia! Ayo belanja sambil berhitung. Ada <b>6 misi</b>: 3 misi <b>PLSV</b> untuk mencari harga atau jumlah barang, lalu 3 misi <b>PTLSV</b> untuk anggaran, kapasitas, dan batas minimal. Tulis jawabanmu lalu bayar di kasir. Tanpa batas waktu!</div></div>
        <div style="text-align:center;margin-top:16px"><button class="mm-b g" id="mmGo">🛍️ Mulai belanja</button></div></div></div>`
      document.getElementById('mmGo').onclick = () => { S = buatSesi().map((m, n) => ({ ...m, nama: TOKO[n][0], c: TOKO[n][1] })); i = 0; benar = 0; koin = 0; streak = 0; misi() }
    }

    function misi() {
      const m = S[i]; coba = 3; petunjuk = false
      el.innerHTML = scene(m, 'hi', `<div class="mm-row"><div class="mm-g" id="mmG">${guide('hi')}</div>
        <div class="mm-say"><span class="mm-tag">${m.t === 'PLSV' ? 'PLSV · cari nilai' : 'PTLSV · batas'}</span><br>${esc(m.q)}</div></div>
        <div class="mm-shelf">${m.shelf.map(([e, l]) => `<div class="mm-it"><b>${e}</b><small>${esc(l)}</small></div>`).join('')}</div>
        <div class="mm-pan"><div class="mm-in"><b>Jawabanmu:</b>${m.pre ? `<b>${m.pre}</b>` : ''}<input id="mmA" type="number" inputmode="numeric" min="0" max="999" aria-label="Jawaban">${m.suf ? `<b>${m.suf}</b>` : ''}
          <button class="mm-b g" id="mmBayar">💳 Bayar di kasir</button></div>
          <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">${m.calc ? '<button class="mm-b o" id="mmCoba">🛒 Coba di keranjang (sisa 3)</button>' : ''}<button class="mm-b" id="mmHint">💡 Petunjuk (−5 koin)</button></div>
          <div id="mmInfo"></div></div>`)
      const a = document.getElementById('mmA'), info = document.getElementById('mmInfo')
      a.focus(); a.onkeydown = ev => { if (ev.key === 'Enter') bayar() }
      document.getElementById('mmBayar').onclick = bayar
      document.getElementById('mmHint').onclick = () => { if (!petunjuk) { petunjuk = true; koin = Math.max(0, koin - 5) } info.innerHTML = `<div class="mm-res ok">💡 Model matematika: <span class="mm-eqn">${esc(m.eq)}</span><br>Selesaikan dulu langkah demi langkah, lalu tulis nilai n atau x-nya.</div>` }
      if (m.calc) document.getElementById('mmCoba').onclick = ev => {
        const v = a.value; if (v === '' || coba <= 0) return info.innerHTML = '<div class="mm-res no">' + (coba <= 0 ? 'Kesempatan mencoba habis. Hitung pakai pertidaksamaan ya!' : 'Isi jumlah dulu.') + '</div>'
        coba--; ev.target.textContent = `🛒 Coba di keranjang (sisa ${coba})`
        const tot = m.calc(+v), ok = m.ok(tot)
        info.innerHTML = `<div class="mm-meter"><i class="${ok ? '' : 'x'}" style="width:${Math.min(100, 100 * tot / m.lim)}%"></i></div><div class="mm-res ${ok ? 'ok' : 'no'}">Total keranjang ${tot} dari batas ${m.lim}: ${ok ? m.okT : m.noT}</div>`
      }
    }

    function bayar() {
      const m = S[i], v = document.getElementById('mmA').value
      if (v === '') return document.getElementById('mmInfo').innerHTML = '<div class="mm-res no">Tulis jawabanmu dulu ya.</div>'
      const ok = +v === m.ans
      if (ok) { benar++; streak++; koin += 10 + (streak > 1 ? 5 : 0) } else streak = 0
      document.getElementById('mmG').innerHTML = guide(ok ? 'ok' : 'sad')
      document.getElementById('mmA').disabled = true; document.getElementById('mmBayar').disabled = true
      document.getElementById('mmInfo').innerHTML = `<div class="mm-res ${ok ? 'ok' : 'no'}"><b>${ok ? '🎉 Tepat! Pembayaran berhasil.' : '😅 Belum tepat. Jawaban yang benar: ' + m.ans + (m.suf ? ' ' + m.suf : '') + '.'}</b>
        <ol>${m.L.map(l => `<li>${esc(l)}</li>`).join('')}</ol><b>${esc(m.fin)}</b></div>
        <p style="text-align:right;margin:10px 0 0"><button class="mm-b g" id="mmNext">${i < 5 ? 'Misi berikutnya →' : 'Lihat hasil 🏆'}</button></p>`
      if (ok) document.querySelector('.mm-scene').insertAdjacentHTML('beforeend', '<span class="mm-coin">🪙</span>')
      document.getElementById('mmNext').onclick = () => { i++; i < 6 ? misi() : akhir() }
    }

    async function akhir() {
      const bin = benar >= 5 ? 3 : benar >= 3 ? 2 : benar >= 1 ? 1 : 0
      el.innerHTML = `<div class="mm"><div class="mm-scene" style="--ac:#16a36a"><div class="mm-awn"></div><div class="mm-nm">Struk Belanja</div>
        <div class="mm-row"><div class="mm-g">${guide(bin ? 'ok' : 'sad')}</div><div class="mm-say"><span class="mm-tag">Nadia</span><br>${bin === 3 ? 'Luar biasa! Kamu jago PLSV dan PTLSV!' : bin >= 1 ? 'Bagus! Latih lagi supaya makin lancar.' : 'Jangan menyerah. Baca lagi materinya, lalu coba lagi ya!'}</div></div>
        <div class="mm-stars">${'⭐'.repeat(bin)}${'☆'.repeat(3 - bin)}</div>
        <div class="mm-pan" style="text-align:center"><b style="font-size:1.2rem">${benar} dari 6 misi benar · 🪙 ${koin} koin</b><div id="mmXp" class="kecil" style="margin-top:6px">Menyimpan hasil...</div>
          <p><button class="mm-b g" id="mmUlang">🔄 Belanja lagi (misi baru)</button></p></div></div></div>`
      document.getElementById('mmUlang').onclick = intro
      try {
        const { data, error } = await db.rpc('simpan_market', { p_benar: benar, p_total: 6, p_koin: koin, p_bintang: bin })
        document.getElementById('mmXp').textContent = error ? 'Hasil belum tersimpan (jalankan mathquest-market.sql di Supabase). Game tetap bisa dimainkan.' : `Hasil tersimpan. Total XP kamu: ${data}.`
      } catch (e) { const x = document.getElementById('mmXp'); if (x) x.textContent = 'Hasil belum tersimpan.' }
    }
    intro()
  }
  window.MathMarket = { mulai }
})()

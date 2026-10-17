/* MathQuest - Editor rumus ala "Equation" di Word, untuk materi, latihan soal, kuis, dan game.
   Cara pakai: klik di kolom teks (isi materi, pertanyaan, pilihan jawaban, pembahasan). Di kanan kolom
   muncul tombol "∑ Rumus". Klik, tulis rumus secara visual, lalu klik "Sisipkan".
   Rumus disimpan sebagai teks \( ... \) dan otomatis tampil rapi saat materi/soal dibaca atau dikerjakan.
   Pustaka dimuat dari internet hanya saat dibutuhkan: MathLive (editor) dan KaTeX (tampilan). */
(function () {
  'use strict'

  /* Kolom yang boleh diberi rumus (kolom kode, pencarian, dan jawaban singkat sengaja tidak termasuk) */
  const BOLEH = '#kq-f-isi, #kq-f-rumus, .s-q, .s-o, .s-p, textarea[data-f="q"], input[data-f="opsi"], textarea[data-f="pemb"]'

  /* ---------- pemuat pustaka ---------- */
  const KATEX = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/'
  const MATHLIVE = ['https://cdn.jsdelivr.net/npm/mathlive@0.101.0', 'https://cdn.jsdelivr.net/npm/mathlive']
  const janji = {}

  function skrip(src) {
    return new Promise((ok, gagal) => {
      const s = document.createElement('script')
      s.src = src; s.onload = ok; s.onerror = () => gagal(new Error('gagal memuat ' + src))
      document.head.appendChild(s)
    })
  }
  function muatKatex() {
    if (janji.katex) return janji.katex
    const css = document.createElement('link')
    css.rel = 'stylesheet'; css.href = KATEX + 'katex.min.css'
    document.head.appendChild(css)
    return janji.katex = skrip(KATEX + 'katex.min.js').then(() => skrip(KATEX + 'contrib/auto-render.min.js'))
  }
  function muatMathlive() {
    if (janji.ml) return janji.ml
    return janji.ml = (async () => {
      for (const u of MATHLIVE) {
        try { await skrip(u); if (customElements.get('math-field')) return } catch (e) {}
      }
      janji.ml = null
      throw new Error('Editor rumus tidak bisa dimuat. Cek koneksi internet lalu coba lagi.')
    })()
  }

  /* ---------- gaya ---------- */
  const st = document.createElement('style')
  st.textContent = `
    :root{--keyboard-zindex:2147483600}
    .mqr-fab{position:fixed;z-index:2147483000;height:28px;padding:0 10px;font:800 13px/28px Nunito,system-ui,sans-serif;border-radius:9px;border:0;cursor:pointer;background:#6c4df0;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.25)}
    .mqr-fab[hidden],.mqr-panel[hidden]{display:none}
    .mqr-pad{padding-right:92px!important}
    .mqr-panel{--k-ink:#1d1b4b;--k-card:#fff;--k-line:#dcd6f7;--k-soft:#f4f1ff;--k-pri:#6c4df0;
      position:fixed;z-index:2147483100;left:50%;top:10vh;transform:translateX(-50%);width:min(580px,94vw);box-sizing:border-box;
      padding:16px;border-radius:18px;border:2px solid var(--k-line);background:var(--k-card);color:var(--k-ink);
      font-family:Nunito,system-ui,sans-serif;box-shadow:0 20px 50px rgba(0,0,0,.35)}
    .mqr-panel.gelap{--k-ink:#f1eefe;--k-card:#25224a;--k-line:#3d3a72;--k-soft:#2e2b5c}
    .mqr-panel p{margin:4px 0 10px;font-size:13px;opacity:.8}
    .mqr-mf{display:block;width:100%;box-sizing:border-box;font-size:26px;padding:8px 10px;border-radius:12px;border:2px solid var(--k-line);background:var(--k-soft);color:var(--k-ink)}
    .mqr-act{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
    .mqr-act button{font:800 14px Nunito,system-ui,sans-serif;padding:9px 16px;border-radius:12px;cursor:pointer;border:2px solid var(--k-line);background:var(--k-card);color:var(--k-ink)}
    .mqr-act .mqr-ins{background:var(--k-pri);border-color:var(--k-pri);color:#fff}
    .mqr-msg{color:#d93a4a;font-weight:700;font-size:13px;margin-top:8px;min-height:1em}
    .katex{font-size:1.08em}`
  document.head.appendChild(st)

  /* ---------- tombol melayang + jendela rumus ---------- */
  const fab = document.createElement('button')
  fab.type = 'button'; fab.className = 'mqr-fab'; fab.hidden = true; fab.textContent = '∑ Rumus'
  fab.setAttribute('aria-label', 'Sisipkan rumus')
  const panel = document.createElement('div')
  panel.className = 'mqr-panel'; panel.hidden = true
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Tulis rumus')
  panel.innerHTML = `<b>∑ Tulis rumus</b>
    <p>Ketik <b>^</b> untuk pangkat, <b>/</b> untuk pecahan, <b>sqrt</b> untuk akar, atau klik ikon keyboard di kanan kotak.</p>
    <div class="mqr-slot"></div>
    <div class="mqr-act"><button type="button" class="mqr-ins">Sisipkan ke teks</button><button type="button" class="mqr-x">Batal</button></div>
    <div class="mqr-msg" role="alert"></div>`
  document.body.append(fab, panel)
  const slot = panel.querySelector('.mqr-slot'), pesan = panel.querySelector('.mqr-msg')

  let sasaran = null, a = 0, b = 0, mf = null

  function sembunyi() {
    fab.hidden = true
    document.querySelectorAll('.mqr-pad').forEach(el => el.classList.remove('mqr-pad'))
  }
  function posisi() {
    if (!sasaran || !document.contains(sasaran) || !panel.hidden) return sembunyi()
    const r = sasaran.getBoundingClientRect()
    if (r.bottom < 0 || r.top > innerHeight) { fab.hidden = true; return }
    fab.hidden = false
    sasaran.classList.add('mqr-pad')
    const w = fab.offsetWidth || 84
    const atas = sasaran.tagName === 'TEXTAREA' ? r.top + 6 : r.top + (r.height - 28) / 2
    fab.style.top = Math.max(4, atas) + 'px'
    fab.style.left = Math.max(4, r.right - w - 8) + 'px'
  }

  document.addEventListener('focusin', e => {
    const t = e.target
    if (t.matches && t.matches(BOLEH) && !t.readOnly && !t.disabled) { sasaran = t; posisi() }
    else if (!panel.contains(t) && t !== fab) { sembunyi() }
  })
  document.addEventListener('focusout', e => {
    if (e.target === sasaran && e.relatedTarget !== fab) setTimeout(() => { if (document.activeElement !== sasaran) sembunyi() }, 120)
  })
  window.addEventListener('scroll', posisi, true)
  window.addEventListener('resize', posisi)
  fab.addEventListener('mousedown', e => e.preventDefault())   // jaga agar kolom tetap terpilih

  fab.addEventListener('click', async () => {
    if (!sasaran) return
    a = sasaran.selectionStart == null ? sasaran.value.length : sasaran.selectionStart
    b = sasaran.selectionEnd == null ? a : sasaran.selectionEnd
    pesan.textContent = ''
    const gelap = document.documentElement.dataset.theme === 'dark' || !!document.querySelector('.kq-dark')
    panel.classList.toggle('gelap', gelap)
    sembunyi()
    panel.hidden = false
    try {
      if (!mf) {
        pesan.textContent = 'Memuat editor rumus...'
        await muatMathlive()
        pesan.textContent = ''
        mf = document.createElement('math-field')
        mf.className = 'mqr-mf'
        mf.setAttribute('aria-label', 'Tulis rumus di sini')
        slot.appendChild(mf)
      }
      mf.setValue('')
      mf.focus()
    } catch (e) { pesan.textContent = e.message }
  })

  function tutup() { panel.hidden = true; if (sasaran && document.contains(sasaran)) { sasaran.focus(); posisi() } }
  panel.querySelector('.mqr-x').onclick = tutup
  panel.querySelector('.mqr-ins').onclick = () => {
    const latex = mf ? mf.value.trim() : ''
    if (!latex) { pesan.textContent = 'Tulis rumusnya dulu di kotak di atas.'; return }
    if (!sasaran || !document.contains(sasaran)) { pesan.textContent = 'Kolom tujuan sudah tidak ada. Klik kolomnya lagi.'; return }
    sasaran.focus()
    sasaran.setRangeText('\\(' + latex + '\\)', a, b, 'end')
    sasaran.dispatchEvent(new Event('input', { bubbles: true }))
    panel.hidden = true
    posisi()
  }

  /* ---------- tampilkan rumus yang rapi saat dibaca / dikerjakan ---------- */
  const ADA_RUMUS = /\\\(|\\\[/
  function adaRumus() {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let n
    while ((n = w.nextNode())) {
      const p = n.parentElement
      if (!p || /^(TEXTAREA|SCRIPT|STYLE)$/.test(p.tagName) || p.closest('.mqr-panel')) continue
      if (ADA_RUMUS.test(n.nodeValue)) return true
    }
    return false
  }
  async function renderRumus() {
    if (!adaRumus()) return
    try {
      await muatKatex()
      window.renderMathInElement(document.body, {
        delimiters: [{ left: '\\(', right: '\\)', display: false }, { left: '\\[', right: '\\]', display: true }],
        ignoredClasses: ['mqr-panel'],
        throwOnError: false
      })
    } catch (e) {}
  }

  let tunggu = false
  function jadwal() {
    if (tunggu) return
    tunggu = true
    requestAnimationFrame(() => {
      tunggu = false
      if (sasaran && !document.contains(sasaran)) sembunyi()
      renderRumus()
    })
  }
  new MutationObserver(jadwal).observe(document.body, { childList: true, subtree: true })
  jadwal()
})()

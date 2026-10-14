/* MathQuest Premium: Materi 1-2 gratis, Materi 3-6 berbayar Rp35.000 sekali bayar (selamanya). Hanya menambah lapisan di atas kodemu. */
(function () {
  var CFG = {
    SUPABASE_URL: 'https://qoeflqydmemenxwjulaw.supabase.co',
    ANON_KEY: 'ISI_ANON_KEY_KAMU',   // salin dari Supabase > Project Settings > API > anon public
    GRATIS: [1, 2],
    HARGA: 35000,
    DEMO: !!window.MQ_DEMO
  };
  var app = document.getElementById('app'); if (!app) return;
  var premium = false, sb = null, modal = null;
  var rp = function (n) { return 'Rp' + n.toLocaleString('id-ID'); };

  var st = document.createElement('style');
  st.textContent = [
    '.mq-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 14px}',
    '.mq-tabs>button{font:800 1rem Nunito,sans-serif;padding:10px 18px;border-radius:99px;border:2px solid var(--line,#e0daf7);background:var(--card,#fff);color:var(--ink,#1d1740);cursor:pointer}',
    '.mq-tabs>button.on{background:var(--p,#6c4cf1);border-color:var(--p,#6c4cf1);color:#fff}',
    '.mq-ban{flex-basis:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;background:#ffc53126;border:2px dashed #ffc531;border-radius:14px;padding:10px 14px;color:var(--ink,#1d1740)}',
    '.mq-ban button{font:800 .95rem Nunito,sans-serif;padding:9px 16px;border-radius:10px;border:0;background:#ffc531;color:#14275e;box-shadow:0 3px 0 #d99a00;cursor:pointer}',
    '.mq-locked{position:relative}',
    '.mq-pill{position:absolute;top:10px;right:10px;z-index:2;background:#14275e;color:#fff;font:800 .8rem Nunito,sans-serif;padding:5px 10px;border-radius:99px;box-shadow:0 2px 8px rgba(0,0,0,.25)}',
    '.mq-locked button{background:#ffc531!important;border-color:#ffc531!important;color:#14275e!important}',
    '.mq-ov{position:fixed;inset:0;z-index:9999;background:rgba(15,28,69,.55);display:flex;align-items:center;justify-content:center;padding:16px}',
    '.mq-md{width:min(380px,100%);background:var(--card,#fff);color:var(--ink,#1d1740);border:2px solid var(--line,#e0daf7);border-radius:20px;padding:22px;text-align:center;font-family:Nunito,system-ui,sans-serif;box-shadow:0 20px 50px rgba(0,0,0,.3)}',
    '.mq-md h2{font:800 1.4rem "Baloo 2",sans-serif;margin:6px 0}.mq-md p{margin:4px 0;color:var(--muted,#5f5a82)}',
    '.mq-price{font:800 2.2rem "Baloo 2",sans-serif;color:var(--p,#6c4cf1);margin:8px 0 0}.mq-md ul{list-style:none;padding:0;margin:12px 0;text-align:left}.mq-md li{padding:3px 0;font-weight:700}',
    '.mq-md button{font:800 1rem Nunito,sans-serif;width:100%;padding:12px;border-radius:12px;border:2px solid var(--line,#e0daf7);cursor:pointer;margin-top:8px;background:transparent;color:inherit}',
    '.mq-md button.mq-buy{background:#ffc531;border-color:#ffc531;color:#14275e;box-shadow:0 3px 0 #d99a00}.mq-md button:disabled{opacity:.6}',
    '.mq-err{color:#d93a4a;font-weight:700;min-height:1.2em;margin-top:6px}'
  ].join('');
  document.head.appendChild(st);

  function sync() {
    app.querySelectorAll('button,a').forEach(function (b) {
      if (!/buka materi|buka akses/i.test(b.textContent)) return;
      var card = b.closest('.materi') || b.closest('.card') || b.parentElement; if (!card) return;
      var m = /Materi\s*(\d+)/i.exec(card.textContent); if (!m) return;
      var n = +m[1], lock = !premium && CFG.GRATIS.indexOf(n) < 0;
      card.dataset.mqn = n; card.classList.toggle('mq-locked', lock);
      var pill = card.querySelector('.mq-pill');
      if (lock && !pill) { pill = document.createElement('span'); pill.className = 'mq-pill'; pill.textContent = '\uD83D\uDD12 Premium'; card.appendChild(pill); }
      if (!lock && pill) pill.remove();
      var want = lock ? '\uD83D\uDD12 Buka Materi 3\u20136' : 'Buka materi';
      if (b.textContent !== want) b.textContent = want;
    });
    var first = app.querySelector('[data-mqn]'); if (!first) return;
    var grid = first.parentElement;
    if (!tabsEl) buatTabs();
    if (!document.contains(tabsEl) || tabsEl.nextElementSibling !== grid) grid.parentElement.insertBefore(tabsEl, grid);
    app.querySelectorAll('[data-mqn]').forEach(function (c) {
      var g = CFG.GRATIS.indexOf(+c.dataset.mqn) >= 0 ? 'gratis' : 'premium';
      c.style.display = g === tab ? '' : 'none';
    });
    tabsEl.querySelectorAll('[data-t]').forEach(function (x) { x.classList.toggle('on', x.dataset.t === tab); });
    tabsEl.querySelector('.mq-ban').style.display = (tab === 'premium' && !premium) ? '' : 'none';
    var pt = premium ? '\u2B50 Premium \u2713' : '\u2B50 Premium', pb = tabsEl.querySelector('[data-t=premium]');
    if (pb.textContent !== pt) pb.textContent = pt;
  }

  var tab = 'gratis', tabsEl = null;
  function buatTabs() {
    tabsEl = document.createElement('div'); tabsEl.className = 'mq-tabs';
    tabsEl.innerHTML = '<button data-t="gratis">\uD83C\uDD93 Gratis</button><button data-t="premium">\u2B50 Premium</button><div class="mq-ban"><b>Materi 3\u20136: ' + rp(CFG.HARGA) + ' sekali bayar, selamanya.</b><button class="mq-buy2">Beli Premium</button></div>';
    tabsEl.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.t) { tab = b.dataset.t; sync(); } else tampil();
    });
  }

  document.addEventListener('click', function (e) {
    var c = e.target.closest && e.target.closest('.mq-locked');
    if (!c || (modal && modal.contains(e.target))) return;
    e.preventDefault(); e.stopImmediatePropagation(); tampil();
  }, true);

  function tampil() {
    if (modal) return;
    modal = document.createElement('div'); modal.className = 'mq-ov';
    modal.innerHTML = '<div class="mq-md" role="dialog" aria-modal="true"><div style="font-size:2.4rem">\uD83D\uDD13</div><h2>Buka Materi 3\u20136</h2><p>Bayar sekali untuk membuka semua Materi 3 sampai 6, selamanya.</p><div class="mq-price">' + rp(CFG.HARGA) + '</div><ul><li>\u2705 PLSV &amp; PTLSV</li><li>\u2705 Relasi &amp; Fungsi</li><li>\u2705 Persamaan Garis Lurus</li><li>\u2705 Statistika</li></ul><button class="mq-buy">Bayar ' + rp(CFG.HARGA) + '</button><button class="mq-no">Nanti saja</button><div class="mq-err" role="alert"></div></div>';
    document.body.appendChild(modal);
    modal.querySelector('.mq-no').onclick = tutup;
    modal.addEventListener('click', function (e) { if (e.target === modal) tutup(); });
    modal.querySelector('.mq-buy').onclick = function () { bayar(this); };
  }
  function tutup() { if (modal) { modal.remove(); modal = null; } }

  async function bayar(btn) {
    var err = modal.querySelector('.mq-err'); err.textContent = ''; btn.disabled = true; btn.textContent = 'Memproses...';
    try {
      if (CFG.DEMO) { await new Promise(function (r) { setTimeout(r, 700); }); premium = true; tutup(); sync(); return; }
      var s = (await sb.auth.getSession()).data.session; if (!s) throw new Error('Masuk dulu ya.');
      var r = await fetch('/.netlify/functions/buat-pembayaran', { method: 'POST', headers: { Authorization: 'Bearer ' + s.access_token } });
      var d = await r.json(); if (!r.ok || !d.redirect_url) throw new Error(d.error || 'Gagal membuat pembayaran.');
      location.href = d.redirect_url;
    } catch (e) { err.textContent = e.message; btn.disabled = false; btn.textContent = 'Bayar ' + rp(CFG.HARGA); }
  }

  async function cek() {
    if (CFG.DEMO || !sb) return;
    var s = (await sb.auth.getSession()).data.session;
    var p = false;
    if (s) { var r = await sb.from('akses').select('status').eq('user_id', s.user.id).maybeSingle(); p = !!(r.data && r.data.status === 'aktif'); }
    if (p !== premium) { premium = p; sync(); }
  }

  new MutationObserver(sync).observe(app, { childList: true, subtree: true });
  sync();
  if (!CFG.DEMO && window.supabase && typeof window.supabase.createClient === 'function') {
    sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.ANON_KEY);
    sb.auth.onAuthStateChange(function () { setTimeout(cek, 0); });
    cek();
    if (/bayar=selesai/.test(location.search)) { var t = 0, iv = setInterval(function () { cek(); if (premium || ++t > 10) clearInterval(iv); }, 3000); }
  }
})();

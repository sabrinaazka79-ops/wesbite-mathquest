/* Hapus kotak "Buat otomatis dengan AI" di semua formulir (latihan soal, materi, dll) */
(function () {
  var teks = 'Buat otomatis dengan AI', pending = false;
  function bersih() {
    pending = false;
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), n, hits = [];
    while ((n = w.nextNode())) if (n.nodeValue.indexOf(teks) >= 0) hits.push(n.parentElement);
    hits.forEach(function (el) {
      // naik sampai tepat di bawah wadah yang juga memuat kolom "Judul ..." (latihan/materi/dll) = kotak AI-nya
      while (el.parentElement && el.parentElement !== document.body && !/\bJudul\b/.test(el.parentElement.textContent)) el = el.parentElement;
      if (el.parentElement && el.parentElement !== document.body && !/\bJudul\b/.test(el.textContent)) el.remove();
    });
  }
  new MutationObserver(function () { if (!pending) { pending = true; requestAnimationFrame(bersih); } }).observe(document.body, { childList: true, subtree: true });
  bersih();
})();

/* MathQuest Premium: Materi 1-2 gratis, Materi 3-6 berbayar Rp25.000 sekali bayar (selamanya). Hanya menambah lapisan di atas kodemu. */
/* MathQuest Premium. Gratis: Materi 1-2, Kuis, Materi, Latihan Soal. Premium: Materi 3-6 + Game. Mode SIMULASI = tanpa bayar sungguhan. */
(function () {
  var CFG = {
    SIMULASI: true,                 // true = pembayaran tiruan. Ganti false kalau pembayaran sungguhan sudah dipasang.
    SUPABASE_URL: 'https://qoeflqydmemenxwjulaw.supabase.co',
    ANON_KEY: 'sb_publishable_zZom9gkYPDfJFYMcosOXmg_KvBfwFE4',  // hanya dipakai kalau SIMULASI = false
    GRATIS: [1, 2],
    HARGA: 25000,
    DEMO: !!window.MQ_DEMO
  };
  var SIM = CFG.SIMULASI || CFG.DEMO;
  var premium = false, lastPrem = false, modal = null, tab = 'gratis', tabsEl = null, pill = null, lastUid = '?', mem = {};
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
    '.mq-lk{margin-left:6px}.mq-hassim{padding-bottom:64px}',
    '.mq-ex{margin:14px 0}',
    '.mq-exn{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:12px;background:#ffc53126;border:2px dashed #ffc531;border-radius:14px;padding:10px 14px;color:var(--ink,#1d1740);font-weight:700}',
    '.mq-exbtn{font:800 .9rem Nunito,sans-serif;padding:9px 16px;border-radius:10px;border:0;background:#ffc531;color:#14275e;box-shadow:0 3px 0 #d99a00;cursor:pointer}',
    '.mq-sim{position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:9000;display:flex;gap:10px;align-items:center;background:#14275e;color:#fff;border-radius:99px;padding:6px 8px 6px 14px;font:700 .8rem Nunito,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.3);white-space:nowrap}',
    '.mq-sim button{font:800 .8rem Nunito,sans-serif;border:0;border-radius:99px;padding:6px 12px;background:#ffc531;color:#14275e;cursor:pointer}',
    '.mq-ov{position:fixed;inset:0;z-index:9999;background:rgba(15,28,69,.55);display:flex;align-items:center;justify-content:center;padding:16px}',
    '.mq-md{width:min(380px,100%);max-height:100%;overflow:auto;background:var(--card,#fff);color:var(--ink,#1d1740);border:2px solid var(--line,#e0daf7);border-radius:20px;padding:22px;text-align:center;font-family:Nunito,system-ui,sans-serif;box-shadow:0 20px 50px rgba(0,0,0,.3)}',
    '.mq-md h2{font:800 1.4rem "Baloo 2",sans-serif;margin:6px 0}.mq-md p{margin:4px 0;color:var(--muted,#5f5a82)}',
    '.mq-price{font:800 2.2rem "Baloo 2",sans-serif;color:var(--p,#6c4cf1);margin:8px 0 0}.mq-md ul{list-style:none;padding:0;margin:12px 0;text-align:left}.mq-md li{padding:3px 0;font-weight:700}',
    '.mq-md button{font:800 1rem Nunito,sans-serif;width:100%;padding:12px;border-radius:12px;border:2px solid var(--line,#e0daf7);cursor:pointer;margin-top:8px;background:transparent;color:inherit}',
    '.mq-md button.mq-buy{background:#ffc531;border-color:#ffc531;color:#14275e;box-shadow:0 3px 0 #d99a00}.mq-md button:disabled{opacity:.6}',
    '.mq-err{color:#d93a4a;font-weight:700;min-height:1.2em;margin-top:6px}',
    '.mq-kode{margin-top:14px;border-top:1px solid var(--line,#e0daf7);padding-top:12px}',
    '.mq-ki{width:100%;box-sizing:border-box;font:700 1rem monospace;text-align:center;text-transform:uppercase;padding:11px;border-radius:12px;border:2px solid var(--line,#e0daf7);background:var(--bg,#f4f1ff);color:inherit}'
  ].join('');
  document.head.appendChild(st);

  /* ---- sesi & status premium ---- */
  function sesi() {
    if (CFG.DEMO) return { uid: 'demo', token: '' };
    var stores = [window.localStorage, window.sessionStorage];
    for (var i = 0; i < stores.length; i++) {
      var S = stores[i], n = 0; try { n = S.length; } catch (e) {}
      for (var j = 0; j < n; j++) {
        try {
          var k = S.key(j); if (!/auth-token/.test(k)) continue;
          var o = JSON.parse(S.getItem(k)); o = (o && o.currentSession) || o;
          if (o && o.user && o.user.id) return { uid: o.user.id, token: o.access_token };
        } catch (e) {}
      }
    }
    return null;
  }
  function getSim(uid) { if (CFG.DEMO) return !!mem[uid]; try { return localStorage.getItem('mq_sim_' + uid) === '1'; } catch (e) { return false; } }
  function setSim(uid, v) { if (CFG.DEMO) { mem[uid] = v; return; } try { v ? localStorage.setItem('mq_sim_' + uid, '1') : localStorage.removeItem('mq_sim_' + uid); } catch (e) {} }

  async function cek(force) {
    var s = sesi(), uid = s ? s.uid : null;
    if (uid === lastUid && !force) return;
    lastUid = uid;
    var p = false;
    if (uid) {
      if (SIM) p = getSim(uid);
      if (!p && !CFG.DEMO && s && s.token) {   // Premium dari kode aktivasi (tersimpan di database)
        try {
          var r0 = await fetch(CFG.SUPABASE_URL + '/rest/v1/rpc/punya_premium', { method: 'POST', headers: { apikey: CFG.ANON_KEY, Authorization: 'Bearer ' + s.token, 'Content-Type': 'application/json' }, body: '{}' });
          p = (await r0.json()) === true;
        } catch (e) {}
      }
      if (!p && !SIM) {
        try {
          var r = await fetch(CFG.SUPABASE_URL + '/rest/v1/akses?select=status&user_id=eq.' + uid, { headers: { apikey: CFG.ANON_KEY, Authorization: 'Bearer ' + s.token } });
          var d = await r.json(); p = Array.isArray(d) && !!d[0] && d[0].status === 'aktif';
        } catch (e) {}
      }
    }
    premium = !!p; sync();
  }

  /* ---- tampilan ---- */
  function isCreate(b) {
    var raw = b.textContent, t = raw.replace(/[^A-Za-z ]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    return (/\+/.test(raw) && /\b(game|kuis)\b/.test(t)) || /^(buat|tambah|bikin) (kuis|game)$/.test(t);
  }

  function syncMateri(app) {
    app.querySelectorAll('button,a').forEach(function (b) {
      if (!/buka materi|buka akses/i.test(b.textContent)) return;
      var card = b.closest('.materi') || b.closest('.card') || b.parentElement; if (!card) return;
      var m = /Materi\s*(\d+)/i.exec(card.textContent); if (!m) return;
      var n = +m[1], lock = !premium && CFG.GRATIS.indexOf(n) < 0;
      card.dataset.mqn = n; card.classList.toggle('mq-locked', lock);
      var pl = card.querySelector('.mq-pill');
      if (lock && !pl) { pl = document.createElement('span'); pl.className = 'mq-pill'; pl.textContent = '\uD83D\uDD12 Premium'; card.appendChild(pl); }
      if (!lock && pl) pl.remove();
      var want = lock ? '\uD83D\uDD12 Buka Premium' : 'Buka materi';
      if (b.textContent !== want) b.textContent = want;
    });
    var first = app.querySelector('[data-mqn]');
    if (!first) { if (tabsEl && tabsEl.parentNode) tabsEl.remove(); return; }
    var grid = first.parentElement;
    if (!tabsEl) buatTabs();
    if (!document.contains(tabsEl) || tabsEl.nextElementSibling !== grid) grid.parentElement.insertBefore(tabsEl, grid);
    if (premium !== lastPrem) { lastPrem = premium; tab = premium ? 'premium' : 'gratis'; }
    app.querySelectorAll('[data-mqn]').forEach(function (c) {
      var gratis = CFG.GRATIS.indexOf(+c.dataset.mqn) >= 0;
      c.style.display = (tab === 'premium' || gratis) ? '' : 'none';
    });
    tabsEl.querySelectorAll('[data-t]').forEach(function (x) { x.classList.toggle('on', x.dataset.t === tab); });
    tabsEl.querySelector('.mq-ban').style.display = (tab === 'premium' && !premium) ? '' : 'none';
    var pt = premium ? '\u2B50 Premium \u2713' : '\u2B50 Premium', pb = tabsEl.querySelector('[data-t=premium]');
    if (pb.textContent !== pt) pb.textContent = pt;
  }

  function syncGame(app) {
    app.querySelectorAll('button,a').forEach(function (b) {
      if (!isCreate(b)) return;
      var lock = !premium, lk = b.querySelector('.mq-lk');
      b.classList.toggle('mq-gl', lock);
      if (lock && !lk) { lk = document.createElement('span'); lk.className = 'mq-lk'; lk.textContent = '\uD83D\uDD12'; b.appendChild(lk); }
      if (!lock && lk) lk.remove();
    });
  }

  /* Kotak ajakan Premium di tab Game untuk akun gratis (kartu contoh game sudah dihapus) */
  function exHTML() {
    return '<div class="mq-exn"><span>Ini hanya contoh tampilan. Mau membuat game sendiri?</span><button type="button" class="mq-gl mq-exbtn">\uD83D\uDD12 Buat game sendiri (Premium)</button></div>';
  }
  function syncContoh(app) {
    var old = app.querySelector('.mq-ex'), w = document.createTreeWalker(app, NodeFilter.SHOW_TEXT, null), n, h = null;
    while ((n = w.nextNode())) { if (n.nodeValue.indexOf('Game edukasi') >= 0) { h = n.parentElement; break; } }
    var row = h;
    while (row && row !== app) { if ([].some.call(row.querySelectorAll('button,a'), isCreate)) break; row = row.parentElement; }
    if (row === app) row = null;
    var real = row && [].some.call(row.parentElement.querySelectorAll('button,a'), function (b) { return /^\s*mainkan\s*$/i.test(b.textContent); });
    if (!row || premium || real) { if (old) old.remove(); return; }
    if (old && old.previousElementSibling === row) return;
    if (old) old.remove();
    var ex = document.createElement('div'); ex.className = 'mq-ex'; ex.innerHTML = exHTML();
    row.parentNode.insertBefore(ex, row.nextSibling);
  }

  function simPill() {
    var s = SIM && sesi();
    if (!s) { document.body.classList.remove('mq-hassim'); if (pill) { pill.remove(); pill = null; } return; }
    if (!pill || !document.contains(pill)) {
      pill = document.createElement('div'); pill.className = 'mq-sim'; pill.innerHTML = '<span></span><button type="button"></button>';
      pill.querySelector('button').onclick = function () { var x = sesi(); if (!x) return; premium = !premium; setSim(x.uid, premium); sync(); };
      document.body.appendChild(pill);
    }
    document.body.classList.add('mq-hassim');
    var a = '\uD83E\uDDEA Simulasi \u00b7 Akun: ' + (premium ? 'Premium' : 'Gratis'), b = premium ? 'Jadikan Gratis' : 'Jadikan Premium';
    var sp = pill.firstChild, bt = pill.lastChild;
    if (sp.textContent !== a) sp.textContent = a;
    if (bt.textContent !== b) bt.textContent = b;
  }

  function sync() {
    var app = document.getElementById('app');
    if (app) { syncMateri(app); syncGame(app); syncContoh(app); }
    simPill();
  }

  function buatTabs() {
    tabsEl = document.createElement('div'); tabsEl.className = 'mq-tabs';
    tabsEl.innerHTML = '<button data-t="gratis">\uD83C\uDD93 Gratis</button><button data-t="premium">\u2B50 Premium</button><div class="mq-ban"><b>Premium: semua materi (1\u20136), buat kuis &amp; game. ' + rp(CFG.HARGA) + ' sekali bayar, selamanya.</b><button class="mq-buy2">Beli Premium</button></div>';
    tabsEl.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.t) { tab = b.dataset.t; sync(); } else tampil();
    });
  }

  document.addEventListener('click', function (e) {
    var c = e.target.closest && e.target.closest('.mq-locked, .mq-gl');
    if (!c) return;
    e.preventDefault(); e.stopImmediatePropagation(); tampil();
  }, true);

  /* ---- jendela bayar ---- */
  function tampil() {
    if (modal) return;
    modal = document.createElement('div'); modal.className = 'mq-ov';
    modal.innerHTML = '<div class="mq-md" role="dialog" aria-modal="true"><div style="font-size:2.4rem">\uD83D\uDD13</div><h2>Buka Premium</h2><p>Bayar sekali, akses selamanya.</p><div class="mq-price">' + rp(CFG.HARGA) + '</div><ul><li>\u2705 Semua materi 1\u20136 (termasuk yang gratis)</li><li>\u2705 Materi 3\u20136: PLSV, Relasi, Garis Lurus, Statistika</li><li>\uD83C\uDFAE Buat kuis dan game sendiri di Dashboard</li></ul><button class="mq-buy">Bayar ' + rp(CFG.HARGA) + '</button><div class="mq-kode"><p style="font-weight:800">Punya kode aktivasi?</p><input class="mq-ki" placeholder="MQ-XXXX-XXXX" maxlength="14" autocomplete="off"><button class="mq-kb">Pakai kode</button></div><button class="mq-no">Nanti saja</button><div class="mq-err" role="alert"></div>' + (SIM ? '<p style="font-size:.8rem">Mode simulasi: tidak ada pembayaran sungguhan.</p>' : '') + '</div>';
    document.body.appendChild(modal);
    modal.querySelector('.mq-no').onclick = tutup;
    modal.addEventListener('click', function (e) { if (e.target === modal) tutup(); });
    modal.querySelector('.mq-buy').onclick = function () { bayar(this); };
    modal.querySelector('.mq-kb').onclick = function () { tukarKode(this); };
  }
  async function tukarKode(btn) {
    var err = modal.querySelector('.mq-err'), kode = modal.querySelector('.mq-ki').value.trim();
    err.style.color = ''; err.textContent = '';
    if (!kode) { err.textContent = 'Masukkan kodenya dulu.'; return; }
    btn.disabled = true; btn.textContent = 'Memeriksa...';
    try {
      var res = await db.rpc('tukar_kode', { p_kode: kode });
      if (res.error) throw new Error(res.error.message);
      var d = res.data || {};
      if (d.ok) {
        var x = sesi(); if (SIM && x) setSim(x.uid, true);
        premium = true; err.style.color = '#16a36a'; err.textContent = d.pesan;
        setTimeout(function () { tutup(); sync(); }, 1500); return;
      }
      err.textContent = d.pesan || 'Kode tidak bisa dipakai.';
    } catch (e) { err.textContent = 'Gagal: ' + e.message; }
    btn.disabled = false; btn.textContent = 'Pakai kode';
  }
  function tutup() { if (modal) { modal.remove(); modal = null; } }

  function halamanBayar() {
    var o = document.createElement('div'); o.className = 'mq-ov';
    o.innerHTML = '<div class="mq-md"><p style="font-weight:800;letter-spacing:.05em">PEMBAYARAN \u00b7 SIMULASI</p><h2>Rincian pembayaran</h2><div style="display:flex;justify-content:space-between;gap:10px;text-align:left;padding:10px 0;border-bottom:1px solid var(--line,#e0daf7)"><span>MathQuest Premium (selamanya)</span><b>' + rp(CFG.HARGA) + '</b></div><div class="pm" style="text-align:left;margin:10px 0"></div><button class="mq-buy go">Bayar ' + rp(CFG.HARGA) + '</button><p style="font-size:.8rem;margin-top:10px">Ini hanya gambaran alur. Tidak ada uang yang dipotong.</p></div>';
    document.body.appendChild(o);
    var pm = o.querySelector('.pm');
    ['QRIS', 'Virtual Account Bank', 'E-wallet'].forEach(function (t, i) { pm.insertAdjacentHTML('beforeend', '<label style="display:flex;gap:8px;align-items:center;padding:6px 0;font-weight:700"><input type="radio" name="mqpm" ' + (i ? '' : 'checked') + '> ' + t + '</label>'); });
    var box = o.querySelector('.mq-md');
    o.querySelector('.go').onclick = function () {
      box.innerHTML = '<div style="font-size:2.4rem">\u23f3</div><h2>Menunggu pembayaran...</h2>';
      setTimeout(function () {
        box.innerHTML = '<div style="font-size:2.4rem">\u2705</div><h2>Pembayaran berhasil</h2><p>Premium aktif untuk akunmu.</p><button class="mq-buy back">Kembali ke MathQuest</button>';
        box.querySelector('.back').onclick = function () { var x = sesi(); if (x) setSim(x.uid, true); premium = true; o.remove(); sync(); };
      }, 1500);
    };
  }

  async function bayar(btn) {
    var err = modal.querySelector('.mq-err'); err.textContent = '';
    if (SIM) { tutup(); halamanBayar(); return; }
    btn.disabled = true; btn.textContent = 'Memproses...';
    try {
      var s = sesi(); if (!s) throw new Error('Masuk dulu ya.');
      var r = await fetch('/.netlify/functions/buat-pembayaran', { method: 'POST', headers: { Authorization: 'Bearer ' + s.token } });
      var d = await r.json(); if (!r.ok || !d.redirect_url) throw new Error(d.error || 'Gagal membuat pembayaran.');
      location.href = d.redirect_url;
    } catch (e) { err.textContent = e.message; btn.disabled = false; btn.textContent = 'Bayar ' + rp(CFG.HARGA); }
  }

  /* ---- jalankan: tahan terhadap halaman yang dirender ulang (login biasa maupun link reset password) ---- */
  var pending = false;
  new MutationObserver(function () { if (!pending) { pending = true; requestAnimationFrame(function () { pending = false; sync(); }); } })
    .observe(document.body, { childList: true, subtree: true });
  setInterval(function () { cek(); sync(); }, 1000);
  window.addEventListener('storage', function () { cek(true); });
  cek(true);
  if (!SIM && /bayar=selesai/.test(location.search)) { var t = 0, iv = setInterval(function () { cek(true); if (premium || ++t > 10) clearInterval(iv); }, 3000); }
})();

/* game.js — MathQuest: tab "🎮 Game" di Dashboard. Game: 🐍 Ular Tangga · 🐸 Jump & Solve · 🔐 Math Escape Room.
   Tampilan baru: petualangan kartun 3D. Ular Tangga: papan besar, ular & tangga 3D, pion siswa, dadu 3D, dunia fantasi.
   Logika soal, sistem kode (G + 5 karakter), timer, dan Supabase (tabel konten, fungsi ambil_game) TIDAK berubah.
   Pasang di index.html, PALING BAWAH setelah dashboard-konten.js (tag script dengan src="game.js"). */
(function () {
  'use strict';
  if (window.__kqgLoaded) return;
  window.__kqgLoaded = true;

  var KEY = 'mq_game_v1', HURUF = ['A', 'B', 'C', 'D'];
  var ABJAD = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var TOPIK = ['Bilangan', 'Aljabar', 'Geometri', 'Perbandingan', 'Statistika', 'Peluang'];
  var JENIS = {
    ular:   { e: '🐍', n: 'Ular Tangga',      d: 'Pemain bergiliran melempar dadu. Kotak soal harus dijawab dengan benar.', c1: '#16a36a', c2: '#5ed8a2' },
    katak:  { e: '🐸', n: 'Jump & Solve',     d: 'Pilih daun teratai berisi jawaban. Benar = katak melompat maju dan skor bertambah.',                 c1: '#0ea5e9', c2: '#6ee7f9' },
    escape: { e: '🔐', n: 'Math Escape Room', d: 'Buka 6 gembok di laboratorium rahasia sebelum waktu habis.', c1: '#6c4cf1', c2: '#a78bfa' }
  };
  var MIN = { ular: 5, katak: 5, escape: 6 };
  var SAMPLE = [
    { q: 'Sisi miring segitiga siku-siku dengan sisi 6 cm dan 8 cm adalah …', opsi: ['9 cm', '10 cm', '12 cm', '14 cm'], jawaban: 1, pembahasan: 'c² = 36 + 64 = 100, sehingga c = 10 cm.' },
    { q: 'Nilai x dari 2x + 5 = 13 adalah …', opsi: ['3', '4', '5', '9'], jawaban: 1, pembahasan: '2x = 8, sehingga x = 4.' },
    { q: 'Hasil dari (−6) × (−3) adalah …', opsi: ['−18', '−9', '9', '18'], jawaban: 3, pembahasan: 'Negatif kali negatif hasilnya positif.' },
    { q: 'Hasil dari 2³ × 2² adalah …', opsi: ['2⁵', '2⁶', '4⁵', '4⁶'], jawaban: 0, pembahasan: 'Pangkat dijumlahkan: 3 + 2 = 5.' },
    { q: 'Manakah yang merupakan tripel Pythagoras?', opsi: ['2, 3, 4', '6, 8, 10', '4, 5, 7', '5, 6, 8'], jawaban: 1, pembahasan: '6² + 8² = 36 + 64 = 100 = 10².' },
    { q: 'Nilai x dari 3x − 7 = 11 adalah …', opsi: ['4', '5', '6', '18'], jawaban: 2, pembahasan: '3x = 18, sehingga x = 6.' }
  ];

  var G = [], mode = 'lokal', sb = null, active = false, loading = false, problem = '', inited = false, mem = [];
  var Q = null, ST = null, TM = null, curG = null, qSeq = 0;

  /* ---------- util ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function find(id) { for (var i = 0; i < G.length; i++) if (G[i].id === id) return G[i]; return null; }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function prep(b) {
    return shuf(b).map(function (s) {
      var idx = shuf(s.opsi.map(function (_, i) { return i; }));
      return { q: s.q, opsi: idx.map(function (i) { return s.opsi[i]; }), jawaban: idx.indexOf(s.jawaban), pembahasan: s.pembahasan };
    });
  }
  function mmss(sec) { sec = Math.max(0, sec); return ('0' + Math.floor(sec / 60)).slice(-2) + ':' + ('0' + (sec % 60)).slice(-2); }
  /* ---------- ilustrasi 3D kartun (SVG dengan gradasi, sorotan, dan bayangan) ---------- */
  var lockSeq = 0;
  function lock3d(w) {
    var id = 'kl' + (++lockSeq);
    return '<span class="kqg-lock3d" style="--w:' + w + '"><svg viewBox="0 0 100 124" aria-hidden="true"><defs>' +
      '<linearGradient id="' + id + 'a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6b0"/><stop offset=".45" stop-color="#ffd23f"/><stop offset="1" stop-color="#f29b05"/></linearGradient>' +
      '<linearGradient id="' + id + 'b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8fa2d0"/><stop offset=".35" stop-color="#f6f9ff"/><stop offset=".7" stop-color="#bccaea"/><stop offset="1" stop-color="#7486b4"/></linearGradient></defs>' +
      '<ellipse cx="50" cy="119" rx="34" ry="5" fill="#1b0f5a" opacity=".3"/>' +
      '<path class="sh" d="M29 60V41a21 21 0 0 1 42 0v19" fill="none" stroke="url(#' + id + 'b)" stroke-width="12" stroke-linecap="round"/>' +
      '<rect x="12" y="56" width="76" height="60" rx="18" fill="#b45309"/>' +
      '<rect x="12" y="52" width="76" height="60" rx="18" fill="url(#' + id + 'a)"/>' +
      '<path d="M21 64q1-8 11-8h36q10 0 11 8" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="4.5" stroke-linecap="round"/>' +
      '<path d="M18 96q3 12 16 14" fill="none" stroke="#c2410c" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="30" cy="74" rx="7" ry="3.2" fill="#fff" opacity=".55" transform="rotate(-24 30 74)"/>' +
      '<circle cx="50" cy="80" r="9" fill="#7c2d12"/><path d="M45 84h10l3 17H42z" fill="#7c2d12"/>' +
      '<circle cx="47.5" cy="77.5" r="2.4" fill="#fff" opacity=".45"/></svg><i class="sp"></i></span>';
  }
  function studentSvg() {
    return '<svg viewBox="0 0 140 190" aria-hidden="true"><defs>' +
      '<radialGradient id="kgSk" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#ffeedd"/><stop offset="1" stop-color="#f0a977"/></radialGradient>' +
      '<linearGradient id="kgBd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a48bff"/><stop offset="1" stop-color="#5b3fe0"/></linearGradient>' +
      '<linearGradient id="kgPt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#1e40af"/></linearGradient>' +
      '<linearGradient id="kgBp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde047"/><stop offset="1" stop-color="#eab308"/></linearGradient>' +
      '<linearGradient id="kgHr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a4d2a"/><stop offset="1" stop-color="#2f1d10"/></linearGradient>' +
      '<linearGradient id="kgBk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5eead4"/><stop offset="1" stop-color="#0f9488"/></linearGradient></defs>' +
      '<ellipse cx="70" cy="185" rx="42" ry="6" fill="#1b0f5a" opacity=".3"/>' +
      '<rect x="34" y="98" width="72" height="56" rx="20" fill="url(#kgBp)"/>' +
      '<rect x="46" y="138" width="21" height="38" rx="10" fill="url(#kgPt)"/><rect x="73" y="138" width="21" height="38" rx="10" fill="url(#kgPt)"/>' +
      '<ellipse cx="54" cy="177" rx="16" ry="8" fill="#fff"/><path d="M40 178q14 6 28 0" stroke="#14b8a6" stroke-width="3" fill="none"/>' +
      '<ellipse cx="86" cy="177" rx="16" ry="8" fill="#fff"/><path d="M72 178q14 6 28 0" stroke="#14b8a6" stroke-width="3" fill="none"/>' +
      '<path d="M38 152c0-34 13-54 32-54s32 20 32 54z" fill="url(#kgBd)"/>' +
      '<path d="M44 140c0-22 8-36 20-40" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M56 100l14 13 14-13" fill="#fff" stroke="#e5defd" stroke-width="2"/>' +
      '<path d="M84 124l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#fde047"/>' +
      '<rect x="26" y="106" width="17" height="42" rx="8.5" fill="url(#kgBd)" transform="rotate(10 34 108)"/><circle cx="31" cy="150" r="8" fill="url(#kgSk)"/>' +
      '<g class="arm"><rect x="97" y="106" width="17" height="38" rx="8.5" fill="url(#kgBd)" transform="rotate(-24 105 108)"/>' +
      '<rect x="92" y="124" width="32" height="25" rx="4" fill="url(#kgBk)" transform="rotate(-8 108 136)"/><rect x="96" y="128" width="24" height="3" rx="1.5" fill="#ccfbf1" transform="rotate(-8 108 136)"/>' +
      '<circle cx="96" cy="145" r="7.5" fill="url(#kgSk)"/></g>' +
      '<ellipse cx="34" cy="70" rx="5" ry="7" fill="url(#kgSk)"/><ellipse cx="106" cy="70" rx="5" ry="7" fill="url(#kgSk)"/>' +
      '<circle cx="70" cy="66" r="36" fill="url(#kgSk)"/>' +
      '<path d="M33 62c1-26 19-38 37-37 19 1 34 14 36 37-9-9-21-14-36-14s-27 5-37 14z" fill="url(#kgHr)"/>' +
      '<path d="M46 40q10-9 24-9" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="4" stroke-linecap="round"/>' +
      '<polygon points="70,12 118,30 70,48 22,30" fill="#1e3a8a"/><polygon points="70,12 118,30 70,34 22,30" fill="#2f55c9"/>' +
      '<rect x="50" y="40" width="40" height="10" rx="5" fill="#1d4ed8"/><path d="M114 31v22" stroke="#facc15" stroke-width="3"/><circle cx="114" cy="56" r="4.5" fill="#facc15"/>' +
      '<ellipse cx="56" cy="70" rx="7" ry="8" fill="#fff"/><ellipse cx="84" cy="70" rx="7" ry="8" fill="#fff"/>' +
      '<circle cx="57" cy="71" r="4" fill="#1f1b4d"/><circle cx="85" cy="71" r="4" fill="#1f1b4d"/><circle cx="58.4" cy="69.4" r="1.4" fill="#fff"/><circle cx="86.4" cy="69.4" r="1.4" fill="#fff"/>' +
      '<g fill="none" stroke="#1d4ed8" stroke-width="3"><circle cx="56" cy="70" r="11"/><circle cx="84" cy="70" r="11"/><path d="M67 70h6"/></g>' +
      '<circle cx="45" cy="83" r="4.5" fill="#ff8fa3" opacity=".55"/><circle cx="95" cy="83" r="4.5" fill="#ff8fa3" opacity=".55"/>' +
      '<path class="m-ok" d="M61 85q9 7 18 0" fill="none" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/>' +
      '<path class="m-hap" d="M58 83q12 15 24 0z" fill="#7f1d1d"/><path class="m-hap" d="M64 90q6-4 12 0q-6 5-12 0z" fill="#fb7185"/>' +
      '<path class="m-sad" d="M61 92q9-8 18 0" fill="none" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/></svg>';
  }
  function bookStack() {
    return '<svg viewBox="0 0 120 96" aria-hidden="true"><ellipse cx="60" cy="90" rx="54" ry="6" fill="#1b0f5a" opacity=".3"/>' +
      '<rect x="8" y="61" width="104" height="26" rx="6" fill="#4c2fc8"/><rect x="8" y="57" width="104" height="26" rx="6" fill="#7c5cff"/><rect x="16" y="62" width="92" height="16" rx="3" fill="#fff6e0"/><path d="M20 66h84M20 71h84M20 76h84" stroke="#e8dcc0" stroke-width="1.4"/><rect x="8" y="57" width="12" height="26" rx="6" fill="#a48bff"/>' +
      '<rect x="18" y="37" width="88" height="24" rx="6" fill="#0b7d73"/><rect x="18" y="34" width="88" height="24" rx="6" fill="#14b8a6"/><rect x="26" y="39" width="76" height="14" rx="3" fill="#fff6e0"/><path d="M30 43h68M30 48h68" stroke="#e8dcc0" stroke-width="1.4"/><rect x="18" y="34" width="11" height="24" rx="5" fill="#5eead4"/>' +
      '<g transform="rotate(-7 62 22)"><rect x="30" y="16" width="70" height="22" rx="6" fill="#b45309"/><rect x="30" y="13" width="70" height="22" rx="6" fill="#facc15"/><rect x="37" y="18" width="58" height="12" rx="3" fill="#fff6e0"/><path d="M41 22h50M41 26h50" stroke="#e8dcc0" stroke-width="1.4"/><rect x="30" y="13" width="10" height="22" rx="5" fill="#fde68a"/></g>' +
      '<circle cx="96" cy="20" r="6" fill="#ff7a59"/><path d="M96 14v-5" stroke="#16a34a" stroke-width="3" stroke-linecap="round"/></svg>';
  }
  function beaker() {
    return '<svg viewBox="0 0 70 100" aria-hidden="true"><defs><linearGradient id="kgLq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5eead4"/><stop offset="1" stop-color="#7c5cff"/></linearGradient></defs>' +
      '<ellipse cx="35" cy="95" rx="28" ry="4.5" fill="#1b0f5a" opacity=".3"/>' +
      '<path d="M26 6h18v6l-2 2v20l18 44q5 16-10 16H20q-15 0-10-16l18-44V14l-2-2z" fill="#ffffff44" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M18 66h34l7 18q4 10-9 10H20q-13 0-9-10z" fill="url(#kgLq)"/>' +
      '<circle class="bub b1" cx="28" cy="80" r="3.2" fill="#fff" opacity=".8"/><circle class="bub b2" cx="40" cy="74" r="2.4" fill="#fff" opacity=".8"/><circle class="bub b3" cx="34" cy="84" r="2" fill="#fff" opacity=".8"/>' +
      '<path d="M22 24v22" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/></svg>';
  }
  function burstAt(el, items, n) {
    var r = el ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    function gone(x) { return function () { x.remove(); }; }
    for (var i = 0; i < n; i++) {
      var e = document.createElement('span'); e.className = 'kqg-p'; e.textContent = items[i % items.length];
      e.style.left = cx + 'px'; e.style.top = cy + 'px'; document.body.appendChild(e);
      var a = Math.random() * 6.283, d = 50 + Math.random() * 80, dx = Math.cos(a) * d, dy = Math.sin(a) * d - 40;
      if (e.animate) e.animate([{ transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px)) scale(1.3) rotate(' + Math.round(Math.random() * 360) + 'deg)', opacity: 0 }],
        { duration: 800 + Math.random() * 500, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = gone(e);
      else setTimeout(gone(e), 900);
    }
  }
  function floatText(txt, cls) {
    var d = document.querySelector('.kq-dlg'); if (!d) return;
    var r = d.getBoundingClientRect(), e = document.createElement('div');
    e.className = 'kqg-ft ' + cls; e.textContent = txt; e.style.left = r.left + r.width / 2 + 'px'; e.style.top = Math.max(80, r.top + Math.min(r.height / 2, 170)) + 'px';
    document.body.appendChild(e); setTimeout(function () { e.remove(); }, 1400);
  }
  /* ---------- suara (disintesis, tanpa file) & efek visual ---------- */
  var AC = null, MUTE = false;
  function sfx(k) {
    if (MUTE) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === 'suspended') AC.resume();
      var seq = { open: [[523, .08], [659, .08], [784, .08], [1047, .24]], no: [[220, .14], [165, .24]], win: [[523, .1], [659, .1], [784, .1], [1047, .1], [1319, .32]], lose: [[300, .18], [240, .18], [180, .36]], dice: [[300, .05], [420, .05], [360, .05], [520, .08]], step: [[640, .05]], up: [[392, .08], [494, .08], [587, .08], [784, .22]], down: [[620, .1], [470, .1], [320, .1], [200, .26]] }[k] || [], t = AC.currentTime;
      seq.forEach(function (n) {
        var o = AC.createOscillator(), g = AC.createGain();
        o.type = (k === 'no' || k === 'lose' || k === 'down') ? 'sawtooth' : 'triangle'; o.frequency.value = n[0];
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.1, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + n[1]);
        o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + n[1] + .02); t += n[1] * .9;
      });
    } catch (e) {}
  }
  function flashBad() {
    var f = document.createElement('div'); f.className = 'kqg-flashbad'; document.body.appendChild(f); setTimeout(function () { f.remove(); }, 650);
  }
  function ringFx(el) {
    if (!el) return; var r = document.createElement('span'); r.className = 'kqg-ringfx'; el.appendChild(r); setTimeout(function () { r.remove(); }, 900);
  }
  /* koin terbang dari gembok ke penghitung koin */
  function flyCoins(from, to, n) {
    if (!from || !to || !from.getBoundingClientRect) return;
    var a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    for (var i = 0; i < n; i++) (function (i) {
      var e = document.createElement('span'); e.className = 'kqg-p'; e.textContent = '🪙';
      e.style.left = (a.left + a.width / 2) + 'px'; e.style.top = (a.top + a.height / 2) + 'px'; document.body.appendChild(e);
      var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
      if (e.animate) e.animate([{ transform: 'translate(-50%,-50%) scale(.6)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + (dx * .4 + (i - n / 2) * 22) + 'px),calc(-50% + ' + (dy * .4 - 70) + 'px)) scale(1.25)', opacity: 1, offset: .45 }, { transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px)) scale(.7)', opacity: .9 }],
        { duration: 750 + i * 90, delay: i * 70, easing: 'cubic-bezier(.4,.1,.3,1)', fill: 'backwards' }).onfinish = function () { e.remove(); };
      else setTimeout(function () { e.remove(); }, 900);
    })(i);
  }
  function rewardHtml(win, stars, coins, title, text) {
    var s = '', i;
    for (i = 0; i < 3; i++) s += '<span class="s' + (i < stars ? ' on' : '') + '" style="animation-delay:' + (0.3 + i * 0.35) + 's">⭐</span>';
    return '<div class="kq-res kqg-reward"><div class="kqg-trophywrap"><i class="kqg-halo"></i><div class="kqg-trophy">' + (win ? '🏆' : '⏰') + '</div></div><h3>' + title + '</h3><div class="kqg-starsrow">' + s + '</div>' +
      '<div class="kqg-coinrow">🪙 <b id="kqg-cnt" data-to="' + coins + '">0</b> koin</div><p>' + text + '</p><button class="kqg-big" data-g="again">🔄 Main lagi</button></div>';
  }
  function countUp() {
    var e = $('kqg-cnt'); if (!e) return;
    var to = +e.getAttribute('data-to'), v = 0, step = Math.max(1, Math.ceil(to / 30));
    var iv = setInterval(function () { v = Math.min(to, v + step); e.textContent = v; if (v >= to || !$('kqg-cnt')) clearInterval(iv); }, 35);
  }
  function toast(m) { var t = document.createElement('div'); t.className = 'kq-toast'; t.textContent = m; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2600); }
  function copy(t, m) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { toast(m || 'Disalin ✅'); }, function () { toast('Salin manual: ' + t); });
    else toast('Salin manual: ' + t);
  }
  function makeCode() {
    var a = new Uint8Array(5), s = 'G', i;
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a); else for (i = 0; i < 5; i++) a[i] = Math.floor(Math.random() * 256);
    for (i = 0; i < 5; i++) s += ABJAD.charAt(a[i] % ABJAD.length);
    return s;
  }
  function humanErr(e) {
    var m = (e && (e.message || e.error_description)) || String(e || '');
    if (e && (e.code === '23514' || /check constraint/i.test(m))) return 'Jenis "game" belum diizinkan di Supabase. Jalankan game-setup.sql dulu.';
    if (e && (e.code === '42883' || /ambil_game/i.test(m))) return 'Fungsi ambil_game belum dibuat di Supabase. Jalankan game-setup.sql dulu.';
    if (e && (e.code === '42501' || /row-level security|permission denied|jwt/i.test(m))) return 'Kamu perlu masuk (login) dulu.';
    return m || 'Terjadi kesalahan. Coba lagi.';
  }

  /* ---------- Supabase (otomatis, sama seperti dashboard-konten.js) ---------- */
  function isClient(c) { return !!c && typeof c.from === 'function' && typeof c.rpc === 'function' && !!c.auth; }
  function grab(n) { try { return (new Function('return typeof ' + n + '!=="undefined"?' + n + ':null'))(); } catch (e) { return null; } }
  function getClient() {
    if (sb) return sb;
    ['db', 'sb', 'supabaseClient', '_supabase', 'supa', 'client'].some(function (n) { var c = grab(n); if (isClient(c)) { sb = c; return true; } });
    return sb;
  }
  function toItem(r) { return Object.assign({ id: r.id, kode: r.kode, judul: r.judul, topik: r.topik, kelas: r.kelas, dibuat: r.dibuat }, r.isi || {}); }
  function loadL() { try { var v = localStorage.getItem(KEY); return v ? JSON.parse(v) : mem; } catch (e) { return mem; } }
  function saveL() { mem = G; try { localStorage.setItem(KEY, JSON.stringify(G)); } catch (e) {} }

  function refresh() {
    var c = getClient();
    mode = c ? 'online' : 'lokal'; problem = '';
    if (!c) { G = loadL(); loading = false; return draw(); }
    loading = true; draw();
    c.from('konten').select('*').eq('jenis', 'game').order('dibuat', { ascending: false }).then(function (r) {
      loading = false;
      if (r.error) { problem = humanErr(r.error); G = []; } else G = (r.data || []).map(toItem);
      draw();
    }, function (e) { loading = false; problem = humanErr(e); draw(); });
  }
  async function add(x, kode) {
    var c = getClient();
    if (!c) { x.id = uid(); x.dibuat = Date.now(); x.kode = kode || makeCode(); G.unshift(x); saveL(); return x; }
    for (var t = 0; t < 6; t++) {
      var r = await c.from('konten').insert({ jenis: 'game', kode: makeCode(), judul: x.judul, topik: x.topik, kelas: x.kelas, isi: { game: x.game, opsi: x.opsi, butir: x.butir } }).select().single();
      if (!r.error) { var it = toItem(r.data); G.unshift(it); return it; }
      if (r.error.code !== '23505') throw r.error;
    }
    throw new Error('Gagal membuat kode unik, coba lagi.');
  }
  async function del(id) {
    var c = getClient();
    if (c) { var r = await c.from('konten').delete().eq('id', id); if (r.error) throw r.error; }
    G = G.filter(function (x) { return x.id !== id; });
    if (!c) saveL();
  }
  async function byCode(raw) {
    var k = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!k) return null;
    var c = getClient();
    if (c) {
      var r = await c.rpc('ambil_game', { p_kode: k });
      if (r.error) throw r.error;
      var row = Array.isArray(r.data) ? r.data[0] : r.data;
      return row ? toItem(row) : null;
    }
    return loadL().filter(function (x) { return x.kode === k; })[0] || null;
  }

  /* ---------- gaya ---------- */
  var CSS = `/* ===== lama: pilih jenis, papan ular tangga, kolam katak ===== */
.kqg-type{display:flex;gap:12px;align-items:center;width:100%;text-align:left;font:inherit;padding:12px;margin:8px 0;border:2px solid #e0daf7;border-radius:16px;background:#fff;color:#1f1b4d;cursor:pointer;box-shadow:0 4px 0 #e0daf7}
.kqg-type:hover{border-color:#6c4cf1}.kqg-type span{font-size:2rem;width:54px;height:54px;border-radius:16px;display:flex;align-items:center;justify-content:center;flex:none}
.kqg-type small{display:block;opacity:.75}
.kqg-board{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;margin:10px 0}
.kqg-sq{aspect-ratio:1;border-radius:10px;background:#f4f1ff;border:2px solid #e0daf7;font-size:.7rem;font-weight:800;padding:2px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;min-width:0;overflow:hidden}
.kqg-sq .no{align-self:flex-start;opacity:.6}.kqg-sq.lad{background:#16a36a33}.kqg-sq.snk{background:#d93a4a33}.kqg-sq.qs{background:#ffb34755}
.kqg-pw{display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px #0006;margin:0 1px;vertical-align:middle}
.kqg-turn{display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:space-between;font-weight:800}
.kqg-hud{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-weight:800;margin-bottom:6px}
.kqg-lv{height:12px;border-radius:9px;background:#e0daf7;overflow:hidden;margin-bottom:10px}
.kqg-lv i{display:block;height:100%;background:linear-gradient(90deg,#22c55e,#a3e635);border-radius:9px;transition:width .6s}
.kqg-lake{position:relative;border-radius:20px;padding:18px 12px 14px;margin:10px 0;overflow:hidden;background:linear-gradient(180deg,#7dd3fc 0%,#38bdf8 55%,#0ea5e9 100%)}
.kqg-lake:before{content:"";position:absolute;inset:0;background:repeating-radial-gradient(circle at 20% 85%,#ffffff2e 0 2px,transparent 2px 20px);opacity:.6;pointer-events:none}
.kqg-pads{position:relative;display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.kqg-lily{position:relative;font:inherit;font-weight:800;min-height:84px;padding:10px 16px;border:0;color:#052e16;cursor:pointer;border-radius:46% 54% 50% 50%/55% 55% 45% 45%;background:radial-gradient(circle at 35% 30%,#86efac,#22c55e 60%,#15803d);box-shadow:0 6px 0 #14532d55;animation:kqgFloat 3s ease-in-out infinite;transition:transform .15s}
.kqg-lily:nth-child(2){animation-delay:-.8s}.kqg-lily:nth-child(3){animation-delay:-1.6s}.kqg-lily:nth-child(4){animation-delay:-2.3s}
.kqg-lily:hover:not(:disabled){transform:scale(1.05)}.kqg-lily:disabled{cursor:default}
.kqg-lily.ok{background:radial-gradient(circle at 35% 30%,#fde68a,#facc15 60%,#ca8a04);color:#422006;animation:none}
.kqg-lily.sink{background:radial-gradient(circle,#fca5a5,#ef4444);animation:kqgSink .8s forwards;color:#450a0a}
@keyframes kqgFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes kqgSink{0%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}100%{transform:translateY(14px) scale(.88);opacity:.6}}
.kqg-home{position:relative;display:flex;justify-content:center;margin-top:22px}
.kqg-home:before{content:"";position:absolute;bottom:-6px;width:96px;height:34px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#86efac,#22c55e 60%,#15803d);box-shadow:0 5px 0 #14532d55}
.kqg-frog{position:relative;z-index:2;display:inline-block;font-size:2.8rem;line-height:1;animation:kqgIdle 1.6s ease-in-out infinite}
@keyframes kqgIdle{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-3px) scale(1.04,.96)}}
.kqg-splash{position:absolute;top:-6px;right:8px;font-size:1.6rem;animation:kqgSplash .8s forwards}
@keyframes kqgSplash{0%{transform:scale(.3);opacity:0}40%{opacity:1}100%{transform:translateY(-18px) scale(1.3);opacity:0}}

/* ===== tema petualangan: laboratorium rahasia 3D kartun ===== */
.kq-ov.kqg-lab{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;padding:12px;overflow:auto;background:linear-gradient(180deg,#2b1c8c 0%,#4338ca 36%,#2563eb 62%)}
.kqg-deco{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.kqg-wallgrid{position:absolute;inset:0 0 38% 0;background:repeating-linear-gradient(0deg,#ffffff14 0 2px,transparent 2px 46px),repeating-linear-gradient(90deg,#ffffff0e 0 2px,transparent 2px 64px)}
.kqg-glow{position:absolute;left:50%;top:-12%;width:90%;height:70%;transform:translateX(-50%);background:radial-gradient(ellipse at center,#fde68a70,transparent 65%)}
.kqg-floorbg{position:absolute;left:-40%;right:-40%;top:62%;height:90%;background:conic-gradient(#14b8a6 25%,#0f9488 0 50%,#14b8a6 0 75%,#0f9488 0) 0 0/110px 110px;transform:perspective(520px) rotateX(58deg);transform-origin:50% 0;box-shadow:0 -10px 0 #0b5f58}
.kqg-deco span{position:absolute;font-family:'Baloo 2',sans-serif;font-size:clamp(1.6rem,4vw,2.6rem);font-weight:800;color:#fff;opacity:.4;animation:kqgDrift 8s ease-in-out infinite}
.kqg-deco .bub{position:absolute;bottom:-24px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff,#ffffff33 60%,#fff0);border:2px solid #ffffff55;animation:kqgRise 10s linear infinite}
.kqg-prop{position:absolute;pointer-events:none;filter:drop-shadow(0 14px 10px #0006)}
.kqg-prop svg{display:block;width:100%;height:auto}
.kqg-prop .m-hap,.kqg-prop .m-sad{display:none}
.kqg-prop.stu{width:clamp(130px,15vw,200px);left:max(2vw,calc(50% - 600px));bottom:2%;animation:kqgBob 2.6s ease-in-out infinite}
.kqg-prop.bks{width:clamp(110px,13vw,170px);right:max(2vw,calc(50% - 600px));bottom:3%}
.kqg-prop.bkr{width:clamp(56px,6vw,80px);right:max(2vw,calc(50% - 440px));bottom:3%}
.bub.b1{animation:kqgBub 2s ease-in-out infinite}.bub.b2{animation:kqgBub 2.6s ease-in-out infinite -.8s}.bub.b3{animation:kqgBub 1.8s ease-in-out infinite -1.2s}
@media (max-width:880px){.kqg-prop.bkr{display:none}.kqg-prop.stu{width:96px;left:-8px;opacity:.95}.kqg-prop.bks{width:96px;right:-6px}}
@media (max-width:520px){.kqg-prop{display:none}}

/* modal putih */
.kq-ov.kqg-lab .kq-dlg{position:relative;z-index:1;background:#fff;color:#1f1b4d;border-radius:32px;width:100%;max-width:800px;max-height:calc(100vh - 24px);max-height:calc(100dvh - 24px);overflow:auto;padding:20px 22px 24px;margin:0;box-shadow:0 30px 80px #1b0f5a88,0 0 0 6px #ffffff40,inset 0 -6px 0 #efeaff;animation:kqgIn .45s cubic-bezier(.2,1.3,.4,1);--ink:#1f1b4d;--muted:#5f5a82;--card:#fff;--bg:#f4f1ff;--line:#e0daf7;--p:#6c4cf1}
.kq-ov.kqg-lab .kq-dlg.kqg-entry{max-width:480px;padding:22px 24px 26px}
.kqg-w .kq-mh h3{font-family:'Baloo 2',sans-serif;font-size:clamp(1.25rem,4.5vw,1.8rem);color:#3b2ba8;line-height:1.15}
.kqg-w .kq-x{background:#f4f1ff;color:#4338ca;border:0;border-radius:50%;width:40px;height:40px;font-weight:800;cursor:pointer;box-shadow:0 3px 0 #ddd6fe}
.kqg-w .kq-x:hover{background:#ede9fe;color:#4338ca}
.kqg-xx{position:absolute;top:14px;right:14px;z-index:3}
.kqg-w .kecil{color:#5f5a82}
.kq-dlg.shake{animation:kqgShake .45s}

/* tombol kuning besar */
.kqg-big,.kqg-w .kq-btn.pri{font-family:'Baloo 2',sans-serif;font-weight:800;color:#4a2a00;border:0;cursor:pointer;background:linear-gradient(180deg,#fff08a,#ffd23f 50%,#fbbf24);transition:transform .1s,box-shadow .1s;position:relative;overflow:hidden}
.kqg-big{display:block;width:100%;font-size:1.5rem;padding:15px 20px;border-radius:26px;box-shadow:0 8px 0 #c98a00,0 18px 28px #c98a0055,inset 0 3px 0 #fffb;letter-spacing:.3px}
.kqg-big:not(:disabled){animation:kqgGlowBtn 2s ease-in-out infinite}
.kqg-big:not(:disabled)::after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,#ffffffaa,transparent);transform:skewX(-20deg);animation:kqgShine 3s ease-in-out infinite}
.kqg-w .kq-btn.pri{font-size:1.1rem;padding:10px 24px;border-radius:20px;box-shadow:0 5px 0 #c98a00,0 10px 18px #c98a0044,inset 0 2px 0 #fffb}
.kqg-big:hover:not(:disabled),.kqg-w .kq-btn.pri:hover:not(:disabled){transform:translateY(-2px)}
.kqg-big:active:not(:disabled){transform:translateY(6px);box-shadow:0 2px 0 #c98a00,0 6px 10px #c98a0055,inset 0 3px 0 #fffb}
.kqg-w .kq-btn.pri:active{transform:translateY(3px);box-shadow:0 2px 0 #c98a00}
.kqg-big:disabled{filter:grayscale(.75);opacity:.5;cursor:not-allowed}
.kqg-w .kq-btn:not(.pri){border-radius:20px;background:#fff;color:#4338ca;border:2px solid #ddd6fe;box-shadow:0 3px 0 #ddd6fe}

/* soal dan pilihan jawaban */
.kqg-w .kq-q{font-family:'Baloo 2',sans-serif;font-size:clamp(1.15rem,3.6vw,1.5rem);line-height:1.35;background:linear-gradient(135deg,#f4f1ff,#e3f6ff);border:3px solid #ddd6fe;border-radius:22px;padding:14px 18px;margin:12px 0;box-shadow:0 5px 0 #ddd6fe;color:#2e1f8f}
.kqg-w .kq-q.flash-ok{animation:kqgFlashOk .7s}
.kqg-w .kq-o{display:flex;align-items:center;gap:12px;width:100%;text-align:left;font:inherit;font-weight:800;font-size:1.05rem;padding:12px 14px;margin:10px 0;border-radius:20px;border:3px solid #e0daf7;background:#fff;color:#1f1b4d;box-shadow:0 5px 0 #e0daf7;cursor:pointer;transition:transform .12s,border-color .12s}
.kqg-w .kq-o:hover:not(:disabled){transform:translateY(-2px);border-color:#6c4cf1}
.kqg-w .kq-o:active:not(:disabled){transform:translateY(3px);box-shadow:0 2px 0 #e0daf7}
.kqg-w .kq-o .kq-let{flex:none;width:38px;height:38px;border-radius:13px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;background:#6c4cf1;box-shadow:inset 0 -3px 0 #0003}
.kqg-w .kq-o:nth-of-type(2) .kq-let{background:#0ea5e9}.kqg-w .kq-o:nth-of-type(3) .kq-let{background:#14b8a6}.kqg-w .kq-o:nth-of-type(4) .kq-let{background:#f59e0b}
.kqg-w .kq-o.ok{border-color:#16a34a;background:#dcfce7;box-shadow:0 5px 0 #16a34a;animation:kqgPopSm .45s}
.kqg-w .kq-o.no{border-color:#ef4444;background:#fee2e2;box-shadow:0 5px 0 #ef4444;animation:kqgShake .45s}
.kqg-w .kq-fb{border-radius:20px;padding:12px 16px;margin-top:10px;font-weight:700}
.kqg-w .kq-fb.ok{background:#dcfce7;color:#14532d}.kqg-w .kq-fb.no{background:#fee2e2;color:#7f1d1d}

/* gembok 3D */
.kqg-lock3d{display:block;position:relative;width:var(--w,88px);filter:drop-shadow(0 8px 6px #3b2fb855)}
.kqg-lock3d svg{display:block;width:100%;height:auto;overflow:visible}
.kqg-lock3d .sh{transform-origin:71px 60px;transition:transform .6s cubic-bezier(.3,1.7,.5,1)}
.kqg-lock3d.open .sh,.kqg-slot.open .kqg-lock3d .sh{transform:translateY(-10px) rotate(34deg)}
.kqg-lock3d .sp{position:absolute;inset:-14%;pointer-events:none;opacity:0;background:radial-gradient(circle at 12% 20%,#fff 0 3px,transparent 4px),radial-gradient(circle at 88% 14%,#fde68a 0 4px,transparent 5px),radial-gradient(circle at 94% 70%,#fff 0 3px,transparent 4px),radial-gradient(circle at 6% 74%,#fde68a 0 3px,transparent 4px)}
.kqg-lock3d.open .sp,.kqg-slot.open .kqg-lock3d .sp{animation:kqgSpark .9s ease-out}

/* pintu masuk */
.kqg-hero{position:relative;display:flex;justify-content:center;align-items:center;height:150px;margin-top:6px}
.kqg-halo{position:absolute;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,#fde68a 0,#fde68a66 42%,transparent 70%);animation:kqgPulse 2.8s ease-in-out infinite}
.kqg-hero .kqg-lock3d{animation:kqgBob 2.6s ease-in-out infinite}
.kqg-title{font-family:'Baloo 2',sans-serif;font-size:clamp(1.7rem,6.5vw,2.3rem);line-height:1.05;margin:6px 0 6px;text-align:center;color:#3b2ba8;background:linear-gradient(90deg,#4f2fe0,#2563eb 55%,#0d9488);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.kqg-sub{text-align:center;color:#5f5a82;margin:0 0 4px;font-weight:600;line-height:1.45}
.kqg-cells{display:flex;gap:clamp(5px,1.8vw,10px);justify-content:center;margin:18px 0 8px}
.kqg-cell{width:clamp(40px,12.5vw,56px);min-width:0;height:clamp(54px,16vw,70px);padding:0;text-align:center;font-family:'Baloo 2',sans-serif;font-size:1.85rem;font-weight:800;text-transform:uppercase;border-radius:17px;border:3px solid #cfc6fb;background:linear-gradient(180deg,#faf9ff,#efeaff);color:#3b2ba8;box-shadow:0 5px 0 #cfc6fb,inset 0 2px 0 #fff;transition:transform .12s,box-shadow .12s,border-color .12s}
.kqg-cell.on{border-color:#facc15;background:linear-gradient(180deg,#fffbe0,#fff1a8);box-shadow:0 5px 0 #eab308,inset 0 2px 0 #fff}
.kqg-cell:focus{outline:0;border-color:#6c4cf1;background:#fff;box-shadow:0 5px 0 #6c4cf1,0 0 0 5px #6c4cf133;transform:translateY(-3px)}
.kqg-cell.bad{animation:kqgShake .4s;border-color:#ef4444;box-shadow:0 5px 0 #ef4444}
.kqg-info{min-height:76px;margin:8px 0 16px;text-align:center;font-weight:700;color:#5f5a82;display:flex;align-items:center;justify-content:center}.kqg-info.err{color:#dc2626}
.kqg-hints{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.kqg-hints i,.kqg-chips i{font-style:normal;font-size:.85rem;font-weight:800;background:#f4f1ff;border:2px solid #ddd6fe;border-radius:999px;padding:3px 12px;color:#4338ca}
.kqg-found{display:flex;gap:12px;align-items:center;text-align:left;width:100%;background:linear-gradient(135deg,#f4f1ff,#e6f7ff);border:3px solid #ddd6fe;border-radius:22px;padding:10px 12px;animation:kqgIn .35s cubic-bezier(.2,1.3,.4,1)}
.kqg-found .ico{width:54px;height:54px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:1.9rem;flex:none;box-shadow:inset 0 -4px 0 #0003}
.kqg-found b{display:block;color:#2e1f8f;line-height:1.2;margin-bottom:2px}
.kqg-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}
.kqg-chips i.t{font-family:'Baloo 2',sans-serif;font-size:1.15rem;line-height:1.2;background:linear-gradient(180deg,#60a5fa,#6c4cf1);color:#fff;border-color:#4c3fd0;box-shadow:0 3px 0 #3b2fb8}

/* escape room: HUD dan timer */
.kqg-hud2{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:8px 0 12px}
.kqg-timebox{flex:1 1 200px;min-width:170px}
.kqg-timer{display:inline-block;font-family:'Baloo 2',sans-serif;font-size:clamp(1.5rem,6vw,2.1rem);line-height:1.1;font-weight:800;color:#fff;padding:3px 22px;border-radius:999px;letter-spacing:1px;background:linear-gradient(180deg,#60a5fa,#6c4cf1);box-shadow:0 5px 0 #3b2fb8,0 10px 18px #3b2fb855}
.kqg-timer.low{background:linear-gradient(180deg,#f87171,#dc2626);box-shadow:0 5px 0 #991b1b;animation:kqgPulse .8s infinite}
.kqg-timer.hit{animation:kqgShake .45s}
.kqg-tbar{height:12px;margin-top:10px;border-radius:999px;background:#e5e7fb;overflow:hidden;box-shadow:inset 0 2px 0 #0002}
.kqg-tbar i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#14b8a6,#5eead4);transition:width 1s linear}
.kqg-tbar i.mid{background:linear-gradient(90deg,#f59e0b,#fde047)}.kqg-tbar i.low{background:linear-gradient(90deg,#dc2626,#f87171)}
.kqg-pill{font-weight:800;padding:6px 14px;border-radius:999px;background:#f4f1ff;border:2px solid #ddd6fe;color:#2e1f8f;box-shadow:0 3px 0 #ddd6fe}
.kqg-pill.coin{background:#fef9c3;border-color:#facc15;color:#713f12;box-shadow:0 3px 0 #eab308}
.kqg-snd{font:inherit;font-size:1.1rem;width:40px;height:40px;border-radius:50%;border:2px solid #ddd6fe;background:#fff;cursor:pointer;box-shadow:0 3px 0 #ddd6fe}

/* escape room: pemandangan laboratorium */
.kqg-scene{position:relative;height:clamp(330px,58vw,430px);border-radius:26px;overflow:hidden;background:linear-gradient(180deg,#4c35d6 0%,#3b52e0 58%,#0f766e 58.1%,#115e59 100%);box-shadow:inset 0 0 0 4px #ffffff40,0 12px 26px #3b2fb855}
.kqg-scene.fail{filter:grayscale(.65) brightness(.85)}
.kqg-scene .wall{position:absolute;inset:0 0 42% 0;background:repeating-linear-gradient(0deg,#ffffff14 0 2px,transparent 2px 36px),repeating-linear-gradient(90deg,#ffffff0e 0 2px,transparent 2px 52px)}
.kqg-scene .flr{position:absolute;left:-40%;right:-40%;top:58%;height:90%;background:conic-gradient(#14b8a6 25%,#0f9488 0 50%,#14b8a6 0 75%,#0f9488 0) 0 0/70px 70px;transform:perspective(380px) rotateX(58deg);transform-origin:50% 0;box-shadow:0 -6px 0 #0b5f58}
.kqg-scene .lamp{position:absolute;left:50%;top:-8%;width:70%;height:70%;transform:translateX(-50%);background:radial-gradient(ellipse at 50% 0,#fde68a88,transparent 68%)}
.kqg-sign{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:4;background:linear-gradient(180deg,#ffe066,#facc15);color:#4a2a00;font-family:'Baloo 2',sans-serif;font-weight:800;font-size:.85rem;letter-spacing:1px;padding:1px 16px;border-radius:12px;box-shadow:0 4px 0 #c98a00}
.kqg-chalk{position:absolute;left:3.5%;top:11%;width:22%;min-width:84px;display:flex;flex-direction:column;gap:1px;padding:6px 7px;background:#0f4c47;border:5px solid #b45309;border-radius:8px;box-shadow:inset 0 0 12px #0008,0 5px 0 #78350f;color:#e8fff8;font-family:'Baloo 2',sans-serif;font-size:clamp(.58rem,1.9vw,.95rem);line-height:1.2;z-index:1}
.kqg-chalk b{color:#fde68a}
.kqg-shelfr{position:absolute;right:3.5%;top:12%;width:22%;min-width:84px;z-index:1;display:flex;flex-wrap:wrap;gap:4px 8px;align-items:flex-end;font-size:clamp(1.1rem,3.6vw,1.7rem)}
.kqg-shelfr .row{display:flex;align-items:flex-end;gap:3px;width:100%;padding:0 4px 3px;border-bottom:7px solid #92400e;border-radius:0 0 4px 4px;box-shadow:0 4px 0 #5b2a0a}
.kqg-shelfr .bk{display:block;width:clamp(9px,2.4vw,15px);border-radius:3px 3px 0 0;box-shadow:inset -3px 0 0 #0003,inset 0 3px 0 #fff5}
.kqg-shelfr .b1{height:clamp(28px,7vw,44px);background:#f472b6}.kqg-shelfr .b2{height:clamp(22px,6vw,38px);background:#facc15}.kqg-shelfr .b3{height:clamp(32px,8vw,50px);background:#34d399}
.kqg-shelfr .bkr{display:block;width:clamp(22px,5.6vw,34px);margin-left:auto}.kqg-shelfr .bkr svg{display:block;width:100%;height:auto}
.kqg-doorwrap{position:absolute;left:0;right:0;top:11%;height:64%;display:flex;justify-content:center;perspective:1100px;z-index:2}
.kqg-frame{position:relative;width:min(48%,260px);height:100%;filter:drop-shadow(0 12px 12px #0006)}
.kqg-exit,.kqg-door{position:absolute;inset:0;border-radius:46% 46% 12px 12px/22% 22% 12px 12px}
.kqg-exit{overflow:hidden;background:radial-gradient(circle,#fffbe0,#fde047 45%,#f59e0b);display:flex;align-items:center;justify-content:center;font-size:2.6rem}
.kqg-exit .rays{position:absolute;inset:-60%;background:repeating-conic-gradient(#fff7 0 10deg,#fff0 10deg 24deg);opacity:0;transition:opacity .6s}
.kqg-scene.out .kqg-exit .rays{opacity:1;animation:kqgSpin 8s linear infinite}
.kqg-exit span{position:relative;animation:kqgPulse 1.6s infinite}
.kqg-door{transform-origin:left center;transition:transform 1.2s cubic-bezier(.5,0,.2,1);display:flex;align-items:center;justify-content:center;padding-top:8%;border:6px solid #2a2080;background:radial-gradient(circle at 12px 14px,#ffe27a 0 3px,#a87a00 4px,transparent 5px),radial-gradient(circle at calc(100% - 12px) 14px,#ffe27a 0 3px,#a87a00 4px,transparent 5px),radial-gradient(circle at 12px calc(100% - 14px),#ffe27a 0 3px,#a87a00 4px,transparent 5px),radial-gradient(circle at calc(100% - 12px) calc(100% - 14px),#ffe27a 0 3px,#a87a00 4px,transparent 5px),linear-gradient(150deg,#9b86ff,#5d47e6 55%,#3a2cae);box-shadow:inset 0 0 0 4px #ffffff30,inset 0 -14px 24px #0005,inset 0 10px 14px #fff3}
.kqg-scene.out .kqg-door{transform:rotateY(-78deg)}
.kqg-slots{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(3px,1vw,8px);width:92%}
.kqg-slot{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;min-width:0;padding:5px 0 3px;border-radius:14px;border:2px solid #ffffff44;background:#ffffff22;color:#fff;font-family:'Baloo 2',sans-serif;font-weight:800;cursor:pointer;position:relative;transition:transform .15s,background .3s}
.kqg-slot:hover:not(.open){transform:translateY(-3px) scale(1.06);background:#ffffff40}
.kqg-slot em{font-style:normal;font-size:.95rem;line-height:1.1}
.kqg-slot.cur{outline:3px solid #fde047;animation:kqgPulse 1s infinite}
.kqg-slot.open{background:radial-gradient(circle,#22c55e99,#16a34a66);border-color:#fde047;cursor:default;animation:kqgBounce .5s;box-shadow:0 0 16px #4ade80aa}
.kqg-slot.open em{color:#fde047;font-size:1.3rem;animation:kqgFlip .5s .15s both}
.kqg-slot.shake{animation:kqgShake .4s}
.kqg-ringfx{position:absolute;left:50%;top:45%;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;border:4px solid #fde047;pointer-events:none;animation:kqgRing .8s ease-out forwards}
.kqg-char{position:absolute;left:4%;bottom:3%;width:clamp(74px,16vw,110px);z-index:3;animation:kqgBob 2.4s ease-in-out infinite;filter:drop-shadow(0 10px 6px #0005)}
.kqg-char svg{display:block;width:100%;height:auto}
.kqg-char .m-hap,.kqg-char .m-sad{display:none}
.kqg-char.happy .m-ok,.kqg-char.sad .m-ok{display:none}.kqg-char.happy .m-hap{display:inline}.kqg-char.sad .m-sad{display:inline}
.kqg-char.happy{animation:kqgJump .8s}.kqg-char.sad{animation:kqgShake .6s}
.kqg-char .arm{transform-origin:105px 108px}.kqg-char.happy .arm{animation:kqgWave .5s ease-in-out 2}
.kqg-books{position:absolute;right:4%;bottom:3%;width:clamp(60px,13vw,92px);z-index:3;filter:drop-shadow(0 8px 6px #0005)}
.kqg-books svg{display:block;width:100%;height:auto}
.kqg-codes{display:flex;gap:8px;justify-content:center;margin:16px 0 4px}
.kqg-cb{width:clamp(38px,12vw,54px);height:clamp(48px,14vw,62px);display:flex;align-items:center;justify-content:center;font-family:'Baloo 2',sans-serif;font-size:1.6rem;font-weight:800;border-radius:15px;border:3px solid #ddd6fe;background:#f8f7ff;color:#c4b5fd;box-shadow:0 5px 0 #ddd6fe}
.kqg-cb.on{background:linear-gradient(180deg,#fff08a,#ffd23f);border-color:#eab308;color:#4a2a00;box-shadow:0 5px 0 #c98a00;animation:kqgBounce .5s}
.kqg-tip{text-align:center;font-weight:800;color:#4338ca;background:#eef2ff;border:2px dashed #c7d2fe;border-radius:18px;padding:12px;margin-top:12px}

/* efek dan hadiah */
.kqg-p{position:fixed;z-index:100000;pointer-events:none;font-size:1.5rem}
.kqg-ft{position:fixed;z-index:100001;pointer-events:none;font-family:'Baloo 2',sans-serif;font-weight:800;font-size:1.9rem;text-shadow:0 2px 0 #fff,0 0 10px #fff;animation:kqgFloatUp 1.3s forwards}
.kqg-ft.ok{color:#15803d}.kqg-ft.bad{color:#dc2626}
@keyframes kqgFloatUp{0%{opacity:0;transform:translate(-50%,10px) scale(.6)}20%{opacity:1;transform:translate(-50%,0) scale(1.15)}100%{opacity:0;transform:translate(-50%,-60px) scale(1)}}
.kqg-flashbad{position:fixed;inset:0;z-index:99999;pointer-events:none;background:radial-gradient(circle,#ef444400 35%,#ef4444aa);animation:kqgFlashBad .6s ease-out forwards}
.kqg-reward{text-align:center;padding:10px 0}
.kqg-reward h3{font-family:'Baloo 2',sans-serif;font-size:1.8rem;color:#2e1f8f}
.kqg-trophywrap{position:relative;display:flex;justify-content:center;align-items:center;height:110px}
.kqg-trophywrap .kqg-halo{width:130px;height:130px}
.kqg-trophy{position:relative;font-size:3.8rem;animation:kqgBounce .8s}
.kqg-starsrow{display:flex;justify-content:center;gap:6px;font-size:2.8rem;margin:6px 0}
.kqg-starsrow .s{filter:grayscale(1) opacity(.35)}.kqg-starsrow .s.on{filter:drop-shadow(0 4px 4px #f59e0b88);animation:kqgBounce .6s both}
.kqg-coinrow{display:inline-block;font-family:'Baloo 2',sans-serif;font-size:1.55rem;font-weight:800;background:#fef9c3;border:3px solid #facc15;border-radius:999px;padding:4px 20px;margin:6px 0;color:#713f12;box-shadow:0 4px 0 #eab308}
.kqg-reward .kqg-big{max-width:340px;margin:14px auto 0}

/* animasi */
@keyframes kqgIn{from{opacity:0;transform:translateY(18px) scale(.93)}to{opacity:1;transform:none}}
@keyframes kqgShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
@keyframes kqgPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
@keyframes kqgBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes kqgPopSm{0%{transform:scale(.97)}50%{transform:scale(1.03)}100%{transform:scale(1)}}
@keyframes kqgBounce{0%{transform:scale(.3)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
@keyframes kqgJump{0%{transform:translateY(0)}30%{transform:translateY(-28px) rotate(-6deg)}60%{transform:translateY(0)}80%{transform:translateY(-9px)}100%{transform:translateY(0)}}
@keyframes kqgFlashOk{0%{box-shadow:0 0 0 0 #22c55e99,0 5px 0 #ddd6fe}100%{box-shadow:0 0 0 18px #22c55e00,0 5px 0 #ddd6fe}}
@keyframes kqgFlashBad{0%{opacity:1}100%{opacity:0}}
@keyframes kqgDrift{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-18px) rotate(8deg)}}
@keyframes kqgRise{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:1}100%{transform:translateY(-110vh) translateX(24px);opacity:0}}
@keyframes kqgBub{0%,100%{transform:translateY(0);opacity:.8}50%{transform:translateY(-8px);opacity:.4}}
@keyframes kqgGlowBtn{0%,100%{box-shadow:0 8px 0 #c98a00,0 18px 28px #c98a0055,inset 0 3px 0 #fffb}50%{box-shadow:0 8px 0 #c98a00,0 18px 38px #ffd23faa,inset 0 3px 0 #fffb}}
@keyframes kqgShine{0%,60%{left:-60%}100%{left:140%}}
@keyframes kqgSpark{0%{opacity:0;transform:scale(.5)}30%{opacity:1}100%{opacity:0;transform:scale(1.5)}}
@keyframes kqgRing{0%{opacity:1;transform:scale(.4)}100%{opacity:0;transform:scale(3.6)}}
@keyframes kqgFlip{0%{transform:rotateX(90deg) scale(.5)}100%{transform:none}}
@keyframes kqgSpin{to{transform:rotate(360deg)}}
@keyframes kqgWave{0%,100%{transform:rotate(0)}50%{transform:rotate(-28deg)}}
@media (min-width:560px){.kqg-shelfr{gap:6px 10px}}
/* ===== Ular Tangga 3D: dunia petualangan fantasi ===== */
.kq-ov.kqg-lab .kq-dlg.kqs-dlg{max-width:1020px;padding:16px 18px 20px}
.kq-ov.kqs-world{background:linear-gradient(180deg,#4f35e6 0%,#7a6bff 30%,#5eb4ff 62%,#8ff0d4 100%)}
.kqs-world .kqg-wallgrid,.kqs-world .kqg-floorbg{display:none}
.kqs-cloud{position:absolute;left:0;height:34px;width:110px;border-radius:999px;background:#fff;opacity:.9;box-shadow:0 8px 0 #dbeafe;animation:kqsCloud 42s linear infinite}
.kqs-cloud::before,.kqs-cloud::after{content:"";position:absolute;background:#fff;border-radius:50%}
.kqs-cloud::before{width:54px;height:54px;left:18px;top:-26px}
.kqs-cloud::after{width:40px;height:40px;left:58px;top:-18px}
.kqs-hill{position:absolute;border-radius:50%}
.kqs-hill.h1{left:-12%;bottom:-24%;width:62%;height:46%;background:#34d399;box-shadow:inset 0 14px 0 #6ee7b7}
.kqs-hill.h2{right:-14%;bottom:-30%;width:72%;height:52%;background:#10b981;box-shadow:inset 0 14px 0 #34d399}
.kqs-castle{position:absolute;left:4%;bottom:7%;font-size:clamp(2.4rem,7vw,4.6rem);filter:drop-shadow(0 8px 6px #0004)}
.kqs-rainbow{position:absolute;right:6%;top:7%;font-size:clamp(2.2rem,6vw,4rem);opacity:.9}
@keyframes kqsCloud{from{transform:translateX(-180px)}to{transform:translateX(calc(100vw + 180px))}}

/* banner giliran + progres */
.kqs-turn{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:8px 0 12px;padding:10px 14px;border-radius:24px;background:linear-gradient(135deg,#f4f1ff,#e3f6ff);border:3px solid var(--c,#6c4cf1);box-shadow:0 5px 0 var(--c,#6c4cf1);transition:border-color .3s,box-shadow .3s}
.kqs-turn.pop{animation:kqgPopSm .5s}
.kqs-tpawn{width:42px;flex:none}.kqs-tpawn svg{display:block;width:100%;height:auto}
.kqs-ttx{flex:1 1 180px;min-width:0}
.kqs-ttx b{display:block;font-family:'Baloo 2',sans-serif;font-size:1.3rem;color:#2e1f8f;line-height:1.1}
.kqs-ttx span{display:block;color:#5f5a82;font-weight:700;font-size:.92rem;line-height:1.3}
.kqs-prog{flex:1 1 200px;min-width:170px;font-weight:800;font-size:.85rem;color:#2e1f8f}
.kqs-bar{height:14px;margin-top:5px;border-radius:999px;background:#e5e7fb;overflow:hidden;box-shadow:inset 0 2px 0 #0002}
.kqs-bar i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#14b8a6,#fde047);transition:width .5s}

/* papan */
.kqs-main{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(250px,.7fr);gap:16px;align-items:start}
.kqs-boardcol{min-width:0}
.kqs-board{max-width:640px;margin:0 auto;padding:10px;border-radius:30px;background:linear-gradient(145deg,#8b6cff,#4338ca);box-shadow:0 10px 0 #2e1f8f,0 22px 30px #1b0f5a55,inset 0 3px 0 #ffffff55}
.kqs-play{position:relative;border-radius:20px}
.kqs-grid{display:grid;grid-template-columns:repeat(6,1fr);aspect-ratio:1;border-radius:20px;overflow:hidden;background:#fff}
.kqs-c{position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;padding:6px 8px;min-width:0;--g:linear-gradient(180deg,#ddd6fe,#a78bfa)}
.kqs-c::before{content:"";position:absolute;inset:2px;border-radius:14px;background:var(--g);box-shadow:inset 0 -5px 0 #0002,inset 0 3px 0 #fff8}
.kqs-c.t1{--g:linear-gradient(180deg,#bfdbfe,#60a5fa)}
.kqs-c.t2{--g:linear-gradient(180deg,#b9f8ea,#4fd8c0)}
.kqs-c.t3{--g:linear-gradient(180deg,#fff0a6,#fcd34d)}
.kqs-c.fin{--g:linear-gradient(180deg,#fff7ad,#f59e0b)}
.kqs-c b{position:relative;z-index:1;font-family:'Baloo 2',sans-serif;font-size:clamp(.62rem,1.7vw,.9rem);line-height:1;color:#2e1f8f;opacity:.75}
.kqs-c .ic{position:relative;z-index:1;align-self:center;font-size:clamp(.9rem,3.2vw,1.7rem);line-height:1;margin-bottom:6%}
.kqs-c.q .ic{animation:kqgBob 1.6s ease-in-out infinite}
.kqs-c.flash::after{content:"";position:absolute;inset:2px;border-radius:14px;z-index:2;box-shadow:0 0 0 4px #fff,0 0 22px 6px #fde047;animation:kqsFlash .8s forwards}
@keyframes kqsFlash{0%{opacity:1}100%{opacity:0}}
.kqs-svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;overflow:visible}

/* pion siswa */
.kqs-pawns{position:absolute;inset:0;pointer-events:none;z-index:3}
.kqs-pawn{position:absolute;width:9.5%;left:8.3%;top:91.6%;transform:translate(calc(-50% + var(--ox,0%)),calc(-68% + var(--oy,0%)));transition:left .22s ease-out,top .22s ease-out}
.kqs-pawn::before{content:"";position:absolute;left:8%;right:8%;bottom:-3%;height:12%;border-radius:50%;background:#1b0f5a;opacity:.3;filter:blur(1.5px)}
.kqs-pawn .in{position:relative;transform-origin:50% 100%;filter:drop-shadow(0 3px 2px #1b0f5a55)}
.kqs-pawn svg{display:block;width:100%;height:auto;overflow:visible}
.kqs-pawn.cur{z-index:2}
.kqs-pawn.cur .in{animation:kqsIdle 1s ease-in-out infinite}
.kqs-pawn.hop .in{animation:kqsHop .22s}
.kqs-pawn.slide{transition:left 1s cubic-bezier(.5,0,.25,1),top 1s cubic-bezier(.5,0,.25,1)}
.kqs-pawn.up .in{animation:kqsClimb .3s ease-in-out infinite}
.kqs-pawn.down .in{animation:kqsDizzy 1s linear}
@keyframes kqsIdle{0%,100%{transform:translateY(0) scale(1,1)}50%{transform:translateY(-8%) scale(1.04,.97)}}
@keyframes kqsHop{0%{transform:translateY(0)}50%{transform:translateY(-38%) scale(1.08,.95)}100%{transform:translateY(0)}}
@keyframes kqsClimb{0%,100%{transform:rotate(-7deg) translateY(0)}50%{transform:rotate(7deg) translateY(-12%)}}
@keyframes kqsDizzy{0%{transform:rotate(0)}100%{transform:rotate(720deg) scale(.9)}}

/* sisi kanan: dadu 3D, tombol, pemain */
.kqs-side{display:flex;flex-direction:column;gap:12px;min-width:0}
.kqs-dicecard{background:linear-gradient(160deg,#ede9fe,#dbeafe);border:3px solid #ddd6fe;border-radius:26px;padding:10px 12px 14px;text-align:center;box-shadow:0 5px 0 #ddd6fe}
.kqs-stage{height:116px;perspective:560px;display:flex;align-items:center;justify-content:center}
.kqs-stage.toss{animation:kqsToss 1s ease-out}
.kqs-tilt{width:62px;height:62px;transform-style:preserve-3d;transform:rotateX(-24deg) rotateY(-32deg)}
.kqs-dice{position:relative;width:62px;height:62px;transform-style:preserve-3d;transition:transform 1s cubic-bezier(.15,.7,.2,1)}
.kqs-f{position:absolute;inset:0;border-radius:13px;background:linear-gradient(145deg,#fff,#e8e4ff);border:2px solid #d4ccfa;box-shadow:inset 0 -4px 0 #cfc6fb;display:grid;grid-template:repeat(3,1fr)/repeat(3,1fr);padding:8px}
.kqs-f i{display:block;width:78%;height:78%;margin:auto;border-radius:50%;background:radial-gradient(circle at 35% 30%,#9a80ff,#4c2fc8)}
.kqs-f.f1 i{background:radial-gradient(circle at 35% 30%,#fda4af,#e11d48)}
.kqs-f.f1{transform:translateZ(31px)}
.kqs-f.f2{transform:rotateY(90deg) translateZ(31px)}
.kqs-f.f3{transform:rotateX(-90deg) translateZ(31px)}
.kqs-f.f4{transform:rotateX(90deg) translateZ(31px)}
.kqs-f.f5{transform:rotateY(-90deg) translateZ(31px)}
.kqs-f.f6{transform:rotateY(180deg) translateZ(31px)}
.kqs-dshadow{width:58px;height:10px;margin:-8px auto 4px;border-radius:50%;background:#1b0f5a;opacity:.22;filter:blur(2px)}
@keyframes kqsToss{0%{transform:translateY(0)}30%{transform:translateY(-34px) scale(1.18)}60%{transform:translateY(0)}78%{transform:translateY(-9px)}100%{transform:translateY(0)}}
.kqs-dval{font-family:'Baloo 2',sans-serif;font-size:1.15rem;font-weight:800;color:#3b2ba8;min-height:1.5em}
.kqs-roll{font-size:1.3rem;padding:12px 16px;margin-top:6px}
.kqs-pls{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px}
.kqs-p{display:flex;gap:8px;align-items:center;padding:7px 10px;border-radius:18px;background:#fff;border:3px solid #e0daf7;box-shadow:0 4px 0 #e0daf7;transition:transform .2s,border-color .2s,box-shadow .2s}
.kqs-p.on{border-color:var(--c);box-shadow:0 4px 0 var(--c);transform:translateY(-2px) scale(1.02);background:#fffdf0}
.kqs-p .av{width:30px;flex:none}.kqs-p .av svg{display:block;width:100%;height:auto}
.kqs-p .inf{flex:1;min-width:0}
.kqs-p b{display:flex;justify-content:space-between;gap:4px;font-size:.82rem;color:#2e1f8f;line-height:1.2}
.kqs-p small{display:block;font-size:.72rem;font-weight:700;color:#5f5a82;margin-top:1px}
.kqs-p .mb{height:7px;margin-top:3px;border-radius:999px;background:#e5e7fb;overflow:hidden}
.kqs-p .mb i{display:block;height:100%;border-radius:999px;background:var(--c);transition:width .5s}

/* panel soal */
#kqg-q.kqs-qp{margin-top:14px;padding:12px 16px 14px;border-radius:28px;background:linear-gradient(160deg,#faf9ff,#eaf6ff);border:3px solid #ddd6fe;box-shadow:0 6px 0 #ddd6fe,0 14px 24px #3b2fb833;animation:kqgIn .4s cubic-bezier(.2,1.3,.4,1)}
#kqg-q.kqs-qp::before{content:attr(data-who);display:inline-block;font-family:'Baloo 2',sans-serif;font-weight:800;background:linear-gradient(180deg,#fff08a,#ffd23f);color:#4a2a00;border-radius:999px;padding:2px 14px;box-shadow:0 3px 0 #c98a00}
@media (max-width:760px){
  .kqs-main{grid-template-columns:1fr}
  .kq-ov.kqg-lab .kq-dlg.kqs-dlg{padding:12px 12px 16px;border-radius:26px}
  .kqs-pls{grid-template-columns:repeat(2,1fr)}
  .kqs-board{padding:7px;border-radius:24px}
  .kqs-c{padding:3px 5px}
}
@media (prefers-reduced-motion:reduce){.kqg-w *,.kqg-w *::before,.kqg-w *::after,.kqg-deco *{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
`;
  document.head.insertAdjacentHTML('beforeend', '<style>' + CSS + '</style>');

  /* ---------- modal (memakai gaya .kq-ov milik dashboard-konten.css, jadi Esc & klik luar tetap berfungsi) ---------- */
  var DECO = [['➕', 5, 12], ['✖️', 91, 9], ['π', 9, 58], ['√', 88, 54], ['÷', 50, 6], ['x²', 21, 28], ['∑', 78, 30], ['%', 94, 76], ['🧪', 3, 40], ['📚', 94, 40], ['⚗️', 26, 88], ['🔬', 70, 90]];
  var BUB = [8, 22, 38, 55, 71, 86];
  function labBg(entry) {
    return '<div class="kqg-deco" aria-hidden="true"><i class="kqg-wallgrid"></i><i class="kqg-glow"></i><i class="kqg-floorbg"></i>' +
      DECO.map(function (d, i) { return '<span style="left:' + d[1] + '%;top:' + d[2] + '%;animation-delay:-' + (i * 0.8) + 's">' + d[0] + '</span>'; }).join('') +
      BUB.map(function (l, i) { return '<b class="bub" style="left:' + l + '%;animation-delay:-' + (i * 1.6) + 's"></b>'; }).join('') +
      (entry ? '<div class="kqg-prop stu">' + studentSvg() + '</div><div class="kqg-prop bks">' + bookStack() + '</div><div class="kqg-prop bkr">' + beaker() + '</div>' : '') + '</div>';
  }
  function modal(html, cls) {
    closeM();
    var ov = document.createElement('div'), lab = /kqg-w/.test(cls || '');
    ov.className = 'kq-ov' + (lab ? ' kqg-lab' : (document.documentElement.getAttribute('data-theme') === 'dark' ? ' kq-dark' : ''));
    ov.innerHTML = (lab ? labBg(/kqg-entry/.test(cls || '')) : '') + '<div class="kq-dlg ' + (cls || '') + '" role="dialog" aria-modal="true">' + html + '</div>';
    document.body.appendChild(ov); document.body.style.overflow = 'hidden';
  }
  function closeM() {
    clearInterval(TM); Q = null; ST = null;
    var o = document.querySelector('.kq-ov'); if (o) o.remove();
    document.body.style.overflow = '';
  }
  function mhead(t) { return '<div class="kq-mh"><h3>' + t + '</h3><button class="kq-x" data-g="close" aria-label="Tutup">✕</button></div>'; }
  function showErr(m) { var e = $('kqg-err'); if (e) e.innerHTML = '<div class="kq-err">' + esc(m) + '</div>'; else toast(m); }

  /* ---------- tab Game di Dashboard ---------- */
  function modeHtml() {
    if (problem) return '<div class="kq-mode bad">⚠️ ' + esc(problem) + '</div>';
    return mode === 'online' ? '<div class="kq-mode on">☁️ Tersambung. Kode game bisa dipakai siswa di perangkat mana pun.</div>'
      : '<div class="kq-mode off">💾 Mode lokal: kode baru berfungsi di browser ini saja. Hubungkan Supabase (lihat game-setup.sql).</div>';
  }
  function cardHtml(x) {
    var J = JENIS[x.game] || JENIS.ular, o = x.opsi || {};
    var det = x.game === 'ular' ? (o.pemain || 2) + ' pemain, giliran bergantian' : x.game === 'katak' ? (o.nyawa || 3) + ' nyawa, soal salah muncul lagi' : (o.menit || 10) + ' menit, 6 gembok';
    return '<article class="kq-card"><div class="kq-top" style="background:linear-gradient(135deg,' + J.c1 + ',' + J.c2 + ')"><span class="kq-emo">' + J.e + '</span><span class="kq-kls">Kelas ' + esc(x.kelas) + '</span></div>' +
      '<div class="kq-body"><div class="kq-tp" style="color:' + J.c1 + '">' + J.n + '</div><h4>' + esc(x.judul) + '</h4><p class="kq-sum">' + esc(det) + '</p>' +
      '<div class="kq-meta">📝 ' + x.butir.length + ' soal · ' + esc(x.topik) + '</div>' +
      '<button class="kq-code" data-g="copy" data-code="' + esc(x.kode) + '" title="Salin kode">🔑 <b>' + esc(x.kode) + '</b><span>Salin</span></button>' +
      '<div class="kq-acts"><button class="kq-btn pri sm" data-g="play" data-id="' + x.id + '">Mainkan</button>' +
      '<button class="kq-btn sm" data-g="link" data-code="' + esc(x.kode) + '">Tautan</button>' +
      '<button class="kq-btn sm dng" data-g="del" data-id="' + x.id + '">Hapus</button></div></div></article>';
  }
  function panelHtml() {
    var body;
    if (loading) body = '<div class="kq-empty"><div class="big">⏳</div><h4>Memuat…</h4></div>';
    else if (!G.length) body = '<div class="kq-empty"><div class="big">🎮</div><h4>Belum ada game</h4><p>Pilih Ular Tangga, Jump &amp; Solve, atau Math Escape Room, isi soalnya, lalu bagikan kodenya ke siswa.</p>' +
      '<div class="row"><button class="kq-btn pri" data-g="new">+ Buat game</button><button class="kq-btn" data-g="seed">✨ Isi dengan contoh</button></div></div>';
    else body = '<div class="kq-grid">' + G.map(cardHtml).join('') + '</div>';
    return '<div class="kq-panel"><div class="kq-head"><div><h3>🎮 Game edukasi</h3><p>Buat game dari soal pilihan ganda, lalu bagikan kodenya ke siswa.</p></div>' +
      '<button class="kq-btn pri" data-g="new">+ Buat game</button></div>' + modeHtml() + '<div class="kq-list">' + body + '</div></div>';
  }
  function draw() { var p = $('kqg-panel'); if (active && p) p.innerHTML = panelHtml(); }
  function ensure() {
    // kotak "Kode Game" di Beranda (di samping Kode Kelas dan Kode Latihan Soal)
    var cc = $('kq-codes');
    if (cc && !cc.querySelector('[data-kind="game"]')) {
      cc.insertAdjacentHTML('beforeend', '<div class="kq-cc" data-kind="game"><div class="kq-cc-h"><div class="kq-cc-ic">🎮</div><div class="kq-cc-tx"><b>Kode Game</b><span>Mainkan game dari gurumu</span></div></div>' +
        '<div class="kq-cc-in"><input class="kq-cc-input" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="CONTOH: GK7M2Q" aria-label="Kode Game">' +
        '<button type="button" class="kq-cc-btn" data-g="join">Main</button></div><div class="kq-cc-msg"></div></div>');
    }
    var w = $('kq'); if (!w) return;
    var tabs = w.querySelector('.kq-tabs'); if (!tabs) return;
    var b = tabs.querySelector('[data-gtab]');
    if (!b) {
      tabs.insertAdjacentHTML('beforeend', '<button class="kq-tab" data-gtab="1"></button>'); b = tabs.lastElementChild;
      if (!inited) { inited = true; refresh(); }
    }
    var h = '🎮 Game <b>' + G.length + '</b>'; if (b.innerHTML !== h) b.innerHTML = h;
    if (active) {
      [].forEach.call(tabs.children, function (x) { x.classList.toggle('on', x === b); });
      [].forEach.call(w.children, function (x) { if (x !== tabs && x.id !== 'kqg-panel' && !x.classList.contains('kq-stats')) x.style.display = 'none'; });
      if (w.nextElementSibling) w.nextElementSibling.style.display = 'none';
      if (!$('kqg-panel')) { var p = document.createElement('div'); p.id = 'kqg-panel'; w.appendChild(p); draw(); }
    }
  }

  /* ---------- buat game ---------- */
  function openType() {
    modal(mhead('🎮 Pilih jenis game') + Object.keys(JENIS).map(function (k) {
      var J = JENIS[k];
      return '<button class="kqg-type" data-g="form" data-j="' + k + '"><span style="background:linear-gradient(135deg,' + J.c1 + ',' + J.c2 + ')">' + J.e + '</span><div><b>' + J.n + '</b><small>' + J.d + '</small></div></button>';
    }).join(''), 'sm');
  }
  function qblock(s) {
    s = s || { q: '', opsi: ['', '', '', ''], jawaban: -1, pembahasan: '' };
    var id = ++qSeq, r = '';
    for (var i = 0; i < 4; i++) r += '<label class="kq-oprow"><input type="radio" name="kqg-a' + id + '" value="' + i + '"' + (s.jawaban === i ? ' checked' : '') + '><span class="kq-let">' + HURUF[i] + '</span>' +
      '<input type="text" class="kq-in s-o" maxlength="120" placeholder="Pilihan ' + HURUF[i] + '" value="' + esc(s.opsi[i] || '') + '"></label>';
    return '<div class="kq-soal"><div class="kq-soal-h"><b class="kq-sn">Soal</b><button type="button" class="kq-mini" data-g="rm-q">Hapus soal</button></div>' +
      '<textarea class="kq-in s-q" rows="2" placeholder="Tulis pertanyaan di sini">' + esc(s.q) + '</textarea><div class="kq-hint">Klik bulatan di samping pilihan yang benar.</div>' + r +
      '<input type="text" class="kq-in s-p" maxlength="240" placeholder="Pembahasan singkat (opsional)" value="' + esc(s.pembahasan || '') + '"></div>';
  }
  function num() { [].forEach.call(document.querySelectorAll('.kq-dlg .kq-soal'), function (b, i) { b.querySelector('.kq-sn').textContent = 'Soal ' + (i + 1); }); }
  function sel(id, arr, def) { return '<select id="' + id + '" class="kq-in">' + arr.map(function (a) { return '<option value="' + a[0] + '"' + (a[0] == def ? ' selected' : '') + '>' + a[1] + '</option>'; }).join('') + '</select>'; }
  function openForm(j) {
    var J = JENIS[j], set = '';
    if (j === 'ular') set = '<label class="kq-lab" for="kqg-pm">Jumlah pemain (bermain bergiliran di satu layar)</label>' + sel('kqg-pm', [[2, '2 pemain'], [3, '3 pemain'], [4, '4 pemain'], [5, '5 pemain'], [6, '6 pemain']], 2);
    if (j === 'katak') set = '<label class="kq-lab" for="kqg-ny">Jumlah nyawa</label>' + sel('kqg-ny', [[3, '3 nyawa'], [5, '5 nyawa'], [7, '7 nyawa']], 3);
    if (j === 'escape') set = '<label class="kq-lab" for="kqg-mn">Waktu untuk membuka 6 gembok</label>' + sel('kqg-mn', [[5, '5 menit'], [10, '10 menit'], [15, '15 menit'], [20, '20 menit']], 10);
    var blocks = ''; for (var i = 0; i < MIN[j]; i++) blocks += qblock();
    modal(mhead(J.e + ' Buat ' + J.n) +
      '<label class="kq-lab" for="kqg-judul">Judul game</label><input id="kqg-judul" class="kq-in" maxlength="80" placeholder="Contoh: Ular Tangga Pythagoras">' +
      '<div class="kq-two"><div><label class="kq-lab" for="kqg-topik">Topik</label>' + sel('kqg-topik', TOPIK.map(function (t) { return [t, t]; }), 'Bilangan') + '</div>' +
      '<div><label class="kq-lab" for="kqg-kelas">Kelas</label>' + sel('kqg-kelas', [[7, 'Kelas 7'], [8, 'Kelas 8'], [9, 'Kelas 9']], 8) + '</div></div>' + set +
      '<div class="kq-hint" style="margin-top:12px">Minimal ' + MIN[j] + ' soal pilihan ganda (maksimal 20).</div><div id="kqg-ql">' + blocks + '</div>' +
      '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="kq-btn sm" data-g="add-q">+ Tambah soal</button><button type="button" class="kq-btn sm" data-g="fill">✨ Isi soal contoh</button></div>' +
      '<div id="kqg-err"></div><div class="kq-foot"><button class="kq-btn" data-g="close">Batal</button><button class="kq-btn pri" data-g="save" data-j="' + j + '">Simpan game</button></div>');
    num();
  }
  async function save(j, btn) {
    var judul = $('kqg-judul').value.trim();
    if (!judul) return showErr('Judul game wajib diisi ya.');
    var bs = document.querySelectorAll('.kq-dlg .kq-soal'), butir = [];
    if (bs.length < MIN[j]) return showErr('Game ini butuh minimal ' + MIN[j] + ' soal.');
    for (var n = 0; n < bs.length; n++) {
      var b = bs[n], q = b.querySelector('.s-q').value.trim(), p = b.querySelector('.s-p').value.trim();
      var ops = [].map.call(b.querySelectorAll('.s-o'), function (i) { return i.value.trim(); });
      var r = b.querySelector('input[type=radio]:checked'), ans = r ? parseInt(r.value, 10) : -1;
      if (!q) return showErr('Soal ' + (n + 1) + ' belum ada pertanyaannya.');
      if (ops.filter(Boolean).length < 2) return showErr('Soal ' + (n + 1) + ' minimal punya 2 pilihan jawaban.');
      if (ans < 0 || !ops[ans]) return showErr('Pilih jawaban yang benar untuk soal ' + (n + 1) + '.');
      var compact = [], map = -1;
      ops.forEach(function (o, i) { if (o) { if (i === ans) map = compact.length; compact.push(o); } });
      butir.push({ q: q, opsi: compact, jawaban: map, pembahasan: p });
    }
    var opsi = j === 'ular' ? { pemain: +$('kqg-pm').value } : j === 'katak' ? { nyawa: +$('kqg-ny').value } : { menit: +$('kqg-mn').value };
    btn.disabled = true; btn.textContent = 'Menyimpan…';
    try {
      var it = await add({ judul: judul, topik: $('kqg-topik').value, kelas: $('kqg-kelas').value, game: j, opsi: opsi, butir: butir });
      draw(); showCode(it);
    } catch (e) { btn.disabled = false; btn.textContent = 'Simpan game'; showErr(humanErr(e)); }
  }
  function linkFor(k) { return location.origin + location.pathname + '?kode=' + k; }
  function showCode(x) {
    modal('<div class="kq-empty" style="padding:4px 0 0"><div class="big">🎉</div><h4>Game tersimpan!</h4>' +
      '<p>Bagikan kode ini ke siswa. Mereka mengetiknya di kotak <b>Kode Game</b> di Beranda, atau membuka tautannya.</p><div class="kq-codebox">' + esc(x.kode) + '</div>' +
      '<div class="row"><button class="kq-btn pri" data-g="copy" data-code="' + esc(x.kode) + '">📋 Salin kode</button><button class="kq-btn" data-g="link" data-code="' + esc(x.kode) + '">🔗 Salin tautan</button></div>' +
      (mode === 'lokal' ? '<div class="kq-note">Mode lokal: kode ini baru bisa dibuka di browser ini.</div>' : '') +
      '<div class="kq-foot" style="justify-content:center"><button class="kq-btn" data-g="close">Selesai</button></div></div>', 'sm');
  }
  function askDel(id) {
    var x = find(id); if (!x) return;
    modal('<div class="kq-empty" style="padding:6px 0 0"><div class="big">🗑️</div><h4>Hapus game ini?</h4><p><b>' + esc(x.judul) + '</b><br>Kode <b>' + esc(x.kode) + '</b> tidak bisa dipakai lagi.</p>' +
      '<div class="row"><button class="kq-btn" data-g="close">Batal</button><button class="kq-btn pri" data-g="dodel" data-id="' + id + '" style="background:#e5484d;border-color:#e5484d">Ya, hapus</button></div><div id="kqg-err"></div></div>', 'sm');
  }
  async function seed() {
    try {
      var d = [['Ular Tangga: Campuran Kelas 8', 'Geometri', 'ular', { pemain: 3 }, 'GULAR7'], ['Jump & Solve: Aljabar', 'Aljabar', 'katak', { nyawa: 3 }, 'GKATAK'], ['Escape Room: Laboratorium Rahasia', 'Bilangan', 'escape', { menit: 10 }, 'GESCAP']];
      for (var i = 0; i < d.length; i++) await add({ judul: d[i][0], topik: d[i][1], kelas: '8', game: d[i][2], opsi: d[i][3], butir: JSON.parse(JSON.stringify(SAMPLE)) }, d[i][4]);
      draw(); toast('Contoh ditambahkan ✨');
    } catch (e) { toast(humanErr(e)); }
  }

  /* ---------- tanya jawab (dipakai ketiga game) ---------- */
  function ask(s, cb, hide, on) {
    var b = $('kqg-q'); if (!b) return;
    Q = { s: s, cb: cb, hide: hide, on: on, ok: false, done: false };
    b.innerHTML = '<div class="kq-q">' + esc(s.q) + '</div>' + s.opsi.map(function (o, i) {
      return '<button class="kq-o" data-g="ans" data-o="' + i + '"><span class="kq-let">' + HURUF[i] + '</span><span>' + esc(o) + '</span></button>';
    }).join('');
    if (b.scrollIntoView) b.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function answer(o) {
    if (!Q || Q.done) return;
    Q.done = true;
    var s = Q.s, ok = o === s.jawaban, b = $('kqg-q'), reveal = ok || !Q.hide;
    Q.ok = ok;
    [].forEach.call(b.querySelectorAll('.kq-o'), function (x, i) {
      x.disabled = true;
      if (i === s.jawaban && reveal) x.classList.add('ok'); else if (i === o && !ok) x.classList.add('no');
    });
    var qq = b.querySelector('.kq-q'); if (qq && ok) qq.classList.add('flash-ok');
    b.insertAdjacentHTML('beforeend', '<div class="kq-fb ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? '🎉 Benar!' : '😅 Belum tepat.') + '</b>' +
      (reveal && !ok ? ' Jawaban yang benar: ' + HURUF[s.jawaban] + '.' : '') + (reveal && s.pembahasan ? '<p>💡 ' + esc(s.pembahasan) + '</p>' : '') + '</div>' +
      '<div class="kq-foot"><button class="kq-btn pri" data-g="qnext">' + (reveal ? 'Lanjut →' : 'Coba lagi') + '</button></div>');
    if (Q.on) Q.on(ok);
  }

  /* ---------- main ---------- */
  function play(g) {
    if (!g) return;
    curG = g; clearInterval(TM);
    modal(mhead(JENIS[g.game].e + ' ' + esc(g.judul)) + '<div id="kqg-st"></div><div id="kqg-q"></div>', 'kqg-w' + (g.game === 'ular' ? ' kqs-dlg' : ''));
    if (g.game === 'ular') playUlar(g); else if (g.game === 'katak') playKatak(g); else playEscape(g);
  }
  /* 🐍 Ular Tangga 3D: papan besar, ular & tangga 3D, pion siswa, dadu 3D, dunia fantasi */
  var PCOL = ['#ef4444', '#3b82f6', '#16a34a', '#f59e0b', '#a855f7', '#ec4899'];
  var PHAIR = ['#3a2412', '#1f1b4d', '#7a4d2a', '#2f1d10', '#5b2a0a', '#111827'];
  var POFF = [[-32, -6], [32, -6], [-32, 18], [32, 18], [0, -18], [0, 28]];
  var SCOL = [['#22c55e', '#bbf7d0', '#15803d'], ['#ec4899', '#fbcfe8', '#9d174d'], ['#f97316', '#fed7aa', '#9a3412']];
  var PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
  var DBASE = { 1: [0, 0], 2: [0, -90], 3: [90, 0], 4: [-90, 0], 5: [0, 90], 6: [0, 180] };
  var WORLD = '<i class="kqs-cloud" style="top:6%;animation-delay:-6s"></i><i class="kqs-cloud" style="top:20%;animation-delay:-20s;transform:scale(.8)"></i><i class="kqs-cloud" style="top:44%;animation-delay:-31s"></i><i class="kqs-cloud" style="top:68%;animation-delay:-12s;transform:scale(.7)"></i>' +
    '<i class="kqs-hill h1"></i><i class="kqs-hill h2"></i><span class="kqs-castle">🏰</span><span class="kqs-rainbow">🌈</span>';
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function pawnSvg(c, h) {
    return '<svg viewBox="0 0 60 80" aria-hidden="true">' +
      '<path d="M10 78c0-20 9-30 20-30s20 10 20 30z" fill="' + c + '" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M17 70c1-10 5-16 11-19" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="4" stroke-linecap="round"/><path d="M24 49l6 8 6-8z" fill="#fff"/>' +
      '<circle cx="30" cy="31" r="19" fill="#ffd9b8" stroke="#fff" stroke-width="3"/>' +
      '<path d="M11 30c0-13 8-20 19-20s19 7 19 20c-6-6-12-9-19-9s-13 3-19 9z" fill="' + h + '"/>' +
      '<polygon points="30,1 56,11 30,21 4,11" fill="#1e3a8a" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M52 12v14" stroke="#facc15" stroke-width="2.5"/><circle cx="52" cy="28" r="3" fill="#facc15"/>' +
      '<circle cx="23" cy="34" r="2.8" fill="#1f1b4d"/><circle cx="37" cy="34" r="2.8" fill="#1f1b4d"/><circle cx="24" cy="33" r="1" fill="#fff"/><circle cx="38" cy="33" r="1" fill="#fff"/>' +
      '<circle cx="17" cy="40" r="3" fill="#ff8fa3" opacity=".6"/><circle cx="43" cy="40" r="3" fill="#ff8fa3" opacity=".6"/>' +
      '<path d="M25 41q5 5 10 0" fill="none" stroke="#7c2d12" stroke-width="2.2" stroke-linecap="round"/></svg>';
  }
  function cxy(k) { var r = Math.floor((k - 1) / 6), i = (k - 1) % 6, c = r % 2 === 0 ? i : 5 - i; return [(c + .5) / 6 * 100, (5 - r + .5) / 6 * 100]; }
  function ladderSvg(k1, k2) {
    var A = cxy(k1), B = cxy(k2), x1 = A[0] * 6, y1 = A[1] * 6, x2 = B[0] * 6, y2 = B[1] * 6;
    var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy), ux = dx / len, uy = dy / len, px = -uy * 15, py = ux * 15, i;
    x1 += ux * 16; y1 += uy * 16; x2 -= ux * 16; y2 -= uy * 16;
    var n = Math.max(3, Math.floor(len / 34)), rails = 'M' + (x1 + px) + ' ' + (y1 + py) + 'L' + (x2 + px) + ' ' + (y2 + py) + 'M' + (x1 - px) + ' ' + (y1 - py) + 'L' + (x2 - px) + ' ' + (y2 - py), rungs = '';
    for (i = 0; i < n; i++) { var t = (i + .5) / n, cx = x1 + (x2 - x1) * t, cy = y1 + (y2 - y1) * t; rungs += 'M' + (cx + px) + ' ' + (cy + py) + 'L' + (cx - px) + ' ' + (cy - py); }
    function p(d, col, w, ex) { return '<path d="' + d + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" fill="none"' + (ex || '') + '/>'; }
    return '<g>' + p(rails + rungs, '#1b0f5a', 10, ' transform="translate(5 8)" opacity=".28"') + p(rails, '#92400e', 13) + p(rungs, '#b45309', 10) + p(rungs, '#fbbf24', 6) + p(rails, '#f59e0b', 9) + p(rails, '#fff3b0', 2.5, ' transform="translate(-1.5 -2)" opacity=".85"') + '</g>';
  }
  function snakeSvg(kh, kt, i) {
    var A = cxy(kh), B = cxy(kt), hx = A[0] * 6, hy = A[1] * 6, tx = B[0] * 6, ty = B[1] * 6, dx = tx - hx, dy = ty - hy, len = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / len, uy = dy / len;
    var amp = Math.min(70, len * .3) * (i % 2 ? -1 : 1), nx = -uy * amp, ny = ux * amp;
    var c1x = hx + dx * .3 + nx, c1y = hy + dy * .3 + ny, c2x = hx + dx * .7 - nx, c2y = hy + dy * .7 - ny;
    var d = 'M' + hx + ' ' + hy + 'C' + c1x + ' ' + c1y + ' ' + c2x + ' ' + c2y + ' ' + tx + ' ' + ty, ang = Math.atan2(hy - c1y, hx - c1x) * 180 / Math.PI, C = SCOL[i % 3];
    function p(col, w, ex) { return '<path d="' + d + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" fill="none"' + (ex || '') + '/>'; }
    return '<g>' + p('#1b0f5a', 22, ' transform="translate(5 8)" opacity=".25"') + p(C[2], 24) + p(C[0], 18) + p(C[1], 7, ' stroke-dasharray="1 20" opacity=".9"') + p('#fff', 4, ' transform="translate(-3 -4)" opacity=".35"') +
      '<circle cx="' + tx + '" cy="' + ty + '" r="5" fill="' + C[2] + '"/>' +
      '<g transform="translate(' + hx + ' ' + hy + ') rotate(' + ang + ')"><path d="M24 0h10m0 0l7-4m-7 4l7 4" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="6" cy="0" rx="22" ry="18" fill="' + C[2] + '"/><ellipse cx="6" cy="0" rx="20" ry="16" fill="' + C[0] + '"/><ellipse cx="2" cy="-8" rx="11" ry="4" fill="#fff" opacity=".35"/>' +
      '<circle cx="10" cy="-9" r="6.5" fill="#fff"/><circle cx="10" cy="9" r="6.5" fill="#fff"/><circle cx="12" cy="-9" r="3.3" fill="#1f1b4d"/><circle cx="12" cy="9" r="3.3" fill="#1f1b4d"/><circle cx="13" cy="-10" r="1.2" fill="#fff"/><circle cx="13" cy="8" r="1.2" fill="#fff"/>' +
      '<circle cx="19" cy="-3" r="2" fill="' + C[2] + '"/><circle cx="19" cy="3" r="2" fill="' + C[2] + '"/><path d="M16 -5q6 5 0 10" fill="none" stroke="#7f1d1d" stroke-width="2" stroke-linecap="round" opacity=".0"/></g></g>';
  }
  function diceFace(v) { return '<div class="kqs-f f' + v + '">' + PIPS[v].map(function (i) { return '<i style="grid-area:' + (Math.floor(i / 3) + 1) + '/' + (i % 3 + 1) + '"></i>'; }).join('') + '</div>'; }

  function playUlar(g) {
    var N = 36, LAD = { 4: 14, 9: 21, 19: 30 }, SNK = { 17: 7, 27: 15, 33: 23 };
    var n = Math.max(2, Math.min(6, +(g.opsi || {}).pemain || 2)), soal = prep(g.butir), qi = 0, sq = {}, pool = [], i, DX = 0, DY = 0;
    var st = $('kqg-st'), qb = $('kqg-q');
    for (i = 2; i < N; i++) if (!LAD[i] && !SNK[i]) pool.push(i);
    shuf(pool).slice(0, Math.min(pool.length, 14)).forEach(function (k) { sq[k] = 1; });
    var S = { pos: [], score: [], ok: [], ask: [], t: 0, busy: false, win: -1, msg: 'Lempar dadunya untuk mulai!' };
    for (i = 0; i < n; i++) { S.pos.push(1); S.score.push(0); S.ok.push(0); S.ask.push(0); }

    var ov = document.querySelector('.kq-ov');
    if (ov) { ov.classList.add('kqs-world'); var dc = ov.querySelector('.kqg-deco'); if (dc) dc.insertAdjacentHTML('beforeend', WORLD); }

    /* kerangka (dibuat sekali, lalu hanya diperbarui supaya animasi tidak terputus) */
    var cells = '', r, c, k, list, svg = '', pawns = '', pls = '';
    for (r = 5; r >= 0; r--) {
      list = []; for (c = 1; c <= 6; c++) list.push(r * 6 + c);
      if (r % 2) list.reverse();
      list.forEach(function (k) {
        var rr = Math.floor((k - 1) / 6), cc = rr % 2 === 0 ? (k - 1) % 6 : 5 - (k - 1) % 6, ic = k === 1 ? '🚩' : k === N ? '🏁' : sq[k] ? '❓' : '';
        cells += '<div class="kqs-c t' + ((rr + cc) % 4) + (sq[k] ? ' q' : '') + (k === N ? ' fin' : '') + '" id="kqs-c' + k + '"><b>' + k + '</b>' + (ic ? '<span class="ic">' + ic + '</span>' : '') + '</div>';
      });
    }
    Object.keys(LAD).forEach(function (a) { svg += ladderSvg(+a, LAD[a]); });
    Object.keys(SNK).forEach(function (a, j) { svg += snakeSvg(+a, SNK[a], j); });
    for (i = 0; i < n; i++) {
      pawns += '<div class="kqs-pawn" id="kqs-pw' + i + '" style="--ox:' + POFF[i][0] + '%;--oy:' + POFF[i][1] + '%"><div class="in">' + pawnSvg(PCOL[i], PHAIR[i]) + '</div></div>';
      pls += '<div class="kqs-p" id="kqs-pc' + i + '" style="--c:' + PCOL[i] + '"><span class="av">' + pawnSvg(PCOL[i], PHAIR[i]) + '</span><div class="inf"><b>Pemain ' + (i + 1) + '<span id="kqs-ps' + i + '">⭐ 0</span></b><small id="kqs-pp' + i + '">Kotak 1</small><div class="mb"><i id="kqs-pb' + i + '" style="width:3%"></i></div></div></div>';
    }
    st.innerHTML = '<div class="kqs-turn" id="kqs-turn"><div class="kqs-tpawn" id="kqs-tpawn"></div><div class="kqs-ttx"><b id="kqs-tn"></b><span id="kqs-tm"></span></div>' +
      '<div class="kqs-prog"><div>🚀 Terdepan: <span id="kqs-gl"></span></div><div class="kqs-bar"><i id="kqs-gb" style="width:3%"></i></div></div>' +
      '<button class="kqg-snd" data-g="mute" aria-label="Suara">' + (MUTE ? '🔇' : '🔊') + '</button></div>' +
      '<div class="kqs-main"><div class="kqs-boardcol"><div class="kqs-board"><div class="kqs-play" id="kqs-bd"><div class="kqs-grid">' + cells + '</div>' +
      '<svg class="kqs-svg" viewBox="0 0 600 600" preserveAspectRatio="none" aria-hidden="true">' + svg + '</svg><div class="kqs-pawns">' + pawns + '</div></div></div></div>' +
      '<div class="kqs-side"><div class="kqs-dicecard"><div class="kqs-stage" id="kqs-stage"><div class="kqs-tilt"><div class="kqs-dice" id="kqs-dice">' + [1, 2, 3, 4, 5, 6].map(diceFace).join('') + '</div></div></div><div class="kqs-dshadow"></div>' +
      '<div class="kqs-dval" id="kqs-dval">🎲 Siap dilempar</div><button class="kqg-big kqs-roll" id="kqs-roll" data-g="roll">🎲 Lempar dadu</button></div>' +
      '<div class="kqs-pls">' + pls + '</div>' +
      '<div class="kqg-hints"><i>🪜 Tangga naik</i><i>🐍 Ular turun</i><i>❓ Soal</i><i>⭐ Benar +10 · Tangga +5 · Finish +20</i></div></div></div>';

    var me = ST = { roll: roll };
    function alive() { return ST === me && !!$('kqs-bd'); }
    function place(pi, k) { var p = cxy(k), el = $('kqs-pw' + pi); if (el) { el.style.left = p[0] + '%'; el.style.top = p[1] + '%'; } }
    function hop(el) { if (!el) return; el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop'); }
    function flashCell(k) { var e = $('kqs-c' + k); if (e) { e.classList.remove('flash'); void e.offsetWidth; e.classList.add('flash'); setTimeout(function () { e.classList.remove('flash'); }, 900); } }
    function ui(lastT) {
      var t = S.t, col = PCOL[t], tu = $('kqs-turn'); if (!tu) return;
      tu.style.setProperty('--c', col);
      if (lastT !== false && tu.getAttribute('data-t') !== String(t)) { tu.setAttribute('data-t', t); $('kqs-tpawn').innerHTML = pawnSvg(col, PHAIR[t]); }
      $('kqs-tn').textContent = S.win >= 0 ? '🏆 Pemain ' + (S.win + 1) + ' menang!' : 'Giliran Pemain ' + (t + 1);
      $('kqs-tm').textContent = S.msg;
      var best = 0, bi = 0, j;
      for (j = 0; j < n; j++) {
        if (S.pos[j] > best) { best = S.pos[j]; bi = j; }
        $('kqs-ps' + j).textContent = '⭐ ' + S.score[j]; $('kqs-pp' + j).textContent = 'Kotak ' + S.pos[j] + ' / ' + N;
        $('kqs-pb' + j).style.width = Math.max(3, Math.round(S.pos[j] / N * 100)) + '%';
        $('kqs-pc' + j).classList.toggle('on', j === t && S.win < 0);
        $('kqs-pw' + j).classList.toggle('cur', j === t && S.win < 0);
      }
      $('kqs-gl').textContent = 'Pemain ' + (bi + 1) + ' · kotak ' + best + ' / ' + N; $('kqs-gb').style.width = Math.max(3, Math.round(best / N * 100)) + '%';
      var rb = $('kqs-roll'); rb.disabled = S.busy; rb.style.display = S.win >= 0 ? 'none' : '';
    }
    async function rollDice(v) {
      var dc = $('kqs-dice'), stg = $('kqs-stage'), b = DBASE[v];
      DX += 720; DY += 1080;
      dc.style.transform = 'rotateX(' + (b[0] + DX) + 'deg) rotateY(' + (b[1] + DY) + 'deg)';
      stg.classList.remove('toss'); void stg.offsetWidth; stg.classList.add('toss');
      await sleep(1050);
    }
    async function walk(pi, from, to) {
      var el = $('kqs-pw' + pi), k;
      for (k = from + 1; k <= to; k++) { if (!alive()) return; place(pi, k); hop(el); sfx('step'); await sleep(230); }
      flashCell(to);
    }
    async function slide(pi, from, to, dir) {
      var el = $('kqs-pw' + pi); if (!el) return;
      el.classList.add('slide', dir); place(pi, to); sfx(dir);
      await sleep(1050);
      el.classList.remove('slide', dir); flashCell(to);
    }
    function next(note) {
      S.busy = false; S.t = (S.t + 1) % n; S.msg = note + ' Giliran Pemain ' + (S.t + 1) + '.';
      qb.innerHTML = ''; qb.className = ''; qb.removeAttribute('data-who');
      var tu = $('kqs-turn'); if (tu) { tu.classList.remove('pop'); void tu.offsetWidth; tu.classList.add('pop'); }
      ui();
    }
    function win(t) {
      S.win = t; S.score[t] += 20; sfx('win'); ui();
      var rate = S.ask[t] ? S.ok[t] / S.ask[t] : 1, stars = rate >= .8 ? 3 : rate >= .5 ? 2 : 1;
      qb.className = ''; qb.removeAttribute('data-who');
      qb.innerHTML = rewardHtml(true, stars, S.score[t], '🎉 Pemain ' + (t + 1) + ' juara!', 'Menjawab benar ' + S.ok[t] + ' dari ' + S.ask[t] + ' soal.'); countUp();
      burstAt($('kqs-pw' + t), ['🎉', '⭐', '🪙', '✨'], 26);
      if (qb.scrollIntoView) qb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    async function roll() {
      if (S.busy || S.win >= 0) return;
      S.busy = true; var t = S.t, old = S.pos[t]; S.msg = '🎲 Pemain ' + (t + 1) + ' melempar dadu…'; ui(); sfx('dice');
      var d = 1 + Math.floor(Math.random() * 6);
      await rollDice(d); if (!alive()) return;
      $('kqs-dval').textContent = 'Dadu: ' + d;
      var p = Math.min(N, old + d), note = 'Dadu ' + d + '.';
      S.msg = note + ' Pion melangkah…'; ui();
      await walk(t, old, p); if (!alive()) return;
      S.pos[t] = p;
      if (LAD[p]) {
        note += ' Naik tangga 🪜 +5 ⭐'; S.score[t] += 5; S.msg = note; ui(); floatText('Tangga! 🪜', 'ok'); burstAt($('kqs-pw' + t), ['✨', '⭐'], 6);
        await sleep(350); if (!alive()) return; await slide(t, p, LAD[p], 'up'); if (!alive()) return; p = LAD[p]; S.pos[t] = p;
      } else if (SNK[p]) {
        note += ' Digigit ular 🐍'; S.msg = note; ui(); floatText('Meluncur! 🐍', 'bad'); burstAt($('kqs-pw' + t), ['💫', '💥'], 5);
        await sleep(350); if (!alive()) return; await slide(t, p, SNK[p], 'down'); if (!alive()) return; p = SNK[p]; S.pos[t] = p;
      }
      S.msg = note; ui();
      if (p === N) return win(t);
      if (sq[p]) {
        S.msg = note + ' Kotak soal ❓ Jawab dengan benar!'; ui();
        qb.className = 'kqs-qp'; qb.setAttribute('data-who', '🧠 Soal untuk Pemain ' + (t + 1));
        ask(soal[qi++ % soal.length], async function (ok) {
          if (!alive()) return;
          if (ok) return next('Benar! Tetap di kotak ' + p + '.');
          qb.innerHTML = ''; qb.className = ''; S.msg = 'Salah, pion mundur ke kotak ' + old + '.'; ui();
          await slide(t, p, old, 'down'); if (!alive()) return; S.pos[t] = old;
          next('Salah, mundur ke kotak ' + old + '.');
        }, false, function (ok) {
          S.ask[t]++;
          if (ok) { S.ok[t]++; S.score[t] += 10; sfx('open'); floatText('+10 ⭐', 'ok'); burstAt($('kqs-pw' + t), ['⭐', '✨', '🪙'], 8); }
          else { sfx('no'); flashBad(); floatText('Mundur ⬅️', 'bad'); }
          ui();
        });
      } else next(note);
    }
    for (i = 0; i < n; i++) place(i, 1);
    ui();
  }

  /* 🐸 Jump & Solve: pilih daun teratai berisi jawaban, katak melompat maju */
  function playKatak(g) {
    var todo = prep(g.butir), total = todo.length, L0 = +(g.opsi || {}).nyawa || 3, L = L0, solved = 0, score = 0, cur = null, busy = false, over = false;
    var st = $('kqg-st');
    function hud() {
      var h = L > 0 ? new Array(L + 1).join('❤️') : '💔';
      return '<div class="kqg-hud"><span>' + h + '</span><span>⭐ Skor <b>' + score + '</b></span><span>Level ' + Math.min(solved + 1, total) + ' / ' + total + '</span></div>' +
        '<div class="kqg-lv"><i style="width:' + Math.round(solved / total * 100) + '%"></i></div>';
    }
    function hudUpdate() { var e = $('kqg-hud'); if (e) e.innerHTML = hud(); }
    function nextQ() {
      cur = todo.shift(); busy = false;
      st.innerHTML = '<div id="kqg-hud">' + hud() + '</div><div class="kq-q">' + esc(cur.q) + '</div>' +
        '<div class="kqg-lake"><div class="kqg-pads">' + cur.opsi.map(function (o, i) {
          return '<button class="kqg-lily" data-g="pad" data-o="' + i + '"><span>' + esc(o) + '</span></button>';
        }).join('') + '</div><div class="kqg-home"><span class="kqg-frog" id="kqg-frog">🐸</span></div></div><div id="kqg-fb"></div>';
    }
    function feedback(ok, last) {
      var s = cur, lbl = last ? 'Lihat hasil' : 'Lanjut →';
      $('kqg-fb').innerHTML = '<div class="kq-fb ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? '🎉 Benar! +10 ⭐' : '😅 Belum tepat, katak jatuh ke air.') + '</b>' +
        (ok ? '' : ' Jawaban yang benar ada di daun kuning. Soal ini akan muncul lagi.') + (s.pembahasan ? '<p>💡 ' + esc(s.pembahasan) + '</p>' : '') + '</div>' +
        '<div class="kq-foot"><button class="kq-btn pri" data-g="knext">' + lbl + '</button></div>';
    }
    function end(win) {
      over = true;
      var salah = L0 - L, bintang = win ? (salah <= 0 ? 3 : salah <= 1 ? 2 : 1) : 0;
      st.innerHTML = '<div id="kqg-hud">' + hud() + '</div>' + rewardHtml(win, bintang, score, win ? 'Katak sampai di seberang!' : 'Katak tenggelam',
        win ? 'Sisa nyawa: ' + L + ' ❤️' : 'Coba lagi, baca materinya dulu ya.');
      countUp();
    }
    ST = {
      pad: function (o) {
        if (busy || over) return; busy = true;
        var pads = st.querySelectorAll('.kqg-lily'), pad = pads[o], frog = $('kqg-frog'), ok = o === cur.jawaban;
        [].forEach.call(pads, function (p) { p.disabled = true; });
        if (ok) {
          pad.classList.add('ok');
          var fr = frog.getBoundingClientRect(), pr = pad.getBoundingClientRect();
          var dx = pr.left + pr.width / 2 - (fr.left + fr.width / 2), dy = pr.top + pr.height / 2 - (fr.top + fr.height / 2);
          function after() { score += 10; solved++; hudUpdate(); burstAt(pad, ['⭐', '🪙', '✨'], 8); floatText('+10 ⭐', 'ok'); feedback(true, solved >= total); }
          if (frog.animate) {
            frog.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: 'translate(' + dx / 2 + 'px,' + (dy - 50) + 'px) scale(1.25)', offset: .5 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(1)' }],
              { duration: 700, easing: 'ease-in-out', fill: 'forwards' }).onfinish = after;
          } else after();
        } else {
          L--; todo.push(cur);
          pad.classList.add('sink'); pad.insertAdjacentHTML('beforeend', '<span class="kqg-splash">💦</span>');
          pads[cur.jawaban].classList.add('ok');
          if (frog.animate) frog.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(14deg)' }, { transform: 'rotate(0)' }], { duration: 450 });
          hudUpdate(); feedback(false, L <= 0);
        }
      },
      next: function () { if (over) return; if (L <= 0) return end(false); if (solved >= total) return end(true); nextQ(); }
    };
    nextQ();
  }

  /* 🔐 Math Escape Room: laboratorium rahasia 3D kartun, 6 gembok, timer, koin dan bintang */
  function playEscape(g) {
    var soal = prep(g.butir).slice(0, 6), n = soal.length, open = {}, done = 0, cur = -1, over = false, wrong = 0, coins = 0;
    var T0 = (+(g.opsi || {}).menit || 10) * 60, T = T0, st = $('kqg-st'), qb = $('kqg-q');
    var dig = soal.map(function () { return Math.floor(Math.random() * 10); });
    function stars() { var x = ''; for (var i = 0; i < n; i++) x += i < done ? '⭐' : '☆'; return x; }
    st.innerHTML = '<div class="kqg-hud2"><div class="kqg-timebox" role="timer" aria-label="Sisa waktu"><div class="kqg-timer" id="kqg-time">⏱️ ' + mmss(T) + '</div><div class="kqg-tbar"><i id="kqg-tfill" style="width:100%"></i></div></div>' +
      '<div class="kqg-pill coin" id="kqg-coinpill">🪙 <b id="kqg-coins">0</b></div><div class="kqg-pill" id="kqg-stars">' + stars() + '</div><div class="kqg-pill">🎓 Kelas ' + esc(g.kelas) + '</div>' +
      '<button class="kqg-snd" data-g="mute" aria-label="Suara">' + (MUTE ? '🔇' : '🔊') + '</button></div>' +
      '<div class="kqg-scene" id="kqg-scene"><i class="wall"></i><i class="flr"></i><i class="lamp"></i><div class="kqg-sign">LAB RAHASIA</div>' +
      '<div class="kqg-chalk"><b>a² + b² = c²</b><span>x + 3 = 7</span><span>π ≈ 3,14</span></div>' +
      '<div class="kqg-shelfr"><div class="row"><span class="bk b1"></span><span class="bk b2"></span><span class="bk b3"></span><span class="bkr">' + beaker() + '</span></div><span>📐</span><span>🔬</span></div>' +
      '<div class="kqg-doorwrap"><div class="kqg-frame"><div class="kqg-exit"><i class="rays"></i><span>✨</span></div><div class="kqg-door"><div class="kqg-slots">' +
      soal.map(function (x, i) { return '<button class="kqg-slot" id="kqg-slot' + i + '" data-g="lock" data-i="' + i + '" aria-label="Gembok ' + (i + 1) + '">' + lock3d('clamp(30px,8.5vw,48px)') + '<em>' + (i + 1) + '</em></button>'; }).join('') +
      '</div></div></div></div><div class="kqg-char" id="kqg-char">' + studentSvg() + '</div><div class="kqg-books">' + bookStack() + '</div></div>' +
      '<div class="kqg-codes" aria-label="Kode pintu">' + soal.map(function () { return '<div class="kqg-cb">?</div>'; }).join('') + '</div>';
    qb.innerHTML = '<div class="kqg-tip">👆 Klik gembok di pintu, jawab soalnya, lalu buka ' + n + ' gembok sebelum waktu habis!</div>';
    function setTime() {
      var e = $('kqg-time'); if (e) { e.textContent = '⏱️ ' + mmss(T); e.classList.toggle('low', T <= 60); }
      var f = $('kqg-tfill'); if (f) { f.style.width = Math.max(0, T / T0 * 100) + '%'; f.className = T <= 60 ? 'low' : T <= T0 * .4 ? 'mid' : ''; }
    }
    function hudUpdate() { var c = $('kqg-coins'), x = $('kqg-stars'); if (c) c.textContent = coins; if (x) x.textContent = stars(); }
    function shake() { var d = document.querySelector('.kq-dlg'); if (d) { d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake'); } }
    function react(c) { var ch = $('kqg-char'); if (!ch) return; ch.classList.remove('happy', 'sad'); void ch.offsetWidth; ch.classList.add(c); setTimeout(function () { ch.classList.remove(c); }, 1100); }
    function lose() {
      if (over) return; over = true; clearInterval(TM); sfx('lose');
      qb.innerHTML = rewardHtml(false, 0, coins, 'Waktu habis!', 'Kamu terkunci di laboratorium. Coba lagi, kamu pasti bisa!'); countUp();
      var sc = $('kqg-scene'); if (sc) sc.classList.add('fail'); react('sad');
    }
    function win() {
      if (over) return; over = true; clearInterval(TM); qb.innerHTML = ''; sfx('win');
      var sc = $('kqg-scene'); if (sc) sc.classList.add('out'); react('happy');
      burstAt(sc, ['🎉', '⭐', '🪙', '✨'], 28);
      setTimeout(function () {
        var bonus = Math.floor(T / 10), star = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1; coins += bonus; hudUpdate();
        qb.innerHTML = rewardHtml(true, star, coins, 'Kamu berhasil keluar!', 'Sisa waktu ' + mmss(T) + ' · bonus waktu +' + bonus + ' 🪙'); countUp();
        burstAt($('kqg-cnt'), ['⭐', '🪙'], 14);
        if (qb.scrollIntoView) qb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1500);
    }
    ST = {
      lock: function (i) {
        if (over || cur >= 0 || open[i]) return;
        cur = i; var slot = $('kqg-slot' + i); slot.classList.add('cur');
        ask(soal[i], function (ok) {
          cur = -1; slot.classList.remove('cur');
          if (over) return;
          if (done === n) return win();
          qb.innerHTML = '<div class="kqg-tip">' + (ok ? '🔓 Mantap! Pilih gembok berikutnya.' : 'Coba gembok lain atau ulangi soal ini. Waktu terus berjalan ⏱️') + '</div>';
        }, true, function (ok) {
          if (ok) {
            open[i] = 1; done++; coins += 10; slot.classList.add('open'); slot.querySelector('em').textContent = dig[i];
            var cb = document.querySelectorAll('.kqg-cb')[i]; if (cb) { cb.textContent = dig[i]; cb.classList.add('on'); }
            ringFx(slot); burstAt(slot, ['⭐', '✨'], 8); flyCoins(slot, $('kqg-coinpill'), 4); floatText('+10 🪙', 'ok'); react('happy'); sfx('open');
            setTimeout(hudUpdate, 650);
            if (done === n) setTimeout(win, 900);
          } else {
            wrong++; T -= 30; slot.classList.add('shake'); setTimeout(function () { slot.classList.remove('shake'); }, 500);
            floatText('−30 detik ⏱️', 'bad'); burstAt(slot, ['💥', '💧'], 4); react('sad'); shake(); flashBad(); sfx('no'); setTime();
            var tb = $('kqg-time'); if (tb) { tb.classList.remove('hit'); void tb.offsetWidth; tb.classList.add('hit'); }
            if (T <= 0) lose();
          }
        });
      }
    };
    TM = setInterval(function () { if (!$('kqg-st') || over) { clearInterval(TM); return; } T--; setTime(); if (T <= 0) lose(); }, 1000);
  }

  /* ---------- siswa membuka game dengan kode ---------- */
  var E = { found: null };
  function cellEls() { return [].slice.call(document.querySelectorAll('.kqg-cell')); }
  function cellsVal() { return cellEls().map(function (c) { return c.value; }).join(''); }
  function infoSet(html, bad) { var i = $('kqg-info'); if (i) { i.className = 'kqg-info' + (bad ? ' err' : ''); i.innerHTML = html; } }
  function heroLock(open) { var l = document.querySelector('.kqg-hero .kqg-lock3d'); if (l) l.classList.toggle('open', !!open); return l; }
  function lookup() {
    var code = cellsVal(), go = $('kqg-go'); cellEls().forEach(function (c) { c.classList.toggle('on', !!c.value); }); E.found = null; if (go) go.disabled = true; heroLock(false);
    if (code.length < 6) return infoSet(HINT);
    infoSet('⏳ Memeriksa kode…');
    byCode(code).then(function (g) {
      if (cellsVal() !== code) return;
      if (!g) { infoSet('😕 Kode tidak ditemukan. Cek lagi ya.', true); cellEls().forEach(function (c) { c.classList.remove('bad'); void c.offsetWidth; c.classList.add('bad'); }); return; }
      E.found = g; if (go) go.disabled = false;
      burstAt(heroLock(true), ['✨', '⭐'], 8);
      var J = JENIS[g.game] || JENIS.ular, o = g.opsi || {}, cnt = g.game === 'escape' ? Math.min(6, g.butir.length) : g.butir.length;
      var chip = g.game === 'escape' ? '<i class="t">⏱️ ' + mmss((o.menit || 10) * 60) + '</i>' : g.game === 'katak' ? '<i>❤️ ' + (o.nyawa || 3) + ' nyawa</i>' : '<i>👥 ' + (o.pemain || 2) + ' pemain</i>';
      infoSet('<div class="kqg-found"><span class="ico" style="background:linear-gradient(135deg,' + J.c1 + ',' + J.c2 + ')">' + J.e + '</span><div><b>' + esc(g.judul) + '</b><div class="kqg-chips"><i>' + J.n + '</i><i>🎓 Kelas ' + esc(g.kelas) + '</i><i>📝 ' + cnt + ' soal</i>' + chip + '</div></div></div>');
    }, function (e) { infoSet('⚠️ ' + esc(humanErr(e)), true); });
  }
  var HINT = '<div class="kqg-hints"><i>⏱️ Ada timer</i><i>🔐 6 gembok</i><i>⭐ Bintang &amp; koin</i></div>';
  function openEntry(pre) {
    var cells = '', i;
    for (i = 0; i < 6; i++) cells += '<input class="kqg-cell" maxlength="6" autocomplete="off" autocapitalize="characters" spellcheck="false" inputmode="text" aria-label="Karakter kode ' + (i + 1) + '">';
    modal('<button class="kq-x kqg-xx" data-g="close" aria-label="Tutup">✕</button><div class="kqg-hero"><i class="kqg-halo"></i>' + lock3d('104px') + '</div>' +
      '<h2 class="kqg-title">Pintu Laboratorium Rahasia</h2><p class="kqg-sub">Masukkan 6 karakter kode dari gurumu untuk membuka pintu dan mulai petualangan matematika kelas 8!</p>' +
      '<div class="kqg-cells" role="group" aria-label="Kode game">' + cells + '</div><div class="kqg-info" id="kqg-info">' + HINT + '</div>' +
      '<button class="kqg-big" id="kqg-go" data-g="entergo" disabled>🔓 Buka Pintu</button>', 'kqg-w kqg-entry');
    E.found = null;
    var p = String(pre || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6), c = cellEls();
    p.split('').forEach(function (ch, k) { c[k].value = ch; c[k].classList.add('on'); });
    c[Math.min(p.length, 5)].focus();
    if (p.length === 6) lookup();
  }
  function join(raw, inp, msgEl) {
    if (inp) inp.value = ''; if (msgEl) msgEl.textContent = '';
    openEntry(raw);
  }
  document.addEventListener('input', function (e) {
    var t = e.target; if (!t.classList || !t.classList.contains('kqg-cell')) return;
    var cells = cellEls(), i = cells.indexOf(t), v = t.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    var paste = e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop';
    if (v.length > 1 && !paste) v = v.slice(-1);
    if (v.length > 1) {
      v.split('').forEach(function (ch, k) { if (cells[i + k]) cells[i + k].value = ch; });
      t.value = v.charAt(0); cells[Math.min(5, i + v.length - 1)].focus();
    } else { t.value = v; if (v && cells[i + 1]) cells[i + 1].focus(); }
    lookup();
  });
  document.addEventListener('keydown', function (e) {
    var t = e.target; if (!t.classList || !t.classList.contains('kqg-cell')) return;
    var cells = cellEls(), i = cells.indexOf(t);
    if (e.key === 'Backspace' && !t.value && cells[i - 1]) { cells[i - 1].value = ''; cells[i - 1].focus(); lookup(); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' && cells[i - 1]) cells[i - 1].focus();
    else if (e.key === 'ArrowRight' && cells[i + 1]) cells[i + 1].focus();
    else if (e.key === 'Enter') { var go = $('kqg-go'); if (go && !go.disabled) go.click(); }
  });
  // klik di luar jendela tidak menutup game (supaya tidak tertutup tak sengaja saat bermain)
  document.addEventListener('click', function (e) { if (e.target.classList && e.target.classList.contains('kqg-lab')) e.stopImmediatePropagation(); }, true);
  // dicegat lebih dulu supaya kode berawalan G tidak diproses sebagai kode materi/latihan
  function gCode(inp) { return !!inp && /^G[A-Z0-9]{5}$/i.test(inp.value.trim()); }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-act="cc-go"],[data-act="go-kode"],[data-g="join"]');
    if (!b) return;
    var box = b.closest('.kq-cc'), inp = box ? box.querySelector('input') : $('kq-kode');
    var isGame = b.getAttribute('data-g') === 'join';
    if (!isGame && !gCode(inp)) return;
    e.stopImmediatePropagation(); e.preventDefault();
    join(inp && inp.value, inp, box && box.querySelector('.kq-cc-msg'));
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || !e.target || !e.target.classList) return;
    var box = e.target.closest('.kq-cc'), isGameBox = box && box.getAttribute('data-kind') === 'game';
    var isCode = e.target.id === 'kq-kode' || (box && e.target.classList.contains('kq-cc-input'));
    if (!isCode || !(isGameBox || gCode(e.target))) return;
    e.stopImmediatePropagation(); e.preventDefault();
    join(e.target.value, e.target, box && box.querySelector('.kq-cc-msg'));
  }, true);

  /* ---------- event ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-gtab],[data-g],[data-tab]');
    if (!t) return;
    if (t.hasAttribute('data-gtab')) { active = true; ensure(); draw(); refresh(); return; }
    if (t.hasAttribute('data-tab')) { if (active) { active = false; var pp = $('kqg-panel'); if (pp) pp.remove(); } return; }
    var a = t.getAttribute('data-g'), id = t.getAttribute('data-id'), j = t.getAttribute('data-j'), code = t.getAttribute('data-code');
    if (a === 'close') closeM();
    else if (a === 'new') openType();
    else if (a === 'form') openForm(j);
    else if (a === 'add-q') { var l = $('kqg-ql'); if (l.children.length >= 20) return showErr('Maksimal 20 soal.'); l.insertAdjacentHTML('beforeend', qblock()); num(); }
    else if (a === 'rm-q') { if (document.querySelectorAll('.kq-dlg .kq-soal').length <= 1) return showErr('Minimal 1 soal.'); t.closest('.kq-soal').remove(); num(); }
    else if (a === 'fill') { $('kqg-ql').innerHTML = SAMPLE.map(qblock).join(''); num(); if (!$('kqg-judul').value) $('kqg-judul').value = 'Game contoh'; }
    else if (a === 'save') save(j, t);
    else if (a === 'copy') copy(code, 'Kode disalin ✅');
    else if (a === 'link') copy(linkFor(code), 'Tautan disalin ✅');
    else if (a === 'play') play(find(id));
    else if (a === 'del') askDel(id);
    else if (a === 'dodel') del(id).then(function () { closeM(); draw(); toast('Sudah dihapus'); }, function (er) { showErr(humanErr(er)); });
    else if (a === 'seed') seed();
    else if (a === 'ans') answer(parseInt(t.getAttribute('data-o'), 10));
    else if (a === 'qnext') { if (Q && Q.done) { var c = Q.cb, ok = Q.ok; Q = null; c(ok); } }
    else if (a === 'roll' && ST && ST.roll) ST.roll();
    else if (a === 'pad' && ST && ST.pad) ST.pad(parseInt(t.getAttribute('data-o'), 10));
    else if (a === 'knext' && ST && ST.next) ST.next();
    else if (a === 'lock' && ST && ST.lock) ST.lock(parseInt(t.getAttribute('data-i'), 10));
    else if (a === 'entergo') { if (E.found) play(E.found); }
    else if (a === 'again') play(curG);
    else if (a === 'mute') { MUTE = !MUTE; t.textContent = MUTE ? '🔇' : '🔊'; }
  });

  /* ---------- mulai ---------- */
  var pend = false;
  function sched() { if (pend) return; pend = true; requestAnimationFrame(function () { pend = false; ensure(); }); }
  G = loadL();
  new MutationObserver(sched).observe(document.body, { childList: true, subtree: true });
  sched();

  // Tautan untuk siswa: ...?kode=GXXXXX langsung membuka game
  try {
    var qs = new URLSearchParams(location.search).get('kode');
    if (qs && /^G/i.test(qs)) setTimeout(function () {
      var o = document.querySelector('.kq-ov'); if (o) o.remove();
      [].forEach.call(document.querySelectorAll('.kq-toast'), function (x) { x.remove(); });
      document.body.style.overflow = '';
      join(qs);
    }, 1200);
  } catch (e) {}

  window.KQG = { demo: function (j, o) { play({ id: 'demo', kode: 'GDEMO1', judul: 'Demo', topik: 'Aljabar', kelas: '8', game: j || 'ular', opsi: o || { pemain: 3 }, butir: JSON.parse(JSON.stringify(SAMPLE)) }); }, refresh: refresh, seed: seed, entry: openEntry, count: function () { return G.length; } };
})();

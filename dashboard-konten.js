/* MathQuest - Materi & Latihan Soal untuk halaman Dashboard (dengan KODE untuk siswa)
   - Menambah tab "Materi" dan "Latihan Soal" di Dashboard.
   - Setiap materi / latihan punya kode. Siswa membukanya lewat tombol "Masukkan kode"
     atau tautan ...?kode=XXXXXX
   - Fitur "Kuis saya" yang sudah ada tidak diubah sama sekali.

   OPSIONAL: kalau website belum otomatis terhubung ke Supabase, isi dua baris ini
   (URL dan anon key ada di Supabase > Project Settings > API):            */
var KQ_SUPABASE_URL = '';
var KQ_SUPABASE_KEY = '';

(function () {
  'use strict';
  if (window.__kqLoaded) return;
  window.__kqLoaded = true;

  var KEY_M = 'mq_materi_v1';
  var KEY_L = 'mq_latihan_v1';
  var HURUF = ['A', 'B', 'C', 'D'];
  var ABJAD = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var TOPIK = {
    'Bilangan':     { e: '🔢', c1: '#6c4df0', c2: '#9b87f7' },
    'Aljabar':      { e: '🧮', c1: '#ff9a3c', c2: '#ffc46b' },
    'Geometri':     { e: '📐', c1: '#1fb98a', c2: '#6fdcb8' },
    'Perbandingan': { e: '⚖️', c1: '#1da1c9', c2: '#6fd0ea' },
    'Statistika':   { e: '📊', c1: '#3d8bf0', c2: '#82b6f8' },
    'Peluang':      { e: '🎲', c1: '#ee5f8b', c2: '#f8a0bb' }
  };
  var S = { tab: 'kuis', q: '', topik: 'Semua' };
  var C = { materi: [], latihan: [] };
  var sb = null, mode = 'lokal', loading = false, problem = '';
  var wrap = null, kuisCard = null, fab = null, P = null, soalSeq = 0, mem = {}, downOnOv = false;

  /* ---------- penyimpanan lokal ---------- */
  function load(k) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : (mem[k] || []); }
    catch (e) { return mem[k] || []; }
  }
  function save(k, v) {
    mem[k] = v;
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function persistLocal() { save(KEY_M, C.materi); save(KEY_L, C.latihan); }

  /* ---------- util ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function find(arr, id) { for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i]; return null; }
  function cut(s, n) { s = String(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  function inl(s) { return s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  function fmt(t) {
    var out = [], ul = false;
    esc(t).split(/\r?\n/).forEach(function (l) {
      var s = l.trim();
      if (/^- /.test(s)) {
        if (!ul) { out.push('<ul>'); ul = true; }
        out.push('<li>' + inl(s.slice(2)) + '</li>');
        return;
      }
      if (ul) { out.push('</ul>'); ul = false; }
      if (!s) return;
      if (/^## /.test(s)) out.push('<h4>' + inl(s.slice(3)) + '</h4>');
      else out.push('<p>' + inl(s) + '</p>');
    });
    if (ul) out.push('</ul>');
    return out.join('');
  }
  function lum(c) {
    var m = String(c).match(/\d+(\.\d+)?/g);
    if (!m || m.length < 3) return 0;
    return (0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2]) / 255;
  }
  function isDark() {
    var r = document.documentElement, b = document.body;
    if (r.getAttribute('data-theme') === 'dark' || r.classList.contains('dark') || b.classList.contains('dark')) return true;
    return lum(getComputedStyle(b).color) > 0.6;
  }
  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'kq-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }
  function copyText(text, msg) {
    function done() { toast(msg || 'Disalin ✅'); }
    function fallback() {
      var a = document.createElement('textarea');
      a.value = text; a.style.position = 'fixed'; a.style.opacity = '0';
      document.body.appendChild(a); a.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('Salin manual: ' + text); }
      a.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }
  function makeCode(kind) {
    var s = kind === 'materi' ? 'M' : 'L', arr = new Uint8Array(5), i;
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(arr);
    else for (i = 0; i < 5; i++) arr[i] = Math.floor(Math.random() * 256);
    for (i = 0; i < 5; i++) s += ABJAD.charAt(arr[i] % ABJAD.length);
    return s;
  }
  function linkFor(code) { return location.origin + location.pathname + '?kode=' + code; }
  function humanErr(e) {
    var m = (e && (e.message || e.error_description)) || String(e || '');
    if (e && (e.code === '42P01' || /relation .*konten|schema cache|could not find the table/i.test(m)))
      return 'Tabel "konten" belum dibuat di Supabase. Jalankan file supabase-setup.sql dulu.';
    if (e && (e.code === '42501' || /row-level security|permission denied|jwt/i.test(m)))
      return 'Kamu perlu masuk (login) dulu untuk menyimpan.';
    return m || 'Terjadi kesalahan. Coba lagi.';
  }

  /* ---------- koneksi Supabase (otomatis) ---------- */
  function isClient(c) { return !!c && typeof c.from === 'function' && typeof c.rpc === 'function' && !!c.auth; }
  function grab(n) {
    try { return (new Function('return typeof ' + n + '!=="undefined"?' + n + ':null'))(); } catch (e) { return null; }
  }
  function getClient() {
    if (sb) return sb;
    var names = ['sb', 'supabaseClient', '_supabase', 'supa', 'db', 'client', 'sbClient', 'supabaseDb', 'supabaseInstance'], i, c;
    for (i = 0; i < names.length; i++) { c = grab(names[i]); if (isClient(c)) { sb = c; return sb; } }
    for (var k in window) { try { if (isClient(window[k])) { sb = window[k]; return sb; } } catch (e) {} }
    if (KQ_SUPABASE_URL && KQ_SUPABASE_KEY && window.supabase && window.supabase.createClient) {
      sb = window.supabase.createClient(KQ_SUPABASE_URL, KQ_SUPABASE_KEY);
      return sb;
    }
    return null;
  }
  function rowToItem(r) {
    return Object.assign({ id: r.id, kode: r.kode, judul: r.judul, topik: r.topik, kelas: r.kelas, dibuat: r.dibuat }, r.isi || {});
  }
  function itemToRow(kind, x) {
    return { jenis: kind, judul: x.judul, topik: x.topik, kelas: x.kelas,
      isi: kind === 'materi' ? { isi: x.isi, rumus: x.rumus } : { soal: x.soal } };
  }

  /* ---------- data: muat / tambah / ubah / hapus / cari kode ---------- */
  function refresh() {
    var c = getClient();
    mode = c ? 'online' : 'lokal';
    problem = '';
    if (!c) {
      C.materi = load(KEY_M); C.latihan = load(KEY_L);
      loading = false; render();
      return Promise.resolve();
    }
    loading = true; render();
    return c.from('konten').select('*').order('dibuat', { ascending: false }).then(function (r) {
      loading = false;
      if (r.error) { problem = humanErr(r.error); C.materi = []; C.latihan = []; }
      else {
        var rows = (r.data || []).map(rowToItem);
        C.materi = rows.filter(function (x, i) { return r.data[i].jenis === 'materi'; });
        C.latihan = rows.filter(function (x, i) { return r.data[i].jenis === 'latihan'; });
      }
      render();
    }, function (e) { loading = false; problem = humanErr(e); render(); });
  }
  async function addItem(kind, x) {
    var c = getClient();
    if (!c) {
      x.id = uid(); x.dibuat = Date.now();
      var used = C.materi.concat(C.latihan).map(function (i) { return i.kode; });
      do { x.kode = makeCode(kind); } while (used.indexOf(x.kode) > -1);
      C[kind].unshift(x); persistLocal();
      return x;
    }
    for (var t = 0; t < 6; t++) {
      var row = itemToRow(kind, x); row.kode = makeCode(kind);
      var r = await c.from('konten').insert(row).select().single();
      if (!r.error) { var it = rowToItem(r.data); C[kind].unshift(it); return it; }
      if (r.error.code !== '23505') throw r.error;
    }
    throw new Error('Gagal membuat kode unik, coba lagi.');
  }
  async function updateItem(kind, id, x) {
    var c = getClient();
    if (c) {
      var r = await c.from('konten').update(itemToRow(kind, x)).eq('id', id).select().single();
      if (r.error) throw r.error;
      x = rowToItem(r.data);
    }
    var arr = C[kind];
    for (var i = 0; i < arr.length; i++) if (arr[i].id === id) arr[i] = Object.assign(arr[i], x);
    if (!c) persistLocal();
  }
  async function removeItem(kind, id) {
    var c = getClient();
    if (c) {
      var r = await c.from('konten').delete().eq('id', id);
      if (r.error) throw r.error;
    }
    C[kind] = C[kind].filter(function (x) { return x.id !== id; });
    if (!c) persistLocal();
  }
  async function fetchByCode(raw) {
    var code = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!code) return null;
    var c = getClient();
    if (c) {
      var r = await c.rpc('ambil_konten', { p_kode: code });
      if (r.error) throw r.error;
      var row = Array.isArray(r.data) ? r.data[0] : r.data;
      return row ? { kind: row.jenis, item: rowToItem(row) } : null;
    }
    var m = load(KEY_M).filter(function (x) { return x.kode === code; })[0];
    if (m) return { kind: 'materi', item: m };
    var l = load(KEY_L).filter(function (x) { return x.kode === code; })[0];
    return l ? { kind: 'latihan', item: l } : null;
  }

  /* ---------- modal ---------- */
  function openModal(html, cls) {
    closeModal();
    var ov = document.createElement('div');
    ov.className = 'kq-ov' + (isDark() ? ' kq-dark' : '');
    ov.innerHTML = '<div class="kq-dlg ' + (cls || '') + '" role="dialog" aria-modal="true">' + html + '</div>';
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    return ov;
  }
  function closeModal() {
    var o = document.querySelector('.kq-ov');
    if (o) o.remove();
    document.body.style.overflow = '';
    P = null;
  }
  function mhead(title) {
    return '<div class="kq-mh"><h3>' + title + '</h3><button class="kq-x" data-act="close" aria-label="Tutup">✕</button></div>';
  }
  function showErr(msg) {
    var e = document.getElementById('kq-err');
    if (e) e.innerHTML = '<div class="kq-err">' + esc(msg) + '</div>';
    else toast(msg);
  }
  function busy(btn, on) {
    if (!btn) return;
    if (on) { btn.disabled = true; btn.setAttribute('data-t', btn.textContent); btn.textContent = 'Menyimpan…'; }
    else { btn.disabled = false; btn.textContent = btn.getAttribute('data-t') || btn.textContent; }
  }

  /* ---------- tampilan halaman ---------- */
  function statsHtml() {
    var total = C.latihan.reduce(function (a, x) { return a + x.soal.length; }, 0);
    function tile(e, n, t) { return '<div class="kq-stat"><span>' + e + '</span><div><b>' + n + '</b><small>' + t + '</small></div></div>'; }
    return '<div class="kq-stats">' + tile('📚', C.materi.length, 'Materi') + tile('✏️', C.latihan.length, 'Latihan soal') + tile('❓', total, 'Total soal latihan') + '</div>';
  }
  function tabsHtml() {
    function tab(k, label, n) {
      return '<button class="kq-tab' + (S.tab === k ? ' on' : '') + '" data-tab="' + k + '">' + label + (n == null ? '' : ' <b>' + n + '</b>') + '</button>';
    }
    return '<div class="kq-tabs">' + tab('kuis', '🏆 Kuis') + tab('materi', '📚 Materi', C.materi.length) + tab('latihan', '✏️ Latihan Soal', C.latihan.length) + '</div>';
  }
  function chipsHtml() {
    var h = '<button class="kq-chip' + (S.topik === 'Semua' ? ' on' : '') + '" data-chip="Semua">Semua</button>';
    Object.keys(TOPIK).forEach(function (k) {
      h += '<button class="kq-chip' + (S.topik === k ? ' on' : '') + '" data-chip="' + k + '">' + TOPIK[k].e + ' ' + k + '</button>';
    });
    return h;
  }
  function modeHtml() {
    if (problem) return '<div class="kq-mode bad">⚠️ ' + esc(problem) + '</div>';
    if (mode === 'online') return '<div class="kq-mode on">☁️ Tersambung. Kode bisa dipakai siswa di perangkat mana pun.</div>';
    return '<div class="kq-mode off">💾 Mode lokal: kode baru berfungsi di browser ini saja. Hubungkan Supabase (lihat supabase-setup.sql) agar siswa lain bisa membukanya.</div>';
  }
  function panelHtml(kind) {
    var isM = kind === 'materi';
    return '<div class="kq-panel">' +
      '<div class="kq-head"><div><h3>' + (isM ? '📚 Materi pembelajaran' : '✏️ Latihan soal') + '</h3>' +
      '<p>' + (isM ? 'Tulis ringkasan materi, lalu bagikan kodenya ke siswa.' : 'Buat soal pilihan ganda dengan pembahasan, lalu bagikan kodenya ke siswa.') + '</p></div>' +
      '<button class="kq-btn pri" data-act="' + (isM ? 'new-m' : 'new-l') + '">' + (isM ? '+ Tambah materi' : '+ Buat latihan') + '</button></div>' +
      modeHtml() +
      '<div class="kq-tools"><div class="kq-chips">' + chipsHtml() + '</div>' +
      '<input id="kq-search" class="kq-in kq-search" type="search" placeholder="Cari judul…" value="' + esc(S.q) + '"></div>' +
      '<div class="kq-list">' + listHtml(kind) + '</div></div>';
  }
  function listHtml(kind) {
    var isM = kind === 'materi', all = C[kind], q = S.q.toLowerCase();
    if (loading) return '<div class="kq-empty"><div class="big">⏳</div><h4>Memuat…</h4></div>';
    var items = all.filter(function (x) {
      return (S.topik === 'Semua' || x.topik === S.topik) && (!q || x.judul.toLowerCase().indexOf(q) > -1);
    });
    if (!all.length) {
      return '<div class="kq-empty"><div class="big">' + (isM ? '📚' : '✏️') + '</div>' +
        '<h4>' + (isM ? 'Belum ada materi' : 'Belum ada latihan soal') + '</h4>' +
        '<p>' + (isM ? 'Tambahkan ringkasan materi, rumus, dan contoh. Setiap materi otomatis mendapat kode untuk dibagikan ke siswa.'
                     : 'Buat latihan pilihan ganda dengan pembahasan. Setiap latihan otomatis mendapat kode untuk dibagikan ke siswa.') + '</p>' +
        '<div class="row"><button class="kq-btn pri" data-act="' + (isM ? 'new-m' : 'new-l') + '">' + (isM ? '+ Tambah materi' : '+ Buat latihan') + '</button>' +
        '<button class="kq-btn" data-act="seed">✨ Isi dengan contoh</button></div></div>';
    }
    if (!items.length) return '<div class="kq-empty"><div class="big">🔍</div><h4>Tidak ada hasil</h4><p>Coba kata kunci atau topik yang lain.</p></div>';
    return '<div class="kq-grid">' + items.map(function (x) { return cardHtml(kind, x); }).join('') + '</div>';
  }
  function cardHtml(kind, x) {
    var t = TOPIK[x.topik] || TOPIK.Bilangan, isM = kind === 'materi', sum, meta;
    if (isM) {
      sum = cut(String(x.isi).replace(/[#*]/g, '').replace(/- /g, ''), 95);
      meta = '⏱️ ' + Math.max(1, Math.round(String(x.isi).split(/\s+/).length / 120)) + ' menit baca';
    } else {
      sum = 'Latihan pilihan ganda dengan pembahasan di setiap soal.';
      meta = '📝 ' + x.soal.length + ' soal';
    }
    return '<article class="kq-card"><div class="kq-top" style="background:linear-gradient(135deg,' + t.c1 + ',' + t.c2 + ')">' +
      '<span class="kq-emo">' + t.e + '</span><span class="kq-kls">Kelas ' + esc(x.kelas) + '</span></div>' +
      '<div class="kq-body"><div class="kq-tp" style="color:' + t.c1 + '">' + esc(x.topik) + '</div>' +
      '<h4>' + esc(x.judul) + '</h4><p class="kq-sum">' + esc(sum) + '</p><div class="kq-meta">' + meta + '</div>' +
      '<button class="kq-code" data-act="copy" data-code="' + esc(x.kode) + '" title="Salin kode">🔑 <b>' + esc(x.kode) + '</b><span>Salin</span></button>' +
      '<div class="kq-acts">' +
      '<button class="kq-btn pri sm" data-act="' + (isM ? 'view-m' : 'play-l') + '" data-id="' + x.id + '">' + (isM ? 'Baca' : 'Mulai') + '</button>' +
      '<button class="kq-btn sm" data-act="' + (isM ? 'edit-m' : 'edit-l') + '" data-id="' + x.id + '">Ubah</button>' +
      '<button class="kq-btn sm dng" data-act="del" data-kind="' + kind + '" data-id="' + x.id + '">Hapus</button>' +
      '</div></div></article>';
  }
  function render() {
    if (!wrap) return;
    wrap.classList.toggle('kq-dark', isDark());
    wrap.innerHTML = statsHtml() + tabsHtml() + (S.tab === 'materi' || S.tab === 'latihan' ? panelHtml(S.tab) : '');
    syncKuis();
  }
  function refreshList() {
    var box = wrap && wrap.querySelector('.kq-list');
    if (box) box.innerHTML = listHtml(S.tab);
  }
  function syncKuis() { if (kuisCard) kuisCard.style.display = S.tab === 'kuis' ? '' : 'none'; }

  /* ---------- modal kode ---------- */
  function showCodeModal(kind, x) {
    var nama = kind === 'materi' ? 'Materi' : 'Latihan';
    openModal('<div class="kq-empty" style="padding:4px 0 0"><div class="big">🎉</div><h4>' + nama + ' tersimpan!</h4>' +
      '<p>Bagikan kode ini ke siswa. Mereka membukanya lewat tombol <b>🔑 Masukkan kode</b>, atau lewat tautan.</p>' +
      '<div class="kq-codebox">' + esc(x.kode) + '</div>' +
      '<div class="row"><button class="kq-btn pri" data-act="copy" data-code="' + esc(x.kode) + '">📋 Salin kode</button>' +
      '<button class="kq-btn" data-act="copylink" data-code="' + esc(x.kode) + '">🔗 Salin tautan</button></div>' +
      (mode === 'lokal' ? '<div class="kq-note">Mode lokal: kode ini baru bisa dibuka di browser ini. Hubungkan Supabase supaya siswa di perangkat lain juga bisa membukanya.</div>' : '') +
      '<div class="kq-foot" style="justify-content:center"><button class="kq-btn" data-act="close">Selesai</button></div></div>', 'sm');
  }
  function openCodeModal() {
    openModal(mhead('🔑 Masukkan kode') +
      '<p class="kq-hint" style="margin-top:0">Punya kode materi atau latihan dari gurumu? Tulis di sini.</p>' +
      '<input id="kq-kode" class="kq-in kq-kode" maxlength="12" placeholder="MX7K2Q" autocomplete="off" autocapitalize="characters" spellcheck="false">' +
      '<div id="kq-err"></div>' +
      '<div class="kq-foot"><button class="kq-btn" data-act="close">Batal</button><button class="kq-btn pri" data-act="go-kode">Buka</button></div>', 'sm');
    var i = document.getElementById('kq-kode'); if (i) i.focus();
  }
  async function openByCode(raw, btn) {
    if (!String(raw || '').trim()) return showErr('Tulis kodenya dulu ya.');
    if (btn) { btn.disabled = true; btn.setAttribute('data-t', btn.textContent); btn.textContent = 'Mencari…'; }
    try {
      var r = await fetchByCode(raw);
      if (!r) {
        if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute('data-t'); }
        return showErr('Kode tidak ditemukan. Cek lagi ya. Kalau ini kode kuis, masukkan lewat halaman kuis seperti biasa.');
      }
      if (r.kind === 'materi') viewMateri(r.item);
      else playLatihan(r.item, '🔑 Kode ' + r.item.kode);
    } catch (e) {
      if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute('data-t'); }
      showErr(humanErr(e));
    }
  }

  /* ---------- pembuat otomatis dengan AI ---------- */
  var AI_URL = '/.netlify/functions/ai-generate';
  var AI_IDEAS = {
    materi: ['Teorema Pythagoras kelas 8', 'Operasi bilangan bulat kelas 7', 'Persamaan linear satu variabel kelas 7', 'Peluang kejadian sederhana kelas 9'],
    latihan: ['Soal Pythagoras kelas 8', 'Soal persamaan linear kelas 7', 'Soal operasi bilangan bulat kelas 7', 'Soal peluang kelas 9']
  };
  function aiPanel(kind) {
    var isM = kind === 'materi';
    var opts = isM
      ? '<label>Panjang materi<select id="kq-ai-gaya" class="kq-in"><option value="ringkas">Singkat &amp; jelas</option><option value="lengkap">Lebih lengkap</option></select></label>'
      : '<label>Jumlah soal<select id="kq-ai-n" class="kq-in"><option>3</option><option selected>5</option><option>10</option></select></label>' +
        '<label>Tingkat<select id="kq-ai-lv" class="kq-in"><option value="mudah">Mudah</option><option value="sedang" selected>Sedang</option><option value="sulit">Sulit</option></select></label>';
    var ideas = AI_IDEAS[kind].map(function (t) { return '<button type="button" class="kq-chip" data-act="ai-idea" data-p="' + esc(t) + '">' + esc(t) + '</button>'; }).join('');
    return '<div class="kq-ai" id="kq-ai" data-kind="' + kind + '">' +
      '<div class="kq-ai-h"><span>✨</span><div><b>Buat otomatis dengan AI</b><small>Tulis topiknya, AI akan mengisi formulir di bawah. Hasilnya tetap bisa kamu ubah sebelum disimpan.</small></div></div>' +
      '<textarea id="kq-ai-p" class="kq-in" rows="2" maxlength="500" placeholder="' + (isM ? 'Contoh: Buatkan materi Teorema Pythagoras untuk kelas 8 dengan contoh soal' : 'Contoh: Buatkan soal persamaan linear satu variabel untuk kelas 7') + '"></textarea>' +
      '<div class="kq-ai-ideas">' + ideas + '</div>' +
      '<div class="kq-ai-row">' + opts + '<button type="button" class="kq-btn pri" data-act="ai-go">✨ Buat sekarang</button></div>' +
      '<div id="kq-ai-s"></div></div>';
  }
  function aiStatus(type, msg) {
    var e = document.getElementById('kq-ai-s');
    if (!e) return;
    e.innerHTML = msg ? '<div class="kq-ai-s ' + type + '">' + (type === 'load' ? '<i class="kq-spin"></i>' : '') + '<span>' + esc(msg) + '</span></div>' : '';
  }
  async function callAI(payload) {
    if (window.KQ_AI_MOCK) return window.KQ_AI_MOCK(payload);
    var headers = { 'Content-Type': 'application/json' };
    try {
      var c = getClient();
      if (c) {
        var ss = await c.auth.getSession();
        var tok = ss && ss.data && ss.data.session && ss.data.session.access_token;
        if (tok) headers.Authorization = 'Bearer ' + tok;
      }
    } catch (e) {}
    var res;
    try { res = await fetch(AI_URL, { method: 'POST', headers: headers, body: JSON.stringify(payload) }); }
    catch (e) { throw new Error('Tidak bisa terhubung ke server AI. Cek koneksi internetmu.'); }
    var data = null;
    try { data = await res.json(); } catch (e) {}
    if (res.status === 404 || (!data && res.ok)) throw new Error('Fitur AI belum aktif di websitemu. Pastikan file netlify/functions/ai-generate.js sudah ada di GitHub dan ANTHROPIC_API_KEY sudah diisi di Netlify.');
    if (!data) throw new Error('AI terlalu lama menjawab. Coba kurangi jumlah soal atau coba lagi.');
    if (!res.ok) throw new Error(data.pesan || 'AI gagal membuat konten. Coba lagi.');
    return data.hasil;
  }
  function flash(el) { if (!el) return; el.classList.remove('kq-flash'); void el.offsetWidth; el.classList.add('kq-flash'); }
  function setVal(id, v) { var e = document.getElementById(id); if (e && v != null) { e.value = v; flash(e); } }
  function formBlank() {
    var bs = document.querySelectorAll('.kq-dlg .kq-soal');
    for (var i = 0; i < bs.length; i++) {
      if (bs[i].querySelector('.s-q').value.trim()) return false;
      var o = bs[i].querySelectorAll('.s-o');
      for (var j = 0; j < o.length; j++) if (o[j].value.trim()) return false;
    }
    return true;
  }
  async function aiGo(btn) {
    var box = document.getElementById('kq-ai');
    if (!box) return;
    var kind = box.getAttribute('data-kind');
    var prompt = document.getElementById('kq-ai-p').value.trim();
    if (prompt.length < 5) return aiStatus('bad', 'Tulis dulu topiknya ya, misalnya: "Materi Teorema Pythagoras kelas 8".');
    if (kind === 'materi' && document.getElementById('kq-f-isi').value.trim().length > 20 && !btn.getAttribute('data-ok')) {
      btn.setAttribute('data-ok', '1'); btn.textContent = 'Timpa isi yang ada? Klik lagi';
      return aiStatus('warn', 'Isi materi yang sudah kamu tulis akan diganti hasil AI. Klik tombolnya sekali lagi kalau setuju.');
    }
    btn.removeAttribute('data-ok');
    var old = '✨ Buat sekarang';
    btn.disabled = true; btn.textContent = 'AI sedang menulis…';
    try {
      if (kind === 'materi') {
        aiStatus('load', 'AI sedang menulis materi… biasanya 5–15 detik.');
        var r = await callAI({ jenis: 'materi', prompt: prompt, gaya: document.getElementById('kq-ai-gaya').value });
        if (!document.getElementById('kq-ai')) return;
        setVal('kq-f-judul', r.judul); setVal('kq-f-topik', r.topik); setVal('kq-f-kelas', r.kelas);
        setVal('kq-f-isi', r.isi); setVal('kq-f-rumus', r.rumus);
        document.getElementById('kq-f-judul').scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        var total = parseInt(document.getElementById('kq-ai-n').value, 10) || 5;
        var lv = document.getElementById('kq-ai-lv').value, got = [], meta = null, asked = [];
        for (var done = 0; done < total; done += 5) {
          var n = Math.min(5, total - done);
          aiStatus('load', 'AI sedang membuat soal ' + (done + 1) + '–' + (done + n) + ' dari ' + total + '…');
          var rr = await callAI({ jenis: 'latihan', prompt: prompt, jumlah: n, tingkat: lv, hindari: asked.slice(-15) });
          if (!document.getElementById('kq-ai')) return;
          if (!meta) meta = rr;
          rr.soal.forEach(function (x) { got.push(x); asked.push(x.q); });
        }
        var list = document.getElementById('kq-soal-list');
        if (formBlank()) {
          list.innerHTML = '';
          if (!document.getElementById('kq-f-judul').value.trim()) setVal('kq-f-judul', meta.judul);
          setVal('kq-f-topik', meta.topik); setVal('kq-f-kelas', meta.kelas);
        }
        var room = 20 - list.children.length;
        got.slice(0, Math.max(0, room)).forEach(function (x) {
          list.insertAdjacentHTML('beforeend', soalBlock(x));
          flash(list.lastElementChild);
        });
        renumber();
        if (list.lastElementChild) list.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      aiStatus('ok', '✅ Selesai! Periksa hasilnya di bawah dan ubah kalau perlu, lalu klik Simpan.');
      btn.textContent = '🔄 Buat ulang';
    } catch (e) {
      aiStatus('bad', e.message || 'AI gagal membuat konten. Coba lagi.');
      btn.textContent = old;
    }
    btn.disabled = false;
  }

  /* ---------- form materi ---------- */
  function topikOptions(sel) {
    return Object.keys(TOPIK).map(function (k) { return '<option' + (k === sel ? ' selected' : '') + '>' + k + '</option>'; }).join('');
  }
  function kelasOptions(sel) {
    return ['7', '8', '9'].map(function (k) { return '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>Kelas ' + k + '</option>'; }).join('');
  }
  function openMateriForm(id) {
    var m = id ? find(C.materi, id) : null;
    var v = m || { judul: '', topik: 'Bilangan', kelas: '7', isi: '', rumus: '' };
    openModal(mhead(id ? 'Ubah materi' : 'Tambah materi baru') + aiPanel('materi') +
      '<label class="kq-lab" for="kq-f-judul">Judul materi</label>' +
      '<input id="kq-f-judul" class="kq-in" maxlength="80" placeholder="Contoh: Teorema Pythagoras" value="' + esc(v.judul) + '">' +
      '<div class="kq-two"><div><label class="kq-lab" for="kq-f-topik">Topik</label><select id="kq-f-topik" class="kq-in">' + topikOptions(v.topik) + '</select></div>' +
      '<div><label class="kq-lab" for="kq-f-kelas">Kelas</label><select id="kq-f-kelas" class="kq-in">' + kelasOptions(v.kelas) + '</select></div></div>' +
      '<label class="kq-lab" for="kq-f-isi">Isi materi</label>' +
      '<div class="kq-hint">Tips: awali baris dengan <b>## </b> untuk subjudul, <b>- </b> untuk poin, dan bungkus <b>**teks**</b> agar tebal.</div>' +
      '<textarea id="kq-f-isi" class="kq-in" rows="8" placeholder="Tulis penjelasan materi di sini…">' + esc(v.isi) + '</textarea>' +
      '<label class="kq-lab" for="kq-f-rumus">⭐ Rumus / poin penting (opsional)</label>' +
      '<textarea id="kq-f-rumus" class="kq-in" rows="2" placeholder="Contoh: a² + b² = c²">' + esc(v.rumus || '') + '</textarea>' +
      '<div id="kq-err"></div>' +
      '<div class="kq-foot"><button class="kq-btn" data-act="close">Batal</button><button class="kq-btn pri" data-act="save-m" data-id="' + (id || '') + '">Simpan materi</button></div>');
  }
  async function saveMateri(id, btn) {
    var judul = document.getElementById('kq-f-judul').value.trim();
    var isi = document.getElementById('kq-f-isi').value.trim();
    if (!judul || !isi) return showErr('Judul dan isi materi wajib diisi ya.');
    var data = {
      judul: judul,
      topik: document.getElementById('kq-f-topik').value,
      kelas: document.getElementById('kq-f-kelas').value,
      isi: isi,
      rumus: document.getElementById('kq-f-rumus').value.trim()
    };
    busy(btn, true);
    try {
      if (id) { await updateItem('materi', id, data); closeModal(); render(); toast('Materi disimpan ✅'); }
      else { var it = await addItem('materi', data); closeModal(); render(); showCodeModal('materi', it); }
    } catch (e) { busy(btn, false); showErr(humanErr(e)); }
  }

  /* ---------- form latihan ---------- */
  function soalBlock(s) {
    s = s || { q: '', opsi: ['', '', '', ''], jawaban: -1, pembahasan: '' };
    var id = ++soalSeq, rows = '';
    for (var i = 0; i < 4; i++) {
      rows += '<label class="kq-oprow"><input type="radio" name="kq-ans-' + id + '" value="' + i + '"' + (s.jawaban === i ? ' checked' : '') + '>' +
        '<span class="kq-let">' + HURUF[i] + '</span>' +
        '<input type="text" class="kq-in s-o" maxlength="120" placeholder="Pilihan ' + HURUF[i] + '" value="' + esc(s.opsi[i] || '') + '"></label>';
    }
    return '<div class="kq-soal"><div class="kq-soal-h"><b class="kq-sn">Soal</b><button type="button" class="kq-mini" data-act="rm-soal">Hapus soal</button></div>' +
      '<textarea class="kq-in s-q" rows="2" placeholder="Tulis pertanyaan di sini">' + esc(s.q) + '</textarea>' +
      '<div class="kq-hint">Klik bulatan di samping pilihan yang benar.</div>' + rows +
      '<input type="text" class="kq-in s-p" maxlength="240" placeholder="Pembahasan singkat (opsional)" value="' + esc(s.pembahasan || '') + '"></div>';
  }
  function renumber() {
    var bs = document.querySelectorAll('.kq-dlg .kq-soal');
    for (var i = 0; i < bs.length; i++) bs[i].querySelector('.kq-sn').textContent = 'Soal ' + (i + 1);
  }
  function openLatihanForm(id) {
    var L = id ? find(C.latihan, id) : null;
    var v = L || { judul: '', topik: 'Bilangan', kelas: '7', soal: [null] };
    openModal(mhead(id ? 'Ubah latihan' : 'Buat latihan soal') + aiPanel('latihan') +
      '<label class="kq-lab" for="kq-f-judul">Judul latihan</label>' +
      '<input id="kq-f-judul" class="kq-in" maxlength="80" placeholder="Contoh: Latihan Pythagoras" value="' + esc(v.judul) + '">' +
      '<div class="kq-two"><div><label class="kq-lab" for="kq-f-topik">Topik</label><select id="kq-f-topik" class="kq-in">' + topikOptions(v.topik) + '</select></div>' +
      '<div><label class="kq-lab" for="kq-f-kelas">Kelas</label><select id="kq-f-kelas" class="kq-in">' + kelasOptions(v.kelas) + '</select></div></div>' +
      '<div id="kq-soal-list">' + v.soal.map(soalBlock).join('') + '</div>' +
      '<div style="margin-top:14px"><button type="button" class="kq-btn sm" data-act="add-soal">+ Tambah soal</button></div>' +
      '<div id="kq-err"></div>' +
      '<div class="kq-foot"><button class="kq-btn" data-act="close">Batal</button><button class="kq-btn pri" data-act="save-l" data-id="' + (id || '') + '">Simpan latihan</button></div>');
    renumber();
  }
  async function saveLatihan(id, btn) {
    var judul = document.getElementById('kq-f-judul').value.trim();
    if (!judul) return showErr('Judul latihan wajib diisi ya.');
    var blocks = document.querySelectorAll('.kq-dlg .kq-soal'), soal = [];
    if (!blocks.length) return showErr('Tambahkan minimal 1 soal.');
    for (var n = 0; n < blocks.length; n++) {
      var b = blocks[n];
      var q = b.querySelector('.s-q').value.trim();
      var p = b.querySelector('.s-p').value.trim();
      var ops = Array.prototype.map.call(b.querySelectorAll('.s-o'), function (i) { return i.value.trim(); });
      var r = b.querySelector('input[type=radio]:checked');
      var ans = r ? parseInt(r.value, 10) : -1;
      if (!q) return showErr('Soal ' + (n + 1) + ' belum ada pertanyaannya.');
      if (ops.filter(Boolean).length < 2) return showErr('Soal ' + (n + 1) + ' minimal punya 2 pilihan jawaban.');
      if (ans < 0 || !ops[ans]) return showErr('Pilih jawaban yang benar untuk soal ' + (n + 1) + '.');
      var compact = [], map = -1;
      ops.forEach(function (o, i) { if (o) { if (i === ans) map = compact.length; compact.push(o); } });
      soal.push({ q: q, opsi: compact, jawaban: map, pembahasan: p });
    }
    var data = {
      judul: judul,
      topik: document.getElementById('kq-f-topik').value,
      kelas: document.getElementById('kq-f-kelas').value,
      soal: soal
    };
    busy(btn, true);
    try {
      if (id) { await updateItem('latihan', id, data); closeModal(); render(); toast('Latihan disimpan ✅'); }
      else { var it = await addItem('latihan', data); closeModal(); render(); showCodeModal('latihan', it); }
    } catch (e) { busy(btn, false); showErr(humanErr(e)); }
  }

  /* ---------- baca materi ---------- */
  function viewMateri(m) {
    if (!m) return;
    var t = TOPIK[m.topik] || TOPIK.Bilangan;
    var rel = C.latihan.filter(function (x) { return x.topik === m.topik; })[0];
    openModal('<div class="kq-vh" style="background:linear-gradient(135deg,' + t.c1 + ',' + t.c2 + ')">' +
      '<button class="kq-x" data-act="close" aria-label="Tutup">✕</button><span class="kq-bigemo">' + t.e + '</span>' +
      '<div><div class="kq-vtp">' + esc(m.topik) + ' · Kelas ' + esc(m.kelas) + '</div><h3>' + esc(m.judul) + '</h3></div></div>' +
      '<div class="kq-vb">' + fmt(m.isi) +
      (m.rumus ? '<div class="kq-rumus"><b>⭐ Rumus &amp; poin penting</b><div>' + esc(m.rumus) + '</div></div>' : '') +
      '<div class="kq-foot">' + (rel ? '<button class="kq-btn pri" data-act="play-l" data-id="' + rel.id + '">✏️ Kerjakan latihan</button>' : '') +
      '<button class="kq-btn" data-act="close">Tutup</button></div></div>', 'flush');
  }

  /* ---------- kerjakan latihan ---------- */
  function playLatihan(L, badge) {
    if (!L) return;
    openModal('');
    P = { L: L, i: 0, score: 0, picked: -1, badge: badge || '👀 Pratinjau siswa' };
    playRender();
  }
  function playRender() {
    var dlg = document.querySelector('.kq-dlg');
    if (!dlg || !P) return;
    var L = P.L, n = L.soal.length;
    var top = '<div class="kq-mh"><div><span class="kq-badge-prev">' + esc(P.badge) + '</span><h3 style="margin-top:6px">' + esc(L.judul) + '</h3></div>' +
      '<button class="kq-x" data-act="close" aria-label="Tutup">✕</button></div>';
    if (P.i >= n) {
      var pct = Math.round(P.score / n * 100);
      var em = pct >= 80 ? '🏆' : pct >= 50 ? '🌟' : '💪';
      var msg = pct >= 80 ? 'Hebat sekali! Kamu menguasai materi ini.' : pct >= 50 ? 'Bagus! Sedikit lagi, ayo berlatih lagi.' : 'Jangan menyerah! Baca materinya lalu coba lagi.';
      dlg.innerHTML = top + '<div class="kq-res"><div class="big">' + em + '</div><h3>Latihan selesai!</h3>' +
        '<div class="sc">' + P.score + ' / ' + n + '</div><p>' + pct + '% benar. ' + msg + '</p></div>' +
        '<div class="kq-foot" style="justify-content:center"><button class="kq-btn" data-act="restart">🔄 Ulangi</button><button class="kq-btn pri" data-act="close">Selesai</button></div>';
      return;
    }
    var s = L.soal[P.i];
    var opts = s.opsi.map(function (o, i) {
      var cls = 'kq-o';
      if (P.picked >= 0) { if (i === s.jawaban) cls += ' ok'; else if (i === P.picked) cls += ' no'; }
      return '<button class="' + cls + '" data-act="pick" data-o="' + i + '"' + (P.picked >= 0 ? ' disabled' : '') + '><span class="kq-let">' + HURUF[i] + '</span><span>' + esc(o) + '</span></button>';
    }).join('');
    var fb = '';
    if (P.picked >= 0) {
      var ok = P.picked === s.jawaban;
      fb = '<div class="kq-fb ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? '🎉 Benar!' : '😅 Belum tepat.') + '</b>' +
        (ok ? '' : ' Jawaban yang benar: ' + HURUF[s.jawaban] + '.') + (s.pembahasan ? '<p>💡 ' + esc(s.pembahasan) + '</p>' : '') + '</div>' +
        '<div class="kq-foot"><button class="kq-btn pri" data-act="next">' + (P.i === n - 1 ? 'Lihat hasil' : 'Soal berikutnya →') + '</button></div>';
    }
    dlg.innerHTML = top + '<div class="kq-pn">Soal ' + (P.i + 1) + ' dari ' + n + '</div>' +
      '<div class="kq-prog"><i style="width:' + Math.round((P.i + (P.picked >= 0 ? 1 : 0)) / n * 100) + '%"></i></div>' +
      '<div class="kq-q">' + esc(s.q) + '</div>' + opts + fb;
  }

  /* ---------- hapus ---------- */
  function askDelete(kind, id) {
    var x = find(C[kind], id);
    if (!x) return;
    openModal('<div class="kq-empty" style="padding:6px 0 0"><div class="big">🗑️</div><h4>Hapus ' + (kind === 'materi' ? 'materi' : 'latihan') + ' ini?</h4>' +
      '<p><b>' + esc(x.judul) + '</b><br>Kode <b>' + esc(x.kode) + '</b> juga tidak akan bisa dipakai lagi. Yang sudah dihapus tidak bisa dikembalikan.</p>' +
      '<div class="row"><button class="kq-btn" data-act="close">Batal</button><button class="kq-btn pri" data-act="do-del" data-kind="' + kind + '" data-id="' + id + '" style="background:#e5484d;border-color:#e5484d">Ya, hapus</button></div><div id="kq-err"></div></div>', 'sm');
  }
  async function doDelete(kind, id, btn) {
    busy(btn, true);
    try { await removeItem(kind, id); closeModal(); render(); toast('Sudah dihapus'); }
    catch (e) { busy(btn, false); showErr(humanErr(e)); }
  }

  /* ---------- contoh isi ---------- */
  var CONTOH = {
    materi: [
      { judul: 'Teorema Pythagoras', topik: 'Geometri', kelas: '8',
        isi: 'Teorema Pythagoras berlaku pada **segitiga siku-siku**. Sisi miring (hipotenusa) adalah sisi terpanjang, yang berada di depan sudut siku-siku.\n\n## Bunyi teorema\n- Kuadrat sisi miring sama dengan jumlah kuadrat kedua sisi lainnya.\n- Jika sisi siku-siku adalah a dan b, serta sisi miring c, maka a² + b² = c².\n\n## Contoh\nSebuah segitiga siku-siku memiliki sisi 3 cm dan 4 cm. Maka c² = 3² + 4² = 9 + 16 = 25, sehingga c = 5 cm.\n\n## Tripel Pythagoras yang populer\n- 3, 4, 5\n- 5, 12, 13\n- 8, 15, 17',
        rumus: 'a² + b² = c²   →   c = √(a² + b²)' },
      { judul: 'Operasi Bilangan Bulat', topik: 'Bilangan', kelas: '7',
        isi: 'Bilangan bulat terdiri dari bilangan negatif, nol, dan bilangan positif.\n\n## Penjumlahan dan pengurangan\n- Mengurangi sama dengan menambah lawannya: a − b = a + (−b).\n- Contoh: 5 − 8 = 5 + (−8) = −3.\n\n## Perkalian dan pembagian\n- Tanda sama menghasilkan hasil **positif**.\n- Tanda berbeda menghasilkan hasil **negatif**.\n- Contoh: (−6) × (−3) = 18 dan (−12) ÷ 4 = −3.',
        rumus: '(+)×(+) = (+)   (−)×(−) = (+)   (+)×(−) = (−)' },
      { judul: 'Persamaan Linear Satu Variabel', topik: 'Aljabar', kelas: '7',
        isi: 'Persamaan linear satu variabel (PLSV) adalah kalimat terbuka dengan tanda sama dengan dan satu variabel berpangkat satu.\n\n## Langkah menyelesaikan\n- Kumpulkan suku variabel di satu ruas dan konstanta di ruas lain.\n- Lakukan operasi yang sama di kedua ruas agar tetap seimbang.\n\n## Contoh\n2x + 5 = 13, maka 2x = 8, sehingga x = 4.',
        rumus: 'Pindah ruas = ubah tanda' }
    ],
    latihan: [
      { judul: 'Latihan Pythagoras', topik: 'Geometri', kelas: '8', soal: [
        { q: 'Sebuah segitiga siku-siku memiliki sisi 6 cm dan 8 cm. Berapa panjang sisi miringnya?', opsi: ['9 cm', '10 cm', '12 cm', '14 cm'], jawaban: 1, pembahasan: 'c² = 6² + 8² = 36 + 64 = 100, sehingga c = 10 cm.' },
        { q: 'Sisi miring sebuah segitiga siku-siku 13 cm dan salah satu sisi siku-sikunya 5 cm. Berapa sisi siku-siku yang lain?', opsi: ['8 cm', '10 cm', '12 cm', '18 cm'], jawaban: 2, pembahasan: 'b² = 13² − 5² = 169 − 25 = 144, sehingga b = 12 cm.' },
        { q: 'Manakah yang merupakan tripel Pythagoras?', opsi: ['2, 3, 4', '6, 8, 10', '4, 5, 7', '5, 6, 8'], jawaban: 1, pembahasan: '6² + 8² = 36 + 64 = 100 = 10².' }
      ] },
      { judul: 'Latihan PLSV', topik: 'Aljabar', kelas: '7', soal: [
        { q: 'Nilai x dari 2x + 5 = 13 adalah …', opsi: ['3', '4', '5', '9'], jawaban: 1, pembahasan: '2x = 13 − 5 = 8, sehingga x = 4.' },
        { q: 'Nilai x dari 3x − 7 = 11 adalah …', opsi: ['4', '5', '6', '18'], jawaban: 2, pembahasan: '3x = 11 + 7 = 18, sehingga x = 6.' },
        { q: 'Nilai x dari 5x = 2x + 12 adalah …', opsi: ['2', '3', '4', '6'], jawaban: 2, pembahasan: '5x − 2x = 12, maka 3x = 12 dan x = 4.' }
      ] }
    ]
  };
  async function seed(quiet) {
    try {
      for (var i = 0; i < CONTOH.materi.length; i++) await addItem('materi', JSON.parse(JSON.stringify(CONTOH.materi[i])));
      for (var j = 0; j < CONTOH.latihan.length; j++) await addItem('latihan', JSON.parse(JSON.stringify(CONTOH.latihan[j])));
      render(); if (!quiet) toast('Contoh ditambahkan ✨');
    } catch (e) { toast(humanErr(e)); }
  }

  /* ---------- pasang ke halaman Dashboard ---------- */
  function findDashboard() {
    var app = document.getElementById('app');
    if (!app) return null;
    var heads = app.querySelectorAll('h1,h2,h3'), h = null, i;
    for (i = 0; i < heads.length; i++) if (heads[i].textContent.trim() === 'Dashboard') { h = heads[i]; break; }
    if (!h) return null;
    var all = app.querySelectorAll('h1,h2,h3,h4,h5,strong,b,div,span,p'), k = null;
    for (i = 0; i < all.length; i++) {
      if (all[i].children.length === 0 && all[i].textContent.trim().toLowerCase() === 'kuis saya') { k = all[i]; break; }
    }
    if (!k) return null;
    var c = k;
    while (c && c.parentElement !== h.parentElement) c = c.parentElement;
    if (!c || c === h) c = k.closest('.card, .panel, section');
    return c ? { card: c } : null;
  }
  function enhance() {
    var d = findDashboard();
    if (!d) return;
    kuisCard = d.card;
    if (wrap && document.body.contains(wrap) && wrap.nextElementSibling === kuisCard) { syncKuis(); return; }
    if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
    wrap = document.createElement('div');
    wrap.className = 'kq';
    wrap.id = 'kq';
    kuisCard.parentNode.insertBefore(wrap, kuisCard);
    render();
    refresh();
  }
  /* ---------- kotak kode di Beranda (di bawah "Kode Kuis") ---------- */
  function findKuisCodeCard() {
    var app = document.getElementById('app');
    if (!app) return null;
    var all = app.querySelectorAll('h1,h2,h3,h4,h5,strong,b,div,span,p,label'), k = null, i;
    for (i = 0; i < all.length; i++) {
      if (all[i].children.length === 0 && all[i].textContent.trim().toLowerCase() === 'kode kuis') { k = all[i]; break; }
    }
    if (!k) return null;
    var c = k, n = 0;
    while (c && c !== app && n < 8) {
      if (getComputedStyle(c).borderTopStyle === 'dashed') return c;
      c = c.parentElement; n++;
    }
    return null;
  }
  function codeBox(kind, icon, title, sub, ph) {
    return '<div class="kq-cc" data-kind="' + kind + '"><div class="kq-cc-h"><div class="kq-cc-ic">' + icon + '</div>' +
      '<div class="kq-cc-tx"><b>' + title + '</b><span>' + sub + '</span></div></div>' +
      '<div class="kq-cc-in"><input class="kq-cc-input" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="' + ph + '" aria-label="' + title + '">' +
      '<button type="button" class="kq-cc-btn" data-act="cc-go">Buka</button></div><div class="kq-cc-msg"></div></div>';
  }
  function placeCodes() {
    var ex = document.getElementById('kq-codes');
    if (ex && ex.previousElementSibling && ex.previousElementSibling.textContent.indexOf('Kode Kuis') > -1) return;
    var card = findKuisCodeCard();
    if (!card) return;
    if (ex) ex.remove();
    var box = document.createElement('div');
    box.className = 'kq-codes';
    box.id = 'kq-codes';
    box.innerHTML = codeBox('materi', '📚', 'Kode Kelas', 'Buka materi dari gurumu', 'CONTOH: MX7K2Q') +
                    codeBox('latihan', '✏️', 'Kode Latihan Soal', 'Coba latihan soal dari gurumu', 'CONTOH: LB6CSP');
    card.parentNode.insertBefore(box, card.nextSibling);
  }
  async function goCode(btn) {
    var box = btn.closest('.kq-cc'), kind = box.getAttribute('data-kind');
    var inp = box.querySelector('input'), msg = box.querySelector('.kq-cc-msg');
    msg.textContent = '';
    if (!inp.value.trim()) { msg.textContent = 'Tulis kodenya dulu ya.'; return; }
    var old = btn.textContent;
    btn.disabled = true; btn.textContent = 'Mencari…';
    try {
      var r = await fetchByCode(inp.value);
      if (!r) msg.textContent = 'Kode tidak ditemukan. Cek lagi ya.';
      else if (r.kind !== kind) msg.textContent = kind === 'materi' ? 'Ini kode latihan soal. Tulis di kotak Kode Latihan Soal.' : 'Ini kode materi. Tulis di kotak Kode Kelas.';
      else {
        inp.value = '';
        if (kind === 'materi') viewMateri(r.item); else playLatihan(r.item, '🔑 Kode ' + r.item.kode);
      }
    } catch (e) { msg.textContent = humanErr(e); }
    btn.disabled = false; btn.textContent = old;
  }
  function updateFab() {
    var app = document.getElementById('app');
    var login = !!document.querySelector('input[type=password],input[autocomplete*=password]') || (app && /Tampilkan password/i.test(app.textContent));
    if (!fab) {
      fab = document.createElement('button');
      fab.className = 'kq-fab';
      fab.setAttribute('data-act', 'open-kode');
      fab.innerHTML = '🔑 <span>Masukkan kode</span>';
      document.body.appendChild(fab);
    }
    fab.style.display = (login || document.getElementById('kq-codes')) ? 'none' : '';
  }
  var pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; enhance(); placeCodes(); updateFab(); });
  }

  /* ---------- event ---------- */
  document.addEventListener('mousedown', function (e) { downOnOv = !!(e.target.classList && e.target.classList.contains('kq-ov')); });
  document.addEventListener('click', function (e) {
    if (e.target.classList && e.target.classList.contains('kq-ov')) { if (downOnOv) closeModal(); return; }
    var t = e.target.closest('[data-tab],[data-chip],[data-act]');
    if (!t) return;
    if (t.hasAttribute('data-tab') && wrap && wrap.contains(t)) { S.tab = t.getAttribute('data-tab'); S.q = ''; S.topik = 'Semua'; render(); return; }
    if (t.hasAttribute('data-chip') && wrap && wrap.contains(t)) { S.topik = t.getAttribute('data-chip'); render(); return; }
    var act = t.getAttribute('data-act'), id = t.getAttribute('data-id');
    if (!act) return;
    if (act === 'close') closeModal();
    else if (act === 'new-m') openMateriForm();
    else if (act === 'edit-m') openMateriForm(id);
    else if (act === 'save-m') saveMateri(id, t);
    else if (act === 'view-m') viewMateri(find(C.materi, id));
    else if (act === 'new-l') openLatihanForm();
    else if (act === 'edit-l') openLatihanForm(id);
    else if (act === 'save-l') saveLatihan(id, t);
    else if (act === 'play-l') playLatihan(find(C.latihan, id));
    else if (act === 'add-soal') {
      var list = document.getElementById('kq-soal-list');
      if (list.children.length >= 20) return showErr('Maksimal 20 soal per latihan.');
      list.insertAdjacentHTML('beforeend', soalBlock()); renumber();
      list.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    else if (act === 'rm-soal') {
      if (document.querySelectorAll('.kq-dlg .kq-soal').length <= 1) return showErr('Latihan harus punya minimal 1 soal.');
      t.closest('.kq-soal').remove(); renumber();
    }
    else if (act === 'del') askDelete(t.getAttribute('data-kind'), id);
    else if (act === 'do-del') doDelete(t.getAttribute('data-kind'), id, t);
    else if (act === 'seed') seed();
    else if (act === 'copy') copyText(t.getAttribute('data-code'), 'Kode disalin ✅');
    else if (act === 'copylink') copyText(linkFor(t.getAttribute('data-code')), 'Tautan disalin ✅');
    else if (act === 'open-kode') openCodeModal();
    else if (act === 'go-kode') openByCode(document.getElementById('kq-kode').value, t);
    else if (act === 'cc-go') goCode(t);
    else if (act === 'ai-go') aiGo(t);
    else if (act === 'ai-idea') { var pp = document.getElementById('kq-ai-p'); if (pp) { pp.value = t.getAttribute('data-p'); pp.focus(); } }
    else if (act === 'pick' && P && P.picked < 0) {
      var o = parseInt(t.getAttribute('data-o'), 10);
      P.picked = o;
      if (o === P.L.soal[P.i].jawaban) P.score++;
      playRender();
    }
    else if (act === 'next' && P) { P.i++; P.picked = -1; playRender(); }
    else if (act === 'restart' && P) { P.i = 0; P.score = 0; P.picked = -1; playRender(); }
  });
  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'kq-search') { S.q = e.target.value; refreshList(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Enter' && e.target && e.target.classList && e.target.classList.contains('kq-cc-input')) { var bb = e.target.closest('.kq-cc').querySelector('.kq-cc-btn'); goCode(bb); }
    if (e.key === 'Enter' && e.target && e.target.id === 'kq-kode') openByCode(e.target.value, document.querySelector('[data-act=go-kode]'));
  });

  /* ---------- mulai ---------- */
  C.materi = load(KEY_M); C.latihan = load(KEY_L);
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  schedule();

  // Tautan untuk siswa: ...?kode=XXXXXX langsung membuka materi / latihannya
  try {
    var qs = new URLSearchParams(location.search).get('kode');
    if (qs) {
      setTimeout(function () {
        openByCode(qs);
        try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) {}
      }, 700);
    }
  } catch (e) {}

  window.KQ = {
    render: render,
    refresh: refresh,
    seed: seed,
    seedIfEmpty: function () { if (!C.materi.length && !C.latihan.length) return seed(true); }
  };
})();

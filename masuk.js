/* Masuk yang lebih jelas: pesan error akurat, Lupa password (kirim tautan ke email), dan Buat password baru.
   File ini menggantikan tampilan login milik app.js tanpa mengubah app.js. */
(() => {
  const atrM = t => aman(t).replace(/"/g, '&quot;')
  let modePulih = /type=recovery/.test(location.hash + location.search), emailIsi = '', notis = ''
  let galat = /error_code=otp_expired|error_description=[^&]*(expired|invalid)/i.test(location.hash) ? 'Tautan reset sudah kedaluwarsa atau tidak valid. Minta tautan baru lewat "Lupa password?".' : ''
  document.head.insertAdjacentHTML('beforeend', `<style>.tautan { background:none; border:0; padding:0; color:var(--p); font:inherit; font-weight:800; text-decoration:underline; cursor:pointer } a.btn { text-decoration:none; display:inline-block }</style>`)

  /* Mengubah pesan teknis Supabase menjadi kalimat yang jelas */
  const pesanMasuk = e => {
    const m = e.message || ''
    if (/invalid login credentials/i.test(m)) return 'Email atau password tidak cocok. Periksa lagi ketikanmu. Kalau lupa password, klik "Lupa password?". Kalau belum punya akun di web ini, klik tab Daftar.'
    if (/email not confirmed/i.test(m)) return 'Email kamu belum dikonfirmasi. Buka email-mu, klik tautan konfirmasi dari MathQuest, lalu coba masuk lagi.'
    if (/rate limit|too many/i.test(m)) return 'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.'
    if (/failed to fetch|network/i.test(m)) return 'Tidak bisa terhubung ke server. Periksa koneksi internet, atau alamat Supabase di app.js.'
    if (/api key|apikey/i.test(m)) return 'Kunci Supabase di app.js tidak valid. Periksa SUPABASE_ANON_KEY di app.js.'
    return 'Gagal masuk: ' + m
  }

  /* ---------- Masuk dan Daftar ---------- */
  window.tampilAuth = function () {
    const daftar = mode === 'daftar'
    app.innerHTML = `<div class="auth card">
      <h1>MathQuest</h1><p class="kecil">Belajar matematika jadi lebih seru.</p>
      ${notis ? `<div class="msg ok">${aman(notis)}</div>` : ''}${galat ? `<div class="msg err">${aman(galat)}</div>` : ''}
      <div class="tabs"><button class="btn ${daftar ? 'alt' : ''}" id="tMasuk">Masuk</button><button class="btn ${daftar ? '' : 'alt'}" id="tDaftar">Daftar</button></div>
      <form id="formAuth">
        <label for="email">Email</label><input id="email" type="email" required autocomplete="email" value="${atrM(emailIsi)}">
        ${daftar ? '<label for="username">Username</label><input id="username" required minlength="3" maxlength="20">' : ''}
        <label for="pw">Password</label><input id="pw" type="password" required minlength="6" autocomplete="${daftar ? 'new-password' : 'current-password'}">
        ${daftar ? '<label for="pw2">Ulangi password</label><input id="pw2" type="password" required>' : ''}
        <label class="pil" style="margin:8px 0 0"><input id="lihat" type="checkbox" style="width:auto"> Tampilkan password</label>
        <p><button class="btn" type="submit">${daftar ? 'Buat akun' : 'Masuk'}</button></p>
        ${daftar ? '' : '<p style="margin:0"><button type="button" class="tautan" id="lupa">Lupa password?</button></p>'}
      </form><div id="pesan"></div></div>`
    notis = ''; galat = ''
    const simpanEmail = () => { emailIsi = $('email').value.trim() }
    $('tMasuk').onclick = () => { simpanEmail(); mode = 'masuk'; window.tampilAuth() }
    $('tDaftar').onclick = () => { simpanEmail(); mode = 'daftar'; window.tampilAuth() }
    $('lihat').onchange = () => { const t = $('lihat').checked ? 'text' : 'password'; $('pw').type = t; if (daftar) $('pw2').type = t }
    if (!daftar) $('lupa').onclick = () => { simpanEmail(); tampilLupa() }
    $('formAuth').onsubmit = async ev => {
      ev.preventDefault()
      const email = $('email').value.trim(), pw = $('pw').value; emailIsi = email
      if (daftar) {
        if (pw !== $('pw2').value) return pesan('Password dan ulangi password harus sama.')
        const { data, error } = await db.auth.signUp({ email, password: pw, options: { data: { username: $('username').value.trim() }, emailRedirectTo: location.origin + location.pathname } })
        if (error) return pesan(/rate limit/i.test(error.message) ? 'Terlalu banyak email yang dikirim. Tunggu beberapa menit, atau minta pemilik web mematikan "Confirm email" di Supabase.' : error.message)
        if (!data.session) pesan('Akun dibuat. Cek email untuk konfirmasi, lalu masuk.', 'ok')
      } else {
        const { error } = await db.auth.signInWithPassword({ email, password: pw })
        if (error) pesan(pesanMasuk(error))
      }
    }
  }

  /* ---------- Lupa password ---------- */
  const kirimReset = email => db.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname })
  const pesanReset = e => /rate limit|too many|seconds/i.test(e.message || '') ? 'Terlalu banyak permintaan. Tunggu beberapa menit lalu coba lagi.' : 'Gagal mengirim tautan: ' + e.message

  /* Tombol "Buka email": membawa pengguna langsung ke kotak masuk emailnya */
  const PENYEDIA = [
    [/@(outlook|hotmail|live|msn)\./i, () => 'https://outlook.live.com/mail/0/inbox'],
    [/@(yahoo|ymail|rocketmail)\./i, () => 'https://mail.yahoo.com/'],
    [/@(icloud|me|mac)\.com$/i, () => 'https://www.icloud.com/mail'],
    [/@proton(mail)?\.(me|com)$/i, () => 'https://mail.proton.me/']
  ]
  const linkEmail = e => { const p = PENYEDIA.find(([r]) => r.test(e)); return p ? p[1](e) : `https://mail.google.com/mail/?authuser=${encodeURIComponent(e)}#inbox` }

  function tampilLupa() {
    app.innerHTML = `<div class="auth card"><h2>Lupa password</h2>
      <p class="kecil">Masukkan emailmu. Kami kirim link untuk membuat password baru. Progres belajarmu tetap aman.</p>
      <form id="fLupa"><label for="el">Email</label><input id="el" type="email" required autocomplete="email" value="${atrM(emailIsi)}">
      <p><button class="btn" type="submit" id="kirim">Kirim link reset</button> <button class="btn alt" type="button" id="balik">Kembali</button></p></form><div id="pesan"></div></div>`
    let tmr = null
    const hitung = () => {
      clearInterval(tmr); let d = 60
      const atur = () => { const b = $('kirim'); if (!b) return clearInterval(tmr); if (d > 0) { b.disabled = true; b.textContent = `Kirim ulang (${d}s)` } else { clearInterval(tmr); b.disabled = false; b.textContent = 'Kirim ulang' } }
      atur(); tmr = setInterval(() => { d--; atur() }, 1000)
    }
    $('balik').onclick = () => { clearInterval(tmr); mode = 'masuk'; window.tampilAuth() }
    $('fLupa').onsubmit = async ev => {
      ev.preventDefault()
      const email = $('el').value.trim(); emailIsi = email; $('kirim').disabled = true
      const { error } = await kirimReset(email)
      if (error) { $('kirim').disabled = false; return pesan(pesanReset(error)) }
      $('pesan').innerHTML = `<div class="msg ok">Link reset sudah dikirim ke <b>${aman(email)}</b>. Cek inbox atau folder spam, lalu klik linknya.
        <p style="margin:8px 0 0"><a class="btn" href="${atrM(linkEmail(email))}" target="_blank" rel="noopener"><u>Buka email</u></a></p></div>`
      hitung()
    }
  }

  /* ---------- Buat password baru (setelah klik tautan di email) ---------- */
  function tampilPasswordBaru() {
    app.innerHTML = `<div class="auth card"><h2>Buat password baru 🔐</h2>
      <p class="kecil">Masukkan password baru untuk akunmu (minimal 6 karakter).</p>
      <form id="fBaru"><label for="p1">Password baru</label><input id="p1" type="password" required minlength="6" autocomplete="new-password">
      <label for="p2">Ulangi password baru</label><input id="p2" type="password" required autocomplete="new-password">
      <p><button class="btn" type="submit" id="simpanPw">Simpan password</button></p></form><div id="pesan"></div></div>`
    $('fBaru').onsubmit = async ev => {
      ev.preventDefault()
      const p1 = $('p1').value
      if (p1 !== $('p2').value) return pesan('Password baru dan ulangi password harus sama.')
      $('simpanPw').disabled = true
      const { data, error } = await db.auth.updateUser({ password: p1 })
      $('simpanPw').disabled = false
      if (error) return pesan(/same|different/i.test(error.message) ? 'Password baru tidak boleh sama dengan password lama.' : /session|jwt/i.test(error.message) ? 'Tautan reset sudah tidak berlaku. Kembali ke halaman masuk, klik "Lupa password?", lalu minta tautan baru.' : 'Gagal menyimpan password: ' + error.message)
      emailIsi = (data && data.user && data.user.email) || emailIsi
      const OK = 'Password berhasil diubah. Silakan masuk dengan password barumu.'
      notis = OK; modePulih = false; mode = 'masuk'
      try { history.replaceState(null, '', location.pathname) } catch (e) {}
      await db.auth.signOut()
      notis = OK; window.tampilAuth()
    }
  }

  /* Selama membuat password baru, jangan tampilkan isi web */
  const _render = window.render, _tampilUtama = window.tampilUtama
  window.render = function () { return modePulih ? tampilPasswordBaru() : _render.apply(this, arguments) }
  window.tampilUtama = function () { return modePulih ? undefined : _tampilUtama.apply(this, arguments) }
  db.auth.onAuthStateChange(e => { if (e === 'PASSWORD_RECOVERY') { modePulih = true; tampilPasswordBaru() } })
})()

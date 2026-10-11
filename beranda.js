/* Beranda: kartu Kode Kuis (kode kelas sudah dihapus), 6 materi tampil sebagai kotak berwarna.
   File ini menggantikan fungsi render() dan beranda() milik app.js, jadi app.js tidak perlu diubah. */

const DAFTAR_MATERI = [
  { urutan: 1, ikon: '🚀', judul: 'Bilangan Berpangkat', ringkas: 'Perpangkatan, sifat, dan bentuk baku', c1: '#ff7a59', c2: '#ffb347' },
  { urutan: 2, ikon: '📐', judul: 'Teorema Pythagoras', ringkas: 'Sisi-sisi segitiga siku-siku', c1: '#6c4cf1', c2: '#a78bfa' },
  { urutan: 3, ikon: '⚖️', judul: 'PLSV & PTLSV', ringkas: 'Persamaan dan pertidaksamaan linear satu variabel', c1: '#16a36a', c2: '#5ed8a2' },
  { urutan: 4, ikon: '🔗', judul: 'Relasi & Fungsi', ringkas: 'Memasangkan himpunan dan memahami fungsi', c1: '#0ea5e9', c2: '#6ee7f9' },
  { urutan: 5, ikon: '📈', judul: 'Persamaan Garis Lurus', ringkas: 'Gradien dan grafik garis pada koordinat', c1: '#ec4899', c2: '#f9a8d4' },
  { urutan: 6, ikon: '📊', judul: 'Statistika', ringkas: 'Mengolah dan membaca data', c1: '#f59e0b', c2: '#fcd34d' }
]

document.head.insertAdjacentHTML('beforeend', `<style>
  .kode-card { border-style:dashed; display:flex; gap:16px; align-items:center; flex-wrap:wrap }
  .kode-card .ik { font-size:2.4rem }
  .kode-card form { display:flex; gap:8px; flex:1; min-width:240px }
  .tiles { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:16px; margin-top:14px }
  .tile { position:relative; overflow:hidden; padding:0; border-radius:22px; transition:transform .15s, box-shadow .15s }
  .tile:hover { transform:translateY(-4px); box-shadow:0 10px 24px #6c4cf133 }
  .tile .top { height:120px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,var(--c1),var(--c2)) }
  .tile .top span { width:78px; height:78px; border-radius:26px; background:#ffffff38; display:flex; align-items:center; justify-content:center; font-size:2.7rem }
  .tile .no { position:absolute; top:12px; left:14px; background:#00000026; color:#fff; font-weight:800; border-radius:999px; padding:2px 11px; font-size:.85rem }
  .tile .bd { padding:16px } .tile h3 { margin:0 0 4px } .tile p { margin:0 0 12px; color:var(--muted) }
  .tile .btn { width:100%; margin-top:12px }
</style>`)

async function render() {
  if (!user) return tampilAuth()
  const { data } = await db.from('anggota_kelas').select('kelas(nama)').eq('user_id', user.id).limit(1)
  tampilUtama(data && data.length ? data[0].kelas.nama : '')
}

async function beranda(namaKelas) {
  $('isi').innerHTML = `
    <h2>Halo! Ayo belajar 👋</h2>
    <div class="card kode-card" style="margin-top:12px"><div class="ik">📝</div>
      <div style="flex:1;min-width:200px"><b>Kode Kuis</b><br><span class="kecil">Masukkan kode sandi yang sesuai</span></div>
      <form id="fKuis"><input id="kodeKuis" placeholder="Contoh: A1B2C3" maxlength="10" autocomplete="off" aria-label="Kode kuis" style="text-transform:uppercase"><button class="btn" type="submit">Mulai</button></form>
    </div><div id="pesan"></div>
    <h2 style="margin-top:24px">Pilih materi</h2><div class="tiles" id="tiles"></div>`

  $('fKuis').onsubmit = ev => {
    ev.preventDefault()
    if (!$('kodeKuis').value.trim()) return pesan('Kode kuis belum diisi.')
    mulaiDenganKode($('kodeKuis').value, t => pesan(t))
  }

  const { data: pr } = await db.from('progres').select('materi_urutan,skor,total').eq('user_id', user.id)
  const pm = Object.fromEntries((pr || []).map(p => [p.materi_urutan, Math.round(100 * p.skor / p.total)]))

  $('tiles').innerHTML = DAFTAR_MATERI.map(m => { const p = pm[m.urutan] || 0; return `
    <div class="card tile" style="--c1:${m.c1};--c2:${m.c2}">
      <div class="top"><span>${m.ikon}</span></div><div class="no">Materi ${m.urutan}</div>
      <div class="bd"><h3>${aman(m.judul)}</h3><p>${aman(m.ringkas)}</p>
        <div class="prog"><span style="width:${p}%"></span></div><p class="kecil" style="margin:6px 0 0">Progres ${p}%</p>
        <button class="btn" data-u="${m.urutan}">Buka materi</button></div></div>` }).join('')
  $('tiles').querySelectorAll('[data-u]').forEach(b => b.onclick = () => bukaMateri(DAFTAR_MATERI.find(m => m.urutan == b.dataset.u)))
}

/* Mengingat posisi terakhir (tab, materi, langkah) dan mencegah layar digambar ulang saat kembali ke tab web ini. */
const KUNCI_POSISI = 'mathquest_posisi'
const bacaPosisi = () => { try { return JSON.parse(localStorage.getItem(KUNCI_POSISI)) } catch (e) { return null } }
function ingatPosisi(p) { try { localStorage.setItem(KUNCI_POSISI, JSON.stringify({ ...(bacaPosisi() || {}), ...p })) } catch (e) {} }

let sudahPulih = false, userTampil = null

/* 1. Jangan gambar ulang layar kalau pengguna yang sama sudah tampil (Supabase mengirim event saat kamu kembali ke tab) */
const _renderAsli = render
window.render = function () {
  if (user && userTampil === user.id) return
  userTampil = user ? user.id : null
  return _renderAsli()
}
const _rpcAsli = db.rpc.bind(db)
db.rpc = (nama, ...a) => { if (nama === 'gabung_kelas') userTampil = null; return _rpcAsli(nama, ...a) }
db.auth.onAuthStateChange(e => { if (e === 'SIGNED_OUT') { userTampil = null; sudahPulih = false; try { localStorage.removeItem(KUNCI_POSISI) } catch (x) {} } })

/* 2. Simpan tab aktif, dan pulihkan posisi terakhir saat web dibuka kembali */
const _tampilUtamaAsli = tampilUtama
window.tampilUtama = function (namaKelas) {
  if (!sudahPulih) {
    sudahPulih = true
    const s = bacaPosisi()
    if (s && s.tab) tab = s.tab
    if (s && s.materi) {
      const m = DAFTAR_MATERI.find(x => x.urutan === s.materi), asli = window.beranda
      if (m) {
        window.beranda = () => {}
        try { tab = 'beranda'; _tampilUtamaAsli(namaKelas) } finally { window.beranda = asli }
        return s.materi === 1 ? bukaMateri1(m, s.langkah) : bukaMateri(m)
      }
    }
    return _tampilUtamaAsli(namaKelas)
  }
  ingatPosisi({ tab, materi: null, langkah: null })
  return _tampilUtamaAsli(namaKelas)
}

const _bukaMateriAsli = window.bukaMateri
window.bukaMateri = m => { ingatPosisi({ tab: 'beranda', materi: m.urutan, langkah: null }); return _bukaMateriAsli(m) }

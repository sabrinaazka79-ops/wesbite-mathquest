const { call } = require('./ipaymu');
const HARGA = 35000;
const res = (c, b) => ({ statusCode: c, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) });
exports.handler = async (event) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY, URL } = process.env;
  const token = (event.headers.authorization || '').replace('Bearer ', '');
  const u = await fetch(SUPABASE_URL + '/auth/v1/user', { headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token } });
  if (!u.ok) return res(401, { error: 'Belum masuk.' });
  const user = await u.json();
  const referenceId = 'MQ' + user.id.replace(/-/g, '') + '-' + Date.now();
  const { ok, data } = await call('/api/v2/payment', {
    product: ['Akses Materi 3-6 MathQuest (selamanya)'], qty: ['1'], price: [String(HARGA)],
    returnUrl: URL + '/?bayar=selesai', cancelUrl: URL + '/?bayar=batal',
    notifyUrl: URL + '/.netlify/functions/ipaymu-notif',
    referenceId, buyerName: (user.email || 'Siswa').split('@')[0], buyerEmail: user.email
  });
  const link = data && data.Data && data.Data.Url;
  if (!ok || !link) { console.log('iPaymu error:', JSON.stringify(data)); return res(502, { error: (data && data.Message) || 'Gagal membuat pembayaran.' }); }
  return res(200, { redirect_url: link });
};

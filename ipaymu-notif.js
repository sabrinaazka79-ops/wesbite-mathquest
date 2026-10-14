const { call } = require('./ipaymu');
const HARGA = 35000, LUNAS = [1, 6, 7];
exports.handler = async (event) => {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: K } = process.env;
  let raw = event.body || ''; if (event.isBase64Encoded) raw = Buffer.from(raw, 'base64').toString();
  let n; try { n = JSON.parse(raw); } catch (e) { n = Object.fromEntries(new URLSearchParams(raw)); }
  if (!n.trx_id) return { statusCode: 400, body: 'no trx_id' };
  // Jangan percaya isi notifikasi: tanyakan langsung ke iPaymu apakah transaksi ini benar-benar lunas.
  const { data } = await call('/api/v2/transaction', { transactionId: String(n.trx_id) });
  console.log('cek transaksi:', JSON.stringify(data));
  const d = (data && data.Data) || {};
  const ref = String(d.ReferenceId || n.reference_id || '');
  const amount = Number(d.Amount || d.SubTotal || 0);
  if (!LUNAS.includes(Number(d.Status)) || !/^MQ[0-9a-f]{32}-\d+$/.test(ref) || (amount && amount < HARGA)) return { statusCode: 200, body: 'diabaikan' };
  const h = ref.slice(2, 34);
  const uid = [h.slice(0, 8), h.slice(8, 12), h.slice(12, 16), h.slice(16, 20), h.slice(20)].join('-');
  await fetch(SUPABASE_URL + '/rest/v1/akses?on_conflict=user_id', {
    method: 'POST',
    headers: { apikey: K, Authorization: 'Bearer ' + K, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ user_id: uid, status: 'aktif', order_id: ref })
  });
  return { statusCode: 200, body: 'ok' };
};

const crypto = require('crypto');
exports.base = () => (process.env.IPAYMU_SANDBOX === 'true' ? 'https://sandbox.ipaymu.com' : 'https://my.ipaymu.com');
exports.call = async (path, bodyObj) => {
  const va = process.env.IPAYMU_VA, key = process.env.IPAYMU_API_KEY;
  const body = JSON.stringify(bodyObj);
  const hash = crypto.createHash('sha256').update(body).digest('hex').toLowerCase();
  const signature = crypto.createHmac('sha256', key).update(['POST', va, hash, key].join(':')).digest('hex');
  const timestamp = new Date(Date.now() + 7 * 3600 * 1000).toISOString().replace(/[-T:]/g, '').slice(0, 14);
  const r = await fetch(exports.base() + path, { method: 'POST', headers: { 'Content-Type': 'application/json', va, signature, timestamp }, body });
  return { ok: r.ok, data: await r.json().catch(() => ({})) };
};

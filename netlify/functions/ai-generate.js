// Netlify Function: membuat draf materi matematika SMP dengan Gemini.
// API key dibaca dari environment variable GEMINI_API_KEY (diisi di Netlify, BUKAN di kode).

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

const LENGTHS = {
  singkat: 'Singkat dan jelas: 2 paragraf penjelasan, 2 contoh soal, 3 latihan.',
  sedang: 'Sedang: 3-4 paragraf penjelasan, 3 contoh soal, 5 latihan.',
  lengkap: 'Lengkap: penjelasan mendalam bertahap, 4 contoh soal, 8 latihan.',
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed. Gunakan POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json(500, { error: 'GEMINI_API_KEY belum diisi di Environment variables Netlify.' });
  }

  let input;
  try {
    input = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Body bukan JSON yang valid.' });
  }

  const topic = String(input.topic || input.topik || '').trim().slice(0, 200);
  if (topic.length < 3) {
    return json(400, { error: 'Tulis topik minimal 3 karakter.' });
  }
  const lengthKey = String(input.length || input.panjang || 'singkat').toLowerCase();
  const lengthRule = LENGTHS[lengthKey] || LENGTHS.singkat;

  const prompt = `Kamu guru matematika SMP di Indonesia. Buat materi belajar dalam Bahasa Indonesia untuk topik: "${topic}".
Panjang: ${lengthRule}
Gunakan bahasa yang mudah dipahami siswa SMP. Pastikan semua perhitungan benar.
Balas HANYA dengan JSON sesuai skema.`;

  const schema = {
    type: 'OBJECT',
    properties: {
      judul: { type: 'STRING' },
      topik: { type: 'STRING' },
      kelas: { type: 'STRING' },
      ringkasan: { type: 'STRING' },
      penjelasan: { type: 'ARRAY', items: { type: 'STRING' } },
      contoh_soal: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: { soal: { type: 'STRING' }, pembahasan: { type: 'STRING' } },
          required: ['soal', 'pembahasan'],
        },
      },
      latihan: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            soal: { type: 'STRING' },
            pilihan: { type: 'ARRAY', items: { type: 'STRING' } },
            jawaban_benar: { type: 'INTEGER' },
            pembahasan: { type: 'STRING' },
          },
          required: ['soal', 'pilihan', 'jawaban_benar', 'pembahasan'],
        },
      },
    },
    required: ['judul', 'topik', 'kelas', 'ringkasan', 'penjelasan', 'contoh_soal', 'latihan'],
  };

  let res;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: schema,
            temperature: 0.6,
          },
        }),
      },
    );
  } catch (err) {
    return json(502, { error: 'Tidak bisa menghubungi Gemini.', detail: String(err.message || err) });
  }

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 500);
    const msg =
      res.status === 429
        ? 'Kuota Gemini habis atau terlalu banyak permintaan. Coba lagi nanti.'
        : res.status === 400 || res.status === 403
          ? 'API key atau model ditolak Gemini. Cek GEMINI_API_KEY dan GEMINI_MODEL.'
          : 'Gemini mengembalikan error.';
    return json(502, { error: msg, status: res.status, detail });
  }

  try {
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return json(200, JSON.parse(text));
  } catch {
    return json(502, { error: 'Jawaban Gemini tidak bisa dibaca. Coba buat lagi.' });
  }
};

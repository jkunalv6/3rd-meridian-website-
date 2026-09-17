const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
});

function cors(env) {
  return {
    'access-control-allow-origin': env.ALLOWED_ORIGIN || '*',
    'access-control-allow-methods': 'POST, GET, OPTIONS',
    'access-control-allow-headers': 'content-type, authorization',
  };
}

export default {
  async fetch(request, env) {
    const headers = cors(env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    const url = new URL(request.url);

    if (url.pathname === '/contact' && request.method === 'POST') {
      const contentType = request.headers.get('content-type') || '';
      const payload = contentType.includes('application/json') ? await request.json() : Object.fromEntries(await request.formData());
      if (String(payload.website || '').trim()) return json({ ok: true }, 200, headers); // honeypot
      const name = String(payload.name || '').trim().slice(0, 120);
      const email = String(payload.email || '').trim().slice(0, 240);
      const phone = String(payload.phone || '').trim().slice(0, 80);
      const message = String(payload.message || '').trim().slice(0, 5000);
      if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'Please provide a valid name, email, and message.' }, 400, headers);
      await env.DB.prepare('INSERT INTO contact_submissions (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, datetime(\'now\'))').bind(name, email, phone || null, message).run();
      return json({ ok: true }, 201, headers);
    }

    if (url.pathname === '/submissions' && request.method === 'GET') {
      const authorization = request.headers.get('authorization') || '';
      if (!env.ADMIN_TOKEN || authorization !== `Bearer ${env.ADMIN_TOKEN}`) return json({ error: 'Unauthorized' }, 401, headers);
      const limit = Math.min(Number(url.searchParams.get('limit') || 50), 200);
      const result = await env.DB.prepare('SELECT id, name, email, phone, message, created_at FROM contact_submissions ORDER BY id DESC LIMIT ?').bind(limit).all();
      return json({ submissions: result.results }, 200, headers);
    }

    return json({ error: 'Not found' }, 404, headers);
  },
};

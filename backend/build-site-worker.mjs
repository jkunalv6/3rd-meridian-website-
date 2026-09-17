import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const backendDir = dirname(fileURLToPath(import.meta.url));
const rootDir = dirname(backendDir);
const outputDir = join(backendDir, '.dist');

const assetDefinitions = [
  ['/', 'index.html', 'text/html; charset=utf-8', 'no-cache'],
  ['/index.html', 'index.html', 'text/html; charset=utf-8', 'no-cache'],
  ['/styles.css', 'styles.css', 'text/css; charset=utf-8', 'public, max-age=3600'],
  ['/script.js', 'script.js', 'text/javascript; charset=utf-8', 'public, max-age=3600'],
  ['/3rd-meridian-logo.png', '3rd-meridian-logo.png', 'image/png', 'public, max-age=604800'],
  ['/robots.txt', 'robots.txt', 'text/plain; charset=utf-8', 'public, max-age=3600'],
  ['/sitemap.xml', 'sitemap.xml', 'application/xml; charset=utf-8', 'public, max-age=3600'],
  ['/site.webmanifest', 'site.webmanifest', 'application/manifest+json; charset=utf-8', 'public, max-age=3600']
];

const assets = {};
for (const [route, filename, contentType, cacheControl] of assetDefinitions) {
  const bytes = await readFile(join(rootDir, filename));
  assets[route] = {
    body: bytes.toString('base64'),
    contentType,
    cacheControl,
    binary: filename.endsWith('.png')
  };
}

const source = `const ASSETS = ${JSON.stringify(assets)};

const securityHeaders = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()'
};

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', ...securityHeaders, ...headers }
});

function decodeBase64(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'www.3rdmeridiantech.com' || url.protocol === 'http:') {
      url.hostname = '3rdmeridiantech.com';
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    const corsHeaders = {
      'access-control-allow-origin': 'https://3rdmeridiantech.com',
      'access-control-allow-methods': 'POST, GET, OPTIONS',
      'access-control-allow-headers': 'content-type, authorization'
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      const contentType = request.headers.get('content-type') || '';
      const payload = contentType.includes('application/json') ? await request.json() : Object.fromEntries(await request.formData());
      if (String(payload.website || '').trim()) return json({ ok: true }, 200, corsHeaders);
      const name = String(payload.name || '').trim().slice(0, 120);
      const email = String(payload.email || '').trim().slice(0, 240);
      const phone = String(payload.phone || '').trim().slice(0, 80);
      const message = String(payload.message || '').trim().slice(0, 5000);
      if (!name || !email || !message || !/^\\S+@\\S+\\.\\S+$/.test(email)) {
        return json({ error: 'Please provide a valid name, email, and message.' }, 400, corsHeaders);
      }
      await env.DB.prepare("INSERT INTO contact_submissions (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, datetime('now'))")
        .bind(name, email, phone || null, message)
        .run();
      return json({ ok: true }, 201, corsHeaders);
    }

    if (url.pathname === '/api/submissions' && request.method === 'GET') {
      const authorization = request.headers.get('authorization') || '';
      if (!env.ADMIN_TOKEN || authorization !== 'Bearer ' + env.ADMIN_TOKEN) return json({ error: 'Unauthorized' }, 401, corsHeaders);
      const limit = Math.min(Number(url.searchParams.get('limit') || 50), 200);
      const result = await env.DB.prepare('SELECT id, name, email, phone, message, created_at FROM contact_submissions ORDER BY id DESC LIMIT ?')
        .bind(limit)
        .all();
      return json({ submissions: result.results }, 200, corsHeaders);
    }

    if ((request.method === 'GET' || request.method === 'HEAD') && ASSETS[url.pathname]) {
      const asset = ASSETS[url.pathname];
      const body = request.method === 'HEAD' ? null : decodeBase64(asset.body);
      return new Response(body, {
        headers: {
          'content-type': asset.contentType,
          'cache-control': asset.cacheControl,
          ...securityHeaders
        }
      });
    }

    return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', ...securityHeaders } });
  }
};
`;

await mkdir(outputDir, { recursive: true });
await writeFile(join(outputDir, 'worker.js'), source);
console.log(`Built ${join(outputDir, 'worker.js')} with ${assetDefinitions.length} embedded routes.`);

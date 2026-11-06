const hosts = new Set(['cadforone.com', 'www.cadforone.com']);
function reply(data, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  if (!hosts.has(url.hostname)) return reply({ error: 'Unavailable on previews' }, 403);
  if (!['GET', 'POST'].includes(request.method)) return reply({ error: 'Method not allowed' }, 405);
  if (!env.VIEWS_DB) return reply({ error: 'Counter unavailable' }, 503);
  let path;
  if (request.method === 'POST') {
    if (request.headers.get('Origin') !== url.origin) return reply({ error: 'Forbidden' }, 403);
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply({ error: 'Invalid content type' }, 415);
    // Request payload contains only a public page path, never a visitor identifier.
    const raw = await request.text();
    if (raw.length > 1024) return reply({ error: 'Payload too large' }, 413);
    try { path = JSON.parse(raw).path; } catch { return reply({ error: 'Invalid JSON' }, 400); }
  } else {
    path = url.searchParams.get('path');
  }
  if (typeof path !== 'string' || path.length > 512 || !/^\/(?:[^?#\\\x00-\x20]*)$/.test(path) || path.startsWith('//') || path.startsWith('/api/')) return reply({ error: 'Invalid path' }, 400);
  const canonical = new URL(path, url.origin);
  if (canonical.origin !== url.origin || canonical.pathname !== path) return reply({ error: 'Invalid path' }, 400);
  try {
    if (request.method === 'POST') {
      // Ignore nonexistent pages and non-HTML assets, keeping the table bounded to real pages.
      const page = await env.ASSETS.fetch(new Request(canonical, { method: 'HEAD' }));
      if (page.status !== 200 || !page.headers.get('Content-Type')?.includes('text/html')) return reply({ error: 'Not a page' }, 404);
    }
    await env.VIEWS_DB.prepare('CREATE TABLE IF NOT EXISTS view_counts (path TEXT PRIMARY KEY, views INTEGER NOT NULL DEFAULT 0)').run();
    const statements = [];
    if (request.method === 'POST') {
      const sql = 'INSERT INTO view_counts (path, views) VALUES (?, 1) ON CONFLICT(path) DO UPDATE SET views = views + 1';
      statements.push(env.VIEWS_DB.prepare(sql).bind('*'), env.VIEWS_DB.prepare(sql).bind(path));
    }
    statements.push(env.VIEWS_DB.prepare('SELECT views FROM view_counts WHERE path = ?').bind('*'), env.VIEWS_DB.prepare('SELECT views FROM view_counts WHERE path = ?').bind(path));
    const results = await env.VIEWS_DB.batch(statements);
    return reply({ site: results.at(-2).results[0]?.views ?? 0, page: results.at(-1).results[0]?.views ?? 0 });
  } catch {
    return reply({ error: 'Counter unavailable' }, 503);
  }
}

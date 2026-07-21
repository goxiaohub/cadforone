// Cloudflare Pages Function — GitHub OAuth proxy for Decap CMS
// Full-page redirect flow (no popup needed)

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const CLIENT_ID = (context.env.CMS_GITHUB_CLIENT_ID || '').trim();
  const CLIENT_SECRET = (context.env.CMS_GITHUB_CLIENT_SECRET || '').trim();

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
    });
  }

  const code = url.searchParams.get('code');

  // Step 1: No code → redirect to GitHub authorization
  if (!code) {
    const redirectUri = `${url.origin}/api/auth`;
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'repo');
    return Response.redirect(authUrl.toString(), 302);
  }

  // Step 2: Have code → exchange for access token
  try {
    const resp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
    });
    const data = await resp.json();

    if (data.error) {
      return new Response(`<html><body><h3>Error</h3><p>${data.error_description || data.error}</p><p><a href="/admin/">Back</a></p></body></html>`, {
        status: 200, headers: { 'Content-Type': 'text/html;charset=utf-8' },
      });
    }

    // Success: redirect back to admin with token in URL hash
    const tokenStr = encodeURIComponent(JSON.stringify(data));
    return Response.redirect(`${url.origin}/admin/#/auth?token=${tokenStr}`, 302);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}

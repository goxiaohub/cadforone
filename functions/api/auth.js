// Cloudflare Pages Function — GitHub OAuth proxy for Decap CMS
// Proper flow: popup → GitHub → callback with code → postMessage → exchange

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const CLIENT_ID = (context.env.CMS_GITHUB_CLIENT_ID || '').trim();
  const CLIENT_SECRET = (context.env.CMS_GITHUB_CLIENT_SECRET || '').trim();

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
    });
  }

  const code = url.searchParams.get('code');

  // Handle POST — Decap CMS sends code here for token exchange
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const exchangeCode = body.code || code;

      if (!exchangeCode) {
        return new Response(JSON.stringify({ error: 'Missing code' }), {
          status: 400, headers: { 'Content-Type': 'application/json' },
        });
      }

      const resp = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code: exchangeCode }),
      });
      const data = await resp.json();

      if (data.error) {
        return new Response(JSON.stringify({ error: data.error_description || data.error }), {
          status: 400, headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Step 1: No code → redirect to GitHub
  if (!code) {
    const redirectUri = `${url.origin}/api/auth`;
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'repo');
    return Response.redirect(authUrl.toString(), 302);
  }

  // Step 2: Callback with code — DON'T exchange it, just pass code to Decap CMS via postMessage
  const html = `<!DOCTYPE html><html><head><script>
    (function() {
      var data = { code: ${JSON.stringify(code)} };
      if (window.opener) {
        window.opener.postMessage(data, '*');
        window.close();
      } else {
        document.write('<p>Authentication successful. You can close this window.</p>');
      }
    })();
  <\/script></head><body></body></html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html;charset=utf-8' },
  });
}

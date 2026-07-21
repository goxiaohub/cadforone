// Cloudflare Pages Function — GitHub OAuth proxy for Decap CMS
// Full OAuth flow: redirect to GitHub → exchange code → return token to popup

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const CLIENT_ID = (context.env.CMS_GITHUB_CLIENT_ID || '').trim();
  const CLIENT_SECRET = (context.env.CMS_GITHUB_CLIENT_SECRET || '').trim();

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
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

  // Step 2: Have code → exchange for token
  try {
    const resp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
    });
    const data = await resp.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error_description || data.error }), {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      });
    }

    // Return HTML page that sends token to the popup opener and closes itself
    const token = JSON.stringify(data);
    const html = `<!DOCTYPE html><html><head><script>
      if (window.opener) {
        try {
          window.opener.postMessage(${token}, '*');
        } catch(e) {
          window.opener.postMessage(JSON.stringify(${token}), '*');
        }
        window.close();
      } else {
        document.write('<pre>${token.replace(/"/g, '\\"')}</pre>');
        document.write('<p>You can close this window.</p>');
      }
    <\/script></head><body></body></html>`;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html;charset=utf-8' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }
}

// Cloudflare Pages Function — GitHub OAuth proxy for Decap CMS
// Full OAuth flow: redirect to GitHub → exchange code → return token to popup

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

  // Step 1: No code → show HTML page that redirects to GitHub in the popup
  if (!code) {
    const redirectUri = `${url.origin}/api/auth`;
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'repo');

    const html = `<!DOCTYPE html><html><head>
      <title>Redirecting to GitHub...</title>
      <script>
        window.location.replace("${authUrl.toString()}");
      <\/script>
    </head><body>
      <p>Redirecting to GitHub for authorization...</p>
      <p>If nothing happens, <a href="${authUrl.toString()}">click here</a>.</p>
    </body></html>`;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html;charset=utf-8' },
    });
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
      const errHtml = `<!DOCTYPE html><html><head><title>Auth Error</title></head><body>
        <p>Error: ${data.error_description || data.error}</p>
        <p><a href="/admin/">Go back to admin</a></p>
      </body></html>`;
      return new Response(errHtml, { status: 200, headers: { 'Content-Type': 'text/html;charset=utf-8' } });
    }

    // Success: HTML page that posts token back to opener and closes popup
    const tokenJson = JSON.stringify(data);
    const html = `<!DOCTYPE html><html><head><script>
      (function() {
        var data = ${tokenJson};
        if (window.opener) {
          try {
            window.opener.postMessage(data, '*');
          } catch(e) {
            window.opener.postMessage(JSON.stringify(data), '*');
          }
          window.close();
        } else {
          document.body.innerHTML = '<p>Success! You can close this window.</p>';
        }
      })();
    <\/script></head><body></body></html>`;

    return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html;charset=utf-8' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }
}

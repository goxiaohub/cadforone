// Cloudflare Pages Function — GitHub OAuth proxy for Decap CMS
// Handles the full OAuth flow: redirect to GitHub + code exchange

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const CLIENT_ID = (context.env.CMS_GITHUB_CLIENT_ID || '').trim();
  const CLIENT_SECRET = (context.env.CMS_GITHUB_CLIENT_SECRET || '').trim();

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const code = url.searchParams.get('code');

  // Step 1: No code yet — redirect user to GitHub authorization
  if (!code) {
    const redirectUri = `${url.origin}/api/auth`;
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', CLIENT_ID);
    githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
    githubAuthUrl.searchParams.set('scope', 'repo');
    return Response.redirect(githubAuthUrl.toString(), 302);
  }

  // Step 2: Got code from GitHub — exchange it for an access token
  try {
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
        }),
      }
    );
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new Response(
        JSON.stringify({ error: tokenData.error_description || tokenData.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(tokenData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

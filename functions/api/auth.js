// Cloudflare Pages Function — GitHub OAuth proxy for Decap CMS
// Handles the OAuth code exchange so users can log into the CMS admin panel.

// Configuration — these are set via Cloudflare Pages environment variables
// CMS_GITHUB_CLIENT_ID and CMS_GITHUB_CLIENT_SECRET
const CLIENT_ID = typeof CMS_GITHUB_CLIENT_ID !== 'undefined' ? CMS_GITHUB_CLIENT_ID : '';
const CLIENT_SECRET = typeof CMS_GITHUB_CLIENT_SECRET !== 'undefined' ? CMS_GITHUB_CLIENT_SECRET : '';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // CORS headers for Decap CMS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight (OPTIONS) requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // GET /api/auth — the OAuth callback from GitHub
  if (request.method === 'GET') {
    const code = url.searchParams.get('code');

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Exchange the code for an access token
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

    // Return the token in the format Decap CMS expects
    return new Response(JSON.stringify(tokenData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // POST /api/auth — also handle POST requests (some Decap CMS versions use POST)
  if (request.method === 'POST') {
    const body = await request.json();
    const code = body.code;

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
  }

  return new Response('Method not allowed', { status: 405 });
}

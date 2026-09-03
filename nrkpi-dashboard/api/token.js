// Vercel Serverless Function — Jobber OAuth Token Exchange

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientId     = process.env.JOBBER_CLIENT_ID;
  const clientSecret = process.env.JOBBER_CLIENT_SECRET;
  const redirectUri  = process.env.REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return res.status(500).json({
      error: 'Missing environment variables',
      has_client_id:     !!clientId,
      has_client_secret: !!clientSecret,
      has_redirect_uri:  !!redirectUri
    });
  }

  const { code, refresh_token, grant_type = 'authorization_code' } = req.body;

  const params = new URLSearchParams({
    client_id:     clientId,
    client_secret: clientSecret,
    redirect_uri:  redirectUri,
    grant_type,
    ...(code          ? { code }          : {}),
    ...(refresh_token ? { refresh_token } : {})
  });

  try {
    const response = await fetch('https://api.getjobber.com/api/oauth/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    params.toString()
    });

    const data = await response.json();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(response.ok ? 200 : response.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

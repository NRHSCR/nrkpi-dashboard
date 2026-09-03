// Vercel Serverless Function — QuickBooks Online OAuth Token Exchange

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientId     = process.env.QBO_CLIENT_ID;
  const clientSecret = process.env.QBO_CLIENT_SECRET;
  const redirectUri  = `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : process.env.REDIRECT_URI}/qbo-callback`;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Missing QBO_CLIENT_ID or QBO_CLIENT_SECRET' });
  }

  const { code, refresh_token, grant_type = 'authorization_code' } = req.body;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const params      = new URLSearchParams({
    grant_type,
    redirect_uri: redirectUri,
    ...(code          ? { code }          : {}),
    ...(refresh_token ? { refresh_token } : {})
  });

  try {
    const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
        'Accept':        'application/json'
      },
      body: params.toString()
    });

    const data = await response.json();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(response.ok ? 200 : response.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

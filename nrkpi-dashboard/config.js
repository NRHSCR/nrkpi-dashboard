// api/config.js
// Serves the Jobber Client ID from Vercel environment variables
// so the browser never needs a hardcoded Client ID

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const clientId = process.env.JOBBER_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'JOBBER_CLIENT_ID not configured' });
  }

  res.status(200).json({ clientId });
}

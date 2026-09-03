// Vercel API — Returns the QBO Client ID to the browser
// The Client Secret stays server-side and is never exposed

export default function handler(req, res) {
  const clientId = process.env.QBO_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({ error: 'QBO_CLIENT_ID not configured' });
  }

  // Client ID is safe to expose (it's a public identifier, not a secret)
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ clientId });
}

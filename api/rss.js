export default async function handler(req, res) {
  const params = new URL(req.url, 'https://example.com').searchParams;
  const url = req.query?.url || params.get('url');
  const fresh = req.query?.fresh === '1' || params.get('fresh') === '1';

  if (!url) {
    res.status(400).setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 'no-store');
    return res.end(JSON.stringify({ error: 'Missing url parameter' }));
  }

  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/rss+xml, application/xml, text/xml, */*',
        'user-agent': 'Mozilla/5.0 (compatible; NewsPage/1.0)',
      },
    });
    const body = await response.text();
    res.status(response.status);
    res.setHeader('content-type', response.headers.get('content-type') || 'application/xml');
    res.setHeader('cache-control', fresh ? 'no-store' : 's-maxage=60, stale-while-revalidate=300');
    return res.end(body);
  } catch (error) {
    res.status(500).setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 'no-store');
    return res.end(JSON.stringify({ error: error.message }));
  }
}

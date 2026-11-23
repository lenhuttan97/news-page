# Vercel Image Proxy Design

## Intent

Load externally hosted news images on Vercel when an upstream CDN rejects the
deployment origin as a hotlink referrer.

## Goals

- Keep the original article image URLs in feed and Supabase data.
- Serve dynamic article images through a same-origin Vercel function.
- Preserve the existing SPA routes while allowing all `/api/*` functions to run.
- Reject malformed, non-HTTPS, private-IP, failed, and non-image upstream requests.

## Non-goals

- Resizing, transforming, storing, or permanently caching images.
- Proxying static design assets or fallback images.
- Adding a dependency or third-party image service.

## Approaches

1. Keep direct image URLs: smallest code change, but Dân Trí returns 403 for
   the Vercel referrer.
2. Maintain one CDN allowlist in the client: brittle because crawler sources
   can introduce new image hosts.
3. Proxy dynamic images through `/api/image`: selected. The server request has
   no browser referrer, while the endpoint validates the URL and content type.

## Design

- `api/image.js` accepts `GET /api/image?url=<https URL>`, validates it, fetches
  it without a referrer, and returns only successful `image/*` bodies.
- `src/data/imageProxy.js` produces an `/api/image` URL only for HTTPS image
  URLs. Rendering components use it at the `<img>` boundary, preserving raw
  URLs for links and carousel de-duplication.
- `vercel.json` changes the SPA fallback to exclude `/api`, so `rss`,
  `supabase`, and `image` functions remain routable.
- A Node built-in test covers proxy URL formatting plus API validation,
  unavailable upstreams, and valid image forwarding.

## Constraints

- No new dependencies.
- Stable JSON errors: `{ "error": "invalid_url" }` or
  `{ "error": "image_unavailable" }`.
- The Vercel function must not return upstream error text or non-image content.

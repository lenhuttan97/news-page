# Vercel Image Proxy Design

## Intent

Load Dân Trí CDN news images on Vercel when the CDN rejects the deployment
origin as a hotlink referrer.

## Goals

- Keep the original article image URLs in feed and Supabase data.
- Serve Dân Trí article images through a same-origin Vercel function.
- Preserve the existing SPA routes while allowing all `/api/*` functions to run.
- Reject malformed, non-HTTPS, private-IP, failed, and non-image upstream requests.

## Non-goals

- Resizing, transforming, storing, or permanently caching images.
- Proxying static assets, fallback images, or unverified external hosts.
- Adding a dependency or third-party image service.

## Approaches

1. Keep direct image URLs: smallest code change, but Dân Trí returns 403 for
   the Vercel referrer.
2. Proxy every external image host: rejected because an unauthenticated,
   arbitrary-URL proxy is an SSRF and resource-exhaustion risk.
3. Proxy Dân Trí images through `/api/image`: selected. The server request uses
   Dân Trí's source referrer, while the endpoint permits only the reported Dân
   Trí CDN host and validates the response.

## Design

- `api/image.js` accepts `GET /api/image?url=<https Dân Trí CDN URL>`, sends
  `Referer: https://dantri.com.vn/`, rejects redirects, validates the response,
  and returns only successful `image/*` bodies no larger than 4 MiB.
- `src/data/imageProxy.js` produces an `/api/image` URL only for approved Dân
  Trí HTTPS image URLs. Rendering components use it at the `<img>` boundary,
  preserving raw URLs for links and carousel de-duplication.
- `vercel.json` changes the SPA fallback to exclude `/api`, so `rss`,
  `supabase`, and `image` functions remain routable.
- A Node built-in test covers proxy URL formatting plus API validation,
  unavailable upstreams, and valid image forwarding.

## Constraints

- No new dependencies.
- Stable JSON errors: `{ "error": "invalid_url" }` or
  `{ "error": "image_unavailable" }`.
- The Vercel function must not return upstream error text or non-image content.
- Allow only `cdnphoto.dantri.com.vn` and cap image responses at 4 MiB.

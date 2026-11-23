# Vercel Image Proxy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render dynamic news images through a safe same-origin proxy on Vercel.

**Architecture:** A serverless image endpoint fetches validated HTTPS image URLs
without a browser referrer. A small client helper rewrites only displayed dynamic
images to that endpoint. The SPA rewrite excludes all API routes.

**Tech Stack:** Vercel serverless functions, React 18, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-11-23-vercel-image-proxy-design.md`

## Global Constraints

- Add no dependencies.
- Preserve raw source image URLs in data models.
- Accept HTTPS URLs only and reject private IP literals.
- Return stable JSON errors without upstream response details.
- Exclude `/api` from the Vercel SPA rewrite.

## Review Focus

- Missing or malformed `url` must return `400 invalid_url`.
- A private-IP literal or non-HTTPS URL must never be fetched.
- An upstream 403 or non-image body must return `502 image_unavailable`.
- Query encoding must preserve the complete external image URL.
- RSS, Supabase, and image API routes must not receive SPA HTML in production.

---

### Task 1: Image proxy contract

**Files:**
- Create: `api/image.js`
- Create: `tests/imageProxy.test.js`

**Interfaces:**
- Produces: `sendImage(res, rawUrl, fetchImpl)` and the default Vercel handler.
- Produces: `GET /api/image?url=<https URL>` with image bytes or stable JSON
  errors.

- [ ] **Step 1: Write failing tests**

Cover invalid URLs, private IP literals, upstream failures/non-image responses,
and forwarding a successful `image/jpeg` response.

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test tests/imageProxy.test.js`
Expected: FAIL because `api/image.js` does not exist.

- [ ] **Step 3: Implement `sendImage(res, rawUrl, fetchImpl)`**

Validate before fetching; forward only successful `image/*` bytes and cache
headers. Map all upstream failures to `502 image_unavailable`.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `node --test tests/imageProxy.test.js`
Expected: PASS.

### Task 2: Render dynamic images through the proxy

**Files:**
- Create: `src/data/imageProxy.js`
- Modify: `src/components/FeaturedArticles.jsx`
- Modify: `src/components/NewsCard.jsx`
- Modify: `src/components/FirstArticle.jsx`
- Modify: `src/pages/CategoryPage.jsx`
- Modify: `src/components/NewsModal.jsx`
- Modify: `src/components/ImageCarousel.jsx`

**Interfaces:**
- Produces: `imageProxyUrl(url)` for image `src` values.

- [ ] **Step 1: Write a failing helper test**

Assert a valid HTTPS URL becomes `/api/image?url=<encoded URL>` and all other
values remain unchanged.

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test tests/imageProxy.test.js`
Expected: FAIL because `imageProxyUrl` does not exist.

- [ ] **Step 3: Implement `imageProxyUrl(url)` and use it at image render boundaries**

Keep fallback and raw article URLs unchanged; do not alter carousel data before
its de-duplication logic.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `node --test tests/imageProxy.test.js`
Expected: PASS.

### Task 3: Restore Vercel API routing

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Change the SPA rewrite**

Use Vercel’s documented negative-lookahead rewrite:
`/((?!api/).*)` → `/index.html`.

- [ ] **Step 2: Verify configuration and application build**

Run: `node --check api/image.js && npm run build`
Expected: both commands exit 0.

- [ ] **Step 3: Review changes**

Run: `git diff --check && git diff --check --cached`
Expected: no whitespace errors.

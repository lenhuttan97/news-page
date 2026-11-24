# Dialog Markdown Rendering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render Markdown article bodies correctly in `NewsModal`, show Markdown images inline within the dialog, and avoid duplicate modal-level image slides.

**Architecture:** Keep the existing Supabase detail response unchanged and determine the rendering path client-side from `detail.text`. A small pure detector in `supabaseData.js` chooses between the existing paragraph renderer and a `react-markdown`/GFM renderer in `NewsModal`; the same result suppresses the lead image and `ImageCarousel` for Markdown articles.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, `react-markdown`, `remark-gfm`, Node 18 built-in test runner.

**Spec:** `docs/superpowers/specs/2026-11-24-dialog-markdown-design.md`

## Global Constraints

- Do not change crawler data, the Supabase schema, RSS rendering, or article-page rendering.
- Keep raw HTML embedded in Markdown disabled; do not install or configure `rehype-raw`.
- Preserve loading, error, author, word-count, dialog-close, and ordinary plain-text behavior.
- Preserve `ImageCarousel` unchanged for non-Markdown stories.
- Use the repository’s Tailwind palette and light/dark-mode conventions.
- Do not add a lightbox, inferred Markdown captions, or an inline-image carousel.

## Review Focus

- Markdown-like prose containing a single special character must retain the current plain-text paragraph display — cover in Task 1’s detector tests.
- Markdown using `![]()` must select the Markdown path and prevent the modal-level image area from rendering — cover in Task 2’s manual Markdown-image check.
- A landscape or portrait Markdown image wider than the dialog must retain its aspect ratio with no horizontal page/dialog overflow — cover in Task 2’s responsive-image check.
- Raw HTML or a `javascript:` URL in untrusted Markdown must not execute — cover in Task 2’s browser safety check.
- A story with normal text and multiple fetched images must keep the current carousel behavior — cover in Task 2’s plain-text regression check.

---

## File structure

- `package.json` — records the Markdown-rendering dependencies and an executable native test command.
- `package-lock.json` — locks the dependency versions selected by npm.
- `src/data/supabaseData.js` — owns the pure Markdown detection helper alongside `toParagraphs`.
- `src/data/supabaseData.test.js` — verifies the detector using Node’s built-in test runner.
- `src/components/NewsModal.jsx` — selects the body renderer, conditionally hides the modal-level image area, and supplies dialog-safe Markdown element styling.

### Task 1: Add the Markdown dependencies and a tested content-format detector

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/data/supabaseData.js:71-87`
- Create: `src/data/supabaseData.test.js`

**Interfaces:**
- Produces: `isMarkdown(text: unknown): boolean` exported from `src/data/supabaseData.js`.
- Consumes: a fetched detail’s existing `text` string; it does not alter the API response or `toParagraphs(text)`.
- Used by: Task 2’s `NewsModal` image/body branch.

- [ ] **Step 1: Add focused failing tests for `isMarkdown` in `src/data/supabaseData.test.js`**

Use `node:test` and `node:assert/strict`. Pin these cases:

```js
assert.equal(isMarkdown('# Tiêu đề\n\nNội dung'), true)
assert.equal(isMarkdown('![Sơ đồ](https://example.com/chart.png)'), true)
assert.equal(isMarkdown('- Mục một\n- Mục hai'), true)
assert.equal(isMarkdown('Đây là đoạn văn thường. Nó vẫn là text.'), false)
assert.equal(isMarkdown('Giá trị *không* phải block Markdown riêng lẻ.'), false)
assert.equal(isMarkdown(null), false)
```

- [ ] **Step 2: Add the native test script and run it to verify failure**

Add `"test:markdown": "node --test src/data/supabaseData.test.js"` to `package.json`.

Run: `npm run test:markdown`  
Expected: FAIL because `isMarkdown` is not exported yet.

- [ ] **Step 3: Implement `isMarkdown(text)` in `src/data/supabaseData.js`**

Export a pure function before `toParagraphs`. Return `false` for non-strings; otherwise detect intentional Markdown constructs used by article bodies: line-start headings, list/quote/fenced-code/table syntax, Markdown links, or Markdown images. Do not classify ordinary asterisk-emphasised prose alone as Markdown, so current plain-text stories keep their renderer.

- [ ] **Step 4: Install the chosen renderer packages**

Run: `npm install react-markdown remark-gfm`

Expected: `package.json` and `package-lock.json` record both packages; no unrelated dependencies change.

- [ ] **Step 5: Run the detector test and production build**

Run: `npm run test:markdown && npm run build`  
Expected: both commands exit 0.

- [ ] **Step 6: Review and commit Task 1**

Review: `git diff -- package.json package-lock.json src/data/supabaseData.js src/data/supabaseData.test.js`

```bash
git add package.json package-lock.json src/data/supabaseData.js src/data/supabaseData.test.js
git commit -m "feat: detect markdown story bodies"
```

### Task 2: Render Markdown safely in the dialog and hide duplicate slides

**Files:**
- Modify: `src/components/NewsModal.jsx:1-154`

**Interfaces:**
- Consumes: `isMarkdown(text)` from `src/data/supabaseData.js`.
- Consumes: `ReactMarkdown` and the `remarkGfm` plugin installed in Task 1.
- Produces: `StoryBody({ detail, isMarkdown })` that renders Markdown only when `isMarkdown === true`; `NewsModal` only renders its existing image/carousel branch when `isMarkdown === false`.

- [ ] **Step 1: Extend `StoryBody` with the Markdown rendering branch**

Import `ReactMarkdown`, `remarkGfm`, and `isMarkdown`. Change the component interface to `StoryBody({ detail, isMarkdown })`. After existing status/error guards, retain the current `toParagraphs(text)` map for false and use:

```jsx
<ReactMarkdown remarkPlugins={[remarkGfm]} components={{ /* styled elements */ }}>
  {text}
</ReactMarkdown>
```

Do not add `rehypeRaw`. Provide Tailwind-styled renderers for headings, paragraphs, lists, links, blockquotes, code, tables, and images. The custom `img` renderer must use the Markdown `src`/`alt`, `loading="lazy"`, `block max-w-full h-auto mx-auto`, rounded corners, and vertical spacing so every image fits the dialog content width without cropping.

- [ ] **Step 2: Drive the existing image branch from the same result**

After `detail` loads in `NewsModal`, derive one boolean with `isMarkdown(detail.data.text)` only when `detail.status === 'ok'`. Pass it to `StoryBody`. Gate both existing modal-level branches (`ImageCarousel` and the single `news.image` `<img>`) behind `!isMarkdown`; do not alter `buildSlides` or `ImageCarousel`.

- [ ] **Step 3: Run static verification**

Run: `npm run test:markdown && npm run build`  
Expected: both commands exit 0 with no Vite module-resolution or JSX errors.

- [ ] **Step 4: Run the development server and manually verify the affected paths**

Run: `npm run dev`

Check in the browser with a temporary/local story payload or available Tafu Hub story for each case:

1. Plain text body with multiple detail images: existing carousel appears and text remains split into paragraphs.
2. Markdown heading/list/link without an image: formatting renders; no lead image or carousel appears.
3. Markdown `![Mô tả](<wide-image-url>)`: only the inline image appears, it remains within the dialog at narrow and desktop widths, and keeps its natural ratio.
4. Raw `<img>`/`<script>` markup and a `javascript:` link in a safe local Markdown fixture: no script runs or unsafe link executes.
5. Dialog close button, backdrop close, external “Đọc thêm” link, and browser console: no regressions or console errors.

- [ ] **Step 5: Review and commit Task 2**

Review: `git diff -- src/components/NewsModal.jsx`

```bash
git add src/components/NewsModal.jsx
git commit -m "feat: render markdown in news dialog"
```

## Final verification

- [ ] Run `npm run test:markdown`.
- [ ] Run `npm run build`.
- [ ] Run `npm run dev` and repeat the Task 2 browser checks on both a plain-text and a Markdown story.
- [ ] Review the complete change: `git diff --check` and `git diff --stat`.
- [ ] Confirm only the files listed in this plan changed.

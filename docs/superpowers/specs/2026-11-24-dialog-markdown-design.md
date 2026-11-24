# Dialog Markdown rendering — design

## Intent

Tafu Hub may return article `text` as Markdown. The news dialog must render that content as formatted article text, including inline images, without duplicating images in the existing hero/carousel area.

## Goals

- Detect Markdown in `detail.text`; keep the current paragraph renderer for ordinary crawled text.
- Render detected Markdown with standard CommonMark/GFM features using `react-markdown` and `remark-gfm`.
- Do not render the dialog's lead image or `ImageCarousel` when the article body is Markdown.
- Render Markdown images inside the article body at the dialog's available width, preserving aspect ratio and avoiding horizontal overflow.
- Preserve loading, error, authors, word count, dialog close behavior, and normal-text behavior.
- Keep raw HTML in Markdown disabled.

## Non-goals

- Changing crawler data, the Supabase schema, RSS rendering, or article-page rendering.
- Supporting HTML embedded in Markdown.
- Adding image lightboxes, captions inferred from Markdown, or a second inline-image carousel.

## Constraints and scope

- The affected UI is `src/components/NewsModal.jsx`, which is invoked by `HomePage` and `CategoryPage`.
- Full text reaches the dialog through `fetchStoryDetail()` in `src/data/supabaseData.js`; the API returns one `text` field and no content-format flag.
- `react-markdown` and `remark-gfm` are not installed, so they must be explicitly added.
- Existing `ImageCarousel` stays unchanged and remains in use for non-Markdown stories.
- Markdown is untrusted external content: no `rehype-raw` or unsafe custom HTML renderer.

## Approaches considered

1. **Custom Markdown parser:** no dependency, but incomplete and fragile for real article Markdown. Rejected.
2. **`react-markdown` + `remark-gfm`:** a maintained renderer for standard Markdown, customisable image output, and raw HTML remains escaped/ignored by default. **Chosen.**
3. **Render every story as Markdown:** smaller render branching but would alter current plain-text paragraph behaviour. Rejected.

## Design

1. Add a small shared Markdown detector next to the existing text-paragraph helper. It will identify meaningful block or inline Markdown syntax (including `![]()` images) rather than treating all fetched text as Markdown.
2. In `NewsModal`, derive `isMarkdown` from the loaded detail text:
   - Markdown: render a `ReactMarkdown` body with `remarkGfm`.
   - Plain text: retain `toParagraphs(text)` and the current `<p>` list.
3. When `isMarkdown` is true, suppress the modal-level lead image and `ImageCarousel`. Any article image appears only where its Markdown image token places it.
4. Supply a Markdown `img` component with responsive dialog-safe styles: block layout, `max-width: 100%`, automatic height, centred, rounded corners, and lazy loading. The image retains its Markdown alt text.
5. Style Markdown blocks in the dialog with existing Tailwind typography tokens so headings, paragraphs, lists, tables, quotes, code blocks, and links remain legible in light and dark modes.

## Verification

- `npm run build` succeeds.
- Run `npm run dev` and manually check:
  - a normal Supabase/RSS article: existing image/carousel and paragraph body remain unchanged;
  - Markdown without images: formatted body, no lead image/carousel;
  - Markdown with a wide image: no duplicate slider, image fits the dialog without horizontal scroll, retains aspect ratio;
  - links and keyboard/close interactions still work; browser console has no errors.

## Implementation choices left to the builder

- Exact Markdown-detection regular expression, calibrated against available story samples.
- Exact Tailwind class list, using the repository's palette and spacing conventions.

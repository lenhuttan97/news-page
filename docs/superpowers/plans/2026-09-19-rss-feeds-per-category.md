# RSS Feeds Per-Category Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trang chủ fetch 5 feed tổng hợp, mỗi trang `/category/:slug` fetch đúng các feed của chuyên mục đó.

**Architecture:** Giữ 1 parser RSS chung trong `src/data/rssData.js`; thêm `HOME_FEEDS` + `CATEGORY_FEEDS` (map id → danh sách feed); thêm 2 hàm `fetchHomeNews()` / `fetchCategoryNews(id)`; `newsSlice` thêm thunk `fetchCategoryNews`; `CategoryPage` dispatch theo slug.

**Tech Stack:** React 18, Redux Toolkit 2.x, React Router 7, Vite 5 (không thêm dependency mới).

**Spec:** Yêu cầu của user trong chat (danh sách URL feed trang chủ + bảng feed theo 12 chuyên mục, lưu ý QĐND chỉ dùng đúng 1 endpoint `https://www.qdnd.vn/rss`, không tự suy URL con).

## Global Constraints

- Không thêm dependency mới vào `package.json`.
- Shape article giữ nguyên: `{id, title, description, link, pubDate, image, source, color, category}`.
- `NEWS_CATEGORIES` là nguồn duy nhất cho label/slug category ở Header, CategoryGrid, CategoryFilter, App.
- QĐND chỉ dùng đúng endpoint `https://www.qdnd.vn/rss`, không tự bịa URL `.rss` cho từng nhóm con.
- Trước khi báo hoàn thành: `npm run build` pass + `npm run dev` load không lỗi (rule trong `AGENTS.md`).

## Review Focus

- Feed chết/proxy 500 → trang vẫn render với các feed còn lại (nhờ try/catch từng feed), không white-screen.
- Slug lạ (`/category/xyz`) → hiện thông báo + link về trang chủ, không crash.
- Tin trùng link giữa nhiều feed trong cùng chuyên mục → dedupe theo link, không hiện 2 lần.
- Bài không có ảnh → UI đã có fallback ảnh, nhóm Top Story/Latest vẫn lọc `image != ""` như hiện tại.
- QĐND trả về XML khác cấu trúc item chuẩn → parser không ném lỗi ra ngoài (catch từng feed).

---

### Task 1: Viết lại `src/data/rssData.js` (feed trang chủ + feed theo chuyên mục)

**Files:**
- Modify: `src/data/rssData.js` (toàn file, hiện 120 dòng)

**Interfaces:**
- Consumes: không (file lá, chỉ dùng DOMParser + fetch).
- Produces (các task sau dùng đúng tên này):
  - `HOME_FEEDS: Array<{source, rss_url, color}>`
  - `CATEGORY_FEEDS: Record<string, Array<{source, rss_url, color}>>`
  - `NEWS_CATEGORIES: Array<{id, label}>` (giữ entry `{id:'all', label:'Tất cả'}` đầu tiên)
  - `fetchHomeNews(): Promise<Article[]>`
  - `fetchCategoryNews(categoryId: string): Promise<Article[]>` (id lạ → `return []`)
  - `fetchRSSData(): Promise<Article[]>` (giữ nguyên tên, alias → `fetchHomeNews`, để code cũ không gãy)

**Category IDs chốt (12 chuyên mục):**
`tin-tuc` (Tin tức), `kinh-te` (Kinh tế), `giao-duc` (Giáo dục), `cong-nghe` (Công nghệ), `the-thao` (Thể thao), `suc-khoe` (Sức khỏe), `doi-song` (Đời sống), `van-hoa` (Văn hóa & Giải trí), `du-lich` (Du lịch), `xe` (Xe), `quoc-phong` (Quốc phòng – An ninh), `video` (Video / Podcast).

**Mapping feed (verbatim từ spec của user):**
- Home (5): `https://vnexpress.net/rss/tin-moi-nhat.rss` (VnExpress), `https://vnexpress.net/rss/tin-noi-bat.rss` (VnExpress), `https://tuoitre.vn/home.rss` (Tuổi Trẻ), `https://thanhnien.vn/rss/home.rss` (Thanh Niên), `https://laodong.vn/rss` (Lao Động).
- `tin-tuc`: 3 home-feed trên (trừ Lao Động) + `thoi-su` ×3 (vnexpress/tuoitre/thanhnien) + `thanhnien.vn/rss/chinh-tri.rss` + `the-gioi` ×3 + `thanhnien.vn/rss/thoi-su/quoc-phong.rss` + `phap-luat` ×3.
- `kinh-te`: `vnexpress.net/rss/kinh-doanh.rss`, `tuoitre.vn/kinh-doanh.rss`, `thanhnien.vn/rss/kinh-te.rss`, `.../kinh-te/ngan-hang.rss`, `.../kinh-te/chung-khoan.rss`, `.../kinh-te/doanh-nghiep.rss`, `vnexpress.net/rss/bat-dong-san.rss`, `.../kinh-te/dia-oc.rss`, `.../thoi-su/lao-dong-viec-lam.rss`.
- `giao-duc`: `vnexpress.net/rss/giao-duc.rss`, `tuoitre.vn/giao-duc.rss`, `thanhnien.vn/rss/giao-duc.rss` + 7 feed con (`tuyen-sinh`, `chon-nghe-chon-truong`, `du-hoc`, `nha-truong`, `phu-huynh`, `tra-cuu-diem-thi`, `on-thi-tot-nghiep`).
- `cong-nghe`: `vnexpress.net/rss/khoa-hoc.rss`, `tuoitre.vn/nhip-song-so.rss`, `tuoitre.vn/khoa-hoc.rss`, `thanhnien.vn/rss/cong-nghe.rss` + 6 feed con (`tin-tuc-cong-nghe`, `blockchain`, `san-pham`, `xu-huong-chuyen-doi-so`, `thu-thuat`, `game`).
- `the-thao`: `vnexpress.net/rss/the-thao.rss`, `tuoitre.vn/the-thao.rss`, `thanhnien.vn/rss/the-thao.rss` + 4 feed con (`bong-da-viet-nam`, `bong-da-quoc-te`, `bong-da-thanh-nien-sinh-vien`, `cac-mon-khac`).
- `suc-khoe`: `vnexpress.net/rss/suc-khoe.rss`, `tuoitre.vn/suc-khoe.rss`, `thanhnien.vn/rss/suc-khoe.rss`, `.../suc-khoe/y-te-thong-minh.rss`, `.../thoi-su/thanh-tuu-y-khoa.rss`.
- `doi-song`: `vnexpress.net/rss/gia-dinh.rss`, `tuoitre.vn/nhip-song-tre.rss`, `thanhnien.vn/rss/doi-song.rss`, `.../doi-song/gia-dinh.rss`, `.../rss/gioi-tre.rss`, `.../gioi-tre/khoi-nghiep.rss`, `.../gioi-tre/co-hoi-nghe-nghiep.rss`.
- `van-hoa`: `vnexpress.net/rss/giai-tri.rss`, `tuoitre.vn/giai-tri.rss`, `thanhnien.vn/rss/giai-tri.rss`, `tuoitre.vn/van-hoa.rss`, `thanhnien.vn/rss/van-hoa.rss`, `.../giai-tri/phim.rss`, `.../giai-tri/truyen-hinh.rss`, `.../van-hoa/sach-hay.rss`.
- `du-lich`: `vnexpress.net/rss/du-lich.rss`, `tuoitre.vn/du-lich.rss`, `thanhnien.vn/rss/du-lich.rss`, `.../du-lich/kham-pha.rss`, `.../du-lich/cau-chuyen-du-lich.rss`.
- `xe`: `vnexpress.net/rss/oto-xe-may.rss`, `tuoitre.vn/xe.rss`, `thanhnien.vn/rss/xe.rss`, `.../xe/thi-truong.rss`, `.../xe/xe-xanh.rss`, `.../xe/danh-gia-xe.rss`.
- `quoc-phong`: `https://www.qdnd.vn/rss` (QĐND, 1 endpoint duy nhất) + `thanhnien.vn/rss/chinh-tri.rss` + `thanhnien.vn/rss/thoi-su/quoc-phong.rss`.
- `video`: `tuoitre.vn/video.rss`, `thanhnien.vn/rss/video.rss`, `.../rss/podcast.rss`, `.../podcast/genz.rss`, `.../podcast/showbiz.rss`.

- [ ] **Step 1: Viết helper fetch chung + dedupe (thay thân file, giữ export cũ)**

```js
const PROXY = '/api/rss';

async function fetchFeedList(feeds, forcedCategory) {
  const settled = await Promise.all(
    feeds.map(async (feed) => {
      try {
        const res = await fetch(`${PROXY}?url=${encodeURIComponent(feed.rss_url)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return parseRSSXML(await res.text(), feed.source, feed.color, forcedCategory);
      } catch (error) {
        console.warn(`Failed to fetch ${feed.source} ${feed.rss_url}:`, error);
        return [];
      }
    }),
  );
  const seen = new Set();
  return settled
    .flat()
    .filter((item) => {
      if (!item.link || seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    })
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

export async function fetchHomeNews() {
  return fetchFeedList(HOME_FEEDS);
}

export async function fetchCategoryNews(categoryId) {
  const feeds = CATEGORY_FEEDS[categoryId];
  if (!feeds) return [];
  return fetchFeedList(feeds, categoryId);
}

export async function fetchRSSData() {
  return fetchHomeNews();
}
```

- [ ] **Step 2: Parser nhận `forcedCategory` + tách ảnh từ `<img>` trong description**

```js
function parseRSSXML(xmlText, source, color, forcedCategory) {
  const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Invalid XML');
  const items = [];
  Array.from(doc.getElementsByTagName('item')).forEach((node) => {
    const title = node.querySelector('title')?.textContent || '';
    const link = node.querySelector('link')?.textContent || '';
    const descriptionHtml = node.querySelector('description')?.textContent || '';
    const pubDate = node.querySelector('pubDate')?.textContent || '';
    const image =
      node.querySelector('enclosure')?.getAttribute('url') ||
      node.querySelector('media\\:thumbnail, media\\:content')?.getAttribute('url') ||
      extractImgFromHtml(descriptionHtml) ||
      '';
    if (title && link) {
      items.push({
        id: `${source}-${link}`,
        title,
        description: stripHTML(descriptionHtml),
        link,
        pubDate,
        image,
        source,
        color,
        category: forcedCategory || categorizeNews(title),
      });
    }
  });
  return items;
}

function extractImgFromHtml(html) {
  const match = /<img[^>]+src=["']([^"']+)["']/i.exec(html || '');
  return match ? match[1] : '';
}
```

- [ ] **Step 3: Mở rộng `categorizeNews` cho 12 id mới** (giữ thứ tự ưu tiên: từ khóa đặc thù trước, chung sau; bài trang chủ không khớp → `'tin-tuc'`). Từ khóa gợi ý: tin-tuc (thời sự, thế giới, pháp luật, chính trị), kinh-te (kinh doanh, chứng khoán, ngân hàng, bất động sản, doanh nghiệp), giao-duc (giáo dục, tuyển sinh, du học, thi), cong-nghe (khoa học, công nghệ, game, blockchain, số), the-thao (thể thao, bóng đá), suc-khoe (sức khỏe, y tế), doi-song (đời sống, gia đình, giới trẻ, việc làm), van-hoa (văn hóa, giải trí, phim, sách), du-lich (du lịch, khám phá), xe (ô tô, xe máy, xe điện), quoc-phong (quốc phòng, an ninh, quân đội), video (video, podcast).
- [ ] **Step 4: Build kiểm tra**

Run: `npm run build` trong `/home/tanle/opencode/project/news-page`
Expected: `✓ built` không lỗi.

- [ ] **Step 5: Commit**

```bash
git add src/data/rssData.js
git commit -m "feat: home feeds and per-category RSS feeds"
```

### Task 2: Thêm thunk `fetchCategoryNews` vào store

**Files:**
- Modify: `src/store/newsSlice.js` (hiện 37 dòng)

**Interfaces:**
- Consumes: `fetchHomeNews`, `fetchCategoryNews` từ `../data/rssData` (Task 1).
- Produces: `fetchNews` (giữ nguyên tên, giờ gọi `fetchHomeNews` — `src/App.jsx:28` dùng), `fetchCategoryNews` (mới, nhận `categoryId: string`), `selectAllArticles` (giữ nguyên).

- [ ] **Step 1: Thêm thunk + reducer cases**

```js
import { fetchHomeNews, fetchCategoryNews as fetchCategoryRSS } from '../data/rssData';

export const fetchNews = createAsyncThunk('news/fetchNews', async () => {
  return await fetchHomeNews();
});

export const fetchCategoryNews = createAsyncThunk(
  'news/fetchCategoryNews',
  async (categoryId) => {
    return await fetchCategoryRSS(categoryId);
  }
);
```

Thêm vào `extraReducers` (copy y hệt block của `fetchNews`, đổi tên): pending → `loading=true, error=null`; fulfilled → `loading=false, items=payload`; rejected → `loading=false, error=message`.

- [ ] **Step 2: Build kiểm tra**

Run: `npm run build` trong `/home/tanle/opencode/project/news-page`
Expected: `✓ built` không lỗi.

- [ ] **Step 3: Commit**

```bash
git add src/store/newsSlice.js
git commit -m "feat: add fetchCategoryNews thunk to news store"
```

### Task 3: `CategoryPage` tự fetch feed theo slug

**Files:**
- Modify: `src/components/CategoryPage.jsx` (hiện 144 dòng; đã có `useParams`, `selectAllArticles`, `NEWS_CATEGORIES`)

**Interfaces:**
- Consumes: `fetchCategoryNews` từ `../store/newsSlice` (Task 2), `NEWS_CATEGORIES` (Task 1).
- Produces: không (route `/category/:slug` đã khai báo trong `src/router.jsx`).

- [ ] **Step 1: Dispatch fetch theo slug + xử lý slug lạ**

```jsx
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategoryNews } from '../store/newsSlice'

const isKnownCategory = NEWS_CATEGORIES.some((cat) => cat.id === slug);
useEffect(() => {
  if (isKnownCategory && slug !== 'all') {
    dispatch(fetchCategoryNews(slug));
  }
}, [dispatch, slug]);
```

Nếu slug không thuộc `NEWS_CATEGORIES`: render khối "Không có chuyên mục này" + `<Link to="/">Về trang chủ</Link>` (thay vì list rỗng). Giữ nguyên phần loading/error hiện có. Bỏ filter theo slug ở `categoryArticles` (thunk đã trả đúng category) nhưng giữ filter an toàn thì cũng được — chọn 1, không để cả 2 mâu thuẫn.

- [ ] **Step 2: Build + smoke test dev**

Run: `npm run build` trong `/home/tanle/opencode/project/news-page` → Expected: `✓ built`.
Run: `npm run dev`, mở `/` (hiện tin), mở `/category/kinh-te` (hiện tin kinh tế, không spinner treo, không lỗi console).

- [ ] **Step 3: Commit**

```bash
git add src/components/CategoryPage.jsx
git commit -m "feat: category page fetches its own RSS feeds by slug"
```

### Task 4: Cập nhật icon/label theo 12 category mới

**Files:**
- Modify: `src/components/CategoryGrid.jsx` (`CATEGORY_ICONS` hiện chỉ có 4 key cũ `tech/business/sports/lifestyle`)
- Modify: `src/components/CategoryFilter.jsx` (ternary icon đang key theo id cũ)
- Check (không sửa nếu đã đúng): `src/components/Header.jsx`, `src/App.jsx` (đã render động từ `NEWS_CATEGORIES`)

**Interfaces:** Consumes `NEWS_CATEGORIES` (Task 1). Không đổi props/output.

- [ ] **Step 1: Mở rộng `CATEGORY_ICONS`** đủ 12 id: `tin-tuc: 'newspaper'`, `kinh-te: 'account_balance'`, `giao-duc: 'school'`, `cong-nghe: 'laptop_chromebook'`, `the-thao: 'sports_soccer'`, `suc-khoe: 'health_and_safety'`, `doi-song: 'restaurant'`, `van-hoa: 'theater_comedy'`, `du-lich: 'flight'`, `xe: 'directions_car'`, `quoc-phong: 'shield'`, `video: 'play_circle'`, fallback `'public'`.
- [ ] **Step 2: Sửa ternary icon trong `CategoryFilter.jsx`** sang id mới (hoặc refactor dùng chung map icon — chọn 1 cách, code tường minh).
- [ ] **Step 3: Build kiểm tra**

Run: `npm run build` trong `/home/tanle/opencode/project/news-page`
Expected: `✓ built` không lỗi.

- [ ] **Step 4: Commit**

```bash
git add src/components/CategoryGrid.jsx src/components/CategoryFilter.jsx
git commit -m "feat: category icons for expanded category list"
```

### Task 5: Nghiệm thu cuối (rule AGENTS.md)

**Files:** không sửa code.

- [ ] **Step 1: Build production**

Run: `npm run build` trong `/home/tanle/opencode/project/news-page`
Expected: pass, không error/warning mới.

- [ ] **Step 2: Chạy dev và kiểm tra loading**

Run: `npm run dev`, mở `/` và 2–3 trang `/category/<slug>` (ví dụ `kinh-te`, `the-thao`, `cong-nghe`).
Expected: không lỗi console (SyntaxError/ReferenceError), không trắng trang, không spinner treo, không lỗi network thất bại toàn bộ (1–2 feed lẻ lỗi vẫn chấp nhận được).

- [ ] **Step 3: Báo hoàn thành** (chỉ khi Step 1–2 đạt).

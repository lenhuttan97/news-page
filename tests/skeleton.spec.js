import { test, expect, chromium } from '@playwright/test'

const BASE = 'http://localhost:3000'
// Playwright-bundled Chromium fails to install on this Mac (mac13).
// Launch the system Chrome binary explicitly instead.
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const ctx = await chromium.launch({ executablePath: CHROME, headless: true })

test.describe('category skeleton on switch', () => {
  test('switching categories shows skeleton, not empty-state flash', async ({ page: _page }) => {
    const page = await ctx.newPage()

    const routes = [
      '/',
      '/category/suc-khoe',
      '/category/the-thao',
      '/category/kinh-te',
      '/',
    ]

    for (const route of routes) {
      await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(800)

      const html = await page.content()

      // Skeleton is present on category pages (fetch in flight / just switched).
      // The empty-state "Không có bài viết nào" must NOT appear while loading.
      const hasSkeleton = /bg-gray-200|flex flex-col bg-background-light dark:bg-background-dark/.test(html)
      const hasEmpty = /Không có bài viết nào/.test(html)

      if (route.startsWith('/category/')) {
        expect(hasSkeleton).toBe(true)
        expect(hasEmpty).toBe(false)
      }
    }
    await page.close()
  })

  test('skeleton is visible immediately after switching to an uncached category', async ({ page: _page }) => {
    const page = await ctx.newPage()

    // Prime kinh-te first so it is cached, then switch to an uncached one.
    await page.goto(`${BASE}/category/kinh-te`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1500)

    // Switch to a fresh category — first paint must be skeleton, not empty.
    await page.goto(`${BASE}/category/the-thao`, { waitUntil: 'domcontentloaded' })
    const html = await page.content()
    const hasSkeleton = /bg-gray-200|flex flex-col bg-background-light dark:bg-background-dark/.test(html)
    const hasEmpty = /Không có bài viết nào/.test(html)

    expect(hasSkeleton).toBe(true)
    expect(hasEmpty).toBe(false)
    await page.close()
  })

  test.afterAll(async () => {
    await ctx.close()
  })
})
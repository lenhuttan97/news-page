import assert from 'node:assert/strict'
import test from 'node:test'
import viteConfig from '../vite.config.js'

test('registers the image proxy on the Vite development server', () => {
  const registeredPaths = []
  const server = {
    middlewares: {
      use(path) {
        registeredPaths.push(path)
      },
    },
  }

  viteConfig({ mode: 'test' }).plugins.forEach((plugin) => plugin.configureServer?.(server))

  assert.deepEqual(registeredPaths, ['/api/supabase', '/api/rss', '/api/image'])
})

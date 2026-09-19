import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rss-proxy',
      configureServer(server) {
        server.middlewares.use('/api/rss', async (req, res, next) => {
          const url = new URL(req.url, 'http://localhost').searchParams.get('url')
          if (!url) {
            res.statusCode = 400
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ error: 'Missing url parameter' }))
            return
          }

          try {
            const response = await fetch(url, {
              headers: {
                accept: 'application/rss+xml, application/xml, text/xml, */*',
                'user-agent': 'Mozilla/5.0 (compatible; NewsPage/1.0)',
              },
            })
            const body = await response.text()
            res.statusCode = response.status
            res.setHeader('content-type', response.headers.get('content-type') || 'application/xml')
            res.setHeader('cache-control', 'no-store')
            res.end(body)
          } catch (error) {
            res.statusCode = 500
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ error: error.message }))
          }
        })
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
})

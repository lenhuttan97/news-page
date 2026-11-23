import assert from 'node:assert/strict'
import test from 'node:test'
import { sendImage } from '../api/image.js'
import { imageProxyUrl } from '../src/data/imageProxy.js'

function responseRecorder() {
  return {
    headers: new Map(),
    setHeader(name, value) {
      this.headers.set(name.toLowerCase(), value)
    },
    end(body) {
      this.body = body
    },
  }
}

function bodyJson(res) {
  return JSON.parse(String(res.body))
}

test('encodes only HTTPS image URLs for the same-origin proxy', () => {
  assert.equal(
    imageProxyUrl('https://cdnphoto.dantri.com.vn/a photo.jpg?width=1200'),
    '/api/image?url=https%3A%2F%2Fcdnphoto.dantri.com.vn%2Fa%20photo.jpg%3Fwidth%3D1200',
  )
  assert.equal(imageProxyUrl('http://cdnphoto.dantri.com.vn/image.jpg'), 'http://cdnphoto.dantri.com.vn/image.jpg')
  assert.equal(imageProxyUrl(''), '')
  assert.equal(imageProxyUrl('not a URL'), 'not a URL')
})

test('rejects missing and unsafe image URLs without fetching', async () => {
  for (const url of ['', 'http://cdnphoto.dantri.com.vn/image.jpg', 'https://127.0.0.1/image.jpg']) {
    const res = responseRecorder()
    let calls = 0

    await sendImage(res, url, async () => {
      calls += 1
    })

    assert.equal(res.statusCode, 400)
    assert.deepEqual(bodyJson(res), { error: 'invalid_url' })
    assert.equal(calls, 0)
  }
})

test('maps unavailable or non-image upstream responses to a stable error', async () => {
  for (const upstream of [
    async () => new Response('blocked', { status: 403, headers: { 'content-type': 'text/html' } }),
    async () => new Response('page', { status: 200, headers: { 'content-type': 'text/html' } }),
  ]) {
    const res = responseRecorder()

    await sendImage(res, 'https://cdnphoto.dantri.com.vn/image.jpg', upstream)

    assert.equal(res.statusCode, 502)
    assert.deepEqual(bodyJson(res), { error: 'image_unavailable' })
  }
})

test('forwards a successful image response', async () => {
  const res = responseRecorder()
  const pixels = Buffer.from([0xff, 0xd8, 0xff, 0xd9])

  await sendImage(
    res,
    'https://cdnphoto.dantri.com.vn/image.jpg',
    async () => new Response(pixels, { headers: { 'content-type': 'image/jpeg' } }),
  )

  assert.equal(res.statusCode, 200)
  assert.equal(res.headers.get('content-type'), 'image/jpeg')
  assert.equal(res.headers.get('cache-control'), 'public, s-maxage=86400, stale-while-revalidate=604800')
  assert.deepEqual(res.body, pixels)
})

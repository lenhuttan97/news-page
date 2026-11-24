import test from 'node:test'
import assert from 'node:assert/strict'
import { isMarkdown } from './markdown.js'

test('detects a heading line as markdown', () => {
  assert.equal(isMarkdown('# Tiêu đề\n\nNội dung'), true)
})

test('detects a standalone markdown image as markdown', () => {
  assert.equal(isMarkdown('![Sơ đồ](https://example.com/chart.png)'), true)
})

test('detects a bullet list as markdown', () => {
  assert.equal(isMarkdown('- Mục một\n- Mục hai'), true)
})

test('keeps a plain paragraph as text', () => {
  assert.equal(isMarkdown('Đây là đoạn văn thường. Nó vẫn là text.'), false)
})

test('does not treat inline emphasis alone as markdown', () => {
  assert.equal(isMarkdown('Giá trị *không* phải block Markdown riêng lẻ.'), false)
})

test('returns false for non-string input', () => {
  assert.equal(isMarkdown(null), false)
})

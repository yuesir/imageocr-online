import test from 'node:test'
import assert from 'node:assert/strict'
import { safeAuthRedirect } from '../lib/auth/redirect'

test('OAuth destinations preserve local paths and query strings', () => {
  assert.equal(safeAuthRedirect('/pricing?pack=plus'), '/pricing?pack=plus')
  assert.equal(safeAuthRedirect('/ocr#upload'), '/ocr#upload')
})

test('OAuth destinations reject external URLs, browser normalization tricks, and login loops', () => {
  for (const value of [null, '', 'https://evil.example', '//evil.example', '/\\evil.example', '/\nevil.example', '/auth/callback?code=x', '/login', '/signup', '/a/../auth/callback']) {
    assert.equal(safeAuthRedirect(value), '/ocr', String(value))
  }
})

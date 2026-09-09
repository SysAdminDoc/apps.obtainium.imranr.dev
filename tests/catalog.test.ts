import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getApps } from '../src/lib/data'
import { getAppConfig, getAppConfigString, extractAppParamsFromRequest, queryAppsAsync, getDefaultSort } from '../src/lib/query'
import { getCurrentLanguage, getLocalizedStrings, localHref } from '../src/lib/i18n'
import { getInstallCounts, getAppInstallCount, hasLinkStats } from '../src/lib/stats'
import { isSourceUrl, parseRedirect, validateConfig } from '../src/lib/config'
import type { ComplexApp, QueryOptions } from '../src/lib/types'

const config = { id: 'org.example.app', name: 'Example', author: 'Example author', url: 'https://example.org/releases' }
const encode = (value: unknown) => 'obtainium://app/' + encodeURIComponent(JSON.stringify(value))
const options: QueryOptions = { categories: [], categoryMode: 'inclusive', type: 'both', q: '', page: 1, limit: 50, sort: 'name' }

test('every catalog configuration is valid and both hidden records are restored', () => {
  const apps = getApps()
  assert.equal(apps.length, 254)
  assert.equal(apps.flatMap(getAppConfig).length, 378)
  for (const app of apps) for (const entry of getAppConfig(app)) validateConfig(entry)
  assert.ok(apps.some(app => getAppConfig(app)[0].name === 'LocalSend'))
  const earth = apps.find(app => getAppConfig(app)[0].name === 'Magic Earth')!
  assert.equal(JSON.parse((getAppConfig(earth)[0] as any).additionalSettings).versionExtractionRegEx, '-(\\d.*)-a')
})

test('configuration export preserves the source and strips presentation-only variant labels', () => {
  const apps = getApps()
  const original = JSON.stringify(apps)
  for (const app of apps) for (let i = 0; i < getAppConfig(app).length; i++) {
    const exported = JSON.parse(getAppConfigString(app, 'en', i))
    validateConfig(exported)
    assert.equal(exported.altLabel, undefined)
    assert.ok(!('error' in parseRedirect(encode(exported))))
  }
  assert.equal(JSON.stringify(apps), original)
})

for (const [label, value] of Object.entries({ script: 'javascript:alert(1)', data: 'data:text/html,test', file: 'file:///tmp/test', credentials: 'https://user:password@example.org', relative: '/source', backslash: 'https://example.org\\@evil.example', control: 'https://example.org\n', empty: '', object: {} })) {
  test('reject unsafe source URL: ' + label, () => {
    assert.equal(isSourceUrl(value), false)
    assert.ok('error' in parseRedirect(encode({ ...config, url: value })))
  })
}
test('valid HTTP and HTTPS sources keep their original configuration fields', () => {
  for (const url of ['https://example.org/path?q=1#anchor', 'http://example.org/source']) {
    const parsed = parseRedirect(encode({ ...config, url }))
    assert.ok(!('error' in parsed))
    assert.equal(parsed.source, url)
    assert.deepEqual(JSON.parse(decodeURIComponent(parsed.href.slice(16))), { ...config, url })
  }
})
for (const [label, input] of Object.entries({ missing: null, scheme: 'https://example.org', malformedEscape: 'obtainium://app/%xx', nullConfig: encode(null), array: encode([]), missingId: encode({ url: config.url }), malformedSettings: encode({ ...config, additionalSettings: '{' }), settingsArray: encode({ ...config, additionalSettings: '[]' }), oversized: 'obtainium://app/' + 'x'.repeat(64001) })) {
  test('reject invalid shared configuration: ' + label, () => assert.ok('error' in parseRedirect(input)))
}
test('source-only Obtainium links are validated', () => {
  assert.ok(!('error' in parseRedirect('obtainium://add/' + encodeURIComponent(config.url))))
  assert.ok('error' in parseRedirect('obtainium://add/javascript:alert(1)'))
})
test('query parser clamps numbers and rejects unsupported options', async () => {
  const parsed = await extractAppParamsFromRequest(new Request('http://localhost/apps?page=no&limit=Infinity&type=invalid&sort=invalid&categoryMode=invalid&category=notes&category=notes&category=%20music%20'))
  assert.deepEqual(parsed, { ...options, categories: ['notes', 'music'], sort: 'relevance' })
  const clamped = await extractAppParamsFromRequest(new Request('http://localhost/apps?page=99999999999&limit=999999'))
  assert.equal(clamped.page, 1000000)
  assert.equal(clamped.limit, 200)
})
test('page overflow returns the final real page', async () => {
  const result = await queryAppsAsync({ ...options, page: 9999 })
  assert.equal(result.pagination.page, result.pagination.totalPages)
  assert.equal(result.apps.length, 4)
})
test('search is literal, case-insensitive and covers names and authors', async () => {
  assert.equal((await queryAppsAsync({ ...options, q: 'localsend' })).pagination.total, 1)
  assert.equal((await queryAppsAsync({ ...options, q: '.*' })).pagination.total, 0)
  assert.equal((await queryAppsAsync({ ...options, q: '[' })).pagination.page, 1)
})
test('category modes match any or all selected categories', async () => {
  for (const categoryMode of ['inclusive', 'exclusive'] as const) {
    const result = await queryAppsAsync({ ...options, categories: ['notes', 'utilities'], categoryMode, limit: 200 })
    for (const app of result.apps) assert.ok(categoryMode === 'exclusive' ? ['notes', 'utilities'].every(cat => app.categories.includes(cat)) : ['notes', 'utilities'].some(cat => app.categories.includes(cat)))
  }
})
test('type filters and alphabet pages use the filtered result', async () => {
  for (const type of ['simple', 'complex'] as const) {
    const result = await queryAppsAsync({ ...options, type })
    assert.ok(result.apps.length)
    assert.ok(result.apps.every(app => app.type === type))
    assert.equal(result.letterPages?.A, 1)
  }
})
test('statistics are off without an explicit endpoint and site ID', async () => {
  assert.equal(hasLinkStats(), false)
  assert.equal(getDefaultSort([]), 'name')
  assert.deepEqual(await getInstallCounts(), {})
})
test('variants with the same package ID do not inflate link clicks', () => {
  const app: ComplexApp = { type: 'complex', categories: [], description: {}, configs: [config, { ...config, altLabel: 'beta' }] }
  assert.equal(getAppInstallCount(app, { [config.id]: 9 }), 9)
  assert.equal(getAppInstallCount(app, {}), 0)
})
test('language is bounded, respects explicit selection and survives local links', async () => {
  for (const [request, expected] of [['http://localhost/?lang=de', 'de'], ['http://localhost/?lang=zh-CN', 'zh'], ['http://localhost/?lang=__proto__', 'en']]) {
    assert.equal(await getCurrentLanguage(new URL(request), new Request(request, { headers: { 'Accept-Language': 'fa' } })), expected)
  }
  assert.equal(await getCurrentLanguage(new URL('http://localhost'), new Request('http://localhost', { headers: { 'Accept-Language': 'de-DE,de;q=0.9' } })), 'de')
  assert.equal(localHref('/apps?q=test&page=2', 'de'), '/apps?q=test&page=2&lang=de')
  assert.equal(typeof getLocalizedStrings('de').catalogDescription, 'string')
})

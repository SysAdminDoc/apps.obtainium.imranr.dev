import assert from 'node:assert/strict'
import { test } from 'node:test'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import http from 'node:http'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const root = process.cwd()

test('README opens with an evergreen marketing hero', () => {
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8')
  const source = fs.readFileSync(path.join(root, 'assets/marketing/social-card.html'), 'utf8')
  const hero = fs.readFileSync(path.join(root, 'public/social-card.png'))
  const heroReference = '![Obtainium Apps configuration catalog marketing hero](public/social-card.png)'
  assert.ok(readme.startsWith(heroReference))
  assert.equal(readme.split(heroReference).length - 1, 1)
  assert.doesNotMatch(source, /\bv\d+\.\d+\.\d+\b/)
  assert.deepEqual([...hero.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10])
  assert.equal(hero.readUInt32BE(16), 1280)
  assert.equal(hero.readUInt32BE(20), 640)
})

test('failed icon checks are read-only by default and report a failing status', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'obtainium-icon-test-'))
  const server = http.createServer((_request, response) => { response.writeHead(404); response.end('Not found'); })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  try {
    const port = (server.address() as any).port
    fs.mkdirSync(path.join(directory, 'public/data/apps'), { recursive: true })
    const target = path.join(directory, 'public/data/apps/example.json')
    const original = JSON.stringify({ icon: 'http://127.0.0.1:' + port + '/missing.png' })
    fs.writeFileSync(target, original)
    await assert.rejects(exec('rtk', ['proxy', process.execPath, path.join(root, 'scripts/validate_icons.js')], { cwd: directory, windowsHide: true }), (error: any) => error.code === 1 && error.stdout.includes('No files were modified'))
    assert.equal(fs.readFileSync(target, 'utf8'), original)
  } finally {
    server.closeAllConnections()
    await new Promise<void>(resolve => server.close(() => resolve()))
    assert.equal(path.dirname(directory), os.tmpdir())
    assert.ok(path.basename(directory).startsWith('obtainium-icon-test-'))
    fs.rmSync(directory, { recursive: true, force: true })
  }
})

test('optional statistics use the configured endpoint and cache real link-click totals', async () => {
  let requests = 0
  const server = http.createServer((request, response) => {
    requests++
    assert.ok(request.url?.startsWith('/api/stats/review.example/custom-prop-values/url/'))
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({ results: [{ name: 'obtainium://app/' + encodeURIComponent(JSON.stringify({ id: 'org.example.app' })), events: 12 }] }))
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  try {
    const script = "import assert from 'node:assert/strict';import {getInstallCounts,hasLinkStats} from './src/lib/stats.ts';assert.equal(hasLinkStats(),true);const counts=await getInstallCounts();assert.equal(Object.getPrototypeOf(counts),null);assert.deepEqual({...counts},{'org.example.app':12});assert.deepEqual({...await getInstallCounts()},{'org.example.app':12});"
    await exec('rtk', ['proxy', process.execPath, '--import', 'tsx', '--input-type=module', '--eval', script], { cwd: root, windowsHide: true, env: { ...process.env, PUBLIC_PLAUSIBLE_API_BASE_URL: 'http://127.0.0.1:' + (server.address() as any).port, PUBLIC_PLAUSIBLE_SITE_ID: 'review.example' } })
    assert.equal(requests, 1)
  } finally {
    server.closeAllConnections()
    await new Promise<void>(resolve => server.close(() => resolve()))
  }
})

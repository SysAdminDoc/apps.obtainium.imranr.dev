import type { SimpleAppConfig } from './types'

export const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value)

export function isSourceUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !/^https?:\/\//i.test(value) || /[\s\u0000-\u001f\u007f\\]/.test(value)) return false
  try {
    const url = new URL(value)
    return Boolean(url.hostname) && !url.username && !url.password && ['https:', 'http:'].includes(url.protocol)
  } catch { return false }
}

export function validateConfig(value: unknown): asserts value is SimpleAppConfig & Record<string, unknown> {
  if (!isRecord(value)) throw new Error('Expected an app configuration object')
  for (const key of ['id', 'name', 'author', 'url']) {
    if (typeof value[key] !== 'string' || !value[key].trim()) throw new Error('Missing configuration field: ' + key)
  }
  if (!isSourceUrl(value.url)) throw new Error('An app source must be an HTTP or HTTPS URL without credentials')
  if (value.additionalSettings !== undefined) {
    if (typeof value.additionalSettings !== 'string' || !isRecord(JSON.parse(value.additionalSettings))) throw new Error('additionalSettings must contain a JSON object')
  }
}

export type RedirectResult = { href: string; source: string; name: string; config?: SimpleAppConfig } | { error: string }

export function parseRedirect(input: string | null): RedirectResult {
  if (!input) return { error: 'noRedirectParam' }
  if (input.length > 64000) return { error: 'invalidUrl' }
  try {
    if (input.startsWith('obtainium://app/')) {
      const config: unknown = JSON.parse(decodeURIComponent(input.slice('obtainium://app/'.length)))
      validateConfig(config)
      return { href: 'obtainium://app/' + encodeURIComponent(JSON.stringify(config)), source: config.url, name: config.name, config }
    }
    if (input.startsWith('obtainium://add/')) {
      const source = decodeURIComponent(input.slice('obtainium://add/'.length))
      if (isSourceUrl(source)) return { href: 'obtainium://add/' + encodeURIComponent(source), source, name: new URL(source).hostname }
    }
  } catch { return { error: 'invalidUrl' } }
  return { error: 'invalidUrl' }
}

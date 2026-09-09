import { getCategories, getStrings } from "./data"
import type { Translation } from "./types"

/**
 * Determine current language from URL and request headers
 */
export const getCurrentLanguage = async (url: URL, request: Request) => {
  const langParam = url.searchParams.get('lang')
  let browserLang = 'en'
  const browserLangHeader = request.headers.get('accept-language')
  if (browserLangHeader) {
    const preferred = browserLangHeader.split(',')[0]
    browserLang = preferred.split(';')[0].trim().split('-')[0].toLowerCase()
  }
  const requested = (langParam || browserLang).toLowerCase().split('-')[0]
  return ['en', 'fa', 'ru', 'de', 'ja', 'zh'].includes(requested) ? requested : 'en'
}

/**
 * Pick translation from language object with fallback
 */
export const pickLocalTranslation = (langObj: Translation, language: string): string | null => {
  if (Object.hasOwn(langObj, language) && langObj[language]) {
    return langObj[language]!
  }
  if (language !== 'en' && langObj.en) {
    return langObj.en
  }
  const availableLangs = Object.keys(langObj)
  if (availableLangs.length > 0) {
    const firstLang = availableLangs[0]
    return langObj[firstLang] || null
  }
  return null
}

const translationCache = new Map<string, Record<string, string>>()
/**
 * Get localized strings for a given language with caching
 */
export const getLocalizedStrings = (language: string) => {
  const cached = translationCache.get(language)
  if (cached) return cached
  const thisLang: { [key: string]: string } = {}
  let atLeastOne = false
  const cats = getCategories()
  for (const c of Object.keys(cats)) {
    const tr = pickLocalTranslation(cats[c], language)
    if (tr) {
      atLeastOne = true
    }
    thisLang[c] = tr || c
  }
  const strings = getStrings()
  for (const s of Object.keys(strings)) {
    const tr = pickLocalTranslation(strings[s], language)
    if (tr) {
      atLeastOne = true
    }
    thisLang[s] = tr || s
  }
  if (atLeastOne) {
    translationCache.set(language, thisLang)
  }
  return thisLang
}

export const localHref = (href: string, language: string) => {
  const url = new URL(href, 'http://localhost')
  url.searchParams.set('lang', language)
  return url.pathname + url.search + url.hash
}

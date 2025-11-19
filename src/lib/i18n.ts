import type { Language } from '@/types/i18n'
import { DEFAULT_LANGUAGE } from '@/types/i18n'

const LANGUAGE_STORAGE_KEY = 'app-language'
const STORAGE_VERSION = '1'

export const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE

  const browserLang = window.navigator.language.split('-')[0]
  const supportedLanguages: Language[] = ['en', 'es', 'fr']

  return supportedLanguages.includes(browserLang as Language)
    ? (browserLang as Language)
    : DEFAULT_LANGUAGE
}

export const getStoredLanguage = (): Language | null => {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (!stored) return null

    const data = JSON.parse(stored)
    if (data.version === STORAGE_VERSION && data.language) {
      const supportedLanguages: Language[] = ['en', 'es', 'fr']
      return supportedLanguages.includes(data.language) ? data.language : null
    }

    return null
  } catch (error) {
    console.warn('Failed to retrieve stored language:', error)
    return null
  }
}

export const storeLanguage = (language: Language): void => {
  if (typeof window === 'undefined') return

  try {
    const data = {
      version: STORAGE_VERSION,
      language,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to store language preference:', error)
  }
}

export const initializeLanguage = (): Language => {
  const stored = getStoredLanguage()
  if (stored) return stored

  const browser = getBrowserLanguage()
  storeLanguage(browser)
  return browser
}

export const formatPhoneNumber = (phone: string, language: Language): string => {
  const cleaned = phone.replace(/\D/g, '')

  switch (language) {
    case 'en':
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
      }
      if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
      }
      return phone
    case 'es':
    case 'fr':
      if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
      }
      if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+1 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
      }
      return phone
    default:
      return phone
  }
}

export const formatAddress = (
  street: string,
  city: string,
  state: string,
  zip: string,
  country: string,
  language: Language
): string => {
  switch (language) {
    case 'en':
      return `${street}, ${city}, ${state} ${zip}, ${country}`
    case 'es':
      return `${street}, ${zip} ${city}, ${state}, ${country}`
    case 'fr':
      return `${street}, ${zip} ${city}, ${state}, ${country}`
    default:
      return `${street}, ${city}, ${state} ${zip}, ${country}`
  }
}

export type Language = 'en' | 'es' | 'fr'

export interface LanguageConfig {
  code: Language
  name: string
  nativeName: string
  dir: 'ltr' | 'rtl'
  dateFormat: string
}

export const LANGUAGES: Record<Language, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    dateFormat: 'MM/dd/yyyy',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    dir: 'ltr',
    dateFormat: 'dd/MM/yyyy',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    dateFormat: 'dd/MM/yyyy',
  },
}

export const DEFAULT_LANGUAGE: Language = 'en'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Language } from '@/types/i18n'
import { LANGUAGES, DEFAULT_LANGUAGE } from '@/types/i18n'
import { initializeLanguage, storeLanguage } from '@/lib/i18n'
import { getTranslation } from '@/locales/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initialLang = initializeLanguage()
    setLanguageState(initialLang)
    document.documentElement.lang = initialLang
    document.documentElement.dir = LANGUAGES[initialLang].dir
    setIsInitialized(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    storeLanguage(lang)
    document.documentElement.lang = lang
    document.documentElement.dir = LANGUAGES[lang].dir

    const announcement = document.getElementById('language-announcement')
    if (announcement) {
      const messages = {
        en: `Language changed to English`,
        es: `Idioma cambiado a Español`,
        fr: `Langue changée en Français`,
      }
      announcement.textContent = messages[lang]
    }
  }

  const t = (key: string): string => {
    return getTranslation(language, key)
  }

  if (!isInitialized) {
    return null
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        dir: LANGUAGES[language].dir,
      }}
    >
      <div
        id="language-announcement"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Re-export Language type for convenience
export type { Language } from '@/types/i18n'

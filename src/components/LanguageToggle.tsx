import { useLanguage } from '@/contexts/LanguageContext'
import type { Language } from '@/types/i18n'
import { LANGUAGES } from '@/types/i18n'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={t('language.select')}
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t('language.select')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {Object.entries(LANGUAGES).map(([code, config]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as Language)}
            className={`cursor-pointer ${
              language === code ? 'bg-accent font-medium' : ''
            }`}
            aria-current={language === code ? 'true' : undefined}
          >
            <span className="flex items-center justify-between w-full">
              {config.nativeName}
              {language === code && (
                <span className="ml-2 text-xs text-muted-foreground">✓</span>
              )}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

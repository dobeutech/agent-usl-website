import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Separate Theme Toggle Component (Light/Dark only)
export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (theme === 'system') {
      // If system is active, switch to the opposite of current system theme
      const newTheme = systemTheme === 'dark' ? 'light' : 'dark'
      setTheme(newTheme)
      announceThemeChange(t(`theme.${newTheme}`))
    } else if (theme === 'light') {
      setTheme('dark')
      announceThemeChange(t('theme.dark'))
    } else {
      setTheme('light')
      announceThemeChange(t('theme.light'))
    }
  }

  const announceThemeChange = (themeName: string) => {
    const announcement = document.getElementById('theme-announcement')
    if (announcement) {
      announcement.textContent = `${t('accessibility.themeChanged') || 'Theme changed to'} ${themeName}`
    }
  }

  const getThemeIcon = () => {
    if (!mounted) {
      return <Sun className="h-4 w-4" />
    }

    // If system mode is active, show the system's current theme
    if (theme === 'system') {
      return systemTheme === 'dark' ? (
        <Moon className="h-4 w-4 transition-all duration-300" />
      ) : (
        <Sun className="h-4 w-4 transition-all duration-300" />
      )
    }

    // Otherwise show the current theme
    return theme === 'dark' ? (
      <Moon className="h-4 w-4 transition-all duration-300" />
    ) : (
      <Sun className="h-4 w-4 transition-all duration-300" />
    )
  }

  const getThemeAriaLabel = () => {
    if (!mounted) return t('theme.toggle') || 'Toggle theme'
    
    if (theme === 'system') {
      const currentSystemTheme = systemTheme === 'dark' ? t('theme.dark') : t('theme.light')
      return `${t('theme.toggle') || 'Toggle theme'} (${currentSystemTheme})`
    }
    
    const nextTheme = theme === 'light' ? t('theme.dark') : t('theme.light')
    return `${t('theme.toggle') || 'Toggle theme'} to ${nextTheme}`
  }

  const getThemeTooltip = () => {
    if (!mounted) return t('theme.toggle') || 'Toggle theme'
    
    if (theme === 'system') {
      const currentSystemTheme = systemTheme === 'dark' ? t('theme.dark') : t('theme.light')
      return `${t('theme.system') || 'System'} mode (${currentSystemTheme}). Click to switch to ${systemTheme === 'dark' ? t('theme.light') : t('theme.dark')}`
    }
    
    const currentTheme = theme === 'light' ? t('theme.light') : t('theme.dark')
    const nextTheme = theme === 'light' ? t('theme.dark') : t('theme.light')
    return `${currentTheme} mode. Click to switch to ${nextTheme}`
  }

  if (!mounted) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            disabled
            aria-label={t('theme.toggle')}
          >
            <Sun className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('theme.toggle') || 'Toggle theme'}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={`relative h-9 w-9 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              theme === 'system' ? 'opacity-60' : ''
            }`}
            aria-label={getThemeAriaLabel()}
            data-testid="theme-toggle"
            data-theme={theme}
          >
            {getThemeIcon()}
            <span className="sr-only">{getThemeAriaLabel()}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getThemeTooltip()}</p>
        </TooltipContent>
      </Tooltip>
      <div
        id="theme-announcement"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </>
  )
}

// Separate System Toggle Component
export function SystemToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleSystem = () => {
    if (theme === 'system') {
      // If system is active, switch to light mode
      setTheme('light')
      announceThemeChange(t('theme.light'))
    } else {
      // Switch to system mode
      setTheme('system')
      announceThemeChange(t('theme.system') || 'System')
    }
  }

  const announceThemeChange = (themeName: string) => {
    const announcement = document.getElementById('theme-announcement')
    if (announcement) {
      announcement.textContent = `${t('accessibility.themeChanged') || 'Theme changed to'} ${themeName}`
    }
  }

  const getSystemAriaLabel = () => {
    if (!mounted) return t('theme.system') || 'System theme'
    
    if (theme === 'system') {
      return `${t('theme.system') || 'System'} mode active. Click to switch to manual theme`
    }
    
    return `Switch to ${t('theme.system') || 'System'} mode`
  }

  const getSystemTooltip = () => {
    if (!mounted) return t('theme.system') || 'System theme'
    
    if (theme === 'system') {
      return `${t('theme.system') || 'System'} mode active. Click to switch to manual theme selection`
    }
    
    return `Switch to ${t('theme.system') || 'System'} mode (follows your device's theme preference)`
  }

  if (!mounted) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            disabled
            aria-label={t('theme.system')}
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('theme.system') || 'System theme'}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSystem}
          className={`relative h-9 w-9 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            theme === 'system' ? 'bg-accent' : ''
          }`}
          aria-label={getSystemAriaLabel()}
          aria-pressed={theme === 'system'}
          data-testid="theme-system"
        >
          <Monitor className={`h-4 w-4 transition-all duration-300 ${
            theme === 'system' ? 'text-primary' : ''
          }`} />
          <span className="sr-only">{getSystemAriaLabel()}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{getSystemTooltip()}</p>
      </TooltipContent>
    </Tooltip>
  )
}

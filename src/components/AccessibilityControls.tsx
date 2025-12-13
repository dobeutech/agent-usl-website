import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useLanguage } from "@/contexts/LanguageContext"

interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  reducedMotion: boolean
  dyslexiaFont: boolean
  underlineLinks: boolean
  largeClickTargets: boolean
  focusHighlight: boolean
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  reducedMotion: false,
  dyslexiaFont: false,
  underlineLinks: false,
  largeClickTargets: false,
  focusHighlight: false,
}

export function AccessibilityControls() {
  const { t } = useLanguage()
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [isOpen, setIsOpen] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        const savedSettings = window.localStorage.getItem('accessibility_settings')
        if (savedSettings) {
          const parsed: AccessibilitySettings = JSON.parse(savedSettings)
          setSettings(parsed)
          applySettings(parsed)
        }
      }
    } catch (e) {
      console.error('Error loading accessibility settings:', e)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply settings to document
  const applySettings = useCallback((newSettings: AccessibilitySettings) => {
    const root = document.documentElement
    const body = document.body

    // Font size
    root.style.fontSize = `${newSettings.fontSize}%`

    // High contrast
    if (newSettings.highContrast) {
      body.classList.add('high-contrast')
    } else {
      body.classList.remove('high-contrast')
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      body.classList.add('reduced-motion')
    } else {
      body.classList.remove('reduced-motion')
    }

    // Dyslexia-friendly font
    if (newSettings.dyslexiaFont) {
      body.classList.add('dyslexia-font')
    } else {
      body.classList.remove('dyslexia-font')
    }

    // Underline links
    if (newSettings.underlineLinks) {
      body.classList.add('underline-links')
    } else {
      body.classList.remove('underline-links')
    }

    // Large click targets
    if (newSettings.largeClickTargets) {
      body.classList.add('large-targets')
    } else {
      body.classList.remove('large-targets')
    }

    // Focus highlight
    if (newSettings.focusHighlight) {
      body.classList.add('focus-highlight')
    } else {
      body.classList.remove('focus-highlight')
    }
  }, [])

  // Update setting and save
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem('accessibility_settings', JSON.stringify(newSettings))
    applySettings(newSettings)
  }

  // Reset to defaults
  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem('accessibility_settings')
    applySettings(defaultSettings)
  }

  return (
    <>
      {/* Inject accessibility styles */}
      <style>{`
        .high-contrast {
          filter: contrast(1.5);
        }
        
        .reduced-motion *,
        .reduced-motion *::before,
        .reduced-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        
        .dyslexia-font {
          font-family: 'OpenDyslexic', 'Comic Sans MS', 'Arial', sans-serif !important;
          letter-spacing: 0.1em;
          word-spacing: 0.25em;
        }
        
        .underline-links a {
          text-decoration: underline !important;
        }
        
        .large-targets button,
        .large-targets a,
        .large-targets input,
        .large-targets select,
        .large-targets [role="button"] {
          min-height: 48px;
          min-width: 48px;
        }
        
        .focus-highlight *:focus {
          outline: 3px solid #73B77D !important;
          outline-offset: 2px !important;
        }
      `}</style>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-20 right-4 z-50 rounded-full shadow-lg bg-card border-border hover:bg-secondary h-12 w-12"
            aria-label={t('accessibility.openMenu') || 'Open accessibility menu'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <circle cx="12" cy="4.5" r="2.5" />
              <path d="M12 7v5" />
              <path d="m8 9 4 2 4-2" />
              <path d="M8.5 14.5 12 12l3.5 2.5" />
              <path d="M9.5 20 12 14l2.5 6" />
            </svg>
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl font-heading">
              {t('accessibility.title') || 'Accessibility Settings'}
            </SheetTitle>
            <SheetDescription>
              {t('accessibility.description') || 'Customize your viewing experience to meet your accessibility needs.'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Font Size */}
            <Card className="p-4">
              <Label className="text-base font-medium mb-3 block">
                {t('accessibility.fontSize') || 'Text Size'}: {settings.fontSize}%
              </Label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting('fontSize', value)}
                min={75}
                max={200}
                step={25}
                className="w-full"
                aria-label="Adjust text size"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>75%</span>
                <span>100%</span>
                <span>150%</span>
                <span>200%</span>
              </div>
            </Card>

            {/* Toggle Settings */}
            <Card className="p-4 space-y-4">
              <h3 className="font-medium text-foreground mb-2">
                {t('accessibility.visualSettings') || 'Visual Settings'}
              </h3>

              <div className="flex items-center justify-between">
                <Label htmlFor="highContrast" className="text-sm cursor-pointer flex-1">
                  {t('accessibility.highContrast') || 'High Contrast'}
                </Label>
                <Switch
                  id="highContrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="reducedMotion" className="text-sm cursor-pointer flex-1">
                  {t('accessibility.reducedMotion') || 'Reduce Motion'}
                </Label>
                <Switch
                  id="reducedMotion"
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dyslexiaFont" className="text-sm cursor-pointer flex-1">
                  {t('accessibility.dyslexiaFont') || 'Dyslexia-Friendly Font'}
                </Label>
                <Switch
                  id="dyslexiaFont"
                  checked={settings.dyslexiaFont}
                  onCheckedChange={(checked) => updateSetting('dyslexiaFont', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="underlineLinks" className="text-sm cursor-pointer flex-1">
                  {t('accessibility.underlineLinks') || 'Underline All Links'}
                </Label>
                <Switch
                  id="underlineLinks"
                  checked={settings.underlineLinks}
                  onCheckedChange={(checked) => updateSetting('underlineLinks', checked)}
                />
              </div>
            </Card>

            {/* Interaction Settings */}
            <Card className="p-4 space-y-4">
              <h3 className="font-medium text-foreground mb-2">
                {t('accessibility.interactionSettings') || 'Interaction Settings'}
              </h3>

              <div className="flex items-center justify-between">
                <Label htmlFor="largeTargets" className="text-sm cursor-pointer flex-1">
                  {t('accessibility.largeTargets') || 'Large Click Targets'}
                </Label>
                <Switch
                  id="largeTargets"
                  checked={settings.largeClickTargets}
                  onCheckedChange={(checked) => updateSetting('largeClickTargets', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="focusHighlight" className="text-sm cursor-pointer flex-1">
                  {t('accessibility.focusHighlight') || 'Enhanced Focus Highlight'}
                </Label>
                <Switch
                  id="focusHighlight"
                  checked={settings.focusHighlight}
                  onCheckedChange={(checked) => updateSetting('focusHighlight', checked)}
                />
              </div>
            </Card>

            {/* Reset Button */}
            <Button
              variant="outline"
              onClick={resetSettings}
              className="w-full"
            >
              {t('accessibility.reset') || 'Reset to Defaults'}
            </Button>

            {/* Help Text */}
            <p className="text-xs text-muted-foreground text-center">
              {t('accessibility.helpText') || 'Settings are saved automatically and will persist across sessions.'}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

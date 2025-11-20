import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Cookie, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase } from '@/lib/supabase'
import { trackVisitor, updateCookieConsent } from '@/lib/analytics'

const CONSENT_KEY = 'cookie_consent'
const CONSENT_TIMESTAMP_KEY = 'cookie_consent_timestamp'

interface ConsentPreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already provided consent
    const consent = localStorage.getItem(CONSENT_KEY)
    const timestamp = localStorage.getItem(CONSENT_TIMESTAMP_KEY)
    
    if (!consent || !timestamp) {
      // Show banner after 2 seconds
      const timer = setTimeout(() => setIsOpen(true), 2000)
      return () => clearTimeout(timer)
    } else {
      // Check if consent was given more than 365 days ago (re-consent required)
      const consentDate = new Date(parseInt(timestamp))
      const daysSinceConsent = (Date.now() - consentDate.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysSinceConsent > 365) {
        setIsOpen(true)
      } else {
        // Load existing preferences
        const savedPrefs = JSON.parse(consent)
        setPreferences(savedPrefs)
        
        // Initialize tracking if consent was given
        if (savedPrefs.analytics || savedPrefs.marketing) {
          trackVisitor(savedPrefs)
        }
      }
    }
  }, [])

  const saveConsent = async (prefs: ConsentPreferences) => {
    // Save to localStorage
    localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs))
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, Date.now().toString())
    
    // Save to database
    try {
      await updateCookieConsent(prefs)
    } catch (error) {
      console.error('Failed to save cookie consent:', error)
    }

    // Initialize tracking if consent given
    if (prefs.analytics || prefs.marketing) {
      trackVisitor(prefs)
    }
    
    setIsOpen(false)
  }

  const handleAcceptAll = () => {
    const allConsent = {
      essential: true,
      analytics: true,
      marketing: true
    }
    setPreferences(allConsent)
    saveConsent(allConsent)
  }

  const handleAcceptSelected = () => {
    saveConsent(preferences)
  }

  const handleRejectAll = () => {
    const minimalConsent = {
      essential: true,
      analytics: false,
      marketing: false
    }
    setPreferences(minimalConsent)
    saveConsent(minimalConsent)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <Card className="max-w-4xl mx-auto p-6 shadow-2xl border-border bg-card">
            <div className="flex items-start gap-4">
              <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                      {t('cookieConsent.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('cookieConsent.description')}
                    </p>
                  </div>
                  <button
                    onClick={handleRejectAll}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>

                {!showDetails && (
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleAcceptAll}
                      className="flex-1 sm:flex-none"
                    >
                      {t('cookieConsent.acceptAll')}
                    </Button>
                    <Button
                      onClick={() => setShowDetails(true)}
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      {t('cookieConsent.customize')}
                    </Button>
                    <Button
                      onClick={handleRejectAll}
                      variant="ghost"
                      className="flex-1 sm:flex-none"
                    >
                      {t('cookieConsent.rejectAll')}
                    </Button>
                  </div>
                )}

                {showDetails && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="space-y-3">
                      {/* Essential Cookies */}
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="essential"
                          checked={preferences.essential}
                          disabled
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="essential" className="font-medium text-sm text-foreground cursor-pointer">
                            {t('cookieConsent.essential')}
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('cookieConsent.essentialDesc')}
                          </p>
                        </div>
                      </div>

                      {/* Analytics Cookies */}
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="analytics"
                          checked={preferences.analytics}
                          onCheckedChange={(checked) =>
                            setPreferences({ ...preferences, analytics: checked as boolean })
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="analytics" className="font-medium text-sm text-foreground cursor-pointer">
                            {t('cookieConsent.analytics')}
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('cookieConsent.analyticsDesc')}
                          </p>
                        </div>
                      </div>

                      {/* Marketing Cookies */}
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="marketing"
                          checked={preferences.marketing}
                          onCheckedChange={(checked) =>
                            setPreferences({ ...preferences, marketing: checked as boolean })
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="marketing" className="font-medium text-sm text-foreground cursor-pointer">
                            {t('cookieConsent.marketing')}
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('cookieConsent.marketingDesc')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CCPA Notice */}
                    <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-md">
                      <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        {t('cookieConsent.ccpaNotice')}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button
                        onClick={handleAcceptSelected}
                        className="flex-1 sm:flex-none"
                      >
                        {t('cookieConsent.savePreferences')}
                      </Button>
                      <Button
                        onClick={() => setShowDetails(false)}
                        variant="outline"
                        className="flex-1 sm:flex-none"
                      >
                        {t('cookieConsent.back')}
                      </Button>
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {t('cookieConsent.learnMore')}{' '}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

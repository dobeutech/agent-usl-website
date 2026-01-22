import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Users, ArrowRight, Building2 } from "lucide-react"
import { WhatsappLogo } from "@phosphor-icons/react"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, AnimatePresence } from "framer-motion"
import { WHATSAPP_LINK, WHATSAPP_NUMBER } from "@/lib/contact-info"
import { useNavigate } from "react-router-dom"

const MODAL_DISMISSED_KEY = "talent_network_dismissed"
const MODAL_DELAY = 15000 // 15 seconds

export function TalentNetworkModal() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Only enable the test trigger in development mode
    if (import.meta.env.DEV) {
      const params = new URLSearchParams(window.location.search)
      if (params.get('showModal') === 'true') {
        setIsOpen(true)
        return
      }
    }

    // Check if user has dismissed the modal recently
    const dismissed = localStorage.getItem(MODAL_DISMISSED_KEY)
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60)
      // Don't show again within 24 hours
      if (hoursSinceDismissed < 24) return
    }

    // Show modal after delay
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, MODAL_DELAY)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem(MODAL_DISMISSED_KEY, Date.now().toString())
  }

  const handleJoin = () => {
    const applySection = document.getElementById("apply")
    if (applySection) {
      applySection.scrollIntoView({ behavior: "smooth" })
    }
    handleClose()
  }

  const handleEmployerClick = () => {
    handleClose()
    navigate("/employers")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="relative max-w-md w-full bg-card border-border shadow-2xl overflow-hidden" data-testid="talent-modal">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
                aria-label={t('accessibility.close')}
                data-testid="modal-close"
              >
                <X size={20} />
              </button>

              {/* Top Section - For Job Seekers/Employees */}
              <div className="p-6 sm:p-8 text-center border-b border-border">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>

                <h2 className="font-heading font-bold text-xl text-foreground mb-2">
                  {t('talentModal.title')}
                </h2>

                <p className="text-sm text-primary font-medium mb-2">
                  {t('talentModal.subtitle')}
                </p>

                <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                  {t('talentModal.description')}
                </p>
                
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-sm text-primary hover:underline mb-4"
                >
                  <WhatsappLogo size={18} weight="fill" />
                  {t('common.whatsappCta').replace('{number}', WHATSAPP_NUMBER)}
                </a>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleJoin}
                    className="flex-1 group"
                    size="default"
                    data-testid="modal-join"
                    aria-label="Join our talent network"
                  >
                    {t('talentModal.joinNow')}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    size="default"
                    className="flex-1"
                    data-testid="modal-dismiss"
                    aria-label="Dismiss this dialog"
                  >
                    {t('talentModal.dismiss')}
                  </Button>
                </div>
              </div>

              {/* Bottom Section - For Employers */}
              <div className="p-6 sm:p-8 bg-secondary/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
                      {t('talentModal.employerTitle')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('talentModal.employerDescription')}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleEmployerClick}
                  variant="secondary"
                  className="w-full mt-4 group"
                  data-testid="modal-employer-cta"
                  aria-label="Learn about staffing solutions for employers"
                >
                  {t('talentModal.employerCta')}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

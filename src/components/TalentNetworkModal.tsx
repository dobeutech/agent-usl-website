import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Users, ArrowRight } from "lucide-react"
import { WhatsappLogo } from "@phosphor-icons/react"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, AnimatePresence } from "framer-motion"
import { WHATSAPP_LINK, WHATSAPP_NUMBER } from "@/lib/contact-info"

const MODAL_DISMISSED_KEY = "talent_network_dismissed"
const MODAL_DELAY = 15000 // 15 seconds

export function TalentNetworkModal() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
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
            <Card className="relative max-w-md w-full p-6 sm:p-8 bg-card border-border shadow-2xl">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t('accessibility.close')}
              >
                <X size={20} />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>

                <h2 className="font-heading font-bold text-2xl text-foreground mb-3">
                  {t('talentModal.title')}
                </h2>

                <p className="text-sm text-primary font-medium mb-2">
                  {t('talentModal.subtitle')}
                </p>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {t('talentModal.description')}
                </p>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-sm text-primary hover:underline mb-6"
                >
                  <WhatsappLogo size={18} weight="fill" />
                  {t('common.whatsappCta').replace('{number}', WHATSAPP_NUMBER)}
                </a>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleJoin}
                    className="flex-1 group"
                    size="lg"
                  >
                    {t('talentModal.joinNow')}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    {t('talentModal.dismiss')}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

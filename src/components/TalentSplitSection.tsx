import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Buildings, Users } from "@phosphor-icons/react"
import { useLanguage } from "@/contexts/LanguageContext"

export function TalentSplitSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const navigate = useNavigate()
  const { t } = useLanguage()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 lg:p-8 border-border bg-card/90">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary mb-2">
                      {t('common.forJobSeekers')}
                    </p>
                    <h3 className="font-heading font-semibold text-2xl text-foreground mb-2">
                      {t('talentSplit.jobSeekersTitle')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('talentSplit.jobSeekersDescription')}
                    </p>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full lg:w-auto"
                  onClick={() => scrollToSection("apply")}
                >
                  {t('talentSplit.jobSeekersCta')}
                  <ArrowRight className="ml-2" weight="bold" />
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-6 lg:p-8 border-border bg-primary text-primary-foreground">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Buildings size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80 mb-2">
                      {t('common.forEmployers')}
                    </p>
                    <h3 className="font-heading font-semibold text-2xl text-white mb-2">
                      {t('talentSplit.employersTitle')}
                    </h3>
                    <p className="text-white/80">
                      {t('talentSplit.employersDescription')}
                    </p>
                  </div>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full lg:w-auto bg-white text-primary hover:bg-white/90"
                  onClick={() => navigate("/employers")}
                >
                  {t('talentSplit.employersCta')}
                  <ArrowRight className="ml-2" weight="bold" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

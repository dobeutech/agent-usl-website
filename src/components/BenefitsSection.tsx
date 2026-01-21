import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Suitcase, CalendarCheck, GraduationCap, ArrowsOutCardinal } from "@phosphor-icons/react"
import { useLanguage } from "@/contexts/LanguageContext"

export function BenefitsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { t } = useLanguage()

  const benefits = [
    {
      icon: CalendarCheck,
      title: t('benefits.vacationTitle'),
      description: t('benefits.vacationDescription')
    },
    {
      icon: Suitcase,
      title: t('benefits.holidayTitle'),
      description: t('benefits.holidayDescription')
    },
    {
      icon: GraduationCap,
      title: t('benefits.trainingTitle'),
      description: t('benefits.trainingDescription')
    },
    {
      icon: ArrowsOutCardinal,
      title: t('benefits.networkTitle'),
      description: t('benefits.networkDescription')
    }
  ]

  return (
    <section ref={ref} className="py-16 lg:py-20 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-primary mb-2">
            {t('common.forJobSeekers')}
          </p>
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-3">
            {t('benefits.sectionTitle')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('benefits.sectionSubtitle')}
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full p-6 border-border bg-card hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon size={28} weight="duotone" className="text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

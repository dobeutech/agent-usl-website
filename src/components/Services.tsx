import { Card } from "@/components/ui/card"
import { Sparkles, Users, ShoppingCart, Phone, Factory } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export function Services() {
  const { t } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const titleInView = useInView(titleRef, { once: true })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  const services = [
    {
      icon: Sparkles,
      title: t('services.janitorial.title'),
      description: t('services.janitorial.description'),
      gradient: "from-emerald-500/20 to-teal-500/10"
    },
    {
      icon: Users,
      title: t('services.humanResources.title'),
      description: t('services.humanResources.description'),
      gradient: "from-blue-500/20 to-indigo-500/10"
    },
    {
      icon: ShoppingCart,
      title: t('services.retailSales.title'),
      description: t('services.retailSales.description'),
      gradient: "from-orange-500/20 to-amber-500/10"
    },
    {
      icon: Phone,
      title: t('services.callCenter.title'),
      description: t('services.callCenter.description'),
      gradient: "from-purple-500/20 to-pink-500/10"
    },
    {
      icon: Factory,
      title: t('services.industrial.title'),
      description: t('services.industrial.description'),
      gradient: "from-slate-500/20 to-zinc-500/10"
    }
  ]

  return (
    <section id="services" className="relative py-20 lg:py-32 bg-background overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={titleRef}
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={titleInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            Our Expertise
          </motion.span>
          <h2 className="font-heading font-bold text-3xl lg:text-5xl text-foreground mb-4">
            {t('services.title')}
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="group relative p-6 lg:p-8 border-border/50 bg-card/50 backdrop-blur-sm h-full overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <div className="relative">
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300"
                      whileHover={{ rotate: 5 }}
                    >
                      <Icon size={28} className="text-primary" />
                    </motion.div>
                    <h3 className="font-heading font-semibold text-xl text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {service.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

import { useRef } from "react"
import { Card } from "@/components/ui/card"
import { Sparkles, Users, ShoppingCart, Phone, Factory, MapPin } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, useInView } from "framer-motion"

export function Industries() {
  const { t } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const industries = [
    {
      icon: Sparkles,
      title: t('industries.janitorial'),
      description: t('industries.janitorialDesc'),
      color: "bg-emerald-500"
    },
    {
      icon: Users,
      title: t('industries.humanResources'),
      description: t('industries.humanResourcesDesc'),
      color: "bg-blue-500"
    },
    {
      icon: ShoppingCart,
      title: t('industries.retailSales'),
      description: t('industries.retailSalesDesc'),
      color: "bg-orange-500"
    },
    {
      icon: Phone,
      title: t('industries.callCenter'),
      description: t('industries.callCenterDesc'),
      color: "bg-purple-500"
    },
    {
      icon: Factory,
      title: t('industries.industrial'),
      description: t('industries.industrialDesc'),
      color: "bg-slate-500"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  return (
    <section id="industries" className="relative py-20 lg:py-32 bg-gradient-to-b from-secondary/20 via-secondary/30 to-secondary/20 overflow-hidden">
      {/* Decorative grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading font-bold text-3xl lg:text-5xl text-foreground mb-4">
            {t('industries.title')}
          </h2>
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <MapPin className="text-primary" size={18} />
            <p className="text-sm font-semibold text-foreground">
              {t('industries.servingRegions')}
            </p>
          </motion.div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('industries.subtitle')}
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {industries.map((industry, index) => {
            const Icon = industry.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="group relative p-6 text-center border-border/50 bg-card/70 backdrop-blur-sm h-full overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-primary/20">
                  {/* Animated gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    <motion.div
                      className={`w-16 h-16 mx-auto rounded-2xl ${industry.color}/10 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110`}
                      whileHover={{ rotate: 10 }}
                    >
                      <div className={`w-12 h-12 rounded-xl ${industry.color}/20 flex items-center justify-center`}>
                        <Icon size={24} className="text-primary" />
                      </div>
                    </motion.div>
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {industry.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {industry.description}
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

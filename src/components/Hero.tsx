import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkle, Users, Building, Trophy } from "@phosphor-icons/react"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, useScroll, useTransform, useInView } from "framer-motion"

export function Hero() {
  const { t } = useLanguage()
  const heroRef = useRef<HTMLElement>(null)
  const isInView = useInView(heroRef, { once: true })
  
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  const floatVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  const statsData = [
    { value: "15+", label: t('hero.yearsExperience'), icon: Trophy },
    { value: "500+", label: t('hero.companiesServed'), icon: Building },
    { value: "5,000+", label: t('hero.placementsMade'), icon: Users },
    { value: "98%", label: t('hero.clientSatisfaction'), icon: Sparkle }
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />
      
      {/* Animated mesh gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full bg-gradient-radial from-primary/10 to-transparent blur-3xl"
          style={{ top: '-20%', right: '-10%' }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-radial from-accent/10 to-transparent blur-3xl"
          style={{ bottom: '-10%', left: '-5%' }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(var(--foreground-rgb), 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(var(--foreground-rgb), 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-40 pb-16 lg:pb-24"
        style={{ y, opacity }}
      >
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Sparkle weight="fill" className="w-4 h-4" />
            <span>Trusted by 500+ Companies</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-foreground tracking-tight mb-6"
            variants={itemVariants}
          >
            <span className="block">{t('hero.title').split(' ').slice(0, 3).join(' ')}</span>
            <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {t('hero.title').split(' ').slice(3).join(' ')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg lg:text-xl text-foreground/70 mb-10 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Button
                size="lg"
                className="text-base px-8 py-6 h-auto group relative overflow-hidden shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow duration-300"
                onClick={() => scrollToSection("apply")}
              >
                <span className="relative z-10 flex items-center">
                  {t('nav.apply')}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" weight="bold" />
                </span>
                {/* Animated shine */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 h-auto bg-background/50 backdrop-blur-sm hover:bg-secondary/80 border-border/50 transition-all duration-300"
                onClick={() => scrollToSection("contact")}
              >
                {t('hero.ctaEmployers')}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-20 lg:mt-28"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.8
              }
            }
          }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto">
            {statsData.map((stat) => (
              <motion.div
                key={stat.label}
                className="relative group"
                variants={floatVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Glassmorphic card */}
                <div className="relative p-6 rounded-2xl bg-card/50 backdrop-blur-md border border-border/50 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/30 group-hover:bg-card/70">
                  {/* Gradient glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative text-center">
                    <stat.icon 
                      weight="duotone" 
                      className="w-8 h-8 mx-auto mb-3 text-primary opacity-80 group-hover:opacity-100 transition-opacity" 
                    />
                    <motion.div
                      className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-2"
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 200, 
                        delay: 0.1 * index 
                      }}
                      viewport={{ once: true }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm lg:text-base text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-muted-foreground cursor-pointer"
            onClick={() => scrollToSection("services")}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1">
              <motion.div
                className="w-1.5 h-3 rounded-full bg-current"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom fade gradient for floating effect */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none z-10" />
    </section>
  )
}

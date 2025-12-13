import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { List, X } from "@phosphor-icons/react"
import { ThemeToggle, SystemToggle } from "@/components/ThemeToggle"
import { LanguageToggle } from "@/components/LanguageToggle"
import { useLanguage } from "@/contexts/LanguageContext"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const { t } = useLanguage()
  
  // Scroll-based effects reserved for future enhancement
  // const { scrollY } = useScroll()

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    // Ensure initial state reflects the current scroll position
    handleScroll()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setMobileMenuOpen(false)
    }
  }

  const navItems = [
    { label: t('nav.services'), id: "services" },
    { label: t('nav.industries'), id: "industries" },
    { label: t('nav.about'), id: "about" },
    { label: t('nav.apply'), id: "apply" },
    { label: t('nav.contact'), id: "contact" },
  ]

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    })
  }

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  return (
    <>
      {/* Fade gradient at top for floating effect */}
      <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-background via-background/50 to-transparent pointer-events-none z-40" />
      
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          hasScrolled 
            ? 'bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-background/20' 
            : 'bg-transparent border-b border-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          backdropFilter: hasScrolled ? 'blur(16px) saturate(180%)' : 'none',
          WebkitBackdropFilter: hasScrolled ? 'blur(16px) saturate(180%)' : 'none',
        }}
      >
        {/* Glassmorphic inner glow */}
        {hasScrolled && (
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button
                onClick={() => scrollToSection("hero")}
                className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 group"
              >
                <motion.img
                  src="/logo.webp"
                  alt="Unique Staffing Professionals Logo"
                  className="h-10 lg:h-12 w-auto"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
                <span className="hidden sm:block font-heading font-bold text-lg lg:text-xl text-primary group-hover:text-primary/80 transition-colors">
                  Unique Staffing
                </span>
              </button>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative text-foreground/70 hover:text-foreground font-medium transition-all duration-300 py-2 group"
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={navItemVariants}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                  {/* Animated underline */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
                </motion.button>
              ))}
            </div>

            <motion.div 
              className="hidden md:flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <LanguageToggle />
              <ThemeToggle />
              <SystemToggle />
              <a
                href="/admin/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Admin
              </a>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => scrollToSection("apply")} 
                  size="lg"
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10">{t('nav.apply')}</span>
                  {/* Shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Button>
              </motion.div>
            </motion.div>

            <div className="md:hidden flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <SystemToggle />
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-foreground rounded-lg hover:bg-secondary/50 transition-colors"
                aria-label={mobileMenuOpen ? t('accessibility.closeMenu') : t('accessibility.openMenu')}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <List size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-border/50"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
            >
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left text-foreground/80 hover:text-foreground hover:bg-secondary/50 font-medium py-3 px-4 rounded-lg transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={() => scrollToSection("apply")}
                    className="w-full mt-4"
                    size="lg"
                  >
                    {t('nav.apply')}
                  </Button>
                </motion.div>
                <motion.a
                  href="/admin/login"
                  className="block text-center text-sm text-muted-foreground hover:text-foreground py-2 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Admin Login
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

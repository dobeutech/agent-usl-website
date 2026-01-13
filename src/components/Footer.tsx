import { useRef } from "react"
import { Phone, Mail, MapPin, MessageSquare, Printer, Facebook } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useBusinessInfo } from "@/contexts/BusinessInfoContext"
import { BusinessAddress, BusinessPhone, BusinessEmail } from "@/components/seo/NAPDisplay"
import { useLanguage } from "@/contexts/LanguageContext"
import { Link } from "react-router-dom"

export function Footer() {
  const { businessInfo } = useBusinessInfo()
  const { t } = useLanguage()
  const footerRef = useRef<HTMLElement>(null)
  const isInView = useInView(footerRef, { once: true, amount: 0.2 })

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!businessInfo) return null

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  const socialLinks = [
    { icon: Phone, href: `tel:${businessInfo.contact.phone}`, label: "Call us" },
    { icon: Mail, href: `mailto:${businessInfo.contact.email}`, label: "Email us" },
    { icon: MessageSquare, href: `sms:${businessInfo.contact.textLine}`, label: "Text us" },
    { icon: Facebook, href: "https://www.facebook.com/profile.php?id=100090234361028", label: "Follow us on Facebook", external: true }
  ]

  return (
    <>
      {/* Top fade gradient for floating effect */}
      <div className="relative h-40 -mb-40 bg-gradient-to-b from-transparent via-primary/5 to-primary pointer-events-none z-10" />
      
      <motion.footer
        ref={footerRef}
        className="relative bg-primary text-primary-foreground overflow-hidden"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl"
            style={{ top: '-20%', right: '-10%' }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl"
            style={{ bottom: '-10%', left: '-5%' }}
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12" itemScope itemType="https://schema.org/LocalBusiness">
            
            {/* Company Info */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <div className="flex items-center gap-3 mb-6">
                <motion.img
                  src="/logo.webp"
                  alt="Unique Staffing Professionals Logo"
                  className="h-14 w-auto"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                />
                <h3 className="font-heading font-bold text-2xl" itemProp="name">
                  {businessInfo.name}
                </h3>
              </div>
              <p className="text-primary-foreground/80 mb-4 leading-relaxed max-w-md" itemProp="description">
                {t('footer.tagline')}
              </p>
              {businessInfo.ceo && (
                <p className="text-primary-foreground/60 text-sm mb-6">
                  CEO: {businessInfo.ceo}
                </p>
              )}
              
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group"
                    aria-label={link.label}
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <link.icon 
                      size={22} 
                      className="text-primary-foreground/80 group-hover:text-primary-foreground transition-colors" 
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className="font-heading font-semibold text-lg mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-accent rounded-full" />
                {t('footer.quickLinks')}
              </h4>
              <ul className="space-y-3">
                {[
                  { label: t('nav.services'), id: "services" },
                  { label: t('nav.industries'), id: "industries" },
                  { label: t('nav.about'), id: "about" },
                  { label: t('nav.contact'), id: "contact" }
                ].map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 hover:translate-x-2 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-4 h-0.5 bg-accent rounded-full transition-all duration-300" />
                      {item.label}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h4 className="font-heading font-semibold text-lg mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-accent rounded-full" />
                {t('footer.contactUs')}
              </h4>
              <ul className="space-y-4 text-primary-foreground/80 text-sm">
                <li className="flex items-start gap-3 group">
                  <MapPin size={18} className="flex-shrink-0 mt-0.5 text-accent" />
                  <BusinessAddress businessInfo={businessInfo} className="text-sm group-hover:text-primary-foreground transition-colors" />
                </li>
                <li className="flex items-center gap-3 group">
                  <Phone size={18} className="text-accent" />
                  <BusinessPhone businessInfo={businessInfo} type="phone" className="hover:text-primary-foreground transition-colors" />
                </li>
                {businessInfo.contact.textLine && (
                  <li className="flex items-center gap-3 group">
                    <MessageSquare size={18} className="text-accent" />
                    <span>
                      Text:{' '}
                      <BusinessPhone
                        businessInfo={businessInfo}
                        type="text"
                        className="hover:text-primary-foreground transition-colors"
                      />
                    </span>
                  </li>
                )}
                {businessInfo.contact.fax && (
                  <li className="flex items-center gap-3 group">
                    <Printer size={18} className="text-accent" />
                    <span>
                      Fax:{' '}
                      <BusinessPhone
                        businessInfo={businessInfo}
                        type="fax"
                      />
                    </span>
                  </li>
                )}
                <li className="flex items-center gap-3 group">
                  <Mail size={18} className="text-accent" />
                  <BusinessEmail businessInfo={businessInfo} className="hover:text-primary-foreground transition-colors break-all" />
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom bar */}
          <motion.div
            className="border-t border-primary-foreground/10 mt-12 pt-8"
            variants={itemVariants}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-primary-foreground/50 text-sm">
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
              >
                &copy; {new Date().getFullYear()} {businessInfo.name}. {t('footer.rights')}
              </motion.p>
              <motion.div
                className="flex gap-6"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 }}
              >
                <Link 
                  to="/privacy" 
                  className="hover:text-primary-foreground transition-colors duration-300 hover:underline underline-offset-4"
                >
                  {t('footer.privacy')}
                </Link>
                <Link 
                  to="/terms" 
                  className="hover:text-primary-foreground transition-colors duration-300 hover:underline underline-offset-4"
                >
                  {t('footer.terms')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </>
  )
}

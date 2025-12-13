import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Navigation } from "@/components/Navigation"
import { Hero } from "@/components/Hero"
import { ClientLogos } from "@/components/ClientLogos"
import { Services } from "@/components/Services"
import { Industries } from "@/components/Industries"
import { WhyChooseUs } from "@/components/WhyChooseUs"
import { EmployerCTA } from "@/components/EmployerCTA"
import { JobListings } from "@/components/JobListings"
import { JobAlerts } from "@/components/JobAlerts"
import { EnhancedApplyForm } from "@/components/EnhancedApplyForm"
import { FAQ } from "@/components/FAQ"
import { Testimonials } from "@/components/Testimonials"
import { Contact } from "@/components/Contact"
import { Footer } from "@/components/Footer"
import { TalentNetworkModal } from "@/components/TalentNetworkModal"
import { LiveChat } from "@/components/LiveChat"
import { AnimatedBackground, FloatingOrbs } from "@/components/AnimatedBackground"
import { useBusinessInfo } from "@/contexts/BusinessInfoContext"
import { SEOHead } from "@/components/seo/SEOHead"
import { StructuredData } from "@/components/seo/StructuredData"
import { useLanguage } from "@/contexts/LanguageContext"

export function Home() {
  const navigate = useNavigate()
  const { businessInfo } = useBusinessInfo()
  const { t } = useLanguage()

  const handleApplicationSuccess = () => {
    navigate('/application-confirmation')
  }

  if (!businessInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-16 h-16">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <span className="text-muted-foreground text-sm">Loading...</span>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only"
      >
        {t('accessibility.skipToContent')}
      </a>
      
      {/* SEO */}
      <SEOHead
        businessInfo={businessInfo}
        keywords={[
          "staffing agency Maryland",
          "employment services",
          "job placement Riverdale",
          "temporary staffing",
          "permanent placement",
          "contract staffing",
          "Prince George's County jobs"
        ]}
      />
      <StructuredData businessInfo={businessInfo} type="home" />
      
      {/* Animated backgrounds */}
      <AnimatedBackground particleCount={40} connectionDistance={120} />
      <FloatingOrbs />
      
      {/* Navigation with glassmorphic effect */}
      <Navigation />
      
      {/* Main content with relative z-index above background */}
      <main id="main-content" className="relative z-10">
        <Hero />
        
        {/* Client logos - social proof right after hero */}
        <ClientLogos />
        
        {/* Section divider with gradient fade */}
        <div className="relative">
          <div className="absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-transparent to-background pointer-events-none z-20" />
          <Services />
        </div>
        
        <Industries />
        
        {/* Employer CTA - B2B conversion */}
        <EmployerCTA />
        
        <JobListings />
        
        {/* Job Alerts subscription */}
        <JobAlerts />
        
        <WhyChooseUs />
        <EnhancedApplyForm onSuccess={handleApplicationSuccess} />
        
        {/* FAQ Section */}
        <FAQ />
        
        <Testimonials />
        <Contact />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Talent Network Modal */}
      <TalentNetworkModal />
      
      {/* Live Chat Widget */}
      <LiveChat />
    </div>
  )
}

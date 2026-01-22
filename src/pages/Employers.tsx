import { useEffect } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useBusinessInfo } from "@/contexts/BusinessInfoContext"
import { Link } from "react-router-dom"
import { ShieldCheck, Users, Clock, CheckCircle, Phone, Mail, Printer, Sparkles, ShoppingCart, Factory, Headphones } from "lucide-react"
import { EFAX_NUMBER } from "@/lib/contact-info"
import { useLanguage } from "@/contexts/LanguageContext"

export function Employers() {
  const { businessInfo } = useBusinessInfo()
  const { t } = useLanguage()
  const phone = businessInfo?.contact.phone || "+13012772141"
  const email = businessInfo?.contact.email || "info@uniquestaffingprofessionals.com"

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])
  const industries = [
    { icon: Sparkles, title: t('industries.janitorial') },
    { icon: Users, title: t('industries.humanResources') },
    { icon: ShoppingCart, title: t('industries.retailSales') },
    { icon: Headphones, title: t('industries.callCenter') },
    { icon: Factory, title: t('industries.industrial') },
  ]

  const processSteps = [
    {
      icon: ShieldCheck,
      title: t('employerPage.processComplianceTitle'),
      description: t('employerPage.processComplianceDescription')
    },
    {
      icon: Users,
      title: t('employerPage.processTalentTitle'),
      description: t('employerPage.processTalentDescription')
    },
    {
      icon: Clock,
      title: t('employerPage.processFlexibleTitle'),
      description: t('employerPage.processFlexibleDescription')
    },
    {
      icon: CheckCircle,
      title: t('employerPage.processPersonalizedTitle'),
      description: t('employerPage.processPersonalizedDescription')
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <section className="py-12 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                  <Users className="h-4 w-4" />
                  {t('employerPage.eyebrow')}
                </div>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
                  {t('employerPage.title')}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {t('employerPage.subtitle')}
                </p>
                
                {/* Distinct CTA Section */}
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-6 mb-6">
                  <h2 className="font-heading font-semibold text-lg text-foreground mb-2">
                    {t('employerPage.ctaHeadline')}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('employerPage.ctaDescription')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg" className="shadow-lg shadow-primary/25">
                      <Link to="/#contact">{t('employerPage.primaryCta')}</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <a href={`tel:${phone}`}>{t('employerPage.closingSecondaryCta')}</a>
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-8">
                  {t('employerPage.ctaTrust')}
                </p>

                {/* Industries We Serve Chart */}
                <div className="mt-6">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                    {t('employerPage.industriesTitle')}
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-4">
                    {industries.map((industry) => (
                      <div key={industry.title} className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                          <industry.icon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium leading-tight">
                          {industry.title}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-primary font-medium">
                    {t('employerPage.industriesCta')}
                  </p>
                </div>
              </div>
              <Card className="p-6 lg:p-8 border-border bg-card">
                <h2 className="font-heading font-semibold text-xl text-foreground mb-6">
                  {t('employerPage.contactTitle')}
                </h2>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <a href={`tel:${phone}`} className="text-primary hover:underline font-medium">
                      {phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <a href={`mailto:${email}`} className="text-primary hover:underline font-medium break-all">
                      {email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Printer className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">{t('employerPage.efaxLabel')}: </span>
                      <span className="text-primary font-medium">{EFAX_NUMBER}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground pl-[52px]">
                    {t('employerPage.efaxNote')}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-20 bg-secondary/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-3">
                {t('employerPage.processTitle')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('employerPage.processSubtitle')}
              </p>
            </div>
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border" aria-hidden="true" />
              <div className="space-y-8">
                {processSteps.map((step) => (
                  <div key={step.title} className="relative pl-12">
                    <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-6 lg:p-8 border-border bg-card">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h3 className="font-heading font-semibold text-2xl text-foreground mb-2">
                    {t('employerPage.closingTitle')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('employerPage.closingSubtitle')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link to="/#contact">{t('employerPage.closingPrimaryCta')}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href={`tel:${phone}`}>{t('employerPage.closingSecondaryCta')}</a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

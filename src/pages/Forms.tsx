import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { FileText, Briefcase, Users, Phone, HelpCircle, ShieldCheck, FileSignature, Download, ClipboardList, Heart, Landmark, Shield, MapPin } from "lucide-react"
import { WhatsappLogo } from "@phosphor-icons/react"
import { useBusinessInfo } from "@/contexts/BusinessInfoContext"
import { WHATSAPP_LINK, WHATSAPP_NUMBER } from "@/lib/contact-info"
import { useLanguage } from "@/contexts/LanguageContext"

export function Forms() {
  const { businessInfo } = useBusinessInfo()
  const { t } = useLanguage()
  const phone = businessInfo?.contact.phone || "+13012772141"

  const currentEmployeeForms = [
    { icon: FileText, label: t('formsPage.currentEmployeeDescription') },
    { icon: ClipboardList, label: t('formsPage.i9Label') },
    { icon: FileSignature, label: t('formsPage.reassignmentLabel') },
    { icon: Shield, label: t('formsPage.healthInsuranceLabel') },
    { icon: FileText, label: t('formsPage.ptoLabel') },
  ]

  const mdDcForms = [
    { icon: Landmark, label: t('formsPage.marylandSavingsLabel') },
    { icon: MapPin, label: t('formsPage.dcFamilyLeaveLabel') },
  ]

  const securityItems = [
    {
      icon: ShieldCheck,
      title: t('formsPage.securitySslTitle'),
      description: t('formsPage.securitySslDescription'),
    },
    {
      icon: FileSignature,
      title: t('formsPage.securityAdobeTitle'),
      description: t('formsPage.securityAdobeDescription'),
    },
    {
      icon: Download,
      title: t('formsPage.securityTransparencyTitle'),
      description: t('formsPage.securityTransparencyDescription'),
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-3">
                {t('formsPage.title')}
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('formsPage.subtitle')}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Current Employees */}
              <Card className="p-6 border-border bg-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-heading font-semibold text-xl text-foreground mb-2">
                      {t('formsPage.currentEmployeeTitle')}
                    </h2>
                    <ul className="space-y-2">
                      {currentEmployeeForms.map((form, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <form.icon className="h-4 w-4 text-primary/70 flex-shrink-0" />
                          {form.label}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground mt-3">
                      {t('formsPage.documentsSoon')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* New Employee Forms */}
              <Card className="p-6 border-border bg-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-xl text-foreground mb-1">
                      {t('formsPage.newEmployeeTitle')}
                    </h2>
                    <p className="text-muted-foreground">{t('formsPage.newEmployeeDescription')}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('formsPage.documentsSoon')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Contractor Application */}
              <Card className="p-6 border-border bg-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-xl text-foreground mb-1">
                      {t('formsPage.contractorTitle')}
                    </h2>
                    <p className="text-muted-foreground">{t('formsPage.contractorDescription')}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('formsPage.documentsSoon')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Maryland / DC Current Employees */}
              <Card className="p-6 border-border bg-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-heading font-semibold text-xl text-foreground mb-2">
                      {t('formsPage.mdDcTitle')}
                    </h2>
                    <ul className="space-y-2">
                      {mdDcForms.map((form, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <form.icon className="h-4 w-4 text-primary/70 flex-shrink-0" />
                          {form.label}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground mt-3">
                      {t('formsPage.documentsSoon')}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* We Value Your Security Section */}
        <section className="py-12 bg-secondary/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-foreground text-center mb-8">
              {t('formsPage.securityTitle')}
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {securityItems.map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-base text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <Card className="p-6 lg:p-8 border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-2xl text-foreground mb-2">
                    {t('formsPage.assistanceTitle')}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t('common.whatsappCta').replace('{number}', WHATSAPP_NUMBER)}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                        <span className="inline-flex items-center gap-2">
                          <WhatsappLogo size={18} weight="fill" />
                          {t('common.whatsappButton')}
                        </span>
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/#apply">{t('common.joinNetwork')}</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <a href={`tel:${phone}`}>
                        <span className="inline-flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {t('common.callUs')}
                        </span>
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 lg:p-8 border-border bg-secondary/30">
              <h3 className="font-heading font-semibold text-2xl text-foreground mb-2">
                {t('formsPage.employerPromptTitle')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t('formsPage.employerPromptDescription')}
              </p>
              <Button asChild>
                <Link to="/employers">{t('formsPage.employerPromptCta')}</Link>
              </Button>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { FileText, Briefcase, CheckCircle, Users, Phone, HelpCircle } from "lucide-react"
import { WhatsappLogo } from "@phosphor-icons/react"
import { useBusinessInfo } from "@/contexts/BusinessInfoContext"
import { WHATSAPP_LINK, WHATSAPP_NUMBER } from "@/lib/contact-info"
import { useLanguage } from "@/contexts/LanguageContext"

export function Forms() {
  const { businessInfo } = useBusinessInfo()
  const { t } = useLanguage()
  const phone = businessInfo?.contact.phone || "+13012772141"
  const forms = [
    {
      icon: FileText,
      title: t('formsPage.currentEmployeeTitle'),
      description: t('formsPage.currentEmployeeDescription')
    },
    {
      icon: Users,
      title: t('formsPage.newEmployeeTitle'),
      description: t('formsPage.newEmployeeDescription')
    },
    {
      icon: Briefcase,
      title: t('formsPage.contractorTitle'),
      description: t('formsPage.contractorDescription')
    },
    {
      icon: CheckCircle,
      title: t('formsPage.w2Title'),
      description: t('formsPage.w2Description')
    }
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
              {forms.map((form) => (
                <Card key={form.title} className="p-6 border-border bg-card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <form.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-heading font-semibold text-xl text-foreground mb-1">
                        {form.title}
                      </h2>
                      <p className="text-muted-foreground">{form.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {t('formsPage.documentsSoon')}
                      </p>
                    </div>
                  </div>
                </Card>
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

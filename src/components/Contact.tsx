import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Phone, Mail, MapPin, Printer, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { useBusinessInfo } from "@/contexts/BusinessInfoContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { BusinessAddress, BusinessPhone, BusinessEmail } from "@/components/seo/NAPDisplay"

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  company: string
  message: string
  timestamp: number
}

export function Contact() {
  const { businessInfo } = useBusinessInfo()
  const { t } = useLanguage()
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const submission: ContactSubmission = {
      id: Date.now().toString(),
      ...formData,
      timestamp: Date.now()
    }

    setSubmissions(prev => [...prev, submission])

    toast.success(t('contact.success'))

    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: ""
    })

    setIsSubmitting(false)
  }

  if (!businessInfo) return null

  return (
    <section id="contact" className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Card className="p-6 lg:p-8 border-border bg-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.fullName')} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('contact.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">{t('contact.companyName')}</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Corporation"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.message')} *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    placeholder={t('contact.messagePlaceholder')}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('contact.submitting') : t('contact.submit')}
                </Button>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('contact.phoneLabel')}</h3>
                  <p className="text-muted-foreground text-sm">{t('contact.phoneHours')}</p>
                  <BusinessPhone businessInfo={businessInfo} type="phone" className="text-primary hover:underline font-medium" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('contact.textLabel')}</h3>
                  <p className="text-muted-foreground text-sm">{t('contact.textDescription')}</p>
                  <BusinessPhone businessInfo={businessInfo} type="text" className="text-primary hover:underline font-medium" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Printer size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('contact.faxLabel')}</h3>
                  <p className="text-muted-foreground text-sm">{t('contact.faxDescription')}</p>
                  <span className="text-primary font-medium">
                    <BusinessPhone businessInfo={businessInfo} type="fax" />
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('contact.emailLabel')}</h3>
                  <p className="text-muted-foreground text-sm">{t('contact.emailDescription')}</p>
                  <BusinessEmail businessInfo={businessInfo} className="text-primary hover:underline font-medium break-all" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t('contact.officeAddress')}</h3>
                  <BusinessAddress businessInfo={businessInfo} className="text-muted-foreground text-sm" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

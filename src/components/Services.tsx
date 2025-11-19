import { Card } from "@/components/ui/card"
import { Sparkles, Users, ShoppingCart, Phone, Factory } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export function Services() {
  const { t } = useLanguage()

  const services = [
    {
      icon: Sparkles,
      title: t('services.janitorial.title'),
      description: t('services.janitorial.description')
    },
    {
      icon: Users,
      title: t('services.humanResources.title'),
      description: t('services.humanResources.description')
    },
    {
      icon: ShoppingCart,
      title: t('services.retailSales.title'),
      description: t('services.retailSales.description')
    },
    {
      icon: Phone,
      title: t('services.callCenter.title'),
      description: t('services.callCenter.description')
    },
    {
      icon: Factory,
      title: t('services.industrial.title'),
      description: t('services.industrial.description')
    }
  ]

  return (
    <section id="services" className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
            {t('services.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={index}
                className="p-6 lg:p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card"
              >
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon size={28} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl lg:text-2xl text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

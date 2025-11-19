import { Card } from "@/components/ui/card"
import { Zap, Heart, Shield, Users, Lightbulb, Handshake, Target, Award, Clock, Bus, GraduationCap, TrendingUp } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export function WhyChooseUs() {
  const { t } = useLanguage()

  const coreValues = [
    {
      icon: Zap,
      title: t('whyChooseUs.empowerment.title'),
      description: t('whyChooseUs.empowerment.description')
    },
    {
      icon: Heart,
      title: t('whyChooseUs.communityImpact.title'),
      description: t('whyChooseUs.communityImpact.description')
    },
    {
      icon: Shield,
      title: t('whyChooseUs.integrity.title'),
      description: t('whyChooseUs.integrity.description')
    },
    {
      icon: Users,
      title: t('whyChooseUs.inclusivity.title'),
      description: t('whyChooseUs.inclusivity.description')
    },
    {
      icon: Lightbulb,
      title: t('whyChooseUs.innovation.title'),
      description: t('whyChooseUs.innovation.description')
    },
    {
      icon: Handshake,
      title: t('whyChooseUs.collaboration.title'),
      description: t('whyChooseUs.collaboration.description')
    },
    {
      icon: Target,
      title: t('whyChooseUs.resilience.title'),
      description: t('whyChooseUs.resilience.description')
    },
    {
      icon: Award,
      title: t('whyChooseUs.serviceExcellence.title'),
      description: t('whyChooseUs.serviceExcellence.description')
    }
  ]

const keyFeatures = [
    {
      icon: Clock,
      title: t('whyChooseUs.portal247.title'),
      description: t('whyChooseUs.portal247.description')
    },
    {
      icon: Bus,
      title: t('whyChooseUs.transportation.title'),
      description: t('whyChooseUs.transportation.description')
    },
    {
      icon: GraduationCap,
      title: t('whyChooseUs.safetyTraining.title'),
      description: t('whyChooseUs.safetyTraining.description')
    },
    {
      icon: TrendingUp,
      title: t('whyChooseUs.performanceBonuses.title'),
      description: t('whyChooseUs.performanceBonuses.description')
    }
  ]

return (
    <section id="about" className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-6">
              {t('whyChooseUs.title')}
            </h2>
            <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
              {t('whyChooseUs.description1')}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              {t('whyChooseUs.description2')}
            </p>
            <div className="space-y-4 mb-8">
              <h3 className="font-heading font-semibold text-xl text-foreground">{t('whyChooseUs.keyFeatures')}</h3>
              <div className="grid grid-cols-2 gap-4">
                {keyFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{feature.title}</div>
                        <div className="text-xs text-muted-foreground">{feature.description}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-xl text-foreground mb-6">{t('whyChooseUs.coreValues')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coreValues.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="p-5 border-border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h4 className="font-heading font-semibold text-base text-foreground mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              )
            })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

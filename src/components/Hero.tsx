import { Button } from "@/components/ui/button"
import { ArrowRight } from "@phosphor-icons/react"
import { useLanguage } from "@/contexts/LanguageContext"

export function Hero() {
  const { t } = useLanguage()
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="hero"
      className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 bg-gradient-to-br from-primary/5 via-background to-secondary/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-tight mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg lg:text-xl text-foreground/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="text-base px-8 py-6 h-auto group"
              onClick={() => scrollToSection("apply")}
            >
              {t('nav.apply')}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 h-auto bg-background hover:bg-secondary"
              onClick={() => scrollToSection("contact")}
            >
              {t('hero.ctaEmployers')}
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-2">
              15+
            </div>
            <div className="text-sm lg:text-base text-muted-foreground">
              Years Experience
            </div>
          </div>
          <div className="text-center">
            <div className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-2">
              500+
            </div>
            <div className="text-sm lg:text-base text-muted-foreground">
              Companies Served
            </div>
          </div>
          <div className="text-center">
            <div className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-2">
              5,000+
            </div>
            <div className="text-sm lg:text-base text-muted-foreground">
              Placements Made
            </div>
          </div>
          <div className="text-center">
            <div className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-2">
              98%
            </div>
            <div className="text-sm lg:text-base text-muted-foreground">
              Client Satisfaction
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

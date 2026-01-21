import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useBusinessInfo } from "@/contexts/BusinessInfoContext"
import { Link } from "react-router-dom"
import { ShieldCheck, Users, Clock, CheckCircle, Phone, Mail } from "lucide-react"
import { EFAX_NUMBER } from "@/lib/contact-info"

const processSteps = [
  {
    icon: ShieldCheck,
    title: "I-9 verification and compliance",
    description: "Full I-9 checks with local and state compliance."
  },
  {
    icon: Users,
    title: "Large, diverse talent pool",
    description: "A wide range of roles ready to deploy."
  },
  {
    icon: Clock,
    title: "Flexible ordering process",
    description: "From full-time hires to on-the-fly coverage."
  },
  {
    icon: CheckCircle,
    title: "Personalized service",
    description: "US-based staff that learns your business needs."
  }
]

export function Employers() {
  const { businessInfo } = useBusinessInfo()
  const phone = businessInfo?.contact.phone || "+13012772141"
  const email = businessInfo?.contact.email || "info@uniquestaffingprofessionals.com"

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <section className="py-12 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-sm font-semibold text-primary mb-3">For Employers</p>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
                  Learn the Unique Staffing Professionals difference and partner with us for your staffing needs.
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  We deliver reliable, screened talent across the DMV region with a people-first approach that
                  scales to your business.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link to="/#contact">Request staffing support</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/#apply">Explore the talent network</Link>
                  </Button>
                </div>
              </div>
              <Card className="p-6 lg:p-8 border-border bg-card">
                <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
                  Employer contact options
                </h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <a href={`tel:${phone}`} className="text-primary hover:underline">
                      {phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href={`mailto:${email}`} className="text-primary hover:underline">
                      {email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">eFax:</span>
                    <span className="text-primary">{EFAX_NUMBER}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Employers: send us an eFax to start your onboarding request.
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
                Our onboarding process
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A streamlined approach that keeps compliance tight and staffing flexible.
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
                    Ready to partner with Unique Staffing Professionals?
                  </h3>
                  <p className="text-muted-foreground">
                    Tell us about your hiring goals and we will respond with a tailored staffing plan.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link to="/#contact">Start the conversation</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href={`tel:${phone}`}>Call now</a>
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

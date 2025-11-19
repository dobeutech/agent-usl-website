import { Navigation } from "@/components/Navigation"
import { Hero } from "@/components/Hero"
import { Services } from "@/components/Services"
import { Industries } from "@/components/Industries"
import { WhyChooseUs } from "@/components/WhyChooseUs"
import { ApplyForm } from "@/components/ApplyForm"
import { Testimonials } from "@/components/Testimonials"
import { Contact } from "@/components/Contact"
import { Footer } from "@/components/Footer"
import { useBusinessInfo } from "@/contexts/BusinessInfoContext"
import { SEOHead } from "@/components/seo/SEOHead"
import { StructuredData } from "@/components/seo/StructuredData"

export function Home() {
  const { businessInfo } = useBusinessInfo()

  if (!businessInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
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
      <Navigation />
      <main>
        <Hero />
        <Services />
        <Industries />
        <WhyChooseUs />
        <ApplyForm />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

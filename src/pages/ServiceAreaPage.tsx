import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Contact } from "@/components/Contact"
import { Services } from "@/components/Services"
import { useBusinessInfo } from "@/contexts/BusinessInfoContext"
import { SEOHead } from "@/components/seo/SEOHead"
import { StructuredData } from "@/components/seo/StructuredData"
import { GoogleMapsEmbed } from "@/components/seo/GoogleMapsEmbed"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Phone, Mail, ArrowLeft, CheckCircle } from "lucide-react"

interface ServiceArea {
  id: string
  city: string
  state: string
  zip_codes: string[]
  description: string
  meta_title: string
  meta_description: string
  is_active: boolean
}

interface LocalTestimonial {
  id: string
  name: string
  company: string
  location: string
  role: string
  testimonial: string
  rating: number
}

export function ServiceAreaPage() {
  const { city } = useParams<{ city: string }>()
  const { businessInfo } = useBusinessInfo()
  const [serviceArea, setServiceArea] = useState<ServiceArea | null>(null)
  const [testimonials, setTestimonials] = useState<LocalTestimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServiceAreaData = async () => {
      if (!city) return

      try {
        setLoading(true)

        const formattedCity = city
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        const { data: areaData, error: areaError } = await supabase
          .from("service_areas")
          .select("*")
          .ilike("city", formattedCity)
          .eq("is_active", true)
          .maybeSingle()

        if (areaError) throw areaError

        if (areaData) {
          setServiceArea(areaData)

          const { data: testimonialData, error: testimonialError } = await supabase
            .from("local_testimonials")
            .select("*")
            .eq("service_area_id", areaData.id)
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(3)

          if (testimonialError) throw testimonialError
          if (testimonialData) setTestimonials(testimonialData)
        }
      } catch (error) {
        console.error("Error fetching service area data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServiceAreaData()
  }, [city])

  if (!businessInfo) return null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading service area information...</p>
        </div>
      </div>
    )
  }

  if (!serviceArea) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="font-heading font-bold text-3xl mb-4">Service Area Not Found</h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find information for this location.
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="mr-2" size={16} />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const breadcrumbs = [
    { name: "Home", url: "https://uniquestaffingprofessionals.com" },
    { name: "Service Areas", url: "https://uniquestaffingprofessionals.com/#services" },
    {
      name: `${serviceArea.city}, ${serviceArea.state}`,
      url: `https://uniquestaffingprofessionals.com/service-area/${city}`
    }
  ]

  return (
    <div className="min-h-screen">
      <SEOHead
        title={serviceArea.meta_title || `Staffing Services in ${serviceArea.city}, ${serviceArea.state}`}
        description={serviceArea.meta_description || serviceArea.description}
        canonical={`https://uniquestaffingprofessionals.com/service-area/${city}`}
        businessInfo={businessInfo}
        serviceArea={{ city: serviceArea.city, state: serviceArea.state }}
        keywords={[
          `${serviceArea.city} staffing`,
          `${serviceArea.city} employment`,
          `${serviceArea.city} jobs`,
          `${serviceArea.city} recruitment`,
          "temporary staffing",
          "permanent placement"
        ]}
      />
      <StructuredData businessInfo={businessInfo} breadcrumbs={breadcrumbs} type="service-area" />

      <Navigation />

      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span>Service Areas</span>
              <span>/</span>
              <span className="text-foreground">
                {serviceArea.city}, {serviceArea.state}
              </span>
            </div>

            <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-6">
              Professional Staffing Services in {serviceArea.city}, {serviceArea.state}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">{serviceArea.description}</p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <a href="tel:+13012385182">
                  <Phone className="mr-2" size={18} />
                  Call Now
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#contact">
                  <Mail className="mr-2" size={18} />
                  Get in Touch
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-heading font-bold text-3xl mb-6">
                Why Choose Us in {serviceArea.city}?
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold mb-1">Local Expertise</h3>
                    <p className="text-muted-foreground">
                      Deep understanding of the {serviceArea.city} job market and business landscape.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold mb-1">Quick Response Time</h3>
                    <p className="text-muted-foreground">
                      Fast placement services with candidates available within 24-48 hours.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold mb-1">Quality Candidates</h3>
                    <p className="text-muted-foreground">
                      Pre-screened, qualified professionals ready to contribute to your success.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold mb-1">Flexible Solutions</h3>
                    <p className="text-muted-foreground">
                      Temporary, permanent, and contract-to-hire staffing options.
                    </p>
                  </div>
                </div>
              </div>

              {serviceArea.zip_codes && serviceArea.zip_codes.length > 0 && (
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3">Areas We Serve in {serviceArea.city}</h3>
                  <p className="text-sm text-muted-foreground mb-2">ZIP Codes:</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceArea.zip_codes.map((zip) => (
                      <span key={zip} className="bg-background px-3 py-1 rounded text-sm">
                        {zip}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <GoogleMapsEmbed businessInfo={businessInfo} height="450px" />
            </div>
          </div>
        </div>
      </section>

      <Services />

      {testimonials.length > 0 && (
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-4">
                What Our {serviceArea.city} Clients Say
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Real experiences from businesses and professionals in {serviceArea.city}.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-accent text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.testimonial}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    <p className="text-xs text-muted-foreground mt-1">{testimonial.location}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Contact />
      <Footer />
    </div>
  )
}

import { useEffect } from "react"
import type { BusinessInfo } from "@/types/business-info"

interface LocalBusinessSchema {
  "@context": string
  "@type": string
  "@id": string
  name: string
  alternateName?: string
  description: string
  url: string
  logo?: string
  image?: string
  telephone: string
  email: string
  faxNumber?: string
  address: {
    "@type": string
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  geo: {
    "@type": string
    latitude: number
    longitude: number
  }
  openingHoursSpecification?: Array<{
    "@type": string
    dayOfWeek: string
    opens: string
    closes: string
  }>
  priceRange?: string
  areaServed?: Array<{
    "@type": string
    name: string
  }>
  founder?: {
    "@type": string
    name: string
  }
  foundingDate?: string
  sameAs?: string[]
}

interface OrganizationSchema {
  "@context": string
  "@type": string
  name: string
  legalName: string
  url: string
  description: string
  address: {
    "@type": string
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  contactPoint: {
    "@type": string
    telephone: string
    contactType: string
    email: string
    areaServed: string
    availableLanguage: string[]
  }
}

interface BreadcrumbSchema {
  "@context": string
  "@type": string
  itemListElement: Array<{
    "@type": string
    position: number
    name: string
    item?: string
  }>
}

interface WebSiteSchema {
  "@context": string
  "@type": string
  name: string
  url: string
  potentialAction: {
    "@type": string
    target: {
      "@type": string
      urlTemplate: string
    }
    "query-input": string
  }
}

interface StructuredDataProps {
  businessInfo: BusinessInfo
  breadcrumbs?: Array<{ name: string; url?: string }>
  type?: "home" | "service-area" | "contact"
}

export function StructuredData({ businessInfo, breadcrumbs, type = "home" }: StructuredDataProps) {
  useEffect(() => {
    const scripts: HTMLScriptElement[] = []

    const localBusinessSchema: LocalBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "EmploymentAgency",
      "@id": `https://uniquestaffingprofessionals.com/#business`,
      name: businessInfo.name,
      alternateName: businessInfo.legalName,
      description: businessInfo.description,
      url: "https://uniquestaffingprofessionals.com",
      telephone: businessInfo.contact.phone,
      email: businessInfo.contact.email,
      faxNumber: businessInfo.contact.fax,
      address: {
        "@type": "PostalAddress",
        streetAddress: businessInfo.location.suite
          ? `${businessInfo.location.street}, ${businessInfo.location.suite}`
          : businessInfo.location.street,
        addressLocality: businessInfo.location.city,
        addressRegion: businessInfo.location.state,
        postalCode: businessInfo.location.zipCode,
        addressCountry: businessInfo.location.country
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: businessInfo.geo.latitude,
        longitude: businessInfo.geo.longitude
      },
      openingHoursSpecification: businessInfo.hours.map(hour => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hour.dayOfWeek,
        opens: hour.opens,
        closes: hour.closes
      })),
      priceRange: "$$",
      areaServed: businessInfo.serviceAreas.map(area => ({
        "@type": "City",
        name: area
      }))
    }

    if (businessInfo.ceo) {
      localBusinessSchema.founder = {
        "@type": "Person",
        name: businessInfo.ceo
      }
    }

    if (businessInfo.foundedYear) {
      localBusinessSchema.foundingDate = `${businessInfo.foundedYear}-01-01`
    }

    if (businessInfo.socialMedia) {
      const socialLinks: string[] = []
      if (businessInfo.socialMedia.facebook) socialLinks.push(businessInfo.socialMedia.facebook)
      if (businessInfo.socialMedia.linkedin) socialLinks.push(businessInfo.socialMedia.linkedin)
      if (businessInfo.socialMedia.twitter) socialLinks.push(businessInfo.socialMedia.twitter)
      if (socialLinks.length > 0) {
        localBusinessSchema.sameAs = socialLinks
      }
    }

    const organizationSchema: OrganizationSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: businessInfo.name,
      legalName: businessInfo.legalName,
      url: "https://uniquestaffingprofessionals.com",
      description: businessInfo.description,
      address: {
        "@type": "PostalAddress",
        streetAddress: businessInfo.location.suite
          ? `${businessInfo.location.street}, ${businessInfo.location.suite}`
          : businessInfo.location.street,
        addressLocality: businessInfo.location.city,
        addressRegion: businessInfo.location.state,
        postalCode: businessInfo.location.zipCode,
        addressCountry: businessInfo.location.country
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: businessInfo.contact.phone,
        contactType: "Customer Service",
        email: businessInfo.contact.email,
        areaServed: "US-MD",
        availableLanguage: ["English", "Spanish"]
      }
    }

    const websiteSchema: WebSiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: businessInfo.name,
      url: "https://uniquestaffingprofessionals.com",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://uniquestaffingprofessionals.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }

    const ldJsonScripts = [
      localBusinessSchema,
      organizationSchema,
      websiteSchema
    ]

    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema: BreadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: crumb.url
        }))
      }
      ldJsonScripts.push(breadcrumbSchema)
    }

    ldJsonScripts.forEach((schema) => {
      const script = document.createElement("script")
      script.type = "application/ld+json"
      script.text = JSON.stringify(schema)
      document.head.appendChild(script)
      scripts.push(script)
    })

    return () => {
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      })
    }
  }, [businessInfo, breadcrumbs, type])

  return null
}

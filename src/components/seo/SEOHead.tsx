import { useEffect } from "react"
import type { BusinessInfo } from "@/types/business-info"

interface SEOHeadProps {
  title?: string
  description?: string
  canonical?: string
  ogType?: string
  ogImage?: string
  businessInfo: BusinessInfo
  keywords?: string[]
  serviceArea?: {
    city: string
    state: string
  }
}

export function SEOHead({
  title,
  description,
  canonical,
  ogType = "website",
  ogImage,
  businessInfo,
  keywords = [],
  serviceArea
}: SEOHeadProps) {
  useEffect(() => {
    const baseUrl = "https://uniquestaffingprofessionals.com"

    const locationSuffix = serviceArea
      ? ` in ${serviceArea.city}, ${serviceArea.state}`
      : " | Riverdale, MD"

    const fullTitle = title
      ? `${title}${locationSuffix}`
      : `${businessInfo.name} - ${businessInfo.tagline}${locationSuffix}`

    const fullDescription = description || businessInfo.description

    const defaultKeywords = [
      "staffing agency",
      "employment agency",
      "job placement",
      "recruitment services",
      "temporary staffing",
      "permanent placement",
      businessInfo.location.city,
      businessInfo.location.state,
      "Maryland staffing"
    ]

    const allKeywords = [...new Set([...defaultKeywords, ...keywords])]

    if (serviceArea) {
      allKeywords.push(
        `${serviceArea.city} staffing`,
        `${serviceArea.city} jobs`,
        `employment ${serviceArea.city}`
      )
    }

    document.title = fullTitle

    const updateOrCreateMetaTag = (name: string, content: string, useProperty = false) => {
      const attribute = useProperty ? "property" : "name"
      let element = document.querySelector(`meta[${attribute}="${name}"]`)

      if (!element) {
        element = document.createElement("meta")
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }

      element.setAttribute("content", content)
    }

    updateOrCreateMetaTag("description", fullDescription)
    updateOrCreateMetaTag("keywords", allKeywords.join(", "))
    updateOrCreateMetaTag("author", businessInfo.name)
    updateOrCreateMetaTag("robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1")
    updateOrCreateMetaTag("googlebot", "index, follow")

    updateOrCreateMetaTag("geo.region", `US-${businessInfo.location.state}`)
    updateOrCreateMetaTag("geo.placename", businessInfo.location.city)
    updateOrCreateMetaTag("geo.position", `${businessInfo.geo.latitude};${businessInfo.geo.longitude}`)
    updateOrCreateMetaTag("ICBM", `${businessInfo.geo.latitude}, ${businessInfo.geo.longitude}`)

    updateOrCreateMetaTag("og:title", fullTitle, true)
    updateOrCreateMetaTag("og:description", fullDescription, true)
    updateOrCreateMetaTag("og:type", ogType, true)
    updateOrCreateMetaTag("og:url", canonical || baseUrl, true)
    updateOrCreateMetaTag("og:site_name", businessInfo.name, true)
    updateOrCreateMetaTag("og:locale", "en_US", true)

    if (ogImage) {
      updateOrCreateMetaTag("og:image", ogImage, true)
      updateOrCreateMetaTag("og:image:width", "1200", true)
      updateOrCreateMetaTag("og:image:height", "630", true)
    }

    updateOrCreateMetaTag("og:phone_number", businessInfo.contact.phone, true)
    updateOrCreateMetaTag("og:email", businessInfo.contact.email, true)
    updateOrCreateMetaTag("og:street-address", businessInfo.location.street, true)
    updateOrCreateMetaTag("og:locality", businessInfo.location.city, true)
    updateOrCreateMetaTag("og:region", businessInfo.location.state, true)
    updateOrCreateMetaTag("og:postal-code", businessInfo.location.zipCode, true)
    updateOrCreateMetaTag("og:country-name", businessInfo.location.country, true)

    updateOrCreateMetaTag("twitter:card", "summary_large_image")
    updateOrCreateMetaTag("twitter:title", fullTitle)
    updateOrCreateMetaTag("twitter:description", fullDescription)
    if (ogImage) {
      updateOrCreateMetaTag("twitter:image", ogImage)
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonicalLink) {
      canonicalLink = document.createElement("link")
      canonicalLink.rel = "canonical"
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = canonical || baseUrl

    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      viewport.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=5.0")
    }

  }, [title, description, canonical, ogType, ogImage, businessInfo, keywords, serviceArea])

  return null
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { BusinessInfo } from "@/types/business-info"

interface BusinessInfoContextType {
  businessInfo: BusinessInfo | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const BusinessInfoContext = createContext<BusinessInfoContextType | undefined>(undefined)

interface BusinessInfoProviderProps {
  children: ReactNode
}

const defaultBusinessInfo: BusinessInfo = {
  name: "Unique Staffing Professionals Inc.",
  legalName: "Unique Staffing Professionals Inc.",
  description: "Professional staffing agency connecting businesses with qualified candidates while showcasing services, expertise, and building trust through comprehensive employment solutions.",
  tagline: "Where Opportunity Starts! Expanding access to meaningful employment across the globe through innovative staffing solutions and local partnerships.",
  ceo: "Otniel Morilla",
  location: {
    street: "6200 Baltimore Avenue",
    suite: "Floor 3, Suite R35",
    city: "Riverdale",
    state: "MD",
    zipCode: "20737",
    country: "United States"
  },
  contact: {
    phone: "+13012385182",
    textLine: "+13012385183",
    fax: "+12403923898",
    email: "info@uniquestaffingprofessionals.com"
  },
  hours: [
    { dayOfWeek: "Monday", opens: "08:00", closes: "18:00" },
    { dayOfWeek: "Tuesday", opens: "08:00", closes: "18:00" },
    { dayOfWeek: "Wednesday", opens: "08:00", closes: "18:00" },
    { dayOfWeek: "Thursday", opens: "08:00", closes: "18:00" },
    { dayOfWeek: "Friday", opens: "08:00", closes: "18:00" }
  ],
  geo: {
    latitude: 38.9643,
    longitude: -76.9283
  },
  foundedYear: 2020,
  serviceAreas: ["Riverdale", "College Park", "Hyattsville", "Greenbelt", "Beltsville", "Laurel"]
}

export function BusinessInfoProvider({ children }: BusinessInfoProviderProps) {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(defaultBusinessInfo)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBusinessInfo = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from("business_info")
        .select("*")
        .eq("is_active", true)
        .maybeSingle()

      if (fetchError) {
        throw fetchError
      }

      if (data) {
        const transformedData: BusinessInfo = {
          id: data.id,
          name: data.name,
          legalName: data.legal_name,
          description: data.description,
          tagline: data.tagline,
          ceo: data.ceo,
          location: data.location as BusinessInfo["location"],
          contact: data.contact as BusinessInfo["contact"],
          hours: data.hours as BusinessInfo["hours"],
          geo: data.geo as BusinessInfo["geo"],
          foundedYear: data.founded_year,
          serviceAreas: data.service_areas,
          socialMedia: data.social_media as BusinessInfo["socialMedia"],
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
        setBusinessInfo(transformedData)
      } else {
        setBusinessInfo(defaultBusinessInfo)
      }
    } catch (err) {
      console.error("Error fetching business info:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch business info"))
      setBusinessInfo(defaultBusinessInfo)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinessInfo()
  }, [])

  const value: BusinessInfoContextType = {
    businessInfo,
    loading,
    error,
    refetch: fetchBusinessInfo
  }

  return (
    <BusinessInfoContext.Provider value={value}>
      {children}
    </BusinessInfoContext.Provider>
  )
}

export function useBusinessInfo() {
  const context = useContext(BusinessInfoContext)
  if (context === undefined) {
    throw new Error("useBusinessInfo must be used within a BusinessInfoProvider")
  }
  return context
}

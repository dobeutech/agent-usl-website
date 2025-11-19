export interface BusinessLocation {
  street: string
  suite?: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface BusinessContact {
  phone: string
  textLine: string
  fax: string
  email: string
}

export interface BusinessHours {
  dayOfWeek: string
  opens: string
  closes: string
}

export interface GeoCoordinates {
  latitude: number
  longitude: number
}

export interface BusinessInfo {
  id?: string
  name: string
  legalName: string
  description: string
  tagline: string
  ceo: string
  location: BusinessLocation
  contact: BusinessContact
  hours: BusinessHours[]
  geo: GeoCoordinates
  foundedYear?: number
  serviceAreas: string[]
  socialMedia?: {
    facebook?: string
    linkedin?: string
    twitter?: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface ServiceArea {
  id?: string
  city: string
  state: string
  zipCodes: string[]
  description: string
  isActive: boolean
  createdAt?: string
}

export interface LocalTestimonial {
  id?: string
  name: string
  company: string
  location: string
  role: string
  testimonial: string
  rating: number
  serviceArea?: string
  createdAt?: string
}

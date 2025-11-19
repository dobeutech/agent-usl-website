import type { ReactNode } from "react"
import type { BusinessInfo } from "@/types/business-info"

interface NAPDisplayProps {
  businessInfo: BusinessInfo
  variant?: "inline" | "block" | "minimal"
  showName?: boolean
  showAddress?: boolean
  showPhone?: boolean
  showEmail?: boolean
  className?: string
}

export function NAPDisplay({
  businessInfo,
  variant = "block",
  showName = true,
  showAddress = true,
  showPhone = true,
  showEmail = false,
  className = ""
}: NAPDisplayProps) {
  const { name, location, contact } = businessInfo

  const fullAddress = location.suite
    ? `${location.street}, ${location.suite}, ${location.city}, ${location.state} ${location.zipCode}`
    : `${location.street}, ${location.city}, ${location.state} ${location.zipCode}`

  if (variant === "minimal") {
    return (
      <div className={className} itemScope itemType="https://schema.org/LocalBusiness">
        {showName && <meta itemProp="name" content={name} />}
        {showPhone && (
          <a
            href={`tel:${contact.phone}`}
            itemProp="telephone"
            className="hover:underline"
          >
            {contact.phone.replace("+1", "(").replace(/(\d{3})(\d{3})/, "$1) $2-")}
          </a>
        )}
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <span className={className} itemScope itemType="https://schema.org/LocalBusiness">
        {showName && <span itemProp="name">{name}</span>}
        {showAddress && (
          <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            {" "}
            <span itemProp="streetAddress">
              {location.suite ? `${location.street}, ${location.suite}` : location.street}
            </span>
            , <span itemProp="addressLocality">{location.city}</span>,{" "}
            <span itemProp="addressRegion">{location.state}</span>{" "}
            <span itemProp="postalCode">{location.zipCode}</span>
          </span>
        )}
        {showPhone && (
          <>
            {" "}
            <a href={`tel:${contact.phone}`} itemProp="telephone" className="hover:underline">
              {contact.phone.replace("+1", "(").replace(/(\d{3})(\d{3})/, "$1) $2-")}
            </a>
          </>
        )}
        {showEmail && (
          <>
            {" "}
            <a href={`mailto:${contact.email}`} itemProp="email" className="hover:underline">
              {contact.email}
            </a>
          </>
        )}
      </span>
    )
  }

  return (
    <div className={className} itemScope itemType="https://schema.org/LocalBusiness">
      {showName && (
        <div itemProp="name" className="font-semibold">
          {name}
        </div>
      )}
      {showAddress && (
        <address
          itemProp="address"
          itemScope
          itemType="https://schema.org/PostalAddress"
          className="not-italic"
        >
          <span itemProp="streetAddress">
            {location.street}
            {location.suite && (
              <>
                <br />
                {location.suite}
              </>
            )}
          </span>
          <br />
          <span itemProp="addressLocality">{location.city}</span>,{" "}
          <span itemProp="addressRegion">{location.state}</span>{" "}
          <span itemProp="postalCode">{location.zipCode}</span>
          <meta itemProp="addressCountry" content={location.country} />
        </address>
      )}
      {showPhone && (
        <div>
          <a href={`tel:${contact.phone}`} itemProp="telephone" className="hover:underline">
            {contact.phone.replace("+1", "(").replace(/(\d{3})(\d{3})/, "$1) $2-")}
          </a>
        </div>
      )}
      {showEmail && (
        <div>
          <a href={`mailto:${contact.email}`} itemProp="email" className="hover:underline">
            {contact.email}
          </a>
        </div>
      )}
    </div>
  )
}

interface BusinessNameProps {
  businessInfo: BusinessInfo
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div"
  className?: string
  children?: ReactNode
}

export function BusinessName({
  businessInfo,
  as: Component = "span",
  className = "",
  children
}: BusinessNameProps) {
  return (
    <Component itemProp="name" className={className}>
      {children || businessInfo.name}
    </Component>
  )
}

interface BusinessAddressProps {
  businessInfo: BusinessInfo
  multiline?: boolean
  className?: string
}

export function BusinessAddress({ businessInfo, multiline = true, className = "" }: BusinessAddressProps) {
  const { location } = businessInfo

  if (!multiline) {
    return (
      <span
        itemProp="address"
        itemScope
        itemType="https://schema.org/PostalAddress"
        className={className}
      >
        <span itemProp="streetAddress">
          {location.suite ? `${location.street}, ${location.suite}` : location.street}
        </span>
        , <span itemProp="addressLocality">{location.city}</span>,{" "}
        <span itemProp="addressRegion">{location.state}</span>{" "}
        <span itemProp="postalCode">{location.zipCode}</span>
        <meta itemProp="addressCountry" content={location.country} />
      </span>
    )
  }

  return (
    <address
      itemProp="address"
      itemScope
      itemType="https://schema.org/PostalAddress"
      className={`not-italic ${className}`}
    >
      <span itemProp="streetAddress">
        {location.street}
        {location.suite && (
          <>
            <br />
            {location.suite}
          </>
        )}
      </span>
      <br />
      <span itemProp="addressLocality">{location.city}</span>,{" "}
      <span itemProp="addressRegion">{location.state}</span>{" "}
      <span itemProp="postalCode">{location.zipCode}</span>
      <meta itemProp="addressCountry" content={location.country} />
    </address>
  )
}

interface BusinessPhoneProps {
  businessInfo: BusinessInfo
  type?: "phone" | "text" | "fax"
  showIcon?: boolean
  className?: string
}

export function BusinessPhone({
  businessInfo,
  type = "phone",
  showIcon = false,
  className = ""
}: BusinessPhoneProps) {
  const { contact } = businessInfo

  const phoneMap = {
    phone: contact.phone,
    text: contact.textLine,
    fax: contact.fax
  }

  const phone = phoneMap[type]
  const formatted = phone.replace("+1", "(").replace(/(\d{3})(\d{3})/, "$1) $2-")

  if (type === "fax") {
    return (
      <span itemProp="faxNumber" className={className}>
        {formatted}
      </span>
    )
  }

  return (
    <a
      href={type === "text" ? `sms:${phone}` : `tel:${phone}`}
      itemProp="telephone"
      className={`hover:underline ${className}`}
    >
      {formatted}
    </a>
  )
}

interface BusinessEmailProps {
  businessInfo: BusinessInfo
  className?: string
}

export function BusinessEmail({ businessInfo, className = "" }: BusinessEmailProps) {
  return (
    <a
      href={`mailto:${businessInfo.contact.email}`}
      itemProp="email"
      className={`hover:underline ${className}`}
    >
      {businessInfo.contact.email}
    </a>
  )
}

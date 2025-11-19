import { useEffect, useRef, useState } from "react"
import type { BusinessInfo } from "@/types/business-info"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, ExternalLink } from "lucide-react"

interface GoogleMapsEmbedProps {
  businessInfo: BusinessInfo
  height?: string
  showDirections?: boolean
  className?: string
}

export function GoogleMapsEmbed({
  businessInfo,
  height = "400px",
  showDirections = true,
  className = ""
}: GoogleMapsEmbedProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState(false)

  const { location, geo, name } = businessInfo

  const fullAddress = location.suite
    ? `${location.street}, ${location.suite}, ${location.city}, ${location.state} ${location.zipCode}`
    : `${location.street}, ${location.city}, ${location.state} ${location.zipCode}`

  const encodedAddress = encodeURIComponent(fullAddress)
  const encodedName = encodeURIComponent(name)

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
  const appleMapsUrl = `https://maps.apple.com/?q=${encodedName}&address=${encodedAddress}`
  const wazeUrl = `https://waze.com/ul?q=${encodedAddress}&navigate=yes`

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  }&q=${encodedAddress}&zoom=15`

  const hasApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    if (!hasApiKey) {
      setMapError(true)
    }
  }, [hasApiKey])

  if (mapError || !hasApiKey) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div
          className="relative bg-muted flex items-center justify-center"
          style={{ height }}
        >
          <div className="text-center p-6">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold text-lg mb-2">Find Us Here</h3>
            <address className="not-italic text-muted-foreground mb-4">
              {location.street}
              {location.suite && (
                <>
                  <br />
                  {location.suite}
                </>
              )}
              <br />
              {location.city}, {location.state} {location.zipCode}
            </address>
            {showDirections && (
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button asChild size="sm" variant="outline">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <Navigation size={16} />
                    Google Maps
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a
                    href={appleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <Navigation size={16} />
                    Apple Maps
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a
                    href={wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <Navigation size={16} />
                    Waze
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative" style={{ height }}>
        <iframe
          ref={mapRef}
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing location of ${name}`}
          onError={() => setMapError(true)}
        />
      </div>
      {showDirections && (
        <div className="p-4 border-t border-border bg-card">
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild size="sm" variant="outline">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Navigation size={16} />
                Google Maps
                <ExternalLink size={14} />
              </a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a
                href={appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Navigation size={16} />
                Apple Maps
                <ExternalLink size={14} />
              </a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Navigation size={16} />
                Waze
                <ExternalLink size={14} />
              </a>
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

interface StaticMapImageProps {
  businessInfo: BusinessInfo
  width?: number
  height?: number
  zoom?: number
  className?: string
}

export function StaticMapImage({
  businessInfo,
  width = 600,
  height = 400,
  zoom = 15,
  className = ""
}: StaticMapImageProps) {
  const { geo, location, name } = businessInfo

  const fullAddress = location.suite
    ? `${location.street}, ${location.suite}, ${location.city}, ${location.state} ${location.zipCode}`
    : `${location.street}, ${location.city}, ${location.state} ${location.zipCode}`

  const encodedAddress = encodeURIComponent(fullAddress)
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`

  const hasApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!hasApiKey) {
    return (
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block bg-muted hover:bg-muted/80 transition-colors ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Click for directions</p>
          </div>
        </div>
      </a>
    )
  }

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${geo.latitude},${geo.longitude}&zoom=${zoom}&size=${width}x${height}&markers=color:red%7C${geo.latitude},${geo.longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`

  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`block ${className}`}
    >
      <img
        src={staticMapUrl}
        alt={`Map showing ${name} location`}
        width={width}
        height={height}
        className="w-full h-auto"
        loading="lazy"
      />
    </a>
  )
}

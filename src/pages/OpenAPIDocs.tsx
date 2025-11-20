import { useEffect } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"

export function OpenAPIDocs() {
  useEffect(() => {
    // Load Swagger UI
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js'
    script.async = true
    script.onload = () => {
      // @ts-expect-error SwaggerUIBundle is loaded from CDN
      window.SwaggerUIBundle({
        url: '/openapi.yaml',
        dom_id: '#swagger-ui',
        presets: [
          // @ts-expect-error SwaggerUIBundle types not available
          window.SwaggerUIBundle.presets.apis,
          // @ts-expect-error SwaggerUIBundle types not available
          window.SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: 'StandaloneLayout'
      })
    }
    document.body.appendChild(script)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css'
    document.head.appendChild(link)

    return () => {
      document.body.removeChild(script)
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading font-bold text-3xl text-foreground mb-4">
              API Documentation
            </h1>
            <p className="text-muted-foreground">
              REST API for accessing applicant and job data. Contact us for API key access.
            </p>
          </div>
          <div id="swagger-ui" className="bg-card rounded-lg border border-border" />
        </div>
      </main>
      <Footer />
    </div>
  )
}

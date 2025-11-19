import { Phone, Mail, MapPin, MessageSquare, Printer } from "lucide-react"
import { useBusinessInfo } from "@/contexts/BusinessInfoContext"
import { BusinessAddress, BusinessPhone, BusinessEmail } from "@/components/seo/NAPDisplay"

export function Footer() {
  const { businessInfo } = useBusinessInfo()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!businessInfo) return null

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12" itemScope itemType="https://schema.org/LocalBusiness">
          <div className="lg:col-span-2">
            <h3 className="font-heading font-bold text-2xl mb-4" itemProp="name">
              {businessInfo.name}
            </h3>
            <p className="text-primary-foreground/80 mb-4 leading-relaxed" itemProp="description">
              {businessInfo.tagline}
            </p>
            {businessInfo.ceo && (
              <p className="text-primary-foreground/70 text-sm mb-6">
                Led by CEO {businessInfo.ceo}
              </p>
            )}
            <div className="flex gap-4">
              <a href={`tel:${businessInfo.contact.phone}`} className="text-primary-foreground hover:text-accent transition-colors" aria-label="Call us" itemProp="telephone">
                <Phone size={24} />
              </a>
              <a href={`mailto:${businessInfo.contact.email}`} className="text-primary-foreground hover:text-accent transition-colors" aria-label="Email us" itemProp="email">
                <Mail size={24} />
              </a>
              <a href={`sms:${businessInfo.contact.textLine}`} className="text-primary-foreground hover:text-accent transition-colors" aria-label="Text us">
                <MessageSquare size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("industries")}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Industries
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-3 text-primary-foreground/80 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <BusinessAddress businessInfo={businessInfo} className="text-sm" />
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <BusinessPhone businessInfo={businessInfo} type="phone" className="hover:text-primary-foreground transition-colors" />
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare size={18} />
                <span>Text: <BusinessPhone businessInfo={businessInfo} type="text" className="hover:text-primary-foreground transition-colors" /></span>
              </li>
              <li className="flex items-center gap-2">
                <Printer size={18} />
                <span>Fax: <BusinessPhone businessInfo={businessInfo} type="fax" /></span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <BusinessEmail businessInfo={businessInfo} className="hover:text-primary-foreground transition-colors break-all" />
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/60 text-sm">
          <p>&copy; {new Date().getFullYear()} {businessInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

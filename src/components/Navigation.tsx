import { useState } from "react"
import { Button } from "@/components/ui/button"
import { List, X } from "@phosphor-icons/react"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setMobileMenuOpen(false)
    }
  }

  const navItems = [
    { label: "Services", id: "services" },
    { label: "Industries", id: "industries" },
    { label: "About", id: "about" },
    { label: "Apply Now", id: "apply" },
    { label: "Contact", id: "contact" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection("hero")}
              className="font-heading font-bold text-xl lg:text-2xl text-primary hover:text-primary/80 transition-colors"
            >
              Unique Staffing Professionals
            </button>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground/80 hover:text-foreground font-medium transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="/admin/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </a>
            <Button onClick={() => scrollToSection("apply")} size="lg">
              Apply Now
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left text-foreground/80 hover:text-foreground font-medium py-2"
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => scrollToSection("apply")}
              className="w-full"
              size="lg"
            >
              Apply Now
            </Button>
            <a
              href="/admin/login"
              className="block text-center text-sm text-muted-foreground hover:text-foreground py-2"
            >
              Admin Login
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Buildings, Star, Handshake, CheckCircle } from '@phosphor-icons/react'

// Placeholder client data - in production, these would be real client logos
const clients = [
  { name: "Federal Government", industry: "Government" },
  { name: "Health Care Custodians", industry: "Healthcare" },
  { name: "Retail Chains", industry: "Retail" },
  { name: "Manufacturing", industry: "Industrial" },
  { name: "Facilities Management", industry: "Facilities Management" },
  { name: "Office Buildings", industry: "Commercial" },
  { name: "Educational Institutions", industry: "Education" },
  { name: "Facility Management", industry: "Facilities" },
  { name: "Construction Cleanup", industry: "Construction" }
]

const clientLogos = [
  { name: "Aramark", src: "/client-logos/aramark.png" },
  { name: "Baltimore Ravens", src: "/client-logos/baltimore-ravens.png" },
  { name: "Bob's", src: "/client-logos/bobs.webp" },
  { name: "Bolana", src: "/client-logos/bolana.jpg" },
  { name: "Capital One", src: "/client-logos/capital-one.png" },
  { name: "Del Monte", src: "/client-logos/delmonte.svg" },
  { name: "Melwood", src: "/client-logos/melwood.webp" },
  { name: "Native Floral Group", src: "/client-logos/native-floral-group.gif" },
  { name: "Ravens", src: "/client-logos/ravens.jpg" },
  { name: "Reduction in Motion", src: "/client-logos/reduction-in-motion.png" },
  { name: "Sieck Floral Group", src: "/client-logos/sieck-floral-group.png" },
  { name: "Star Services", src: "/client-logos/star-services.webp" },
  { name: "UrbanStems", src: "/client-logos/urbanstems.webp" },
  { name: "Washington Commanders", src: "/client-logos/washington-commanders.png" },
]

const stats = [
  { icon: Buildings, value: "25+", label: "Active Contracts Served Simultaneously" },
  { icon: Handshake, value: "4,761+", label: "Placements Made" },
  { icon: CheckCircle, value: "20+", label: "Years Experience" }
]

export function ClientLogos() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
            Trusted by Industry Leaders
          </p>
          <h2 className="font-heading font-bold text-2xl lg:text-3xl text-foreground">
            Partnering with Top Organizations across Many Industries
          </h2>
        </motion.div>

        {/* Animated Logo Carousel */}
        <div className="relative">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Client Logo Carousel */}
          <div className="flex overflow-hidden mb-4">
            <motion.div
              className="flex gap-8 py-4"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                x: {
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear'
                }
              }}
            >
              {[...clientLogos, ...clientLogos].map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-44 h-24 rounded-xl bg-white border border-border/50 flex items-center justify-center px-4 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <img
                    src={logo.src}
                    alt={`${logo.name} logo`}
                    className="max-h-16 max-w-[140px] w-auto h-auto object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Industry tags row */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-6 py-4"
              animate={{ x: ['-50%', '0%'] }}
              transition={{
                x: {
                  duration: 35,
                  repeat: Infinity,
                  ease: 'linear'
                }
              }}
            >
              {[...clients, ...clients].map((client, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-48 h-20 rounded-xl bg-card border border-border/50 flex items-center justify-center px-4 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Buildings size={16} className="text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.industry}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Trust Stats */}
        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <stat.icon size={32} weight="duotone" className="mx-auto mb-3 text-primary" />
              <div className="font-heading font-bold text-2xl lg:text-3xl text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

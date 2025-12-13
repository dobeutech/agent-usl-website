import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Buildings, Star, Handshake, CheckCircle } from '@phosphor-icons/react'

// Placeholder client data - in production, these would be real client logos
const clients = [
  { name: "Federal Government", industry: "Government" },
  { name: "Healthcare Systems", industry: "Healthcare" },
  { name: "Retail Chains", industry: "Retail" },
  { name: "Manufacturing", industry: "Industrial" },
  { name: "Call Centers", industry: "Customer Service" },
  { name: "Office Buildings", industry: "Commercial" },
  { name: "Hotels & Hospitality", industry: "Hospitality" },
  { name: "Educational Institutions", industry: "Education" }
]

const stats = [
  { icon: Buildings, value: "500+", label: "Companies Served" },
  { icon: Star, value: "98%", label: "Client Satisfaction" },
  { icon: Handshake, value: "5,000+", label: "Placements Made" },
  { icon: CheckCircle, value: "15+", label: "Years Experience" }
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
            Partnering with Top Organizations Across the DMV
          </h2>
        </motion.div>

        {/* Animated Logo Carousel */}
        <div className="relative">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Scrolling container - first row */}
          <div className="flex overflow-hidden mb-4">
            <motion.div
              className="flex gap-6 py-4"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                x: {
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear'
                }
              }}
            >
              {[...clients, ...clients].map((client, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-48 h-24 rounded-xl bg-card border border-border/50 flex items-center justify-center px-4 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Buildings size={20} className="text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.industry}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scrolling container - second row (reverse direction) */}
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
              {[...clients.slice().reverse(), ...clients.slice().reverse()].map((client, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-48 h-24 rounded-xl bg-card border border-border/50 flex items-center justify-center px-4 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Buildings size={20} className="text-accent" />
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
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6"
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

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Buildings, 
  Clock, 
  ShieldCheck, 
  Users, 
  ChartLineUp,
  Phone,
  ArrowRight,
  CheckCircle
} from '@phosphor-icons/react'

const benefits = [
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Get qualified candidates within 24-48 hours"
  },
  {
    icon: ShieldCheck,
    title: "Pre-Screened Talent",
    description: "Background checks, references, and skills verified"
  },
  {
    icon: Users,
    title: "Flexible Staffing",
    description: "Temp, temp-to-perm, and direct hire options"
  },
  {
    icon: ChartLineUp,
    title: "Reduce Costs",
    description: "Lower hiring costs and reduce turnover"
  }
]

const services = [
  "Temporary Staffing",
  "Temp-to-Permanent",
  "Direct Hire Placement",
  "Payroll Services",
  "On-Site Management",
  "Volume Staffing"
]

export function EmployerCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      ref={ref}
      className="py-20 lg:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              <Buildings weight="fill" size={16} />
              <span>For Employers</span>
            </motion.div>

            <h2 className="font-heading font-bold text-3xl lg:text-5xl mb-6">
              Need Reliable Staff?
              <br />
              <span className="text-white/80">We've Got You Covered.</span>
            </h2>

            <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
              Partner with Maryland's trusted staffing experts. We provide pre-screened, 
              qualified candidates for your temporary and permanent staffing needs—quickly and reliably.
            </p>

            {/* Services list */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {services.map((service, index) => (
                <motion.div
                  key={service}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <CheckCircle weight="fill" className="text-accent flex-shrink-0" size={18} />
                  <span className="text-sm">{service}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90 shadow-lg"
                  onClick={scrollToContact}
                >
                  Request Staff
                  <ArrowRight className="ml-2" weight="bold" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a href="tel:+13012772141">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Phone className="mr-2" weight="bold" />
                    (301) 277-2141
                  </Button>
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Benefits Cards */}
          <motion.div
            className="grid sm:grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 h-full hover:bg-white/20 transition-colors">
                  <benefit.icon size={32} weight="duotone" className="text-accent mb-4" />
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/70">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom testimonial */}
        <motion.div
          className="mt-16 pt-8 border-t border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <blockquote className="max-w-3xl mx-auto text-center">
            <p className="text-xl italic text-primary-foreground/80 mb-4">
              "Unique Staffing has been our go-to partner for over 5 years. Their candidates are always 
              professional, punctual, and ready to work. They understand our business needs and consistently 
              deliver quality staff."
            </p>
            <footer className="text-sm">
              <strong>— Operations Manager</strong>
              <span className="text-primary-foreground/60">, Commercial Cleaning Company</span>
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  )
}

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Buildings, Users } from "@phosphor-icons/react"

export function TalentSplitSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const navigate = useNavigate()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 lg:p-8 border-border bg-card/90">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary mb-2">For Job Seekers</p>
                    <h3 className="font-heading font-semibold text-2xl text-foreground mb-2">
                      Join our talent pool
                    </h3>
                    <p className="text-muted-foreground">
                      Submit your application and get matched with opportunities that fit your skills.
                    </p>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full lg:w-auto"
                  onClick={() => scrollToSection("apply")}
                >
                  Join our network
                  <ArrowRight className="ml-2" weight="bold" />
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-6 lg:p-8 border-border bg-primary text-primary-foreground">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Buildings size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80 mb-2">For Employers</p>
                    <h3 className="font-heading font-semibold text-2xl text-white mb-2">
                      Partner with Unique Staffing Professionals
                    </h3>
                    <p className="text-white/80">
                      Learn how we onboard and deliver dependable staff for your business.
                    </p>
                  </div>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full lg:w-auto bg-white text-primary hover:bg-white/90"
                  onClick={() => navigate("/employers")}
                >
                  Explore employer services
                  <ArrowRight className="ml-2" weight="bold" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

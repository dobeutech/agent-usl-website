import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Bell, EnvelopeSimple, DeviceMobile, CheckCircle, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

const jobCategories = [
  'Janitorial & Custodial',
  'Human Resources',
  'Retail & Sales',
  'Call Center',
  'Industrial & Manufacturing',
  'Administrative',
  'Warehouse & Logistics',
  'Healthcare Support'
]

export function JobAlerts() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    categories: [] as string[],
    emailAlerts: true,
    smsAlerts: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email) {
      toast.error('Please enter your email address')
      return
    }

    if (formData.categories.length === 0) {
      toast.error('Please select at least one job category')
      return
    }

    setIsSubmitting(true)

    try {
      // Save to newsletter_subscriptions table
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .upsert({
          email: formData.email,
          is_subscribed: true,
          subscription_source: 'job_alerts',
          preferences: {
            categories: formData.categories,
            email_alerts: formData.emailAlerts,
            sms_alerts: formData.smsAlerts,
            phone: formData.phone
          }
        }, {
          onConflict: 'email'
        })

      if (error) throw error

      setIsSuccess(true)
      toast.success('You\'re all set! We\'ll notify you about matching opportunities.')
    } catch (error) {
      console.error('Error subscribing:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle size={48} weight="fill" className="text-primary" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-foreground mb-4">
              You're Subscribed!
            </h3>
            <p className="text-muted-foreground mb-6">
              We'll send you notifications when new jobs matching your interests become available.
              Check your email for a confirmation.
            </p>
            <Button variant="outline" onClick={() => setIsSuccess(false)}>
              Subscribe Another Email
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section 
      ref={ref}
      className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Bell weight="fill" size={16} />
            <span>Never Miss an Opportunity</span>
          </motion.div>
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
            Get Job Alerts Delivered to You
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Be the first to know about new opportunities. We'll notify you when jobs matching your interests become available.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6 lg:p-8 border-border/50 bg-card/70 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alert-email" className="flex items-center gap-2">
                    <EnvelopeSimple size={16} />
                    Email Address *
                  </Label>
                  <Input
                    id="alert-email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-phone" className="flex items-center gap-2">
                    <DeviceMobile size={16} />
                    Phone (for SMS alerts)
                  </Label>
                  <Input
                    id="alert-phone"
                    type="tel"
                    placeholder="(301) 555-1234"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              {/* Job Categories */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Sparkle size={16} />
                  Job Categories You're Interested In *
                </Label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {jobCategories.map((category) => (
                    <motion.div
                      key={category}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <label
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.categories.includes(category)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Checkbox
                          checked={formData.categories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{category}</span>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-3">
                <Label>How would you like to be notified?</Label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.emailAlerts}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, emailAlerts: !!checked }))
                      }
                    />
                    <span className="text-sm">Email Alerts</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.smsAlerts}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, smsAlerts: !!checked }))
                      }
                    />
                    <span className="text-sm">SMS Alerts</span>
                    {formData.smsAlerts && (
                      <span className="text-xs text-muted-foreground">(Msg & data rates may apply)</span>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
                <p className="text-xs text-muted-foreground">
                  By subscribing, you agree to our{' '}
                  <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                  {formData.smsAlerts && (
                    <> and <a href="/privacy/sms" className="text-primary hover:underline">SMS Terms</a></>
                  )}
                </p>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe to Job Alerts'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

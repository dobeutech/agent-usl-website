import { useState, useEffect, useCallback } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useSearchParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export function Unsubscribe() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [preferences, setPreferences] = useState({
    newsletter: false,
    jobNotifications: false,
    smsNotifications: false
  })

  const email = searchParams.get('email')

  useEffect(() => {
    if (email) {
      loadPreferences()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  const loadPreferences = useCallback(async () => {
    if (!email) return

    try {
      const { data } = await supabase
        .from('applicants')
        .select('newsletter_subscribed, job_notifications_enabled, sms_notifications_enabled')
        .eq('email', email)
        .maybeSingle()

      if (data) {
        setPreferences({
          newsletter: data.newsletter_subscribed || false,
          jobNotifications: data.job_notifications_enabled || false,
          smsNotifications: data.sms_notifications_enabled || false
        })
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
  }, [email])

  const handleUnsubscribe = async () => {
    if (!email) {
      toast.error(t('unsubscribe.error'))
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('applicants')
        .update({
          newsletter_subscribed: preferences.newsletter,
          job_notifications_enabled: preferences.jobNotifications,
          sms_notifications_enabled: preferences.smsNotifications,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)

      if (error) throw error

      setIsSuccess(true)
    } catch (error) {
      console.error('Error updating preferences:', error)
      toast.error(t('unsubscribe.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="font-heading font-bold text-2xl text-foreground mb-4">
            {t('unsubscribe.successTitle')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('unsubscribe.successMessage')}
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl text-foreground mb-4">
            {t('unsubscribe.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('unsubscribe.subtitle')}
          </p>
        </div>

        <Card className="p-8">
          {email ? (
            <>
              <p className="text-foreground mb-6">
                {t('unsubscribe.description')}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                  <Checkbox
                    id="newsletter"
                    checked={!preferences.newsletter}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, newsletter: !checked })
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="newsletter" className="text-base font-medium text-foreground cursor-pointer">
                      {t('unsubscribe.newsletter')}
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                  <Checkbox
                    id="jobNotifications"
                    checked={!preferences.jobNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, jobNotifications: !checked })
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="jobNotifications" className="text-base font-medium text-foreground cursor-pointer">
                      {t('unsubscribe.jobNotifications')}
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                  <Checkbox
                    id="smsNotifications"
                    checked={!preferences.smsNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, smsNotifications: !checked })
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="smsNotifications" className="text-base font-medium text-foreground cursor-pointer">
                      {t('unsubscribe.smsNotifications')}
                    </Label>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleUnsubscribe}
                disabled={isSubmitting}
              >
                {isSubmitting ? t('unsubscribe.unsubscribing') : t('unsubscribe.unsubscribeButton')}
              </Button>

              <p className="text-sm text-muted-foreground text-center mt-6">
                {t('unsubscribe.resubscribe')}
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-6">
                Please provide an email address in the URL to manage your preferences.
              </p>
              <Link to="/">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

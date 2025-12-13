import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { useLanguage } from "@/contexts/LanguageContext"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SMSPrivacyPolicy() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/privacy">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Privacy Policy
            </Button>
          </Link>

          <h1 className="font-heading font-bold text-4xl text-foreground mb-4">
            SMS/Text Message Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            {t('privacy.lastUpdated')}: December 13, 2024
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                SMS Communications Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                This SMS Privacy Policy applies to text message communications from Unique Staffing Professionals Inc. ("Company", "we", or "our"). This policy supplements our general Privacy Policy and specifically addresses how we collect, use, and protect information related to SMS/text message communications.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Consent to Receive SMS Messages
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By opting in to receive SMS notifications from Unique Staffing Professionals, you consent to receive text messages including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Job opportunity notifications matching your profile</li>
                <li>Application status updates</li>
                <li>Interview reminders and scheduling information</li>
                <li>Onboarding and employment-related communications</li>
                <li>Company updates and news relevant to your job search</li>
                <li>Promotional messages about our services (with separate consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Message Frequency
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Message frequency varies based on your preferences and activity. You may receive multiple messages per week during active job searches or when there are relevant opportunities that match your profile. Marketing messages are sent no more than 4 times per month unless you opt out.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Message and Data Rates
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Standard message and data rates from your mobile carrier may apply to text messages you receive from us. We are not responsible for any charges incurred from your mobile carrier for receiving our text messages.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Information We Collect via SMS
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you opt in to SMS communications, we collect:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Your mobile phone number</li>
                <li>The date and time you opted in</li>
                <li>Your opt-in source (website form, application, etc.)</li>
                <li>Message delivery and read receipts (when available)</li>
                <li>Your responses to our messages</li>
                <li>Opt-out requests and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                How We Use SMS Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use SMS-related information to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Send you job notifications and updates</li>
                <li>Communicate about your applications and employment status</li>
                <li>Respond to your inquiries</li>
                <li>Improve our communication services</li>
                <li>Analyze message effectiveness and engagement</li>
                <li>Comply with legal requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Sharing of SMS Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may share your phone number and SMS preferences with our SMS service providers for the purpose of delivering messages. We do not sell your phone number for telemarketing purposes. However, we may share your contact information with client employers as part of the staffing process, in accordance with our general Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                How to Opt Out of SMS Communications
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can opt out of SMS communications at any time by:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Reply STOP:</strong> Text "STOP" to any message you receive from us</li>
                <li><strong>Online:</strong> Visit our <Link to="/unsubscribe" className="text-primary hover:underline">unsubscribe page</Link> and update your preferences</li>
                <li><strong>Email:</strong> Contact us at <a href="mailto:omorilla@uniquestaffingprofessionals.com" className="text-primary hover:underline">omorilla@uniquestaffingprofessionals.com</a> with subject "SMS Opt-Out"</li>
                <li><strong>Phone:</strong> Call us at (301) 277-2141 during business hours</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                After opting out, you will receive a confirmation message. Please allow up to 48 hours for your request to be fully processed.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Re-Subscribing to SMS
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you previously opted out and wish to receive SMS notifications again, you can re-subscribe by submitting a new application with SMS consent enabled, visiting our website and updating your preferences, or contacting us directly.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Help and Support
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For help with SMS communications, reply "HELP" to any message or contact our support team at <a href="mailto:omorilla@uniquestaffingprofessionals.com" className="text-primary hover:underline">omorilla@uniquestaffingprofessionals.com</a>.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                TCPA Compliance
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our SMS program complies with the Telephone Consumer Protection Act (TCPA). We only send text messages to individuals who have provided express written consent to receive such messages. We maintain records of all opt-in consents and honor all opt-out requests promptly.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                California Residents
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                California residents have additional rights under the California Consumer Privacy Act (CCPA). You may request to know what personal information we collect about you, request deletion of your personal information, and opt out of the sale of your personal information. These rights apply to information collected via SMS as well. Please see our main <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for details on exercising these rights.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this SMS Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date at the top of this page. Significant changes may be communicated via SMS or email.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about this SMS Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>Unique Staffing Professionals Inc.</p>
                <p>6001 66th Ave, Riverdale, MD 20737</p>
                <p>Email: <a href="mailto:omorilla@uniquestaffingprofessionals.com" className="text-primary hover:underline">omorilla@uniquestaffingprofessionals.com</a></p>
                <p>Phone: (301) 277-2141</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

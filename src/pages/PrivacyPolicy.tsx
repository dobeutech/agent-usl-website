import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { useLanguage } from "@/contexts/LanguageContext"

export function PrivacyPolicy() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading font-bold text-4xl text-foreground mb-4">
            {t('privacy.title')}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            {t('privacy.lastUpdated')}: November 19, 2024
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                {t('privacy.introduction')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Unique Staffing Professionals Inc. ("Company", "we", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information that you provide directly to us, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Personal identification information (name, email address, phone number, address)</li>
                <li>Professional information (resume, work history, skills, references, LinkedIn profile)</li>
                <li>Demographic information</li>
                <li>Any other information you choose to provide</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We automatically collect certain information about your device when you visit our website, including IP address, browser type, operating system, referral URLs, pages viewed, time spent on pages, links clicked, scroll depth, and other browsing behavior. We may also collect information from your Internet Service Provider and third-party data providers to enhance our understanding of your interests and provide better service.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies, web beacons, and similar tracking technologies to collect information about your browsing activities. This includes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Tracking websites you visited before arriving at our site</li>
                <li>Your navigation path on our website</li>
                <li>Time spent on each page and scroll depth</li>
                <li>Mouse movements and click patterns</li>
                <li>Form interactions and completions</li>
                <li>Geographic location based on IP address</li>
                <li>Device fingerprinting and unique identifiers</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We may use third-party analytics services to help us understand website usage and user behavior. These technologies help us improve website functionality, personalize your experience, and analyze trends.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Third-Party Data Sharing and Resale
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may share, sell, or transfer your personal information to third parties for various business purposes, including but not limited to marketing, analytics, recruitment services, and data aggregation. Third parties may include staffing agencies, employers, marketing partners, data brokers, and service providers. By using our services, you consent to such sharing and potential resale of your information. We may receive compensation for sharing your data with third parties.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>To match you with employment opportunities</li>
                <li>To communicate with you about job openings and services</li>
                <li>To improve our website and services</li>
                <li>To analyze user behavior and preferences</li>
                <li>For marketing and promotional purposes</li>
                <li>To comply with legal obligations</li>
                <li>To share with or sell to third-party partners</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Your Rights Under CCPA (California Residents)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you are a California resident, you have the following rights:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Right to Know:</strong> You can request information about the personal data we collect, use, and disclose</li>
                <li><strong>Right to Delete:</strong> You can request deletion of your personal information</li>
                <li><strong>Right to Opt-Out:</strong> You can opt-out of the sale of your personal information</li>
                <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us at <a href="mailto:omorilla@uniquestaffingprofessionals.com" className="text-primary hover:underline">omorilla@uniquestaffingprofessionals.com</a>
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Newsletter and SMS Communications
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you subscribe to our newsletter or opt-in to SMS notifications, we will send you job opportunities, company updates, and promotional materials. You can unsubscribe at any time by clicking the unsubscribe link in emails, replying STOP to SMS messages, or contacting us at <a href="mailto:omorilla@uniquestaffingprofessionals.com" className="text-primary hover:underline">omorilla@uniquestaffingprofessionals.com</a>
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement reasonable security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Children's Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date at the top of this page.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about this Privacy Policy or to exercise your rights, please contact us at:
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

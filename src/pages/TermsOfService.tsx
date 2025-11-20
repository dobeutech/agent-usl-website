import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { useLanguage } from "@/contexts/LanguageContext"

export function TermsOfService() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading font-bold text-4xl text-foreground mb-4">
            {t('terms.title')}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            {t('terms.lastUpdated')}: November 19, 2024
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using the services of Unique Staffing Professionals Inc. ("Company", "we", "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Services Provided
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We provide staffing and recruitment services, connecting job seekers with employers. Our services include but are not limited to job matching, resume submission, interview coordination, and employment placement assistance.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                User Obligations
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By using our services, you agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>Update your information as necessary</li>
                <li>Not impersonate any person or entity</li>
                <li>Not use our services for any illegal or unauthorized purpose</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Data Usage and Third-Party Sharing
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By submitting your information through our website or services, you explicitly consent to the collection, use, storage, and potential resale of your personal and professional data to third parties. This includes but is not limited to employers, staffing agencies, marketing partners, data aggregators, and service providers. We reserve the right to monetize user data through partnerships and data sales. You acknowledge that your information may be used for purposes beyond direct job placement, including marketing analytics, lead generation, and business intelligence.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Website Tracking and Analytics
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We track and analyze user behavior on our website, including pages visited, time spent, referral sources, device information, and interaction patterns. This data may be collected through cookies and similar technologies. We may track websites you visited before arriving at our site and may share this information with third parties for analytical and marketing purposes. By continuing to use our website, you consent to such tracking and data collection.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on our website, including text, graphics, logos, images, and software, is the property of Unique Staffing Professionals Inc. or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, Unique Staffing Professionals Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising from your use of our services. We do not guarantee employment or specific job placements. Our total liability for any claim arising from these terms shall not exceed the amount you paid us for services, if any.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Indemnification
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify, defend, and hold harmless Unique Staffing Professionals Inc., its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of our services, violation of these terms, or infringement of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Disclaimer of Warranties
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted, error-free, or secure. We make no warranties regarding the accuracy, reliability, or completeness of any information provided through our services.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Termination
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your access to our services at any time, without notice, for any reason, including violation of these terms. Upon termination, your right to use our services will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Governing Law and Dispute Resolution
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with the laws of the State of Maryland, without regard to its conflict of law provisions. Any disputes arising from these terms or your use of our services shall be resolved through binding arbitration in Prince George's County, Maryland, in accordance with the rules of the American Arbitration Association. You waive your right to participate in class action lawsuits or class-wide arbitration.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Modifications to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Severability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
                Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions regarding these Terms of Service, please contact us at:
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

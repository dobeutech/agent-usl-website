import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react'
import { verifyEmailToken } from '@/lib/form-utils'
import { supabase } from '@/lib/supabase'
import { isDemoMode, getDemoApplicants } from '@/lib/mockData'

type VerificationStatus = 'verifying' | 'success' | 'error' | 'already_verified'

export function EmailVerification() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<VerificationStatus>('verifying')
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      return
    }

    verifyEmail(token)
  }, [searchParams])

  const verifyEmail = async (token: string) => {
    try {
      // Verify the token (handles both demo and live mode)
      const result = await verifyEmailToken(token)

      if (!result.valid) {
        setStatus('error')
        return
      }

      setEmail(result.email || '')

      // In demo mode, verifyEmailToken already handles everything
      if (isDemoMode()) {
        // Check if the applicant was already verified before this call
        const demoApplicants = getDemoApplicants()
        const applicant = demoApplicants.find(a => a.id === result.applicantId)

        // If we just verified them (token was cleared by verifyEmailToken), show success
        // If they were already verified before, show already_verified
        // Since verifyEmailToken marks them as verified, check if token is now null
        if (applicant && !applicant.email_verification_token && applicant.email_verified) {
          // The token was just cleared, meaning we just verified them
          setStatus('success')
        } else {
          setStatus('success')
        }
        return
      }

      // Live Supabase mode
      if (result.applicantId) {
        const { data: applicant } = await supabase
          .from('applicants')
          .select('email_verified')
          .eq('id', result.applicantId)
          .single()

        if (applicant?.email_verified) {
          setStatus('already_verified')
          return
        }

        // Update applicant as verified
        await supabase
          .from('applicants')
          .update({
            email_verified: true,
            email_verification_token: null,
            token_expiry: null
          })
          .eq('id', result.applicantId)

        // TODO: Trigger admin notification email via Edge Function

        setStatus('success')
      } else {
        setStatus('success')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setStatus('error')
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <>
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="font-heading font-bold text-3xl text-foreground">
                Verifying Your Email
              </h1>
              <p className="text-lg text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </div>
          </>
        )

      case 'success':
        return (
          <>
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="font-heading font-bold text-3xl text-foreground">
                Email Verified Successfully!
              </h1>
              <p className="text-lg text-muted-foreground">
                Thank you for verifying {email}
              </p>
            </div>
            <div className="space-y-4 text-left bg-muted p-6 rounded-lg">
              <h2 className="font-semibold text-lg">What's next?</h2>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Your application is now being reviewed by our team</li>
                <li>We'll contact you within 3-5 business days</li>
                <li>Keep an eye on your email for updates</li>
              </ul>
            </div>
            <Button onClick={() => navigate('/')} className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </>
        )

      case 'already_verified':
        return (
          <>
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-info/20 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-info" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="font-heading font-bold text-3xl text-foreground">
                Already Verified
              </h1>
              <p className="text-lg text-muted-foreground">
                This email address has already been verified.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Your application is being reviewed by our team.
            </p>
            <Button onClick={() => navigate('/')} className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </>
        )

      case 'error':
        return (
          <>
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-destructive/20 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="font-heading font-bold text-3xl text-foreground">
                Verification Failed
              </h1>
              <p className="text-lg text-muted-foreground">
                We couldn't verify your email address.
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>This verification link may have:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Expired (links are valid for 24 hours)</li>
                <li>Already been used</li>
                <li>Been copied incorrectly</li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Please contact us for assistance at{' '}
                <a
                  href="mailto:omorilla@uniquestaffingprofessionals.com"
                  className="text-primary hover:underline"
                >
                  omorilla@uniquestaffingprofessionals.com
                </a>
              </p>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 lg:p-12 text-center space-y-6">
          {renderContent()}
        </Card>
      </div>
    </div>
  )
}

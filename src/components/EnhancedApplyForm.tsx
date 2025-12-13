import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, CheckCircle, X, AlertCircle, FileText } from "lucide-react"
import { toast } from "sonner"
import { supabase, ApplicantInsert } from "@/lib/supabase"
import { useLanguage } from "@/contexts/LanguageContext"
import {
  normalizePhone,
  checkPhoneDuplicate,
  validateUrl,
  validateLinkedInUrl,
  validateFileType,
  validateFileSize,
  uploadFile,
  generateVerificationToken,
  getTokenExpiry,
  createEmailVerificationLog
} from "@/lib/form-utils"

interface EnhancedApplyFormProps {
  onSuccess?: () => void
}

const POSITIONS = [
  'Janitorial',
  'Human Resources',
  'Retail & Sales',
  'Call Center & Customer Service',
  'Industrial & Manufacturing',
  'Administrative',
  'Warehouse & Logistics',
  'Healthcare Support',
  'IT & Technology',
  'Other'
]

// DOCUMENT_TYPES removed - not currently used in the form

export function EnhancedApplyForm({ onSuccess }: EnhancedApplyFormProps) {
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    email_confirmed: "",
    phone: "",
    positions: [] as string[],
    experience_years: "",
    cover_letter_text: "",
    job_posting_url: "",
    linkedin_url: "",
    portfolio_url: "",
    newsletter_subscribed: false,
    job_notifications_enabled: true,
    sms_notifications_enabled: false
  })

  // Capture UTM parameters and referrer on mount
  const [trackingData, setTrackingData] = useState<{
    utm_source: string | null
    utm_medium: string | null
    utm_campaign: string | null
    utm_term: string | null
    utm_content: string | null
    referrer: string
    landing_page: string
  } | null>(null)

  // Capture UTM parameters and referrer once when the component initializes
  const [trackingData] = useState<{
    utm_source: string | null
    utm_medium: string | null
    utm_campaign: string | null
    utm_term: string | null
    utm_content: string | null
    referrer: string
    landing_page: string
  } | null>(() => {
    if (typeof window === 'undefined') {
      return null
    }

    const params = new URLSearchParams(window.location.search)
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_term: params.get('utm_term'),
      utm_content: params.get('utm_content'),
      referrer: document.referrer || '',
      landing_page: window.location.pathname
    }
  })

  const [resume, setResume] = useState<File | null>(null)
  const [additionalDocs, setAdditionalDocs] = useState<Array<{
    file: File
    type: string
  }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [duplicateInfo, setDuplicateInfo] = useState<{ id: string; full_name: string; email: string; created_at: string; email_verified: boolean } | null>(null)

  const resumeInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: string | string[]): string => {
    // Handle array values (for positions)
    if (name === 'positions') {
      if (Array.isArray(value)) {
        return value.length === 0 ? 'Select at least one position' : ''
      }
      return 'Invalid value type for positions'
    }

    // All other fields expect string values
    if (Array.isArray(value)) {
      return 'Invalid value type'
    }

    const stringValue = value as string

    switch (name) {
      case 'full_name':
        return stringValue.trim().length < 2 ? 'Name must be at least 2 characters' : ''
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue) ? 'Invalid email address' : ''
      case 'email_confirmed':
        return stringValue !== formData.email ? 'Emails do not match' : ''
      case 'phone':
        return stringValue.replace(/[^0-9]/g, '').length < 10 ? 'Phone must be at least 10 digits' : ''
      case 'experience_years':
        return stringValue === '' ? 'Please select experience level' : ''
      case 'job_posting_url':
        return stringValue && !validateUrl(stringValue) ? 'Invalid URL format' : ''
      case 'linkedin_url':
        return stringValue && !validateLinkedInUrl(stringValue) ? 'Invalid LinkedIn URL' : ''
      case 'portfolio_url':
        return stringValue && !validateUrl(stringValue) ? 'Invalid URL format' : ''
      default:
        return ''
    }
  }

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handlePositionToggle = (position: string) => {
    const newPositions = formData.positions.includes(position)
      ? formData.positions.filter(p => p !== position)
      : [...formData.positions, position]

    handleInputChange('positions', newPositions)
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!validateFileType(file, allowedTypes)) {
      toast.error("Invalid file type. Please upload PDF, DOC, or DOCX.")
      return
    }

    if (!validateFileSize(file, 5)) {
      toast.error("File too large. Maximum size is 5MB.")
      return
    }

    setResume(file)
    toast.success("Resume attached successfully")
  }

  const handleDocumentAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ]

    if (!validateFileType(file, allowedTypes)) {
      toast.error("Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG.")
      return
    }

    if (!validateFileSize(file, 10)) {
      toast.error("File too large. Maximum size is 10MB.")
      return
    }

    setAdditionalDocs(prev => [...prev, { file, type: 'other' }])
    toast.success("Document added")

    if (docInputRef.current) {
      docInputRef.current.value = ''
    }
  }

  const removeDocument = (index: number) => {
    setAdditionalDocs(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    newErrors.full_name = validateField('full_name', formData.full_name)
    newErrors.email = validateField('email', formData.email)
    newErrors.email_confirmed = validateField('email_confirmed', formData.email_confirmed)
    newErrors.phone = validateField('phone', formData.phone)
    newErrors.positions = validateField('positions', formData.positions)
    newErrors.experience_years = validateField('experience_years', formData.experience_years)
    newErrors.job_posting_url = validateField('job_posting_url', formData.job_posting_url)
    newErrors.linkedin_url = validateField('linkedin_url', formData.linkedin_url)
    newErrors.portfolio_url = validateField('portfolio_url', formData.portfolio_url)

    if (!resume) {
      newErrors.resume = 'Resume is required'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix all errors before submitting")
      return
    }

    setIsSubmitting(true)

    try {
      // Check for duplicate phone number
      const duplicateCheck = await checkPhoneDuplicate(formData.phone)

      if (duplicateCheck.exists) {
        setDuplicateInfo(duplicateCheck.applicant)
        setShowDuplicateDialog(true)
        setIsSubmitting(false)
        return
      }

      // Generate email verification token
      const verificationToken = generateVerificationToken()
      const tokenExpiry = getTokenExpiry()

      // Upload resume
      let resumeUrl: string | null = null
      let resumeFilename: string | null = null

      if (resume) {
        const uploadResult = await uploadFile(resume, 'resumes')
        if (!uploadResult) {
          toast.error("Failed to upload resume. Please try again.")
          setIsSubmitting(false)
          return
        }
        resumeUrl = uploadResult.url
        resumeFilename = uploadResult.filename
      }

      const hasNavigator = typeof navigator !== 'undefined'

      // Build tracking metadata
      const trackingMetadata = trackingData ? {
        utm_source: trackingData.utm_source,
        utm_medium: trackingData.utm_medium,
        utm_campaign: trackingData.utm_campaign,
        utm_term: trackingData.utm_term,
        utm_content: trackingData.utm_content,
        referrer: trackingData.referrer,
        landing_page: trackingData.landing_page,
        submitted_at: new Date().toISOString(),
        user_agent: hasNavigator ? navigator.userAgent : '',
        submission_language: language
      } : null

      // Get browser language for analytics
      const browserLanguage = hasNavigator
        ? (navigator.language || navigator.languages?.[0] || 'en')
        : 'en'

      // Create initial applicant record (unverified)
      type CommunicationPreferences = {
        utm_source: string | null
        utm_medium: string | null
        utm_campaign: string | null
        utm_term: string | null
        utm_content: string | null
        referrer: string
        landing_page: string
        submitted_at: string
        user_agent: string
        submission_language: string
      }

      const applicantData: ApplicantInsert & {
        newsletter_subscribed?: boolean
        job_notifications_enabled?: boolean
        sms_notifications_enabled?: boolean
        communication_preferences?: CommunicationPreferences | null
        subscription_source?: string
      } = {
        full_name: formData.full_name,
        email: formData.email,
        email_confirmed: formData.email_confirmed,
        email_verified: false,
        email_verification_token: verificationToken,
        token_expiry: tokenExpiry,
        phone: formData.phone,
        phone_normalized: normalizePhone(formData.phone),
        positions_interested: formData.positions,
        experience_years: parseInt(formData.experience_years),
        resume_url: resumeUrl,
        resume_filename: resumeFilename,
        cover_letter: formData.cover_letter_text || null,
        job_posting_url: formData.job_posting_url || null,
        linkedin_url: formData.linkedin_url || null,
        portfolio_url: formData.portfolio_url || null,
        status: 'new',
        // Marketing preferences
        newsletter_subscribed: formData.newsletter_subscribed,
        job_notifications_enabled: formData.job_notifications_enabled,
        sms_notifications_enabled: formData.sms_notifications_enabled,
        // Tracking data
        communication_preferences: trackingMetadata,
        subscription_source: trackingData?.utm_source || trackingData?.referrer || 'direct',
        // Language tracking
        preferred_language: language,
        browser_language: browserLanguage
      }

      const { data: applicant, error: applicantError } = await supabase
        .from('applicants')
        .insert([applicantData])
        .select()
        .single()

      if (applicantError) {
        throw applicantError
      }

      // Upload additional documents
      if (additionalDocs.length > 0) {
        for (const doc of additionalDocs) {
          const uploadResult = await uploadFile(doc.file, 'documents', applicant.id)
          if (uploadResult) {
            await supabase
              .from('applicant_documents')
              .insert([{
                applicant_id: applicant.id,
                document_type: doc.type,
                document_url: uploadResult.url,
                document_filename: uploadResult.filename,
                file_size: doc.file.size,
                mime_type: doc.file.type
              }])
          }
        }
      }

      // Create verification log
      await createEmailVerificationLog(formData.email, verificationToken, applicant.id)

      // TODO: Call edge function to send verification email

      toast.success("Application received! Please check your email to verify.", {
        description: "Check your inbox for a verification link.",
        duration: 5000
      })

      // Reset form
      setFormData({
        full_name: "",
        email: "",
        email_confirmed: "",
        phone: "",
        positions: [],
        experience_years: "",
        cover_letter_text: "",
        job_posting_url: "",
        linkedin_url: "",
        portfolio_url: "",
        newsletter_subscribed: false,
        job_notifications_enabled: true,
        sms_notifications_enabled: false
      })
      setResume(null)
      setAdditionalDocs([])
      setErrors({})

      if (resumeInputRef.current) resumeInputRef.current.value = ""
      if (docInputRef.current) docInputRef.current.value = ""

      if (onSuccess) onSuccess()

    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error("Failed to submit application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section id="apply" className="py-16 lg:py-24 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
              Join Our Talent Network
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Submit your application and let us match you with the perfect opportunity
            </p>
          </div>

          <Card className="p-6 lg:p-8 border-border bg-card">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="font-heading font-semibold text-xl text-foreground">
                  {t('applyForm.personalInfo')}
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="full_name">{t('applyForm.fullName')} *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="John Doe"
                    className={errors.full_name ? 'border-destructive' : ''}
                  />
                  {errors.full_name && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.full_name}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('applyForm.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email_confirmed">{t('applyForm.emailConfirm')} *</Label>
                    <Input
                      id="email_confirmed"
                      type="email"
                      value={formData.email_confirmed}
                      onChange={(e) => handleInputChange('email_confirmed', e.target.value)}
                      placeholder="john@example.com"
                      className={errors.email_confirmed ? 'border-destructive' : ''}
                    />
                    {errors.email_confirmed && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email_confirmed}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('applyForm.phone')} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <h3 className="font-heading font-semibold text-xl text-foreground">
                  {t('applyForm.professionalInfo')}
                </h3>

                <div className="space-y-3">
                  <Label>{t('applyForm.positionsLabel')} * {t('applyForm.selectAllApply')}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {POSITIONS.map((position) => (
                      <div key={position} className="flex items-center space-x-2">
                        <Checkbox
                          id={`position-${position}`}
                          checked={formData.positions.includes(position)}
                          onCheckedChange={() => handlePositionToggle(position)}
                        />
                        <label
                          htmlFor={`position-${position}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {position}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.positions && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.positions}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_years">{t('applyForm.experience')} *</Label>
                  <select
                    id="experience_years"
                    value={formData.experience_years}
                    onChange={(e) => handleInputChange('experience_years', e.target.value)}
                    className={`flex h-10 w-full rounded-md border ${errors.experience_years ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                  >
                    <option value="">Select years of experience</option>
                    <option value="0">Less than 1 year</option>
                    <option value="1">1-2 years</option>
                    <option value="3">3-5 years</option>
                    <option value="6">6-10 years</option>
                    <option value="11">10+ years</option>
                  </select>
                  {errors.experience_years && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.experience_years}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">{t('applyForm.resume')} *</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      ref={resumeInputRef}
                      id="resume"
                      type="file"
                      onChange={handleResumeChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => resumeInputRef.current?.click()}
                      className="w-full sm:w-auto"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {resume ? t('applyForm.changeResume') : t('applyForm.uploadResume')}
                    </Button>
                    {resume && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="truncate max-w-[200px]">{resume.name}</span>
                      </div>
                    )}
                  </div>
                  {errors.resume && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.resume}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover_letter_text">{t('applyForm.coverLetter')} (Optional)</Label>
                  <Textarea
                    id="cover_letter_text"
                    value={formData.cover_letter_text}
                    onChange={(e) => handleInputChange('cover_letter_text', e.target.value)}
                    rows={6}
                    placeholder="Tell us about yourself and why you're interested in joining our talent network..."
                  />
                </div>
              </div>

              {/* Additional Documents */}
              <div className="space-y-6">
                <h3 className="font-heading font-semibold text-xl text-foreground">
                  Additional Documents (Optional)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload reference letters, certificates, or other supporting documents
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      ref={docInputRef}
                      type="file"
                      onChange={handleDocumentAdd}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => docInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Add Document
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
                    </p>
                  </div>

                  {additionalDocs.length > 0 && (
                    <div className="space-y-2">
                      {additionalDocs.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate max-w-[300px]">{doc.file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(doc.file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Optional URLs */}
              <div className="space-y-6">
                <h3 className="font-heading font-semibold text-xl text-foreground">
                  Links (Optional)
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="job_posting_url">{t('applyForm.jobPostingUrlOptional')}</Label>
                    <Input
                      id="job_posting_url"
                      type="url"
                      value={formData.job_posting_url}
                      onChange={(e) => handleInputChange('job_posting_url', e.target.value)}
                      placeholder="https://example.com/jobs/123"
                      className={errors.job_posting_url ? 'border-destructive' : ''}
                    />
                    {errors.job_posting_url && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.job_posting_url}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Link to a specific job you're interested in
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">{t('applyForm.linkedinProfileOptional')}</Label>
                    <Input
                      id="linkedin_url"
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className={errors.linkedin_url ? 'border-destructive' : ''}
                    />
                    {errors.linkedin_url && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.linkedin_url}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio_url">{t('applyForm.portfolioSiteOptional')}</Label>
                    <Input
                      id="portfolio_url"
                      type="url"
                      value={formData.portfolio_url}
                      onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                      placeholder="https://your-portfolio.com"
                      className={errors.portfolio_url ? 'border-destructive' : ''}
                    />
                    {errors.portfolio_url && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.portfolio_url}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Link to CareerBuilder, Indeed, or personal portfolio
                    </p>
                  </div>
                </div>
              </div>

              {/* Communication Preferences */}
              <div className="space-y-6">
                <h3 className="font-heading font-semibold text-xl text-foreground">
                  Communication Preferences
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose how you'd like us to contact you about job opportunities
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                    <Checkbox
                      id="job_notifications"
                      checked={formData.job_notifications_enabled}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, job_notifications_enabled: !!checked })
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="job_notifications" className="text-base font-medium text-foreground cursor-pointer">
                        Job Opportunity Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Receive email notifications about job openings that match your profile
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                    <Checkbox
                      id="newsletter"
                      checked={formData.newsletter_subscribed}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, newsletter_subscribed: !!checked })
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="newsletter" className="text-base font-medium text-foreground cursor-pointer">
                        Newsletter & Company Updates
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Receive our newsletter with career tips, industry news, and company updates
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                    <Checkbox
                      id="sms_notifications"
                      checked={formData.sms_notifications_enabled}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, sms_notifications_enabled: !!checked })
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="sms_notifications" className="text-base font-medium text-foreground cursor-pointer">
                        SMS/Text Message Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Receive text messages about urgent job opportunities and application updates.
                        Message and data rates may apply.{' '}
                        <a href="/privacy/sms" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                          View SMS Privacy Policy
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Verification Notice */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  After submitting, you'll receive a verification email. Your application will be
                  reviewed once you verify your email address.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </Card>
        </div>
      </section>

      {/* Duplicate Phone Dialog */}
      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Already Exists</DialogTitle>
            <DialogDescription>
              We found an existing application with this phone number.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {duplicateInfo && (
              <div className="p-4 bg-muted rounded-md space-y-2">
                <p className="text-sm">
                  <strong>Name:</strong> {duplicateInfo.full_name}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {duplicateInfo.email}
                </p>
                <p className="text-sm">
                  <strong>Submitted:</strong>{' '}
                  {new Date(duplicateInfo.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <strong>Email Verified:</strong>{' '}
                  {duplicateInfo.email_verified ? 'Yes' : 'No'}
                </p>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              If you need to update your application or have questions, please contact us at{' '}
              <a
                href="mailto:omorilla@uniquestaffingprofessionals.com"
                className="text-primary hover:underline"
              >
                omorilla@uniquestaffingprofessionals.com
              </a>
            </p>
            <Button onClick={() => setShowDuplicateDialog(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

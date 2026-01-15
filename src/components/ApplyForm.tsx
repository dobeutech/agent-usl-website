import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CheckCircle } from "@phosphor-icons/react"
import { toast } from "sonner"
import { supabase, ApplicantInsert } from "@/lib/supabase"
import { useLanguage } from "@/contexts/LanguageContext"

interface ApplyFormProps {
  onSuccess?: () => void
}

export function ApplyForm({ onSuccess }: ApplyFormProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    position_interested: "",
    experience_years: "",
    cover_letter: ""
  })
  const [resume, setResume] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload a PDF or Word document.")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large. Please upload a file smaller than 5MB.")
        return
      }

      setResume(file)
      toast.success("Resume attached successfully")
    }
  }

  const uploadResume = async (file: File): Promise<{ url: string; filename: string } | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Return path instead of public URL
      return { url: filePath, filename: file.name }
    } catch (error) {
      console.error('Error uploading resume:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let resumeUrl: string | null = null
      let resumeFilename: string | null = null

      // Upload resume if provided
      if (resume) {
        const uploadResult = await uploadResume(resume)
        if (!uploadResult) {
          toast.error("Failed to upload resume. Please try again.")
          setIsSubmitting(false)
          return
        }
        resumeUrl = uploadResult.url
        resumeFilename = uploadResult.filename
      }

      // Insert applicant data
      const applicantData: ApplicantInsert = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        position_interested: formData.position_interested,
        experience_years: parseInt(formData.experience_years),
        cover_letter: formData.cover_letter || null,
        resume_url: resumeUrl,
        resume_filename: resumeFilename,
        status: 'new'
      }

      const { error } = await supabase
        .from('applicants')
        .insert([applicantData])

      if (error) {
        throw error
      }

      toast.success("Application submitted successfully!", {
        description: "We'll review your application and get back to you soon."
      })

      // Reset form
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        position_interested: "",
        experience_years: "",
        cover_letter: ""
      })
      setResume(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error("Failed to submit application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="apply" className="py-16 lg:py-24 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
            {t('applyForm.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('applyForm.subtitle')}
          </p>
        </div>

        <Card className="p-6 lg:p-8 border-border bg-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="font-heading font-semibold text-xl text-foreground">{t('applyForm.personalInfo')}</h3>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">{t('applyForm.fullName')} *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('applyForm.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('applyForm.phone')} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6">
              <h3 className="font-heading font-semibold text-xl text-foreground">{t('applyForm.professionalInfo')}</h3>

              <div className="space-y-2">
                <Label htmlFor="position_interested">{t('applyForm.position')} *</Label>
                <Select
                  value={formData.position_interested}
                  onValueChange={(value) => setFormData({ ...formData, position_interested: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('applyForm.selectPosition')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Janitorial">{t('services.janitorial.title')}</SelectItem>
                    <SelectItem value="Human Resources">{t('services.humanResources.title')}</SelectItem>
                    <SelectItem value="Retail & Sales">{t('services.retailSales.title')}</SelectItem>
                    <SelectItem value="Call Center & Customer Service">{t('services.callCenter.title')}</SelectItem>
                    <SelectItem value="Industrial & Manufacturing">{t('services.industrial.title')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_years">{t('applyForm.experience')} *</Label>
                <Select
                  value={formData.experience_years}
                  onValueChange={(value) => setFormData({ ...formData, experience_years: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('applyForm.selectExperience')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{t('applyForm.lessThan1Year')}</SelectItem>
                    <SelectItem value="1">{t('applyForm.years1to2')}</SelectItem>
                    <SelectItem value="3">{t('applyForm.years3to5')}</SelectItem>
                    <SelectItem value="6">{t('applyForm.years6to10')}</SelectItem>
                    <SelectItem value="11">{t('applyForm.years10plus')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">{t('applyForm.resume')} *</Label>
                <div className="flex items-center gap-4">
                  <Input
                    ref={fileInputRef}
                    id="resume"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto"
                  >
                    <Upload size={20} className="mr-2" />
                    {resume ? t('applyForm.changeResume') : t('applyForm.uploadResume')}
                  </Button>
                  {resume && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle size={16} className="text-primary" weight="fill" />
                      <span className="truncate max-w-[200px]">{resume.name}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('applyForm.acceptedFormats')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_letter">{t('applyForm.coverLetter')}</Label>
                <Textarea
                  id="cover_letter"
                  value={formData.cover_letter}
                  onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                  rows={6}
                  placeholder={t('contact.messagePlaceholder')}
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting || !resume}
            >
              {isSubmitting ? t('applyForm.submitting') : t('applyForm.submit')}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              {t('applyForm.privacyNotice')}
            </p>
          </form>
        </Card>
      </div>
    </section>
  )
}

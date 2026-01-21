import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Suspense, lazy } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import { BusinessInfoProvider } from "@/contexts/BusinessInfoContext"
import { ThemeProvider } from "@/contexts/ThemeProvider"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Toaster } from "@/components/ui/sonner"
import { CookieConsent } from "@/components/CookieConsent"
import { AccessibilityControls } from "@/components/AccessibilityControls"

// Lazy load pages for code splitting
const Home = lazy(() => import("@/pages/Home").then(m => ({ default: m.Home })))
const Employers = lazy(() => import("@/pages/Employers").then(m => ({ default: m.Employers })))
const Forms = lazy(() => import("@/pages/Forms").then(m => ({ default: m.Forms })))
const ServiceAreaPage = lazy(() => import("@/pages/ServiceAreaPage").then(m => ({ default: m.ServiceAreaPage })))
const AdminLogin = lazy(() => import("@/pages/AdminLogin").then(m => ({ default: m.AdminLogin })))
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })))
const ApplicationConfirmation = lazy(() => import("@/pages/ApplicationConfirmation").then(m => ({ default: m.ApplicationConfirmation })))
const EmailVerification = lazy(() => import("@/pages/EmailVerification").then(m => ({ default: m.EmailVerification })))
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })))
const SMSPrivacyPolicy = lazy(() => import("@/pages/SMSPrivacyPolicy").then(m => ({ default: m.SMSPrivacyPolicy })))
const TermsOfService = lazy(() => import("@/pages/TermsOfService").then(m => ({ default: m.TermsOfService })))
const Unsubscribe = lazy(() => import("@/pages/Unsubscribe").then(m => ({ default: m.Unsubscribe })))
const OpenAPIDocs = lazy(() => import("@/pages/OpenAPIDocs").then(m => ({ default: m.OpenAPIDocs })))

// Loading spinner component for Suspense fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-spin" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BusinessInfoProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/employers" element={<Employers />} />
                  <Route path="/forms" element={<Forms />} />
                  <Route path="/service-area/:city" element={<ServiceAreaPage />} />
                  <Route path="/application-confirmation" element={<ApplicationConfirmation />} />
                  <Route path="/verify-email" element={<EmailVerification />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/privacy/sms" element={<SMSPrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/tos" element={<Navigate to="/terms" replace />} />
                  <Route path="/unsubscribe" element={<Unsubscribe />} />
                  <Route path="/openapi/docs" element={<OpenAPIDocs />} />
                  <Route path="/developers/api/docs" element={<OpenAPIDocs />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
              <Toaster />
              <CookieConsent />
              <AccessibilityControls />
            </Router>
          </BusinessInfoProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App

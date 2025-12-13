import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { BusinessInfoProvider } from "@/contexts/BusinessInfoContext"
import { ThemeProvider } from "@/contexts/ThemeProvider"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Home } from "@/pages/Home"
import { ServiceAreaPage } from "@/pages/ServiceAreaPage"
import { AdminLogin } from "@/pages/AdminLogin"
import { AdminDashboard } from "@/pages/AdminDashboard"
import { ApplicationConfirmation } from "@/pages/ApplicationConfirmation"
import { EmailVerification } from "@/pages/EmailVerification"
import { PrivacyPolicy } from "@/pages/PrivacyPolicy"
import { SMSPrivacyPolicy } from "@/pages/SMSPrivacyPolicy"
import { TermsOfService } from "@/pages/TermsOfService"
import { Unsubscribe } from "@/pages/Unsubscribe"
import { OpenAPIDocs } from "@/pages/OpenAPIDocs"
import { Toaster } from "@/components/ui/sonner"
import { CookieConsent } from "@/components/CookieConsent"
import { AccessibilityControls } from "@/components/AccessibilityControls"

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BusinessInfoProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
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

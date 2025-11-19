import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { BusinessInfoProvider } from "@/contexts/BusinessInfoContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Home } from "@/pages/Home"
import { ServiceAreaPage } from "@/pages/ServiceAreaPage"
import { AdminLogin } from "@/pages/AdminLogin"
import { AdminDashboard } from "@/pages/AdminDashboard"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <AuthProvider>
      <BusinessInfoProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/service-area/:city" element={<ServiceAreaPage />} />
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
        </Router>
      </BusinessInfoProvider>
    </AuthProvider>
  )
}

export default App

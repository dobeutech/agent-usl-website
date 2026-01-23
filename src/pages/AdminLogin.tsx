import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { LockKey, Info } from "@phosphor-icons/react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { isDemoMode } from "@/lib/mockData"

export function AdminLogin() {
  const navigate = useNavigate()
  const { signIn, isDemo } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const showDemoMode = isDemo || isDemoMode()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        toast.error("Login failed", {
          description: showDemoMode
            ? "Use demo@uniquestaffing.com / demo123"
            : "Invalid email or password. Please try again."
        })
      } else {
        toast.success("Login successful!")
        navigate("/admin/dashboard")
      }
    } catch {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail("demo@uniquestaffing.com")
    setPassword("demo123")
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 px-4">
      <Card className="w-full max-w-md p-8 border-border bg-card shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <LockKey size={32} className="text-primary" weight="duotone" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
            Admin Portal
          </h1>
          <p className="text-muted-foreground">
            Sign in to manage applicants
          </p>
        </div>

        {/* Demo credentials section - always visible for testing */}
        <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-primary mb-1">Demo Access Available</p>
              <p className="text-muted-foreground mb-2">
                Click below to auto-fill demo credentials and explore the admin dashboard.
              </p>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={fillDemoCredentials}
                className="text-xs"
                data-testid="fill-demo-credentials"
              >
                Fill Demo Credentials
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={showDemoMode ? "demo@uniquestaffing.com" : "admin@uniquestaffing.com"}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={showDemoMode ? "demo123" : "••••••••"}
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to website
          </Button>
        </div>
      </Card>
    </main>
  )
}

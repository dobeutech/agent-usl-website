import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { LockKey } from "@phosphor-icons/react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

export function AdminLogin() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        toast.error("Login failed", {
          description: "Invalid email or password. Please try again."
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 px-4">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@uniquestaffing.com"
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
              placeholder="••••••••"
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
    </div>
  )
}

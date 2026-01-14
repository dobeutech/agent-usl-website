const fs = require('fs');
const path = require('path');

const authContextContent = `import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { isDemoMode } from '@/lib/mockData'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isDemo: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo user for testing when Supabase is not configured
const DEMO_USER: User = {
  id: 'demo-user-id',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'demo@uniquestaffing.com',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: { provider: 'demo', providers: ['demo'] },
  user_metadata: { name: 'Demo Admin' },
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

const DEMO_SESSION: Session = {
  access_token: 'demo-access-token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: 'demo-refresh-token',
  user: DEMO_USER
}

// Demo credentials for testing
const DEMO_EMAIL = 'demo@uniquestaffing.com'
const DEMO_PASSWORD = 'demo123'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const isDemo = isDemoMode()

  useEffect(() => {
    if (isDemo) {
      // In demo mode, check localStorage for demo session
      const demoLoggedIn = localStorage.getItem('demo_logged_in')
      if (demoLoggedIn === 'true') {
        setSession(DEMO_SESSION)
        setUser(DEMO_USER)
      }
      setLoading(false)
      return
    }

    // Real Supabase auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [isDemo])

  const signIn = async (email: string, password: string) => {
    if (isDemo) {
      // Demo mode login
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        localStorage.setItem('demo_logged_in', 'true')
        setSession(DEMO_SESSION)
        setUser(DEMO_USER)
        return { error: null }
      } else {
        return { error: new Error('Invalid demo credentials. Use demo@uniquestaffing.com / demo123') }
      }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    if (isDemo) {
      localStorage.removeItem('demo_logged_in')
      setSession(null)
      setUser(null)
      return
    }
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    isDemo,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
`;

const targetPath = path.resolve(__dirname, '..', 'src', 'contexts', 'AuthContext.tsx');
fs.writeFileSync(targetPath, authContextContent);
console.log('Updated AuthContext.tsx at:', targetPath);

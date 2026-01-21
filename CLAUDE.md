# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Unique Staffing Professionals Inc.** - A production-ready staffing agency website with integrated applicant tracking system (ATS), admin dashboard, and comprehensive REST API. Serves Maryland, Washington D.C., and Northern Virginia (DMV region) specializing in temporary, permanent, and contract staffing.

## Commands

```bash
# Development
npm install --legacy-peer-deps  # Install dependencies (required flag for React 19)
npm run dev                      # Start dev server (http://localhost:5173)
npm run build                    # Production build (TypeScript + Vite)
npm run preview                  # Preview production build locally
npm run lint                     # Run ESLint
npx tsc --noEmit                 # Type check only (no build)

# Deployment
npx netlify login                # Authenticate with Netlify
npx netlify deploy --prod        # Deploy to production
npx netlify deploy               # Deploy preview

# Utilities
npm run kill                     # Kill process on port 5000 (legacy)
npm run optimize                 # Vite dependency optimization
```

**Important**: Always use `--legacy-peer-deps` flag when installing packages due to React 19 peer dependency requirements.

## Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript 5.7 + Vite 6
- **Styling**: Tailwind CSS 4 + shadcn/ui (Radix UI primitives)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Forms**: React Hook Form + Zod validation
- **i18n**: Custom LanguageContext (en/es/fr)
- **Animations**: Framer Motion
- **Icons**: Phosphor Icons
- **State**: React Context API (no Redux/Zustand)
- **Deployment**: Netlify with GitHub Actions CI/CD

### Provider Hierarchy (Important for Context Usage)

```
App.tsx
  └── ThemeProvider (next-themes) - Dark/light mode
      └── LanguageProvider (custom i18n) - English/Spanish/French
          └── AuthProvider (Supabase) - Authentication state
              └── BusinessInfoProvider - SEO/business data
                  └── Router (react-router-dom)
```

**Key Pattern**: When adding new features that need global state, use the existing providers or create new context providers following this hierarchy. Avoid prop drilling beyond 2-3 levels.

### Directory Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives - DO NOT MODIFY MANUALLY
│   ├── admin/           # Admin dashboard components
│   │   ├── ApplicantTable.tsx        # Main applicants table
│   │   ├── ApplicantFilters.tsx      # Search/filter/sort controls
│   │   ├── ApplicantDetailDialog.tsx # Detailed applicant view
│   │   ├── ApplicantStats.tsx        # Dashboard statistics
│   │   └── AnalyticsDashboard.tsx    # Visitor analytics
│   ├── seo/             # SEO components (SEOHead, StructuredData)
│   ├── AccessibilityControls.tsx
│   ├── CookieConsent.tsx
│   ├── EnhancedApplyForm.tsx         # Public application form
│   └── Navigation.tsx                # Main navbar
├── contexts/            # Global state management
│   ├── AuthContext.tsx               # Supabase authentication
│   ├── LanguageContext.tsx           # i18n state and helpers
│   ├── ThemeProvider.tsx             # Theme switching
│   └── BusinessInfoContext.tsx       # SEO/business data
├── pages/               # Route components (11 pages)
│   ├── Home.tsx                      # Public homepage
│   ├── AdminLogin.tsx                # Admin auth
│   ├── AdminDashboard.tsx            # Admin panel
│   ├── OpenAPIDocs.tsx               # API documentation (Swagger UI)
│   ├── PrivacyPolicy.tsx
│   ├── SMSPrivacyPolicy.tsx
│   ├── TermsOfService.tsx
│   ├── EmailVerification.tsx
│   ├── ApplicationConfirmation.tsx
│   ├── Unsubscribe.tsx
│   └── ServiceAreaPage.tsx
├── lib/
│   ├── supabase.ts      # Supabase client + database types
│   ├── analytics.ts     # UTM tracking + visitor analytics
│   ├── form-utils.ts    # Form validation helpers
│   ├── i18n.ts          # Translation utilities
│   ├── mockData.ts      # Development mock data
│   └── utils.ts         # General utilities (cn() for class names)
├── locales/
│   └── translations.ts  # i18n dictionaries (en/es/fr)
├── App.tsx              # Main app + routing setup
└── main.tsx             # Entry point

supabase/
├── migrations/          # 15 database migration files (run in order)
└── functions/           # Supabase Edge Functions
    ├── api/             # REST API endpoints
    ├── send-verification-email/
    └── send-admin-notification/

.github/
└── workflows/           # GitHub Actions CI/CD
    ├── ci.yml           # Build, lint, type check
    ├── security-scan.yml
    ├── ai-code-review.yml
    └── deploy-production.yml
```

### Path Aliases

Import from `src/` using the `@/` alias (configured in vite.config.ts):

```typescript
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/LanguageContext'
```

## Key Patterns and Conventions

### Internationalization (i18n)

```typescript
// In components:
const { t, language, setLanguage } = useLanguage()

// Nested key lookup:
const text = t('hero.title')  // Returns "Connecting Talent with Opportunity"

// Language detection priority:
// 1. localStorage ('app-language')
// 2. Browser language (navigator.language)
// 3. DEFAULT_LANGUAGE ('en')
```

### Theme Management

- Uses `next-themes` library with `[data-appearance="dark"]` selector
- CSS variables in OKLCH color space for smooth interpolation
- Theme persists to localStorage
- System theme detection supported

```typescript
import { useTheme } from 'next-themes'
const { theme, setTheme } = useTheme() // 'light' | 'dark' | 'system'
```

### Form Validation Pattern

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^\+1\d{10}$/)
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
})
```

### Animations with Framer Motion

Use scroll-triggered animations sparingly for professional feel:

```typescript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  {content}
</motion.div>
```

### Supabase Integration

```typescript
import { supabase } from '@/lib/supabase'

// Auth
const { data, error } = await supabase.auth.signIn({ email, password })

// Queries
const { data: applicants } = await supabase
  .from('applicants')
  .select('*')
  .eq('status', 'new')
  .order('created_at', { ascending: false })

// File upload
const { data, error } = await supabase.storage
  .from('resumes')
  .upload(`${userId}/${filename}`, file)
```

### Protected Routes Pattern

```typescript
// Use AuthContext to protect admin routes:
const { user, loading } = useAuth()

if (loading) return <LoadingSpinner />
if (!user) return <Navigate to="/admin/login" replace />

return <AdminDashboard />
```

## Database Schema Overview

### Core Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `applicants` | Job applications | id, full_name, email, phone, positions_interested, status, resume_url, preferred_language |
| `jobs` | Job listings | id, title, description, location, employment_type |
| `visitor_analytics` | Page views, UTM tracking | id, page_path, utm_source, utm_campaign, session_id |
| `newsletter_subscriptions` | Email list | email, subscribed, language |
| `cookie_consent_log` | GDPR compliance | id, consent_given, ip_address |

### Applicant Status Flow

```
new → reviewing → shortlisted → hired
                              ↘ rejected
```

**Status Enum**: `'new' | 'reviewing' | 'shortlisted' | 'hired' | 'rejected'`

### Row Level Security (RLS)

- **Public access**: Can INSERT into `applicants` (applications only)
- **Authenticated users**: Full access to all tables (admins)
- **Storage**: Private bucket for resumes (authenticated access only)

## Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/` | Public | Homepage with application form |
| `/admin/login` | Public | Admin authentication |
| `/admin/dashboard` | Protected | Admin panel with applicant management |
| `/privacy` | Public | Privacy policy |
| `/privacy/sms` | Public | SMS privacy policy |
| `/terms` | Public | Terms of service |
| `/tos` | Public | Redirects to `/terms` |
| `/developers/api/docs` | Public | OpenAPI/Swagger UI |
| `/openapi/docs` | Public | Alternate API docs route |
| `/verify-email` | Public | Email verification handler |
| `/application-confirmation` | Public | Post-submission confirmation |
| `/unsubscribe` | Public | Communication preferences management |
| `/service-area` | Public | Service area information |

## Environment Variables

Required in `.env` file (never commit this file):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Set these in Netlify dashboard → Site Settings → Environment Variables for production.

## CI/CD Pipeline

### GitHub Actions Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | PR, push to main/develop | Build, lint, type check, security audit |
| `security-scan.yml` | Daily at 2 AM | npm audit, Trivy vulnerability scan |
| `ai-code-review.yml` | PR | AI-powered code review with Claude/SonarCloud |
| `deploy-production.yml` | Push to main | Automatic Netlify deployment |

### Required GitHub Secrets

Add in repository Settings → Secrets and variables → Actions:

- `NETLIFY_AUTH_TOKEN` - From Netlify User Settings → Applications → Personal access tokens
- `NETLIFY_SITE_ID` - From Netlify Site Settings → General → API ID
- `ANTHROPIC_API_KEY` (optional) - For AI code review workflow

## Development Guidelines

### Component Guidelines

1. **shadcn/ui components** (`src/components/ui/`): DO NOT manually edit. Regenerate using `npx shadcn@latest add <component-name>` if updates needed.

2. **New components**: Place in appropriate directory:
   - Admin features → `src/components/admin/`
   - Reusable UI → `src/components/`
   - Page-specific → Keep in `src/pages/` if not reused

3. **File naming**: Use PascalCase for components (e.g., `ApplicantTable.tsx`)

### State Management

- Use React Context for global state
- Use local state (useState) for component-specific state
- Avoid prop drilling > 2-3 levels
- No Redux/Zustand needed for this project size

### Styling Conventions

- Use Tailwind utility classes
- Use `cn()` helper from `@/lib/utils` to merge class names
- Follow mobile-first responsive design (sm, md, lg, xl breakpoints)
- Prefer OKLCH color space for theme variables

### Type Safety

- All functions should have explicit return types
- Use TypeScript strict mode (enabled)
- Leverage Supabase generated types from `@/lib/supabase`
- Avoid `any` type - use `unknown` if type is truly unknown

### Accessibility

- Use semantic HTML elements
- Include ARIA labels for icon-only buttons
- Ensure color contrast meets WCAG AA standards
- Test keyboard navigation
- Support screen readers (aria-live regions for dynamic content)

## Supabase Setup

### Initial Setup

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Run migrations in order from `supabase/migrations/`
3. Configure storage bucket for resumes (private access)
4. Create admin users in Authentication panel
5. Deploy Edge Functions if using API

### Local Development with Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Link to project
supabase link --project-ref your-project-ref

# Pull remote schema
supabase db pull

# Reset local database (warning: destructive)
supabase db reset
```

## Deployment

### Netlify Configuration

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20
- Environment variables: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Pre-Deployment Checklist

1. Run `npm run build` locally to verify
2. Run `npx tsc --noEmit` to check types
3. Run `npm run lint` to check code quality
4. Test admin login and dashboard functionality
5. Verify environment variables in Netlify
6. Check Supabase RLS policies are enabled

### Manual Deployment

```bash
npx netlify deploy --prod
```

## Troubleshooting

### Common Issues

**Build fails with peer dependency errors**:
```bash
npm install --legacy-peer-deps
```

**TypeScript errors in node_modules**:
- These are usually false positives from third-party packages
- Run `npx tsc --noEmit` to verify your code only

**Supabase connection fails**:
- Verify `.env` file exists and has correct values
- Check Supabase project is active (not paused)
- Verify anon key is correct (not service role key)

**Admin login fails**:
- Verify user exists in Supabase Auth panel
- Check email is verified (or disable verification in Supabase)
- Clear browser localStorage and cookies

**Vite dev server port conflict**:
```bash
npm run kill  # Kills process on port 5000 (legacy)
# Or manually: lsof -ti:5173 | xargs kill (Mac/Linux)
```

## Brand Guidelines

- **Colors**: Primary green (#73B77D), professional and trustworthy
- **Fonts**: Plus Jakarta Sans (headings), Inter (body)
- **Tagline**: "Where Opportunity Starts"
- **Tone**: Professional, welcoming, trustworthy
- **Target**: B2B staffing services for DMV region

## Additional Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed system architecture diagrams
- [README.md](./README.md) - Project overview and setup
- [PRD.md](./PRD.md) - Original product requirements
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment procedures
- `supabase/migrations/` - Database schema documentation in SQL files

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Unique Staffing Professionals Inc.** - A staffing agency website with integrated applicant tracking system serving Maryland, Washington D.C., and Northern Virginia (DMV region). Specializes in temporary, permanent, and contract staffing for janitorial, HR, retail, call center, and industrial positions.

## Commands

```bash
# Development
npm run dev              # Start dev server (port 5173)
npm run build            # Production build (TypeScript check + Vite)
npm run preview          # Preview production build locally
npm run lint             # Run ESLint

# Deployment
npx netlify deploy --prod    # Deploy to production
npx netlify deploy           # Deploy preview

# Type checking
npx tsc --noEmit             # Full type check
```

Note: Use `--legacy-peer-deps` flag when running npm install due to React 19 peer dependency requirements.

## Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript 5.7 + Vite 6
- **Styling**: Tailwind CSS 4 + shadcn/ui (Radix primitives)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Forms**: React Hook Form + Zod validation
- **i18n**: Custom LanguageContext (en/es/fr)
- **Deployment**: Netlify with GitHub Actions CI/CD

### Provider Hierarchy

```
ThemeProvider (next-themes)
  └── LanguageProvider (custom i18n)
      └── AuthProvider (Supabase)
          └── BusinessInfoProvider
              └── Router
```

### Key Directories

```
src/
├── components/ui/       # shadcn/ui primitives - DO NOT MODIFY
├── components/admin/    # Admin dashboard (ApplicantTable, AnalyticsDashboard)
├── contexts/            # ThemeProvider, LanguageContext, AuthContext
├── pages/               # Route components
├── lib/supabase.ts      # Supabase client + database types
└── locales/translations.ts  # i18n dictionaries

supabase/
├── migrations/          # 16 database migration files
└── functions/           # Edge functions (api/, send-verification-email/)

.github/
├── workflows/           # CI/CD pipelines (see CI/CD section)
└── CODEOWNERS           # Code review assignments
```

### Path Aliases

Import from `src/` using `@/`:
```typescript
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
```

## Key Patterns

### Internationalization
```typescript
const { t, language, setLanguage } = useLanguage()
const text = t('hero.title')  // Nested key lookup
```

### Theming
CSS variables toggle via `[data-appearance="dark"]` selector. Uses OKLCH color space for better interpolation.

### Animations
Use Framer Motion for scroll-triggered animations:
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
/>
```

### Form Validation
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(applicantSchema)
})
```

## Database Schema

### Core Tables
| Table | Purpose |
|-------|---------|
| `applicants` | Job applications with language tracking, verification status |
| `jobs` | Job listings |
| `visitor_analytics` | Page views and UTM tracking |
| `newsletter_subscriptions` | Email list management |
| `cookie_consent_log` | GDPR/CCPA compliance |

### Applicant Status Flow
`new` → `reviewing` → `shortlisted` → `hired` (or `rejected`)

## Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/` | Public | Homepage with application form |
| `/privacy`, `/privacy/sms` | Public | Privacy policies |
| `/terms`, `/tos` | Public | Terms of service |
| `/developers/api/docs` | Public | OpenAPI/Swagger UI |
| `/admin/login` | Public | Admin authentication |
| `/admin/dashboard` | Protected | Admin panel (ProtectedRoute) |

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## CI/CD Pipeline

GitHub Actions workflows in `.github/workflows/`:

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| CI Pipeline | PR, push to main | Build, lint, type check |
| Security Audit | Daily 2 AM | npm audit, dependency scan |
| AI Code Review | PR | Claude/SonarCloud review |

Required GitHub Secrets:
- `NETLIFY_AUTH_TOKEN` - From Netlify User Settings → Applications
- `NETLIFY_SITE_ID` - From Netlify Site Settings → API ID
- `ANTHROPIC_API_KEY` (optional) - For AI code review

## Brand

- **Primary**: Green (#73B77D)
- **Fonts**: Plus Jakarta Sans (headings), Inter (body)
- **Tagline**: "Where Opportunity Starts"

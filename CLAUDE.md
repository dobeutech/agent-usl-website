# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Unique Staffing Professionals Inc.** — A staffing agency website with integrated applicant tracking system (ATS), admin dashboard, live chat, and email notification API. Serves the Maryland, Washington D.C., and Northern Virginia (DMV region) market for temporary, permanent, and contract staffing.

## Commands

```bash
# Development
npm install --legacy-peer-deps   # Install deps (required flag for React 19 peer deps)
npm run dev                       # Starts BOTH Express server (port 3001) AND Vite dev server (port 5000)
npm run build                     # Production build (tsc -b --noCheck && vite build)
npm run preview                   # Preview production build
npm run lint                      # ESLint
npx tsc --noEmit                  # Type check only (stricter than build, which uses --noCheck)

# Deployment (Netlify)
npx netlify deploy --prod         # Deploy to production
npx netlify deploy                # Deploy preview
```

**Important**: Always use `--legacy-peer-deps` when installing packages.

## Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript 5.7 + Vite 6 (SWC compiler, not Babel)
- **Styling**: Tailwind CSS 4 + shadcn/ui (Radix UI primitives)
- **Backend**: Express server (Resend email API) + Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Forms**: React Hook Form + Zod validation
- **i18n**: Custom LanguageContext (en/es/fr)
- **Animations**: Framer Motion
- **Icons**: Phosphor Icons (via `@github/spark` proxy plugin)
- **State**: React Context API
- **Deployment**: Netlify with GitHub Actions CI/CD

### Two-Server Dev Architecture

`npm run dev` starts two processes concurrently:
1. **Express server** (`server/index.ts`) on port **3001** — handles email notifications via Resend (application, chat, and contact notifications)
2. **Vite dev server** on port **5000** — serves the React SPA

Vite proxies all `/api/*` requests to the Express server (configured in `vite.config.ts`). In production, the Express server would need separate hosting or these endpoints are handled by Supabase Edge Functions.

### Provider Hierarchy

```
ThemeProvider (next-themes)
  └── LanguageProvider (custom i18n: en/es/fr)
      └── AuthProvider (Supabase auth)
          └── BusinessInfoProvider (SEO/business data)
              └── ChatProvider (live chat state)
                  └── Router (react-router-dom)
```

### Code Splitting

All pages except `Home` are lazy-loaded via `React.lazy()` with a `Suspense` fallback. The build also uses manual chunk splitting (see `vite.config.ts` `manualChunks`) to separate vendor libraries (React, Radix, Framer Motion, forms, Supabase).

### Path Aliases

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`):
```typescript
import { Button } from '@/components/ui/button'
```

## Key Directories

- `src/components/ui/` — **shadcn/ui primitives. DO NOT manually edit.** Regenerate with `npx shadcn@latest add <component>`.
- `src/components/admin/` — Admin dashboard: applicant management, analytics, job postings, live chat admin, business info manager
- `src/contexts/` — Global state: Auth, Language, Theme, BusinessInfo, Chat
- `src/pages/` — Route components (lazy-loaded except Home)
- `src/lib/` — Utilities: Supabase client, analytics/UTM tracking, form helpers, i18n, contact info, mock data
- `server/` — Express API server for Resend email notifications (separate `package.json`)
- `supabase/migrations/` — Database migration files (run in order)
- `supabase/functions/` — Supabase Edge Functions (API, email verification, admin notifications)

## Routes

| Route | Auth | Notes |
|-------|------|-------|
| `/` | Public | Homepage with application form |
| `/employers` | Public | Employer-focused page |
| `/forms` | Public | Forms page |
| `/service-area/:city` | Public | Dynamic city param |
| `/admin/login` | Public | Admin auth |
| `/admin/dashboard` | Protected | Full admin panel (ProtectedRoute component) |
| `/privacy`, `/privacy/sms`, `/terms` | Public | Legal pages |
| `/tos` | — | Redirects to `/terms` |
| `/developers/api/docs`, `/openapi/docs` | Public | Swagger UI |
| `/verify-email` | Public | Email verification handler |
| `/application-confirmation` | Public | Post-submission confirmation |
| `/unsubscribe` | Public | Communication preferences |

## Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `applicants` | Job applications (status: `new → reviewing → shortlisted → hired/rejected`) |
| `jobs` | Job listings with title, description, location, employment_type |
| `visitor_analytics` | Page views + UTM tracking |
| `newsletter_subscriptions` | Email list |
| `cookie_consent_log` | GDPR compliance |

### Row Level Security
- Public: INSERT only into `applicants`
- Authenticated (admins): Full access to all tables
- Storage: Private bucket for resumes

## Environment Variables

```env
# Required — Frontend (prefixed with VITE_)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Required — Express server
RESEND_API_KEY=your-resend-key
```

Set `VITE_*` vars in Netlify dashboard for production.

## Key Patterns

### i18n
```typescript
const { t, language, setLanguage } = useLanguage()
const text = t('hero.title')  // Nested key lookup
// Priority: localStorage('app-language') → navigator.language → 'en'
```

### Theme
Uses `next-themes` with `[data-appearance="dark"]` selector and OKLCH color space CSS variables.

### Forms
React Hook Form + Zod schema validation via `zodResolver`. See `src/lib/form-utils.ts` for shared helpers.

### Protected Routes
`ProtectedRoute` component wraps admin routes, checking `AuthContext` for authenticated user.

## CI/CD

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | PR, push to main/develop | Build, lint, type check, security audit |
| `security-scan.yml` | Daily 2 AM | npm audit, Trivy scan |
| `ai-code-review.yml` | PR | AI code review |
| `deploy-production.yml` | Push to main | Netlify deployment |

## Brand

- **Primary color**: Green (#73B77D)
- **Fonts**: Plus Jakarta Sans (headings), Inter (body)
- **Tagline**: "Where Opportunity Starts"
- **Tone**: Professional, welcoming, trustworthy

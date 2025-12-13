# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Unique Staffing Professionals Inc.** - A professional staffing agency website with integrated applicant tracking system. The company specializes in temporary, permanent, and contract staffing solutions for janitorial, HR, retail, call center, and industrial positions across Maryland, Washington D.C., and Northern Virginia (DMV region).

### Business Context
- **Company**: Unique Staffing Professionals Inc.
- **Location**: 6001 66th Ave, Riverdale, MD 20737
- **Phone**: (301) 277-2141
- **Email**: omorilla@uniquestaffingprofessionals.com
- **Services**: Temporary staffing, permanent placement, temp-to-perm, payroll services

## Commands

```bash
# Development
npm run dev          # Start dev server (port 5173)
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint

# Deployment (Netlify)
npx netlify deploy --prod    # Deploy to production
npx netlify deploy           # Deploy preview

# Type checking
npx tsc --noEmit             # Full type check
```

## Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 + shadcn/ui (Radix primitives)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM
- **Icons**: Phosphor Icons + Lucide
- **Deployment**: Netlify

### Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui primitives (DO NOT MODIFY)
│   ├── admin/                 # Admin dashboard components
│   ├── seo/                   # SEO components
│   ├── AccessibilityControls.tsx  # A11y widget
│   ├── AnimatedBackground.tsx     # Particle network
│   ├── LiveChat.tsx               # Chat widget
│   ├── FAQ.tsx                    # FAQ section
│   ├── ClientLogos.tsx            # Trust carousel
│   ├── JobAlerts.tsx              # Subscription form
│   ├── EmployerCTA.tsx            # B2B section
│   └── ...
├── contexts/
│   ├── AuthContext.tsx        # Supabase auth
│   ├── LanguageContext.tsx    # i18n (en/es/fr)
│   ├── ThemeProvider.tsx      # Dark/light mode
│   └── BusinessInfoContext.tsx
├── pages/                     # Route pages
├── lib/
│   ├── supabase.ts           # Supabase client + types
│   ├── analytics.ts          # Tracking
│   └── form-utils.ts         # Validation helpers
├── locales/
│   └── translations.ts       # i18n dictionaries
└── types/                    # TypeScript definitions

public/
├── sitemap.xml              # SEO sitemap
├── robots.txt               # Crawler rules
├── openapi.yaml             # API specification
└── logo.webp                # Company logo

supabase/
├── migrations/              # Database migrations
└── functions/               # Edge functions
    ├── api/                 # REST API
    ├── send-verification-email/
    └── send-admin-notification/
```

### Key Patterns

**Path Aliases**: Use `@/` for imports from `src/`
```typescript
import { Button } from '@/components/ui/button'
```

**i18n**: Access via `useLanguage()` hook
```typescript
const { t, language } = useLanguage()
const text = t('hero.title')
```

**Theme**: CSS variables toggle via `.dark` class. Uses OKLCH color space.

**Animations**: Use Framer Motion for scroll-triggered animations
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
/>
```

## Database Schema

### Core Tables
- `applicants` - Job applications with language tracking
- `jobs` - Job listings
- `visitor_analytics` - Page views and tracking
- `newsletter_subscriptions` - Email list
- `cookie_consent_log` - GDPR compliance

### Key Fields (applicants)
- Language: `preferred_language`, `browser_language`
- Marketing: `newsletter_subscribed`, `job_notifications_enabled`, `sms_notifications_enabled`
- Tracking: `communication_preferences` (JSON with UTM data)
- Status: `new`, `reviewing`, `shortlisted`, `rejected`, `hired`

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with application form |
| `/privacy` | Privacy policy |
| `/privacy/sms` | SMS privacy policy |
| `/terms`, `/tos` | Terms of service |
| `/unsubscribe` | Manage preferences |
| `/developers/api/docs` | OpenAPI documentation |
| `/admin/login` | Admin authentication |
| `/admin/dashboard` | Protected admin panel |

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Important Notes

- **shadcn/ui**: Components in `src/components/ui/` should NOT be modified directly
- **Tailwind v4**: Uses `@tailwindcss/vite` plugin
- **OKLCH colors**: Theme uses OKLCH for better color interpolation
- **Language tracking**: All forms capture `preferred_language` for analytics
- **Accessibility**: Built-in controls for font size, contrast, motion
- **No test suite**: Currently no testing framework

## Brand Guidelines

- **Primary Color**: Green (#73B77D / oklch(0.731 0.150 130))
- **Font Headings**: Plus Jakarta Sans
- **Font Body**: Inter
- **Tagline**: "Where Opportunity Starts"
- **Tone**: Professional, welcoming, community-focused

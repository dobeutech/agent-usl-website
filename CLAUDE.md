# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A professional staffing agency website with integrated applicant tracking system for Unique Staffing Professionals Inc. Features a public-facing website with job application forms and a secure admin dashboard for managing applicants.

## Commands

```bash
# Development
npm run dev          # Start dev server (port 5173)
npm run build        # Production build (skips type checking for speed)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint

# Deployment (Netlify)
npx netlify deploy --prod    # Deploy to production
npx netlify deploy           # Deploy preview

# Type checking (not in scripts, run manually)
npx tsc --noEmit             # Full type check without building
```

**Note**: The build script uses `tsc -b --noCheck` which skips type checking for faster builds. Run `npx tsc --noEmit` separately for type validation.

## Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 + shadcn/ui (Radix primitives)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM
- **Icons**: Phosphor Icons (via Spark plugin)

### Project Structure

```
src/
├── components/           # UI components
│   ├── ui/              # shadcn/ui primitives (Button, Card, etc.)
│   ├── admin/           # Admin-specific (AnalyticsDashboard, BusinessInfoManager)
│   └── seo/             # SEO components (StructuredData, SEOHead)
├── contexts/            # React Context providers
│   ├── AuthContext.tsx        # Supabase auth state
│   ├── LanguageContext.tsx    # i18n (en/es/fr)
│   ├── ThemeProvider.tsx      # Dark/light mode
│   └── BusinessInfoContext.tsx # Business data management
├── pages/               # Route pages
│   ├── Home.tsx              # Public homepage
│   ├── AdminLogin.tsx        # Auth page
│   ├── AdminDashboard.tsx    # Protected admin panel
│   └── ServiceAreaPage.tsx   # Service area content
├── lib/
│   ├── supabase.ts      # Supabase client initialization
│   ├── i18n.ts          # Translation helpers
│   ├── utils.ts         # cn() and utilities
│   └── form-utils.ts    # Form validation helpers
├── locales/
│   └── translations.ts  # Translation dictionaries (en/es/fr)
└── types/               # TypeScript definitions
```

### Context Provider Hierarchy

```
App
└── ThemeProvider (next-themes)
    └── LanguageProvider
        └── AuthProvider
            └── BusinessInfoProvider
                └── Router
```

### Key Patterns

**Path Aliases**: Use `@/` for imports from `src/` (configured in vite.config.ts)
```typescript
import { Button } from '@/components/ui/button'
```

**Theme System**: CSS variables toggle via `.dark` class. Uses OKLCH color space.

**i18n**: Static translations in `src/locales/translations.ts`. Access via `useLanguage()` hook:
```typescript
const { t, language } = useLanguage()
const text = t('hero.title')
```

**Supabase Integration**:
- Client in `src/lib/supabase.ts`
- Row Level Security (RLS) enabled on all tables
- Public can submit applications, authenticated users manage them
- Resume files stored in private `resumes` bucket

### Database Schema

**applicants** table:
- `id`, `created_at`, `updated_at`
- `full_name`, `email`, `phone`
- `position_interested`, `experience_years`
- `resume_url`, `resume_filename`, `cover_letter`
- `status` (enum: new, reviewing, shortlisted, rejected, hired)
- `notes`

## Routes

- `/` - Public homepage with application form
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Protected admin panel

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Setup

Complete setup SQL and storage bucket configuration in `SUPABASE_SETUP.md`. Key steps:
1. Create applicants table with RLS policies
2. Create private resumes storage bucket
3. Create admin user via Supabase dashboard

## Vite Configuration

Uses GitHub Spark plugins for icon optimization. The `createIconImportProxy` and `sparkPlugin` must not be removed from vite.config.ts.

## Important Notes

- **No test suite**: This project currently has no testing framework or test scripts
- **shadcn/ui components**: Located in `src/components/ui/`, do not modify these directly—customize via CSS variables or wrapper components
- **Tailwind v4**: Uses the new `@tailwindcss/vite` plugin, not PostCSS configuration
- **OKLCH colors**: Theme uses OKLCH color space for better color interpolation

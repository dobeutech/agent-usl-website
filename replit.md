# Unique Staffing Professionals Inc. - Website

## Overview
Professional staffing agency website for Unique Staffing Professionals Inc. based in Riverdale, MD. Built with React, TypeScript, Vite, and Tailwind CSS v4. Originally a GitHub Spark project, adapted for Replit.

## Recent Changes
- 2026-02-10: Initial import from GitHub. Removed `@github/spark` runtime dependencies (useKV, sparkPlugin) that require GitHub Spark infrastructure. Configured Vite for Replit (port 5000, host 0.0.0.0, allowedHosts). Set up demo mode via `VITE_FORCE_DEMO_MODE=true`.

## Project Architecture
- **Frontend**: React 19 + TypeScript + Vite 6 + Tailwind CSS v4
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **State Management**: React Context (Auth, BusinessInfo, Language, Theme)
- **Backend**: Supabase (external) - currently in demo mode with mock data
- **Routing**: react-router-dom v7
- **Animations**: Framer Motion, Three.js (VideoHero)
- **Icons**: Phosphor Icons, Lucide React
- **i18n**: Custom language context (en, es, fr)

## Key Files
- `src/App.tsx` - Main app with routing
- `src/pages/Home.tsx` - Landing page (directly imported, not lazy-loaded due to Spark compatibility)
- `src/lib/mockData.ts` - Demo mode data and utilities
- `src/lib/supabase.ts` - Supabase client configuration
- `src/contexts/` - React context providers
- `vite.config.ts` - Vite config with Tailwind CSS v4 plugin

## Environment Variables
- `VITE_FORCE_DEMO_MODE` - Set to `true` to run in demo mode (no Supabase required)
- `VITE_SUPABASE_URL` - Supabase project URL (optional in demo mode)
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key (optional in demo mode)
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key (optional)

## User Preferences
- None recorded yet

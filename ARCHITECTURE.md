# Architecture: Multilingual & Dark Mode System

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                        │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Detect Browser Language                  │ │
│  │              Detect System Theme Preference           │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     React Application                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │            ThemeProvider (next-themes)                │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │          LanguageProvider (Custom)              │ │ │
│  │  │  ┌───────────────────────────────────────────┐ │ │ │
│  │  │  │        App Router & Pages               │ │ │ │
│  │  │  │  ┌─────────────────────────────────┐   │ │ │ │
│  │  │  │  │      Navigation Bar            │   │ │ │ │
│  │  │  │  │  ┌──────────┬──────────────┐  │   │ │ │ │
│  │  │  │  │  │ Language │    Theme     │  │   │ │ │ │
│  │  │  │  │  │  Toggle  │    Toggle    │  │   │ │ │ │
│  │  │  │  │  └──────────┴──────────────┘  │   │ │ │ │
│  │  │  │  └─────────────────────────────────┘   │ │ │ │
│  │  │  └───────────────────────────────────────┘ │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
              │                              │
              ▼                              ▼
    ┌──────────────────┐          ┌──────────────────┐
    │   localStorage   │          │   CSS Variables  │
    │  ┌────────────┐  │          │  ┌────────────┐  │
    │  │ Language   │  │          │  │ :root {...}│  │
    │  │ Preference │  │          │  │ .dark {...}│  │
    │  └────────────┘  │          │  └────────────┘  │
    │  ┌────────────┐  │          └──────────────────┘
    │  │   Theme    │  │
    │  │ Preference │  │
    │  └────────────┘  │
    └──────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Supabase Database                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  testimonials                                         │ │
│  │  ├─ id, author_name, author_title, rating, ...       │ │
│  │  └─ RLS: Public read, Authenticated write            │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │  testimonial_translations                             │ │
│  │  ├─ id, testimonial_id, language, content            │ │
│  │  └─ RLS: Public read, Authenticated write            │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │  service_translations                                 │ │
│  │  ├─ id, service_key, language, title, description    │ │
│  │  └─ RLS: Public read, Authenticated write            │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Language Selection Flow

```
┌──────────────┐
│ User clicks  │
│ globe icon   │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ LanguageToggle       │
│ opens dropdown       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ User selects         │
│ language (es/en/fr)  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────┐
│ LanguageContext.setLanguage()│
│ - Update state               │
│ - Save to localStorage       │
│ - Update HTML lang attr      │
│ - Announce to screen readers │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────┐
│ All components using │
│ useLanguage() hook   │
│ re-render with       │
│ new translations     │
└──────────────────────┘
```

### Theme Selection Flow

```
┌──────────────┐
│ User clicks  │
│ sun/moon     │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ ThemeToggle          │
│ toggles theme        │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ next-themes          │
│ - Update state       │
│ - Save to localStorage│
│ - Toggle .dark class │
│ - Announce change    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ CSS custom properties│
│ automatically switch │
│ via .dark class      │
└──────────────────────┘
```

## Component Hierarchy

```
App
├── ThemeProvider (next-themes)
│   └── LanguageProvider (custom)
│       ├── AuthProvider
│       │   └── BusinessInfoProvider
│       │       └── Router
│       │           ├── Home
│       │           │   ├── SEOHead
│       │           │   ├── StructuredData
│       │           │   ├── Navigation
│       │           │   │   ├── LanguageToggle
│       │           │   │   └── ThemeToggle
│       │           │   ├── Hero (localized)
│       │           │   ├── Services (localized)
│       │           │   ├── Industries
│       │           │   ├── WhyChooseUs
│       │           │   ├── ApplyForm
│       │           │   ├── Testimonials
│       │           │   ├── Contact
│       │           │   └── Footer (localized)
│       │           ├── ServiceAreaPage
│       │           ├── AdminLogin
│       │           └── AdminDashboard
│       └── Toaster
```

## State Management Flow

```
┌─────────────────────────────────────────────┐
│           Global State (Context API)        │
├─────────────────────────────────────────────┤
│                                             │
│  ThemeContext (next-themes)                 │
│  ├─ theme: "light" | "dark" | "system"     │
│  └─ setTheme: (theme) => void              │
│                                             │
│  LanguageContext (custom)                   │
│  ├─ language: "en" | "es" | "fr"           │
│  ├─ setLanguage: (lang) => void            │
│  ├─ t: (key: string) => string             │
│  └─ dir: "ltr" | "rtl"                     │
│                                             │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌───────────────┐      ┌────────────────┐
│  localStorage │      │  Components    │
│  Persistence  │      │  consume via   │
│               │      │  hooks         │
└───────────────┘      └────────────────┘
```

## Translation Resolution

```
Component requests translation: t('hero.title')
                │
                ▼
        ┌───────────────┐
        │ getTranslation│
        │   function    │
        └───────┬───────┘
                │
                ▼
        ┌───────────────────┐
        │ Current language: │
        │      "es"         │
        └───────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │ translations[es]      │
    │   .hero               │
    │   .title              │
    └───────┬───────────────┘
            │
            ▼
    "Conectando Talento con Oportunidades"
```

## CSS Variable Resolution

```
Component uses: className="bg-background text-foreground"
                │
                ▼
        ┌───────────────┐
        │  Check theme  │
        │  via .dark    │
        │  class        │
        └───────┬───────┘
                │
        ┌───────┴──────────┐
        │                  │
        ▼                  ▼
   Light Theme        Dark Theme
   -----------        ----------
   :root {            .dark {
     --background:      --background:
     oklch(0.99...)     oklch(0.145...)

     --foreground:      --foreground:
     oklch(0.25...)     oklch(0.985...)
   }                  }
        │                  │
        └───────┬──────────┘
                │
                ▼
        ┌───────────────┐
        │ Apply colors  │
        │ to element    │
        └───────────────┘
```

## Accessibility Features Map

```
┌─────────────────────────────────────────────────┐
│            Accessibility Layer                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Skip Link (Tab to reveal)                     │
│  └─ Jumps to #main-content                     │
│                                                 │
│  ARIA Live Regions                              │
│  ├─ #language-announcement                      │
│  │  └─ Announces language changes              │
│  └─ #theme-announcement                         │
│     └─ Announces theme changes                 │
│                                                 │
│  ARIA Labels                                    │
│  ├─ Language toggle: "Select language"         │
│  ├─ Theme toggle: "Toggle theme"               │
│  └─ Menu buttons: "Open/Close menu"            │
│                                                 │
│  Keyboard Navigation                            │
│  ├─ Tab: Move between elements                 │
│  ├─ Enter/Space: Activate buttons              │
│  └─ Arrows: Navigate dropdowns                 │
│                                                 │
│  Focus Indicators                               │
│  └─ 2px ring with primary color                │
│     (visible in both light/dark)               │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Persistence Strategy

```
┌─────────────────────────────────────────┐
│         On Page Load                    │
├─────────────────────────────────────────┤
│                                         │
│  1. Check localStorage                  │
│     ├─ Language: 'app-language'         │
│     └─ Theme: 'app-theme'               │
│                                         │
│  2. If not found:                       │
│     ├─ Detect browser language          │
│     ├─ Detect system theme              │
│     └─ Save defaults                    │
│                                         │
│  3. Apply preferences                   │
│     ├─ Set HTML lang attribute          │
│     ├─ Apply theme class                │
│     └─ Initialize contexts              │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      On User Change                     │
├─────────────────────────────────────────┤
│                                         │
│  1. Update context state                │
│  2. Save to localStorage                │
│  3. Update DOM attributes               │
│  4. Trigger re-renders                  │
│  5. Announce to screen readers          │
│                                         │
└─────────────────────────────────────────┘
```

## Error Handling

```
┌─────────────────────────────────────────┐
│        Graceful Degradation             │
├─────────────────────────────────────────┤
│                                         │
│  localStorage unavailable?              │
│  └─ Use in-memory state only            │
│                                         │
│  Translation key missing?               │
│  └─ Return key as fallback              │
│                                         │
│  Invalid language code?                 │
│  └─ Fall back to DEFAULT_LANGUAGE       │
│                                         │
│  Theme detection fails?                 │
│  └─ Default to light mode               │
│                                         │
│  Browser language unsupported?          │
│  └─ Default to English                  │
│                                         │
└─────────────────────────────────────────┘
```

## Build Output Structure

```
dist/
├── index.html (1.98 KB)
├── assets/
│   ├── index-[hash].css (370 KB)
│   │   ├── Tailwind styles
│   │   ├── Theme variables
│   │   ├── Dark mode styles
│   │   └── Accessibility styles
│   │
│   └── index-[hash].js (737 KB)
│       ├── React runtime
│       ├── React Router
│       ├── next-themes
│       ├── Translation dictionaries
│       ├── All components
│       └── Supabase client
│
└── [Other assets...]
```

---

**Architecture Version**: 1.0.0
**Last Updated**: November 2025
**Maintainer**: Development Team

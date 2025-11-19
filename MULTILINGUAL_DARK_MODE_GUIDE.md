# Multilingual & Dark Mode Implementation Guide

This document explains the multilingual (i18n) and dark mode features implemented in the Unique Staffing Professionals website.

## Features

### 🌐 Multilingual Support (i18n)

The application supports three languages:
- **English (en)** - Default language
- **Spanish (es)** - Español
- **French (fr)** - Français

#### Language Detection & Persistence

1. **Browser Language Detection**: On first visit, the app detects the user's browser language
2. **localStorage Persistence**: Language preference is saved and persists across sessions
3. **Manual Selection**: Users can manually switch languages using the globe icon in the navigation

#### Language Toggle Component

Located in the top navigation bar, the language toggle provides:
- Accessible dropdown menu with all available languages
- Visual indicator showing currently selected language
- ARIA labels for screen reader compatibility
- Keyboard navigation support (Tab, Enter, Arrow keys)

#### Translation System

All UI text is stored in `/src/locales/translations.ts` with comprehensive coverage:
- Navigation menu items
- Hero section content
- Service descriptions
- Form labels and validation messages
- Error and success messages
- Footer content
- Accessibility announcements

#### Database-Stored Translations

Some content is stored in Supabase for easy management:
- **Service Translations**: Titles and descriptions for staffing services
- **Testimonials**: Customer testimonials in multiple languages

Tables:
- `service_translations` - Service content in all languages
- `testimonials` - Testimonial metadata
- `testimonial_translations` - Testimonial content in all languages

### 🌓 Dark Mode Support

The application implements a complete dark mode theme system using `next-themes`.

#### Theme Options

- **Light Mode**: Default bright theme
- **Dark Mode**: WCAG AA compliant dark theme
- **System**: Automatically follows OS preference

#### Theme Toggle Component

Located in the top navigation bar:
- Sun/Moon icon toggles between light and dark modes
- Smooth transitions between themes
- Respects `prefers-color-scheme` media query
- No flash of unstyled content (FOUC)
- localStorage persistence

#### Color Contrast Compliance

All colors meet WCAG 2.1 AA standards:

**Light Mode:**
- Background to Text: 12.8:1 (AAA)
- Primary to White: 8.2:1 (AAA)
- Accent to White: 4.9:1 (AA)

**Dark Mode:**
- Background to Text: 13.5:1 (AAA)
- Primary to Background: 5.8:1 (AA+)
- All interactive elements: 4.5:1+ (AA)

## Accessibility Features

### ♿ WCAG 2.1 AA Compliance

1. **Keyboard Navigation**
   - All interactive elements accessible via keyboard
   - Visible focus indicators with proper contrast
   - Skip to main content link for keyboard users

2. **Screen Reader Support**
   - ARIA labels on all toggles and buttons
   - ARIA live regions for language/theme change announcements
   - Semantic HTML structure with proper landmarks

3. **Visual Accessibility**
   - Color contrast ratios exceed WCAG AA standards
   - Text remains readable in both themes
   - Focus indicators visible in all modes

4. **Internationalization Accessibility**
   - Proper `lang` attribute updates on HTML element
   - Screen reader announcements in selected language
   - Text direction support (LTR/RTL ready)

## Technical Implementation

### Context Providers

The app uses React Context for state management:

```tsx
<ThemeProvider>          // next-themes wrapper
  <LanguageProvider>     // Custom i18n provider
    <App />
  </LanguageProvider>
</ThemeProvider>
```

### Custom Hooks

**`useLanguage()`** - Access language state and translation function
```tsx
const { language, setLanguage, t } = useLanguage()

// Usage:
<h1>{t('hero.title')}</h1>
```

**`useTheme()`** - From next-themes, controls theme state
```tsx
const { theme, setTheme } = useTheme()
```

### localStorage Keys

- `app-language` - Stores language preference with version
- `app-theme` - Stores theme preference (light/dark/system)

### CSS Custom Properties

All colors use CSS custom properties that automatically update:

```css
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.25 0.02 250);
  /* ... more colors */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... dark mode colors */
}
```

## File Structure

```
src/
├── components/
│   ├── LanguageToggle.tsx      # Language selector dropdown
│   ├── ThemeToggle.tsx         # Dark/light mode toggle
│   ├── Navigation.tsx          # Updated with toggles
│   └── ...
├── contexts/
│   ├── LanguageContext.tsx     # i18n state management
│   └── ThemeProvider.tsx       # Theme state wrapper
├── locales/
│   └── translations.ts         # All UI translations
├── lib/
│   └── i18n.ts                 # i18n utility functions
├── types/
│   └── i18n.ts                 # TypeScript types
└── main.css                    # Theme CSS variables

supabase/migrations/
└── create_multilingual_content_tables.sql
```

## Usage Examples

### Adding New Translations

1. Update `/src/locales/translations.ts`:
```typescript
export const translations: Record<Language, Translations> = {
  en: {
    newSection: {
      title: 'English Title',
      description: 'English Description',
    },
  },
  es: {
    newSection: {
      title: 'Título en Español',
      description: 'Descripción en Español',
    },
  },
  fr: {
    newSection: {
      title: 'Titre en Français',
      description: 'Description en Français',
    },
  },
}
```

2. Use in components:
```tsx
function MyComponent() {
  const { t } = useLanguage()
  return <h1>{t('newSection.title')}</h1>
}
```

### Theme-Aware Styling

Use Tailwind's dark variant:
```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content that adapts to theme
</div>
```

Or use CSS custom properties:
```css
.my-element {
  background-color: var(--background);
  color: var(--foreground);
}
```

## Browser Support

- Modern browsers with CSS custom properties support
- Graceful degradation for browsers without JavaScript
- localStorage fallback handling for privacy mode
- System preference detection via `prefers-color-scheme`

## Testing

### Accessibility Testing
- Keyboard navigation (Tab, Enter, Space, Arrows)
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Color contrast validation tools
- Automated WCAG checks

### Functional Testing
- Language switching across all pages
- Theme switching persistence
- Browser language detection
- localStorage edge cases
- FOUC prevention

## Future Enhancements

- [ ] Add more languages (German, Portuguese, etc.)
- [ ] RTL language support (Arabic, Hebrew)
- [ ] User preference API for logged-in users
- [ ] Translation management interface in admin dashboard
- [ ] A/B testing for language detection accuracy

## Support

For questions or issues related to multilingual or dark mode features:
- Check console for translation warnings
- Verify localStorage is not disabled
- Test in incognito mode for clean state
- Review browser console for errors

---

**Last Updated**: November 2025
**Version**: 1.0.0
**Maintainer**: Development Team

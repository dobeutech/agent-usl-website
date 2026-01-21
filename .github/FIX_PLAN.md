# Comprehensive Fix Plan - Issues 1-4 + Lightbox + Footer

**Date:** January 21, 2026  
**Status:** PENDING USER APPROVAL  
**Branch:** cursor/website-functionality-and-verification-f0bd

---

## Executive Summary

This plan addresses 6 critical issues identified during testing:

| Issue | Severity | Category |
|-------|----------|----------|
| 1. ARIA labels missing on 24 buttons | High | Accessibility |
| 2. Test selectors for language/theme not working | Medium | Testing |
| 3. Broken internal links in tests | Medium | Testing/Routing |
| 4. Missing data-testid attributes | Medium | Testing |
| 5. Lightbox (TalentNetworkModal) not loading | High | UX |
| 6. Footer text still hidden | High | UX/Visibility |

---

## Issue Analysis & Proposed Fixes

### Issue #1: ARIA Labels Missing on 24 Buttons

**Problem:**  
Test identified 24 buttons without proper `aria-label` attributes, violating WCAG 2.1 accessibility guidelines.

**Files Affected:**
- `src/components/Navigation.tsx` - Navigation buttons (6+ buttons)
- `src/components/Footer.tsx` - Quick link buttons (4 buttons)
- `src/components/ThemeToggle.tsx` - Theme toggle buttons
- `src/components/LanguageToggle.tsx` - Language toggle buttons
- `src/components/HeroSection.tsx` - CTA buttons
- `src/components/ServicesSection.tsx` - Service card buttons
- `src/components/CookieConsent.tsx` - Consent buttons

**Proposed Fix:**
```tsx
// Before (Navigation.tsx line 140-157)
<motion.button
  onClick={() => scrollToSection(item.id)}
  className="relative text-foreground/70..."
>
  {item.label}
</motion.button>

// After
<motion.button
  onClick={() => scrollToSection(item.id)}
  className="relative text-foreground/70..."
  aria-label={`Navigate to ${item.label} section`}
>
  {item.label}
</motion.button>
```

**Testing Approach:**
```javascript
// Browser automation test
const buttonsWithoutLabels = await page.$$eval(
  'button:not([aria-label])',
  buttons => buttons.filter(b => !b.textContent?.trim()).length
);
expect(buttonsWithoutLabels).toBe(0);
```

---

### Issue #2: Test Selectors for Language/Theme Not Working

**Problem:**  
Current test selectors use invalid CSS syntax (`:has-text()` is Playwright-specific, not valid in Puppeteer).

**Current Broken Code:**
```javascript
// Invalid selector in Puppeteer
const langOption = await page.$('button:has-text("English")');
```

**Proposed Fix:**
```javascript
// Use XPath or page.evaluate instead
const langOption = await page.evaluateHandle((langName) => {
  const buttons = document.querySelectorAll('button');
  for (const btn of buttons) {
    if (btn.textContent?.includes(langName)) return btn;
  }
  return null;
}, 'English');

// Or use data-testid attributes (preferred)
const langOption = await page.$('[data-testid="lang-en"]');
```

**Files to Update:**
- `tests/browser-automation.test.mjs` - Update all selectors
- Add `data-testid` to:
  - `src/components/LanguageToggle.tsx`
  - `src/components/ThemeToggle.tsx`

---

### Issue #3: Broken Internal Links in Tests

**Problem:**  
Tests report 4-5/10 links as "broken" because the test navigates away from SPA and loses context.

**Root Cause:**
- SPA navigation doesn't trigger full page loads
- Hash links (#section) don't return 200 status in fetch
- External links fail when tested as internal

**Proposed Fix:**
```javascript
// Improved link testing logic
async function testLinks(page) {
  const links = await page.$$eval('a[href]', anchors => 
    anchors.map(a => ({
      href: a.href,
      isInternal: a.href.startsWith(window.location.origin),
      isHash: a.href.includes('#'),
      isExternal: !a.href.startsWith(window.location.origin)
    }))
  );

  for (const link of links) {
    if (link.isHash) {
      // Test hash links by checking element exists
      const hash = link.href.split('#')[1];
      const exists = await page.$(`#${hash}`);
      // Mark as passed if element exists
    } else if (link.isInternal) {
      // Test internal links with navigation
      const response = await page.goto(link.href, { waitUntil: 'domcontentloaded' });
      // Check for 200 or successful SPA render
    }
    // Skip external links or test separately
  }
}
```

---

### Issue #4: Missing data-testid Attributes

**Problem:**  
No `data-testid` attributes for reliable test selectors.

**Proposed Additions:**

| Component | Element | data-testid |
|-----------|---------|-------------|
| Navigation | Logo button | `nav-logo` |
| Navigation | Mobile menu | `mobile-menu-btn` |
| Navigation | Nav items | `nav-{item-id}` |
| LanguageToggle | Toggle button | `lang-toggle` |
| LanguageToggle | Language options | `lang-{code}` |
| ThemeToggle | Toggle button | `theme-toggle` |
| ThemeToggle | Theme options | `theme-{mode}` |
| Footer | Quick links | `footer-link-{id}` |
| TalentNetworkModal | Modal wrapper | `talent-modal` |
| TalentNetworkModal | Close button | `modal-close` |
| TalentNetworkModal | Join button | `modal-join` |
| TalentNetworkModal | Employer CTA | `modal-employer-cta` |

**Example Implementation:**
```tsx
// LanguageToggle.tsx
<button
  onClick={toggleLanguage}
  data-testid="lang-toggle"
  aria-label="Select language"
>
  ...
</button>

<button
  onClick={() => setLanguage('en')}
  data-testid="lang-en"
  aria-label="Switch to English"
>
  English
</button>
```

---

### Issue #5: Lightbox (TalentNetworkModal) Not Loading

**Problem:**  
The modal has a 15-second delay before appearing, and stores dismissal state in localStorage for 24 hours.

**Root Causes:**
1. `MODAL_DELAY = 15000` (15 seconds) - Too long for most test scenarios
2. `localStorage.getItem(MODAL_DISMISSED_KEY)` - May have been previously dismissed
3. AnimatePresence may not render if component unmounts quickly

**Proposed Fix:**

Option A: Add immediate trigger for testing
```tsx
// TalentNetworkModal.tsx
const MODAL_DELAY = import.meta.env.DEV ? 3000 : 15000; // 3s in dev, 15s in prod

// Add manual trigger via URL param
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('showModal') === 'true') {
    setIsOpen(true);
    return;
  }
  // ... existing logic
}, []);
```

Option B: Export testing helper
```tsx
// Add dev-only testing function
if (import.meta.env.DEV) {
  window.__openTalentModal = () => {
    const event = new CustomEvent('open-talent-modal');
    window.dispatchEvent(event);
  };
}
```

**Test Approach:**
```javascript
// Clear localStorage before test
await page.evaluate(() => localStorage.removeItem('talent_network_dismissed'));

// Navigate with modal trigger
await page.goto(`${BASE_URL}/?showModal=true`);
await delay(1000);

// Check modal appears
const modal = await page.$('[data-testid="talent-modal"]');
expect(modal).toBeTruthy();
```

---

### Issue #6: Footer Text Still Hidden

**Problem:**  
Footer text under the logo banner is not visible due to low contrast against the primary background.

**Current Styling:**
```tsx
<p className="text-primary-foreground text-sm sm:text-base mb-4 leading-relaxed max-w-md drop-shadow-sm">
  {t('footer.tagline')}
</p>
```

**Analysis:**
- `text-primary-foreground` may have insufficient contrast
- `drop-shadow-sm` is minimal and not helping
- Background gradients/decorative elements may overlap text

**Proposed Fix:**

```tsx
// Footer.tsx - Enhanced text visibility
<p className="text-white text-sm sm:text-base mb-4 leading-relaxed max-w-md font-medium
   [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%),_0_2px_4px_rgb(0_0_0_/_20%)]"
   itemProp="description">
  {t('footer.tagline')}
</p>

// Company name with enhanced visibility
<h3 className="font-heading font-bold text-xl sm:text-2xl text-white
   [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)]"
   itemProp="name">
  {businessInfo.name}
</h3>

// Add semi-transparent background behind company info section
<motion.div className="lg:col-span-2 bg-black/10 rounded-xl p-4 -m-4" variants={itemVariants}>
  ...
</motion.div>
```

**Alternative: Add contrast overlay**
```tsx
// Add a subtle dark overlay behind the company info
<div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent rounded-xl" />
```

**Test Approach:**
```javascript
// Test text visibility by checking computed styles
const tagline = await page.$eval('.footer-tagline', el => {
  const styles = window.getComputedStyle(el);
  return {
    color: styles.color,
    visibility: styles.visibility,
    opacity: styles.opacity
  };
});
expect(tagline.visibility).toBe('visible');
expect(parseFloat(tagline.opacity)).toBeGreaterThan(0.5);
```

---

## Implementation Order

| Step | Task | Est. Changes | Dependencies |
|------|------|--------------|--------------|
| 1 | Add data-testid attributes | ~15 files | None |
| 2 | Fix ARIA labels on buttons | ~8 files | None |
| 3 | Fix Footer text visibility | 1 file | None |
| 4 | Add lightbox test trigger | 1 file | None |
| 5 | Update test selectors | 1 file | Steps 1-4 |
| 6 | Re-run tests & verify | N/A | Step 5 |

---

## Testing Strategy

### Pre-Implementation Baseline
```bash
# Run current tests to establish baseline
node tests/browser-automation.test.mjs
# Expected: 69 passed, 20 failed, 12 skipped
```

### Post-Implementation Verification
```bash
# Deploy to Netlify preview
npx netlify deploy --dir dist

# Run tests against preview
TEST_URL=<preview-url> node tests/browser-automation.test.mjs
# Expected: 90+ passed, <10 failed, <5 skipped
```

### Manual Verification Checklist
- [ ] Lightbox appears after ~15 seconds on fresh session
- [ ] Lightbox can be closed and doesn't reappear for 24h
- [ ] Footer text is readable on all device sizes
- [ ] All navigation buttons are keyboard accessible
- [ ] Screen reader announces button purposes correctly
- [ ] Theme switching works on mobile/tablet/desktop
- [ ] Language switching persists across page navigation

---

## Rollback Plan

If issues arise after deployment:
1. Revert to previous commit: `git revert HEAD`
2. Deploy previous version: `npx netlify deploy --prod --dir dist`
3. Notify team of regression

---

## Acceptance Criteria

- [ ] All 24 buttons have appropriate ARIA labels
- [ ] Test suite passes with >90% success rate
- [ ] Lightbox appears correctly in automated tests
- [ ] Footer text is visible across all devices and themes
- [ ] No accessibility regressions (WCAG 2.1 AA compliance)
- [ ] No performance regressions (Lighthouse score maintained)

---

## Sign-Off Required

**IMPORTANT:** This plan requires user approval before any code changes are made.

- [ ] **User Approval** - I approve this implementation plan
- [ ] **Scope Confirmed** - The fixes described match my expectations
- [ ] **Testing Approach Approved** - The testing strategy is acceptable

**To approve, reply with:** "Approved - proceed with implementation"

---

## Questions for User

1. Should the lightbox delay be reduced for better UX, or keep 15 seconds?
2. For footer text, prefer text-shadow approach or background overlay?
3. Should test failures block deployment (CI integration)?
4. Any additional accessibility requirements beyond WCAG 2.1 AA?

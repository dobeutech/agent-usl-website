import { supabase } from './supabase'

interface ConsentPreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

// Generate or retrieve visitor ID
function getVisitorId(): string {
  let visitorId = localStorage.getItem('visitor_id')
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('visitor_id', visitorId)
  }
  return visitorId
}

// Get UTM parameters from URL
function getUTMParameters(): Record<string, string | null> {
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content')
  }
}

// Get device information
function getDeviceInfo() {
  const ua = navigator.userAgent
  let deviceType = 'desktop'
  
  if (/mobile/i.test(ua)) deviceType = 'mobile'
  else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet'
  
  const browser = ua.match(/(firefox|msie|chrome|safari|trident|edg)/i)?.[0] || 'unknown'
  const os = ua.match(/(windows|mac|linux|android|ios)/i)?.[0] || 'unknown'
  
  return {
    device_type: deviceType,
    browser,
    os,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    user_agent: ua
  }
}

// Track visitor (called when consent is given)
export async function trackVisitor(consent: ConsentPreferences) {
  if (!consent.analytics && !consent.marketing) return

  const visitorId = getVisitorId()
  const utm = getUTMParameters()
  const device = getDeviceInfo()

  try {
    // Get IP and location from a service (optional - requires API)
    // For now, we'll let the server handle this via Edge Function
    
    const { error } = await supabase
      .from('visitor_analytics')
      .insert({
        visitor_id: visitorId,
        ...device,
        ...utm,
        referrer_url: document.referrer || null,
        landing_page: window.location.pathname
      })

    if (error) console.error('Error tracking visitor:', error)
  } catch (error) {
    console.error('Error in trackVisitor:', error)
  }
}

// Track page view
export async function trackPageView(consent: ConsentPreferences) {
  if (!consent.analytics) return

  const visitorId = getVisitorId()
  const startTime = Date.now()

  // Track scroll depth
  let maxScrollDepth = 0
  const updateScrollDepth = () => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    )
    maxScrollDepth = Math.max(maxScrollDepth, scrollPercentage)
  }

  window.addEventListener('scroll', updateScrollDepth, { passive: true })

  // Send page view when user leaves or after a timeout
  const sendPageView = async () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000)
    
    try {
      await supabase
        .from('page_view_events')
        .insert({
          visitor_id: visitorId,
          page_url: window.location.pathname,
          page_title: document.title,
          time_on_page: timeOnPage,
          scroll_depth: maxScrollDepth,
          referrer: document.referrer || null
        })
    } catch (error) {
      console.error('Error tracking page view:', error)
    }

    window.removeEventListener('scroll', updateScrollDepth)
  }

  // Send on page unload
  window.addEventListener('beforeunload', sendPageView)

  return () => {
    sendPageView()
    window.removeEventListener('beforeunload', sendPageView)
  }
}

// Update cookie consent in database
export async function updateCookieConsent(consent: ConsentPreferences) {
  const visitorId = getVisitorId()
  const device = getDeviceInfo()

  try {
    const { error } = await supabase
      .from('cookie_consent_log')
      .upsert({
        visitor_id: visitorId,
        consent_essential: consent.essential,
        consent_analytics: consent.analytics,
        consent_marketing: consent.marketing,
        user_agent: device.user_agent
      }, {
        onConflict: 'visitor_id'
      })

    if (error) console.error('Error saving cookie consent:', error)
  } catch (error) {
    console.error('Error in updateCookieConsent:', error)
  }
}

// Initialize analytics tracking
export function initAnalytics() {
  const consentStr = localStorage.getItem('cookie_consent')
  if (!consentStr) return

  const consent = JSON.parse(consentStr) as ConsentPreferences
  
  if (consent.analytics || consent.marketing) {
    trackVisitor(consent)
    trackPageView(consent)
  }
}

// Placeholder for Google Analytics integration (to be added later)
export function initGoogleAnalytics(_measurementId: string) {
  // TODO: Add Google Analytics GA4 tracking code when measurement ID is provided
  // Measurement ID received: _measurementId (stored for future implementation)
  
  // Add GA4 script to document head
  // const script = document.createElement('script')
  // script.src = `https://www.googletagmanager.com/gtag/js?id=${_measurementId}`
  // script.async = true
  // document.head.appendChild(script)
  
  // window.dataLayer = window.dataLayer || []
  // function gtag(...args: any[]) {
  //   window.dataLayer.push(arguments)
  // }
  // gtag('js', new Date())
  // gtag('config', _measurementId)
}


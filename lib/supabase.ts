import { createClient } from '@supabase/supabase-js'
import Cookies from 'js-cookie'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// ✅ Analytics için tracking fonksiyonu
export async function trackEvent(eventName: string, properties?: any) {
  
  // Tarayıcıda mı kontrol et
  if (typeof window === 'undefined') {
    return null
  }

  // Çerez onayı kontrolü - DÜZELTME: Cookie'den direkt oku
  const cookieConsent = Cookies.get('userCookieConsent')
  const analyticsEnabled = localStorage.getItem('supabase_analytics_enabled')
  
  
  // Hem cookie hem localStorage kontrolü
  if (cookieConsent !== 'true' || analyticsEnabled !== 'true') {
    return null
  }


  try {
    const eventData = {
      event_name: eventName,
      properties: properties || {},
      user_agent: navigator.userAgent,
      page_url: window.location.href,
      page_path: window.location.pathname,  // ✅ Yeni kolon eklediyseniz
      referrer: document.referrer || null,   // ✅ Yeni kolon eklediyseniz
      created_at: new Date().toISOString()
    }


    const { data, error } = await supabase
      .from('analytics_events')
      .insert(eventData)
      .select()


    return data

  } catch (error) {
    return null
  }
}

// ✅ Consent durumunu kontrol et (yardımcı fonksiyon)
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  
  const cookieConsent = Cookies.get('userCookieConsent')
  const analyticsEnabled = localStorage.getItem('supabase_analytics_enabled')
  
  return cookieConsent === 'true' && analyticsEnabled === 'true'
}
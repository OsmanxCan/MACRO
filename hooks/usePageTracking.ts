// hooks/usePageTracking.ts
'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/supabase';

interface PageTrackingOptions {
  pageName: string;
  pageTitle: string;
  additionalData?: Record<string, any>;
}

export function usePageTracking({ pageName, pageTitle, additionalData }: PageTrackingOptions) {
  // Sayfa başına sadece 1 kere tracking yapmak için
  const hasTracked = useRef(false);

  useEffect(() => {
    // Eğer daha önce tracking yapıldıysa, tekrar yapma
    if (hasTracked.current) {
      return;
    }

    // İlk tracking'i işaretle
    hasTracked.current = true;

    // Supabase tracking
    trackEvent('page_view', {
      page: pageName,
      page_title: pageTitle,
      ...additionalData
    });

    // Google Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }


    // Cleanup yok - çünkü sadece 1 kere çalışmasını istiyoruz
  }, []); // Boş dependency array - sadece component mount'ta çalışır
}
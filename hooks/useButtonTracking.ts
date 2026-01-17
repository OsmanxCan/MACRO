// hooks/useButtonTracking.ts
'use client';

import { trackEvent } from '@/lib/supabase';
import { useCallback } from 'react';

interface ButtonTrackingOptions {
  buttonName: string;
  section: string;
  page: string;
  additionalData?: Record<string, any>;
}

export function useButtonTracking() {
  // useCallback ile fonksiyonu memoize et - gereksiz re-render'ları önle
  const trackClick = useCallback(({ buttonName, section, page, additionalData }: ButtonTrackingOptions) => {

    // Supabase tracking
    trackEvent('button_click', {
      button_name: buttonName,
      section: section,
      page: page,
      timestamp: new Date().toISOString(),
      ...additionalData
    });

    // Google Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Button',
        event_label: `${section} - ${buttonName}`,
        page: page
      });
    }
  }, []); // Boş dependency - fonksiyon hiç değişmez

  return { trackClick };
}
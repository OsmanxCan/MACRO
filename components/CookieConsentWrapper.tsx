// components/CookieConsentWrapper.tsx
'use client';

import CookieConsent from "react-cookie-consent";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function CookieConsentWrapper() {
  const [showDetails, setShowDetails] = useState(false);

  // Sayfa yüklendiğinde mevcut consent durumunu kontrol et
  useEffect(() => {
    const consent = Cookies.get('userCookieConsent');
    
    if (consent === 'true') {
      enableAnalytics();
    } else if (consent === 'false') {
      disableAnalytics();
    } else {
      // Varsayılan olarak analytics kapalı (GDPR uyumu)
      disableAnalytics();
    }
  }, []);

  const enableAnalytics = () => {

    // Google Analytics consent güncelle
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'denied' // Reklam çerezleri yine kapalı
      });
      
      // İlk sayfa görüntüleme olayını gönder
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }

    // Supabase Analytics için flag
    if (typeof window !== 'undefined') {
      localStorage.setItem('supabase_analytics_enabled', 'true');
    }
    
  };

  const disableAnalytics = () => {

    // Google Analytics consent güncelle
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      });
    }

    // Supabase Analytics'i devre dışı bırak
    if (typeof window !== 'undefined') {
      localStorage.setItem('supabase_analytics_enabled', 'false');
    }
    
  };

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Tümünü Kabul Et"
        declineButtonText="Tümünü Reddet"
        enableDeclineButton
        cookieName="userCookieConsent"
        cookieValue="true"
        declineCookieValue="false"
        style={{ 
          background: "#1f2937",
          padding: "20px",
          alignItems: "center",
          zIndex: 9999
        }}
        buttonStyle={{ 
          background: "#3b82f6", 
          color: "white",
          fontSize: "14px",
          borderRadius: "8px",
          padding: "12px 24px",
          fontWeight: "600",
          border: "none",
          cursor: "pointer"
        }}
        declineButtonStyle={{
          background: "#6b7280",
          color: "white",
          fontSize: "14px",
          borderRadius: "8px",
          padding: "12px 24px",
          fontWeight: "600",
          border: "none",
          cursor: "pointer"
        }}
        expires={365}
        onAccept={enableAnalytics}
        onDecline={disableAnalytics}
        setDeclineCookie={true}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🍪</span>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">
                Çerez Politikası
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Web sitemiz, kullanıcı deneyimini geliştirmek ve site trafiğini analiz etmek için çerezler kullanmaktadır. 
                KVKK kapsamında kişisel verileriniz güvenli bir şekilde işlenmektedir.
              </p>
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-400 hover:text-blue-300 text-sm mt-2 underline"
              >
                {showDetails ? 'Detayları Gizle' : 'Detaylı Bilgi'}
              </button>

              {showDetails && (
                <div className="mt-3 p-3 bg-gray-800 rounded-lg text-sm">
                  <div className="mb-3">
                    <h4 className="text-white font-semibold mb-1">📊 Analitik Çerezler</h4>
                    <p className="text-gray-400 text-xs">
                      Google Analytics ve Supabase Analytics ile site kullanımını analiz ediyoruz.
                      Sayfa görüntülemeleri, tıklamalar ve kullanıcı akışı izlenmektedir.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">🔒 Veri Güvenliği</h4>
                    <p className="text-gray-400 text-xs">
                      Toplanan veriler anonim olup, 3. kişilerle paylaşılmamaktadır.
                      KVKK ve GDPR standartlarına uygun işlenmektedir.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CookieConsent>
    </>
  );
}
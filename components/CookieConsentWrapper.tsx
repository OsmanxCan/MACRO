'use client';

import { useState, useEffect, useRef } from "react";
import { X, Cookie, Shield, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import gsap from "gsap";
import Cookies from "js-cookie";

declare global {
  interface Window {
    gtag: (
      command: "set" | "config" | "event" | "consent" | "js",
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

export default function CookieConsentWrapper() {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const consentRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const cookieIconRef = useRef<HTMLDivElement>(null);

  // Sayfa yüklendiğinde mevcut consent durumunu kontrol et
  useEffect(() => {
    const consent = Cookies.get('userCookieConsent');
    
    if (consent === 'true') {
      enableAnalytics();
      setShowConsent(false);
    } else if (consent === 'false') {
      disableAnalytics();
      setShowConsent(false);
    } else {
      // Varsayılan olarak analytics kapalı (GDPR uyumu)
      disableAnalytics();
      setShowConsent(true);
      // Animate in after a short delay
      setTimeout(() => {
        animateIn();
      }, 500);
    }
  }, []);

  useEffect(() => {
    // Cookie icon rotation animation
    if (cookieIconRef.current && showConsent) {
      gsap.to(cookieIconRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });
    }
  }, [showConsent]);

  useEffect(() => {
    if (showDetails && detailsRef.current) {
      gsap.fromTo(detailsRef.current,
        { 
          height: 0, 
          opacity: 0,
          y: -20
        },
        { 
          height: "auto", 
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out"
        }
      );
    }
  }, [showDetails]);

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

  const animateIn = () => {
    if (consentRef.current) {
      gsap.fromTo(consentRef.current,
        { 
          y: 100, 
          opacity: 0,
          scale: 0.9
        },
        { 
          y: 0, 
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.4)"
        }
      );
    }
  };

  const animateOut = () => {
    if (consentRef.current) {
      gsap.to(consentRef.current, {
        y: 100,
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: "back.in(1.4)",
        onComplete: () => {
          setShowConsent(false);
        }
      });
    }
  };

  const handleAccept = () => {
    Cookies.set('userCookieConsent', 'true', { expires: 365 });
    enableAnalytics();
    animateOut();
  };

  const handleDecline = () => {
    Cookies.set('userCookieConsent', 'false', { expires: 365 });
    disableAnalytics();
    animateOut();
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center p-4 sm:p-6">
      <div 
        ref={consentRef}
        className="pointer-events-auto w-full max-w-2xl"
      >
        <div className="relative overflow-hidden rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 shadow-2xl backdrop-blur-xl">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-500 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div 
                ref={cookieIconRef}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
              >
                <Cookie className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  Çerez Tercihleriniz
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Web sitemiz, kullanıcı deneyimini geliştirmek ve site trafiğini analiz etmek için çerezler kullanmaktadır. 
                  KVKK kapsamında kişisel verileriniz güvenli bir şekilde işlenmektedir.
                </p>
              </div>

              <button
                onClick={handleDecline}
                className="flex-shrink-0 rounded-full p-2 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details Toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="group flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors mb-4"
            >
              <span>Detaylı Bilgi</span>
              {showDetails ? (
                <ChevronUp className="w-4 h-4 transition-transform group-hover:translate-y-[-2px]" />
              ) : (
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-[2px]" />
              )}
            </button>

            {/* Details Content */}
            {showDetails && (
              <div ref={detailsRef} className="mb-6 space-y-4 overflow-hidden">
                <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1 text-white">Analitik Çerezler</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Google Analytics ve Supabase Analytics ile site kullanımını analiz ediyoruz.
                        Sayfa görüntülemeleri, tıklamalar ve kullanıcı akışı izlenmektedir.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1 text-white">Veri Güvenliği</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Toplanan veriler anonim olup, 3. kişilerle paylaşılmamaktadır.
                        KVKK ve GDPR standartlarına uygun işlenmektedir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDecline}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm border-2 border-gray-600 bg-gray-800 hover:bg-gray-700 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Tümünü Reddet
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                Tümünü Kabul Et
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
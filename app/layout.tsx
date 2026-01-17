import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import CookieConsentWrapper from "@/components/CookieConsentWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MACRO",
  description: "Teknoloji Topluluğu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_MEASUREMENT_ID = 'G-6K9360JHZ6';
  return (
    <html lang="en">
      <head>
        {/* Google Analytics - Consent Mode ile */}
        <Script id="google-analytics-consent" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Varsayılan olarak reddet
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied'
            });
            
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`
        ${geistSans.variable}
        ${geistMono.variable}
        min-h-screen
        bg-background
        text-foreground
        antialiased
      `}
      >
        <ThemeProvider>
          {children}
          <CookieConsentWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}

// types/global.d.ts (proje kök dizininde oluştur)
export {};

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'consent' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}
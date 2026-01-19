"use client"

import { ShieldAlert, LogOut, Mail, AlertCircle, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createSupabaseClient } from '@/lib/supabase/client'
import Navbar from "@/components/navbar"
import Footer from "@/components/Footer"

export default function AccountSuspendedClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Sayfa yüklendiğinde otomatik logout yap
  useEffect(() => {
    const autoLogout = async () => {
      const supabase = createSupabaseClient()
      await supabase.auth.signOut()
    }
    
    autoLogout()
  }, [])

  const handleLogout = async () => {
    setLoading(true)
    try {
      const supabase = createSupabaseClient()
      await supabase.auth.signOut()
      
      // Logout başarılı, giriş sayfasına yönlendir
      router.push('/giris')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Ana Kart */}
        <Card className="border-destructive/50 shadow-lg">
          <CardHeader className="text-center space-y-6 pb-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center ring-4 ring-destructive/20">
              <ShieldAlert className="w-10 h-10 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-destructive">
                Hesap Askıya Alındı
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Hesabınız yöneticiler tarafından geçici olarak askıya alınmıştır
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Uyarı Mesajı */}
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erişim Kısıtlandı</AlertTitle>
              <AlertDescription>
                Şu anda platformumuza erişiminiz kısıtlanmıştır. Bu durum geçici olabilir ve inceleme sürecindedir.
              </AlertDescription>
            </Alert>

            <Separator />

            {/* Olası Nedenler */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                Bu Durumun Olası Nedenleri
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2" />
                  <span>Topluluk kurallarına aykırı davranış veya içerik paylaşımı</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2" />
                  <span>Güvenlik endişeleri veya şüpheli aktivite tespiti</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2" />
                  <span>Bekleyen yönetimsel inceleme süreci</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2" />
                  <span>Hesap doğrulama veya kimlik teyidi gereksinimleri</span>
                </li>
              </ul>
            </div>

            <Separator />

            {/* İletişim Kartı */}
            <Card className="bg-muted/50 border-muted">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      Yardım mı Gerekiyor?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Hesabınızın durumu hakkında bilgi almak veya itirazda bulunmak için yönetim ekibimizle iletişime geçebilirsiniz.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-sm text-muted-foreground">İletişim:</span>
                      <a 
                        href="mailto:destek@ocbstd.com" 
                        className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                      >
                        destek@ocbstd.com
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button 
              onClick={handleGoHome}
              variant="outline"
              className="w-full sm:w-1/2"
            >
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Button>
            <Button 
              onClick={handleLogout}
              variant="default"
              className="w-full sm:w-1/2"
              disabled={loading}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {loading ? "Çıkış yapılıyor..." : "Giriş Sayfasına Dön"}
            </Button>
          </CardFooter>
        </Card>

        {/* Alt Bilgi */}
        <p className="text-center text-xs text-muted-foreground">
          Bu karar hakkında bilgi almak için lütfen destek ekibimizle iletişime geçin
        </p>
      </div>
    </div>
    <Footer />
    </>
  )
}
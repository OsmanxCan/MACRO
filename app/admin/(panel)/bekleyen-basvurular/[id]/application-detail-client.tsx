// app/admin/bekleyen-basvurular/[id]/application-detail-client.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  CheckCircle, 
  XCircle, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  GraduationCap,
  Briefcase,
  Heart,
  FileText,
  ExternalLink,
  Linkedin,
  Github,
  Instagram,
  ArrowLeft,
  Target
} from "lucide-react"
import { emailTemplates } from '@/src/lib/email-templates'

interface ApplicationDetailClientProps {
  application: any
}

export default function ApplicationDetailClient({ application }: ApplicationDetailClientProps) {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const [processing, setProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  const handleApprove = async () => {
    if (!confirm('Bu başvuruyu onaylamak istediğinize emin misiniz?')) return

    setProcessing(true)
    try {
      // Başvuruyu onayla
      const { error: updateError } = await supabase
        .from('membership_applications')
        .update({ 
          status: 'approved',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', application.id)

      if (updateError) {
        console.error('Başvuru güncelleme hatası:', updateError)
        throw updateError
      }

      console.log('Başvuru durumu güncellendi')

      // // Kullanıcının rolünü güncelle
      // const { error: profileError } = await supabase
      //   .from('profiles')
      //   .update({ role: 'member' })
      //   .eq('id', application.user_id)

      // if (profileError) {
      //   console.error('Profil güncelleme hatası:', profileError)
      //   throw profileError
      // }

      // console.log('Kullanıcı rolü güncellendi')

      // Onay emaili gönder
      try {
        const emailTemplate = emailTemplates.membershipApproved(application.full_name)
        
        console.log('Email gönderiliyor:', application.email)
        
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: application.email,
            subject: emailTemplate.subject,
            htmlContent: emailTemplate.htmlContent,
            type: 'membership_approved'
          })
        })

        const emailResult = await emailResponse.json()
        
        if (!emailResponse.ok) {
          console.error('Email API hatası:', emailResult)
          // Email başarısız olsa bile devam et
        } else {
          console.log('Email başarıyla gönderildi:', emailResult)
        }
      } catch (emailError) {
        console.error('Email gönderme hatası:', emailError)
        // Email hatası olsa bile işleme devam et
      }

      alert('Başvuru başarıyla onaylandı!')
      router.push('/admin/bekleyen-basvurular')
      router.refresh()
    } catch (error: any) {
      console.error('Genel onaylama hatası:', error)
      alert('Bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'))
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Lütfen red nedeni belirtin')
      return
    }

    if (!confirm('Bu başvuruyu reddetmek istediğinize emin misiniz?')) return

    setProcessing(true)
    try {
      const { error } = await supabase
        .from('membership_applications')
        .update({ 
          status: 'rejected',
          rejection_reason: rejectionReason,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', application.id)

      if (error) {
        console.error('Başvuru reddetme hatası:', error)
        throw error
      }

      console.log('Başvuru reddedildi')

      // Red emaili gönder
      try {
        const emailTemplate = emailTemplates.membershipRejected(application.full_name, rejectionReason)
        
        console.log('Red emaili gönderiliyor:', application.email)
        
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: application.email,
            subject: emailTemplate.subject,
            htmlContent: emailTemplate.htmlContent,
            type: 'membership_rejected'
          })
        })

        const emailResult = await emailResponse.json()
        
        if (!emailResponse.ok) {
          console.error('Email API hatası:', emailResult)
        } else {
          console.log('Red emaili başarıyla gönderildi:', emailResult)
        }
      } catch (emailError) {
        console.error('Email gönderme hatası:', emailError)
      }

      alert('Başvuru reddedildi')
      router.push('/admin/bekleyen-basvurular')
      router.refresh()
    } catch (error: any) {
      console.error('Reddetme hatası:', error)
      alert('Bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'))
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Başlık ve Geri Butonu */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Başvuru Detayı</h1>
          <p className="text-muted-foreground">
            {application.full_name} - {new Date(application.created_at).toLocaleDateString('tr-TR')}
          </p>
        </div>
      </div>

      {/* Durum */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Başvuru Durumu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="text-lg py-2 px-4">
            {application.status === 'pending' ? 'İnceleniyor' :
             application.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
          </Badge>
        </CardContent>
      </Card>

      {/* Kişisel Bilgiler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Kişisel Bilgiler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Ad Soyad</p>
                <p className="font-medium">{application.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{application.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Telefon</p>
                <p className="font-medium">{application.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Öğrenci No</p>
                <p className="font-medium">{application.student_number || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Bölüm</p>
                <p className="font-medium">{application.department || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Sınıf</p>
                <p className="font-medium">{application.grade || '-'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yetenekler ve İlgi Alanları */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Yetenekler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{application.skills}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              İlgi Alanları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{application.interests}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Proje İsteği
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{application.project_preference}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Beceri Değerlendirmesi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-md font-semibold whitespace-pre-wrap">{"İletişim Becerisi: " + application.communication_skills}</p>
            <p className="text-md font-semibold whitespace-pre-wrap">{"Takım Çalışması: " + application.teamwork_skills}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kendini Tanıtma</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{application.self_introduction}</p>
        </CardContent>
      </Card>

      {/* Motivasyon */}
      <Card>
        <CardHeader>
          <CardTitle>Neden Katılmak İstiyor?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{application.why_join}</p>
        </CardContent>
      </Card>

      {/* Deneyim */}
      {application.experience && (
        <Card>
          <CardHeader>
            <CardTitle>Deneyimler</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{application.experience}</p>
          </CardContent>
        </Card>
      )}

      {/* Sosyal Medya */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Sosyal Medya & Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {application.social_media?.linkedin && (
            <a 
              href={application.social_media.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          )}
          {application.social_media?.github && (
            <a 
              href={application.social_media.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:underline"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
          {application.social_media?.instagram && (
            <p className="flex items-center gap-2 text-pink-600">
              <Instagram className="h-4 w-4" />
              {application.social_media.instagram}
            </p>
          )}
          {application.portfolio_url && (
            <a 
              href={application.portfolio_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-600 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Portfolio
            </a>
          )}
          {!application.social_media?.linkedin && 
           !application.social_media?.github && 
           !application.social_media?.instagram && 
           !application.portfolio_url && (
            <p className="text-sm text-muted-foreground">Bilgi yok</p>
          )}
        </CardContent>
      </Card>

      {/* İşlem Butonları */}
      {application.status === 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>İşlemler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showRejectForm ? (
              <div className="flex gap-4">
                <Button 
                  onClick={handleApprove} 
                  disabled={processing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Başvuruyu Onayla
                </Button>
                <Button 
                  onClick={() => setShowRejectForm(true)} 
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Başvuruyu Reddet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason">Reddetme Nedeni *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Başvurunun neden reddedildiğini açıklayın..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-4">
                  <Button 
                    onClick={handleReject} 
                    disabled={processing || !rejectionReason.trim()}
                    variant="destructive"
                    className="flex-1"
                  >
                    Reddetmeyi Onayla
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowRejectForm(false)
                      setRejectionReason('')
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    İptal
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
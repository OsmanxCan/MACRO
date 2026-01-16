'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/hooks/useAuth'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Hash, 
  Building2,
  Edit,
  LogOut,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Camera,      
  Upload,     
  Shield 
} from 'lucide-react'
import { toast } from 'sonner'
import Footer from '@/components/Footer'

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  username: string
  role: string
  department: string | null
  grade: string | null
  student_number: string | null
  phone: string | null
  avatar_url: string | null
  is_active: boolean | null
}

interface Application {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  reviewed_at: string | null
  rejection_reason: string | null
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState<Application | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [username, setUsername] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  
  // Form states
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('')
  const [grade, setGrade] = useState('')
  const [studentNumber, setStudentNumber] = useState('')
  
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/giris')
      return
    }
    loadProfile()
    checkApplication()
  }, [user, authLoading, router])

  const loadProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Profil yüklenirken hata:', error)
        setProfile({
          id: user.id,
          email: user.email || null,
          username: user.email?.split('@')[0] || 'kullanici',
          full_name: null,
          role: 'guest',
          department: null,
          grade: null,
          student_number: null,
          phone: null,
          avatar_url: null,
          is_active: true
        })
      } else {
        setProfile(data)
        // Form state'lerini güncelle
        setFullName(data.full_name || '')
        setPhone(data.phone || '')
        setDepartment(data.department || '')
        setGrade(data.grade || '')
        setStudentNumber(data.student_number || '')
        setUsername(data.username || '')
      }
    } catch (error) {
      console.error('Profil yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkApplication = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('membership_applications')
        .select('id, status, created_at, reviewed_at, rejection_reason')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Başvuru kontrol hatası:', error)
        setApplication(null)
        return
      }

      setApplication(data)
    } catch (error) {
      console.error('Başvuru kontrol hatası:', error)
      setApplication(null)
    }
  }

  const checkUsernameAvailability = async (newUsername: string) => {
    if (!newUsername || newUsername === profile?.username) {
      setIsUsernameAvailable(true)
      return
    }

    setCheckingUsername(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', newUsername.toLowerCase())
        .maybeSingle()

      setIsUsernameAvailable(!data)
    } catch (error) {
      console.error('Username kontrol hatası:', error)
      setIsUsernameAvailable(false)
    } finally {
      setCheckingUsername(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Dosya boyutu kontrolü (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Dosya boyutu çok büyük', {
        description: 'Maksimum 2MB boyutunda resim yükleyebilirsiniz.'
      })
      return
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      toast.error('Geçersiz dosya tipi', {
        description: 'Sadece resim dosyaları yükleyebilirsiniz.'
      })
      return
    }

    setUploadingAvatar(true)

    try {
      // Eski avatarı sil
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop()
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldPath}`])
        }
      }

      // Yeni dosya adı
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      // Dosyayı yükle
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Public URL al
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Profili güncelle
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast.success('Profil fotoğrafı güncellendi')
      loadProfile()
    } catch (error) {
      console.error('Avatar yükleme hatası:', error)
      toast.error('Profil fotoğrafı yüklenemedi', {
        description: 'Lütfen tekrar deneyin.'
      })
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!user || !profile) return

    // Username kontrolü - DEĞİŞTİRİLDİ
    if (username !== profile.username && !isUsernameAvailable) {
      toast.error('Bu kullanıcı adı kullanımda', {
        description: 'Lütfen farklı bir kullanıcı adı seçin.'
      })
      return
    }

    setIsSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName || null,
          phone: phone || null,
          department: department || null,
          grade: grade || null,
          student_number: studentNumber || null,
          username: username.toLowerCase(), // EKLE
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Profil başarıyla güncellendi', {
        description: 'Bilgileriniz kaydedildi.'
      })
      
      setIsEditOpen(false)
      loadProfile()
    } catch (error) {
      console.error('Profil güncelleme hatası:', error)
      toast.error('Profil güncellenemedi', {
        description: 'Lütfen tekrar deneyin.'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Çıkış yapıldı')
    router.push('/giris')
  }

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      'super_admin': 'Süper Admin',
      'admin': 'Yönetici',
      'moderator': 'Moderatör',
      'member': 'Üye',
      'user': 'Kullanıcı',
      'guest': 'Misafir'
    }
    return roles[role] || 'Kullanıcı'
  }

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'super_admin': return 'destructive'
      case 'admin': return 'default'
      case 'moderator': return 'secondary'
      default: return 'outline'
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Profil Başlığı Kartı */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                 <div className="relative group">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl">
                      {profile.full_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Upload overlay */}
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    ) : (
                      <Camera className="h-6 w-6 text-white" />
                    )}
                  </label>
                  
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold">
                    {profile.full_name || profile.username || 'Kullanıcı'}
                  </h1>
                  <p className="text-muted-foreground mt-1">@{profile.username}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    <Badge variant={getRoleBadgeVariant(profile.role)}>
                      {getRoleLabel(profile.role)}
                    </Badge>
                    {profile.is_active && (
                      <Badge variant="default" className="bg-green-500">
                        Aktif
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* YÖNETİM PANELİ BUTONU */}
                  {(profile.role === 'admin' || profile.role === 'moderator' || profile.role === 'super_admin') && (
                    <Button variant="default" asChild>
                      <Link href="/admin/dashboard">
                        <Shield className="h-4 w-4 mr-2" />
                        Yönetim Paneli
                      </Link>
                    </Button>
                  )}
                  <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Profili Düzenle</DialogTitle>
                        <DialogDescription>
                          Profil bilgilerinizi güncelleyin
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        {/* USERNAME ALANI*/}
                        <div className="space-y-2">
                          <Label htmlFor="username">Kullanıcı Adı</Label>
                          <div className="relative">
                            <Input
                              id="username"
                              value={username}
                              onChange={(e) => {
                                const newUsername = e.target.value.replace(/[^a-zA-Z0-9_]/g, '')
                                setUsername(newUsername)
                                if (newUsername !== profile.username) {
                                  checkUsernameAvailability(newUsername)
                                }
                              }}
                              placeholder="kullanici_adi"
                              className={!isUsernameAvailable ? 'border-red-500' : ''}
                            />
                            {checkingUsername && (
                              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                          </div>
                          {!isUsernameAvailable && username !== profile.username && (
                            <p className="text-xs text-red-500">Bu kullanıcı adı kullanımda</p>
                          )}
                          {isUsernameAvailable && username !== profile.username && username && (
                            <p className="text-xs text-green-500">Kullanılabilir ✓</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Ad Soyad</Label>
                          <Input
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ad Soyad"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefon</Label>
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0555 555 5555"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="department">Bölüm</Label>
                          <Input
                            id="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="Bilgisayar Mühendisliği"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="grade">Sınıf</Label>
                            <Input
                              id="grade"
                              value={grade}
                              onChange={(e) => setGrade(e.target.value)}
                              placeholder="3"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="studentNumber">Öğrenci No</Label>
                            <Input
                              id="studentNumber"
                              value={studentNumber}
                              onChange={(e) => setStudentNumber(e.target.value)}
                              placeholder="20210001"
                            />
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                          İptal
                        </Button>
                        <Button onClick={handleUpdateProfile} disabled={isSaving}>
                          {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Kaydet
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="destructive" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bilgiler Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Kişisel Bilgiler */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Kişisel Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">E-posta</p>
                    <p className="font-medium">{profile.email || '-'}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Telefon</p>
                    <p className="font-medium">{profile.phone || '-'}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Kullanıcı Adı</p>
                    <p className="font-medium">@{profile.username}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eğitim Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Eğitim Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Bölüm</p>
                    <p className="font-medium">{profile.department || '-'}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Sınıf</p>
                    <p className="font-medium">{profile.grade || '-'}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Öğrenci Numarası</p>
                    <p className="font-medium">{profile.student_number || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Üyelik Başvurusu Kartı */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Üyelik Başvurusu
              </CardTitle>
              <CardDescription>
                Topluluğumuza katılım durumunuz
              </CardDescription>
            </CardHeader>
            <CardContent>
              {application ? (
                <div>
                  {/* Beklemede */}
                  {application.status === 'pending' && (
                    <div className="flex items-start gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                          Başvurunuz İnceleniyor
                        </p>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Başvurunuz {new Date(application.created_at).toLocaleDateString('tr-TR')} tarihinde alındı. 
                          Yöneticilerimiz en kısa sürede değerlendirecektir.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Onaylandı */}
                  {application.status === 'approved' && (
                    <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-green-900 dark:text-green-100 mb-1">
                          Başvurunuz Onaylandı!
                        </p>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Tebrikler! Başvurunuz {application.reviewed_at ? new Date(application.reviewed_at).toLocaleDateString('tr-TR') : ''} tarihinde onaylandı. 
                          Artık topluluğumuzun bir üyesisiniz.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Reddedildi */}
                  {application.status === 'rejected' && (
                    <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900 dark:text-red-100 mb-2">
                          Başvurunuz Reddedildi
                        </p>
                        {application.rejection_reason && (
                          <div className="bg-white dark:bg-gray-800 rounded p-3 mb-3 border">
                            <p className="text-sm font-medium mb-1">Red Nedeni:</p>
                            <p className="text-sm text-muted-foreground">{application.rejection_reason}</p>
                          </div>
                        )}
                        <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                          Başvurunuz {application.reviewed_at ? new Date(application.reviewed_at).toLocaleDateString('tr-TR') : ''} tarihinde değerlendirildi.
                        </p>
                        <Button asChild variant="default">
                          <Link href="/basvuru">
                            Yeniden Başvur
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Topluluğumuza katılmak için başvuru formunu doldurabilirsiniz. 
                    Başvurunuz yöneticilerimiz tarafından değerlendirilecektir.
                  </p>
                  
                  <Button asChild>
                    <Link href="/basvuru">
                      <FileText className="h-4 w-4 mr-2" />
                      Başvuru Formunu Doldur
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* FOOTER */}
      <Footer />
    </div>
  )
}
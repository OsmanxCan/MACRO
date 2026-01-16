// app/admin/kullanicilar/[id]/page.tsx
import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, GraduationCap, Calendar, User, Shield } from "lucide-react"
import Link from "next/link"
import RoleChangeButton from "./role-change-button"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserProfilePage({ params }: PageProps) {
  // params'ı await ile bekle
  const { id } = await params
  
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  // Mevcut kullanıcının rolünü kontrol et
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (me?.role !== 'admin' && me?.role !== 'super_admin') {
    redirect("/")
  }

  // Profil bilgilerini çek - artık id'yi doğrudan kullanabilirsiniz
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !profile) {
    redirect("/admin/kullanicilar")
  }

  const getUserInitials = (name: string, email: string) => {
    if (name) return name.substring(0, 2).toUpperCase()
    return email.substring(0, 2).toUpperCase()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive'
      case 'admin': return 'default'
      case 'moderator': return 'secondary'
      default: return 'outline'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Süper Admin'
      case 'admin': return 'Admin'
      case 'moderator': return 'Moderatör'
      case 'member': return 'Üye'
      default: return 'Kullanıcı'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Geri Dön Butonu */}
      <div>
        <Link href="/admin/kullanicilar">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kullanıcılara Geri Dön
          </Button>
        </Link>
      </div>

      {/* Profil Başlığı */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {getUserInitials(profile.full_name || '', profile.email || '')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {profile.full_name || 'İsimsiz Kullanıcı'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              @{profile.username || 'kullanici'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getRoleBadgeVariant(profile.role)}>
                {getRoleLabel(profile.role)}
              </Badge>
              <Badge variant={profile.is_active ? 'default' : 'secondary'}>
                {profile.is_active ? 'Aktif' : 'Pasif'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Rol Değiştirme Butonu */}
        <RoleChangeButton
          userId={profile.id}
          currentRole={profile.role}
          myRole={me?.role || 'user'}
          myUserId={user.id}
        />
      </div>

      {/* Bilgi Kartları */}
      <div className="grid gap-6 md:grid-cols-2">
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
              <div>
                <p className="text-sm text-muted-foreground">E-posta</p>
                <p className="font-medium">{profile.email || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Telefon</p>
                <p className="font-medium">{profile.phone || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Öğrenci Numarası</p>
                <p className="font-medium">{profile.student_number || '-'}</p>
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
            <div>
              <p className="text-sm text-muted-foreground">Bölüm</p>
              <p className="font-medium">{profile.department || '-'}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Sınıf</p>
              <p className="font-medium">{profile.grade || '-'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Hesap Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Hesap Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Kayıt Tarihi</p>
              <p className="font-medium">{formatDate(profile.created_at)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Son Güncelleme</p>
              <p className="font-medium">{formatDate(profile.updated_at)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Hesap Durumu</p>
              <Badge variant={profile.is_active ? 'default' : 'secondary'}>
                {profile.is_active ? 'Aktif' : 'Pasif'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Yetki Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Yetki Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Mevcut Rol</p>
              <Badge variant={getRoleBadgeVariant(profile.role)} className="mt-1">
                {getRoleLabel(profile.role)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
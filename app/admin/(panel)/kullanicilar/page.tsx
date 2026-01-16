// app/admin/kullanicilar/page.tsx
import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, UserX, Eye } from "lucide-react"
import Link from "next/link"

export default async function KullanicilarPage() {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (me?.role !== 'admin' && me?.role !== 'super_admin') {
    redirect("/")
  }

  // Tüm kullanıcıları çek
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  // İstatistikler
  const totalUsers = profiles?.length || 0
  const activeUsers = profiles?.filter(p => p.is_active)?.length || 0
  const inactiveUsers = totalUsers - activeUsers

  const getUserInitials = (name: string, email: string) => {
    if (name) return name.substring(0, 2).toUpperCase()
    return email.substring(0, 2).toUpperCase()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Kullanıcı Yönetimi
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Sistemdeki tüm kullanıcıları görüntüleyin ve yönetin
        </p>
      </div>

      {/* İstatistikler */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Kullanıcı
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktif Kullanıcılar
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pasif Kullanıcılar
            </CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Kullanıcılar Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle>Tüm Kullanıcılar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Bölüm</TableHead>
                <TableHead>Sınıf</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Kayıt Tarihi</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!profiles || profiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    Henüz kullanıcı yok
                  </TableCell>
                </TableRow>
              ) : (
                profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={profile.avatar_url} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getUserInitials(profile.full_name || '', profile.email || '')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{profile.full_name || 'İsimsiz'}</div>
                          <div className="text-sm text-muted-foreground">
                            @{profile.username || 'kullanici'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{profile.email || '-'}</TableCell>
                    <TableCell>{profile.phone || '-'}</TableCell>
                    <TableCell>{profile.department || '-'}</TableCell>
                    <TableCell>{profile.grade || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={
                        profile.role === 'super_admin' ? 'destructive' :
                        profile.role === 'admin' ? 'default' : 
                        profile.role === 'moderator' ? 'secondary' : 'outline'
                      }>
                        {getRoleLabel(profile.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={profile.is_active ? 'default' : 'secondary'}>
                        {profile.is_active ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(profile.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/kullanicilar/${profile.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Detay
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
// app/admin/bekleyen-basvurular/page.tsx
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function BekleyenBasvurularPage() {
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

  // Bekleyen başvuruları çek
  const { data: applications } = await supabase
    .from("membership_applications")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateDaysAgo = (date: string) => {
    const now = new Date()
    const created = new Date(date)
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6 p-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bekleyen Başvurular
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Değerlendirilmeyi bekleyen üyelik başvurularını inceleyin
        </p>
      </div>

      {/* İstatistik */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Bekleyen Başvuru Sayısı
          </CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {applications?.length || 0}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            İnceleme bekliyor
          </p>
        </CardContent>
      </Card>

      {/* Başvurular Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle>Başvuru Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad Soyad</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Bölüm</TableHead>
                <TableHead>Sınıf</TableHead>
                <TableHead>Başvuru Tarihi</TableHead>
                <TableHead>Geçen Süre</TableHead>
                <TableHead>İşlem</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!applications || applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-12 w-12 text-muted-foreground/50" />
                      <p>Bekleyen başvuru bulunmuyor</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => {
                  const daysAgo = calculateDaysAgo(app.created_at)
                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.full_name}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{app.phone}</TableCell>
                      <TableCell>{app.department || '-'}</TableCell>
                      <TableCell>{app.grade || '-'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(app.created_at)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={daysAgo > 3 ? "destructive" : "secondary"}>
                          {daysAgo} gün önce
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="default" asChild>
                          <Link href={`/admin/bekleyen-basvurular/${app.id}`}>
                            İncele
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
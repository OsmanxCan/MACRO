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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DeleteAnnouncementButton from "./delete-button"
import Link from "next/link"
import { Plus, Pencil, ExternalLink, Video } from "lucide-react"

export default async function AnnouncementsPage() {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    redirect("/admin/dashboard")
  }

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Duyuru Yönetimi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Tüm duyuruları görüntüleyin ve yönetin
          </p>
        </div>
        <Link href="/admin/announcements/create">
          <Button size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Yeni Duyuru
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Resim</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>İçerik</TableHead>
              <TableHead className="w-[100px]">Medya</TableHead>
              <TableHead className="w-[150px]">Tarih</TableHead>
              <TableHead className="w-[200px] text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!announcements || announcements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                  Henüz duyuru yok. Yeni bir duyuru oluşturun!
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((announcement) => (
                <TableRow key={announcement.id}>
                  {/* Resim */}
                  <TableCell>
                    {announcement.image_url ? (
                      <img
                        src={announcement.image_url}
                        alt={announcement.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-400">N/A</span>
                      </div>
                    )}
                  </TableCell>

                  {/* Başlık */}
                  <TableCell className="font-medium">
                    <div className="max-w-xs truncate">{announcement.title}</div>
                  </TableCell>

                  {/* İçerik */}
                  <TableCell>
                    <div className="max-w-md line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {announcement.content}
                    </div>
                  </TableCell>

                  {/* Medya Badge'leri */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {announcement.link && (
                        <Badge variant="outline" className="w-fit">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Link
                        </Badge>
                      )}
                      {announcement.video_url && (
                        <Badge variant="outline" className="w-fit">
                          <Video className="w-3 h-3 mr-1" />
                          Video
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Tarih */}
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(announcement.created_at).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>

                  {/* İşlemler */}
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/announcements/edit/${announcement.id}`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="w-4 h-4 mr-1" />
                          Düzenle
                        </Button>
                      </Link>
                      <DeleteAnnouncementButton id={announcement.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats */}
      {announcements && announcements.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Toplam {announcements.length} duyuru</span>
        </div>
      )}
    </div>
  )
}
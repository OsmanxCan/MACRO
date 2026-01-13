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
import Link from "next/link"
import { Plus, Pencil, Calendar } from "lucide-react"
import DeleteEventButton from "./delete-button"
import DOMPurify from "isomorphic-dompurify"

export default async function EventsPage() {
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

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Etkinlik Yönetimi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Tüm etkinlikleri görüntüleyin ve yönetin
          </p>
        </div>
        <Link href="/admin/events/create">
          <Button size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Yeni Etkinlik
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead className="w-[150px]">Tarih</TableHead>
              <TableHead className="w-[120px]">Durum</TableHead>
              <TableHead className="w-[200px] text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!events || events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                  Henüz etkinlik yok. Yeni bir etkinlik oluşturun!
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => {
                const eventDate = new Date(event.date)
                const now = new Date()
                const isPast = eventDate < now

                return (
                  <TableRow key={event.id}>
                    {/* Başlık */}
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div className="max-w-xs truncate">{event.title}</div>
                      </div>
                    </TableCell>

                    {/* Açıklama */}
                    <TableCell>
                      <div
                        className="max-w-md line-clamp-2 text-sm text-gray-600 dark:text-gray-400"
                         dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(event.description || "Açıklama yok"),
                      }}
                      />
                    </TableCell>
                    {/* Tarih */}
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {eventDate.toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>

                    {/* Durum */}
                    <TableCell>
                      <Badge variant={isPast ? "secondary" : "default"}>
                        {isPast ? "Geçmiş" : "Yaklaşan"}
                      </Badge>
                    </TableCell>

                    {/* İşlemler */}
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Link href={`/admin/events/edit/${event.id}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4 mr-1" />
                            Düzenle
                          </Button>
                        </Link>
                        <DeleteEventButton id={event.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats */}
      {events && events.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Toplam {events.length} etkinlik</span>
          <span>
            {events.filter((e) => new Date(e.date) >= new Date()).length} yaklaşan,{" "}
            {events.filter((e) => new Date(e.date) < new Date()).length} geçmiş
          </span>
        </div>
      )}
    </div>
  )
}
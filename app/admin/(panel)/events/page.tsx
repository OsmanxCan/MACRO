// (Server Component)

import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import EventsTable from "./events-table"

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

      <EventsTable events={events || []} />

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
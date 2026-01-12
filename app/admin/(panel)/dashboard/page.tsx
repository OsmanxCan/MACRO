import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { DashboardCard } from "@/components/dashboardCard"

export default async function DashboardPage() {
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

  if (!profile) redirect("/admin/login")

  const role = profile.role

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Admin Dashboard
      </h1>

      {/* SUPER ADMIN */}
      {role === "super_admin" && (
        <div className="grid gap-4">
          <DashboardCard title="Kullanıcı Yönetimi" href="/admin/users" />
          <DashboardCard title="Tüm Ayarlar" href="/admin/settings" />
        </div>
      )}

      {/* ADMIN + SUPER ADMIN */}
      {(role === "admin" || role === "super_admin") && (
        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCard title="Duyurular" href="/admin/announcements" />
          <DashboardCard title="Etkinlikler" href="/admin/events" />
          <DashboardCard title="Hakkında" href="/admin/about" />
        </div>
      )}
    </div>
  )
}

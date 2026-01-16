import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { DashboardCard } from "@/components/dashboardCard"
import { headers } from "next/headers"

export default async function DashboardPage() {
  const headersList = await headers()
  const userId = headersList.get('x-user-id')

  if (!userId) {
    redirect("/admin/login")
  }

  const supabase = await createSupabaseServer()

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single()


  const role = profile?.role || "user"

  // 🔒 GÜVENLİK KONTROLÜ: Sadece moderatör, admin ve super_admin girebilir
  const allowedRoles = ['moderator', 'admin', 'super_admin']
  
  if (!allowedRoles.includes(role)) {
    redirect("/profile") // Yetkisi yoksa profil sayfasına yönlendir
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Yönetim Paneli
      </h1>

      {/* Role bilgisi */}
      <div className="text-sm text-gray-500">
        Rol: {role}
      </div>

      {/* SUPER ADMIN */}
      {role === "super_admin" && (
        <div className="grid gap-4">
          <DashboardCard title="Kullanıcı Yönetimi" href="/admin/kullanicilar" />
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

      {/* MODERATÖR + ADMIN + SUPER ADMIN  ####### YETKİLENDİRME veya GÖREVLENDİRME GÜNCELLEMSİSİ SONRASI AKTİF OLUCAK #######*/} 
      {/* {(role === "moderator" || role === "admin" || role === "super_admin") && (
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <DashboardCard title="İçerik Yönetimi" href="/admin/content" />
          <DashboardCard title="Raporlar" href="/admin/reports" />
        </div>
      )} */}

      {(role === "moderator") && (
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <h1>Henüz Görevlendirilmediniz</h1>
        </div>
      )}
    </div>
  )
}
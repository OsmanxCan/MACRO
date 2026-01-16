import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { createSupabaseServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/admin/app-sidebar"
import ThemeToggle from "@/components/ThemeToggle"
import { headers } from "next/headers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const userId = headersList.get('x-user-id')
  const userEmail = headersList.get('x-user-email')

  if (!userId) {
    redirect("/admin/login")
  }

  const supabase = await createSupabaseServer()

  let userRole = "user"

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()

    if (profile?.role) {
      userRole = profile.role
    }
  } catch (err) {
    console.error("Role fetch error:", err)
  }

  // 🔒 GÜVENLİK KONTROLÜ: Sadece moderatör, admin ve super_admin girebilir
  const allowedRoles = ['moderator', 'admin', 'super_admin']
  
  if (!allowedRoles.includes(userRole)) {
    redirect("/profile") // Yetkisi yoksa profil sayfasına yönlendir
  }

  return (
    <SidebarProvider>
      <AppSidebar userRole={userRole} userEmail={userEmail || ""} />

      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <h2 className="font-semibold">Admin Panel</h2>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
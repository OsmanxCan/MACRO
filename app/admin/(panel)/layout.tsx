// import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
// import { Separator } from "@/components/ui/separator"
// import { createSupabaseServer } from "@/lib/supabase/server"
// import { redirect } from "next/navigation"
// import { AppSidebar } from "@/components/admin/app-sidebar"
// import ThemeToggle from "@/components/ThemeToggle"

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const supabase = await createSupabaseServer()

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   if (!user) {
//     redirect("/admin/login")
//   }

//   const { data: profile } = await supabase
//     .from("profiles")
//     .select("role")
//     .eq("id", user.id)
//     .single()

//   const userRole = profile?.role ?? "admin"
//   const userEmail = user.email ?? ""

//   return (
//     <SidebarProvider>
//       <AppSidebar userRole={userRole} userEmail={userEmail} />

//       <SidebarInset>
//         <header className="flex h-16 items-center justify-between border-b px-4">
//           <div className="flex items-center gap-2">
//             <SidebarTrigger />
//             <Separator orientation="vertical" className="h-4" />
//             <h2 className="font-semibold">Admin Panel</h2>
//           </div>
//           <ThemeToggle />
//         </header>

//         <main className="flex-1 p-6">{children}</main>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/admin/app-sidebar"
import ThemeToggle from "@/components/ThemeToggle"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // Server Component'te cookie setlemeye gerek yok
          // Ama type error'dan kaçınmak için boş implement edilmeli
          cookiesToSet.forEach(({ name, value }) => {
            cookieStore.set(name, value)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Ekstra güvenlik katmanı
  if (!user) {
    redirect("/admin/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  // Role kontrolü de ekleyebilirsiniz
  if (profile?.role !== "admin" && profile?.role !== "moderator") {
    redirect("/") // Yetkisi yoksa ana sayfaya at
  }

  const userRole = profile?.role ?? "admin"
  const userEmail = user.email ?? ""

  return (
    <SidebarProvider>
      <AppSidebar userRole={userRole} userEmail={userEmail} />

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
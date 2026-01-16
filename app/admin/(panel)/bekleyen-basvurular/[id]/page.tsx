// app/admin/bekleyen-basvurular/[id]/page.tsx
import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import ApplicationDetailClient from "./application-detail-client"

export default async function ApplicationDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServer()
  const { id } = await params

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

  // Başvuruyu çek
  const { data: application, error } = await supabase
    .from("membership_applications")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !application) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-300">Başvuru bulunamadı</p>
        </div>
      </div>
    )
  }

  return <ApplicationDetailClient application={application} />
}
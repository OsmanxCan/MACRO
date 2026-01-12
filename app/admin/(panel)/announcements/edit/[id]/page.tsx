import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import EditAnnouncementForm from "./edit-form"

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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

  // params'ı await ile unwrap et
  const { id } = await params

  // Duyuruyu getir
  const { data: announcement, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !announcement) {
    redirect("/admin/announcements")
  }

  return <EditAnnouncementForm announcement={announcement} />
}
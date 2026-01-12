import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import EditEventForm from "./edit-form"

export default async function EditEventPage({
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

  // Etkinliği getir
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !event) {
    redirect("/admin/events")
  }

  return <EditEventForm event={event} />
}
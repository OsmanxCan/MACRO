// (Server Component)

import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import AdminAnalyticsDashboard from "./analytics-client"

export default async function AnalyticsDashboard() {
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

  if (!profile || !["super_admin"].includes(profile.role)) {
    redirect("/admin/dashboard")
  }

  return (
    <div className="">

      <AdminAnalyticsDashboard />

    </div>
  )
}
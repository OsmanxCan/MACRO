import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AboutEditorForm from "./AboutEditorForm"

export default async function AboutManagementPage() {
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

  const { data: about } = await supabase
    .from("about")
    .select("*")
    .limit(1)
    .single()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hakkımızda Yönetimi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {profile.role === "super_admin" ? "Süper Admin" : "Admin"} - Hakkımızda bölümünü düzenleyin
          </p>
        </div>
      </div>

      {/* Editor Card */}
      <Card>
        <CardHeader>
          <CardTitle>Hakkımızda İçeriği</CardTitle>
        </CardHeader>
        <CardContent>
          <AboutEditorForm
            initialData={about} 
            userId={user.id}
            userRole={profile.role}
          />
        </CardContent>
      </Card>
    </div>
  )
}
import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import RoleSelect from "./role-select"
import { Button } from "@/components/ui/button"
import { deleteUser } from "./delete-user"
import AddUser from "./add-user"

export default async function UsersPage() {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (me?.role !== "super_admin") {
    redirect("/admin/dashboard")
  }

  // Admin API ile tüm kullanıcıları çek
  const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()

  // Profilleri çek
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, role, created_at")
    .order("created_at", { ascending: false })

  // Auth users ve profiles'ı birleştir
  const users = authUsers?.users.map((authUser) => {
    const profile = profiles?.find((p) => p.id === authUser.id)
    return {
      id: authUser.id,
      email: authUser.email || "Email yok",
      role: profile?.role || "admin",
      username: profile?.username,
      created_at: authUser.created_at,
    }
  }) || []

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kullanıcı Yönetimi</h1>
        <AddUser />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Kullanıcı Adı</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Henüz kullanıcı yok
              </TableCell>
            </TableRow>
          ) : (
            users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.username || "-"}</TableCell>
                <TableCell>
                  <RoleSelect userId={u.id} role={u.role} />
                </TableCell>
                <TableCell>
                  <form
                    action={async () => {
                      "use server"
                      await deleteUser(u.id)
                    }}
                  >
                    <Button 
                      variant="destructive" 
                      size="sm"
                      disabled={u.id === user.id}
                    >
                      Sil
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
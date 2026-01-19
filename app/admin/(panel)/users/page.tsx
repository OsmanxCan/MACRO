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
import { Button } from "@/components/ui/button"
import { deleteUser } from "./delete-user"
import AddUser from "./add-user"
import { Badge } from "@/components/ui/badge"
import EditUserDialog from "./edit-user-dialog"

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

  // Profilleri çek (TÜM alanlar)
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  // Auth users ve profiles'ı birleştir
  const users = authUsers?.users.map((authUser) => {
    const profile = profiles?.find((p) => p.id === authUser.id)
    return {
      id: authUser.id,
      email: authUser.email || "Email yok",
      role: profile?.role || "user",
      username: profile?.username,
      full_name: profile?.full_name,
      phone: profile?.phone,
      student_number: profile?.student_number,
      department: profile?.department,
      grade: profile?.grade,
      avatar_url: profile?.avatar_url,
      is_active: profile?.is_active ?? true,
      created_at: authUser.created_at,
      updated_at: profile?.updated_at,
    }
  }) || []

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kullanıcı Yönetimi</h1>
        <AddUser />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Durum</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Kullanıcı Adı</TableHead>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Öğrenci No</TableHead>
              <TableHead>Bölüm</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  Henüz kullanıcı yok
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id} className={!u.is_active ? "opacity-50" : ""}>
                  <TableCell>
                    {u.is_active ? (
                      <Badge variant="default">Aktif</Badge>
                    ) : (
                      <Badge variant="destructive">Askıda</Badge>
                    )}
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.username || "-"}</TableCell>
                  <TableCell>{u.full_name || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{u.role}</Badge>
                  </TableCell>
                  <TableCell>{u.student_number || "-"}</TableCell>
                  <TableCell>{u.department || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <EditUserDialog user={u} />
                      
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
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

export default function RoleSelect({
  userId,
  role,
}: {
  userId: string
  role: string
}) {
  const updateRole = async (value: string) => {
    await supabase
      .from("profiles")
      .update({ role: value })
      .eq("id", userId)
  }

  return (
    <Select defaultValue={role} onValueChange={updateRole}>
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="super_admin">Super Admin</SelectItem>
      </SelectContent>
    </Select>
  )
}

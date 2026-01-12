"use client"

import { useState } from "react"
import { createUser } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

type Role = "admin" | "super_admin"

export default function AddUser() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("admin")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    await createUser(email, password, role)
    setEmail("")
    setPassword("")
    setRole("admin")
    setLoading(false)
    location.reload()
  }

  return (
    <div className="flex gap-2 items-end">
      <Input
        placeholder="email@domain.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Select value={role} onValueChange={(v) => setRole(v as Role)}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="super_admin">Super Admin</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={submit} disabled={loading}>
        Ekle
      </Button>
    </div>
  )
}

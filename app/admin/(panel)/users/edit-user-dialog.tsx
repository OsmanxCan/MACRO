"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { updateUserProfile } from "./actions"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"

type UserData = {
  id: string
  email: string
  username: string | null
  full_name: string | null
  phone: string | null
  student_number: string | null
  department: string | null
  grade: string | null
  avatar_url: string | null
  role: string
  is_active: boolean
}

export default function EditUserDialog({ user }: { user: UserData }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    username: user.username || "",
    full_name: user.full_name || "",
    email: user.email || "",
    phone: user.phone || "",
    student_number: user.student_number || "",
    department: user.department || "",
    grade: user.grade || "",
    avatar_url: user.avatar_url || "",
    role: user.role,
    is_active: user.is_active,
  })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await updateUserProfile(user.id, formData)
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Güncelleme hatası:", error)
      alert("Bir hata oluştu!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-1" />
          Düzenle
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kullanıcı Bilgilerini Düzenle</DialogTitle>
          <DialogDescription>
            {user.email} için tüm hesap bilgilerini güncelleyebilirsiniz.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Hesap Durumu */}
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Hesap Durumu</Label>
              <p className="text-sm text-muted-foreground">
                Hesap {formData.is_active ? "aktif" : "askıda"}
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
          </div>

          {/* Rol */}
          <div className="grid gap-2">
            <Label htmlFor="role">Rol</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="moderator">Moderatör</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Kullanıcı Adı */}
          <div className="grid gap-2">
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Ad Soyad */}
          <div className="grid gap-2">
            <Label htmlFor="full_name">Ad Soyad</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
          </div>

          {/* Telefon */}
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          {/* Öğrenci Numarası */}
          <div className="grid gap-2">
            <Label htmlFor="student_number">Öğrenci Numarası</Label>
            <Input
              id="student_number"
              value={formData.student_number}
              onChange={(e) =>
                setFormData({ ...formData, student_number: e.target.value })
              }
            />
          </div>

          {/* Bölüm */}
          <div className="grid gap-2">
            <Label htmlFor="department">Bölüm</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            />
          </div>

          {/* Sınıf */}
          <div className="grid gap-2">
            <Label htmlFor="grade">Sınıf</Label>
            <Input
              id="grade"
              value={formData.grade}
              onChange={(e) =>
                setFormData({ ...formData, grade: e.target.value })
              }
            />
          </div>

          {/* Avatar URL */}
          <div className="grid gap-2">
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input
              id="avatar_url"
              value={formData.avatar_url}
              onChange={(e) =>
                setFormData({ ...formData, avatar_url: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
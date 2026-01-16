// app/admin/kullanicilar/[id]/role-change-button.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Shield, Loader2, AlertTriangle } from "lucide-react"
import { createSupabaseBrowser } from "@/lib/supabase/client"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface RoleChangeButtonProps {
  userId: string
  currentRole: string
  myRole: string
  myUserId: string
}

export default function RoleChangeButton({ userId, currentRole, myRole, myUserId }: RoleChangeButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(currentRole)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  // Kendi kendimizin rolünü değiştirmeyi engelleyelim
  const isOwnProfile = userId === myUserId

  // Süper Admin rolünü sadece süper adminler değiştirebilir
  const canChangeRole = () => {
    // Kendi kendini değiştiremez
    if (isOwnProfile) {
      return false
    }

    // Eğer hedef kullanıcı süper admin ise
    if (currentRole === 'super_admin') {
      // Sadece başka bir süper admin değiştirebilir
      return myRole === 'super_admin'
    }
    
    // Diğer roller için normal yetki kontrolü
    return myRole === 'admin' || myRole === 'super_admin'
  }

  // Rol seçeneklerini belirle
  const getAvailableRoles = () => {
    if (myRole === 'super_admin') {
      return [
        { value: 'user', label: 'Kullanıcı' },
        { value: 'member', label: 'Üye' },
        { value: 'moderator', label: 'Moderatör' },
        { value: 'admin', label: 'Admin' },
        { value: 'super_admin', label: 'Süper Admin' },
      ]
    } else if (myRole === 'admin') {
      return [
        { value: 'user', label: 'Kullanıcı' },
        { value: 'member', label: 'Üye' },
        { value: 'moderator', label: 'Moderatör' },
        { value: 'admin', label: 'Admin' },
      ]
    }
    return []
  }

  // Kendi kendine rol değiştirme denemesinde uyarı
  const handleOwnProfileClick = () => {
    toast.error('Kendi rolünüzü değiştiremezsiniz', {
      description: 'Güvenlik nedeniyle kendi rolünüzü değiştirme yetkiniz bulunmamaktadır.',
      duration: 4000,
    })
  }

  const handleRoleChange = async () => {
    // Ekstra güvenlik: Kendi kendini değiştirmeye çalışırsa
    if (isOwnProfile) {
      toast.error('Kendi rolünüzü değiştiremezsiniz!', {
        description: 'Bu işlem güvenlik nedeniyle engellenmiştir.',
        duration: 4000,
      })
      setIsOpen(false)
      return
    }

    if (selectedRole === currentRole) {
      toast.info('Seçilen rol zaten mevcut rol')
      return
    }

    // Ekstra güvenlik kontrolü
    if (!canChangeRole()) {
      toast.error('Bu kullanıcının rolünü değiştirme yetkiniz yok')
      return
    }

    // Süper Admin rolünü sadece Süper Admin atayabilir
    if (selectedRole === 'super_admin' && myRole !== 'super_admin') {
      toast.error('Sadece Süper Adminler, Süper Admin rolü atayabilir')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', userId)

      if (error) throw error

      toast.success('Rol başarıyla değiştirildi', {
        description: `Kullanıcının rolü "${getRoleLabel(selectedRole)}" olarak güncellendi.`,
      })
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Rol değiştirme hatası:', error)
      toast.error('Rol değiştirilemedi', {
        description: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      'user': 'Kullanıcı',
      'member': 'Üye',
      'moderator': 'Moderatör',
      'admin': 'Admin',
      'super_admin': 'Süper Admin'
    }
    return roles[role] || role
  }

  const availableRoles = getAvailableRoles()

  // Eğer rol değiştirme yetkisi yoksa butonu gösterme
  if (availableRoles.length === 0) {
    return null
  }

  // Kendi profilinde uyarı kartı göster
  if (isOwnProfile) {
    return (
      <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
            Kendi Profiliniz
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
            Güvenlik nedeniyle kendi rolünüzü değiştiremezsiniz
          </p>
        </div>
        <Button 
          onClick={handleOwnProfileClick} 
          variant="outline" 
          size="sm"
          className="ml-auto border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/40"
        >
          <Shield className="h-4 w-4 mr-2" />
          Rol Değiştir
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <Shield className="h-4 w-4 mr-2" />
        Rol Değiştir
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kullanıcı Rolü Değiştir</DialogTitle>
            <DialogDescription>
              Kullanıcının sistem yetkilerini değiştirmek için yeni bir rol seçin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mevcut Rol</label>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">
                  {getRoleLabel(currentRole)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Yeni Rol</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Uyarı Mesajları */}
            {myRole === 'admin' && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  <strong>Not:</strong> Admin olarak sadece Kullanıcı, Üye, Moderatör ve Admin rollerini atayabilirsiniz. 
                  Süper Admin yetkisi için bir Süper Admin ile iletişime geçin.
                </p>
              </div>
            )}

            {currentRole === 'super_admin' && myRole === 'super_admin' && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-xs text-red-800 dark:text-red-200">
                  <strong>⚠️ Dikkat!</strong> Bir Süper Admin'in rolünü değiştiriyorsunuz. 
                  Bu işlem geri alınamaz ve kullanıcı tüm süper admin yetkilerini kaybedecektir.
                </p>
              </div>
            )}

            {selectedRole === 'super_admin' && currentRole !== 'super_admin' && (
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-md">
                <p className="text-xs text-purple-800 dark:text-purple-200">
                  <strong>Bilgi:</strong> Bu kullanıcıya Süper Admin yetkisi veriyorsunuz. 
                  Süper Adminler sistemdeki en yüksek yetkiye sahiptir.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              İptal
            </Button>
            <Button 
              onClick={handleRoleChange} 
              disabled={isLoading || selectedRole === currentRole}
              variant={currentRole === 'super_admin' ? 'destructive' : 'default'}
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Rolü Değiştir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
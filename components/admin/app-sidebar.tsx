// components/app-sidebar.tsx
"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Settings,
  FileText,
  BarChart3,
  ChevronDown,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createSupabaseBrowser } from "@/lib/supabase/client"

const menuItems = [
  {
    title: "Kontrol Paneli",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Duyurular",
    href: "/admin/announcements",
    icon: Megaphone,
  },
  {
    title: "Kullanıcılar",
    href: "/admin/users",
    icon: Users,
    roles: ["super_admin"],
  },
  {
    title: "Hakkımızda",
    href: "/admin/about",
    icon: BarChart3,
  },
  {
    title: "Etkinlikler",
    href: "/admin/events",
    icon: FileText,
  },
  {
    title: "Ayarlar",
    href: "/admin/settings",
    icon: Settings,
  },
]

const roleLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  super_admin: { label: "Super Admin", variant: "default" },
  admin: { label: "Admin", variant: "secondary" },
  user: { label: "Kullanıcı", variant: "outline" },
}

export function AppSidebar({ 
  userRole, 
  userEmail 
}: { 
  userRole: string
  userEmail: string 
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  // Email'den baş harfleri al
  const initials = userEmail
    .split("@")[0]
    .split(".")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const roleInfo = roleLabels[userRole] || roleLabels.user

  return (
    <Sidebar className="border-r">
      {/* Header - Logo */}
      <SidebarHeader className="border-b p-6">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-15 h-15 flex items-center justify-center">
            <img src="/images/MACROlogo.png" alt="MACRO Logo"/>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              MACRO
            </h1>
            <p className="text-xs text-muted-foreground">Yönetim Paneli</p>
          </div>
        </Link>
      </SidebarHeader>

      {/* Content - Menu Items */}
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems
                .filter((item) => !item.roles || item.roles.includes(userRole))
                .map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className="h-12 text-base hover:bg-accent/50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-600 data-[active=true]:to-purple-600 data-[active=true]:text-white"
                      >
                        <Link href={item.href} className="flex items-center gap-3 px-4">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - User Info */}
      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium truncate">{userEmail}</p>
                <Badge variant={roleInfo.variant} className="mt-1 text-xs">
                  {roleInfo.label}
                </Badge>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{userEmail}</p>
                <p className="text-xs text-muted-foreground">{roleInfo.label}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Ayarlar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
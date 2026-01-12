"use client";
import { usePathname } from "next/navigation"
import AdminNavbar from "@/components/admin/AdminNavbar"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // login sayfası için kontrol
  const isLoginPage = pathname === "/admin/login"

  return (
    <div className="min-h-screen flex">
      {/* Sidebar (login sayfasında gizle) */}
      {!isLoginPage && <AdminSidebar />}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar (login sayfasında gizle) */}
        {!isLoginPage && <AdminNavbar />}
        
        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

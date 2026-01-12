"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function AdminNavbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <nav className="flex items-center justify-between border-b px-6 py-3">
      {/* SOL */}
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard" className="font-bold">
          Admin Panel
        </Link>
      </div>

      {/* SAĞ */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </div>
    </nav>
  )
}

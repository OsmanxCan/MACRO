// components/Navbar.tsx
"use client"

import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Moon, Sun, LogIn } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-15 h-15 flex items-center justify-center">
            <img src="/images/MACROlogo.png" alt="MACRO Logo"/>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              MACRO
            </h1>
            <p className="text-xs text-muted-foreground">Teknoloji Topluluğu</p>
          </div>
        </Link>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <a 
            href="/#hakkinda" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Hakkımızda
          </a>
          <Link 
            href="/announcements"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Duyurular
          </Link>
          <Link 
            href="/events"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Etkinlikler
          </Link>
        </nav>

        {/* Right Side - Login & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Login Button */}
          <Link href="/admin/login">
            <Button variant="outline" size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              Giriş
            </Button>
          </Link>

          {/* Theme Toggle Button */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
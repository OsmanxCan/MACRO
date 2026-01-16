"use client"

import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Moon, Sun, LogOut, User, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createSupabaseClient } from '@/lib/supabase/client';

export default function () {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => setMounted(true), [])

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <footer className="relative border-t bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img src="/images/MACROlogo.png" alt="MACRO Logo" className="w-full h-full object-contain"/>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">M.A.C.R.O.</h3>
                    <p className="text-xs text-muted-foreground">Teknoloji Topluluğu</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Makine • Havacılık • Bilgisayar • Robotik • Otomasyon
                </p>
                <p className="text-sm text-muted-foreground">
                  Isparta Uygulamalı Bilimler Üniversitesi bünyesinde faaliyet gösteren, 
                  geleceğin mühendislerini yetiştiren teknoloji topluluğu.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-bold mb-4">Hızlı Linkler</h4>
                <ul className="space-y-2">
                  <li><a href="#hakkinda" className="text-sm text-muted-foreground hover:text-primary transition-colors">Hakkımızda</a></li>
                  <li><a href="/announcements" className="text-sm text-muted-foreground hover:text-primary transition-colors">Duyurular</a></li>
                  <li><a href="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">Etkinlikler</a></li>
                  <li><a href="/kayit-ol" className="text-sm text-muted-foreground hover:text-primary transition-colors">Üye Ol</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold mb-4">İletişim</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Isparta Uygulamalı Bilimler Üniversitesi</li>
                  <li>Keçiborlu Meslek Yüksek Okullu</li>
                  <li>Isparta, Türkiye</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t text-center">
              <p className="text-sm text-muted-foreground">
                © 2026 MACRO Topluluğu. Tüm hakları saklıdır.
              </p>
            </div>
            <div className="pt-8 text-right">
              <p className="text-sm text-muted-foreground">
                <a href="http://ocbstd.com" target="_blank" rel="noopener noreferrer">© Power by OCB STD</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
  );
}
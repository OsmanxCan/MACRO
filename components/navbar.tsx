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
import { useButtonTracking } from '@/hooks/useButtonTracking';

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { trackClick } = useButtonTracking();

  

  useEffect(() => setMounted(true), [])

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auth state management
  useEffect(() => {
    const supabase = createSupabaseClient()
    
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          setUser(null)
        } else {
          setUser(user)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      } else if (event === 'USER_UPDATED') {
        setUser(session?.user ?? null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      trackClick({
        buttonName: 'logout',
        section: 'navbar',
        page: window.location.pathname
      });

      const supabase = createSupabaseClient()
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      ///
    }
  }

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    trackClick({
        buttonName: 'theme_toggle',
        section: 'navbar',
        page: window.location.pathname,
        additionalData: { new_theme: newTheme }
      });
  };

  const getUserInitials = (email: string) => {
    if (!email) return 'U'
    return email.substring(0, 2).toUpperCase()
  }

  const getUserName = () => {
    if (!user) return 'Kullanıcı'
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'Kullanıcı'
  }

  const getUserAvatar = () => {
    if (!user) return undefined
    return user.user_metadata?.avatar_url || 
           user.user_metadata?.picture || 
           undefined
  }

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={() => trackClick({
                    buttonName: 'logo',
                    section: 'navbar',
                    page: window.location.pathname
                  })}
                   className="flex items-center gap-3 group">
            <div className="w-12 h-12 flex items-center justify-center relative">
              <img 
                src="/images/MACROlogo.png" 
                alt="MACRO Logo" 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h1 className="text-2xl font-black">
                MACRO
              </h1>
              <p className="text-xs text-muted-foreground font-semibold">Teknoloji Topluluğu</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="/#hakkinda" 
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors relative group"
              onClick={() => trackClick({
                buttonName: 'nav_hakkimizda',
                section: 'navbar',
                page: window.location.pathname
              })}
            >
              Hakkımızda
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
            </a>
            <Link 
              href="/announcements"
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors relative group"
              onClick={() => trackClick({
                buttonName: 'nav_duyurular',
                section: 'navbar',
                page: window.location.pathname
              })}
            >
              Duyurular
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              href="/events"
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors relative group"
              onClick={() => trackClick({
                buttonName: 'nav_etkinlikler',
                section: 'navbar',
                page: window.location.pathname
              })}
            >
              Etkinlikler
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-600 to-red-600 group-hover:w-full transition-all duration-300" />
            </Link>
          </nav>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-11 w-11 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-11 w-11 rounded-full hover:ring-2 hover:ring-primary/50 transition-all">
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={getUserAvatar()} alt={user.email || 'User'} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                        {getUserInitials(user.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2 p-2">
                      <p className="text-sm font-semibold leading-none">
                        {getUserName()}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email || 'Email bulunamadı'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer" onClick={() => trackClick({
                        buttonName: 'profile',
                        section: 'navbar',
                        page: window.location.pathname
                      })}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/giris" className="hidden sm:block" onClick={() => trackClick({
                    buttonName: 'login',
                    section: 'navbar',
                    page: window.location.pathname
                  })}
                >
                  <Button variant="ghost" size="sm" className="font-semibold">
                    Giriş
                  </Button>
                </Link>
                <Link href="/kayit-ol" onClick={() => trackClick({
                    buttonName: 'register',
                    section: 'navbar',
                    page: window.location.pathname
                  })}
                  >
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold hover:scale-105 hover:shadow-lg transition-all"
                  >
                    Kayıt Ol
                  </Button>
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                className="relative rounded-full hover:bg-primary/10 hover:scale-110 transition-all"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-600" />
                )}
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-in slide-in-from-top">
            <nav className="flex flex-col gap-4">
              <a 
                href="/#hakkinda" 
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Hakkımızda
              </a>
              <Link 
                href="/announcements"
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Duyurular
              </Link>
              <Link 
                href="/events"
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Etkinlikler
              </Link>
              {!user && (
                <Link 
                  href="/giris"
                  className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Giriş
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </nav>
  );
}
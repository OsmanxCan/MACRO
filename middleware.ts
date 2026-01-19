// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const publicPaths = [
    "/admin/giris",
    "/admin/sifre-sifirla",
    "/account-suspended",
    "/", 
    "/announcements",
    "/events",
  ]

  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          })
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  // Admin paneli için login kontrolü
  if (pathname.startsWith("/admin")) {
    if (!user || error) {
      const url = req.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
  }

  // Kullanıcı varsa hesap durumu kontrolü yap
  if (user) {
    // ✅ Hesap durumu kontrolü
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_active, role")
      .eq("id", user.id)
      .single()

    // Hesap askıya alınmışsa
    if (profile && profile.is_active === false) {
      const url = req.nextUrl.clone()
      url.pathname = "/account-suspended"
      return NextResponse.redirect(url)
    }

    // User bilgisini header'a ekle
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-user-email', user.email || '')
    if (profile?.role) {
      response.headers.set('x-user-role', profile.role)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (if needed)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
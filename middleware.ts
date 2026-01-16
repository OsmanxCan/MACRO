// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === "/admin/login" || pathname === "/admin/set-password") {
    return NextResponse.next()
  }

  // ✅ Response'u başlangıçta oluştur
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


  if (!user || error) {
    const url = req.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  // ✅ User bilgisini header'a ekle
  response.headers.set('x-user-id', user.id)
  response.headers.set('x-user-email', user.email || '')

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
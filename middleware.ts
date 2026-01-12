import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            res.cookies.set(cookie)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname

  // 🔓 serbest sayfalar
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/set-password"
  ) {
    return res
  }

  // 🔒 giriş yoksa → login (COOKIE KORUNUR)
  if (!user) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/admin/login"
    return NextResponse.redirect(redirectUrl, {
      headers: res.headers, // 🔥 cookie’ler kaybolmaz
    })
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}

// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// export function middleware(req: NextRequest) {
//   // const { pathname } = req.nextUrl

//   // // 🔓 serbest sayfalar
//   // if (
//   //   pathname === "/admin/login" ||
//   //   pathname === "/admin/set-password"
//   // ) {
//   //   return NextResponse.next()
//   // }

//   // // ⚠️ sadece cookie VAR MI kontrol et (auth yapma)
//   // const hasSession =
//   //   req.cookies.get("sb-access-token") ||
//   //   req.cookies.get("sb-refresh-token")

//   // if (!hasSession) {
//   //   const url = req.nextUrl.clone()
//   //   url.pathname = "/admin/login"
//   //   return NextResponse.redirect(url)
//   // }

//   // return NextResponse.next()
// }

// export const config = {
//   // matcher: ["/admin/:path*"],
// }

// middleware.ts
// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Admin rotalarını kontrol et
  if (req.nextUrl.pathname.startsWith('/admin') && 
      req.nextUrl.pathname !== '/admin/login') {
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              res.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Kullanıcı yoksa login'e yönlendir
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*', // Sadece admin rotalarını kontrol et
  ],
}
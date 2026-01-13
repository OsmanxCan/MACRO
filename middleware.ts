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
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [], // hiçbir route için çalışmasın
};

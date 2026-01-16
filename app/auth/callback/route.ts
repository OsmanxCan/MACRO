// import { createSupabaseServer } from '@/lib/supabase/server'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export async function GET(request: NextRequest) {
//   const requestUrl = new URL(request.url)
//   const code = requestUrl.searchParams.get('code')

//   if (code) {
//     const supabase = await createSupabaseServer()
//     await supabase.auth.exchangeCodeForSession(code)
//   }

//   // Kullanıcıyı ana sayfaya yönlendir
//   return NextResponse.redirect(new URL('/', requestUrl.origin))
// }

// app/auth/callback/route.ts
import { createSupabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/admin/dashboard'

  if (code) {
    const supabase = await createSupabaseServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/admin/login', requestUrl.origin))
    }
  }

  // ✅ Dashboard'a yönlendir
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
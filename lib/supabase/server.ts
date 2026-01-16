// lib/supabase/server.ts
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export async function createSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as any)
            })
          } catch {}
        },
      },
    }
  )
}

// ✅ Yeni helper function - cookie'den direkt user al
export async function getServerUser() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('sb-yjmcifqyriocvwkucyne-auth-token')
  
  if (!authToken?.value) {
    return null
  }

  try {
    // Cookie değerini parse et
    const session = JSON.parse(authToken.value)
    
    // Access token varsa user bilgisini döndür
    if (session?.access_token) {
      const supabase = await createSupabaseServer()
      const { data: { user }, error } = await supabase.auth.getUser(session.access_token)
      
      if (error) {
        return null
      }
      
      return user
    }
  } catch (err) {
    // 
  }
  
  return null
}
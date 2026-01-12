import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function createSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            cookieStore.set(cookie)
          })
        },
      },
    }
  )
}

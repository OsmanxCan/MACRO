// app/api/auth/set-session/route.ts
import { createSupabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { access_token, refresh_token } = await request.json()

  const response = NextResponse.json({ success: true })

  const supabase = await createSupabaseServer()

  await supabase.auth.setSession({
    access_token,
    refresh_token,
  })

  return response
}
// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    
    // Kullanıcı kontrolü
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const { to, subject, htmlContent, type } = await request.json()

    // Brevo API'ye istek gönder
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL!,
          name: 'MACRO Topluluğu'
        },
        to: [{ email: to }],
        subject,
        htmlContent
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Brevo API Hatası:', errorData)
      throw new Error('Email gönderilemedi')
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      messageId: result.messageId
    })

  } catch (error: any) {
    console.error('Email gönderme hatası:', error)
    return NextResponse.json(
      { error: error.message || 'Email gönderilemedi' },
      { status: 500 }
    )
  }
}
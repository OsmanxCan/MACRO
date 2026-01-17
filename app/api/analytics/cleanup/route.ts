import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const daysToKeep = Number(body.daysToKeep)

    // ❗ 0 GEÇERLİ, sadece NaN veya negatifse hata
    if (Number.isNaN(daysToKeep) || daysToKeep < 0) {
      return NextResponse.json(
        { error: 'Geçersiz daysToKeep' },
        { status: 400 }
      )
    }

    const cutoffDate = new Date(
      Date.now() - daysToKeep * 24 * 60 * 60 * 1000
    ).toISOString()

    const { error, count } = await supabaseAdmin
      .from('analytics_events')
      .delete({ count: 'exact' })
      .lt('created_at', cutoffDate)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      deleted: count ?? 0,
    })
  } catch (err) {
    console.error('API crash:', err)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

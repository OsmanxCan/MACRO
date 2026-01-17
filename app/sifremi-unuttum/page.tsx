'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import Link from 'next/link'
import { useButtonTracking } from '@/hooks/useButtonTracking'

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const supabase = createSupabaseBrowser()
  const { trackClick } = useButtonTracking()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/sifre-sifirla`,
      })

      if (error) {
        setError('Email gönderilemedi. Lütfen tekrar deneyin.')
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleSifremiUnuttumIsubuClick = () => {
    trackClick({
      buttonName: 'sifremi_unuttum_isubu',
      section: 'sifremi_unuttum_list',
      page: 'sifremi_unuttum',
    })
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Email Gönderildi! 📧
          </h2>
          <p className="text-gray-600 mb-6">
            Şifre sıfırlama linki <strong>{email}</strong> adresine gönderildi. Lütfen email'inizi kontrol edin.
          </p>
          <Link 
            href="/giris"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Giriş Sayfasına Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <div className="fixed top-6 right-6 z-50">
        <Link href="https://isparta.edu.tr/" target='_blank' onClick={handleSifremiUnuttumIsubuClick} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition">
          <img src="/images/isubu.png" alt="" width={100} height={100}/>
        </Link>
      </div>

      {/* Sol taraf - Video/Görsel alanı */}
      <div className="hidden lg:flex lg:w-1/4 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Video buraya gelecek - şimdilik placeholder */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/login.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Şifremi Unuttum 
            </h1>
            <p className="text-gray-600">
              Email adresine şifre sıfırlama linki gönderelim
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Adresi
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none"
                placeholder="ornek@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={() => trackClick({buttonName: 'sifremi_unuttum_gonder', section: 'sifremi_unuttum_list', page: 'sifremi_unuttum'})}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/giris" onClick={() => trackClick({buttonName: 'sifremi_unuttum_anasayfa', section: 'sifremi_unuttum__list', page: 'sifremi_unuttum'})} className="text-emerald-600 hover:text-emerald-700 font-semibold">
              ← Giriş Sayfasına Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

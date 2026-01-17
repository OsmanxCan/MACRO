'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useButtonTracking } from '@/hooks/useButtonTracking'

export default function SifreSifirlaPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createSupabaseBrowser()
  const router = useRouter()
  const { trackClick } = useButtonTracking()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError('Şifre güncellenemedi. Lütfen tekrar deneyin.')
        return
      }

      alert('Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...')
      router.push('/giris')
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleSifirlaIsubuClick = () => {
    trackClick({
      buttonName: 'sifre_sifira_isubu',
      section: 'sifre_sifirla_list',
      page: 'sifre_sifirla',
    })
  }


  return (
    <div className="min-h-screen flex">
      <div className="fixed top-6 right-6 z-50">
        <Link href="https://isparta.edu.tr/" target='_blank' onClick={handleSifirlaIsubuClick} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition">
          <img src="/images/isubu.png" alt="" width={100} height={100}/>
        </Link>
      </div>

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
              Yeni Şifre Oluştur 
            </h1>
            <p className="text-gray-600">
              Yeni şifrenizi belirleyin
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Yeni Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none"
                placeholder="En az 6 karakter"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Yeni Şifre Tekrar
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none"
                placeholder="Şifreyi tekrar girin"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={() => trackClick({buttonName: 'sifiremi_sifirla_gönder', section: 'sifiremi_sifirla_list', page: 'sifiremi_sifirla'})}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
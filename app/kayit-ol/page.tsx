'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/src/hooks/useAuth'
import { useButtonTracking } from '@/hooks/useButtonTracking'


export default function KayitPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()
  const { trackClick } = useButtonTracking()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    trackClick({buttonName: 'kayit_ol', section: 'kayit_ol_list', page: 'kayit_ol'})

    // Şifre kontrolü
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password)
      
      if (error) {
        if (error.message.includes('already registered')) {
          setError('Bu email adresi zaten kayıtlı')
        } else {
          setError(error.message)
        }
        return
      }

      setSuccess(true)
      
      // 3 saniye sonra giriş sayfasına yönlendir
      setTimeout(() => {
        router.push('/giris')
      }, 3000)
      
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleKayitIsubuClick = () => {
    trackClick({
      buttonName: 'kayit_ol_isubu',
      section: 'kayit_ol_list',
      page: 'kayit_ol',
    })
  }

  if (success) {
    return (
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Aramıza hoş geldiniz!
        </h2>
        <p className="text-gray-600 mb-6">
          Doğrulama e-postası gönderdik. <strong>{email}</strong>. Lütfen gelen kutunuzu kontrol edin ve hesabınızı doğrulayın.
        </p>
        <p className="text-sm text-gray-500">
          Giriş sayfasına yönlendiriliyor...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <div className="fixed top-6 right-6 z-50">
        <Link href="https://isparta.edu.tr/" target='_blank' onClick={handleKayitIsubuClick} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition">
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
          <div className="mb-10 items-center ">
            <div className="flex items-center justify-center mb-8">
              <img src="/images/LogoMacroP.png" alt="Logo" width={160} height={160}/>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Aramıza Katıl!
            </h1>
            <p className="text-gray-600">
              Yeni hesap oluştur
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
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
                Şifre Tekrar
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 Kayıt olduktan sonra üyelik formu doldurmanız gerekecek.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Zaten hesabın var mı?{' '}
              <Link href="/giris" onClick={() => trackClick({buttonName: 'kayit_ol_giris_sayfasına_git', section: 'kayit_ol_list', page: 'kayit_ol'})} className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
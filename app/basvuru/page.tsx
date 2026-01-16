// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/src/hooks/useAuth'
// import { createSupabaseBrowser } from '@/lib/supabase/client'
// import { emailTemplates } from '@/src/lib/email-templates'

// export default function BasvuruPage() {
//   const { user, loading: authLoading } = useAuth()
//   const router = useRouter()
//   const supabase = createSupabaseBrowser()
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState(false)
//   const [hasApplication, setHasApplication] = useState(false)
//   const [checkingApplication, setCheckingApplication] = useState(true)

//   const [formData, setFormData] = useState({
//     full_name: '',
//     email: '',
//     phone: '',
//     student_number: '',
//     department: '',
//     grade: '',
//     skills: '',
//     interests: '',
//     why_join: '',
//     experience: '',
//     portfolio_url: '',
//     social_media: {
//       linkedin: '',
//       github: '',
//       instagram: '',
//       twitter: ''
//     }
//   })

//   useEffect(() => {
//     if (authLoading) return

//     if (!user) {
//       router.push('/giris')
//       return
//     }

//     checkExistingApplication()
//     loadUserProfile()
//   }, [user, authLoading, router])

//   const checkExistingApplication = async () => {
//     if (!user) return

//     try {
//       const { data } = await supabase
//         .from('membership_applications')
//         .select('id')
//         .eq('user_id', user.id)
//         .maybeSingle()

//       setHasApplication(!!data)
//     } catch (error) {
//       console.error('Başvuru kontrol hatası:', error)
//       setHasApplication(false)
//     } finally {
//       setCheckingApplication(false)
//     }
//   }

//   const loadUserProfile = async () => {
//     if (!user) return

//     try {
//       const { data } = await supabase
//         .from('profiles')
//         .select('full_name, email, phone, department, grade, student_number')
//         .eq('id', user.id)
//         .maybeSingle()

//       if (data) {
//         setFormData(prev => ({
//           ...prev,
//           full_name: data.full_name || '',
//           email: data.email || user.email || '',
//           phone: data.phone || '',
//           department: data.department || '',
//           grade: data.grade || '',
//           student_number: data.student_number || ''
//         }))
//       } else {
//         // Profil yoksa en azından email'i set et
//         setFormData(prev => ({
//           ...prev,
//           email: user.email || ''
//         }))
//       }
//     } catch (error) {
//       console.error('Profil yüklenirken hata:', error)
//       setFormData(prev => ({
//         ...prev,
//         email: user.email || ''
//       }))
//     }
//   }

//   const sendApplicationEmail = async () => {
//     try {
//       const emailTemplate = emailTemplates.membershipReceived(formData.full_name)
      
//       const response = await fetch('/api/send-email', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           to: formData.email,
//           subject: emailTemplate.subject,
//           htmlContent: emailTemplate.htmlContent,
//           type: 'membership_received'
//         })
//       })

//       if (!response.ok) {
//         console.error('Email gönderilemedi')
//       }
//     } catch (error) {
//       console.error('Email gönderme hatası:', error)
//     }
//   }


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!user) return

//     setError('')
//     setLoading(true)

//     try {
//       const { error: insertError } = await supabase
//         .from('membership_applications')
//         .insert({
//           user_id: user.id,
//           full_name: formData.full_name,
//           email: formData.email,
//           phone: formData.phone,
//           student_number: formData.student_number || null,
//           department: formData.department || null,
//           grade: formData.grade || null,
//           skills: formData.skills,
//           interests: formData.interests,
//           why_join: formData.why_join,
//           experience: formData.experience || null,
//           portfolio_url: formData.portfolio_url || null,
//           social_media: formData.social_media,
//           status: 'pending'
//         })

//       if (insertError) throw insertError

//       await sendApplicationEmail()

//       setSuccess(true)
//       setTimeout(() => {
//         router.push('/profile')
//       }, 3000)
//     } catch (err: any) {
//       console.error('Başvuru hatası:', err)
//       setError(err.message || 'Başvuru gönderilirken hata oluştu')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Loading durumları
//   if (authLoading || checkingApplication) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-300">Yükleniyor...</p>
//         </div>
//       </div>
//     )
//   }

//   // User yoksa
//   if (!user) {
//     return null
//   }

//   // Zaten başvuru var
//   if (hasApplication) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
//         <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
//           <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//             Başvurunuz Mevcut
//           </h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-6">
//             Zaten bir başvurunuz bulunmaktadır. Başvurunuz inceleniyor.
//           </p>
//           <button
//             onClick={() => router.push('/profile')}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//           >
//             Profile Dön
//           </button>
//         </div>
//       </div>
//     )
//   }

//   // Başarılı gönderim
//   if (success) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
//         <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
//           <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//             Başvurunuz Alındı! 🎉
//           </h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-4">
//             Başvurunuz başarıyla gönderildi. En kısa sürede değerlendireceğiz.
//           </p>
//           <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//             <p className="text-sm text-blue-800 dark:text-blue-300">
//               📧 Email adresinize onay maili gönderildi.
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
//       <div className="max-w-3xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               Üyelik Başvuru Formu
//             </h1>
//             <p className="text-gray-600">
//               Topluluğumuza katılmak için lütfen formu eksiksiz doldurun.
//             </p>
//           </div>

//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-800 text-sm">{error}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Kişisel Bilgiler */}
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                 Kişisel Bilgiler
//               </h2>
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Ad Soyad *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.full_name}
//                     onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email *
//                   </label>
//                   <input
//                     type="email"
//                     required
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Telefon *
//                   </label>
//                   <input
//                     type="tel"
//                     required
//                     value={formData.phone}
//                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Öğrenci No
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.student_number}
//                     onChange={(e) => setFormData({ ...formData, student_number: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Bölüm
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.department}
//                     onChange={(e) => setFormData({ ...formData, department: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Sınıf
//                   </label>
//                   <select
//                     value={formData.grade}
//                     onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">Seçiniz</option>
//                     <option value="Hazırlık">Hazırlık</option>
//                     <option value="1">1. Sınıf</option>
//                     <option value="2">2. Sınıf</option>
//                     <option value="3">3. Sınıf</option>
//                     <option value="4">4. Sınıf</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Yetenekler */}
//             <div>
//               <h1 className="block text-xl font-semibold text-gray-900 mb-2">
//                 Yetenekleriniz
//               </h1>
//               <textarea
//                 required
//                 rows={4}
//                 value={formData.skills}
//                 onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Yeteneklerinizi Açıklayınız..."
//               />
//             </div>

//             {/* İlgi Alanları */}
//             <div>
//               <h1 className="block text-xl font-semibold text-gray-900 mb-2">
//                 İlgi Alanlarınız
//               </h1>
//               <textarea
//                 required
//                 rows={4}
//                 value={formData.interests}
//                 onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="İlgi Alanlarınızı Açıklayınız..."
//               />
//             </div>

//             {/* Motivasyon ve Deneyim */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Neden Katılmak İstiyorsunuz? *
//               </label>
//               <textarea
//                 required
//                 rows={4}
//                 value={formData.why_join}
//                 onChange={(e) => setFormData({ ...formData, why_join: e.target.value })}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Topluluğumuza katılma motivasyonunuzu açıklayın..."
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Deneyimleriniz
//               </label>
//               <textarea
//                 rows={4}
//                 value={formData.experience}
//                 onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Önceki projeleriniz, katıldığınız etkinlikler vb..."
//               />
//             </div>

//             {/* Sosyal Medya */}
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                 Sosyal Medya (Opsiyonel)
//               </h2>
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     LinkedIn
//                   </label>
//                   <input
//                     type="url"
//                     value={formData.social_media.linkedin}
//                     onChange={(e) => setFormData({
//                       ...formData,
//                       social_media: { ...formData.social_media, linkedin: e.target.value }
//                     })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="https://linkedin.com/in/..."
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     GitHub
//                   </label>
//                   <input
//                     type="url"
//                     value={formData.social_media.github}
//                     onChange={(e) => setFormData({
//                       ...formData,
//                       social_media: { ...formData.social_media, github: e.target.value }
//                     })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="https://github.com/..."
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Instagram
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.social_media.instagram}
//                     onChange={(e) => setFormData({
//                       ...formData,
//                       social_media: { ...formData.social_media, instagram: e.target.value }
//                     })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="@kullaniciadi"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Portfolio URL
//                   </label>
//                   <input
//                     type="url"
//                     value={formData.portfolio_url}
//                     onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="https://..."
//                   />
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
//             >
//               {loading ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/hooks/useAuth'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { emailTemplates } from '@/src/lib/email-templates'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2, CheckCircle2, User, Mail, Phone, GraduationCap, Briefcase, MessageSquare, Users, Target, Github, Linkedin, Instagram, Globe } from 'lucide-react'
import Navbar from '@/components/navbar'

export default function BasvuruPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createSupabaseBrowser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [hasApplication, setHasApplication] = useState(false)
  const [checkingApplication, setCheckingApplication] = useState(true)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    student_number: '',
    department: '',
    grade: '',
    skills: '',
    interests: '',
    why_join: '',
    experience: '',
    portfolio_url: '',
    communication_skills: 3,
    teamwork_skills: 3,
    self_introduction: '',
    project_preference: 'farketmez',
    social_media: {
      linkedin: '',
      github: '',
      instagram: '',
      twitter: ''
    }
  })

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/giris')
      return
    }

    checkExistingApplication()
    loadUserProfile()
  }, [user, authLoading, router])

  const checkExistingApplication = async () => {
    if (!user) return

    try {
      const { data } = await supabase
        .from('membership_applications')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      setHasApplication(!!data)
    } catch (error) {
      console.error('Başvuru kontrol hatası:', error)
      setHasApplication(false)
    } finally {
      setCheckingApplication(false)
    }
  }

  const loadUserProfile = async () => {
    if (!user) return

    try {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email, phone, department, grade, student_number')
        .eq('id', user.id)
        .maybeSingle()

      if (data) {
        setFormData(prev => ({
          ...prev,
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          department: data.department || '',
          grade: data.grade || '',
          student_number: data.student_number || ''
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          email: user.email || ''
        }))
      }
    } catch (error) {
      console.error('Profil yüklenirken hata:', error)
      setFormData(prev => ({
        ...prev,
        email: user.email || ''
      }))
    }
  }

  const sendApplicationEmail = async () => {
    try {
      const emailTemplate = emailTemplates.membershipReceived(formData.full_name)
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.email,
          subject: emailTemplate.subject,
          htmlContent: emailTemplate.htmlContent,
          type: 'membership_received'
        })
      })

      if (!response.ok) {
        console.error('Email gönderilemedi')
      }
    } catch (error) {
      console.error('Email gönderme hatası:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError('')
    setLoading(true)

    try {
      const { error: insertError } = await supabase
        .from('membership_applications')
        .insert({
          user_id: user.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          student_number: formData.student_number || null,
          department: formData.department || null,
          grade: formData.grade || null,
          skills: formData.skills,
          interests: formData.interests,
          why_join: formData.why_join,
          experience: formData.experience || null,
          portfolio_url: formData.portfolio_url || null,
          communication_skills: formData.communication_skills,
          teamwork_skills: formData.teamwork_skills,
          self_introduction: formData.self_introduction,
          project_preference: formData.project_preference,
          social_media: formData.social_media,
          status: 'pending'
        })

      if (insertError) throw insertError

      await sendApplicationEmail()

      setSuccess(true)
      setTimeout(() => {
        router.push('/profile')
      }, 3000)
    } catch (err: any) {
      console.error('Başvuru hatası:', err)
      setError(err.message || 'Başvuru gönderilirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // Loading durumları
  if (authLoading || checkingApplication) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Yükleniyor...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (hasApplication) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Başvurunuz Mevcut</CardTitle>
            <CardDescription>
              Zaten bir başvurunuz bulunmaktadır. Başvurunuz inceleniyor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/profile')} className="w-full" size="lg">
              Profile Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Başvurunuz Alındı! 🎉</CardTitle>
            <CardDescription>
              Başvurunuz başarıyla gönderildi. En kısa sürede değerlendireceğiz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Email adresinize onay maili gönderildi.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Üyelik Başvuru Formu</CardTitle>
            <CardDescription>
              Topluluğumuza katılmak için lütfen formu eksiksiz doldurun.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Kişisel Bilgiler */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Kişisel Bilgiler</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Ad Soyad *</Label>
                    <Input
                      id="full_name"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Ad Soyad"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ornek@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+90 5XX XXX XX XX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student_number">Öğrenci No</Label>
                    <Input
                      id="student_number"
                      value={formData.student_number}
                      onChange={(e) => setFormData({ ...formData, student_number: e.target.value })}
                      placeholder="12345678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Bölüm</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="Bilgisayar Mühendisliği"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">Sınıf</Label>
                    <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hazırlık">Hazırlık</SelectItem>
                        <SelectItem value="1">1. Sınıf</SelectItem>
                        <SelectItem value="2">2. Sınıf</SelectItem>
                        <SelectItem value="3">3. Sınıf</SelectItem>
                        <SelectItem value="4">4. Sınıf</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Kendini Tanıt */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Kendini Tanıt</h3>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="self_introduction">Kendini Tanıt *</Label>
                  <Textarea
                    id="self_introduction"
                    required
                    rows={5}
                    value={formData.self_introduction}
                    onChange={(e) => setFormData({ ...formData, self_introduction: e.target.value })}
                    placeholder="Kendinizi tanıtın, hobileriniz, ilgi alanlarınız ve hedefleriniz hakkında bilgi verin..."
                  />
                </div>
              </div>

              {/* Beceriler Değerlendirmesi */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Beceri Değerlendirmesi</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>İletişim Becerileri *</Label>
                      <span className="text-2xl font-bold text-primary">{formData.communication_skills}</span>
                    </div>
                    <Slider
                      value={[formData.communication_skills]}
                      onValueChange={(value) => setFormData({ ...formData, communication_skills: value[0] })}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Zayıf</span>
                      <span>Orta</span>
                      <span>Mükemmel</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Takım Çalışması *</Label>
                      <span className="text-2xl font-bold text-primary">{formData.teamwork_skills}</span>
                    </div>
                    <Slider
                      value={[formData.teamwork_skills]}
                      onValueChange={(value) => setFormData({ ...formData, teamwork_skills: value[0] })}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Zayıf</span>
                      <span>Orta</span>
                      <span>Mükemmel</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proje İsteği */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Proje İsteği</h3>
                </div>
                <RadioGroup value={formData.project_preference} onValueChange={(value) => setFormData({ ...formData, project_preference: value })}>
                  <div className="grid grid-cols-3 gap-4">
                    <Label htmlFor="istiyorum" className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all ${formData.project_preference === 'istiyorum' ? 'border-green-500 bg-green-500/10' : 'border-border hover:bg-accent'}`}>
                      <RadioGroupItem value="istiyorum" id="istiyorum" className="sr-only" />
                      <span className="font-semibold">İstiyorum</span>
                    </Label>
                    <Label htmlFor="farketmez" className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all ${formData.project_preference === 'farketmez' ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent'}`}>
                      <RadioGroupItem value="farketmez" id="farketmez" className="sr-only" />
                      <span className="font-semibold">Farketmez</span>
                    </Label>
                    <Label htmlFor="istemiyorum" className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all ${formData.project_preference === 'istemiyorum' ? 'border-red-500 bg-red-500/10' : 'border-border hover:bg-accent'}`}>
                      <RadioGroupItem value="istemiyorum" id="istemiyorum" className="sr-only" />
                      <span className="font-semibold">İstemiyorum</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Yetenekler ve İlgi Alanları */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Yetenekler ve İlgi Alanları</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Yetenekleriniz *</Label>
                  <Textarea
                    id="skills"
                    required
                    rows={4}
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="Yeteneklerinizi açıklayınız..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">İlgi Alanlarınız *</Label>
                  <Textarea
                    id="interests"
                    required
                    rows={4}
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    placeholder="İlgi alanlarınızı açıklayınız..."
                  />
                </div>
              </div>

              {/* Motivasyon ve Deneyim */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="why_join">Neden Katılmak İstiyorsunuz? *</Label>
                  <Textarea
                    id="why_join"
                    required
                    rows={4}
                    value={formData.why_join}
                    onChange={(e) => setFormData({ ...formData, why_join: e.target.value })}
                    placeholder="Topluluğumuza katılma motivasyonunuzu açıklayın..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Deneyimleriniz</Label>
                  <Textarea
                    id="experience"
                    rows={4}
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="Önceki projeleriniz, katıldığınız etkinlikler vb..."
                  />
                </div>
              </div>

              {/* Sosyal Medya */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Sosyal Medya (Opsiyonel)</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </div>
                    </Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={formData.social_media.linkedin}
                      onChange={(e) => setFormData({
                        ...formData,
                        social_media: { ...formData.social_media, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github">
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        GitHub
                      </div>
                    </Label>
                    <Input
                      id="github"
                      type="url"
                      value={formData.social_media.github}
                      onChange={(e) => setFormData({
                        ...formData,
                        social_media: { ...formData.social_media, github: e.target.value }
                      })}
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </div>
                    </Label>
                    <Input
                      id="instagram"
                      value={formData.social_media.instagram}
                      onChange={(e) => setFormData({
                        ...formData,
                        social_media: { ...formData.social_media, instagram: e.target.value }
                      })}
                      placeholder="@kullaniciadi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio_url">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Portfolio URL
                      </div>
                    </Label>
                    <Input
                      id="portfolio_url"
                      type="url"
                      value={formData.portfolio_url}
                      onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} size="lg" className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  'Başvuruyu Gönder'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}
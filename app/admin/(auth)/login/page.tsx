// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { createSupabaseClient } from "@/lib/supabase/client"

// export default function LoginPage() {
//   const router = useRouter()
//   const supabase = createSupabaseClient()

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)


//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })


//     if (error) {
//       setError(error.message)
//       setLoading(false)
//       return
//     }

    
//     // Session var mı kontrol et
//     const { data: session } = await supabase.auth.getSession()

//     // Yönlendir
//     router.push("/admin/dashboard")
//     router.refresh()
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-background">
//       <Card className="w-full max-w-sm">
//         <CardHeader>
//           <CardTitle>Yönetici Girişi</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleLogin} className="space-y-4">
//             <Input
//               type="email"
//               placeholder="E-posta"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             <Input
//               type="password"
//               placeholder="Şifre"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             {error && (
//               <p className="text-sm text-red-500">{error}</p>
//             )}

//             <Button
//               type="submit"
//               className="w-full"
//               disabled={loading}
//             >
//               {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  try {
    const supabase = createSupabaseClient()
    
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      console.error("Sign in error:", signInError)
      setError(signInError.message)
      setLoading(false)
      return
    }

    if (!data.session) {
      setError("Session oluşturulamadı")
      setLoading(false)
      return
    }

    console.log("Login successful, session:", data.session)

    // ✅ Server-side cookie'leri set et
    await fetch('/api/auth/set-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      }),
    })

    // Kısa bir bekleme ile cookie'lerin set olmasını sağla
    await new Promise(resolve => setTimeout(resolve, 100))
    
    window.location.href = "/admin/dashboard"
    
  } catch (err) {
    console.error("Login error:", err)
    setError("Bir hata oluştu. Lütfen tekrar deneyin.")
    setLoading(false)
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Yönetici Girişi</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />

            <Input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />

            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
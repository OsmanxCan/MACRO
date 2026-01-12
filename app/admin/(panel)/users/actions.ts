"use server"

import { sendEmailWithBrevo } from "@/lib/brevo"
import { supabaseAdmin } from "@/lib/supabase/admin"

type Role = "admin" | "super_admin"

export async function createUser(
  email: string,
  password: string,
  role: Role
) {
  try {
    // 1️⃣ Kullanıcı oluştur
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: {
        role: role // Metadata'ya da ekleyelim
      }
    })

    if (error) {
      console.error("CREATE USER ERROR:", error)
      throw new Error(error.message)
    }

    const userId = data.user.id

    // 2️⃣ Kısa bir gecikme (trigger'ın çalışması için)
    await new Promise(resolve => setTimeout(resolve, 500))

    // 3️⃣ Profil oluştur/güncelle (service_role RLS'yi bypass eder)
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: userId,
          username: email.split("@")[0],
          role: role,
        },
        { 
          onConflict: "id",
          ignoreDuplicates: false 
        }
      )

    if (profileError) {
      console.error("PROFILE ERROR:", profileError)
      // Profil hatası kritik değilse devam et
      console.warn("Profil oluşturulamadı ama kullanıcı oluşturuldu")
    }

    // 4️⃣ Email doğrulama linki
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "signup",
        email,
        password,
      })

    if (linkError) {
      console.error("LINK ERROR:", linkError)
      throw new Error(linkError.message)
    }

    const confirmUrl = linkData.properties.action_link

    // 5️⃣ Mail gönder
    await sendEmailWithBrevo(email, confirmUrl)

    return { success: true, userId }

  } catch (err) {
    console.error("CREATE USER FAILED:", err)
    throw err
  }
}
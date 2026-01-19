"use server"

import { sendEmailWithBrevo } from "@/lib/brevo"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { createSupabaseServer } from "@/lib/supabase/server"

type Role = "admin" | "super_admin"

type UpdateUserData = {
  username: string
  full_name: string
  email: string
  phone: string
  student_number: string
  department: string
  grade: string
  avatar_url: string
  role: string
  is_active: boolean
}

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

export async function updateUserProfile(
  userId: string,
  data: UpdateUserData
) {
  try {
    const supabase = await createSupabaseServer()

    // Super admin kontrolü
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Kimlik doğrulaması gerekli")
    }

    const { data: me } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (me?.role !== "super_admin") {
      throw new Error("Bu işlem için yetkiniz yok")
    }

    // 1️⃣ Email değiştiyse auth.users'ta güncelle (Admin API)
    const { data: currentAuthUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (getUserError || !currentAuthUser.user) {
      throw new Error("Kullanıcı bulunamadı")
    }
    
    if (currentAuthUser.user.email !== data.email) {
      const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { email: data.email }
      )
      
      if (emailError) {
        console.error("Email güncelleme hatası:", emailError)
        throw new Error("Email güncellenemedi")
      }
    }

    // 2️⃣ Profiles tablosunu güncelle
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        username: data.username || null,
        full_name: data.full_name || null,
        phone: data.phone || null,
        student_number: data.student_number || null,
        department: data.department || null,
        grade: data.grade || null,
        avatar_url: data.avatar_url || null,
        role: data.role,
        is_active: data.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (profileError) {
      console.error("Profil güncelleme hatası:", profileError)
      throw new Error("Profil güncellenemedi: " + profileError.message)
    }

    revalidatePath("/admin/users")
    return { success: true }

  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error)
    throw error
  }
}
"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createEvent(formData: FormData) {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    throw new Error("Yetkiniz yok")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const date = formData.get("date") as string
  const link = formData.get("link") as string | null

  let imageUrl = formData.get("imageUrl") as string | null
  let imageFile = null

  // Resim dosyası varsa yükle
  // Resim dosyası varsa yükle
  const imageUpload = formData.get("imageFile") as File | null
  if (imageUpload && imageUpload.size > 0) {
    // Dosya adını temizle - boşlukları ve özel karakterleri kaldır
    const cleanFileName = imageUpload.name
      .replace(/\s+/g, '-')  // Boşlukları tire ile değiştir
      .replace(/[^a-zA-Z0-9.-]/g, '')  // Sadece harf, rakam, nokta ve tire bırak
      .toLowerCase()
    
    const fileName = `${Date.now()}-${cleanFileName}`
    const { data, error } = await supabase.storage
      .from("events")
      .upload(`images/${fileName}`, imageUpload)
  
    if (error) throw new Error("Resim yüklenemedi: " + error.message)
    
    const {
      data: { publicUrl },
    } = supabase.storage.from("events").getPublicUrl(data.path)
  
    imageFile = data.path
    imageUrl = publicUrl
  }

  const { error } = await supabase.from("events").insert({
    title,
    description: content || null,
    date,
    image_url: imageUrl,
    image_file: imageFile,
    link,
    created_by: user.id,
  })

  if (error) throw new Error("Etkinlik oluşturulamadı: " + error.message)

  revalidatePath("/admin/events")
  revalidatePath("/")
  redirect("/admin/events")
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    throw new Error("Yetkiniz yok")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const date = formData.get("date") as string
  const link = formData.get("link") as string | null

  // Mevcut etkinliği getir
  const { data: existingEvent } = await supabase
    .from("events")
    .select("image_file, image_url")
    .eq("id", id)
    .single()

  let imageUrl = formData.get("imageUrl") as string | null
  let imageFile = existingEvent?.image_file

  // Yeni resim dosyası varsa yükle ve eskisini sil
  // Yeni resim dosyası varsa yükle ve eskisini sil
  const imageUpload = formData.get("imageFile") as File | null
  if (imageUpload && imageUpload.size > 0) {
    // Eski resmi sil
    if (existingEvent?.image_file) {
      await supabase.storage.from("events").remove([existingEvent.image_file])
    }
  
    // Dosya adını temizle
    const cleanFileName = imageUpload.name
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '')
      .toLowerCase()
  
    // Yeni resmi yükle
    const fileName = `${Date.now()}-${cleanFileName}`
    const { data, error } = await supabase.storage
      .from("events")
      .upload(`images/${fileName}`, imageUpload)
  
    if (error) throw new Error("Resim yüklenemedi: " + error.message)
    
    const {
      data: { publicUrl },
    } = supabase.storage.from("events").getPublicUrl(data.path)
  
    imageFile = data.path
    imageUrl = publicUrl
  }

  const { error } = await supabase
    .from("events")
    .update({
      title,
      description: content || null,
      date,
      image_url: imageUrl,
      image_file: imageFile,
      link,
    })
    .eq("id", id)

  if (error) throw new Error("Etkinlik güncellenemedi: " + error.message)

  revalidatePath("/admin/events")
  revalidatePath("/")
  redirect("/admin/events")
}

export async function deleteEvent(id: string) {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Oturum açmanız gerekli")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    throw new Error("Yetkiniz yok")
  }

  // Etkinliği getir (dosyaları silmek için)
  const { data: event } = await supabase
    .from("events")
    .select("image_file")
    .eq("id", id)
    .single()

  // Dosyaları sil
  if (event?.image_file) {
    await supabase.storage.from("events").remove([event.image_file])
  }

  // Etkinliği sil
  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) throw new Error("Etkinlik silinemedi: " + error.message)

  revalidatePath("/admin/events")
  revalidatePath("/")
}
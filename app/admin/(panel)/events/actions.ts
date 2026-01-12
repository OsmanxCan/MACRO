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
  const link = (formData.get("link") as string) || null

  let imageUrl: string | null = null
  let imageFile: string | null = null
  let videoUrl: string | null = null
  let videoFile: string | null = null

  // Resim dosyası yükleme
  const imageUpload = formData.get("imageFile") as File | null
  if (imageUpload && imageUpload.size > 0) {
    const fileExt = imageUpload.name.split('.').pop()
    const fileName = `img_${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from("events")
      .upload(fileName, imageUpload)

    if (error) throw new Error("Resim yüklenemedi: " + error.message)

    const { data: { publicUrl } } = supabase.storage
      .from("events")
      .getPublicUrl(data.path)

    imageFile = data.path
    imageUrl = publicUrl
  } else {
    const urlInput = formData.get("imageUrl") as string
    if (urlInput && urlInput.trim() !== '') {
      imageUrl = urlInput.trim()
    }
  }

  // Video dosyası yükleme
  const videoUpload = formData.get("videoFile") as File | null
  if (videoUpload && videoUpload.size > 0) {
    const fileExt = videoUpload.name.split('.').pop()
    const fileName = `vid_${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from("events")
      .upload(fileName, videoUpload)

    if (error) throw new Error("Video yüklenemedi: " + error.message)

    const { data: { publicUrl } } = supabase.storage
      .from("events")
      .getPublicUrl(data.path)

    videoFile = data.path
    videoUrl = publicUrl
  } else {
    const urlInput = formData.get("videoUrl") as string
    if (urlInput && urlInput.trim() !== '') {
      videoUrl = urlInput.trim()
    }
  }

  const { error } = await supabase.from("events").insert({
    title,
    description: content,
    date,
    image_url: imageUrl,
    image_file: imageFile,
    link,
    video_url: videoUrl,
    video_file: videoFile,
    created_by: user.id,
  })

  if (error) throw new Error("Etkinlik oluşturulamadı: " + error.message)

  revalidatePath("/admin/events")
  revalidatePath("/")
  
  // ✅ Success döndür, redirect form'da yapılacak
  return { success: true }
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
  const link = (formData.get("link") as string) || null

  const { data: existingEvent } = await supabase
    .from("events")
    .select("image_file, video_file, image_url, video_url")
    .eq("id", id)
    .single()

  let imageUrl: string | null = existingEvent?.image_url || null
  let imageFile: string | null = existingEvent?.image_file || null
  let videoUrl: string | null = existingEvent?.video_url || null
  let videoFile: string | null = existingEvent?.video_file || null

  // Resim işlemleri
  const imageUpload = formData.get("imageFile") as File | null
  if (imageUpload && imageUpload.size > 0) {
    if (existingEvent?.image_file) {
      await supabase.storage.from("events").remove([existingEvent.image_file])
    }

    const fileExt = imageUpload.name.split('.').pop()
    const fileName = `img_${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from("events")
      .upload(fileName, imageUpload)

    if (error) throw new Error("Resim yüklenemedi: " + error.message)

    const { data: { publicUrl } } = supabase.storage
      .from("events")
      .getPublicUrl(data.path)

    imageFile = data.path
    imageUrl = publicUrl
  } else {
    const urlInput = formData.get("imageUrl") as string
    if (urlInput && urlInput.trim() !== '') {
      if (existingEvent?.image_file) {
        await supabase.storage.from("events").remove([existingEvent.image_file])
      }
      imageUrl = urlInput.trim()
      imageFile = null
    } else {
      // Hiçbir şey girilmediyse resmi kaldır
      if (existingEvent?.image_file) {
        await supabase.storage.from("events").remove([existingEvent.image_file])
      }
      imageUrl = null
      imageFile = null
    }
  }

  // Video işlemleri
  const videoUpload = formData.get("videoFile") as File | null
  if (videoUpload && videoUpload.size > 0) {
    if (existingEvent?.video_file) {
      await supabase.storage.from("events").remove([existingEvent.video_file])
    }

    const fileExt = videoUpload.name.split('.').pop()
    const fileName = `vid_${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from("events")
      .upload(fileName, videoUpload)

    if (error) throw new Error("Video yüklenemedi: " + error.message)

    const { data: { publicUrl } } = supabase.storage
      .from("events")
      .getPublicUrl(data.path)

    videoFile = data.path
    videoUrl = publicUrl
  } else {
    const urlInput = formData.get("videoUrl") as string
    if (urlInput && urlInput.trim() !== '') {
      if (existingEvent?.video_file) {
        await supabase.storage.from("events").remove([existingEvent.video_file])
      }
      videoUrl = urlInput.trim()
      videoFile = null
    } else {
      // Hiçbir şey girilmediyse videoyu kaldır
      if (existingEvent?.video_file) {
        await supabase.storage.from("events").remove([existingEvent.video_file])
      }
      videoUrl = null
      videoFile = null
    }
  }

  const { error } = await supabase
    .from("events")
    .update({
      title,
      description: content,
      date,
      image_url: imageUrl,
      image_file: imageFile,
      link,
      video_url: videoUrl,
      video_file: videoFile,
    })
    .eq("id", id)

  if (error) throw new Error("Etkinlik güncellenemedi: " + error.message)

  revalidatePath("/admin/events")
  revalidatePath("/")
  
  // ✅ Success döndür, redirect form'da yapılacak
  return { success: true }
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

  const { data: event } = await supabase
    .from("events")
    .select("image_file, video_file")
    .eq("id", id)
    .single()

  if (event?.image_file) {
    await supabase.storage.from("events").remove([event.image_file])
  }

  if (event?.video_file) {
    await supabase.storage.from("events").remove([event.video_file])
  }

  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) throw new Error("Etkinlik silinemedi: " + error.message)

  revalidatePath("/admin/events")
  revalidatePath("/")
}
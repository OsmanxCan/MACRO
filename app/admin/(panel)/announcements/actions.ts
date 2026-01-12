"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createAnnouncement(formData: FormData) {
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
      .from("announcements")
      .upload(fileName, imageUpload)

    if (error) {
      console.error("Resim yükleme hatası:", error)
      throw new Error("Resim yüklenemedi: " + error.message)
    }

    const { data: { publicUrl } } = supabase.storage
      .from("announcements")
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
      .from("announcements")
      .upload(fileName, videoUpload)

    if (error) {
      console.error("Video yükleme hatası:", error)
      throw new Error("Video yüklenemedi: " + error.message)
    }

    const { data: { publicUrl } } = supabase.storage
      .from("announcements")
      .getPublicUrl(data.path)

    videoFile = data.path
    videoUrl = publicUrl
  } else {
    const urlInput = formData.get("videoUrl") as string
    if (urlInput && urlInput.trim() !== '') {
      videoUrl = urlInput.trim()
    }
  }

  const { error } = await supabase.from("announcements").insert({
    title,
    content,
    image_url: imageUrl,
    image_file: imageFile,
    link,
    video_url: videoUrl,
    video_file: videoFile,
    created_by: user.id,
  })

  if (error) {
    console.error("Veritabanı hatası:", error)
    throw new Error("Duyuru oluşturulamadı: " + error.message)
  }

  revalidatePath("/admin/announcements")
  redirect("/admin/announcements")
}

export async function updateAnnouncement(formData: FormData) {
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

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const link = (formData.get("link") as string) || null

  const { data: existingAnnouncement } = await supabase
    .from("announcements")
    .select("image_file, video_file, image_url, video_url")
    .eq("id", id)
    .single()

  let imageUrl: string | null = existingAnnouncement?.image_url || null
  let imageFile: string | null = existingAnnouncement?.image_file || null
  let videoUrl: string | null = existingAnnouncement?.video_url || null
  let videoFile: string | null = existingAnnouncement?.video_file || null

  const imageUpload = formData.get("imageFile") as File | null
  if (imageUpload && imageUpload.size > 0) {
    // Eski dosyayı sil
    if (existingAnnouncement?.image_file) {
      await supabase.storage.from("announcements").remove([existingAnnouncement.image_file])
    }

    const fileExt = imageUpload.name.split('.').pop()
    const fileName = `img_${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from("announcements")
      .upload(fileName, imageUpload)

    if (error) throw new Error("Resim yüklenemedi: " + error.message)

    const { data: { publicUrl } } = supabase.storage
      .from("announcements")
      .getPublicUrl(data.path)

    imageFile = data.path
    imageUrl = publicUrl
  } else {
    const urlInput = formData.get("imageUrl") as string
    if (urlInput && urlInput.trim() !== '') {
      // URL girildiyse, eski dosyayı sil
      if (existingAnnouncement?.image_file) {
        await supabase.storage.from("announcements").remove([existingAnnouncement.image_file])
      }
      imageUrl = urlInput.trim()
      imageFile = null
    } else {
      // Hiçbir şey girilmediyse, resmi tamamen kaldır
      if (existingAnnouncement?.image_file) {
        await supabase.storage.from("announcements").remove([existingAnnouncement.image_file])
      }
      imageUrl = null
      imageFile = null
    }
  }

  const videoUpload = formData.get("videoFile") as File | null
  if (videoUpload && videoUpload.size > 0) {
    if (existingAnnouncement?.video_file) {
      await supabase.storage.from("announcements").remove([existingAnnouncement.video_file])
    }

    const fileExt = videoUpload.name.split('.').pop()
    const fileName = `vid_${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from("announcements")
      .upload(fileName, videoUpload)

    if (error) throw new Error("Video yüklenemedi: " + error.message)

    const { data: { publicUrl } } = supabase.storage
      .from("announcements")
      .getPublicUrl(data.path)

    videoFile = data.path
    videoUrl = publicUrl
  } else {
    const urlInput = formData.get("videoUrl") as string
    if (urlInput && urlInput.trim() !== '') {
      if (existingAnnouncement?.video_file) {
        await supabase.storage.from("announcements").remove([existingAnnouncement.video_file])
      }
      videoUrl = urlInput.trim()
      videoFile = null
    } else {
      if (existingAnnouncement?.video_file) {
        await supabase.storage.from("announcements").remove([existingAnnouncement.video_file])
      }
      videoUrl = null
      videoFile = null
    }
  }

  const { error } = await supabase
    .from("announcements")
    .update({
      title,
      content,
      image_url: imageUrl,
      image_file: imageFile,
      link,
      video_url: videoUrl,
      video_file: videoFile,
    })
    .eq("id", id)

  if (error) {
    console.error("Veritabanı hatası:", error)
    throw new Error("Duyuru güncellenemedi: " + error.message)
  }

  revalidatePath("/admin/announcements")
}

export async function deleteAnnouncement(id: string) {
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

  const { data: announcement } = await supabase
    .from("announcements")
    .select("image_file, video_file")
    .eq("id", id)
    .single()

  if (announcement?.image_file) {
    await supabase.storage.from("announcements").remove([announcement.image_file])
  }

  if (announcement?.video_file) {
    await supabase.storage.from("announcements").remove([announcement.video_file])
  }

  const { error } = await supabase.from("announcements").delete().eq("id", id)

  if (error) {
    console.error("Silme hatası:", error)
    throw new Error("Duyuru silinemedi: " + error.message)
  }

  revalidatePath("/admin/announcements")
}
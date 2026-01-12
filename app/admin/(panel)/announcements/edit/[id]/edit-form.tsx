"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateAnnouncement } from "../../actions"
import { ArrowLeft, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import RichTextEditor from "@/components/admin/RichTextEditor"

type Announcement = {
  id: string
  title: string
  content: string
  image_url: string | null
  video_url: string | null
  link: string | null
}

export default function EditAnnouncementForm({
  announcement,
}: {
  announcement: Announcement
}) {
  const router = useRouter()

  const [content, setContent] = useState(announcement.content)
  const [imageType, setImageType] = useState<"url" | "upload">("url")
  const [videoType, setVideoType] = useState<"url" | "upload">("url")

  const [imageUrl, setImageUrl] = useState(announcement.image_url || "")
  const [videoUrl, setVideoUrl] = useState(announcement.video_url || "")

  const [imagePreview, setImagePreview] = useState("")
  const [videoPreview, setVideoPreview] = useState("")
  const [loading, setLoading] = useState(false)

  /* ---------- Helpers ---------- */

  const getVideoEmbedUrl = (url: string) => {
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`

    const vimeo = url.match(/vimeo\.com\/(\d+)/)
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`

    return url
  }

  const isVideoEmbeddable = (url: string) =>
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("vimeo.com")

  const clearImage = () => {
    setImagePreview("")
    setImageUrl("")
  }

  const clearVideo = () => {
    setVideoPreview("")
    setVideoUrl("")
  }

  /* ---------- File Handlers ---------- */

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setVideoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  /* ---------- Submit ---------- */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.set("id", announcement.id)
      formData.set("content", content)

      if (imageType === "url") {
        formData.delete("imageFile")
        // URL boşsa, backend'e boş string gönder
        if (!imageUrl.trim()) {
          formData.set("imageUrl", "")
        }
      } else {
        formData.delete("imageUrl")
        // Dosya seçilmediyse, boş file gönderme
        const file = formData.get("imageFile") as File
        if (!file || file.size === 0) {
          formData.delete("imageFile")
        }
      }
      
      if (videoType === "url") {
        formData.delete("videoFile")
        if (!videoUrl.trim()) {
          formData.set("videoUrl", "")
        }
      } else {
        formData.delete("videoUrl")
        const file = formData.get("videoFile") as File
        if (!file || file.size === 0) {
          formData.delete("videoFile")
        }
      }

      await updateAnnouncement(formData)
      router.push("/admin/announcements")
    } catch (err: any) {
      console.error(err)
      alert("Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  /* ---------- UI ---------- */

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/announcements">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Duyuruyu Düzenle</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Başlık */}
            <div className="space-y-2">
              <Label>Başlık *</Label>
              <Input name="title" defaultValue={announcement.title} required />
            </div>

            {/* İçerik */}
            <div className="space-y-2">
              <Label>İçerik *</Label>
              <RichTextEditor content={content} onChange={setContent} />
            </div>

            {/* Resim */}
            <div className="space-y-2">
              <Label>Resim</Label>

              <Tabs value={imageType} onValueChange={(v) => {
                setImageType(v as any)
                clearImage()
              }}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="upload">Yükle</TabsTrigger>
                </TabsList>

                <TabsContent value="url">
                  <Input
                    name="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  {imageUrl && (
                    <div className="relative mt-2">
                      <img src={imageUrl} className="h-64 w-full object-cover rounded-lg" />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={clearImage}
                      >
                        <X />
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="upload">
                  <Input type="file" name="imageFile" accept="image/*" onChange={handleImageFileChange} />
                  {imagePreview && (
                    <img src={imagePreview} className="h-64 w-full object-cover rounded-lg mt-2" />
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Video */}
            <div className="space-y-2">
              <Label>Video</Label>

              <Tabs value={videoType} onValueChange={(v) => {
                setVideoType(v as any)
                clearVideo()
              }}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="upload">Yükle</TabsTrigger>
                </TabsList>

                <TabsContent value="url">
                  <Input
                    name="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                  {videoUrl && (
                    <div className="relative mt-2">
                      {isVideoEmbeddable(videoUrl) ? (
                        <iframe src={getVideoEmbedUrl(videoUrl)} className="w-full h-64 rounded-lg" />
                      ) : (
                        <video src={videoUrl} controls className="w-full h-64 rounded-lg" />
                      )}
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={clearVideo}
                      >
                        <X />
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="upload">
                  <Input type="file" name="videoFile" accept="video/*" onChange={handleVideoFileChange} />
                  {videoPreview && (
                    <video src={videoPreview} controls className="w-full h-64 rounded-lg mt-2" />
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Link */}
            <div className="space-y-2">
              <Label>Bağlantı</Label>
              <Input name="link" defaultValue={announcement.link || ""} />
            </div>

            <div className="flex gap-4">
              <Link href="/admin/announcements" className="flex-1">
                <Button variant="outline" className="w-full">İptal</Button>
              </Link>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Güncelleniyor..." : "Güncelle"}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}

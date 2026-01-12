"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, X } from "lucide-react"
import Link from "next/link"
import RichTextEditor from "@/components/admin/RichTextEditor"
import { createEvent } from "../actions"

export default function CreateEventPage() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [imageType, setImageType] = useState<"url" | "upload">("url")
  const [videoType, setVideoType] = useState<"url" | "upload">("url")
  const [imagePreview, setImagePreview] = useState("")
  const [videoPreview, setVideoPreview] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setVideoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const clearImagePreview = () => {
    setImagePreview("")
    setImageUrl("")
  }

  const clearVideoPreview = () => {
    setVideoPreview("")
    setVideoUrl("")
  }

  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }
    
    // Direkt video URL ise olduğu gibi döndür
    return url
  }

  const isVideoEmbeddable = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.set("content", content)
      
      // Eğer URL seçiliyse, dosya alanını temizle
      if (imageType === "url") {
        formData.delete("imageFile")
      } else {
        formData.delete("imageUrl")
      }
      
      if (videoType === "url") {
        formData.delete("videoFile")
      } else {
        formData.delete("videoUrl")
      }
      
      await createEvent(formData)
      // Redirect server action'da yapılıyor, bu satırlar çalışmayacak
    } catch (error: any) {
      console.error(error)
      // NEXT_REDIRECT hatası başarılı demektir, gösterme
      if (!error?.message?.includes('NEXT_REDIRECT')) {
        alert("Hata oluştu: " + error?.message || error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Yeni Etkinlik Oluştur</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Başlık */}
            <div className="space-y-2">
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Etkinlik başlığı"
                required
              />
            </div>

            {/* İçerik - Rich Text Editor */}
            <div className="space-y-2">
              <Label>İçerik *</Label>
              <RichTextEditor content={content} onChange={setContent} />
            </div>

            {/* Tarih */}
            <div className="space-y-2">
              <Label htmlFor="date">Tarih *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {/* Resim */}
            <div className="space-y-2">
              <Label>Resim</Label>
              <Tabs value={imageType} onValueChange={(v) => {
                setImageType(v as any)
                clearImagePreview()
              }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="upload">Yükle</TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="space-y-2">
                  <Input
                    name="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  {imageUrl && (
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                        onError={() => alert("Resim yüklenemedi. URL'yi kontrol edin.")}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={clearImagePreview}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="upload" className="space-y-2">
                  <Input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleImageFileChange}
                  />
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={clearImagePreview}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Video */}
            <div className="space-y-2">
              <Label>Video (Opsiyonel)</Label>
              <Tabs value={videoType} onValueChange={(v) => {
                setVideoType(v as any)
                clearVideoPreview()
              }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="upload">Yükle</TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="space-y-2">
                  <Input
                    name="videoUrl"
                    placeholder="https://youtube.com/watch?v=... veya https://example.com/video.mp4"
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                  {videoUrl && (
                    <div className="relative">
                      {isVideoEmbeddable(videoUrl) ? (
                        <iframe
                          src={getVideoEmbedUrl(videoUrl)}
                          className="w-full h-64 rounded-lg"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={videoUrl}
                          controls
                          className="w-full h-64 rounded-lg"
                          onError={() => alert("Video yüklenemedi. URL'yi kontrol edin.")}
                        />
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={clearVideoPreview}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="upload" className="space-y-2">
                  <Input
                    type="file"
                    name="videoFile"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                  />
                  {videoPreview && (
                    <div className="relative">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-64 rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={clearVideoPreview}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Link */}
            <div className="space-y-2">
              <Label htmlFor="link">Bağlantı (Opsiyonel)</Label>
              <Input
                id="link"
                name="link"
                placeholder="https://example.com"
                type="url"
              />
            </div>

            <div className="flex gap-4">
              <Link href="/admin/events" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  İptal
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Oluşturuluyor..." : "Oluştur"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
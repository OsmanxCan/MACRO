import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Link as LinkIcon, X } from "lucide-react"

export default function AnnouncementForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [link, setLink] = useState("")
  
  // Resim
  const [imageType, setImageType] = useState<"url" | "upload">("url")
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  
  // Video
  const [videoType, setVideoType] = useState<"url" | "upload">("url")
  const [videoUrl, setVideoUrl] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState("")
  
  const [loading, setLoading] = useState(false)

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setVideoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview("")
    setImageUrl("")
  }

  const clearVideo = () => {
    setVideoFile(null)
    setVideoPreview("")
    setVideoUrl("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      if (link) formData.append("link", link)

      // Resim
      if (imageType === "url" && imageUrl) {
        formData.append("imageUrl", imageUrl)
      } else if (imageType === "upload" && imageFile) {
        formData.append("imageFile", imageFile)
      }

      // Video
      if (videoType === "url" && videoUrl) {
        formData.append("videoUrl", videoUrl)
      } else if (videoType === "upload" && videoFile) {
        formData.append("videoFile", videoFile)
      }

      const response = await fetch("/api/announcements", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Duyuru oluşturulamadı")

      // Reset form
      setTitle("")
      setContent("")
      setLink("")
      clearImage()
      clearVideo()
      
      alert("Duyuru başarıyla oluşturuldu!")
    } catch (error) {
      console.error(error)
      alert("Hata oluştu!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Yeni Duyuru Oluştur</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Başlık */}
          <div className="space-y-2">
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Duyuru başlığı"
              required
            />
          </div>

          {/* İçerik */}
          <div className="space-y-2">
            <Label htmlFor="content">İçerik *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Duyuru içeriği..."
              rows={6}
              required
            />
          </div>

          {/* Resim */}
          <div className="space-y-2">
            <Label>Resim</Label>
            <Tabs value={imageType} onValueChange={(v) => setImageType(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="w-4 h-4 mr-2" />
                  Yükle
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
                {imageUrl && (
                  <div className="relative">
                    <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover rounded" />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={clearImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upload" className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded" />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={clearImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Video (Opsiyonel) */}
          <div className="space-y-2">
            <Label>Video (Opsiyonel)</Label>
            <Tabs value={videoType} onValueChange={(v) => setVideoType(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="w-4 h-4 mr-2" />
                  Yükle
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-2">
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  type="url"
                />
              </TabsContent>

              <TabsContent value="upload" className="space-y-2">
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                />
                {videoPreview && (
                  <div className="relative">
                    <video src={videoPreview} controls className="w-full h-48 rounded" />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={clearVideo}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Link (Opsiyonel) */}
          <div className="space-y-2">
            <Label htmlFor="link">Bağlantı (Opsiyonel)</Label>
            <Input
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              type="url"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Oluşturuluyor..." : "Duyuru Oluştur"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
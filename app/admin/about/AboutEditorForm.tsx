"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Eye, EyeOff, Loader2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import RichTextEditor from "@/components/admin/RichTextEditor"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AboutEditorFormProps {
  initialData: {
    id: number
    title: string
    content: string
    updated_at: string
    updated_by: string | null
  } | null
  userId: string
  userRole: string
}

export default function AboutEditorForm({ initialData, userId, userRole }: AboutEditorFormProps) {
  const router = useRouter()

  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      if (!title.trim()) {
        setError("Başlık boş olamaz")
        setLoading(false)
        return
      }

      if (!content.trim()) {
        setError("İçerik boş olamaz")
        setLoading(false)
        return
      }

      const updateData = {
        title: title.trim(),
        content: content.trim(),
        updated_at: new Date().toISOString(),
        updated_by: userId
      }

      if (initialData?.id) {
        // Güncelleme
        const { error: updateError } = await supabase
          .from("about")
          .update(updateData)
          .eq("id", initialData.id)

        if (updateError) throw updateError
      } else {
        // Yeni kayıt (eğer hiç yoksa)
        const { error: insertError } = await supabase
          .from("about")
          .insert([updateData])

        if (insertError) throw insertError
      }

      setSuccess(true)
      router.refresh()

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("Kaydetme hatası:", err)
      setError(err instanceof Error ? err.message : "Kaydetme sırasında hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200 font-medium flex items-center gap-2">
            <span className="text-xl">✓</span>
            Değişiklikler başarıyla kaydedildi!
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 font-medium flex items-center gap-2">
            <span className="text-xl">✗</span>
            {error}
          </p>
        </div>
      )}

      {/* Preview Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold">{userRole === "super_admin" ? "Süper Admin" : "Yönetiçi"}</span> olarak düzenliyorsunuz
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setPreview(!preview)}
        >
          {preview ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Düzenlemeye Dön
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Önizleme
            </>
          )}
        </Button>
      </div>

      {preview ? (
        /* Preview Mode */
        <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Önizleme
              </span>
            </div>
            {title && (
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {title}
              </h2>
            )}
            {content ? (
              <div 
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                İçerik henüz eklenmemiş
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Başlık
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: MACRO Topluluğu Hakkında"
              className="text-lg h-12"
            />
          </div>

          {/* Content RichText Editor */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-base font-semibold">
              İçerik
            </Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Toplam {content.replace(/<[^>]*>/g, '').length} karakter (HTML hariç)
            </p>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {initialData && (
                <span>
                  Son güncelleme: {new Date(initialData.updated_at).toLocaleString('tr-TR')}
                </span>
              )}
            </div>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              size="lg"
              className="min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Değişiklikleri Kaydet
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
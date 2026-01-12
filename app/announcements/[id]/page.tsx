// app/announcements/[id]/page.tsx
import { getAnnouncementById } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Navbar from '@/components/navbar'

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const announcement = await getAnnouncementById(id)

  if (!announcement) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Geri Dön Butonu */}
        <Link 
          href="/announcements"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Duyurulara Geri Dön
        </Link>

        <article className="bg-card rounded-lg shadow-lg overflow-hidden border">
          {/* Görsel (Üstte) */}
          {announcement.image_url && (
            <div className="relative w-full h-96">
              <img
                src={announcement.image_url}
                alt={announcement.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* İçerik */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {announcement.title}
            </h1>
            
            <div className="flex items-center text-muted-foreground text-sm mb-6 pb-6 border-b">
              <span>
                📅 {new Date(announcement.created_at).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            <div 
              className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(announcement.content) }}
            />

            {/* Video (Altta) */}
            {announcement.video_url && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Video</h2>
                <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={announcement.video_url.includes('youtube.com') || announcement.video_url.includes('youtu.be') 
                      ? announcement.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
                      : announcement.video_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Link varsa */}
            {announcement.link && (
              <div className="mt-6 pt-6 border-t">
                <a
                  href={announcement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Daha Fazla Bilgi
                </a>
              </div>
            )}
          </div>
        </article>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 MACRO Topluluğu. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
// app/announcements/page.tsx
import { getAnnouncements } from '@/lib/supabase/queries'
import { Announcement } from '@/types'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import Navbar from '@/components/navbar'

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Tüm Duyurular
          </h1>
          <p className="text-muted-foreground">Topluluğumuzdan güncel haberler ve duyurular</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {announcements.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-muted-foreground text-lg">Henüz duyuru bulunmuyor.</p>
            </div>
          ) : (
            announcements.map((announcement: Announcement) => (
              <Link
                key={announcement.id}
                href={`/announcements/${announcement.id}`}
                className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02] border"
              >
                {announcement.image_url && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={announcement.image_url}
                      alt={announcement.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-foreground line-clamp-2">
                    {announcement.title}
                  </h2>
                  <div 
                    className="prose prose-sm prose-slate dark:prose-invert max-w-none mb-4 line-clamp-3 text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(announcement.content) }}
                  />
                  <p className="text-sm text-muted-foreground">
                    {new Date(announcement.created_at).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
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
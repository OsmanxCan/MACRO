// app/events/page.tsx
import { getEvents } from '@/lib/supabase/queries'
import { Event } from '@/types'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import { Calendar } from 'lucide-react'
import Navbar from '@/components/navbar'

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Tüm Etkinlikler
          </h1>
          <p className="text-muted-foreground">Topluluğumuzun düzenlediği etkinlikler ve programlar</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-muted-foreground text-lg">Henüz etkinlik bulunmuyor.</p>
            </div>
          ) : (
            events.map((event: Event) => {
              const eventDate = new Date(event.date)
              const isUpcoming = eventDate > new Date()
              
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02] border"
                >
                  {event.image_url && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isUpcoming 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-500 text-white'
                        }`}>
                          {isUpcoming ? 'Yaklaşan' : 'Geçmiş'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2 text-foreground line-clamp-2">
                      {event.title}
                    </h2>
                    {event.description && (
                      <div 
                        className="prose prose-sm prose-slate dark:prose-invert max-w-none mb-4 line-clamp-3 text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }}
                      />
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {eventDate.toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })
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
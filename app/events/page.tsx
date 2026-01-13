// app/events/page.tsx (Server Component - "use client" YOK!)

import { getEvents } from '@/lib/supabase/queries'
import Navbar from '@/components/navbar'
import EventsList from './events-list'

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
          <p className="text-muted-foreground">
            Topluluğumuzun düzenlediği etkinlikler ve programlar
          </p>
        </div>
        
        <EventsList events={events} />
      </div>

      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 MACRO Topluluğu. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
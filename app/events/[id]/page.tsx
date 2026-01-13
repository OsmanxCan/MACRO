// app/events/[id]/page.tsx (Server Component)

import { getEventById } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import Navbar from '@/components/navbar'
import EventDetail from './event-detail'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <EventDetail event={event} />
      </div>

      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 MACRO Topluluğu. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
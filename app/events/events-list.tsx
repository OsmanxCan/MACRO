// app/events/events-list.tsx
"use client"

import { Event } from '@/types'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { useSanitize } from '@/lib/hooks/useSanitize'

function EventCard({ event }: { event: Event }) {
  const sanitizedDescription = useSanitize(event.description || '')
  const eventDate = new Date(event.date)
  const isUpcoming = eventDate > new Date()

  return (
    <Link
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
        {sanitizedDescription && (
          <div 
            className="prose prose-sm prose-slate dark:prose-invert max-w-none mb-4 line-clamp-3 text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
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
}

interface EventsListProps {
  events: Event[]
}

export default function EventsList({ events }: EventsListProps) {
  if (events.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <p className="text-muted-foreground text-lg">Henüz etkinlik bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
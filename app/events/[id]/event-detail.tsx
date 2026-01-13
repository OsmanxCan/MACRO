// (Client Component)

"use client"

import { Event } from '@/types'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import { ArrowLeft, ExternalLink } from 'lucide-react'

interface EventDetailProps {
  event: Event
}

export default function EventDetail({ event }: EventDetailProps) {
  const eventDate = new Date(event.date)
  const isUpcoming = eventDate > new Date()

  return (
    <>
      <Link 
        href="/events"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Etkinliklere Geri Dön
      </Link>

      <article className="bg-card rounded-lg shadow-lg overflow-hidden border">
        {event.image_url && (
          <div className="relative w-full h-96">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                isUpcoming 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}>
                {isUpcoming ? '📅 Yaklaşan' : '✓ Geçmiş'}
              </span>
            </div>
          </div>
        )}

        <div className="p-8">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            {event.title}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-6 bg-muted/50 rounded-lg border">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Tarih ve Saat</p>
                <p className="text-lg font-semibold text-foreground">
                  {eventDate.toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-muted-foreground">
                  {eventDate.toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Durum</p>
                <p className="text-lg font-semibold text-foreground">
                  {isUpcoming ? 'Yaklaşan Etkinlik' : 'Tamamlanmış Etkinlik'}
                </p>
              </div>
            </div>
          </div>
          
          {event.description && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Etkinlik Detayları</h2>
              <div 
                className="prose prose-lg prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }}
              />
            </div>
          )}

          {event.video_url && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Video</h2>
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={event.video_url.includes('youtube.com') || event.video_url.includes('youtu.be') 
                    ? event.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
                    : event.video_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {event.link && (
            <div className="mt-6 pt-6 border-t">
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
              >
                <ExternalLink className="w-5 h-5" />
                Etkinlik Linki
              </a>
            </div>
          )}
        </div>
      </article>
    </>
  )
}

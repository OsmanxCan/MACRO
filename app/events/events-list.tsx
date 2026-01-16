// app/events/events-list.tsx
"use client"

import { Event } from '@/types'
import Link from 'next/link'
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react'
import { useSanitize } from '@/lib/hooks/useSanitize'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function EventCard({ event, index }: { event: Event; index: number }) {
  const sanitizedDescription = useSanitize(event.description || '')
  const eventDate = new Date(event.date)
  const isUpcoming = eventDate > new Date()
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 60,
        scale: 0.9,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out'
      })
    }
  }, [index])

  return (
    <div ref={cardRef}>
      <Link
        href={event.link || `/events/${event.id}`}
        target={event.link ? "_blank" : "_self"}
        rel={event.link ? "noopener noreferrer" : ""}
        className="group block h-full"
      >
        <div className="relative h-full rounded-3xl bg-card/50 backdrop-blur-sm border border-border hover:border-pink-500/50 overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl">
          {/* Gradient overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Image */}
          {event.image_url && (
            <div className="relative w-full h-56 overflow-hidden">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Status badge */}
              <div className="absolute top-4 right-4">
                <div className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm border ${
                  isUpcoming 
                    ? 'bg-green-500/90 border-green-400/50 text-white' 
                    : 'bg-gray-500/90 border-gray-400/50 text-white'
                }`}>
                  {isUpcoming ? '📅 Yaklaşan' : '✓ Tamamlandı'}
                </div>
              </div>

              {/* Date badge on image */}
              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-semibold">
                  {eventDate.toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="relative p-8">
            {/* If no image, show date and status at top */}
            {!event.image_url && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-pink-500" />
                  <span className="font-semibold">
                    {eventDate.toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isUpcoming 
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                    : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                }`}>
                  {isUpcoming ? 'Yaklaşan' : 'Geçmiş'}
                </span>
              </div>
            )}

            {/* Icon */}
            <div className={`w-12 h-12 mb-4 rounded-2xl bg-gradient-to-br ${
              isUpcoming ? 'from-pink-500 to-red-500' : 'from-gray-500 to-gray-600'
            } flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
              <Calendar className="w-6 h-6 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-foreground line-clamp-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
              {event.title}
            </h2>

            {/* Description preview */}
            {sanitizedDescription && (
              <div 
                className="prose prose-sm prose-slate dark:prose-invert max-w-none mb-6 line-clamp-3 text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            )}

            {/* Time */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Clock className="w-4 h-4 text-pink-500" />
              <span className="font-medium">
                {eventDate.toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            {/* Read more link */}
            <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-semibold group-hover:gap-4 transition-all">
              <span>Detayları Gör</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>

          {/* Bottom gradient accent */}
          <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${
            isUpcoming ? 'from-pink-500 to-red-500' : 'from-gray-500 to-gray-600'
          } rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
        </div>
      </Link>
    </div>
  )
}

interface EventsListProps {
  events: Event[]
}

export default function EventsList({ events }: EventsListProps) {
  const emptyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (emptyRef.current && events.length === 0) {
      gsap.from(emptyRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      })
    }
  }, [events.length])

  if (events.length === 0) {
    return (
      <div ref={emptyRef} className="max-w-2xl mx-auto">
        <div className="relative p-16 rounded-3xl bg-card/50 backdrop-blur-sm border border-border text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-red-500/5" />
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-pink-500/20 to-red-500/20 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-pink-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Henüz Etkinlik Yok</h3>
            <p className="text-muted-foreground text-lg mb-8">
              Yeni etkinlikler eklendiğinde burada görünecek.
            </p>
            <a 
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-red-600 text-white font-semibold rounded-full hover:scale-105 hover:shadow-lg transition-all"
            >
              <span>Ana Sayfaya Dön</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <EventCard 
          key={event.id} 
          event={event}
          index={index}
        />
      ))}
    </div>
  )
}
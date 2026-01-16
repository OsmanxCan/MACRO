// app/announcements/announcements-list.tsx (Client Component)
"use client"

import { Announcement } from '@/types'
import Link from 'next/link'
import { useSanitize } from '@/lib/hooks/useSanitize'
import { Calendar, ExternalLink, Megaphone, ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function AnnouncementCard({ announcement, index }: { announcement: Announcement; index: number }) {
  const sanitizedContent = useSanitize(announcement.content)
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
        href={`/announcements/${announcement.id}`}
        className="group block h-full"
      >
        <div className="relative h-full rounded-3xl bg-card/50 backdrop-blur-sm border border-border hover:border-purple-500/50 overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl">
          {/* Gradient overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Image */}
          {announcement.image_url && (
            <div className="relative w-full h-56 overflow-hidden">
              <img
                src={announcement.image_url}
                alt={announcement.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Date badge on image */}
              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-semibold">
                  {new Date(announcement.created_at).toLocaleDateString('tr-TR', {
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
            {/* If no image, show date at top */}
            {!announcement.image_url && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span className="font-semibold">
                  {new Date(announcement.created_at).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}

            {/* Icon */}
            <div className="w-12 h-12 mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Megaphone className="w-6 h-6 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-foreground line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {announcement.title}
            </h2>

            {/* Content preview */}
            {sanitizedContent && (
              <div 
                className="prose prose-sm prose-slate dark:prose-invert max-w-none mb-6 line-clamp-3 text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            )}

            {/* Read more link */}
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold group-hover:gap-4 transition-all">
              <span>Devamını Oku</span>
              {announcement.link ? (
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              ) : (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              )}
            </div>
          </div>

          {/* Bottom gradient accent */}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
        </div>
      </Link>
    </div>
  )
}

interface AnnouncementsListProps {
  announcements: Announcement[]
}

export default function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  const emptyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (emptyRef.current && announcements.length === 0) {
      gsap.from(emptyRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      })
    }
  }, [announcements.length])

  if (announcements.length === 0) {
    return (
      <div ref={emptyRef} className="max-w-2xl mx-auto">
        <div className="relative p-16 rounded-3xl bg-card/50 backdrop-blur-sm border border-border text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Megaphone className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Henüz Duyuru Yok</h3>
            <p className="text-muted-foreground text-lg mb-8">
              Yeni duyurular eklendiğinde burada görünecek.
            </p>
            <a 
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:scale-105 hover:shadow-lg transition-all"
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
      {announcements.map((announcement, index) => (
        <AnnouncementCard 
          key={announcement.id} 
          announcement={announcement}
          index={index}
        />
      ))}
    </div>
  )
}
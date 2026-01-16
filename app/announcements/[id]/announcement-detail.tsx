// app/announcements/[id]/announcement-detail.tsx (Client Component)
"use client"

import { Announcement } from '@/types'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Calendar, Clock, Share2, Megaphone } from 'lucide-react'
import { useSanitize } from '@/lib/hooks/useSanitize'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface AnnouncementDetailProps {
  announcement: Announcement
}

export default function AnnouncementDetail({ announcement }: AnnouncementDetailProps) {
  const sanitizedContent = useSanitize(announcement.content)
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    // Check if Web Share API is available
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  useEffect(() => {
    // Entrance animations
    const ctx = gsap.context(() => {
      gsap.from('.detail-back-button', {
        opacity: 0,
        x: -30,
        duration: 0.6,
        ease: 'power3.out'
      })

      gsap.from('.detail-badge', {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        delay: 0.2,
        ease: 'back.out(1.7)'
      })

      gsap.from('.detail-title', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out'
      })

      gsap.from('.detail-meta', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      })

      if (imageRef.current) {
        gsap.from(imageRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 1,
          delay: 0.4,
          ease: 'power3.out'
        })
      }

      if (contentRef.current) {
        gsap.from(contentRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          delay: 0.6,
          ease: 'power3.out'
        })
      }
    })

    return () => ctx.revert()
  }, [])

  const handleShare = async () => {
    try {
      await navigator.share({
        title: announcement.title,
        url: window.location.href
      })
    } catch (err) {
      console.log('Share cancelled')
    }
  }

  const dateFormatted = new Date(announcement.created_at).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const timeFormatted = new Date(announcement.created_at).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link 
        href="/announcements"
        className="detail-back-button inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-purple-500/50 hover:bg-purple-500/10 transition-all group"
      >
        <ArrowLeft className="w-5 h-5 text-purple-500 group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">Tüm Duyurular</span>
      </Link>

      {/* Article Container */}
      <article className="relative rounded-3xl bg-card/50 backdrop-blur-sm border border-border overflow-hidden shadow-2xl">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />
        
        {/* Header Image */}
        {announcement.image_url && (
          <div ref={imageRef} className="relative w-full h-[500px] overflow-hidden">
            <img
              src={announcement.image_url}
              alt={announcement.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            
            {/* Floating badge on image */}
            <div className="absolute top-8 left-8 detail-badge">
              <div className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm flex items-center gap-3 shadow-lg">
                <Megaphone className="w-5 h-5 text-white" />
                <span className="text-sm font-bold text-white">DUYURU</span>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative p-8 md:p-12">
          {/* If no image, show badge at top */}
          {!announcement.image_url && (
            <div className="detail-badge mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <Megaphone className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  DUYURU
                </span>
              </div>
            </div>
          )}

          {/* Title */}
          <h1 className="detail-title text-2xl md:text-3xl lg:text-4xl font-black mb-8 leading-tight">
            <span className="">
              {announcement.title}
            </span>
          </h1>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-10 pb-8 border-b border-border">
            <div className="detail-meta flex items-center gap-3 px-5 py-3 rounded-full bg-muted/50">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-semibold">{dateFormatted}</span>
            </div>
            
            <div className="detail-meta flex items-center gap-3 px-5 py-3 rounded-full bg-muted/50">
              <Clock className="w-5 h-5 text-pink-500" />
              <span className="text-sm font-semibold">{timeFormatted}</span>
            </div>

            {canShare && (
              <button
                onClick={handleShare}
                className="detail-meta flex items-center gap-3 px-5 py-3 rounded-full bg-muted/50 hover:bg-primary/10 hover:scale-105 transition-all group"
              >
                <Share2 className="w-5 h-5 text-blue-500 group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-semibold">Paylaş</span>
              </button>
            )}
          </div>
          
          {/* Main Content */}
          {sanitizedContent && (
            <div 
              ref={contentRef}
              className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          )}

          {/* Video Section */}
          {announcement.video_url && (
            <div className="mb-12 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold">Video</h2>
              </div>
              
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border group">
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

          {/* External Link */}
          {announcement.link && (
            <div className="pt-8 border-t border-border">
              <a
                href={announcement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white text-lg font-bold rounded-full hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
              >
                <span>Detaylı Bilgi</span>
                <ExternalLink className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          )}

          {/* Bottom decorative gradient */}
          <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />
        </div>
      </article>

      {/* Related/Navigation */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <Link 
          href="/announcements"
          className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:gap-3 transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Diğer Duyurular</span>
        </Link>
        
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-semibold transition-colors"
        >
          <span>Ana Sayfa</span>
        </Link>
      </div>
    </div>
  )
}
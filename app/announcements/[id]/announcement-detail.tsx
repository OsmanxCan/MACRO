// (Client Component)
"use client"

import { Announcement } from '@/types'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useSanitize } from '@/lib/hooks/useSanitize'

interface AnnouncementDetailProps {
  announcement: Announcement
}

export default function AnnouncementDetail({ announcement }: AnnouncementDetailProps) {
  const sanitizedContent = useSanitize(announcement.content)

  return (
    <>
      <Link 
        href="/announcements"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Duyurulara Geri Dön
      </Link>

      <article className="bg-card rounded-lg shadow-lg overflow-hidden border">
        {announcement.image_url && (
          <div className="relative w-full h-96">
            <img
              src={announcement.image_url}
              alt={announcement.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

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
          
          {sanitizedContent && (
            <div 
              className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          )}

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
    </>
  )
}
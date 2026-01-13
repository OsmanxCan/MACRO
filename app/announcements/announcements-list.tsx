//(Client Component)

"use client"

import { Announcement } from '@/types'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'

interface AnnouncementsListProps {
  announcements: Announcement[]
}

export default function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  if (announcements.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <p className="text-muted-foreground text-lg">Henüz duyuru bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {announcements.map((announcement) => (
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
      ))}
    </div>
  )
}